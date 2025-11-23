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
      <div className="relative z-10 max-w-3xl mx-auto mt-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 text-lg font-medium">{error}</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Dashboard
              </button>
            </div>
          ) : result ? (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Result</h1>
                <p className="text-gray-600">Result for Roll Number: {result.rollNumber}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-sm font-medium text-gray-600 mb-1">Roll Number</div>
                    <div className="text-xl font-bold text-gray-900">{result.rollNumber}</div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="text-sm font-medium text-gray-600 mb-3">Result Details</div>
                    <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {result.result}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-green-200">
                    <div className="text-xs text-gray-500">
                      Published: {new Date(result.createdAt).toLocaleString()}
                    </div>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm text-center">
        @ Sri Sairam College of Engineering
      </div>
    </PageContainer>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <PageContainer>
        <div className="relative z-10 max-w-3xl mx-auto mt-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    }>
      <ResultContent />
    </Suspense>
  );
}

