import { mkdir } from "node:fs/promises";
import pa11y, { type Pa11yIssue } from "pa11y";
import { startStaticServer } from "./server.js";

const PORT = 8127;
const ROOT = "public";
const SHOTS = "printscreens";

interface Target {
  file: string;
  label: string;
  expectClean: boolean;
}

const targets: Target[] = [
  { file: "accessible.html", label: "Accessible page", expectClean: true },
  { file: "inaccessible.html", label: "Inaccessible page", expectClean: false }
];

function countByType(issues: Pa11yIssue[]): Record<string, number> {
  return issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.type] = (acc[issue.type] ?? 0) + 1;
    return acc;
  }, {});
}

function printIssues(issues: Pa11yIssue[]): void {
  for (const issue of issues) {
    console.log(`  [${issue.type}] ${issue.code} (${issue.runner})`);
    console.log(`    ${issue.message}`);
    console.log(`    selector: ${issue.selector}`);
  }
}

async function run(): Promise<void> {
  await mkdir(SHOTS, { recursive: true });
  const server = await startStaticServer(ROOT, PORT);
  let failures = 0;

  for (const target of targets) {
    const result = await pa11y(`http://localhost:${PORT}/${target.file}`, {
      standard: "WCAG2AA",
      runners: ["htmlcs", "axe"],
      includeWarnings: true,
      screenCapture: `${SHOTS}/${target.file.replace(".html", "")}.png`
    });

    const errors = result.issues.filter((issue) => issue.type === "error");
    const counts = countByType(result.issues);
    const summary = Object.entries(counts).map(([type, n]) => `${n} ${type}`).join(", ") || "none";

    console.log("");
    console.log(`${target.label} -> ${target.file}`);
    console.log(`  title: ${result.documentTitle || "(missing)"}`);
    console.log(`  issues: ${summary}`);
    printIssues(result.issues);

    const passed = target.expectClean ? errors.length === 0 : errors.length > 0;
    console.log(`  expectation: ${target.expectClean ? "no errors" : "errors present"} -> ${passed ? "PASS" : "FAIL"}`);
    if (!passed) failures += 1;
  }

  server.close();
  console.log("");
  console.log(failures === 0 ? "All accessibility checks met expectations." : `${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
