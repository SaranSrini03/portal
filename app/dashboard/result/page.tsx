'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '../../components/PageContainer';
import { getStudentByRollNumber, StudentResult } from '../../utils/studentApi';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="relative z-10 min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-full max-w-3xl">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                <p className="text-red-800 text-base sm:text-lg font-medium break-words">{error}</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Go Back to Dashboard
              </button>
            </div>
          ) : result ? (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Result</h1>
                <p className="text-sm sm:text-base text-gray-600 break-words">Result for Roll Number: {result.rollNumber}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                    <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Roll Number</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900 break-words">{result.rollNumber}</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-green-200">
                    <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">Result Details</div>
                    <div className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap leading-relaxed break-words">
                      {result.result}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-green-200">
                    <div className="text-xs text-gray-500 break-words">
                      Published: {new Date(result.createdAt).toLocaleString()}
                    </div>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-5 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Check Another Result
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </div>
      </div>

      <div className="fixed sm:absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs sm:text-sm text-center px-4">
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

