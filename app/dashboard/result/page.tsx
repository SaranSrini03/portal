'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '../../components/PageContainer';
import { HeaderLogos } from '../../components/HeaderLogos';
import { getStudentByRollNumber, StudentResult } from '../../utils/studentApi';
import poster from '@/public/POSTER2.png';

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
  const [redirectCountdown, setRedirectCountdown] = useState(10);
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
    const timer = setTimeout(() => {
      router.push('/');
    }, 20000);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
          if (score !== null && score > 5) {
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
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden print:hidden">
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
    


        
      </div>

      <div className="w-full flex items-center justify-center px-3 sm:px-6 lg:px-8 py-4 print:px-0 print:py-0">
        <div className="w-full max-w-4xl print:max-w-[700px]">
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
            <div className="space-y-3 print:space-y-2">
              <HeaderLogos />
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl print:text-xl font-bold text-gray-900 mb-1">
                  NTA Assessment · Result
                </h1>
                <p className="text-xs sm:text-sm print:text-[11px] text-gray-500">
                  Official {examLabel} Result Sheet · Academic Year {new Date(result.createdAt).getFullYear()}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr,1.2fr] items-stretch print:grid-cols-1 print:gap-2">
                <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
                  <table className="w-full text-left text-sm sm:text-base print:text-xs text-gray-800 table-fixed">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] sm:text-xs print:text-[10px] tracking-wide">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 print:py-2 border-b border-gray-200">Name</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 print:py-2 border-b border-gray-200">Roll Number</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 print:py-2 border-b border-gray-200">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 sm:px-6 py-4 sm:py-6 print:py-3 border-b border-gray-100 font-semibold text-base print:text-sm break-words">
                          {result.name || 'Name unavailable'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-6 print:py-3 border-b border-gray-100 font-semibold text-base print:text-sm break-words">
                          {result.rollNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-6 print:py-3 border-b border-gray-100 text-sm sm:text-base print:text-sm whitespace-pre-wrap break-words">
                          {result.result}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden flex items-center justify-center min-h-[180px] sm:min-h-[300px] lg:min-h-[420px] print:min-h-[24rem] print:shadow-none">
                  <Image
                    src={poster}
                    alt="Result announcement poster"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover print:h-auto print:max-h-[30rem] print:object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
                <div className="text-xs sm:text-sm text-gray-500">
                  Published on:{' '}
                  <span className="font-medium text-gray-700">{new Date(result.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Redirecting to dashboard in{' '}
                  <span className="font-semibold text-gray-900">{redirectCountdown}s</span>
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

