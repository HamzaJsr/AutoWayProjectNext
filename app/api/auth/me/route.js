import { NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";

// Route to get the current authenticated user's details
export async function GET(request) {
  // Extract the token from the Authorization header
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    // If there is no token, return a 401 Unauthorized response
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the token and get the user data
  const user = verifyToken(token);

  if (!user) {
    // If the token is invalid or expired, return a 401 Unauthorized response
    return NextResponse.json(
      { error: "Session éxpiré veuillez vous reconnecter" },
      { status: 401 }
    );
  }

  // Return the user details as a JSON response
  return NextResponse.json({ user }, { status: 200 });
}
