'use server'

import { apiRequest } from "@/services/axiosServices/apiService";
import axios from "axios";

interface props{
    stream:string;
    set:string;
    token:string;
}
const allowedStreams = ['Frontend', 'Backend', 'Sales', 'Others'];
const allowedSet = ['A', 'B', 'C', 'D'];
export const StreamSend=async({set,stream,token}:props)=>{
    if (!stream || stream.trim() === "") {
        return { error: "Stream is required" };
  }
  if(!set||stream.trim()===""){
    return { error: "Set is required" };
  }
  if(!allowedStreams.includes(stream)){
    console.log("invalid stream")
  }
  if(!allowedSet.includes(set)){
    console.log("invalid set")
  }
  const API_URL=process.env.NEXT_PUBLIC_API_STREAM_URL;
  const data={
    jobRole:stream,
    paperSet:set
  }
  try {
    const response=await apiRequest('post','',data,{
        headers:{
            'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
          }
    })
    return response.data;
  } catch (error:any) {
    console.log("Error",error);
    console.log("Error in data",error.data);
    console.log("Error",error.response);
    throw error;
    // throw new Error(error);
  }
}