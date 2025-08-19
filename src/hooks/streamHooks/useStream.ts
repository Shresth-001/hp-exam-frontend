import { StreamSend } from "@/app/api/streamApi/streamApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";

interface props{
    stream:string;
    set:string;
}
export const useStream=()=>{
     const [redirectToInstruction,setRedirectToInstruction]= useState<boolean>(false);
     const queryClient=useQueryClient();
    const sendStream=useMutation({
        mutationFn:async(data:props)=>{
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('token is not found');
            }
            return await StreamSend({...data,token});
        },
        onSuccess:(data)=>{
            console.log("success on success in stream");
            // console.log()
            if(data){
                // console.log(data);
                console.log(data.data.questions);
                queryClient.setQueryData(['streamData'],{streamData:data.data});
                queryClient.setQueryData(['questions'],{questionSet:data.data.questions});
                setRedirectToInstruction(true);
            }
        },
        onError:(error)=>{
            // console.log()
            console.log(error);
        },
    })
    return {sendStream,redirectToInstruction}
}