import type { APIRoute } from "astro"
export const prerender = false

export const POST: APIRoute = async ({ request, params, url }) => {
  const body = await request.json();
  console.log(body);
  
  
  return new Response(
    JSON.stringify({ message: 'Form submission received!' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
