// lib/auth.js

import jwt from "jsonwebtoken";

// eslint-disable-next-line no-undef
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
