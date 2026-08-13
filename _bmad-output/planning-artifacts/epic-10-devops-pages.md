# Epic 10: Port 6 DevOps pages cuối cùng sang Vue

## Overview

Epic này hoàn thành việc port toàn bộ DevOps pages còn lại trong `web-en/pages/devops/` sang Vue app (`web-app/`):

1. Mỗi trang sau khi port đều chạy được trên Vue
2. Điều hướng từ DevopsHubPage hoạt động đúng
3. UI theo đúng Forge Design System (Epic 8)
4. Sử dụng CSS variables thay vì hardcoded hex colors

## Pages cần port (6 trang)

### DevOps Sub-pages (6 pages - content-heavy, low interaction)

| HTML Source | Vue Component | Accent Color |
|-------------|---------------|--------------|
| `devops/aws.html` | `DevopsAwsPage.vue` | `#ff9900` (AWS orange) |
| `devops/docker.html` | `DevopsDockerPage.vue` | `#2496ed` (Docker blue) |
| `devops/kubernetes.html` | `DevopsKubernetesPage.vue` | `#326ce5` (K8s blue) |
| `devops/terraform.html` | `DevopsTerraformPage.vue` | `#7c3aed` (Terraform purple) |
| `devops/cicd.html` | `DevopsCicdPage.vue` | `#34d399` (CI/CD green) |
| `devops/monitoring.html` | `DevopsMonitoringPage.vue` | `#eab308` (Monitoring yellow) |

## Stories

### Story 10.1: Port AWS page

As a người dùng,
I want xem nội dung AWS Cloud trên bản Vue,
So that có trải nghiệm học tập đồng nhất.

**Acceptance Criteria:**

Given AWS page đã port sang Vue
When người dùng mở /devops/aws
Then nội dung hiển thị đúng như bản Legacy
And accent color #ff9900 được dùng cho AWS-themed sections

Given AWS page đã port
When người dùng click vào link điều hướng
Then điều hướng hoạt động đúng

Given AWS page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.2: Port Docker page

As a người dùng,
I want xem nội dung Docker trên bản Vue,
So that học Docker với UI đồng nhất.

**Acceptance Criteria:**

Given Docker page đã port sang Vue
When người dùng mở /devops/docker
Then nội dung hiển thị đúng như bản Legacy
And accent color #2496ed được dùng cho Docker-themed sections

Given Docker page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.3: Port Kubernetes page

As a người dùng,
I want xem nội dung Kubernetes trên bản Vue,
So that học K8s với UI đồng nhất.

**Acceptance Criteria:**

Given Kubernetes page đã port sang Vue
When người dùng mở /devops/kubernetes
Then nội dung hiển thị đúng như bản Legacy
And accent color #326ce5 được dùng cho K8s-themed sections

Given Kubernetes page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.4: Port Terraform page

As a người dùng,
I want xem nội dung Terraform trên bản Vue,
So that học IaC với UI đồng nhất.

**Acceptance Criteria:**

Given Terraform page đã port sang Vue
When người dùng mở /devops/terraform
Then nội dung hiển thị đúng như bản Legacy
And accent color #7c3aed được dùng cho Terraform-themed sections

Given Terraform page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.5: Port CI/CD page

As a người dùng,
I want xem nội dung CI/CD trên bản Vue,
So that học DevOps với UI đồng nhất.

**Acceptance Criteria:**

Given CI/CD page đã port sang Vue
When người dùng mở /devops/cicd
Then nội dung hiển thị đúng như bản Legacy
And accent color #34d399 được dùng cho CI/CD-themed sections

Given CI/CD page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.6: Port Monitoring page

As a người dùng,
I want xem nội dung Monitoring trên bản Vue,
So that học Observability với UI đồng nhất.

**Acceptance Criteria:**

Given Monitoring page đã port sang Vue
When người dùng mở /devops/monitoring
Then nội dung hiển thị đúng như bản Legacy
And accent color #eab308 được dùng cho Monitoring-themed sections

Given Monitoring page đã port
When build app
Then không có lỗi CSS (R8: dùng CSS vars, không hardcoded hex)

### Story 10.7: Verify DevOps routing

As a người dùng,
I want tất cả 6 DevOps pages đều điều hướng đúng từ DevopsHubPage,
So that không có broken links.

**Acceptance Criteria:**

Given tất cả 6 DevOps pages đã port
When kiểm tra navigation registry
Then tất cả routes được thêm: /devops/aws, /devops/docker, /devops/kubernetes, /devops/terraform, /devops/cicd, /devops/monitoring

Given DevopsHubPage đã cập nhật
When người dùng click vào link
Then điều hướng đúng trang Vue

Given build
When chạy npm run build
Then build thành công không lỗi

## Non-Functional Requirements

NFR1: Legacy app tại `web-en/` luôn chạy được trong suốt quá trình port
NFR2: UI theo Forge Design System (Epic 8)
NFR3: R8 Compliance: không hardcoded hex colors - dùng CSS variables
NFR4: Component dùng chung: CTopbar, HubPlaceholder

## Dependencies

- Epic 2 (Vue scaffold, routing) - đã done
- Epic 8 (Forge Design System) - đã done, tham chiếu design tokens
- DevopsHubPage - đã port ở Epic 7

## Technical Notes

### Page Structure (tất cả 6 trang đều giống nhau)

```html
<div class="page">
  <div class="topbar">
    <h1>Tiêu đề</h1>
    <div class="links">
      <a href="../hub.html">← DevOps</a>
      <a href="/">🏠 Home</a>
    </div>
  </div>
  
  <p class="desc">Mô tả</p>
  
  <div class="toc">
    <!-- Links đến sections -->
  </div>
  
  <div class="section">
    <div class="section-title">Section Title</div>
    <div class="section-body">
      <!-- Nội dung: h3, h4, p, ul, pre, .card, .grid-2, .grid-3 -->
    </div>
  </div>
</div>
```

### Accent Colors per Page

| Page | Accent | RGB |
|------|--------|-----|
| AWS | #ff9900 | rgb(255,153,0) |
| Docker | #2496ed | rgb(36,150,237) |
| Kubernetes | #326ce5 | rgb(50,108,229) |
| Terraform | #7c3aed | rgb(124,58,237) |
| CI/CD | #34d399 | rgb(52,211,153) |
| Monitoring | #eab308 | rgb(234,179,8) |

### Vue Component Pattern

```vue
<template>
  <div class="page">
    <CTopbar title="AWS Cloud" back-label="← DevOps" back-route="/devops" />
    <p class="desc">Mô tả</p>
    <div class="toc">
      <a v-for="item in toc" :href="`#${item.id}`">{{ item.label }}</a>
    </div>
    <SectionBlock v-for="section in sections" :key="section.id" :section="section" />
  </div>
</template>
```

## Success Metrics

- 6/6 DevOps pages port thành công
- Build pass không lỗi
- R8 compliant (CSS variables)
- Navigation từ DevopsHubPage hoạt động đúng
