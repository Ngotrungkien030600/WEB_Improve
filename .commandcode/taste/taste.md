- Prefers dedicated pages per learning domain (e.g., separate pages for interview prep vs. coding lessons) rather than combining everything into a single page. Confidence: 0.8

- Wants content view to scroll/reset to the top when navigating between topics/items — does not want the scroll position from the previous topic to carry over. Confidence: 0.9

- Prefers concise, high-trust task requests — gives minimal instructions (e.g. "run app", "run app cho tôi") and lets the agent autonomously discover project structure, entry points, and run logic. Confidence: 0.7

- Prefers communicating in Vietnamese — addresses the assistant in Vietnamese and expects responses in Vietnamese. Confidence: 0.8

- Prefers collapsible/grouped navigation over long flat lists — finds cluttered UI "rối rắm" and asks to group items into collapsible sections for clarity. Confidence: 0.8

- Wants content items (especially topic/section lists) to be rendered as clickable, interactive links rather than static text — prefers direct-access navigation. Confidence: 0.7

- Prefers preserving sidebar/collapsible-group UI state when navigating between items — does not want the entire sidebar to rebuild and collapse groups when a different item is selected. Confidence: 0.9

- Wants important features (especially AI/tool features) to be surfaced directly on the main/home page — not hidden behind secondary navigation links or subpages. Confidence: 0.7

- Prefers floating UI widgets (e.g., timers) to be compact and positioned in corners so they do not obstruct or overlap main content — strongly dislikes elements that cover the interface. Confidence: 0.8

- Wants learning content to be comprehensive, covering a complete path from basic to advanced topics (e.g., Spring Boot, REST, JPA, Security, Docker, Kafka, Microservices) — not limited to just introductory or beginner material. Confidence: 0.9

- Prefers AI/tool features to support real conversational interaction (back-and-forth chat) rather than single-shot submit-and-evaluate workflows — expects a chat-based interface for AI assistance. Confidence: 0.9

- Expects UI elements to be visually polished and aesthetically pleasing, not just functional — explicitly flags buttons/styling as "xấu" (ugly) when they lack refinement. Confidence: 0.7

- When expanding a collapsible group in a sidebar/topic navigation, expects the first item in that group to be auto-selected/displayed immediately — does not want to click expand and then click again to select an item. Confidence: 0.8

- Prefers replacing/upgrading existing features with better alternatives rather than adding new features alongside old ones — chose to replace the existing AI chat with BMAD agents instead of adding BMAD as a separate tab. Confidence: 0.7

- Prefers multi-agent/collaborative AI interactions (Party Mode) — actively chose to include a mode where multiple specialized AI personas respond to the same query in a roundtable format. Confidence: 0.8

- Prefers having a diverse set of specialized AI personas available (e.g., Business Analyst, Technical Writer, PM, UX Designer, Architect, Engineer) rather than a single generic AI assistant — chose all 6 BMAD agents. Confidence: 0.8

- When fixing frontend JS errors during local development, prefers a **comprehensive** cache-prevention approach: both client-side cache-busting version parameters (`?v=N`) on script/link tags **and** server-side HTTP cache-control headers (`Cache-Control: no-cache, no-store, must-revalidate`) to ensure fresh content is always served — rather than only fixing the code and expecting a manual hard refresh. Confidence: 0.9

- Prefers the main agent/tool selection grid to always remain visible on the page, even when a chat session is active — does not want the grid to be hidden or replaced by the chat view; wants chat to appear below the grid instead. Confidence: 0.9