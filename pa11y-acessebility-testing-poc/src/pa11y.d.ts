declare module "pa11y" {
  export interface Pa11yIssue {
    code: string;
    context: string;
    message: string;
    selector: string;
    type: "error" | "warning" | "notice";
    typeCode: number;
    runner: string;
  }

  export interface Pa11yResult {
    documentTitle: string;
    pageUrl: string;
    issues: Pa11yIssue[];
  }

  export interface Pa11yOptions {
    standard?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
    runners?: string[];
    includeNotices?: boolean;
    includeWarnings?: boolean;
    screenCapture?: string;
    timeout?: number;
    ignore?: string[];
  }

  export default function pa11y(url: string, options?: Pa11yOptions): Promise<Pa11yResult>;
}
