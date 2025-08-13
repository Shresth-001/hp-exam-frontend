import React from "react";

interface InputFieldsType {
  type?: string;
  name: string;
  required?: boolean;
  className: string;
  id?: string;
  placeholder: string;
}
const InputField = ({
  id,
  type = "text",
  placeholder,
  name,
  required = true,
  className,
}: InputFieldsType) => {
  return (
    <>
      <input
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
    </>
  );
};

export default InputField;
