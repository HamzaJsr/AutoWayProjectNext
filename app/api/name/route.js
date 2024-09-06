import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ name: "Hamza" }, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*"); // Ajouter des en-têtes CORS
  return response;
}
