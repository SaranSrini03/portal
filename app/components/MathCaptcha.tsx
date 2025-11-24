'use client';

import { useState, useEffect } from 'react';

interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export const MathCaptcha: React.FC<MathCaptchaProps> = ({ onVerify }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateNewCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsValid(false);
    setError('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value;
    setUserAnswer(answer);
    // Reset verification state when user changes answer
    if (isVerified) {
      setIsVerified(false);
      setIsValid(false);
      setError('');
      onVerify(false);
    }
  };

  const handleVerify = () => {
    if (!userAnswer.trim()) {
      setError('Please enter an answer');
      setIsValid(false);
      onVerify(false);
      return;
    }

    const correctAnswer = num1 + num2;
    const answerNum = parseInt(userAnswer);
    const isValidAnswer = !isNaN(answerNum) && answerNum === correctAnswer;
    
    setIsValid(isValidAnswer);
    setIsVerified(true);
    onVerify(isValidAnswer);
    
    if (!isValidAnswer) {
      setError('Incorrect answer. Please try again.');
    } else {
      setError('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Security Verification
        <span className="text-red-500">*</span>
      </label>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-300">
          <span className="text-lg font-bold text-gray-800">{num1}</span>
          <span className="text-gray-600">+</span>
          <span className="text-lg font-bold text-gray-800">{num2}</span>
          <span className="text-gray-600">=</span>
          <input
            type="number"
            value={userAnswer}
            onChange={handleAnswerChange}
            className="w-20 px-2 py-1 text-center text-lg font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="?"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={isValid}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-600 disabled:hover:bg-green-600"
          title="Verify answer"
        >
          {isValid ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify
            </>
          )}
        </button>
        <button
          type="button"
          onClick={generateNewCaptcha}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
          title="Refresh captcha"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {isVerified && error && (
        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {isValid && isVerified && (
        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Verification successful
        </p>
      )}
    </div>
  );
};

