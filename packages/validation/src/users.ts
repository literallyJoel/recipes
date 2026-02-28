import { type } from "arktype";
import { serverGeneratedFields } from "./common";

export const userSchema = type({
  id: "string",
  name: "string",
  email: "string.email",
  emailVerified: "boolean",
  "image?": "string.url",
}).and(serverGeneratedFields.omit("id"));

export const sessionSchema = type({
  id: "string",
  expiresAt: "Date",
  token: "string",
  "ipAddress?": "string.ip",
  "userAgent?": "string",
  userId: "string",
});

export const accountSchema = type({
  id: "string",
  accountId: "string",
  providerId: "string",
  userId: "string",
  "accessToken?": "string",
  "refreshToken?": "string",
  "accessTokenExpiresAt?": "Date",
  "refreshTokenExpiresAt?": "Date",
  "scope?": "string",
  "password?": "string",
}).and(serverGeneratedFields.omit("id"));

export const verificationSchema = type({
  id: "string",
  identifier: "string",
  value: "string",
  expiresAt: "Date",
}).and(serverGeneratedFields.omit("id"));

export type User = typeof userSchema.infer;
export type Session = typeof sessionSchema.infer;
export type Account = typeof accountSchema.infer;
export type Verification = typeof verificationSchema.infer;
