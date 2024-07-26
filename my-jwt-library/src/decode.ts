// src/decode.ts

import * as crypto from "crypto";

export const decode_jwt = (secret: string, jwt: string) => {
  const [headerEncoded, bodyEncoded, signature] = jwt.split(".");

  // Base64 URL Decode
  const header = Buffer.from(
    headerEncoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(
        headerEncoded.length + ((4 - (headerEncoded.length % 4)) % 4),
        "="
      ), // Add padding
    "base64"
  ).toString("utf8");

  const body = Buffer.from(
    bodyEncoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(bodyEncoded.length + ((4 - (bodyEncoded.length % 4)) % 4), "="), // Add padding
    "base64"
  ).toString("utf8");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove padding

  if (signature !== expectedSignature) {
    throw new Error("Invalid JWT signature");
  }

  const parsedHeader = JSON.parse(header);
  const parsedBody = JSON.parse(body);

  const { id, exp, ...payload } = parsedBody;

  if (exp && Date.now() / 1000 > exp) {
    throw new Error("JWT has expired");
  }

  return {
    id,
    payload,
    expires_at: exp ? new Date(exp * 1000) : null,
  };
};

export const validate_jwt = (secret: string, jwt: string): boolean => {
  try {
    decode_jwt(secret, jwt);
    return true;
  } catch {
    return false;
  }
};
