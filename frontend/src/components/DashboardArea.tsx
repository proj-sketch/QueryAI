import React, { useState } from 'react';
import { DollarSign, Users, ShoppingCart, BarChart3, Sparkles, Send, Paperclip, ChevronDown, Zap, Shield, TrendingUp, Globe, FileSpreadsheet } from 'lucide-react';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import {
  RevenueLineChart,
  SalesBarChart,
  CategoryPieChart,
  UserGrowthAreaChart,
} from './SampleCharts';
import DynamicChart from './DynamicChart';
import { ChatMessage } from '@/app/page';

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$842K',
    trend: 12.5,
    trendLabel: 'vs last month',
    icon: <DollarSign size={20} />,
    iconColor: 'blue' as const,
    sparklineData: [
      { value: 30 }, { value: 45 }, { value: 42 }, { value: 55 },
      { value: 50 }, { value: 62 }, { value: 58 }, { value: 70 },
      { value: 68 }, { value: 75 }, { value: 80 }, { value: 85 },
    ],
  },
  {
    title: 'Active Users',
    value: '5,120',
    trend: 8.3,
    trendLabel: 'vs last month',
    icon: <Users size={20} />,
    iconColor: 'green' as const,
    sparklineData: [
      { value: 20 }, { value: 25 }, { value: 30 }, { value: 28 },
      { value: 35 }, { value: 40 }, { value: 38 }, { value: 45 },
      { value: 50 }, { value: 48 }, { value: 55 }, { value: 60 },
    ],
  },
  {
    title: 'Total Orders',
    value: '12,847',
    trend: -2.1,
    trendLabel: 'vs last week',
    icon: <ShoppingCart size={20} />,
    iconColor: 'purple' as const,
    sparklineData: [
      { value: 50 }, { value: 48 }, { value: 52 }, { value: 45 },
      { value: 47 }, { value: 43 }, { value: 46 }, { value: 40 },
      { value: 42 }, { value: 38 }, { value: 41 }, { value: 39 },
    ],
  },
  {
    title: 'Avg. Order Value',
    value: '$68.50',
    trend: 5.7,
    trendLabel: 'vs last quarter',
    icon: <BarChart3 size={20} />,
    iconColor: 'orange' as const,
    sparklineData: [
      { value: 40 }, { value: 42 }, { value: 45 }, { value: 44 },
      { value: 48 }, { value: 50 }, { value: 49 }, { value: 53 },
      { value: 55 }, { value: 54 }, { value: 58 }, { value: 62 },
    ],
  },
];

interface DashboardAreaProps {
  onUploadClick: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  uploadedDataset?: string | null;
}

const samplePrompts = [
  'Show monthly revenue for Q3 by region',
  'Compare top 5 products by sales volume',
  'Display customer acquisition cost trends',
  'Revenue breakdown by product category',
];

