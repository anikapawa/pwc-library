import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 border-b bg-white">
      <h1 className="text-xl font-bold">
        PWC Library
      </h1>

      <div className="flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        <Link href="/library" className="hover:underline">
          Library
        </Link>

        <Link href="/book-club" className="hover:underline">
          Book Club
        </Link>

        <Link href="/request-book" className="hover:underline">
          Request a Book
        </Link>
      </div>
    </nav>
  );
}