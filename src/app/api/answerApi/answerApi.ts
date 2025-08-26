'use server'
import { apiRequest } from "@/services/axiosServices/apiService";
import axios from "axios";
interface answerApiProps {
  answer: Record<number, string>;
  token: string|null;
  jobRole: "Frontend" | "Backend" | "Sales" | "Others";
  paperSet: "A" | "B" | "C" | "D";
}
export const sendAnswerApi = async ({
  answer,
  jobRole,
  paperSet,
  token,
}: answerApiProps) => {
  try {
    console.log(answer,jobRole,paperSet,token);
    const data = {
      jobRole: jobRole,
      paperSet: paperSet,
      answers: answer,
    };
    const response = await apiRequest("post", "responses/submit", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error:any) {
    console.log("Error",error);
    throw error;
  }
};
