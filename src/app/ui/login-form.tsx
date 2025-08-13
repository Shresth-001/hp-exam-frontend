"use client";
import InputField from "@/components/inputFields/inputField";
import SubmitButton from "@/components/button/submitButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useState } from "react";
import FileUploadInput from "@/components/inputFields/fileUploadFIelds";
import { useLogin } from "@/hooks/loginHooks/useLogin";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  api?:string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
  });
  const { errorsList,userLogin } = useLogin();
  const [file, setFile] = useState<File | null>(null);
  const [errorList, setErrorList] = useState<FormErrors>({});
  const [fileReset,setFileReset]=useState<boolean>(false);

  const handleformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log("reached")
    let newerrors: FormErrors = {};
    if (!formData.name.trim()) {
      newerrors.name = "Name is Empty";
    } else if (!formData.email.trim()) {
      newerrors.email = "Email is Empty";
    } else if (!formData.phone.trim()) {
      newerrors.phone = "Phone is Empty";
    } else if (!formData.experience.trim()) {
      newerrors.experience = "Experience is Empty";
    }
    if (Object.keys(newerrors).length > 0) {
      setErrorList(newerrors);
      return;
    }
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone);
    formPayload.append("experience", formData.experience);
    if (file) {
      formPayload.append("resume", file);
    }
    try {
      const response = userLogin.mutate(formPayload);
      // console.log(response);
    setFormData({ name: "", email: "", phone: "", experience: "" });
    setFile(null);
    setErrorList({});
    setFileReset(true);
    // setErrorList([])
  } catch (error: any) {
    if (error?.status === 400 && Array.isArray(error.details)) {
      setErrorList(error.details);
    } else {
      setErrorList({ api: error.message || "An unexpected error occurred." });
    }
  }
  };
  const handleClearError=()=>{

  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg shadow-2xl shadow-black/30 bg-gray-50 pb-6 pt-8">
        <div className="w-full">
          <div className=" flex items-center justify-between ml-5 ">
            <div className="relative ">
              <InputField
                value={formData.name}
                onChange={handleformChange}
                required={true}
                className="peer  text-lg border-b-2 border-gray-300 bg-transparent leading-5 pt-4 px-3 pb-1 focus:outline-0  "
                type="text"
                id="name"
                name="name"
                placeholder=""
                error={errorList.name||errorsList.name}
              />
              <label className="label-floating" htmlFor="name">
                Name
              </label>
            </div>
            <div className="relative">
              <InputField
                value={formData.email}
                onChange={handleformChange}
                type="email"
                name="email"
                className={
                  "peer  border-b-2 mr-10 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={errorList.email||errorsList.email}
              />
              <label className="label-floating" htmlFor="email">
                Email
              </label>
            </div>
          </div>
          <div className="mt-5  flex items-center justify-start ml-5">
            <div className="relative">
              <InputField
                value={formData.phone}
                onChange={handleformChange}
                type="number"
                name="phone"
                className={
                  "peer border-b-2 border-gray-300 bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={errorList.phone||errorsList.phone}
              />
              <label className="label-floating" htmlFor="phone">
                Phone
              </label>
            </div>
            <div className="relative ml-7">
              <InputField
                type="number"
                value={formData.experience}
                onChange={handleformChange}
                name={"experience"}
                className={
                  "peer border-b-2 border-gray-300 mr-10  bg-transparent pt-4 px-3 pb-1  text-lg leading-5 focus:outline-0"
                }
                placeholder={""}
                error={errorList.experience||errorsList.experience}
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
