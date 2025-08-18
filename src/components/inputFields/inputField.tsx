import React, { useEffect, useRef } from "react";

interface InputFieldsType {
  value:string;
    type?: string;
  name: string;
  required?: boolean;
  className: string;
  id?: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?:string|undefined;
}
const InputField = ({
    value,
    onChange,
  id,
  type = "text",
  placeholder,
  name,
  required = true,
  className,
  error,
}: InputFieldsType) => {
  return (
    <>
      <input
      value={value}
      onChange={onChange}
        placeholder={placeholder}
        id={id}
        className={` block peer w-80 border-0 border-b-2 border-gray-300 
          focus:border-blue-500 focus:outline-none 
          bg-transparent px-0 pt-5 pb-2 
          text-sm text-gray-900
           ${className}`}
        name={name}
        required={required}
        type={type}
      />
      <div className="mt-2 pt-2">
        {error&&(
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
      </div>
    </>
  );
};

export default InputField;
