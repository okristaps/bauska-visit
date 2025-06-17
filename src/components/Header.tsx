import Image from 'next/image';

export default function Header() {
    return (
        <header className="w-full bg-white">
            <div className="container  px-1 py-3 sm:px-4 sm:py-4 lg:px-4 lg:py-6">
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