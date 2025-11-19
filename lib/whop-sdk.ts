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

export const whopsdk = new Proxy({} as Whop, {
	get(_target, prop) {
		return getWhopSDK()[prop as keyof Whop];
	},
});
