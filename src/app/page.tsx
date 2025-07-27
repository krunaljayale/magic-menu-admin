import Link from "next/link";

// app/page.tsx
export default function Landing() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          🚧 Coming Soon!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Launching www.magicmenu.in soon
        </p>
        <Link href={"/admin"}>
          <button className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            Admin Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
