"use server";
import {apiRequest } from "@/services/axiosServices/apiService";
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  resume?: string;
  message?: string; 
}
export const Login = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const experience = formData.get("experience") as string;
  const resume = formData.get("resume_url") as File;
  const errors: FormErrors = {};
  if (!name || name.trim() === "") {
    errors.name = "Name is required.";
  }
  if (!email || email.trim() === "") {
    errors.email = "Email is required.";
  }
  if (!phone || phone.trim() === "") {
    errors.phone = "Phone is required.";
  }
  if (!experience || experience.trim() === "") {
    errors.experience = "Experience is required.";
  }
  if (!resume) {
    errors.resume = "Resume file is required.";
  }
  if (name && name.trim() !== "") {
    console.log("Validating name:", name);
    const nameRegex: RegExp = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(name)) {
      errors.name = "Name contains invalid characters.";
    }
  }

  if (email && email.trim() !== "") {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.email = "Email is invalid.";
    }
  }

  if (phone && phone.trim() !== "") {
    const phoneRegex: RegExp = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }
  }

  if (experience && experience.trim() !== "") {
    const expNum = Number(experience);
    if (isNaN(expNum) || expNum < 0) {
      errors.experience = "Experience must be a non-negative number.";
    }
  }

   if (Object.keys(errors).length > 0) {
    console.log("Error in details")
        return { status: 400, details: errors };
    }
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_URL1 = process.env.PUBLIC_API_URL;
  // try {
  //   console.log(formData.get("name"), formData.get("resume_url"));
  //   // const res = await axios.post(`${API_URL1}`, formData, {
  //   //   headers: { "Content-Type": "multipart/form-data" },
  //   // });
  //   const res=await apiRequest('post','',formData,{
  //     headers: { "Content-Type": "multipart/form-data" },
  //   })
  //   // console.log(res.data,"here in userLogin");
  //   // window.localStorage.setItem('token',res.data.token);
  //   console.log(res);
  //   return { success: true, data: res.data };
  // } catch (error: any) {
  //   if (error.response) {
  //     let errorMessage = "Server error"; 
  //     if (error.response.status === 404) {
  //       errorMessage = "The requested API endpoint was not found.";
  //     } else if (error.response.status === 400) {
  //       errorMessage = "Bad request: Check your form data.";
  //     } else if (error.response.status >= 500) {
  //       console.log(error.response)
  //       errorMessage = "Internal server error: The backend is having issues.";
  //     }
  //     return { 
  //               status: error.response.status, 
  //               details: { message: errorMessage } 
  //           };
  //   }
  //   return { 
  //     success: false, 
  //     errors: { message: "Network error. Please check your connection." } 
  //   };
  // }
  try {
    const res = await apiRequest("post", "/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      errors: { message: error.message || "Network or server error" },
    };
  }
};