const benefits = [
  {
    icon: <Zap size={28} />,
    title: 'Instant Answers',
    desc: 'Get results in seconds, not hours. No waiting for analysts to build reports.',
    color: 'var(--accent-blue-light)',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
  {
    icon: <Shield size={28} />,
    title: 'Secure & Private',
    desc: 'Your data stays yours. Enterprise-grade security with end-to-end encryption.',
    color: 'var(--success)',
    bg: 'rgba(34, 197, 94, 0.1)',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Actionable Insights',
    desc: 'Go beyond raw numbers. AI highlights trends, anomalies, and opportunities.',
    color: 'var(--accent-purple)',
    bg: 'rgba(139, 92, 246, 0.1)',
  },
  {
    icon: <Globe size={28} />,
    title: 'Any Data Source',
    desc: 'CSV, Excel, PostgreSQL, MySQL, Snowflake — connect anything in seconds.',
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
];

export default function DashboardArea({ onUploadClick, messages, setMessages, uploadedDataset }: DashboardAreaProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: query.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    const sentQuery = query.trim();
    setQuery('');

    try {
      const res = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sentQuery }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, {
          role: 'ai',
          content: data.error,
          timestamp: new Date(),
          isError: true
        }]);
      } else if (data.response) {
        setMessages((prev) => [...prev, {
          role: 'ai',
          content: data.response,
          timestamp: new Date(),
          chartData: data.chart_data || null,
          chartType: data.chart_type || null,
          sqlQuery: data.sql_query || null
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'ai',
          content: 'No response received from AI.',
          timestamp: new Date(),
          isError: true
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: 'Cannot connect to backend. Make sure the Python server is running on port 8000.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (prompt: string) => {
    setQuery(prompt);
  };

  const handleAnalyzeDataset = async () => {
    if (!uploadedDataset || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: `Analyze dataset: ${uploadedDataset}`,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: uploadedDataset }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, {
          role: 'ai',
          content: data.error,
          timestamp: new Date(),
          isError: true
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'ai',
          content: data.review || 'Analysis complete.',
          timestamp: new Date(),
          kpis: data.kpis,
          charts: data.charts,
          suggestedQuestions: data.suggested_questions
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: 'Cannot connect to backend for analysis.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-view-container" style={messages.length > 0 ? { height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', position: 'relative' } : {}}>
      {messages.length === 0 ? (
        <>
      {/* ===== SECTION 1: Hero ===== */}
      <section className="dash-section hero-section text-center">
        <h1 className="hero-title">Query AI</h1>
        <p className="hero-subtitle">
          Your data, answered instantly.
        </p>

        <div className="chat-container mx-auto" style={{ maxWidth: 800 }}>
          {uploadedDataset && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue-light)', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <FileSpreadsheet size={16} />
                <span style={{ fontWeight: 500 }}>{uploadedDataset}</span>
              </div>
              <button 
                onClick={handleAnalyzeDataset}
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-purple)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', border: 'none', cursor: isLoading ? 'wait' : 'pointer', fontWeight: 500 }}
              >
                <Sparkles size={16} />
                Analyze Dataset
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="chat-input-wrapper" style={{ padding: '16px 20px', borderRadius: 'var(--radius-full)' }}>
              <div className="chat-input-icon">
                <Sparkles size={24} />
              </div>
              <input
                type="text"
                className="chat-input"
                style={{ fontSize: '18px', padding: '8px 0' }}
                placeholder="Ask QueryAI anything about your data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                className="chat-upload-btn"
                onClick={onUploadClick}
                title="Upload CSV"
              >
                <Paperclip size={20} />
              </button>
              <button type="submit" className="chat-send-btn flex-center" title="Send query" style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)' }}>
                <Send size={22} style={{ marginLeft: 2 }} />
              </button>
            </div>
          </form>

          <div className="prompt-chips" style={{ marginTop: '1.5rem' }}>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                className="prompt-chip"
                onClick={() => handleChipClick(prompt)}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="scroll-indicator text-center" style={{ marginTop: 60, opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="text-sm text-muted" style={{ marginBottom: 8 }}>Discover more below</p>
          <ChevronDown className="animate-bounce text-muted" />
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ===== SECTION 2: What is Query AI ===== */}
      <section className="dash-section what-section">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-heading">What is Query AI?</h2>
          <p className="section-desc" style={{ maxWidth: 700, margin: '0 auto' }}>
            Query AI is a conversational business intelligence platform that transforms the way you interact with data.
            Instead of writing complex SQL or waiting for reports, simply ask a question in plain English and receive
            instant, interactive visualizations and insights.
          </p>
        </div>

        <div className="what-cards">
          <div className="card what-card">
            <div className="what-card-number">01</div>
            <h3>Natural Language Queries</h3>
            <p className="text-muted">Type questions like &quot;What were our top-selling products last quarter?&quot; — no coding required.</p>
          </div>
          <div className="card what-card">
            <div className="what-card-number">02</div>
            <h3>Smart Visualizations</h3>
            <p className="text-muted">AI automatically picks the best chart type for your data — bar, line, pie, or table.</p>
          </div>
          <div className="card what-card">
            <div className="what-card-number">03</div>
            <h3>Real-Time Analysis</h3>
            <p className="text-muted">Connect live databases and get up-to-the-minute insights without manual refresh.</p>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ===== SECTION 3: How it Works ===== */}
      <section className="dash-section how-section">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-desc">Three simple steps to unlock your data&apos;s potential.</p>
        </div>

        <div className="how-steps">
          <div className="card how-step-card">
            <div className="how-step-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue-light)' }}>
              <Paperclip size={28} />
            </div>
            <h3>1. Connect Data</h3>
            <p className="text-muted">Upload a CSV or connect directly to your database in seconds.</p>
          </div>
          <div className="how-step-arrow">→</div>
          <div className="card how-step-card">
            <div className="how-step-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
              <Sparkles size={28} />
            </div>
            <h3>2. Ask Questions</h3>
            <p className="text-muted">Type your query in plain English. No SQL or coding required.</p>
          </div>
          <div className="how-step-arrow">→</div>
          <div className="card how-step-card">
            <div className="how-step-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
              <BarChart3 size={28} />
            </div>
            <h3>3. Get Insights</h3>
            <p className="text-muted">Instantly receive accurate answers and interactive visualizations.</p>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ===== SECTION 4: How It Helps ===== */}
      <section className="dash-section benefits-section">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-heading">How It Helps You</h2>
          <p className="section-desc">Turn complex data into clear, actionable business decisions.</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div key={i} className="card benefit-card">
              <div className="benefit-icon" style={{ background: b.bg, color: b.color }}>
                {b.icon}
              </div>
              <h3>{b.title}</h3>
              <p className="text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ===== SECTION 5: Example Dashboard Output ===== */}
      <section className="dash-section examples-section">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-heading">Example Dashboard Output</h2>
          <p className="section-desc">Here&apos;s what Query AI can generate for you.</p>
        </div>

        <div className="dashboard-grid">
          <div className="kpi-row">
            {kpiData.map((kpi, i) => (
              <KPICard key={kpi.title} {...kpi} delay={i * 80} />
            ))}
          </div>

          <div className="charts-row" style={{ animationDelay: '0.3s' }}>
            <ChartCard title="Monthly Revenue" subtitle="Revenue vs Target for 2024" chartType="Line">
              <RevenueLineChart />
            </ChartCard>
            <ChartCard title="Product Categories" subtitle="Distribution by category" chartType="Donut">
              <CategoryPieChart />
            </ChartCard>
          </div>

          <div className="charts-row-equal">
            <ChartCard title="Sales by Region" subtitle="Regional performance breakdown" chartType="Bar">
              <SalesBarChart />
            </ChartCard>
            <ChartCard title="User Growth" subtitle="Total vs Active users over time" chartType="Area">
              <UserGrowthAreaChart />
            </ChartCard>
          </div>
        </div>
      </section>
      </>
      ) : (
        <>
          <div className="chat-thread" style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '16px',
                border: msg.role === 'ai' && msg.isError ? '1px solid var(--danger)' : '1px solid var(--border)',
                color: msg.role === 'user' ? '#fff' : 'inherit',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div className="msg-header" style={{ marginBottom: 12, fontSize: '0.85em', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {msg.role === 'ai' && <Sparkles size={14} />}
                  <strong>{msg.role === 'user' ? 'You' : 'QueryAI'}</strong>
                  <span style={{ fontSize: '0.9em', opacity: 0.7 }}>{msg.timestamp.toLocaleTimeString()}</span>
                </div>
                
                <div className="msg-content" style={{ lineHeight: 1.6 }} dangerouslySetInnerHTML={msg.role === 'ai' ? {
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                    .replace(/^- /gm, '• ')
                } : undefined}>
                  {msg.role === 'user' ? msg.content : undefined}
                </div>
                
                {msg.role === 'ai' && msg.kpis && msg.kpis.length > 0 && (
                  <div className="kpi-row" style={{ marginTop: 20 }}>
                    {msg.kpis.map((kpi, idx) => {
                      const colors: ('blue' | 'green' | 'purple' | 'orange')[] = ['blue', 'green', 'purple', 'orange'];
                      const icons = [<Sparkles size={20} />, <BarChart3 size={20} />, <TrendingUp size={20} />, <Users size={20} />];
                      return (
                        <KPICard 
                          key={idx} 
                          title={kpi.title || "Metric"} 
                          value={kpi.value || "0"} 
                          trend={idx % 2 === 0 ? 5.4 : -2.1} 
                          trendLabel="vs avg" 
                          icon={icons[idx % icons.length]} 
                          iconColor={colors[idx % colors.length]} 
                          sparklineData={[{value: 30}, {value: 45}, {value: 40}, {value: 60}, {value: 50}, {value: 70}]} 
                          delay={idx * 80} 
                        />
                      );
                    })}
                  </div>
                )}
                
                {msg.role === 'ai' && msg.charts && msg.charts.length > 0 && (
                  <div className="charts-row" style={{ marginTop: 20 }}>
                    {msg.charts.map((chart, idx) => (
                      <ChartCard 
                        key={idx} 
                        title={chart.title || "Analysis Chart"} 
                        chartType={chart.chart_type?.toUpperCase() || "CHART"} 
                      >
                        <div style={{ height: 300, width: '100%' }}>
                          <DynamicChart data={chart.chart_data} type={chart.chart_type} />
                        </div>
                      </ChartCard>
                    ))}
                  </div>
                )}

                {msg.role === 'ai' && msg.chartData && msg.chartType && msg.chartData.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <DynamicChart data={msg.chartData} type={msg.chartType} />
                  </div>
                )}
                
                {msg.role === 'ai' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, fontWeight: 500 }}>Suggested Follow-up Questions</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button key={idx} onClick={() => setQuery(q)} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue-light)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 12px', borderRadius: 16, fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.role === 'ai' && msg.sqlQuery && (
                  <div style={{ marginTop: 20, padding: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', overflowX: 'auto', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ marginBottom: 8, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Generated SQL</div>
                    {msg.sqlQuery}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message message-ai" style={{ alignSelf: 'flex-start', maxWidth: '80%', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div className="ai-response-header flex-center gap-3">
                  <Sparkles size={18} className="ai-icon spinning" />
                  <span style={{ fontWeight: 500 }}>Analyzing your query...</span>
                </div>
                <div className="loading-dots" style={{ marginTop: 12 }}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="fixed-bottom-input" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '20px', background: 'linear-gradient(transparent, var(--bg-primary) 20%)', display: 'flex', justifyContent: 'center' }}>
            <div className="chat-container" style={{ width: '100%', maxWidth: 800 }}>
              {uploadedDataset && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue-light)', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <FileSpreadsheet size={16} />
                    <span style={{ fontWeight: 500 }}>{uploadedDataset}</span>
                  </div>
                  <button 
                    onClick={handleAnalyzeDataset}
                    disabled={isLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-purple)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', border: 'none', cursor: isLoading ? 'wait' : 'pointer', fontWeight: 500 }}
                  >
                    <Sparkles size={16} />
                    Analyze
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="chat-input-wrapper" style={{ padding: '12px 20px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                  <div className="chat-input-icon">
                    <Sparkles size={24} />
                  </div>
                  <input
                    type="text"
                    className="chat-input"
                    style={{ fontSize: '18px', padding: '12px 0' }}
                    placeholder="Ask a follow-up question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="chat-upload-btn"
                    onClick={onUploadClick}
                    title="Upload CSV"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button type="submit" className="chat-send-btn flex-center" title="Send query" style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)' }}>
                    <Send size={22} style={{ marginLeft: 2 }} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
