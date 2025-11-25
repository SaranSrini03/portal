import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-1000">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
            <div className="flex-shrink-0">
              <Image
                src="/sairamlogo.png"
                alt="Sri Sairam emblem"
                width={140}
                height={140}
                sizes="(min-width:1024px) 320px, (min-width:640px) 240px, 160px"
                className="h-10 xs:h-11 sm:h-14 md:h-18 lg:h-20 object-contain max-w-[200px] xs:max-w-[220px] sm:max-w-[260px] md:max-w-[300px]"
                priority
              />
            </div>
            <div className="max-w-[11rem] xs:max-w-[13rem] sm:max-w-sm text-[9px] xs:text-[10px] sm:text-xs md:text-sm leading-snug text-gray-700 text-left">
              <p>
                Accredited by <span className="font-semibold">NAAC &amp; NBA</span>
              </p>
              <p>ISO 9001:2015 Certified Institution</p>
              <p>Approved by AICTE, New Delhi</p>
              <p>Affiliated to Visvesvaraya Technological University, Belagavi</p>
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
              sizes="(min-width:1024px) 200px, (min-width:640px) 150px, 120px"
              className="h-7 xs:h-8 sm:h-10 md:h-12 lg:h-14 object-contain max-w-[110px] xs:max-w-[130px] sm:max-w-[150px] md:max-w-[180px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};