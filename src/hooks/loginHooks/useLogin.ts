import { Login } from "@/app/api/userLogin/userLogin";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  resume?: string;
  message?: string;
}

export const useLogin = () => {
  const [errorsList, setErrorList] = useState<FormErrors>({});
  const userLogin = useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await Login(payload);
      return response;
    },
    onError: (error:any) => {
      console.log(error?.status);
      if (error?.status === 400 && error?.details) {
        setErrorList(error.details);
        return error;
      } else if (error?.status) {
        setErrorList({
          message: error.message || "An unexpected server error occurred.",
        });
      }else if(error?.status===500){
        setErrorList({
            message: "Internal Server Error",
        })
      } 
      else  {
        setErrorList({
          message: "An unknown error occurred. Please try again.",
        });
      }
    },
    onSuccess: (response) => {
     if (response.status !== 200) {
                if(response.details){
                setErrorList(response.details);
              }
            } else {
                setErrorList({});
            }
    },
  });
  return { errorsList, userLogin, setErrorList };
};
