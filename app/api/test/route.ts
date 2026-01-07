export function GET() {
  return new Response("Hello World", {
    headers: { "Content-Type": "text/plain" },
  })
}
