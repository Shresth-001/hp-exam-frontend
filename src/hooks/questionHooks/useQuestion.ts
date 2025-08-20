import { useQuery, useQueryClient } from "@tanstack/react-query";

interface questionType{
    id:number;
    options:string[];
    question_text:string;
    question_type:string;
}
interface CachedQuestion{
    questionSet:questionType[];
}
export const useQuestion=()=>{
    // const queryClient=useQueryClient();
    const{data:questions,isLoading,isError,error}=useQuery<CachedQuestion>({
        queryKey:['questions'],
        queryFn:async()=>{
            if(!navigator.onLine){
                throw new Error("offline no fetching")
            }
            return {questionSet:[]};
        },
        staleTime:Infinity,
        networkMode:'offlineFirst',
    });
    console.log(questions);
    return {questions,isLoading,isError,error};
};