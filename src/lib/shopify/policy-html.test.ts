import { describe, expect, it } from "vitest";
import { sanitizePolicyHtml } from "./policy-html";
describe("Shopify policy HTML boundary", () => {
  it("removes executable content, remote embeds and merchant styling", () => {
    const result = sanitizePolicyHtml(
      '<script>alert(1)</script><style>body{display:none}</style><p onclick="bad()" style="color:red">Policy</p><iframe src="https://tracker.example"></iframe><img src="https://tracker.example/pixel">',
    );
    expect(result).toBe("<p>Policy</p>");
  });
  it("rejects unsafe URLs but retains contact links and semantic sections", () => {
    const result = sanitizePolicyHtml(
      '<h1>Terms</h1><a href="javascript:alert(1)">bad</a><a href="//tracker.example">bad</a><a href="mailto:dione.smith@infusiondiffusion.co.za">Contact</a><ul><li>Returns</li></ul>',
    );
    expect(result).toBe(
      '<h2>Terms</h2><a>bad</a><a>bad</a><a href="mailto:dione.smith@infusiondiffusion.co.za">Contact</a><ul><li>Returns</li></ul>',
    );
  });
});
