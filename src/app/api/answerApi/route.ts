import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request:Request) {
    const {answer}=await request.json();
    console.log({answer});
    console.log("Reached in answer route");

    await new Promise((resolve)=>setTimeout(resolve,2000));
    return NextResponse.json({
        success:true,
        message:"Answer submitted sucessfully",
        data:{answer}
    })
}