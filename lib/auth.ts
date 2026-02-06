const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "135622";

function makeToken(password: string): string {
  return Buffer.from(`gh-admin:${password}:verified`).toString("base64");
}

export function checkPassword(password: string): string | null {
  if (password === ADMIN_PASSWORD) return makeToken(password);
  return null;
}

export function validateToken(token: string): boolean {
  return token === makeToken(ADMIN_PASSWORD);
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAuth(req: Request): boolean {
  const token = getTokenFromRequest(req);
  return token ? validateToken(token) : false;
}
