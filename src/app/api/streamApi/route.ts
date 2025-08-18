import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { stream, set } = await request.json();
  // console.log("reached in route",stream,set);
  const to = process.env.DEMO_TOKEN;
  const token = request.headers.get("Authorization");
  // console.log(token," ",to)
  // console.log("Bearer"+to)
  const t = "Bearer" + to;
  if (token) {
    if (t.includes(token)) {
      console.log("Token matched");
    }
  }
  console.log({ stream, set });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({
    success: true,
    message: "Stream submitted successfully",
    data: { stream, set },
  });
}
