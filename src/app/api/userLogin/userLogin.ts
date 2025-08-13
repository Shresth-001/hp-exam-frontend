'use server'
import axios from "axios";
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  resume?:string;
}
export const Login = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const experience = formData.get("experience") as string;
  const resume = formData.get("resume") as File;
  const errors: FormErrors = {};
  if (!name || name.trim() === "") {
    errors.name=("Name is required.");
  }
  if (!email || email.trim() === "") {
    errors.email=("Email is required.");
  }
  if (!phone || phone.trim() === "") {
    errors.phone=("Phone is required.");
  }
  if (!experience || experience.trim() === "") {
    errors.experience=("Experience is required.");
  }
  if (!resume) {
    errors.resume=("Resume file is required.");
  }
  if (name && name.trim() !== "") {
    console.log("Validating name:", name);
    const nameRegex: RegExp = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(name)) {
      errors.name=("Name contains invalid characters.");
    }
  }

  if (email && email.trim() !== "") {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.email=("Email is invalid.");
    }
  }

  if (phone && phone.trim() !== "") {
    const phoneRegex: RegExp = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone=("Phone number must be 10 digits.");
    }
  }

  if (experience && experience.trim() !== "") {
    const expNum = Number(experience);
    if (isNaN(expNum) || expNum < 0) {
      errors.experience=("Experience must be a non-negative number.");
    }
  }

  if (Object.keys(errors).length>0) {
    console.log("Validation failed");
    const err = new Error("Validation failed") as any;
    err.status = 400;
    err.details = errors;
    throw err;
  }
  try {
    console.log(formData.get("name"), formData.get("resume"));
    console.log("successfull hit");
    const res = await axios.post("", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const err = new Error(error.response.data.error || "Server error") as any;
      err.status = error.response.status;
      err.details = error.response.data.details;
      throw err;
    }
    throw error;
  }
};
