"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const sections = [
    {
      title: "Books",
      href: "/admin/books",
      description: "Manage library books",
    },
    {
      title: "Requests",
      href: "/admin/requests",
      description: "Manage checkout and hold requests",
    },
    {
      title: "Recommendations",
      href: "/admin/recommendations",
      description: "Manage submitted book recommendations",
    },
    {
      title: "Book Club",
      href: "/admin/book-club",
      description: "Manage book club selections",
    },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="
              bg-black
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-gray-800
              cursor-pointer
            "
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="
                border
                rounded-xl
                p-6
                hover:shadow-lg
                transition
                cursor-pointer
                hover:-translate-y-1
              "
            >
              <h2 className="text-2xl font-semibold mb-2">
                {section.title}
              </h2>

              <p className="text-gray-600">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}