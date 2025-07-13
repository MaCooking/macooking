import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  return (
    <header className="bg-primary text-light dark:bg-dark dark:text-light shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/">
          <span className="flex items-center gap-2 font-bold text-xl">
            <Image src="/globe.svg" alt="Logo" width={32} height={32} />
            Macooking
          </span>
        </Link>
        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-accent transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        <DarkModeToggle />
      </div>
    </header>
  );
}
