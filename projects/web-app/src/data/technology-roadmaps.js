import { LEARNING_TRACKS } from './learning-paths.js';

const tracksById = Object.fromEntries(LEARNING_TRACKS.map((track) => [track.id, track]));

function createTrackRoadmap(trackId, { id, title, entryPath }) {
  const track = tracksById[trackId];

  return {
    id,
    title,
    description: track.goal,
    nodes: [
      {
        id: `${id}-overview`,
        phase: 'Tổng quan',
        title: track.title,
        description: track.level,
        path: entryPath,
      },
      ...track.stages.map((stage, index) => ({
        id: stage.id,
        phase: `Chặng ${index + 1} · ${stage.weeks}`,
        title: stage.title,
        description: stage.outcome,
        path: stage.lessons.find((lesson) => lesson.path)?.path,
      })),
    ],
  };
}

const overview = {
  id: 'overview',
  title: 'Bản đồ 5 lộ trình học',
  description: 'Chọn một nhánh theo mục tiêu; các lộ trình độc lập và có thể học song song.',
  layout: 'branches',
  nodes: [
    {
      id: 'shared-foundation',
      phase: 'Bắt đầu',
      title: 'Chọn mục tiêu và nền tảng phù hợp',
      description: 'Không bắt buộc đi theo một thứ tự chung.',
    },
    ...[
      ['java-backend', '/java/hub'],
      ['english', '/english'],
      ['frontend', '/frontend/hub'],
      ['devops-cloud', '/devops'],
      ['ai', '/ai'],
    ].map(([trackId, path], index) => {
      const track = tracksById[trackId];

      return {
        id: `track-${trackId}`,
        phase: `Nhánh ${index + 1}`,
        title: track.title,
        description: `${track.level} · ${track.duration}`,
        path,
      };
    }),
  ],
};

const aiEngineerRoadmap = {
  id: 'ai-engineer',
  title: 'Lộ trình AI Engineer',
  description: 'Từ lập trình và dữ liệu đến xây dựng, đo lường và vận hành ứng dụng AI.',
  nodes: [
    {
      id: 'ai-engineer-programming',
      phase: 'Chặng 1 · Nền tảng',
      title: 'Viết được chương trình và dùng công cụ phát triển',
      description: 'Bắt đầu bằng lập trình căn bản, Git, terminal và môi trường chạy.',
      path: '/ai?tab=engineer#foundations',
    },
    {
      id: 'ai-engineer-application',
      phase: 'Chặng 2 · Xây ứng dụng',
      title: 'CS căn bản, SQL, HTTP và test',
      description: 'Tạo API nhỏ, lưu dữ liệu và kiểm tra hành vi bằng test.',
      path: '/ai?tab=engineer#foundations',
    },
    {
      id: 'ai-engineer-ml',
      phase: 'Chặng 3 · Machine Learning',
      title: 'Làm sạch dữ liệu và đo chất lượng mô hình',
      description: 'So sánh baseline, chọn metric và nhận ra data leakage.',
      path: '/ai?tab=engineer#roadmap',
    },
    {
      id: 'ai-engineer-llm',
      phase: 'Chặng 4 · Deep Learning & LLM',
      title: 'Hiểu mô hình nền và xây ứng dụng AI',
      description: 'Thực hành embedding, retrieval, RAG và đánh giá đầu ra.',
      path: '/ai?tab=engineer#roadmap',
    },
    {
      id: 'ai-engineer-operations',
      phase: 'Chặng 5 · Vận hành',
      title: 'Triển khai, quan sát và cải tiến',
      description: 'Theo dõi chất lượng, độ trễ, chi phí và xử lý lỗi.',
      path: '/ai?tab=engineer#reality',
    },
  ],
};

const aiAgentRoadmap = {
  id: 'ai-agent',
  title: 'Lộ trình AI Agent',
  description: 'Các chủ đề học hiện có trong trang AI Agent; chọn từng chủ đề để tiếp tục.',
  nodes: [
    ['agent-fundamentals', 'Agent Fundamentals'],
    ['agent-tools', 'Tools & MCP'],
    ['agent-context', 'Token & Context'],
    ['agent-cost', 'Quota & Cost'],
    ['agent-edge', 'AI at Edge'],
  ].map(([id, title], index) => ({
    id,
    phase: `Chặng ${index + 1}`,
    title,
    description: 'Mở nội dung và ví dụ trong trang AI Agent.',
    path: '/ai/agent',
  })),
};

