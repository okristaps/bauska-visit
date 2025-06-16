import Image from 'next/image';

export default function Header() {
    return (
        <header className="w-full bg-white">
            <div className="container mx-auto px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-4">
                <Image
                    src="/assets/visit-bauska-logo.svg"
                    alt="Visit Bauska Logo"
                    width={100}
                    height={33}
                    className="h-auto w-20 sm:w-24 md:w-28 lg:w-[150px]"
                    priority
                />
            </div>
        </header>
    );
} 