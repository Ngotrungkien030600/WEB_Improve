<template>
  <div class="backend-basics-page">
    <header class="page-header">
      <div class="header-inner">
        <CTopbar
          title="🌱 10 điều cơ bản Backend cần biết"
          back-label="Java"
          back-path="/java/hub"
          @go-home="navigate"
        />
        <p class="eyebrow">LỘ TRÌNH NHẬP MÔN BACKEND</p>
        <p class="intro">
          Backend là phần nhận yêu cầu, áp dụng quy tắc nghiệp vụ, làm việc với dữ liệu
          và trả kết quả cho ứng dụng. Mười bài dưới đây nối các khái niệm đó thành một
          luồng quen thuộc: người dùng đăng nhập, tạo đơn hàng và theo dõi đơn.
        </p>
        <div class="page-meta">
          <span>10 bài nền tảng</span>
          <span aria-hidden="true">·</span>
          <span>Ví dụ theo tình huống thực tế</span>
        </div>
      </div>
    </header>

    <div class="page-layout">
      <aside class="toc-panel" aria-label="Mục lục bài học">
        <h2 class="toc-title">Trong bài này</h2>
        <nav class="toc-nav">
          <a v-for="(lesson, index) in lessons" :key="lesson.id" :href="`#${lesson.id}`">
            <span class="toc-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ lesson.title }}</span>
          </a>
        </nav>
      </aside>

      <main id="main-content" class="lesson-list">
        <article
          v-for="(lesson, index) in lessons"
          :id="lesson.id"
          :key="lesson.id"
          class="lesson-card"
          :aria-labelledby="`${lesson.id}-title`"
        >
          <div class="lesson-heading">
            <span class="lesson-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <h2 :id="`${lesson.id}-title`">{{ lesson.title }}</h2>
          </div>

          <div class="lesson-grid">
            <section class="lesson-block">
              <h3>Khái niệm</h3>
              <p>{{ lesson.concept }}</p>
            </section>
            <section class="lesson-block">
              <h3>Vì sao quan trọng?</h3>
              <p>{{ lesson.importance }}</p>
            </section>
            <section class="lesson-block">
              <h3>Cách áp dụng</h3>
              <p>{{ lesson.application }}</p>
            </section>
            <section class="lesson-block example-block">
              <h3>Ví dụ thực tế</h3>
              <p>{{ lesson.example }}</p>
              <pre v-if="lesson.code" class="example-code"><code>{{ lesson.code }}</code></pre>
            </section>
            <section class="lesson-block pitfalls-block">
              <h3>Lỗi thường gặp</h3>
              <ul>
                <li v-for="pitfall in lesson.pitfalls" :key="pitfall">{{ pitfall }}</li>
              </ul>
            </section>
            <section class="lesson-block checklist-block">
              <h3>Tự kiểm tra</h3>
              <ul>
                <li v-for="item in lesson.checklist" :key="item">{{ item }}</li>
              </ul>
            </section>
          </div>
        </article>

        <footer class="page-footer">
          <p>Hiểu chắc những nền tảng này sẽ giúp bạn học SQL, framework và hệ thống phân tán dễ hơn.</p>
          <a class="back-link footer-link" href="/java/hub" @click.prevent="navigate('/java/hub')">
            ← Quay lại hub Java
          </a>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';