const goRoadmap = {
  id: 'go',
  title: 'Lộ trình Go',
  description: 'Kết hợp tài liệu Go hiện có và phần luyện phỏng vấn.',
  nodes: [
    {
      id: 'go-reading',
      phase: 'Chặng 1 · Làm quen',
      title: 'Đọc The Way to Go',
      description: 'Học cú pháp và các nội dung nền tảng theo sách.',
      path: '/books/the-way-to-go',
    },
    {
      id: 'go-practice',
      phase: 'Chặng 2 · Củng cố',
      title: 'Ôn kiến thức và thực hành trả lời',
      description: 'Dùng câu hỏi phỏng vấn để tự kiểm tra mức độ hiểu.',
      path: '/go/interview',
    },
    {
      id: 'go-interview',
      phase: 'Chặng 3 · Phỏng vấn',
      title: 'Luyện phỏng vấn Go',
      description: 'Ôn tập các câu hỏi Go trong trang hiện có.',
      path: '/go/interview',
    },
  ],
};

const cloudRoadmap = {
  id: 'cloud',
  title: 'Lộ trình Cloud',
  description: 'Đi từ bức tranh Cloud đến chọn dịch vụ, triển khai và vận hành.',
  nodes: [
    ['cloud-overview', 'Hiểu bức tranh Cloud', '/cloud'],
    ['cloud-provider', 'Tìm hiểu AWS và dịch vụ hiện có', '/devops/aws'],
    ['cloud-deploy', 'Đưa backend lên production', '/cloud/backend-deploy'],
    ['cloud-monitoring', 'Theo dõi hệ thống đang chạy', '/devops/monitoring'],
  ].map(([id, title, path], index) => ({
    id,
    phase: `Chặng ${index + 1}`,
    title,
    description: 'Mở nội dung tương ứng trong ứng dụng.',
    path,
  })),
};

const toolRoadmaps = {
  aws: {
    id: 'aws',
    title: 'Lộ trình AWS',
    description: 'Kết nối Cloud cơ bản, nội dung AWS và triển khai ứng dụng.',
    nodes: [
      ['aws-cloud', 'Nắm bức tranh Cloud', '/cloud'],
      ['aws-services', 'Học nội dung AWS', '/devops/aws'],
      ['aws-deploy', 'Triển khai backend', '/cloud/backend-deploy'],
      ['aws-monitoring', 'Theo dõi dịch vụ', '/devops/monitoring'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở nội dung liên quan hiện có.',
      path,
    })),
  },
  docker: {
    id: 'docker',
    title: 'Lộ trình Docker',
    description: 'Từ nội dung container đến triển khai và điều phối.',
    nodes: [
      ['docker-basics', 'Container và Docker', '/devops/docker'],
      ['docker-deploy', 'Đưa ứng dụng lên môi trường chạy', '/cloud/backend-deploy'],
      ['docker-orchestration', 'Điều phối workload', '/devops/kubernetes'],
      ['docker-pipeline', 'Tích hợp vào CI/CD', '/devops/cicd'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở trang công nghệ tương ứng.',
      path,
    })),
  },
  kubernetes: {
    id: 'kubernetes',
    title: 'Lộ trình Kubernetes',
    description: 'Nối kiến thức container với triển khai, pipeline và quan sát.',
    nodes: [
      ['kubernetes-container', 'Ôn container', '/devops/docker'],
      ['kubernetes-workloads', 'Học Kubernetes', '/devops/kubernetes'],
      ['kubernetes-delivery', 'Tự động hoá triển khai', '/devops/cicd'],
      ['kubernetes-monitoring', 'Theo dõi workload', '/devops/monitoring'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở trang công nghệ tương ứng.',
      path,
    })),
  },
  terraform: {
    id: 'terraform',
    title: 'Lộ trình Terraform',
    description: 'Từ hạ tầng dưới dạng mã đến Cloud và quy trình triển khai.',
    nodes: [
      ['terraform-foundations', 'Nền tảng hạ tầng và DevOps', '/devops'],
      ['terraform-iac', 'Khai báo hạ tầng với Terraform', '/devops/terraform'],
      ['terraform-cloud', 'Kết nối với dịch vụ Cloud', '/devops/aws'],
      ['terraform-delivery', 'Đưa thay đổi vào CI/CD', '/devops/cicd'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở trang công nghệ tương ứng.',
      path,
    })),
  },
  cicd: {
    id: 'cicd',
    title: 'Lộ trình CI/CD',
    description: 'Kết nối quy trình build, container, triển khai và theo dõi.',
    nodes: [
      ['cicd-overview', 'Bức tranh DevOps', '/devops'],
      ['cicd-pipeline', 'Tạo pipeline CI/CD', '/devops/cicd'],
      ['cicd-container', 'Đóng gói ứng dụng', '/devops/docker'],
      ['cicd-observability', 'Quan sát sau khi triển khai', '/devops/monitoring'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở trang công nghệ tương ứng.',
      path,
    })),
  },
  monitoring: {
    id: 'monitoring',
    title: 'Lộ trình Monitoring',
    description: 'Từ cách theo dõi dịch vụ đến vận hành trên Cloud.',
    nodes: [
      ['monitoring-foundations', 'Hiểu vai trò quan sát hệ thống', '/devops'],
      ['monitoring-practice', 'Học Monitoring', '/devops/monitoring'],
      ['monitoring-cloud', 'Theo dõi dịch vụ Cloud', '/devops/aws'],
      ['monitoring-delivery', 'Tích hợp trong quy trình triển khai', '/devops/cicd'],
    ].map(([id, title, path], index) => ({
      id,
      phase: `Chặng ${index + 1}`,
      title,
      description: 'Mở trang công nghệ tương ứng.',
      path,
    })),
  },
};

