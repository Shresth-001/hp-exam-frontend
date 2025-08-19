import { Login } from "@/app/api/userLogin/userLogin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
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
      // console.log("reached");
      // console.log(response);
      return response;
    },
    onSuccess: (response:any) => {
      console.log(response.data);
      if(response.status!==200){
        setErrorList(response.details)
      }
       if (response.success) {
        queryClient.setQueryData(['userData'],{userData:response.data});
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        setErrorList({});
        setReDirectToDashBoard(true);
      } else {
        setErrorList(response.details || { message: "Something went wrong" });
      }
    },
    onError:()=>{
      console.log("Error in on error")
    },
  });
    // onError: (error: any) => {
    //   console.log(error?.status);
    //   if (error?.status === 400 && error?.details) {
    //     setErrorList(error.details);
    //     return error;
    //   } else if (error?.status) {
    //     setErrorList({
    //       message: error.message || "An unexpected server error occurred.",
    //     });
    //   } else if (error?.status === 500) {
    //     setErrorList({
    //       message: "Internal Server Error",
    //     });
    //   } else {
    //     setErrorList({
    //       message: "An unknown error occurred. Please try again.",
    //     });
    //   }
    // },
  //   onSuccess: (response) => {
  //      console.log("reached in sucess");
  //      console.log(response.data);
  //     if (response.status !== 200) {
  //       if (response.details) {
  //         setErrorList(response.details);
  //       }
  //     } else if(response.success) {
  //       console.log("here in useLogin hooks")
  //         setErrorList({});
  //         redirect("/dashboard/stream-selection");
  //     }
  //     if(response.success&&response.data.token){
  //       localStorage.setItem("token", response.data.token);
  //       setReDirectToDashBoard(true);
  //     }
  //   },
  // });
  return { errorsList, userLogin, setErrorList ,reDirectToDashBoard};
};
