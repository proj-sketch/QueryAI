from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL

SYSTEM_PROMPT = """You are QueryAI, an expert business intelligence assistant.

Your role:
- Analyze business questions and provide clear, actionable insights
- When given data context, generate relevant analysis
- Present numbers clearly with comparisons and trends
- Keep responses concise and well-structured
- Use bullet points and sections for clarity
- If a question is vague, provide a helpful general analysis
- If you cannot answer something, explain what data would be needed

Response format:
- Use markdown formatting for readability
- Bold key numbers and metrics
- Use bullet points for lists
- Keep responses under 300 words unless detailed analysis is requested"""


def get_client():
    """Get the Gemini client instance."""
    return genai.Client(api_key=GEMINI_API_KEY)


async def generate_response(query: str) -> dict:
    """
    Send a query to Gemini and return the response.
    Returns { "response": str, "error": str | None }
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        return {
            "response": None,
            "error": "Gemini API key not configured. Please add your API key to backend/.env",
        }

    try:
        client = get_client()
        result = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=f"{SYSTEM_PROMPT}\n\nUser Query: {query}",
        )
        return {
            "response": result.text,
            "error": None,
        }
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return {
                "response": None,
                "error": "Gemini API rate limit exceeded. Please wait a moment and try again.",
            }
        elif "403" in error_msg or "API_KEY" in error_msg.upper():
            return {
                "response": None,
                "error": "Invalid Gemini API key. Please check your API key in backend/.env",
            }
        else:
            return {
                "response": None,
                "error": f"AI Error: {error_msg}",
            }
