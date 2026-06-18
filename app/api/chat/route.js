export async function POST(req) {
  try {
    const { messages } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: `You are JhayemAI, a personal AI assistant created by Jhayem Cuysona, a BSIT student at Trinidad Municipal College (TMC) in Trinidad, Bohol, Philippines. You are helpful, smart, and have a slightly cool and casual personality. You can respond in English or Filipino/Bisaya depending on how the user talks to you. Keep responses concise and mobile-friendly. You were built as a capstone-inspired personal AI project.`,
          },
          ...messages,
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Groq API error' }, { status: 500 })
    }

    const text = data.choices?.[0]?.message?.content || ''
    return Response.json({ content: text })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
