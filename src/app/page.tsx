import Link from "next/link";


export default function Home() {
  return (

    <div className="fixed top-0 left-0 w-screen h-screen bg-white flex flex-col overflow-hidden z-0">
      <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden">

        <div className="flex flex-col items-center gap-6 z-10 relative">
          <Link href="/puzzle">
            <button className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
              Start First Puzzle
            </button>
          </Link>
          <Link href="/tool">
            <button className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-green-700 transition-colors">
              Puzzle Builder Tool
            </button>
          </Link>
          <Link href="/tool/image-normalization">
            <button className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-colors">
              Image Normalization Tool
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
}
