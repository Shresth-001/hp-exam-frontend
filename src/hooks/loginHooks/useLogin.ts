import { Login } from "@/app/api/userLogin/userLogin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [reDirectToDashBoard, setReDirectToDashBoard] = useState<boolean>(false);
  const queryClient=useQueryClient();
  const userLogin = useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await Login(payload);
      return response;
    },
    onSuccess: (response:any) => {
      console.log(response);
      console.log(response.data);
      if(response.status!==200){
        setErrorList(response.details)
      }
       if (response.success) {
        localStorage.clear();
        queryClient.setQueryData(['userData'],{userData:response.data});
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        setErrorList({});
        setReDirectToDashBoard(true);
      } else {
        setErrorList(response.details || { message: response.errors.message });
      }
    },
    onError:()=>{
      console.log("Error in on error")
    },
  });
  return { errorsList, userLogin, setErrorList ,reDirectToDashBoard};
};
