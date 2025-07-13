export default function Footer() {
  return (
    <footer className="bg-secondary text-light dark:bg-dark dark:text-light py-6 mt-12">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Macooking. All rights reserved.
      </div>
    </footer>
  );
}
