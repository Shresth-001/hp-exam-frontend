import { apiRequest } from "@/services/axiosServices/apiService"
import axios from "axios";

export const sendAnswerApi=async(answer:Record<number,string>)=>{
    try {
        // const res=await apiRequest('post','',{answer});
        const res=await axios.post('http://localhost:3000/api/answerApi',{answer},{
            headers:{
                "Content-Type":"application/json"
            }
        })
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}