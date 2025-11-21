import { Whop } from "@whop/sdk";

let whopsdkInstance: Whop | null = null;

function getWhopSDK(): Whop {
  if (!whopsdkInstance) {
    whopsdkInstance = new Whop({
      appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
      apiKey: process.env.WHOP_API_KEY,
      webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""),
    });
  }
  return whopsdkInstance;
}

/**
 * Main Whop SDK proxy (lets you call whopsdk.courses..., etc)
 */
export const whopsdk = new Proxy({} as Whop, {
  get(_target, prop) {
    return getWhopSDK()[prop as keyof Whop];
  },
});

/**
 * Wrapper to expose verifyUserToken() cleanly
 * The official Whop SDK includes this method.
 */
export async function verifyUserToken(headers: Headers | Record<string, string>) {
  const sdk = getWhopSDK();

  // @ts-ignore — method exists at runtime in Whop SDK
  if (typeof sdk.verifyUserToken !== "function") {
    throw new Error("verifyUserToken is not available on Whop SDK. Update @whop/sdk.");
  }

  // Call the real method in the SDK
  // @ts-ignore
  return sdk.verifyUserToken(headers);
}
