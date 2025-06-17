import Header from "@/components/Header";
import Link from "next/link";
import FullscreenPrompt from "@/components/FullscreenPrompt";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

export default function Home() {
  return (
    <PwaInstallPrompt>
      <div className="fixed top-0 left-0 w-screen h-screen bg-white flex flex-col overflow-hidden z-0">
        <div
          className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center bg-cover z-0"
          style={{ backgroundImage: 'url(/assets/bg.png)' }}
        />
        <FullscreenPrompt />
        <Header />
        <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background image as a decorative layer covering the whole page */}

          {/* Main content above the background */}
          <div className="flex flex-col items-center gap-6 z-10 relative">
            <Link href="/puzzle">
              <button className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                Start First Puzzle
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PwaInstallPrompt>
  );
}
