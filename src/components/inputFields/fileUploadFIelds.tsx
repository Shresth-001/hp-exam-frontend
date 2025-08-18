import React, { useState, DragEvent, ChangeEvent, useRef, useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
interface FileUploadProps {
  id: string;
  name: string;
  accept: string;
  onChange: (file: File | null) => void;
  fileReset?:boolean;
  error?:string;
}

const FileUploadInput: React.FC<FileUploadProps> = ({ error,id, name, accept, onChange ,fileReset=false}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fileReset) {
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [fileReset]);
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };
  const handleCancel=(event:React.MouseEvent)=>{
    event.preventDefault();
    event.stopPropagation();
    setFile(null);
    if(inputRef.current){
      inputRef.current.value = "";
    }
    onChange(null);
  }

  const handleFile = (selectedFile: File) => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }
    const name=selectedFile.name;
    setFile(selectedFile);
    onChange(selectedFile); 
  };
  const containerClasses = `
    flex flex-col items-center justify-center w-full max-w-lg h-40 border-2 border-dashed
    rounded-lg cursor-pointer transition 
    ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
  `;

  return (
    <>
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      htmlFor={id}
      className={`hover:border-blue-400 ${containerClasses}`}
    >{file&&(
        <div className='flex items-center w-2/3 justify-center mt-5 border-1 border-gray-400 rounded-md'>
            <h2 className='text-lg font-semibold'>{file.name}</h2>
            <button onClick={handleCancel} >{<FaXmark size={25} className='ml-4 text-gray-500' />}</button>
        </div>
    )}
    {!file&&(
        <>
      <svg
        className="w-10 h-10 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-gray-700 font-medium">
        {file ? file : "Drag your resume here or click to upload"}
      </p>
      <p className="text-xs text-gray-400">
        Acceptable file types: PDF, DOCX (5MB max)
      </p>
      <input
        type="file"
        id={id}
        name={name}
        className="hidden"
        accept={accept}
        onChange={handleInputChange}
        ref={inputRef}
      />
      </>
    )}
    </label>
    <div className=''>
      {error&&(
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
    </>
  );
};

export default FileUploadInput;