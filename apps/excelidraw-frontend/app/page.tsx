import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Welcome to <span className="text-purple-400">Excelidraw</span>
        </h1>
        <p className="text-gray-300 text-lg">
          A collaborative whiteboard tool where creativity meets code.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/signup" className="w-full md:w-auto">
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
              Sign Up
            </button>
          </Link>
          <Link href="/signin" className="w-full md:w-auto">
            <button className="w-full border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white font-semibold py-2 px-6 rounded-md transition duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
