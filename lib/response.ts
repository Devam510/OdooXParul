// Standardized API response helpers

export function successResponse<T>(data: T, meta?: object, status = 200): Response {
  return Response.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): Response {
  return Response.json(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}
