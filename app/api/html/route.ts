export function GET() {
  return new Response("<h1>Test Page</h1>", {
    headers: { "Content-Type": "text/html" },
  })
}
