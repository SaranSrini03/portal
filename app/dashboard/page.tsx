"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '../components/PageContainer';
import { FormInput } from '../components/FormInput';

export default function StudentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    dob: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Navigate to result page with roll number
    router.push(`/dashboard/result?rollNumber=${encodeURIComponent(formData.rollNumber)}`);
  };

  return (
    <PageContainer>
      <div className="relative z-10 max-w-2xl mx-auto mt-12">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Information</h1>
            <p className="text-gray-600">Please enter your details to view your results</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Roll Number"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter roll number"
                required
              />

              <FormInput
                label="Date of Birth"
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Email Address"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />

              <FormInput
                label="Phone Number"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'View My Results'}
                {!isLoading && <span className="ml-2">→</span>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm text-center">
        @ Sri Sairam College of Engineering
      </div>
    </PageContainer>
  );
}
