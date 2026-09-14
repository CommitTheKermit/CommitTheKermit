import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./script.js", import.meta.url), "utf8");
const events = [];
const link = { dataset: { trackLink: "github" }, addEventListener: (_, handler) => handler() };
const section = { dataset: { trackSection: "about" } };
const context = {
  window: { clarity: (...args) => events.push(args) },
  document: {
    documentElement: { dataset: { clarityProjectId: "test-project" } },
    createElement: () => ({}),
    head: { append: (script) => assert.equal(script.src, "https://www.clarity.ms/tag/test-project") },
    querySelectorAll: (selector) => selector === "[data-track-link]" ? [link] : [section],
  },
  IntersectionObserver: class {
    constructor(callback) { this.callback = callback; }
    observe(target) { this.callback([{ target, isIntersecting: true }]); }
  },
};

vm.runInNewContext(source, context);
assert.deepEqual(events, [["event", "link_github"], ["event", "section_about"]]);
console.log("tracking script ok");
