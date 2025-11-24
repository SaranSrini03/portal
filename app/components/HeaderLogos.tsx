import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <Image
          src="/circlelogo.jpg"
          alt="Sri Sairam emblem"
          width={72}
          height={72}
          className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          priority
        />
        <Image
          src="/sairamlogo.png"
          alt="Sri Sairam College logo"
          width={200}
          height={80}
          className="h-12 sm:h-16 object-contain"
        />
        <Image
          src="/Chairman-Logo.png"
          alt="Chairman logo"
          width={150}
          height={80}
          className="h-12 sm:h-16 object-contain"
        />
      </div>
    </header>
  );
};

