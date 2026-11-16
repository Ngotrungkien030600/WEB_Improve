<template>
  <section v-if="roadmap" class="c-roadmap" :aria-labelledby="headingId">
    <header class="c-roadmap__header">
      <p class="c-roadmap__eyebrow">LỘ TRÌNH HỌC</p>
      <h2 :id="headingId">{{ roadmap.title }}</h2>
      <p class="c-roadmap__description">{{ roadmap.description }}</p>
    </header>

    <svg
      class="c-roadmap__svg"
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      role="group"
      :aria-labelledby="svgTitleId"
      :aria-describedby="svgDescriptionId"
    >
      <title :id="svgTitleId">{{ roadmap.title }}</title>
      <desc :id="svgDescriptionId">{{ accessibleSummary }}</desc>
      <defs>
        <marker
          :id="markerId"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
        </marker>
      </defs>

      <g class="c-roadmap__connectors" aria-hidden="true">
        <path
          v-for="(connector, index) in layout.connectors"
          :key="`connector-${index}`"
          :d="connector.path"
          :marker-end="connector.arrow ? `url(#${markerId})` : undefined"
        />
      </g>

      <g role="list" :aria-label="`Các chặng trong ${roadmap.title}`">
        <g
          v-for="(node, index) in layout.nodes"
          :key="node.id"
          class="c-roadmap__node"
          :class="{ 'c-roadmap__node--linked': node.path }"
          role="listitem"
        >
          <a
            v-if="node.path"
            :href="node.path"
            :aria-label="`${node.phase}: ${node.title}. ${node.description || ''} Mở nội dung liên quan.`"
            @click="handleNavigation($event, node.path)"
          >
            <rect
              class="c-roadmap__card"
              :x="node.x"
              :y="node.y"
              :width="layout.nodeWidth"
              :height="layout.nodeHeight"
              rx="14"
            />
            <text class="c-roadmap__phase" :x="node.x + 18" :y="node.y + 25">{{ node.phase }}</text>
            <text class="c-roadmap__title" :x="node.x + 18" :y="node.y + 51">
              <tspan
                v-for="(line, lineIndex) in node.titleLines"
                :key="`${node.id}-title-${lineIndex}`"
                :x="node.x + 18"
                :dy="lineIndex === 0 ? 0 : 17"
              >{{ line }}</tspan>
            </text>
          </a>
          <g v-else role="group" :aria-label="`${node.phase}: ${node.title}. ${node.description || ''}`">
            <rect
              class="c-roadmap__card c-roadmap__card--start"
              :x="node.x"
              :y="node.y"
              :width="layout.nodeWidth"
              :height="layout.nodeHeight"
              rx="14"
            />
            <text class="c-roadmap__phase" :x="node.x + 18" :y="node.y + 25">{{ node.phase }}</text>
            <text class="c-roadmap__title" :x="node.x + 18" :y="node.y + 51">
              <tspan
                v-for="(line, lineIndex) in node.titleLines"
                :key="`${node.id}-title-${lineIndex}`"
                :x="node.x + 18"
                :dy="lineIndex === 0 ? 0 : 17"
              >{{ line }}</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>

    <p class="c-roadmap__note">
      Mỗi chặng có thể mở nội dung tương ứng; các bước không có liên kết là thông tin định hướng.
    </p>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRoadmap, getRoadmapIdForRoute } from '../data/technology-roadmaps.js';

const props = defineProps({
  roadmapId: {
    type: String,
    default: '',
  },
});

const route = useRoute();
const router = useRouter();
const compact = ref(false);
const baseId = useId().replaceAll(':', '');
const headingId = `${baseId}-heading`;
const svgTitleId = `${baseId}-svg-title`;
const svgDescriptionId = `${baseId}-svg-description`;
const markerId = `${baseId}-arrow`;
const currentRoadmapId = computed(() => props.roadmapId || getRoadmapIdForRoute(route));
const roadmap = computed(() => getRoadmap(currentRoadmapId.value));
const accessibleSummary = computed(() => {
  if (!roadmap.value) {
    return '';
  }

  if (roadmap.value.layout === 'branches') {
    const [start, ...branches] = roadmap.value.nodes;
    return `${start.title}. Chọn một trong các nhánh: ${branches.map((node) => node.title).join(', ')}.`;
  }

  return roadmap.value.nodes
    .map((node) => `${node.phase}: ${node.title}`)
    .join('. ');
});

