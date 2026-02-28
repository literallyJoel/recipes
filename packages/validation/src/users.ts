import { type } from "arktype";
import { ServerGeneratedFields } from "./common";

export const userSchema = type({
  id: "string",
  name: "string",
  email: "string.email",
  emailVerified: "boolean",
  "image?": "string.url",
}).and(ServerGeneratedFields.omit("id"));

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
  provierId: "string",
  userId: "string",
  "accessToken?": "string",
  "refreshToken?": "string",
  "accessTokenExpiresAt?": "Date",
  "refreshTokenExpiresAt?": "Date",
  "scope?": "string",
  "password?": "string",
}).and(ServerGeneratedFields.omit("id"));

export const verificationSchema = type({
  id: "string",
  identifier: "string",
  value: "string",
  expiresAt: "Date",
}).and(ServerGeneratedFields.omit("id"));

export type User = typeof userSchema.infer;
export type Session = typeof sessionSchema.infer;
export type Account = typeof accountSchema.infer;
export type Verification = typeof verificationSchema.infer;