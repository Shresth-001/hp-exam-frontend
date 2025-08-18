import { StreamSend } from "@/app/api/streamApi/streamApi";
import { useMutation } from "@tanstack/react-query"

interface props{
    stream:string;
    set:string;
}
export const useStream=()=>{
 
    const sendStream=useMutation({
        mutationFn:async(data:props)=>{
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('token is not found');
            }
            const response=await StreamSend({...data,token});
        },
        onSuccess:()=>{
            console.log("success");
        },
        onError:(error)=>{
            console.log(error);
        },
    })
    return {sendStream}
}