import Image from 'next/image';

export const HeaderLogos = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-transparent ">
      <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 ">
        {/* <Image
          src="/circlelogo.jpg"
          alt="Sri Sairam emblem"
          width={80}
          height={80}
          className="h-16 w-16 object-contain"
          priority
        /> */}
        <Image
          src="/sairamlogo.png"
          alt="Sri Sairam College logo"
          width={200}
          height={80}
          className="h-16 object-contain"
        />
        <Image
          src="/Chairman-Logo.png"
          alt="Chairman logo"
          width={120}
          height={80}
          className="h-16 object-contain"
        />
      </div>
    </header>
  );
};