const lessons = [
  {
    id: 'http-request-response',
    title: 'HTTP: request và response',
    concept: 'HTTP là giao thức để client (trình duyệt hoặc ứng dụng) gửi request tới server và nhận response. Một request thường có method, URL, header và đôi khi có body; response gồm status code, header và dữ liệu trả về.',
    importance: 'Đây là hợp đồng giao tiếp cơ bản của phần lớn dịch vụ web. Nắm được hợp đồng giúp bạn phân biệt lỗi do gửi sai dữ liệu, chưa đăng nhập, không tìm thấy tài nguyên hay server gặp sự cố.',
    application: 'Chọn method theo ý nghĩa thao tác: GET để đọc, POST để tạo, PUT hoặc PATCH để cập nhật, DELETE để xóa. Dùng status code đúng để client biết nên hiển thị kết quả, yêu cầu đăng nhập hay thử lại.',
    example: 'Khi người dùng đặt hàng, ứng dụng gửi dữ liệu nhận hàng lên server. Server kiểm tra và trả mã đơn cùng trạng thái tạo thành công.',
    code: 'POST /api/orders HTTP/1.1\nContent-Type: application/json\n\n{"productId": "p-42", "quantity": 2}\n\nHTTP/1.1 201 Created\n{"orderId": "o-103", "status": "pending"}',
    pitfalls: [
      'Dùng GET để thay đổi dữ liệu, khiến thao tác có thể bị kích hoạt ngoài ý muốn.',
      'Trả cùng một status code cho mọi tình huống nên client không biết cách xử lý.',
      'Đưa mật khẩu hoặc token vào URL, nơi có thể bị lưu trong log và lịch sử trình duyệt.',
    ],
    checklist: [
      'Tôi giải thích được method, header, body và status code.',
      'Tôi chọn được mã phù hợp cho tạo mới, không tìm thấy và lỗi server.',
      'Thông tin nhạy cảm không nằm trong URL.',
    ],
  },
  {
    id: 'api-design',
    title: 'Thiết kế API dễ dùng và ổn định',
    concept: 'API là giao diện mà client dùng để yêu cầu nghiệp vụ từ server. Một API tốt có đường dẫn dễ hiểu, dữ liệu nhất quán và quy tắc rõ ràng về phân trang, lỗi, phiên bản và những lần gọi lặp lại.',
    importance: 'API thường được nhiều màn hình hoặc dịch vụ cùng sử dụng. Hợp đồng ổn định giúp một thay đổi ở server không vô tình làm hỏng client khác.',
    application: 'Đặt tên đường dẫn theo tài nguyên, chẳng hạn `/orders` và `/orders/{id}`; dùng method để diễn tả hành động. Với danh sách lớn, hỗ trợ phân trang và giới hạn số kết quả. Khi thao tác có thể gửi lại do mạng chập chờn, thiết kế cách tránh tạo trùng.',
    example: 'Ứng dụng gửi `GET /api/orders?page=1&pageSize=20` để lấy trang đầu. Khi tạo đơn, server trả `201 Created` và thông tin đơn mới thay vì chỉ trả một thông báo chung.',
    code: 'GET    /api/orders?page=1&pageSize=20\nGET    /api/orders/o-103\nPOST   /api/orders\nPATCH  /api/orders/o-103',
    pitfalls: [
      'Dùng tên endpoint khác nhau cho cùng một khái niệm hoặc đổi cấu trúc response mà không báo trước.',
      'Trả toàn bộ dữ liệu không giới hạn cho danh sách.',
      'Cho phép gửi lại thao tác thanh toán hoặc tạo đơn mà không cân nhắc việc phát sinh bản ghi trùng.',
    ],
    checklist: [
      'Tên URL đại diện cho tài nguyên, method thể hiện thao tác.',
      'Danh sách có giới hạn hoặc phân trang.',
      'Client có thể hiểu kết quả thành công và lỗi theo một quy ước thống nhất.',
    ],
  },
  {
    id: 'data-model-sql',
    title: 'Mô hình dữ liệu và SQL',
    concept: 'Mô hình dữ liệu mô tả các loại thông tin, mối quan hệ và ràng buộc cần lưu. Trong cơ sở dữ liệu quan hệ, bảng chứa các hàng; khóa chính định danh hàng, khóa ngoại nối những hàng có liên quan, còn SQL dùng để đọc và thay đổi dữ liệu.',
    importance: 'Thiết kế đúng giúp dữ liệu không mâu thuẫn và truy vấn đúng với nhu cầu nghiệp vụ. Ví dụ đơn hàng cần liên hệ với đúng khách hàng và các dòng sản phẩm của nó.',
    application: 'Bắt đầu từ câu hỏi nghiệp vụ rồi xác định bảng, cột và quan hệ. Đặt ràng buộc `NOT NULL`, `UNIQUE` hoặc khóa ngoại phù hợp; truy vấn bằng tham số thay vì ghép chuỗi SQL từ dữ liệu người dùng.',
    example: 'Một đơn có mã riêng, người mua và trạng thái. Khóa ngoại `customer_id` giúp database từ chối đơn tham chiếu tới khách hàng không tồn tại.',
    code: 'SELECT id, status, created_at\nFROM orders\nWHERE customer_id = ?\nORDER BY created_at DESC\nLIMIT 20;',
    pitfalls: [
      'Lưu nhiều giá trị không liên quan trong một cột khiến lọc và cập nhật khó chính xác.',
      'Bỏ ràng buộc dữ liệu rồi chỉ trông chờ mọi màn hình luôn gửi đúng.',
      'Nối trực tiếp đầu vào vào câu SQL, tạo nguy cơ SQL injection.',
    ],
    checklist: [
      'Mỗi bảng có khóa chính và quan hệ cần thiết.',
      'Các ràng buộc dữ liệu được đặt ở nơi phù hợp.',
      'Truy vấn dùng tham số và chỉ lấy cột cần thiết.',
    ],
  },
  {
    id: 'transactions-consistency',
    title: 'Transaction và tính nhất quán',
    concept: 'Transaction gom nhiều thao tác dữ liệu thành một đơn vị: hoặc tất cả cùng thành công, hoặc tất cả được hoàn tác. Tính nhất quán là việc dữ liệu vẫn thỏa các quy tắc nghiệp vụ trước và sau thao tác; transaction không tự giải quyết mọi vấn đề giữa nhiều dịch vụ.',
    importance: 'Khi tạo đơn, trừ tồn kho và ghi nhận thanh toán có liên quan. Nếu chỉ một bước thành công, hệ thống có thể báo đã bán món hàng nhưng kho không bị trừ, hoặc thu tiền mà không có đơn.',
    application: 'Gom những cập nhật cùng database và phải cùng thành công vào transaction. Với hệ thống ngoài database như cổng thanh toán, thiết kế trạng thái, thao tác bù hoặc xử lý lặp an toàn thay vì giả định có thể rollback toàn bộ.',
    example: 'Trong một transaction, tạo đơn và giữ hàng. Nếu ghi đơn thất bại, việc giữ hàng được hoàn tác; thanh toán qua cổng bên ngoài được xử lý ở bước riêng có trạng thái theo dõi.',
    pitfalls: [
      'Gọi dịch vụ bên ngoài khi đang giữ transaction database lâu.',
      'Cho rằng transaction của một database bao trùm luôn email, thanh toán hoặc message queue.',
      'Không xử lý hai yêu cầu đồng thời cùng mua món hàng cuối cùng.',
    ],
    checklist: [
      'Tôi xác định được những ghi nhận nào phải thành công cùng nhau.',
      'Transaction có phạm vi gọn và được đóng đúng cách.',
      'Tôi đã nghĩ tới cập nhật đồng thời và bước bên ngoài database.',
    ],
  },
  {
    id: 'authentication-authorization',
    title: 'Xác thực và phân quyền',
    concept: 'Xác thực (authentication) trả lời “bạn là ai?”; phân quyền (authorization) trả lời “bạn được phép làm gì?”. Đăng nhập thành công không đồng nghĩa người dùng được đọc hoặc sửa mọi tài nguyên.',
    importance: 'Kiểm tra đúng cả hai lớp bảo vệ tài khoản và dữ liệu của từng người. Một người dùng có thể đăng nhập hợp lệ nhưng vẫn không được xem đơn hàng thuộc tài khoản khác.',
    application: 'Xác thực thông tin đăng nhập, lưu mật khẩu bằng thuật toán băm chuyên dụng có salt, rồi cấp phiên hoặc token phù hợp. Mỗi request cần kiểm tra quyền theo vai trò và quyền sở hữu tài nguyên tại server.',
    example: 'Khi mở `/api/orders/o-103`, server lấy danh tính từ phiên đã xác thực rồi xác nhận đơn `o-103` thuộc người dùng hiện tại trước khi trả dữ liệu.',
    pitfalls: [
      'Chỉ ẩn nút trên giao diện mà không kiểm tra quyền tại server.',
      'Lưu mật khẩu nguyên văn hoặc tự thiết kế thuật toán băm.',
      'Kiểm tra vai trò chung nhưng quên kiểm tra chủ sở hữu của từng bản ghi.',
    ],
    checklist: [
      'Mật khẩu không được lưu dưới dạng có thể đọc lại.',
      'Server xác minh quyền trên mọi thao tác nhạy cảm.',
      'Quyền truy cập tài nguyên của người khác bị từ chối.',
    ],
  },
  {
    id: 'validation-errors',
    title: 'Validation và xử lý lỗi',
    concept: 'Validation là kiểm tra dữ liệu có đúng kiểu, định dạng, giới hạn và quy tắc nghiệp vụ hay không. Xử lý lỗi biến sự cố thành phản hồi có thể hiểu, đồng thời giữ chi tiết nội bộ ở log thay vì gửi cho người dùng.',
    importance: 'Client có thể bị chỉnh sửa hoặc gửi request ngoài giao diện, nên server luôn phải tự kiểm tra. Phản hồi lỗi rõ ràng giúp người dùng sửa đúng chỗ và giúp client xử lý nhất quán.',
    application: 'Kiểm tra dữ liệu ngay tại biên API rồi kiểm tra thêm quy tắc nghiệp vụ, như số lượng đặt phải lớn hơn 0 và còn hàng. Trả status phù hợp cùng mã lỗi ổn định, thông điệp an toàn và trường chỉ rõ dữ liệu cần sửa.',
    example: 'Nếu số lượng bằng 0, server trả lỗi validation cho trường `quantity`. Nếu người dùng chưa đăng nhập, server trả phản hồi yêu cầu xác thực thay vì báo lỗi chung.',
    code: '{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Dữ liệu chưa hợp lệ",\n    "fields": { "quantity": "Phải lớn hơn 0" }\n  }\n}',
    pitfalls: [
      'Chỉ kiểm tra ở trình duyệt, bỏ qua kiểm tra phía server.',
      'Trả stack trace, câu SQL hoặc thông tin bí mật cho client.',
      'Dùng thông điệp lỗi khác nhau không có mã ổn định khiến client phải dò chuỗi.',
    ],
    checklist: [
      'Dữ liệu được kiểm tra lại tại server.',
      'Lỗi có status và mã đủ nhất quán để client xử lý.',
      'Phản hồi không tiết lộ chi tiết nội bộ.',
    ],
  },
  {
    id: 'security',
    title: 'Bảo mật nền tảng',
    concept: 'Bảo mật là giảm khả năng dữ liệu hoặc chức năng bị truy cập, thay đổi hay làm gián đoạn trái phép. Nhiều lỗi phổ biến xuất hiện ở ranh giới tin cậy: dữ liệu đầu vào, quyền truy cập, bí mật cấu hình và kết nối.',
    importance: 'Một lỗi phân quyền hoặc lộ khóa truy cập có thể ảnh hưởng nhiều người dùng hơn một lỗi giao diện. Bảo mật cần được đưa vào thiết kế và kiểm tra thường xuyên, không chỉ thêm vào trước ngày phát hành.',
    application: 'Chỉ cấp quyền tối thiểu cần thiết, dùng HTTPS ở môi trường triển khai, giữ bí mật ngoài mã nguồn và kiểm tra quyền sở hữu dữ liệu. Dùng truy vấn có tham số, mã hóa/escape đầu ra phù hợp và giới hạn số lần thử đăng nhập.',
    example: 'Request để xem đơn của người khác không được phép chỉ vì người gửi biết mã đơn. Server so sánh chủ sở hữu đơn với danh tính đã xác thực và từ chối khi không khớp.',
    pitfalls: [
      'Đưa API key, mật khẩu database hoặc secret vào repository.',
      'Tin rằng ID khó đoán là đủ để bảo vệ tài nguyên.',
      'Ghi token, mật khẩu hoặc dữ liệu cá nhân vào log.',
    ],
    checklist: [
      'Bí mật được cấu hình ngoài mã nguồn và không xuất hiện trong log.',
      'Mọi tài nguyên nhạy cảm đều kiểm tra quyền phía server.',
      'Đầu vào được xử lý an toàn và quyền được cấp tối thiểu.',
    ],
  },
  {
    id: 'testing',
    title: 'Kiểm thử Backend',
    concept: 'Kiểm thử tự động xác nhận chương trình đáp ứng hành vi mong đợi. Unit test kiểm tra đơn vị nhỏ; integration test kiểm tra sự phối hợp giữa các thành phần như API và database; end-to-end test kiểm tra luồng gần với cách người dùng thực hiện.',
    importance: 'Một lần chạy thành công cho ví dụ thuận lợi chưa chứng minh các trường hợp lỗi, quyền truy cập hay dữ liệu ranh giới đều hoạt động. Test lặp lại giúp thay đổi code an toàn hơn và phát hiện hồi quy sớm.',
    application: 'Viết test cho quy tắc quan trọng trước: tạo đơn hợp lệ, hết hàng, dữ liệu sai và người dùng không có quyền. Dùng database test hoặc môi trường cô lập; test phải độc lập, có kết quả rõ ràng và không dựa vào thứ tự chạy.',
    example: 'Với API tạo đơn, kiểm tra response thành công và bản ghi được lưu; sau đó kiểm tra số lượng âm bị từ chối và người dùng không thể đặt vượt tồn kho.',
    pitfalls: [
      'Chỉ kiểm tra đường thành công, bỏ qua lỗi và trường hợp biên.',
      'Test phụ thuộc dữ liệu còn sót từ lần chạy trước.',
      'Mock mọi thứ khiến test không còn kiểm tra tích hợp thực sự.',
    ],
    checklist: [
      'Quy tắc nghiệp vụ quan trọng có test cho cả đúng và sai.',
      'Test độc lập và có thể chạy lặp lại.',
      'Lỗi test được xử lý trước khi phát hành thay đổi.',
    ],
  },
  {
    id: 'performance-cache-async',
    title: 'Hiệu năng, cache và xử lý bất đồng bộ',
    concept: 'Hiệu năng là thời gian và tài nguyên cần để hoàn thành công việc. Cache giữ bản sao dữ liệu để đọc nhanh hơn; xử lý bất đồng bộ hoặc hàng đợi cho phép công việc lâu như gửi email diễn ra sau phản hồi chính.',
    importance: 'Truy vấn nặng hoặc tác vụ chậm có thể khiến người dùng phải chờ và làm dịch vụ quá tải. Cache và hàng đợi hữu ích khi được chọn dựa trên số liệu và yêu cầu dữ liệu mới, không phải dùng như giải pháp mặc định.',
    application: 'Đo thời gian phản hồi, tìm truy vấn chậm rồi tối ưu bằng truy vấn phù hợp hoặc index. Cache dữ liệu đọc nhiều với thời hạn và cách làm mới rõ ràng; đẩy công việc không cần phản hồi ngay vào hàng đợi, đồng thời đảm bảo xử lý lặp an toàn.',
    example: 'Sau khi đơn được tạo, trả mã đơn ngay rồi gửi email xác nhận qua worker. Trang danh sách sản phẩm có thể cache ngắn hạn, trong khi số lượng tồn kho cần được kiểm tra từ nguồn dữ liệu đáng tin trước khi đặt.',
    pitfalls: [
      'Thêm cache mà không có cách hết hạn hoặc làm mới, khiến người dùng thấy dữ liệu cũ.',
      'Tối ưu trước khi đo và làm code phức tạp không cần thiết.',
      'Giả định message chỉ được xử lý đúng một lần hoặc sẽ không bao giờ lỗi.',
    ],
    checklist: [
      'Có số đo hoặc truy vấn cụ thể trước khi tối ưu.',
      'Cache có thời hạn và quy tắc cập nhật rõ ràng.',
      'Tác vụ bất đồng bộ có retry hợp lý và chịu được xử lý lặp.',
    ],
  },
  {
    id: 'deployment-observability',
    title: 'Triển khai và quan sát vận hành',
    concept: 'Triển khai đưa phiên bản ứng dụng tới môi trường chạy. Quan sát vận hành (observability) dùng log, metrics và traces để hiểu dịch vụ đang hoạt động ra sao và truy tìm nguyên nhân khi có sự cố.',
    importance: 'Code đúng trên máy cá nhân chưa chắc chạy tốt khi triển khai, nơi cấu hình, database và lưu lượng khác nhau. Sau khi phát hành, đội ngũ cần nhận biết lỗi, đánh giá ảnh hưởng và khôi phục dịch vụ an toàn.',
    application: 'Tách cấu hình theo môi trường, kiểm tra sức khỏe dịch vụ và chạy migration có kế hoạch. Ghi log có ngữ cảnh nhưng không chứa bí mật; theo dõi tỷ lệ lỗi, thời gian phản hồi và tài nguyên, đặt cảnh báo hữu ích, đồng thời chuẩn bị cách rollback.',
    example: 'Sau khi phát hành phiên bản mới, theo dõi lỗi API tạo đơn và thời gian phản hồi. Nếu tỷ lệ lỗi tăng bất thường, dùng request ID để tìm log liên quan và quay về phiên bản ổn định trong khi điều tra.',
    pitfalls: [
      'Chỉ phát hiện lỗi khi người dùng báo vì thiếu health check hoặc cảnh báo.',
      'Chạy migration phá hủy dữ liệu mà không có kế hoạch tương thích và khôi phục.',
      'Log toàn bộ request kể cả token hoặc thông tin cá nhân.',
    ],
    checklist: [
      'Cấu hình và bí mật không bị đóng cứng trong code.',
      'Có health check, log và ít nhất các chỉ số lỗi/thời gian phản hồi.',
      'Biết cách phát hiện sự cố và khôi phục phiên bản an toàn.',
    ],
  },
];
</script>

