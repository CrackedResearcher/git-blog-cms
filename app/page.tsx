import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Git-Blogger</h1>
        <p className=" text-gray-600 dark:text-gray-300 mb-8">
          A GitHub-connected blog CMS with automated MDX generation<br/> and Git-based deployment
        </p>
        <Link 
          href="/register" 
          className="inline-flex items-center px-6 py-2 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          let's get started
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </main>
    </div>
  );
}
