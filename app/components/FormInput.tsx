import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  containerClass?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  required = false,
  containerClass = '',
  ...props
}) => {
  return (
    <div className={containerClass}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required={required}
        {...props}
      />
    </div>
  );
};
