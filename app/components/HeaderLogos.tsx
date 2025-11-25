import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-1000">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="flex-shrink-0">
              <Image
                src="/sairamlogo.png"
                alt="Sri Sairam emblem"
                width={140}
                height={140}
                className="h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 object-contain max-w-[240px] xs:max-w-[280px] sm:max-w-[320px] md:max-w-[360px]"
                priority
              />
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm leading-snug text-gray-700 text-left max-w-xs sm:max-w-sm">
              <p>Accredited by <span className="font-semibold">NAAC &amp; NBA</span></p>
              <p>ISO 9001:2015 Certified Institution</p>
              <p>Approved by AICTE, New Delhi</p>
              <p>Affliated to Visvesvaraya Technological University, Belagavi</p>
              <p>NIRF Innovations 2023</p>
            </div>
          </div>

          {/* Second Logo - College Logo */}
          {/* <div className="flex-shrink-0">
            <Image
              src="/sairamlogo.png"
              alt="Sri Sairam College logo"
              width={240}
              height={96}
              className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 object-contain max-w-[180px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-[280px]"
            />
          </div> */}

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