# Edge Case Hunter Review Prompt

Invoke the `bmad-review-edge-case-hunter` skill and exhaustively review the current feature diff relative to baseline commit `ecfabe37a338cf4ec9c9829405ffdcb627fbd899`.

Review only these feature files:

- `projects/web-app/src/App.vue`
- `projects/web-app/src/pages/LearningPathsPage.vue`
- `projects/web-app/src/pages/AiEngineerRoadmapTab.vue`
- `projects/web-app/src/components/CRoadmapDiagram.vue`
- `projects/web-app/src/data/technology-roadmaps.js`
- `projects/web-app/scripts/test-technology-roadmaps.mjs`
- `_bmad-output/implementation-artifacts/spec-visual-learning-roadmaps.md`

Exclude every change under `projects/web-app/dist/**`; those are pre-existing user changes.

Approved intent: add one shared roadmap to `/learning-paths` and technology diagrams for Java/Backend, Frontend, AI/AI Engineer, AI Agent, Go, Cloud, DevOps and AWS/Docker/Kubernetes/Terraform/CI-CD/Monitoring. Diagrams must use inline accessible responsive SVG, link only to working routes, and preserve existing page content and progress behavior.

Check edge cases including mobile and wide layouts, empty/malformed roadmap data, route parameters/query strings, keyboard navigation, SVG accessibility semantics, browser modifier clicks/history, Vue rendering and transitions, and regression to existing progress/page interactions.

Report only actionable unhandled edge cases with file and line, scenario and user consequence; explicitly report if none are found. Do not edit files.
