import { sendAnswerApi } from "@/app/api/answerApi/answerApi"
import { useMutation } from "@tanstack/react-query"

export const useAnswer=()=>{
    const sendAnswer=useMutation({
        mutationFn:async(answer:Record<number,string>)=>{
            return sendAnswerApi(answer);
        },
        onSuccess:(data)=>{
            console.log(data);
        },
        onError:(error)=>{
            console.log(error)
        }
    })
    return sendAnswer;
}