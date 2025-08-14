'use server'

import axios from "axios";

interface props{
    stream:string;
    set:string;
    token:string;
}
const allowedStreams = ['frontend', 'backend', 'sales', 'other'];
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
  const API_URL=process.env.NEXT_PUBLIC_API_URL;
  const data={
    stream:stream,
    set:set
  }
  try {
    const response=await axios.post(`${API_URL}/api/streamApi`,data,{
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer${token}`
            }
    })
  } catch (error) {
    console.log("Error");
  }
}