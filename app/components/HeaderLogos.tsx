import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
          {/* First Logo - Circular Emblem */}
          {/* <div className="flex-shrink-0">
            <Image
              src="/circlelogo.jpg"
              alt="Sri Sairam emblem"
              width={80}
              height={80}
              className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain"
              priority
            />
          </div> */}

          {/* Second Logo - College Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/sairamlogo.png"
              alt="Sri Sairam College logo"
              width={240}
              height={96}
              className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 object-contain max-w-[180px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-[280px]"
            />
          </div>

          {/* Third Logo - Chairman Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/Chairman-Logo.png"
              alt="Chairman logo"
              width={180}
              height={72}
              className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 object-contain max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-[180px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};