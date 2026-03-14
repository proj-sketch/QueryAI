'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronRight, ChevronDown, MessageSquare, BarChart, Database, Zap, Search, HelpCircle } from 'lucide-react';

interface DocSection {
  icon: React.ElementType;
  title: string;
  desc: string;
  content: string[];
}

const docTopics: DocSection[] = [
  {
    icon: MessageSquare,
    title: 'Asking Good Questions',
    desc: 'Learn how to structure your prompts for the best AI analysis.',
    content: [
      'Be specific about what you want: Instead of "show sales", try "Show monthly sales revenue for the past 12 months".',
      'Include time ranges: "Q3 2024", "last 6 months", or "year over year" help narrow results.',
      'Mention the metrics you care about: revenue, units sold, conversion rate, etc.',
      'Use comparison language: "compare", "versus", "top 5", "bottom 10" to get comparative visualizations.',
      'Ask follow-up questions: You can refine your previous query, e.g., "Now break that down by region".',
    ],
  },
  {
    icon: BarChart,
    title: 'Understanding Charts',
    desc: 'A guide to reading the generated visualizations and metrics.',
    content: [
      'Line Charts: Best for showing trends over time. Look for upward/downward patterns and seasonal cycles.',
      'Bar Charts: Compare values across categories. The taller the bar, the higher the value.',
      'Pie/Donut Charts: Show proportions of a whole. Hover over slices to see exact percentages.',
      'Area Charts: Similar to line charts but emphasize volume. Useful for stacked comparisons.',
      'KPI Cards: Show key metrics at a glance with trend indicators (green = up, red = down).',
    ],
  },
  {
    icon: Database,
    title: 'Connecting Data',
    desc: 'How to securely connect your databases or upload CSVs.',
    content: [
      'CSV Upload: Click the upload button or paperclip icon. Drag and drop your CSV file. Supported formats: .csv, .xlsx up to 50MB.',
      'Database Connection: Go to Data Sources → Add Connection. Enter your host, port, database name, and credentials.',
      'Supported Databases: PostgreSQL, MySQL, Snowflake, BigQuery, MongoDB, and more.',
      'Data is never stored permanently on our servers. We only read your data to generate insights.',
      'All connections use SSL/TLS encryption. Credentials are stored encrypted and never shared.',
    ],
  },
  {
    icon: Zap,
    title: 'Advanced Features',
    desc: 'Using predictive analytics and custom reporting.',
    content: [
      'Predictive Queries: Ask "predict next quarter revenue" or "forecast user growth for 6 months".',
      'Custom Dashboards: Pin your favorite queries to create a personal dashboard view.',
      'Scheduled Reports: Set up recurring queries that auto-run and send results to your email.',
      'Export Options: Download any chart as PNG, SVG or PDF. Export data tables as CSV.',
      'Team Sharing: Share queries and dashboards with your team members for collaboration.',
    ],
  },
];

const faqs = [
  { q: 'Is my data secure?', a: 'Yes. All data is encrypted in transit and at rest. We never store your raw data permanently — it is only processed in memory to generate insights.' },
  { q: 'What file formats are supported?', a: 'Currently we support CSV and XLSX files up to 50MB. Database connections support PostgreSQL, MySQL, Snowflake, BigQuery, and MongoDB.' },
  { q: 'Can I share dashboards with my team?', a: 'Yes! Once your dashboard is generated, you can share it via a link or invite team members directly from the settings panel.' },
  { q: 'How accurate are the AI responses?', a: 'Query AI uses advanced language models to interpret your questions and generate SQL. Accuracy depends on the clarity of your question and the quality of your data. We always show the generated SQL so you can verify.' },
  { q: 'Is there a free plan?', a: 'Yes, Query AI offers a free tier with up to 50 queries per month and 5MB file uploads. Paid plans start at $29/month for unlimited queries.' },
];

export default function Documentation() {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = docTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Documentation & Support</h2>
          <p className="view-subtitle">Learn how to make the most out of Query AI.</p>
        </div>
        <div className="header-search" style={{ minWidth: 250 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '13px' }}
          />
        </div>
      </div>

      <div className="docs-hero card">
        <h3>Getting Started with Query AI</h3>
        <p>
          Welcome to Query AI! Our platform allows you to interact with your business data using natural language.
          Simply type a question like &quot;What were our top-selling products last month?&quot; and our AI will generate the appropriate SQL, run it against your data, and visualize the results instantly.
        </p>
      </div>

      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Guides & Topics</h3>
      <div className="docs-accordion">
        {filteredTopics.map((topic, i) => (
          <div key={i} className={`card doc-accordion-item ${expandedTopic === i ? 'expanded' : ''}`}>
            <button
              className="doc-accordion-header"
              onClick={() => setExpandedTopic(expandedTopic === i ? null : i)}
            >
              <div className="doc-accordion-left">
                <div className="doc-topic-icon">
                  <topic.icon size={22} />
                </div>
                <div>
                  <h4>{topic.title}</h4>
                  <p className="text-muted text-sm">{topic.desc}</p>
                </div>
              </div>
              {expandedTopic === i ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {expandedTopic === i && (
              <div className="doc-accordion-body">
                <ul>
                  {topic.content.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 32, marginBottom: 16 }}>
        <HelpCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
        Frequently Asked Questions
      </h3>
      <div className="docs-accordion">
        {filteredFaqs.map((faq, i) => (
          <div key={i} className={`card doc-accordion-item faq-item ${expandedFaq === i ? 'expanded' : ''}`}>
            <button
              className="doc-accordion-header"
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              <span className="faq-question">{faq.q}</span>
              {expandedFaq === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedFaq === i && (
              <div className="doc-accordion-body">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
