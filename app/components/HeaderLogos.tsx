import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 md:px-6 py-3 sm:py-4">

        {/* ALWAYS horizontal – never stacks */}
        <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4">

          {/* LEFT LOGO + TEXT */}
          <div className="flex flex-row items-center gap-2 sm:gap-4">

            {/* College Logo */}
            <Image
              src="/sairamlogo.png"
              alt="Sairam Logo"
              width={100}
              height={100}
              className="h-10 xs:h-12 sm:h-14 md:h-16 object-contain"
              priority
            />

            {/* Accreditation Text */}
            <div className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm leading-snug text-gray-700">
              <p>Accredited by <span className="font-semibold">NAAC &amp; NBA</span></p>
              <p>ISO 9001:2015 Certified Institution</p>
              <p>Approved by AICTE, New Delhi</p>
              <p>Affiliated to Visvesvaraya Technological University, Belagavi</p>
              <p>NIRF Innovations 2023</p>
            </div>

          </div>
          {/* RIGHT – Chairman Logo */}
          <Image
            src="/Chairman-Logo.png"
            alt="Chairman Logo"
            width={120}
            height={120}
            className="h-10 xs:h-12 sm:h-14 md:h-16 object-contain"
          />
        </div>
      </div>
    </header>
  );
};
