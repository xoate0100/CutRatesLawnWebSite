export default function StaticTestPage() {
  return (
    <main>
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Static Test Page</h1>
          <p className="text-lg text-center">
            This is a completely static page with no data fetching or complex components. If you can see this, the basic
            rendering pipeline is working.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Test Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Card 1</h3>
              <p>This is a test card to verify that basic components render correctly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Card 2</h3>
              <p>This is a test card to verify that basic components render correctly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Card 3</h3>
              <p>This is a test card to verify that basic components render correctly.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
