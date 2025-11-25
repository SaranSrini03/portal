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
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">

      {/* Header */}
      <div className="sticky top-0 z-30 w-full shadow-sm">
        <HeaderLogos />

        <div className="bg-amber-100 text-amber-900 px-3 sm:px-10 overflow-hidden">
          <div className="py-2 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap animate-marquee">
            Results are out! Please proceed to the portal to view your scores.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl">

            {/* Poster Image */}
            <div className="w-full px-2 sm:px-0">
              <Image
                src={poster}
                alt="Results Poster"
                width={800}
                height={1200}
                className="w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto object-contain rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl mx-auto"
                priority
              />
            </div>

            {/* Check Results Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full max-w-xs sm:max-w-sm"
            >
              Check Results
            </button>

          </div>
        </div>

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
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
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
                  className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base border-2 rounded-xl sm:rounded-2xl"
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