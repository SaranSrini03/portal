'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '../../components/PageContainer';
import { getStudentByRollNumber, StudentResult } from '../../utils/studentApi';

const extractScore = (text: string): number | null => {
  if (!text) return null;
  const match = text.match(/(\d{1,3})/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  if (value < 0 || value > 100) return null;
  return value;
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const examParam = searchParams.get('exam');
  const examType = examParam === 'neet' ? 'neet' : 'jee';
  const examLabel = examType === 'neet' ? 'NEET' : 'JEE';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `NTA Assessment · ${examLabel} Result`;
    return () => {
      document.title = previousTitle;
    };
  }, [examLabel]);

  useEffect(() => {
    const fetchResult = async () => {
      const rollNumber = searchParams.get('rollNumber');
      
      if (!rollNumber) {
        setError('Roll number is required.');
        setIsLoading(false);
        return;
      }

      try {
        const studentResult = await getStudentByRollNumber(rollNumber);
        
        if (studentResult) {
          setResult(studentResult);
          const score = extractScore(studentResult.result);
          if (score !== null && score > 80) {
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
            }, 4000);
          }
        } else {
          setError('No result found for this roll number. Please contact the administrator.');
        }
      } catch (err) {
        setError('Failed to fetch result. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

  return (
    <PageContainer>
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {Array.from({ length: 80 }).map((_, index) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 1.8 + Math.random() * 0.7;
            const colors = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899'];
            const color = colors[index % colors.length];
            return (
              <span
                key={index}
                className="confetti-piece"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      )}
      <div className="w-full flex flex-col items-center text-center gap-5 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">

          <Image
            src="/sairamlogo.png"
            alt="Sri Sairam College Logo"
            width={280}
            height={100}
            className="h-16 object-contain"
            priority
          />
          <Image
            src="/Chairman-Logo.png"
            alt="Chairman Logo"
            width={150}
            height={80}
            className="h-16 object-contain"
            priority
          />
        </div>
      </div>

      <div className="h-[100%] w-full flex items-center justify-center px-4 sm:px-10 py-6 overflow-hidden">
        <div className="w-full max-w-6xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 text-lg font-medium break-words">{error}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base"
              >
                Go Back to Dashboard
              </button>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="text-center">
                          <Image
            src="/circlelogo.jpg"
            alt="Sri Sairam Emblem"
            width={90}
            height={90}
            className="h-16 w-16 object-contain"
            priority
          />
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Sri Sairam College of Engineering</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-1">
                  NTA Assessment · {examLabel} Result
                </h1>
                <p className="text-sm text-gray-500">
                  Official {examLabel} Result Sheet · Academic Year {new Date(result.createdAt).getFullYear()}
                </p>
              </div>

              <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
                <table className="w-full text-left text-base text-gray-800 table-fixed">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-200">Roll Number</th>
                      <th className="px-6 py-4 border-b border-gray-200">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 py-6 border-b border-gray-100 font-semibold text-lg break-words">
                        {result.rollNumber}
                      </td>
                      <td className="px-6 py-6 border-b border-gray-100 text-base whitespace-pre-wrap break-words">
                        {result.result}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-500">
                  Published on:{' '}
                  <span className="font-medium text-gray-700">{new Date(result.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
                  >
                    Check Another Result
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="pb-6 text-gray-400 text-xs sm:text-sm text-center print:hidden">
        @ Sri Sairam College of Engineering
      </div>
    </PageContainer>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <PageContainer>
        <div className="relative z-10 max-w-3xl mx-auto mt-4 sm:mt-8 md:mt-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    }>
      <ResultContent />
    </Suspense>
  );
}

