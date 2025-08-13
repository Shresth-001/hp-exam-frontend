"use client";
import InputField from "@/components/inputFields/inputField";
import { lusitana } from "./fonts";
import FileUploadFIelds from "@/components/inputFields/fileUploadFIelds";
import SubmitButton from "@/components/button/submitButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useActionState } from "react";
import { authenticate } from "../lib/login-action/actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  return (
    <form action={formAction}>
      <div className="flex-1 rounded-lg shadow-2xl shadow-black/30 bg-gray-50 pb-6 pt-8">
        {/* <h1 className={`${lusitana.className}mb-2 ml-5 text-2xl`}>
          Please Log in to Continue.
        </h1> */}
        <div className="w-full">
          <div className="relative flex items-center justify-start ml-10 ">
            <InputField
              required={true}
              className="peer  text-lg border-b-2 border-gray-300 bg-transparent leading-5 pt-4 px-3 pb-1 focus:outline-0  "
              type="text"
              id="name"
              name="name"
              placeholder=""
            />
            <label className="label-floating" htmlFor="name">
              Name
            </label>
          </div>

          <div className=" mt-5 relative flex items-center justify-start ml-10">
            <InputField
              type="email"
              name="email"
              className={
                "peer  border-b-2 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
              }
              placeholder={""}
            />
            <label className="label-floating" htmlFor="email">
              Email
            </label>
          </div>
          <div className="mt-5 relative flex items-center justify-start ml-10">
            <InputField
              type="number"
              name="phone"
              className={
                "peer border-b-2 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
              }
              placeholder={""}
            />
            <label className="label-floating" htmlFor="phone">
              Phone
            </label>
          </div>
          <div className="mt-8 flex items-center justify-start ml-10">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                const fileInput = document.getElementById(
                  "resume"
                ) as HTMLInputElement;
                if (fileInput) {
                  fileInput.files = files;
                }
              }}
              htmlFor="resume"
              className="flex flex-col items-center justify-center w-80 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
            >
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
                Drag your resume here or click to upload
              </p>
              <p className="text-xs text-gray-400">
                Acceptable file types: PDF, DOCX (5MB max)
              </p>
              <FileUploadFIelds
                type="file"
                id="resume"
                name="resume"
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>
          <div className="relative flex items-center justify-center ">
            <SubmitButton
              type="submit"
              isPending={isPending}
              text={"Submit"}
              className="mt-4 w-85"
              children={
              <FaArrowAltCircleRight className="ml-auto h-5 w-5 text-gray-50" />
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
