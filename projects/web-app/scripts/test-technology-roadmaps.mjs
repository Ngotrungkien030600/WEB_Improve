import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRoadmapIdForRoute,
  ROADMAP_ROUTE_IDS,
  TECHNOLOGY_ROADMAPS,
} from '../src/data/technology-roadmaps.js';
import { LEARNING_TRACKS } from '../src/data/learning-paths.js';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const [routerSource, appSource, learningPathsPage, aiEngineerTab] = await Promise.all([
  readFile(resolve(projectDirectory, 'src/router/index.js'), 'utf8'),
  readFile(resolve(projectDirectory, 'src/App.vue'), 'utf8'),
  readFile(resolve(projectDirectory, 'src/pages/LearningPathsPage.vue'), 'utf8'),
  readFile(resolve(projectDirectory, 'src/pages/AiEngineerRoadmapTab.vue'), 'utf8'),
]);

const routePaths = [...routerSource.matchAll(/^\s*path:\s*(['"])(.*?)\1/gm)]
  .map((match) => match[2]);
const routeNames = new Set(
  [...routerSource.matchAll(/^\s*name:\s*(['"])(.*?)\1/gm)].map((match) => match[2]),
);
const pageRoutes = {
  'java-hub': 'JavaHubPage.vue',
  'java-tu-zero': 'JavaTuZeroPage.vue',
  'java-advanced-core': 'JavaAdvancedCorePage.vue',
  'java-thuc-chien': 'JavaThucChienPage.vue',
  'java-spring-boot': 'SpringSectionPage.vue',
  'java-backend-basics': 'BackendBasicsPage.vue',
  'java-backend-basics-lesson': 'BackendBasicsLessonPage.vue',
  'java-backend': 'BackendSectionPage.vue',
  'frontend-hub': 'FrontendHubPage.vue',
  'frontend-design-system': 'FrontendDesignSystemPage.vue',
  'frontend-frameworks': 'FrontendFrameworksPage.vue',
  'frontend-html-css': 'FrontendHtmlCssPage.vue',
  'frontend-javascript': 'FrontendJavaScriptPage.vue',
  'frontend-responsive': 'FrontendResponsivePage.vue',
  'frontend-ui-interview': 'FrontendUiInterviewPage.vue',
  ai: 'AiHubPage.vue',
  'ai-hub-sub': 'AiHubSubPage.vue',
  'ai-agent': 'AiAgentPage.vue',
  'go-interview': 'GoInterviewPage.vue',
  'the-way-to-go': 'TheWayToGoPage.vue',
  cloud: 'CloudHubPage.vue',
  'cloud-hub-sub': 'CloudHubSubPage.vue',
  'cloud-backend-deploy': 'CloudBackendDeployPage.vue',
  'cloud-section': 'CloudSectionPage.vue',
  devops: 'DevopsHubPage.vue',
  'devops-aws': 'DevopsAwsPage.vue',
  'devops-docker': 'DevopsDockerPage.vue',
  'devops-kubernetes': 'DevopsKubernetesPage.vue',
  'devops-terraform': 'DevopsTerraformPage.vue',
  'devops-cicd': 'DevopsCicdPage.vue',
  'devops-monitoring': 'DevopsMonitoringPage.vue',
  'devops-section': 'DevopsSectionPage.vue',
};

function routeExists(path) {
  const pathname = path.split(/[?#]/, 1)[0];

  return routePaths.some((routePath) => {
    if (routePath === pathname) {
      return true;
    }

    if (routePath.includes('(.*)')) {
      return false;
    }

    const expression = routePath
      .split('/')
      .map((segment) => (segment.startsWith(':') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      .join('/');

    return new RegExp(`^${expression}/?$`).test(pathname);
  });
}

for (const [routeName, pageName] of Object.entries(pageRoutes)) {
  assert.ok(routeNames.has(routeName), `Missing router entry for ${routeName}`);
  assert.ok(
    routerSource.includes(`../pages/${pageName}`),
    `Router entry ${routeName} does not load ${pageName}`,
  );
  assert.ok(ROADMAP_ROUTE_IDS[routeName], `Missing roadmap mapping for ${routeName}`);
  assert.ok(
    TECHNOLOGY_ROADMAPS[ROADMAP_ROUTE_IDS[routeName]],
    `Missing roadmap data for ${routeName}`,
  );
}

for (const routeName of Object.keys(ROADMAP_ROUTE_IDS)) {
  assert.ok(routeNames.has(routeName), `Roadmap mapping references unknown route ${routeName}`);
}

let nodeCount = 0;
let linkCount = 0;

for (const roadmap of Object.values(TECHNOLOGY_ROADMAPS)) {
  assert.ok(roadmap.id, 'Roadmap must have an id');
  assert.ok(roadmap.title, `${roadmap.id} must have a title`);
  assert.ok(Array.isArray(roadmap.nodes) && roadmap.nodes.length > 0, `${roadmap.id} has no nodes`);

  const nodeIds = new Set();
  for (const node of roadmap.nodes) {
    assert.ok(node.id && !nodeIds.has(node.id), `${roadmap.id} has a missing or duplicate node id`);
    assert.ok(node.phase, `${roadmap.id}/${node.id} has no stage label`);
    assert.ok(node.title, `${roadmap.id}/${node.id} has no title`);
    nodeIds.add(node.id);
    nodeCount += 1;

    if (node.path) {
      assert.ok(routeExists(node.path), `${roadmap.id}/${node.id} links to missing route ${node.path}`);
      linkCount += 1;
    }
  }
}

const overviewTracks = TECHNOLOGY_ROADMAPS.overview.nodes
  .filter((node) => node.id.startsWith('track-'))
  .map((node) => node.title);
assert.deepEqual(
  overviewTracks,
  LEARNING_TRACKS.map((track) => track.title),
  'Overview must show each existing learning track exactly once and in source order',
);

assert.equal(getRoadmapIdForRoute({ name: 'ai', query: { tab: 'engineer' } }), null);
assert.equal(getRoadmapIdForRoute({ name: 'ai', query: {} }), 'ai-platform');
assert.ok(learningPathsPage.includes('<CRoadmapDiagram roadmap-id="overview" />'));
assert.ok(aiEngineerTab.includes('<CRoadmapDiagram roadmap-id="ai-engineer" />'));
assert.ok(aiEngineerTab.includes("import CRoadmapDiagram from '../components/CRoadmapDiagram.vue'"));
assert.ok(appSource.includes('<CRoadmapDiagram'));

console.log(
  `Đã xác minh ${Object.keys(TECHNOLOGY_ROADMAPS).length} roadmap, ${nodeCount} chặng, `
  + `${linkCount} liên kết nội bộ và ${Object.keys(pageRoutes).length} route trang thuộc phạm vi.`,
);
