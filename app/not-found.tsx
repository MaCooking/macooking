export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="bg-accent text-light px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary transition-colors">
        Go Home
      </a>
    </section>
  );
}
