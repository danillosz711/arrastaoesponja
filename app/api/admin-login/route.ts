import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  console.log("Senha digitada:", password);
  console.log("Senha .env:", process.env.ADMIN_PASSWORD);

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({
      success: true,
    });
  }

  return NextResponse.json({
    success: false,
  });
}