export const TECHNOLOGY_ROADMAPS = {
  overview,
  'java-backend': createTrackRoadmap('java-backend', {
    id: 'java-backend',
    title: 'Lộ trình Java / Backend',
    entryPath: '/java/hub',
  }),
  frontend: createTrackRoadmap('frontend', {
    id: 'frontend',
    title: 'Lộ trình Frontend',
    entryPath: '/frontend/hub',
  }),
  'ai-platform': createTrackRoadmap('ai', {
    id: 'ai-platform',
    title: 'Lộ trình AI',
    entryPath: '/ai',
  }),
  'ai-engineer': aiEngineerRoadmap,
  'ai-agent': aiAgentRoadmap,
  go: goRoadmap,
  cloud: cloudRoadmap,
  devops: createTrackRoadmap('devops-cloud', {
    id: 'devops',
    title: 'Lộ trình DevOps',
    entryPath: '/devops',
  }),
  ...toolRoadmaps,
};

export const ROADMAP_ROUTE_IDS = {
  'java-hub': 'java-backend',
  'java-tu-zero': 'java-backend',
  'java-advanced-core': 'java-backend',
  'java-thuc-chien': 'java-backend',
  'java-spring-boot': 'java-backend',
  'java-backend-basics': 'java-backend',
  'java-backend-basics-lesson': 'java-backend',
  'java-backend': 'java-backend',
  'frontend-hub': 'frontend',
  'frontend-design-system': 'frontend',
  'frontend-frameworks': 'frontend',
  'frontend-html-css': 'frontend',
  'frontend-javascript': 'frontend',
  'frontend-responsive': 'frontend',
  'frontend-ui-interview': 'frontend',
  ai: 'ai-platform',
  'ai-hub-sub': 'ai-platform',
  'ai-agent': 'ai-agent',
  'go-interview': 'go',
  'the-way-to-go': 'go',
  cloud: 'cloud',
  'cloud-hub-sub': 'cloud',
  'cloud-backend-deploy': 'cloud',
  'cloud-section': 'cloud',
  devops: 'devops',
  'devops-aws': 'aws',
  'devops-docker': 'docker',
  'devops-kubernetes': 'kubernetes',
  'devops-terraform': 'terraform',
  'devops-cicd': 'cicd',
  'devops-monitoring': 'monitoring',
  'devops-section': 'devops',
};

export function getRoadmap(roadmapId) {
  return TECHNOLOGY_ROADMAPS[roadmapId] ?? null;
}

export function getRoadmapIdForRoute(route) {
  if (route.name === 'ai' && route.query?.tab === 'engineer') {
    return null;
  }

  return ROADMAP_ROUTE_IDS[route.name] ?? null;
}
