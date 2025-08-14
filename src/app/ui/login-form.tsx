"use client";
import InputField from "@/components/inputFields/inputField";
import SubmitButton from "@/components/button/submitButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import FileUploadInput from "@/components/inputFields/fileUploadFIelds";
import { useLogin } from "@/hooks/loginHooks/useLogin";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  api?: string;
}

export default function LoginForm() {
  const { errorsList, userLogin, setErrorList,reDirectToDashBoard } = useLogin();
  const [file, setFile] = useState<File | null>(null);
  const [fileReset, setFileReset] = useState<boolean>(false);
  const router=useRouter();
  useEffect(()=>{
    if(reDirectToDashBoard){
      router.push('/dashboard/stream-selection')
    }
  })
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s'-]+$/, "Name contains invalid characters.")
      .required("Name is required."),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits.")
      .required("Phone is required."),
    experience: Yup.number()
      .typeError("Experience must be a number.")
      .min(0, "Experience must be a non-negative number.")
      .required("Experience is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formPayload = new FormData();
      formPayload.append("name", values.name);
      formPayload.append("email", values.email);
      formPayload.append("phone", values.phone);
      formPayload.append("experience", values.experience);
      if (file) {
        formPayload.append("resume_url", file);
      }

      userLogin.mutate(formPayload, {
        onSuccess: () => {
          formik.resetForm();
          setFile(null);
          setFileReset(true);
        },
      });
    },
  });

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex-1 rounded-lg shadow-2xl shadow-black/30 bg-gray-50 pb-6 pt-8">
        <div className="w-full">
          {errorsList.message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md  relative mb-10 mx-auto w-11/12" role="alert">
              <span className="block sm:inline">{errorsList.message}</span>
            </div>
          )}
          <div className=" flex items-center justify-between ml-5 ">
            <div className="relative ">
              <InputField
                value={formik.values.name}
                onChange={formik.handleChange}
                required={true}
                className="peer  text-lg border-b-2 border-gray-300 bg-transparent leading-5 pt-4 px-3 pb-1 focus:outline-0  "
                type="text"
                id="name"
                name="name"
                placeholder=""
                error={
                  (formik.touched.name && formik.errors.name) || errorsList.name
                }
              />
              <label className="label-floating" htmlFor="name">
                Name
              </label>
            </div>
            <div className="relative">
              <InputField
                value={formik.values.email}
                onChange={formik.handleChange}
                type="email"
                name="email"
                className={
                  "peer  border-b-2 mr-10 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={
                  (formik.touched.email && formik.errors.email) ||
                  errorsList.email
                }
              />
              <label className="label-floating" htmlFor="email">
                Email
              </label>
            </div>
          </div>
          <div className="mt-5  flex items-center justify-start ml-5">
            <div className="relative">
              <InputField
                value={formik.values.phone}
                onChange={formik.handleChange}
                type="number"
                name="phone"
                className={
                  "peer border-b-2 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={
                  (formik.touched.phone && formik.errors.phone) ||
                  errorsList.phone
                }
              />
              <label className="label-floating" htmlFor="phone">
                Phone
              </label>
            </div>
            <div className="relative ml-7">
              <InputField
                type="number"
                value={formik.values.experience}
                onChange={formik.handleChange}
                name={"experience"}
                className={
                  "peer border-b-2 border-gray-300 mr-10  bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={
                  (formik.touched.experience && formik.errors.experience) ||
                  errorsList.experience
                }
              />
              <label className="label-floating" htmlFor="experience">
                Experience
              </label>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center ">
            <FileUploadInput
              id={"resume"}
              name={"resume"}
              accept={".pdf,.doc,.docx,.pptx"}
              onChange={handleFileChange}
              fileReset={fileReset}
              error={errorsList.resume}
            />
          </div>
          <div className="relative flex items-center justify-center mt-4">
            <SubmitButton
              type="submit"
              isPending={userLogin.isPending}
              text={"Submit"}
              className="group w-85 rounded-3xl px-10 py-2 font-semibold flex items-center justify-center bg-gradient-to-r from-[#ff3c57] to-[#ff7861] text-white whitespace-nowrap
                         hover:from-[#ff5e7b] hover:to-[#ff9b7c] hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300"
              children={
                <FaArrowAltCircleRight className="h-6 w-6 text-gray-50 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
