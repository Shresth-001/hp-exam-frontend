import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const experience = formData.get("experience");

  console.log("reached in route");
  console.log({ name, email, phone, experience });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({
    success: true,
    message: "Form submitted successfully",
    data: { name, email, phone, experience },
  });
}
