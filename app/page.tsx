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
        <div className="bg-amber-100 text-amber-900 px-4 sm:px-10 overflow-hidden">
          <div className="py-2 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap animate-marquee">
            Results are out! Please proceed to the portal to view your scores.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-6">
            <Image
              src={poster}
              alt="Results Poster"
              width={800}
              height={1200}
              className="max-w-3xl w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl"
              priority
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white font-bold text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:scale-[1.02] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Check Results
            </button>
          </div>
        </div>

        {/* Center Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xl z-[100]">

            <div className="bg-white rounded-3xl p-6 sm:p-10 w-full max-w-3xl shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Student Information
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl">
                  Please enter your details to view your results
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Exam Selection */}
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-3 text-left">
                    Select Examination
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    {(["jee", "neet"] as ExamType[]).map((type) => {
                      const isActive = examType === type;
                      const label = type === "jee" ? "JEE" : "NEET";
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setExamType(type)}
                          className={`rounded-xl border px-4 py-3 sm:px-5 sm:py-4 text-lg font-semibold transition-all ${
                            isActive
                              ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-500/40"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
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
                  className="w-full h-16 text-base border-2 rounded-2xl"
                />

                {/* Captcha */}
                <MathCaptcha onVerify={setIsCaptchaValid} />

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !isCaptchaValid}
                    className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Loading..." : "View My Results"}
                    {!isLoading && <span className="ml-2">→</span>}
                  </button>
                </div>
              </form>

              <div className="pt-4 text-center text-gray-500 text-sm">
                © Sri Sairam College of Engineering
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
