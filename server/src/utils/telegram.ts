import crypto from "crypto";

export function validateTelegramData(botToken: string, initDataString: string) {
  const params = new URLSearchParams(initDataString);
  const hash = params.get("hash");
  params.delete("hash");
  params.sort();

  const dataCheckString = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) {
    throw new Error("Invalid hash: Data integrity check failed");
  }

  const data: Record<string, any> = Object.fromEntries(params.entries());

  if (data.user) {
    try {
      data.user = JSON.parse(data.user);
    } catch (e) {
      console.error("Failed to parse user data JSON");
    }
  }

  return data;
}