function updateLayout() {
  compact.value = window.matchMedia('(max-width: 640px)').matches;
}

function wrapTitle(title, maxLength) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && candidate.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.slice(0, 2);
}

const layout = computed(() => {
  if (!roadmap.value) {
    return { width: 900, height: 0, nodeWidth: 0, nodeHeight: 0, nodes: [], connectors: [] };
  }

  const width = compact.value ? 360 : 900;
  const left = compact.value ? 20 : 70;
  const nodeWidth = width - left * 2;
  const nodeHeight = 88;
  const gap = 112;
  const nodes = roadmap.value.nodes.map((node, index) => ({
    ...node,
    x: left,
    y: 28 + index * gap,
    titleLines: wrapTitle(node.title, compact.value ? 34 : 80),
  }));
  const connectors = [];

  if (roadmap.value.layout === 'branches' && nodes.length > 1) {
    const trunkX = compact.value ? 9 : 38;
    const first = nodes[0];
    const branchNodes = nodes.slice(1);
    const firstCenterY = first.y + nodeHeight;
    const lastCenterY = branchNodes[branchNodes.length - 1].y + nodeHeight / 2;

    connectors.push({
      path: `M ${first.x} ${firstCenterY - 5} H ${trunkX} V ${lastCenterY}`,
      arrow: false,
    });
    branchNodes.forEach((node) => {
      connectors.push({
        path: `M ${trunkX} ${node.y + nodeHeight / 2} H ${node.x}`,
        arrow: true,
      });
    });
  } else {
    nodes.slice(0, -1).forEach((node, index) => {
      const next = nodes[index + 1];
      const centerX = width / 2;
      connectors.push({
        path: `M ${centerX} ${node.y + nodeHeight} V ${next.y - 5}`,
        arrow: true,
      });
    });
  }

  return {
    width,
    height: nodes.length ? nodes[nodes.length - 1].y + nodeHeight + 28 : 0,
    nodeWidth,
    nodeHeight,
    nodes,
    connectors,
  };
});

function handleNavigation(event, path) {
  if (
    event.defaultPrevented
    || event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
  ) {
    return;
  }

  event.preventDefault();
  router.push(path);
}

onMounted(() => {
  updateLayout();
  window.addEventListener('resize', updateLayout, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLayout);
});
</script>

<style scoped>
.c-roadmap {
  width: min(100% - 2rem, 76rem);
  margin: 1.5rem auto;
  padding: clamp(1rem, 3vw, 1.5rem);
  color: #f5f3ff;
  background: linear-gradient(145deg, #17132d, #100e22);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 1.2rem;
  box-sizing: border-box;
}

.c-roadmap__header {
  max-width: 54rem;
  margin: 0 auto 1rem;
}

.c-roadmap__eyebrow {
  margin: 0 0 0.35rem;
  color: #c4b5fd;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.c-roadmap__header h2 {
  margin: 0;
  font-size: clamp(1.2rem, 3vw, 1.65rem);
  line-height: 1.25;
}

.c-roadmap__description,
.c-roadmap__note {
  color: #d3cfe3;
  font-size: 0.92rem;
  line-height: 1.55;
}

.c-roadmap__description {
  margin: 0.5rem 0 0;
}

.c-roadmap__svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  color: #a78bfa;
}

.c-roadmap__connectors path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.c-roadmap__card {
  fill: #211b3c;
  stroke: #8171c5;
  stroke-width: 1.5;
  transition: fill 150ms ease, stroke 150ms ease;
}

.c-roadmap__card--start {
  fill: #30254f;
  stroke: #b7a4ff;
}

.c-roadmap__node--linked a {
  cursor: pointer;
  outline: none;
}

.c-roadmap__node--linked a:hover .c-roadmap__card,
.c-roadmap__node--linked a:focus-visible .c-roadmap__card {
  fill: #302650;
  stroke: #e9ddff;
  stroke-width: 3;
}

.c-roadmap__phase {
  fill: #c4b5fd;
  font-size: 12px;
  font-weight: 750;
  pointer-events: none;
}

.c-roadmap__title {
  fill: #fff;
  font-size: 15px;
  font-weight: 700;
  pointer-events: none;
}

.c-roadmap__note {
  max-width: 54rem;
  margin: 0.5rem auto 0;
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .c-roadmap {
    margin-block: 1rem;
  }

  .c-roadmap__description {
    font-size: 0.88rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-roadmap__card {
    transition: none;
  }
}
</style>
