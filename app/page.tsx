export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-200 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-100 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Portal.</span>
        </h1>
        


        {/* CTA Button */}
        <div className="group relative">
          <a
            href="/dashboard"
            className="relative px-10 py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-black text-white text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center gap-3 overflow-hidden"
          >
            {/* Shine effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            
            Enter Portal
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          
          {/* Button shadow */}
          <div className="absolute inset-0 bg-gray-900/30 blur-xl rounded-2xl -z-10 group-hover:bg-gray-900/40 transition-all duration-300 transform translate-y-2 group-hover:translate-y-3"></div>
        </div>


      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
        @ Sri Sairam College of Engineering
      </div>
    </div>
  );
}