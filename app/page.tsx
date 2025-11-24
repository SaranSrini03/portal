"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "./components/PageContainer";
import { FormInput } from "./components/FormInput";
import { MathCaptcha } from "./components/MathCaptcha";
import { HeaderLogos } from "./components/HeaderLogos";

const Marquee: any = "marquee";

type ExamType = "jee" | "neet";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [examType, setExamType] = useState<ExamType>("jee");

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
      `/dashboard/result?rollNumber=${encodeURIComponent(formData.rollNumber)}&exam=${examType}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <div className="sticky top-0 z-30 w-full shadow-sm">
        <HeaderLogos />
        <div className="bg-amber-100 text-amber-900 px-4 sm:px-10">
          <Marquee className="py-2 text-xs sm:text-sm font-semibold tracking-wide" scrollamount={15}>
            Results are out! Please proceed to the portal to view your scores.
          </Marquee>
        </div>
      </div>

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PageContainer className="bg-transparent p-0 sm:p-4 shadow-none">
          <div className="relative z-10 max-w-2xl w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Student Information</h1>
                <p className="text-gray-600 text-sm sm:text-base">Please enter your details to view your results</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-left">Select Examination</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(["jee", "neet"] as ExamType[]).map((type) => {
                      const isActive = examType === type;
                      const label = type === "jee" ? "JEE" : "NEET";
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setExamType(type)}
                          className={`rounded-xl border px-5 py-3 text-base font-semibold transition-all ${
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

                <FormInput
                  label="Roll Number"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                />

                <MathCaptcha onVerify={setIsCaptchaValid} />

                <div className="pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !isCaptchaValid}
                    className="w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Loading..." : "View My Results"}
                    {!isLoading && <span className="ml-2">→</span>}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 sm:mt-10 text-gray-400 text-sm text-center">
              @ Sri Sairam College of Engineering
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}