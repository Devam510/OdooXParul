import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Access token: 15 minutes
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

// Refresh token: 7 days
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}

// Extract token from Authorization header
export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.split(" ")[1];
}

// HOF wrapper for protected API routes
export function withAuth(
  handler: (req: NextRequest, payload: JWTPayload) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    const token = extractToken(req);
    if (!token) {
      return Response.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
    try {
      const payload = verifyAccessToken(token);
      return handler(req, payload);
    } catch {
      return Response.json(
        { success: false, error: { code: "TOKEN_INVALID", message: "Invalid or expired token" } },
        { status: 401 }
      );
    }
  };
}

// HOF wrapper for admin-only API routes
export function withAdmin(
  handler: (req: NextRequest, payload: JWTPayload) => Promise<Response>
) {
  return withAuth(async (req, payload) => {
    if (payload.role !== "ADMIN") {
      return Response.json(
        { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }
    return handler(req, payload);
  });
}