<style scoped>
.backend-basics-page {
  --page-accent: var(--accent-java);
  min-height: 100vh;
  padding-bottom: 3rem;
  color: var(--forge-text);
  background: var(--forge-bg);
}

.page-header {
  padding: clamp(1.5rem, 5vw, 3.5rem) 1.25rem 2rem;
  border-bottom: 1px solid var(--forge-glass-border);
  background:
    radial-gradient(ellipse at 75% 0%, color-mix(in srgb, var(--page-accent) 15%, transparent), transparent 55%),
    var(--forge-bg2);
}

.header-inner,
.page-layout {
  width: min(100%, 72rem);
  margin: 0 auto;
}

:deep(.hub-topbar) {
  margin-bottom: 1.25rem;
}

:deep(.hub-topbar h1) {
  max-width: 48rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  color: var(--forge-text2);
  font-size: 0.9rem;
  font-weight: 650;
  text-underline-offset: 0.25rem;
}

.back-link:hover {
  color: var(--page-accent);
}

.eyebrow {
  margin: 2rem 0 0.5rem;
  color: var(--page-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h1 {
  max-width: 48rem;
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.intro {
  max-width: 48rem;
  margin: 1rem 0 0;
  color: var(--forge-text2);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.8;
}

.page-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: var(--forge-text3);
  font-size: 0.85rem;
}

.page-layout {
  display: grid;
  grid-template-columns: minmax(13rem, 17rem) minmax(0, 1fr);
  align-items: start;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  padding: 2rem 1.25rem 0;
}

.toc-panel {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  background: var(--forge-glass);
}

.toc-title {
  margin: 0 0 0.75rem;
  color: var(--forge-text3);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.toc-nav {
  display: grid;
  gap: 0.25rem;
}

.toc-nav a {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: start;
  padding: 0.55rem;
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.8rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.toc-nav a:hover {
  color: var(--forge-text);
  background: var(--forge-surface-hover);
}

.toc-number,
.lesson-number {
  color: var(--page-accent);
  font-variant-numeric: tabular-nums;
  font-weight: 800;
}

.lesson-list {
  min-width: 0;
}

.lesson-card {
  scroll-margin-top: 1rem;
  margin-bottom: 1.25rem;
  padding: clamp(1rem, 3vw, 1.75rem);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  background: var(--forge-glass);
}

.lesson-heading {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.lesson-number {
  flex: 0 0 auto;
  padding-top: 0.18rem;
  font-size: 0.85rem;
}

.lesson-heading h2 {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.7rem);
  line-height: 1.3;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.lesson-block {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  background: var(--forge-bg2);
}

.lesson-block h3 {
  margin: 0 0 0.45rem;
  color: var(--page-accent);
  font-size: 0.85rem;
}

.lesson-block p,
.lesson-block li {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.lesson-block p {
  margin: 0;
}

.lesson-block ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding-left: 1.15rem;
}

.lesson-block li::marker {
  color: var(--page-accent);
}

.example-code {
  max-width: 100%;
  margin: 0.85rem 0 0;
  padding: 0.85rem;
  overflow-x: auto;
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text);
  background: var(--forge-bg);
  font: 0.78rem/1.65 var(--font-mono, monospace);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.page-footer {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem 0;
  color: var(--forge-text2);
}

.page-footer p {
  margin: 0;
  line-height: 1.7;
}

.footer-link {
  justify-self: start;
}

@media (max-width: 850px) {
  .page-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .toc-panel {
    position: static;
    max-height: none;
  }

  .toc-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .page-header {
    padding-inline: 1rem;
  }

  .page-layout {
    padding: 1.25rem 1rem 0;
  }

  .toc-nav,
  .lesson-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .lesson-card {
    padding: 1rem;
  }
}
</style>
