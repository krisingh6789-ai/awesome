import { chromium } from "playwright";
import bundled from "@sparticuz/chromium";
import { inflate } from "../node_modules/@sparticuz/chromium/build/lambdafs.js";
export async function launchBrowser() {
	// Serverless Chromium brings the three NSS libraries missing in this sandbox.
	await inflate(
		new URL(
			"../node_modules/@sparticuz/chromium/bin/al2023.tar.br",
			import.meta.url,
		).pathname,
	);
	return chromium.launch({
		executablePath: process.env.CHROME_PATH || (await bundled.executablePath()),
		args: bundled.args.filter(
			(arg) =>
				![
					"--disable-web-security",
					"--allow-running-insecure-content",
				].includes(arg),
		),
		headless: true,
		env: {
			...process.env,
			LD_LIBRARY_PATH: `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}`,
		},
	});
}
