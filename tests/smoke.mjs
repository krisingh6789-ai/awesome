import { launchBrowser } from "./browser.mjs";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:4173");
await page
	.getByRole("heading", { name: "A little better, every day." })
	.waitFor();
await page.screenshot({ path: "/tmp/abhyas-dashboard.png", fullPage: true });
console.log("Dashboard loaded", errors);
await page
	.getByRole("button", { name: "Continue learning", exact: true })
	.click();
await page
	.getByRole("heading", { name: "Fundamental Rights", exact: true, level: 1 })
	.waitFor();
await page.getByRole("button", { name: "Practice topic MCQs" }).click();
await page.getByRole("button", { name: "C Article 32" }).click();
await page.getByRole("button", { name: "Check answer", exact: true }).click();
await page.getByText("Well reasoned.").waitFor();
page.on("dialog", (dialog) => dialog.accept());
await page.getByRole("button", { name: "Finish & analyze" }).click();
await page.getByRole("heading", { name: "A step forward." }).waitFor();
await page.getByRole("button", { name: "Back to your workspace" }).click();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Resources", exact: true })
	.click();
await page.getByRole("button", { name: "Create note" }).click();
await page.getByLabel("Title", { exact: true }).fill("Test persistence");
await page
	.getByLabel("Note · plain text / Markdown")
	.fill("A durable offline note");
await page.getByRole("button", { name: "Save note offline" }).click();
await page.getByRole("heading", { name: "Test persistence" }).waitFor();
await page
	.locator(".sidebar")
	.getByRole("button", { name: /Revision/ })
	.first()
	.click();
await page.getByRole("button", { name: "Review due cards" }).click();
await page.locator(".flashcard").click();
await page.getByRole("button", { name: "Remembered" }).click();
await page.getByRole("heading", { name: "Card 2 of 105" }).waitFor();
await page.getByRole("button", { name: "Close dialog" }).click();
for (const name of ["Study", "Practice", "Writing", "Analytics"]) {
	await page
		.locator(".sidebar")
		.getByRole("button", { name, exact: true })
		.click();
	await page.locator(".page-head h1").waitFor();
}
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Study planner", exact: true })
	.click();
await page.getByRole("button", { name: "Add task", exact: true }).click();
await page.getByLabel("What will you work on?").fill("Read polity");
await page.getByRole("button", { name: "Add to plan" }).click();
await page.getByText("Read polity", { exact: true }).waitFor();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Dashboard", exact: true })
	.click();
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload();
await page
	.getByRole("heading", { name: "A little better, every day." })
	.waitFor();
await page.context().setOffline(true);
await page.reload();
await page
	.getByRole("heading", { name: "A little better, every day." })
	.waitFor();
await page
	.locator(".sidebar")
	.getByRole("button", { name: "Resources", exact: true })
	.click();
await page.getByRole("heading", { name: "Test persistence" }).waitFor();
console.log("Offline reload + persisted note passed");
await page.setViewportSize({ width: 390, height: 844 });
await page
	.locator(".bottom-nav")
	.getByRole("button", { name: "Home", exact: true })
	.click();
await page.screenshot({ path: "/tmp/abhyas-mobile.png", fullPage: true });
const overflow = await page.evaluate(
	() => document.documentElement.scrollWidth > innerWidth,
);
console.log({ errors, mobileOverflow: overflow });
if (errors.length || overflow) process.exitCode = 1;
await browser.close();
