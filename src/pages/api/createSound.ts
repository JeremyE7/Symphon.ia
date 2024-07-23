import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from "ai"
import { prompt } from "../../utils/prompt"


import type { APIRoute } from "astro"
import type { SoundPrompt, Sound } from "../../types"

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.GEMINI_API_KEY || '',
});

const model = google('models/gemini-1.5-pro-latest')

export const prerender = false

export const POST: APIRoute = async ({ request }) => {

  if (!request.body) {
    return new Response(
      JSON.stringify({ error: 'No form data submitted!' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (import.meta.env.GEMINI_API_KEY === '') {
    return new Response(
      JSON.stringify({ error: 'API key not set!' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const body: SoundPrompt = await request.json()
  const bodyParsed = `${body.feeling}, ${body.genre}, ${body.instrument}`

  const { text } = await generateText({
    model: model,
    prompt: bodyParsed,
    system: prompt
  })

  const resultFormatted = JSON.parse(text.replace(/^```json\n/, '').replace(/\n```$/, '')) as Sound

  return new Response(
    JSON.stringify(resultFormatted),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )

}
