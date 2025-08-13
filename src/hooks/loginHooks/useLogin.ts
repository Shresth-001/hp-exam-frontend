import { Login } from "@/app/api/userLogin/userLogin"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

export const useLogin=()=>{
  const [errorsList, setErrorList] = useState<Record<string, string>>({});
 const userLogin=useMutation({
    mutationFn:async(payload:FormData)=>{
        console.log("reached")
        const response=await Login(payload);
        return response;
    },
   onError: (error: any) => {
  if (error?.status === 400 && error?.details) {
    console.error("Validation Errors from API:", error.details);
     setErrorList(error.details);
    return error;
  } else {
    return error;
  }
},
    onSuccess:()=>{
        console.log("sucess")
    }
 })   
 return {errorsList,userLogin};
}