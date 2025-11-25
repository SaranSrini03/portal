"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "./components/PageContainer";
import { FormInput } from "./components/FormInput";
import { MathCaptcha } from "./components/MathCaptcha";
import { HeaderLogos } from "./components/HeaderLogos";
import Image from "next/image";
import poster from "@/public/poster.jpg";

type ExamType = "jee" | "neet";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [examType, setExamType] = useState<ExamType>("jee");
  const [showModal, setShowModal] = useState(false);
  const [showPosterPopup, setShowPosterPopup] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaValid) {
      alert("Please complete the security verification (captcha) before submitting.");
      return;
    }

    setIsLoading(true);
    router.push(
      `/dashboard/result?rollNumber=${encodeURIComponent(
        formData.rollNumber
      )}&exam=${examType}`
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col font-sans ">
      {/* Background with college image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/college.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay for better readability */}
      <div className="fixed inset-0 z-0 bg-slate-50/60" />

      {/* Header */}
      <div className="relative z-10 sticky top-0 w-full shadow-sm">
        <HeaderLogos />

        <div className="bg-amber-100 text-amber-900 px-3 sm:px-10 overflow-hidden">
          <div className="py-2 text-xs sm:text-sm font-semibold tracking-tighter animate-marquee">
            Results are out! Please proceed to the portal to view your scores.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 mt-20">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-0 w-full max-w-7xl xl:max-w-[90rem]">

            {/* Poster Image */}
            <div className="hidden lg:block lg:w-1/2 p-0">
              <Image
                src={poster}
                alt="Results Poster"
                width={1200}
                height={1800}
                className="w-full h-auto object-contain rounded-xl sm:rounded-2xl lg:rounded-l-3xl lg:rounded-r-none shadow-lg sm:shadow-xl lg:shadow-2xl"
                priority
              />
            </div>

            {/* Check Results Box */}
            <div className="w-full lg:w-1/2 p-0">
              <div className="w-full h-full bg-gradient-to-br from-white/60 via-white/40 to-amber-50/30 backdrop-blur-2xl rounded-xl sm:rounded-2xl lg:rounded-r-3xl lg:rounded-l-none shadow-xl sm:shadow-2xl flex flex-col items-center justify-center p-8 sm:p-10 md:p-14 lg:p-16 min-h-[300px] lg:min-h-0 border border-white/70 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl" />
                
                {/* Logo Icon */}
                <div className="mb-6 sm:mb-8 p-2 sm:p-3 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Image
                    src="/circlelogo.jpg"
                    alt="Sri Sairam emblem"
                    width={100}
                    height={100}
                    className="h-32 w-32 sm:h-32 sm:w-32  md:h-20 md:w-20 rounded-full object-cover shadow-md"
                    priority
                  />
                </div>
                
                <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Ready to see your <span className="text-amber-500">results?</span>
                </h2>
                <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl text-center mb-8 sm:mb-10 md:mb-12 max-w-md">
                  Click below to check your examination scores
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl px-8 sm:px-10 md:px-14 lg:px-16 py-3 sm:py-4 md:py-5 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center gap-2 sm:gap-3"
                >
                  Check Results
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Poster Popup on Load */}
        {showPosterPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[100] px-4 sm:px-6">
            <div className="relative max-w-2xl w-full animate-in fade-in zoom-in duration-300">
              {/* Close Button */}
              <button
                onClick={() => setShowPosterPopup(false)}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 bg-white text-gray-700 hover:text-black rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 active:scale-95 transition-all"
                aria-label="Close poster"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Poster Image */}
              <Image
                src={poster}
                alt="Results Poster"
                width={800}
                height={1200}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl sm:rounded-3xl shadow-2xl"
                priority
              />
            </div>
          </div>
        )}

        {/* Center Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[100] px-3 sm:px-4">

            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 text-lg sm:text-xl md:text-2xl font-bold text-gray-500 hover:text-black transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Title */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8 pr-6 sm:pr-0">
                <h1 className="text-xl p-5 sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Student Information
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl">
                  Please enter your details to view your results
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">

                {/* Exam Selection */}
                <div>
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 text-left">
                    Select Examination
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    {(["jee", "neet"] as ExamType[]).map((type) => {
                      const isActive = examType === type;
                      const label = type === "jee" ? "JEE" : "NEET";

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setExamType(type)}
                          className={`rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold transition-all ${
                            isActive
                              ? "bg-gray-900 text-white border-gray-900 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 active:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Roll Number Input */}
                <FormInput
                  label="Roll Number"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                  className="w-full h-12 p-10 sm:h-14 md:h-16 text-lg sm:text-md border-2 rounded-xl sm:rounded-2xl text-black"
                />

                {/* Captcha */}
                <div className="scale-90 sm:scale-100 origin-left">
                  <MathCaptcha onVerify={setIsCaptchaValid} />
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-3 md:pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !isCaptchaValid}
                    className="w-full px-4 sm:px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base md:text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      <>
                        View My Results
                        <span className="ml-1 sm:ml-2">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="pt-3 sm:pt-4 text-center text-gray-500 text-xs sm:text-sm">
                © Sri Sairam College of Engineering
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}