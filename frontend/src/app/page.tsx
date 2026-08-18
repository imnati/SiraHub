export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">SiraHub</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          A modern Ethiopian job marketplace connecting talented professionals
          with top employers across the country.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Phase 0 — Structure Ready
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            Features coming in Phase 1+
          </span>
        </div>
      </div>
    </main>
  );
}
