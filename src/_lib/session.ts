import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const key = new TextEncoder().encode("asd");

const cookieOptions = {
  name: "session",
  options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  duration: 7 * 24 * 60 * 1000,
};

export const encrypt = async (payload: JWTPayload) => (
  new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 week")
    .sign(key)
);

export const decrypt = async (token: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createSession = async (userId: string) => {
  const expiresAt = Date.now() + cookieOptions.duration;
  const token = await encrypt({ sub: userId, exp: expiresAt });

  (await cookies())
    .set(
      cookieOptions.name,
      token,
      {
        ...cookieOptions,
        expires: expiresAt,
      },
    );
};

export const verifySession = async () => {
  const cookie = (await cookies()).get(cookieOptions.name)?.value;
  
  if (!cookie) return;

  const payload = await decrypt(cookie);

  if (!payload?.sub) return;

  return { userId: payload.sub };
};

export const deleteSession = async (redirectUrl?: string) => {
  (await cookies()).delete(cookieOptions.name);
  if (redirectUrl) {
    redirect(redirectUrl);
  }
};