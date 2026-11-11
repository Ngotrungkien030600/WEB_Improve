export const backendBasicsLessons = [
  {
    id: 'http-request-response',
    title: 'HTTP: request và response',
    summary: 'Đọc cấu trúc request/response và theo dõi một yêu cầu tạo đơn từ client tới server.',
    goals: [
      'Nhận diện method, URL, header, body trong request và status, header, body trong response.',
      'Giải thích được vì sao cùng một URL có thể có hành vi khác nhau theo HTTP method.',
      'Chọn được nhóm status code phù hợp với kết quả xử lý.',
    ],
    prerequisites: ['Không cần kiến thức Backend trước; chỉ cần biết ứng dụng có thể gửi yêu cầu qua mạng.'],
    concept: [
      'HTTP là giao thức trao đổi thông điệp theo mô hình request/response. Client gửi một request tới server; server đọc yêu cầu, chạy quy tắc nghiệp vụ và trả một response. HTTP không tự đảm bảo rằng người gửi được phép làm việc đó: xác thực, phân quyền và kiểm tra dữ liệu vẫn là trách nhiệm của ứng dụng.',
      'Request thường có method, đường dẫn và query string, header, cùng body tùy thao tác. Response luôn có status code, thường có header và đôi khi có body. Header mô tả thông điệp, chẳng hạn `Content-Type: application/json`; body mang dữ liệu nghiệp vụ. HTTPS mã hóa kết nối giữa hai đầu, nhưng không thay thế kiểm tra quyền hoặc validation.',
      'Method nói lên ý định: GET đọc, POST thường tạo hoặc khởi chạy thao tác, PUT thay thế một tài nguyên, PATCH cập nhật một phần, DELETE yêu cầu xóa. Các method đọc thường có thể gọi lặp mà không đổi dữ liệu; POST không mặc định an toàn khi gửi lại. Client không được giả định một request đã thành công chỉ vì không nhận lỗi mạng.',
      'Status code giúp client chọn cách xử lý tiếp theo. 200 thường là thành công có kết quả, 201 là tạo thành công, 204 là thành công không có body, 400 là request sai, 401 là chưa xác thực, 403 là không được phép, 404 là không tìm thấy, 409 là xung đột nghiệp vụ và 500 là lỗi server không dự kiến.',
    ],
    flow: [
      'Client tạo request `POST /api/orders` với JSON và `Content-Type: application/json`.',
      'Server phân tích cú pháp, xác thực danh tính, kiểm tra dữ liệu và quy tắc đơn hàng.',
      'Nếu hợp lệ, server lưu đơn rồi trả `201 Created` cùng representation của đơn.',
      'Nếu dữ liệu sai, server trả lỗi 4xx có cấu trúc; lỗi nội bộ được log và không lộ chi tiết cho client.',
    ],
    designGuidance: [
      'Dùng HTTPS khi truyền dữ liệu nhạy cảm và không đặt mật khẩu, token hoặc thông tin riêng tư trong URL.',
      'Đặt response body và `Content-Type` nhất quán; với JSON API, phản hồi thành công và lỗi nên có cấu trúc dễ đọc.',
      'Chọn status theo kết quả thật. Ví dụ, request không hợp lệ khác với người dùng chưa đăng nhập hoặc tài nguyên đã biến mất.',
    ],
    example: {
      introduction: 'Client muốn tạo đơn cho hai sản phẩm. Server kiểm tra request rồi phản hồi với mã đơn và trạng thái ban đầu.',
      code: `POST /api/orders HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "items": [
    { "productId": "p-42", "quantity": 2 }
  ],
  "shippingAddressId": "addr-7"
}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/orders/o-103

{
  "id": "o-103",
  "status": "pending",
  "items": [
    { "productId": "p-42", "quantity": 2, "unitPrice": 150000 }
  ],
  "total": 300000
}`,
      annotations: [
        '`POST` thể hiện ý định tạo tài nguyên; endpoint là danh từ số nhiều `/orders`.',
        'Body gửi ID sản phẩm và số lượng, không tin đơn giá do client tự gửi.',
        '`201 Created` báo tài nguyên mới đã được tạo; `Location` chỉ tới đơn vừa tạo.',
        'Response có giá và tổng tiền do server tính từ nguồn dữ liệu đáng tin cậy.',
      ],
    },
    pitfalls: [
      'Dùng GET để thay đổi trạng thái đơn; trình duyệt, proxy hoặc crawler có thể gọi GET ngoài ý muốn.',
      'Trả `200 OK` cho mọi kết quả, khiến client không phân biệt được tạo mới, lỗi validation và quyền bị từ chối.',
      'Đưa token, mật khẩu hoặc dữ liệu cá nhân vào query string, nơi chúng có thể lọt vào lịch sử và access log.',
      'Cho rằng HTTPS tự chứng minh người dùng có quyền xem đơn hàng.',
    ],
    checklist: [
      'Tôi chỉ được method, URL, header, body và status trong một cặp request/response.',
      'Tôi phân biệt được 401 (chưa xác thực) với 403 (đã biết danh tính nhưng không được phép).',
      'Dữ liệu nhạy cảm không nằm trong URL và response không tiết lộ bí mật.',
    ],
    exercise: 'Viết request lấy đơn `o-103` và response thành công. Sau đó nêu status phù hợp cho ba trường hợp: đơn không tồn tại, người gọi chưa đăng nhập và dịch vụ database tạm thời lỗi.',
  },
  {
    id: 'api-design',
    title: 'Thiết kế API và CRUD',
    summary: 'Thiết kế hợp đồng REST dễ đoán cho Create, Read, Update, Delete với request, response và SQL liên quan.',
    goals: [
      'Thiết kế URL theo tài nguyên và dùng method đúng với Create, Read, Update, Delete.',
      'Đọc được request/response mẫu, status code và truy vấn SQL tương ứng.',
      'Giải thích validation, quyền truy cập và tính an toàn khi client gửi lại request.',
    ],
    prerequisites: ['Bài 1: hiểu request/response HTTP và status code cơ bản.'],
    concept: [
      'API là hợp đồng giữa client và server. REST thường biểu diễn đối tượng nghiệp vụ bằng tài nguyên trong URL: `/api/orders` là tập đơn, `/api/orders/o-103` là một đơn. Method diễn tả thao tác lên tài nguyên, còn JSON mô tả dữ liệu. API không nên để client tự quyết giá, chủ sở hữu hoặc trạng thái nhạy cảm.',
      'CRUD là bốn thao tác cơ bản với dữ liệu. Create tạo đơn mới, Read đọc danh sách hoặc một đơn, Update sửa đơn còn được phép sửa, Delete xóa hoặc hủy theo chính sách. Trong hệ thống đơn hàng, xóa vật lý không phải lúc nào cũng phù hợp: đơn đã thanh toán thường được chuyển trạng thái hủy hoặc lưu dấu vết thay vì xóa dấu vết kế toán.',
      'Request tạo thường trả 201; đọc trả 200; cập nhật trả 200 với representation mới hoặc 204 không body; xóa trả 204 khi xong. Dữ liệu sai có thể trả 400 hoặc 422 theo quy ước API, chưa xác thực trả 401, không đủ quyền trả 403, không có tài nguyên trả 404, và xung đột trạng thái trả 409. Chọn một quy ước nhất quán trong cùng API.',
      'API là ranh giới tin cậy: server phải xác thực người gọi, kiểm tra quyền sở hữu từng đơn, validate body và dùng SQL tham số hóa. Với POST có nguy cơ client thử lại sau timeout, có thể thiết kế idempotency key để một yêu cầu nghiệp vụ chỉ tạo một đơn.',
    ],
    flow: [
      'Định danh hành động bằng tổ hợp method + resource: `POST /orders` tạo, `GET` đọc, `PATCH` cập nhật một phần, `DELETE` yêu cầu xóa.',
      'API xác thực người dùng, lấy quyền từ phiên đáng tin cậy và kiểm tra người đó có thể thao tác trên đơn nào.',
      'API validate dữ liệu, chạy nghiệp vụ và gọi câu SQL tham số hóa trong transaction phù hợp.',
      'API trả status, dữ liệu mới hoặc mã lỗi ổn định; không đưa thông tin bí mật hoặc câu SQL ra response.',
    ],
    designGuidance: [
      'Giới hạn và phân trang danh sách, ví dụ `?page=1&pageSize=20`, đồng thời đặt trần page size.',
      'Dùng PATCH cho cập nhật một phần và định nghĩa rõ trường được sửa; không cho client tự sửa owner, total hoặc trạng thái bị cấm.',
      'Phân biệt xóa vật lý với hủy đơn. Nếu cần lưu dấu vết, một endpoint hành động như `POST /orders/{id}/cancellation` có thể diễn đạt nghiệp vụ rõ hơn.',
      'Định nghĩa lỗi theo mã máy đọc được, chẳng hạn `ORDER_STATE_CONFLICT`, thay vì yêu cầu client dò chuỗi thông báo.',
    ],
    example: {
      introduction: 'Bốn request dưới đây minh họa CRUD trên một API quản lý đơn. SQL được gọi phía server sau khi kiểm tra danh tính, quyền sở hữu và dữ liệu.',
      code: `CREATE — POST /api/orders
Request:  { "items": [{ "productId": "p-42", "quantity": 2 }] }
Response: 201 Created
          { "id": "o-103", "status": "pending", "totalAmount": 300000 }
SQL:      INSERT INTO orders
          (id, customer_id, status, total_amount, shipping_address_id, created_at)
          VALUES (?, ?, 'pending', ?, ?, CURRENT_TIMESTAMP)
          -- Chạy cho từng mặt hàng trong cùng transaction:
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)

READ — GET /api/orders/o-103
Response: 200 OK
          { "id": "o-103", "status": "pending", "totalAmount": 300000 }
SQL:      SELECT id, status, total_amount FROM orders
          WHERE id = ? AND customer_id = ?

UPDATE — PATCH /api/orders/o-103
Request:  { "shippingAddressId": "addr-8" }
Response: 200 OK
          { "id": "o-103", "shippingAddressId": "addr-8" }
SQL:      UPDATE orders SET shipping_address_id = ?
          WHERE id = ? AND customer_id = ? AND status = 'pending'

DELETE — DELETE /api/orders/o-103
Response: 204 No Content
SQL:      DELETE FROM orders
          WHERE id = ? AND customer_id = ? AND status = 'pending'
          -- FK ON DELETE CASCADE xóa các order_items của đơn này.`,
      annotations: [
        'Các dấu `?` là tham số bind từ driver database; giá trị không được nối vào chuỗi SQL.',
        'ID đơn do server sinh, customer ID lấy từ danh tính đã xác thực, địa chỉ từ request; server tự tính tổng và thời điểm tạo.',
        'Mọi cột bắt buộc của schema được cung cấp; tên `totalAmount` trong JSON ánh xạ sang `total_amount` trong database.',
        'Giá/tổng được server tính từ dữ liệu sản phẩm; mỗi dòng hàng được ghi cùng đơn trong một transaction.',
        'Điều kiện `customer_id = ?` vừa lọc theo quyền sở hữu, vừa ngăn lộ đơn của người khác.',
        'Câu UPDATE giới hạn trạng thái được sửa; nếu không có hàng nào được cập nhật, server kiểm tra và trả 404 hoặc 409 theo quy ước.',
        'DELETE ở đây chỉ minh họa đơn pending có thể xóa. Với đơn đã xác nhận/thanh toán, nên dùng luồng hủy có lưu lịch sử thay vì xóa dấu vết.',
        'Status cho ví dụ: Create 201, Read 200, Update 200, Delete 204; lỗi quyền 403/404, dữ liệu sai 400/422, xung đột nghiệp vụ 409.',
      ],
    },
    pitfalls: [
      'Dùng POST cho mọi việc mà không nói rõ tài nguyên nào được tạo hoặc thay đổi.',
      'Chỉ kiểm tra ID đơn tồn tại nhưng quên lọc theo chủ sở hữu ở truy vấn UPDATE/DELETE.',
      'Cho phép client đặt `total`, `customerId` hoặc trường trạng thái tùy ý trong body.',
      'Xóa vật lý đơn đã thanh toán mà không giữ dấu vết hoặc quy tắc hủy.',
      'Tự retry POST tạo đơn sau timeout mà không có biện pháp chống tạo trùng.',
    ],
    checklist: [
      'Mỗi CRUD operation có method, endpoint, request body (nếu cần), kết quả và status rõ ràng.',
      'Server lấy người dùng từ phiên đã xác thực; quyền sở hữu được kiểm tra cho mọi thao tác trên một đơn.',
      'SQL sử dụng tham số bind, field được cập nhật có allowlist, quy tắc trạng thái nằm phía server.',
      'Tôi phân biệt xóa vật lý, hủy nghiệp vụ và phản hồi 204 không body.',
    ],
    exercise: 'Bổ sung endpoint tạo đơn cho giỏ hàng nhiều sản phẩm. Ghi rõ request, response, status thành công và lỗi khi số lượng bằng 0; đề xuất một cách để client gửi lại sau timeout mà không tạo hai đơn.',
  },
  {
    id: 'data-model-sql',
    title: 'Mô hình dữ liệu và SQL',
    summary: 'Mô hình hóa khách hàng, đơn và dòng hàng; thực hành CRUD bằng SQL tham số hóa cùng API.',
    goals: [
      'Chọn bảng, khóa chính, khóa ngoại và ràng buộc cơ bản cho đơn hàng.',
      'Viết và giải thích các câu SQL INSERT, SELECT, UPDATE, DELETE có tham số.',
      'Liên hệ mỗi câu SQL với endpoint CRUD và quyền truy cập tương ứng.',
    ],
    prerequisites: ['Bài 2: hiểu các thao tác CRUD và hợp đồng API.'],
    concept: [
      'Mô hình quan hệ tách dữ liệu thành bảng có ý nghĩa riêng. `customers` lưu người mua, `orders` lưu đơn, `order_items` lưu từng sản phẩm trong đơn. Khóa chính định danh hàng; khóa ngoại ràng buộc quan hệ. Ràng buộc `NOT NULL`, `CHECK` và `UNIQUE` giúp database từ chối một phần dữ liệu sai ngay cả khi có nhiều client.',
      'SQL CRUD tương ứng trực tiếp với API nhưng database không biết ai đang đăng nhập. API phải truyền `customer_id` đáng tin cậy vào điều kiện truy vấn sau khi xác thực. Mọi giá trị đến từ request phải được bind làm parameter, không ghép nối chuỗi SQL; tên cột hoặc sort direction không thể parameter bind nên phải chọn từ allowlist cố định.',
      'Đơn hàng cần lưu snapshot giá tại thời điểm đặt: nếu chỉ tham chiếu giá hiện tại của sản phẩm, báo cáo đơn cũ có thể thay đổi khi giá bán đổi. Tiền nên dùng kiểu số thập phân chính xác hoặc đơn vị nhỏ nhất (ví dụ đồng nguyên) thay vì số thực nhị phân.',
      'DELETE chỉ phù hợp khi chính sách dữ liệu cho phép xóa thật. Nhiều hệ thống giữ lại đơn và đổi trạng thái để bảo toàn lịch sử. Chọn cách nào cũng phải được phản ánh rõ ở API, ràng buộc database và quy trình nghiệp vụ.',
    ],
    flow: [
      'Từ câu hỏi nghiệp vụ “ai đặt đơn nào, gồm những sản phẩm gì?” xác định entity khách hàng, đơn hàng và dòng hàng.',
      'Tạo khóa chính/ngoại và ràng buộc để đơn không tham chiếu khách hàng hoặc sản phẩm không tồn tại.',
      'API xác thực người dùng rồi truyền customer ID lấy từ danh tính, không lấy owner từ body.',
      'Dùng parameterized SQL và kiểm tra số hàng được đọc/cập nhật để trả 200, 404 hoặc 409 đúng nghĩa.',
    ],
    designGuidance: [
      'Dùng `DECIMAL` hoặc số nguyên đơn vị tiền nhỏ nhất cho tiền, không dùng FLOAT/DOUBLE để tính tiền.',
      'Chỉ SELECT các cột cần dùng; phân trang và sắp xếp theo cột nằm trong allowlist.',
      'Tạo index theo truy vấn thực tế, ví dụ danh sách đơn theo customer và ngày; index giúp đọc nhanh nhưng làm ghi tốn thêm công.',
      'Đặt điều kiện owner và trạng thái ngay trong câu UPDATE/DELETE để tránh khoảng trống giữa bước kiểm tra và bước ghi.',
    ],
    example: {
      introduction: 'Schema tối giản dưới đây gồm các bảng được tham chiếu trong ví dụ CRUD và transaction. `?` là placeholder; thư viện database bind các giá trị riêng, không ghép chuỗi SQL.',
      code: `CREATE TABLE customers (
  id VARCHAR(40) PRIMARY KEY
);

CREATE TABLE products (
  id VARCHAR(40) PRIMARY KEY,
  price DECIMAL(12, 0) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0)
);

CREATE TABLE customer_addresses (
  id VARCHAR(40) PRIMARY KEY,
  customer_id VARCHAR(40) NOT NULL REFERENCES customers(id)
);

CREATE TABLE orders (
  id VARCHAR(40) PRIMARY KEY,
  customer_id VARCHAR(40) NOT NULL REFERENCES customers(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'cancelled')),
  total_amount DECIMAL(12, 0) NOT NULL CHECK (total_amount >= 0),
  shipping_address_id VARCHAR(40) NOT NULL REFERENCES customer_addresses(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
  order_id VARCHAR(40) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(40) NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12, 0) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE outbox_events (
  event_id VARCHAR(40) PRIMARY KEY,
  event_type VARCHAR(80) NOT NULL,
  payload TEXT NOT NULL
);

-- CREATE: POST /api/orders -> 201 Created
INSERT INTO orders (id, customer_id, status, total_amount, shipping_address_id, created_at)
VALUES (?, ?, 'pending', ?, ?, CURRENT_TIMESTAMP);

-- READ: GET /api/orders/o-103 -> 200 OK
SELECT id, status, total_amount, shipping_address_id, created_at
FROM orders
WHERE id = ? AND customer_id = ?;

-- UPDATE: PATCH /api/orders/o-103 -> 200 OK
UPDATE orders
SET shipping_address_id = ?
WHERE id = ? AND customer_id = ? AND status = 'pending';

-- DELETE: DELETE /api/orders/o-103 -> 204 No Content
-- ON DELETE CASCADE xóa các order_items liên quan.
DELETE FROM orders
WHERE id = ? AND customer_id = ? AND status = 'pending';`,
      annotations: [
        'CREATE tạo hàng đơn; trong triển khai thật, transaction cũng ghi các dòng `order_items` liên quan.',
        'READ lọc đồng thời theo ID và customer ID để người dùng không đọc đơn của tài khoản khác.',
        'UPDATE/DELETE gồm trạng thái pending để một đơn đã xác nhận không bị sửa hoặc xóa trái quy tắc.',
        'Sau UPDATE/DELETE, server kiểm tra số hàng bị ảnh hưởng. Không có hàng có thể là không tồn tại, không thuộc quyền hoặc trạng thái không hợp lệ; API xử lý sao cho không tiết lộ dữ liệu.',
        'Ví dụ dùng placeholder `?` theo kiểu driver phổ biến; cú pháp placeholder cụ thể có thể là `$1` hoặc `:id` tùy database/driver.',
      ],
    },
    pitfalls: [
      'Lưu toàn bộ sản phẩm và địa chỉ dạng chuỗi ghép trong một cột khiến khó lọc, ràng buộc và cập nhật an toàn.',
      'Nối input vào SQL hoặc nhận tên cột từ request mà không allowlist, gây SQL injection hoặc truy vấn ngoài ý muốn.',
      'Dùng số thực để tính tổng tiền, dẫn tới sai số làm tròn.',
      'Quên điều kiện customer ID ở truy vấn theo ID, tạo lỗi truy cập ngang giữa các tài khoản.',
      'Tạo index cho mọi cột mà không đo; index làm thao tác ghi và lưu trữ tốn hơn.',
    ],
    checklist: [
      'Tôi giải thích được khóa chính, khóa ngoại và ràng buộc dữ liệu trong schema.',
      'Tôi viết được SQL CRUD với parameter bind và kiểm tra quyền sở hữu.',
      'Tiền và trạng thái đơn có kiểu dữ liệu/ràng buộc phù hợp nghiệp vụ.',
      'Tôi có chính sách rõ ràng cho đơn cần lưu lịch sử thay vì xóa vật lý.',
    ],
    exercise: 'Thiết kế thêm bảng `order_items` cho nhiều sản phẩm trong một đơn. Viết truy vấn đọc các dòng hàng của đơn theo `orderId` và `customerId`; nêu index nào giúp truy vấn đó và vì sao.',
  },
  {
    id: 'transactions-consistency',
    title: 'Transaction và tính nhất quán',
    summary: 'Đảm bảo tạo đơn và các dòng hàng thành công cùng nhau, đồng thời xử lý cạnh tranh tồn kho.',
    goals: [
      'Nêu được mục đích của transaction và ý nghĩa ACID ở mức khái niệm.',
      'Phân biệt thao tác cùng một database với side effect ở dịch vụ bên ngoài.',
      'Chọn cách xử lý lỗi và cập nhật đồng thời khi đặt hàng.',
    ],
    prerequisites: ['Bài 3: biết bảng đơn hàng, dòng hàng và câu lệnh SQL cơ bản.'],
    concept: [
      'Transaction gom nhiều lệnh database thành một đơn vị công việc. ACID gồm atomicity (cùng thành công hoặc cùng rollback), consistency (giữ các ràng buộc), isolation (các transaction đồng thời không tạo trạng thái sai theo mức cô lập được chọn) và durability (commit rồi thì dữ liệu bền theo đảm bảo của database).',
      'Khi tạo đơn, ghi đơn và các dòng hàng thường phải commit cùng nhau. Nếu lệnh thứ ba lỗi, rollback để không lưu một đơn thiếu dòng. Transaction không làm một cổng thanh toán, email hay message broker trở thành một phần của database transaction.',
      'Cạnh tranh xảy ra khi hai khách hàng cùng đặt món hàng cuối cùng. Đọc số lượng tồn rồi sau đó trừ riêng có thể cho cả hai request thấy đủ hàng. Dùng cập nhật có điều kiện/lock phù hợp và kiểm tra số hàng bị ảnh hưởng; giữ transaction ngắn để giảm lock contention.',
      'Đối với side effect bên ngoài, thường dùng trạng thái nghiệp vụ và mẫu outbox hoặc saga/compensation. Ví dụ commit đơn ở trạng thái `payment_pending`, ghi event outbox trong cùng transaction, rồi worker gửi yêu cầu thanh toán và cập nhật kết quả có thể retry.',
    ],
    flow: [
      'Bắt đầu transaction và kiểm tra/cập nhật tồn kho bằng điều kiện nguyên tử.',
      'Tạo đơn cùng các dòng hàng; nếu một bước thất bại thì rollback tất cả thay đổi database.',
      'Ghi sự kiện cần gửi vào outbox trong cùng transaction với đơn.',
      'Worker gửi sự kiện, xử lý lặp an toàn và cập nhật trạng thái; theo dõi đơn thất bại để retry hoặc bù trừ.',
    ],
    designGuidance: [
      'Giữ transaction ngắn; không chờ người dùng, gọi email hay giữ lock trong khi gọi mạng bên ngoài.',
      'Chọn isolation/locking dựa theo invariant cần bảo vệ và khả năng database, sau đó kiểm thử trường hợp đồng thời.',
      'Dùng unique key hoặc idempotency key để retry không nhân đôi đơn; thao tác worker phải chịu được gửi lặp.',
      'Định nghĩa trạng thái trung gian và cách xử lý khi thanh toán thành công nhưng callback bị trễ hoặc gửi lại.',
    ],
    example: {
      introduction: 'Đoạn giả mã SQL minh họa cập nhật tồn kho có điều kiện và ghi đơn/dòng hàng trong cùng transaction. Cú pháp lock khác nhau theo hệ quản trị.',
      code: `BEGIN;

UPDATE products
SET stock_quantity = stock_quantity - ?
WHERE id = ? AND stock_quantity >= ?;
-- Nếu không cập nhật đúng một hàng: ROLLBACK và báo hết hàng.

INSERT INTO orders (id, customer_id, status, total_amount, shipping_address_id, created_at)
VALUES (?, ?, 'payment_pending', ?, ?, CURRENT_TIMESTAMP);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (?, ?, ?, ?);

INSERT INTO outbox_events (event_id, event_type, payload)
VALUES (?, 'OrderCreated', ?);

COMMIT;
-- Worker đọc outbox sau commit để khởi chạy bước thanh toán.`,
      annotations: [
        'UPDATE giảm tồn chỉ khi đủ hàng; điều kiện này được database kiểm tra trong cùng thao tác, không dựa vào một lần đọc cũ.',
        'Nếu số hàng cập nhật không bằng một, server rollback và trả xung đột nghiệp vụ, thường là 409.',
        'Đơn ở trạng thái `payment_pending` hợp lệ theo CHECK constraint; địa chỉ và thời điểm tạo đáp ứng các cột NOT NULL.',
        'Đơn, dòng hàng và outbox commit cùng nhau; worker không thể thấy event của transaction chưa commit.',
        'Thanh toán không nằm trong transaction SQL. Worker cần idempotency và retry có giới hạn/backoff.',
      ],
    },
    pitfalls: [
      'Ghi đơn trước, ghi dòng hàng sau nhưng không dùng transaction, để lại dữ liệu nửa vời khi bước sau lỗi.',
      'Giữ transaction mở trong lúc gọi cổng thanh toán hoặc gửi email, làm khóa dữ liệu bị giữ lâu.',
      'Tin rằng transaction của một database rollback được side effect đã xảy ra ở dịch vụ ngoài.',
      'Đọc stock rồi cập nhật bằng giá trị cũ, cho phép oversell khi hai request chạy đồng thời.',
      'Retry một thao tác không idempotent khiến tạo đơn hoặc trừ tiền lặp.',
    ],
    checklist: [
      'Tôi xác định được những ghi database nào phải cùng commit/rollback.',
      'Transaction có phạm vi gọn, rollback khi lỗi và không bao trùm lời gọi mạng bên ngoài.',
      'Cạnh tranh tồn kho có invariant được bảo vệ ở database.',
      'Event, payment và retry có trạng thái/khóa chống lặp phù hợp.',
    ],
    exercise: 'Mô tả điều gì xảy ra nếu database đã commit đơn nhưng worker thanh toán bị dừng trước khi nhận event. Đề xuất cách worker tìm lại công việc chưa xử lý và tránh gửi thanh toán hai lần.',
  },
  {
    id: 'authentication-authorization',
    title: 'Xác thực và phân quyền',
    summary: 'Tách “bạn là ai?” khỏi “bạn được làm gì?” và áp dụng quyền sở hữu cho từng đơn hàng.',
    goals: [
      'Phân biệt authentication và authorization.',
      'Mô tả cách session/token xác định người dùng và cách kiểm tra quyền ở từng endpoint.',
      'Ngăn truy cập đơn của người khác kể cả khi họ biết hoặc đoán ID.',
    ],
    prerequisites: ['Bài 2: biết endpoint API; bài 3: biết điều kiện lọc theo customer ID.'],
    concept: [
      'Xác thực (authentication) trả lời “request này đại diện cho ai?”; phân quyền (authorization) trả lời “danh tính đó được phép làm thao tác nào trên tài nguyên này?”. Đăng nhập hợp lệ chỉ chứng minh danh tính, không cấp quyền xem tất cả đơn.',
      'Session thường gắn browser với trạng thái đăng nhập phía server qua cookie được bảo vệ; token là credential được client gửi kèm request và cần kiểm tra chữ ký, issuer, audience, thời hạn và scope theo thiết kế. Dù dùng cách nào, client không được tự khẳng định role hoặc customer ID có quyền.',
      'Kiểm tra quyền theo tầng: quyền chức năng (người dùng được tạo đơn không), quyền tài nguyên (đơn có thuộc người đó không), và quyền trường (có được đổi trạng thái/giá không). Có thể kết hợp chính sách vai trò với quan hệ sở hữu.',
      'Lỗi 401 thường dành cho thiếu/sai thông tin xác thực; 403 cho danh tính không đủ quyền. Với tài nguyên nhạy cảm, một hệ thống có thể dùng 404 để không tiết lộ sự tồn tại của tài nguyên, nhưng phải nhất quán và vẫn ghi nhận sự kiện phù hợp.',
    ],
    flow: [
      'Client gửi cookie phiên hoặc bearer token qua kênh HTTPS.',
      'Middleware xác minh credential và dựng danh tính đáng tin cậy từ dữ liệu đã kiểm chứng.',
      'API kiểm tra quyền trên thao tác và đơn cụ thể; điều kiện customer ID được áp dụng trong truy vấn.',
      'Từ chối với phản hồi an toàn nếu chưa đăng nhập/không đủ quyền; không trả dữ liệu đơn trước khi kiểm tra.',
    ],
    designGuidance: [
      'Lưu mật khẩu bằng thư viện băm chuyên dụng có salt và tham số chi phí phù hợp; không tự thiết kế thuật toán.',
      'Cookie session dùng thuộc tính bảo vệ phù hợp (`HttpOnly`, `Secure`, `SameSite`) và có vòng đời/thu hồi.',
      'Mỗi endpoint ghi và đọc đơn đều xác minh owner phía server; không dựa vào nút bị ẩn ở giao diện.',
      'Áp dụng quyền tối thiểu: response chỉ trả trường client cần và thao tác chỉ nhận trường được phép.',
    ],
    example: {
      introduction: 'Danh tính đã xác thực được truyền vào lớp nghiệp vụ; điều kiện ownership nằm trong truy vấn để tránh kiểm tra hời hợt ở client.',
      code: `// Pseudocode: middleware đã xác minh credential
const customerId = request.authenticatedUser.id;
const orderId = request.params.orderId;

const order = await db.oneOrNone(
  \`SELECT id, status, total_amount
   FROM orders
   WHERE id = ? AND customer_id = ?\`,
  [orderId, customerId],
);

if (!order) {
  return response.status(404).json({ error: { code: 'ORDER_NOT_FOUND' } });
}

return response.status(200).json(order);`,
      annotations: [
        'Đây là giả mã JavaScript minh họa; `request.authenticatedUser` chỉ tồn tại sau middleware xác minh credential.',
        'Customer ID lấy từ danh tính đã xác thực, không lấy từ query hoặc body mà client có thể sửa.',
        'Điều kiện cả `id` và `customer_id` khiến truy vấn không trả đơn của tài khoản khác.',
        'Thông báo 404 chung có thể tránh lộ đơn có tồn tại hay không; chính sách phản hồi cần thống nhất trong API.',
      ],
    },
    pitfalls: [
      'Chỉ ẩn nút sửa/xóa trên giao diện mà endpoint vẫn chấp nhận request trực tiếp.',
      'Tin `customerId` hoặc `role` trong request body do client gửi.',
      'Kiểm tra role chung nhưng không kiểm tra quyền sở hữu từng order ID, dẫn tới IDOR/BOLA.',
      'Lưu mật khẩu dạng rõ hoặc ghi token/session ID vào log.',
      'Chỉ bảo vệ GET nhưng quên kiểm tra quyền trên PATCH và DELETE.',
    ],
    checklist: [
      'Tôi phân biệt được danh tính và quyền hành động.',
      'Mọi endpoint nhạy cảm kiểm tra quyền tại server trên đúng tài nguyên.',
      'ID người dùng lấy từ credential được xác minh; query/response chỉ chứa dữ liệu cần thiết.',
      'Mật khẩu và token được bảo vệ, vòng đời session/token được tính đến.',
    ],
    exercise: 'Một người dùng đã đăng nhập gửi `PATCH /api/orders/o-103` và sửa địa chỉ giao hàng. Liệt kê các kiểm tra cần chạy trước SQL, các điều kiện nên có trong UPDATE và status phù hợp khi đơn đã chuyển sang confirmed.',
  },
  {
    id: 'validation-errors',
    title: 'Validation và xử lý lỗi',
    summary: 'Kiểm tra dữ liệu tại biên API, trả lỗi có cấu trúc và không để lỗi nội bộ lọt ra ngoài.',
    goals: [
      'Phân biệt kiểm tra cú pháp/kiểu dữ liệu với quy tắc nghiệp vụ.',
      'Thiết kế phản hồi lỗi ổn định để client có thể sửa request.',
      'Tách thông tin an toàn cho người dùng khỏi chi tiết cần ghi trong log.',
    ],
    prerequisites: ['Bài 1: hiểu status code; bài 2: hiểu endpoint và body API.'],
    concept: [
      'Validation kiểm tra dữ liệu ở ranh giới hệ thống. Kiểm tra cấu trúc gồm JSON hợp lệ, kiểu trường, độ dài và định dạng; kiểm tra nghiệp vụ gồm số lượng lớn hơn 0, địa chỉ thuộc người mua và đơn còn ở trạng thái được sửa. Client có thể hỗ trợ validation để báo lỗi sớm, nhưng server luôn phải kiểm tra lại.',
      'Một lỗi tốt có status phù hợp, mã máy đọc được, thông điệp ngắn an toàn và chi tiết trường khi cần. Ví dụ `VALIDATION_ERROR` giúp client hiển thị lỗi mà không phụ thuộc vào ngôn ngữ câu chữ. Quy ước có thể dùng 400 cho request không parse được, 422 cho dữ liệu hiểu được nhưng không hợp lệ; quan trọng là API nhất quán.',
      'Lỗi dự kiến như thiếu trường, không đủ hàng hoặc sai trạng thái khác với lỗi bất ngờ như database mất kết nối. Client cần thông tin đủ để xử lý; log nội bộ có thể chứa correlation ID và stack trace được kiểm soát, không gửi stack trace, câu SQL hay bí mật cho client.',
      'Validation không thay thế constraint database. Hai request đồng thời có thể cùng vượt qua bước kiểm tra trong ứng dụng; unique/check/foreign key và cập nhật có điều kiện là lớp cuối bảo vệ invariant.',
    ],
    flow: [
      'Parse body, giới hạn kích thước request và từ chối JSON sai cấu trúc.',
      'Kiểm tra kiểu/định dạng/range, rồi kiểm tra quyền và quy tắc nghiệp vụ.',
      'Gọi database có constraint và xử lý xung đột phát sinh đồng thời.',
      'Map lỗi đã biết sang status + error code; lỗi ngoài dự kiến được log với correlation ID và trả thông báo an toàn.',
    ],
    designGuidance: [
      'Xác định giới hạn cho số lượng, độ dài text, số item và kích thước payload để chống request quá lớn.',
      'Không tin dữ liệu đã được validate ở trình duyệt; kiểm tra server là bắt buộc.',
      'Dùng một schema/validator và định dạng lỗi thống nhất, nhưng đặt quy tắc nghiệp vụ ở tầng có đủ ngữ cảnh.',
      'Đảm bảo thông báo lỗi không xác nhận sự tồn tại của tài khoản hoặc tài nguyên nhạy cảm nếu điều đó tạo rủi ro.',
    ],
    example: {
      introduction: 'Server phát hiện một mặt hàng có quantity không hợp lệ và trả lỗi có thể hiển thị ngay cạnh trường tương ứng.',
      code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/json
X-Request-Id: req-7f2a

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu đơn hàng chưa hợp lệ",
    "fields": {
      "items[0].quantity": "Phải là số nguyên từ 1 đến 20"
    },
    "requestId": "req-7f2a"
  }
}`,
      annotations: [
        '422 là một lựa chọn quy ước cho JSON hợp lệ nhưng không qua validation; một số API dùng 400 cho cùng trường hợp.',
        'Error code ổn định cho máy; message tiếng Việt dành cho người dùng có thể thay đổi hoặc bản địa hóa.',
        'Không trả stack trace, tên bảng, câu SQL hoặc dữ liệu nhạy cảm trong payload.',
        'Request ID giúp nhóm vận hành nối phản hồi với log nội bộ mà không phải đưa chi tiết nội bộ ra client.',
      ],
    },
    pitfalls: [
      'Chỉ validate ở giao diện rồi tin rằng API không thể nhận dữ liệu sai.',
      'Trả stack trace, nội dung query hoặc thông tin cấu hình trong lỗi 500.',
      'Dùng HTTP 200 cho lỗi nghiệp vụ khiến client hiểu nhầm request đã thành công.',
      'Kiểm tra tồn kho trước nhưng không bảo vệ lại khi ghi, tạo race condition.',
      'Thông báo lỗi chứa dữ liệu nhạy cảm hoặc làm lộ tài khoản/tài nguyên có tồn tại.',
    ],
    checklist: [
      'Request được giới hạn kích thước, parse và validate lại phía server.',
      'Lỗi có status và mã ổn định; lỗi field giúp người dùng biết cần sửa gì.',
      'Lỗi bất ngờ không lộ chi tiết nội bộ và có request/correlation ID để truy vết.',
      'Invariant quan trọng còn được bảo vệ bởi constraint hoặc thao tác nguyên tử ở database.',
    ],
    exercise: 'Định nghĩa response cho ba lỗi: JSON sai cú pháp, quantity bằng 0, và đơn đã giao nhưng người dùng xin hủy. Chọn status/error code và giải thích dữ liệu nào nên hoặc không nên đưa vào response.',
  },
  {
    id: 'security',
    title: 'Bảo mật nền tảng',
    summary: 'Bảo vệ ranh giới tin cậy, bí mật, dữ liệu đơn hàng và các endpoint trước lạm dụng phổ biến.',
    goals: [
      'Nhận diện các ranh giới tin cậy trong luồng request tới database.',
      'Áp dụng nguyên tắc quyền tối thiểu, parameterized SQL và quản lý secret.',
      'Nêu biện pháp giảm rủi ro cho dữ liệu, endpoint và log.',
    ],
    prerequisites: ['Bài 2 và 5: hiểu API, xác thực và quyền sở hữu tài nguyên.'],
    concept: [
      'Bảo mật Backend là bảo vệ tính bí mật, toàn vẹn và khả dụng của dữ liệu/chức năng trước hành vi sai hoặc ác ý. Mọi dữ liệu từ client, header, file upload và dịch vụ ngoài đều là input không đáng tin cho đến khi được kiểm tra.',
      'Nguyên tắc quyền tối thiểu giảm thiệt hại nếu credential bị lộ: tài khoản ứng dụng database chỉ có quyền cần thiết, endpoint chỉ trả dữ liệu cần, và người dùng chỉ thao tác với tài nguyên được phép. Dùng parameterized SQL, mã hóa/escape đầu ra theo ngữ cảnh và giới hạn request để giảm các nhóm lỗi phổ biến.',
      'Secret như mật khẩu database, signing key và API key không nằm trong source hoặc log. Trong môi trường triển khai, dùng secret manager hoặc cơ chế môi trường được bảo vệ, luân chuyển secret khi lộ và không dùng credential thật trong ví dụ học tập.',
      'Bảo vệ web còn gồm TLS, chính sách CORS phù hợp, chống CSRF khi dùng cookie theo bối cảnh, giới hạn tốc độ, cập nhật dependency và sao lưu có kiểm tra khôi phục. Không có một header hay thư viện duy nhất nào thay cho threat modeling và kiểm soát quyền.',
    ],
    flow: [
      'Xác định tài sản cần bảo vệ: đơn, địa chỉ, thông tin đăng nhập, secret và khả năng tạo/đọc đơn.',
      'Vẽ ranh giới: browser → API → database/queue/payment; kiểm tra lại dữ liệu qua từng ranh giới.',
      'Giới hạn quyền mỗi thành phần, bảo vệ credential/kết nối và ghi nhận sự kiện phù hợp.',
      'Kiểm thử các trường hợp truy cập trái phép, lạm dụng request và khôi phục sau sự cố.',
    ],
    designGuidance: [
      'Không ghi password, token, cookie, secret hay dữ liệu cá nhân đầy đủ vào log; mask hoặc bỏ trường.',
      'Áp dụng rate limit theo tài khoản/địa chỉ/mức độ rủi ro và phản hồi 429 khi giới hạn.',
      'Bảo vệ cookie/session, cấu hình CORS theo origin được phép và cân nhắc CSRF cho request dùng cookie.',
      'Dùng HTTPS, backup mã hóa và thử restore; backup chưa thử khôi phục chưa chứng minh có thể phục hồi.',
    ],
    example: {
      introduction: 'Một truy vấn theo ID vẫn phải giới hạn chủ sở hữu và bind giá trị. Kiểm soát quyền và injection giải quyết các vấn đề khác nhau nên cả hai đều cần.',
      code: `const orderId = request.params.orderId;
const customerId = authenticatedUser.id;

const result = await db.query(
  'SELECT id, status, total_amount FROM orders WHERE id = ? AND customer_id = ?',
  [orderId, customerId],
);

if (result.rowCount === 0) {
  return response.status(404).json({ error: { code: 'ORDER_NOT_FOUND' } });
}

logger.info({
  event: 'order.read',
  orderId,
  customerId,
  requestId: request.id,
});`,
      annotations: [
        'Placeholder và danh sách giá trị tách dữ liệu khỏi cấu trúc câu SQL.',
        'Customer ID đến từ danh tính đã xác thực; parameterization không tự kiểm tra quyền sở hữu.',
        'Log ghi sự kiện tối thiểu để điều tra; không ghi token, mật khẩu, địa chỉ đầy đủ hoặc toàn bộ body.',
        'Thư viện cụ thể có thể dùng API khác; cần dùng đúng cơ chế parameter binding của driver.',
      ],
    },
    pitfalls: [
      'Đưa secret dùng thật vào repository, issue, ảnh chụp màn hình hoặc log.',
      'Cho rằng ID khó đoán hoặc CORS đã ngăn người khác gọi API.',
      'Dùng quyền database quá rộng cho ứng dụng web.',
      'Ghi toàn bộ request/response, bao gồm token và địa chỉ người nhận, vào log.',
      'Dựa vào một lớp bảo vệ (ví dụ WAF) thay cho kiểm tra quyền và validation trong ứng dụng.',
    ],
    checklist: [
      'Input từ client được xem là không đáng tin và được kiểm tra tại server.',
      'Endpoint xác minh danh tính, quyền sở hữu và quyền trường ở đúng nơi.',
      'SQL tham số hóa; credential có quyền tối thiểu và không nằm trong source/log.',
      'Có cân nhắc TLS, rate limit, CSRF/CORS theo cơ chế xác thực và backup/restore.',
    ],
    exercise: 'Tạo một danh sách 5 tài sản cần bảo vệ trong API đơn hàng. Với mỗi tài sản, ghi một rủi ro, một biện pháp phòng ngừa và loại sự kiện nào có thể ghi log mà không lưu lộ dữ liệu cá nhân.',
  },
  {
    id: 'testing',
    title: 'Kiểm thử Backend',
    summary: 'Chọn unit, integration và API test để xác nhận CRUD, quyền truy cập và quy tắc đơn hàng.',
    goals: [
      'Phân biệt unit test, integration test và end-to-end/API test.',
      'Thiết kế kiểm thử cho nhánh thành công, lỗi và quyền sở hữu.',
      'Giữ test độc lập, lặp lại được và không phụ thuộc dịch vụ thật ngoài ý muốn.',
    ],
    prerequisites: ['Bài 2, 3 và 5: nắm API CRUD, SQL và quyền.'],
    concept: [
      'Unit test kiểm tra một đơn vị nhỏ với dependency giả hoặc được cô lập, ví dụ tính tổng đơn. Integration test kiểm tra phần ghép giữa code và database thật/thử nghiệm. API test gửi request qua router/middleware để xác nhận hợp đồng HTTP, status, response và quyền. Các tầng này bổ sung nhau; không tầng nào tự chứng minh toàn hệ thống hoàn hảo.',
      'Một test hữu ích nói rõ điều kiện, hành động và kết quả. Với API đơn hàng, không chỉ test Create thành công: cần thử quantity sai, người dùng chưa đăng nhập, khách hàng khác đọc đơn, cập nhật trạng thái bị cấm, và xóa đơn không tồn tại.',
      'Test database nên dùng database cô lập, migration/schema giống môi trường cần kiểm tra và dọn dữ liệu giữa các test. Test không nên gọi cổng thanh toán thật; fake/sandbox an toàn hơn. Tuy nhiên, mock mọi thứ có thể khiến test không phát hiện SQL sai hoặc cấu hình database sai.',
      'Test concurrency cần kiểm tra invariant khi request chạy đồng thời, không chỉ lặp tuần tự. Test ngẫu nhiên hoặc flaky phải được điều tra thay vì bỏ qua, vì chúng thường báo hiệu chia sẻ trạng thái hoặc phụ thuộc thời gian.',
    ],
    flow: [
      'Chọn hành vi/rủi ro cần bảo vệ và đặt điều kiện ban đầu rõ ràng.',
      'Chạy unit test cho quy tắc thuần; integration test cho SQL/transaction; API test cho auth, validation và status.',
      'Dùng dữ liệu riêng, không dựa vào thứ tự test; dọn hoặc rollback trạng thái sau mỗi trường hợp.',
      'Chạy tự động trong CI và kiểm tra lỗi thất bại trước khi triển khai.',
    ],
    designGuidance: [
      'Kiểm thử cả trạng thái dữ liệu sau request, không chỉ assert status 201.',
      'Dùng dữ liệu biên: quantity 1, giới hạn tối đa, 0, âm, giá trị thiếu và ID không tồn tại.',
      'Kiểm tra quyền bằng hai customer khác nhau; khẳng định dữ liệu của người A không lộ cho người B.',
      'Mock side effect thanh toán/email ở unit test; có integration test riêng cho adapter nếu cần.',
    ],
    example: {
      introduction: 'Bộ test API nhỏ minh họa ba tình huống quan trọng: tạo đơn thành công, validation lỗi và ngăn khách hàng khác đọc đơn.',
      code: `test('tạo đơn hợp lệ trả 201 và lưu đơn', async () => {
  const response = await apiAs(customerA).post('/api/orders', {
    items: [{ productId: 'p-42', quantity: 2 }],
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe('pending');
  expect(await orderRepository.findById(response.body.id)).not.toBeNull();
});

test('quantity bằng 0 bị từ chối', async () => {
  const response = await apiAs(customerA).post('/api/orders', {
    items: [{ productId: 'p-42', quantity: 0 }],
  });

  expect(response.status).toBe(422);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});

test('khách khác không đọc được đơn', async () => {
  const response = await apiAs(customerB).get('/api/orders/o-103');

  expect(response.status).toBe(404);
});`,
      annotations: [
        'Đây là giả mã kiểu Jest/Supertest; tên helper cần thay theo framework của dự án.',
        'Test thành công kiểm tra cả response và tác động database.',
        'Test lỗi xác nhận mã máy ổn định, không phụ thuộc vào nguyên văn message.',
        'Test truy cập ngang dùng danh tính khác để bắt lỗi chỉ kiểm tra đăng nhập mà quên ownership.',
      ],
    },
    pitfalls: [
      'Chỉ assert status code mà không kiểm tra nội dung response và trạng thái database.',
      'Test phụ thuộc thứ tự chạy hoặc dùng chung dữ liệu, khiến thất bại ngẫu nhiên.',
      'Mock database trong tất cả test rồi không có integration test nào kiểm tra SQL thật.',
      'Dùng dịch vụ thanh toán thật trong test tự động, gây chi phí hoặc tác động thật.',
      'Bỏ test quyền sở hữu, cập nhật trạng thái bất hợp lệ và trường hợp cạnh tranh.',
    ],
    checklist: [
      'Mỗi test có setup/act/assert rõ ràng và không phụ thuộc thứ tự chạy.',
      'Các tầng test phù hợp với rủi ro: logic, SQL/transaction, HTTP/API.',
      'Test kiểm tra dữ liệu trả về và side effect, bao gồm lỗi và quyền.',
      'Dịch vụ ngoài được cô lập; database thử nghiệm không dùng dữ liệu thật.',
    ],
    exercise: 'Viết test case cho DELETE một đơn đã confirmed và cho PATCH đơn không thuộc customer hiện tại. Ghi setup, request, status dự kiến và assertion về dữ liệu sau request.',
  },
  {
    id: 'performance-cache-async',
    title: 'Hiệu năng, cache và bất đồng bộ',
    summary: 'Tìm bottleneck trước khi tối ưu; giảm truy vấn thừa và dùng queue/cache có quy tắc nhất quán.',
    goals: [
      'Đo p95/p99 latency và phân biệt CPU, database, mạng, queue bottleneck.',
      'Nhận diện N+1, thiếu index và giới hạn danh sách.',
      'Giải thích cache invalidation, asynchronous work và xử lý retry.',
    ],
    prerequisites: ['Bài 3 và 4: hiểu truy vấn database, transaction và luồng sự kiện.'],
    concept: [
      'Hiệu năng không chỉ là “nhanh trên máy mình”. Theo dõi latency theo percentile (p50/p95/p99), throughput, lỗi, saturation và thời gian từng dependency. Trung bình có thể che giấu nhóm request rất chậm. Đo trước khi tối ưu để tránh làm code phức tạp mà không cải thiện trải nghiệm.',
      'Database thường là điểm nghẽn do thiếu index, truy vấn không giới hạn, N+1 query hoặc khóa kéo dài. Tối ưu bằng query plan, chọn cột cần thiết, phân trang, batch khi phù hợp và index theo cách lọc/sắp xếp thực tế. Index có chi phí ghi và bộ nhớ.',
      'Cache lưu kết quả có thể dùng lại để giảm đọc, nhưng phải trả lời: key gồm gì, TTL bao lâu, khi nào invalidation, dữ liệu có được chia sẻ giữa người dùng không. Cache sai key có thể làm lộ dữ liệu của người khác; cache cũ có thể trả trạng thái đơn không còn đúng.',
      'Bất đồng bộ đưa công việc chậm/không bắt buộc vào queue để API trả lời nhanh hơn, ví dụ gửi email xác nhận sau khi đơn commit. Queue thường cung cấp at-least-once delivery nên worker cần idempotent, retry có backoff, dead-letter/giám sát và thứ tự xử lý được định nghĩa.',
    ],
    flow: [
      'Đo request end-to-end và phân rã thời gian ở app, database, cache và dịch vụ ngoài.',
      'Tối ưu truy vấn/connection pool, giới hạn page size và xác nhận bằng benchmark hoặc metric.',
      'Cache dữ liệu đọc an toàn với key có tenant/user scope khi cần và chính sách invalidation rõ.',
      'Đẩy công việc phụ vào queue sau commit; worker idempotent, retry có giới hạn và cảnh báo backlog.',
    ],
    designGuidance: [
      'Dùng query plan và metric thực tế trước khi tạo index; theo dõi cả read latency lẫn write cost.',
      'Áp đặt timeout, giới hạn concurrency và backpressure để quá tải không lan rộng.',
      'Không cache response cá nhân hóa dưới key chung; tách dữ liệu công khai và riêng tư.',
      'Gửi event qua outbox nếu cần tránh trạng thái database commit nhưng publish thất bại.',
    ],
    example: {
      introduction: 'API danh sách đơn phân trang, chọn đúng cột và dùng index phù hợp. Email xác nhận chạy bất đồng bộ sau khi tạo đơn thành công.',
      code: `-- Index phục vụ lọc đơn theo khách và sắp xếp mới nhất
CREATE INDEX idx_orders_customer_created
ON orders (customer_id, created_at DESC);

SELECT id, status, total_amount, created_at
FROM orders
WHERE customer_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- Sau khi transaction tạo đơn commit:
INSERT INTO outbox_events (event_id, event_type, payload)
VALUES (?, 'OrderConfirmationRequested', ?);

-- Worker: xử lý idempotent theo event_id, gửi email, rồi đánh dấu hoàn tất.`,
      annotations: [
        'Composite index bắt đầu bằng customer_id vì API lọc theo khách, rồi sắp xếp theo created_at.',
        'API phải giới hạn page size tối đa; OFFSET lớn có thể chậm nên có thể chuyển sang cursor pagination khi cần.',
        'Index là quyết định dựa theo workload; nó làm INSERT/UPDATE tốn thêm và cần được đo.',
        'Outbox record cùng transaction đơn hàng giúp worker không mất sự kiện khi tiến trình dừng sau commit.',
      ],
    },
    pitfalls: [
      'Tối ưu theo cảm giác hoặc chỉ nhìn latency trung bình.',
      'Thêm index tràn lan mà không đo kế hoạch truy vấn và chi phí ghi.',
      'Cache response riêng tư mà bỏ user/customer ID khỏi cache key.',
      'Gọi email hoặc thanh toán đồng bộ trong request tạo đơn, kéo dài latency và giữ tài nguyên.',
      'Retry message không idempotent, gửi email hoặc tạo side effect lặp vô hạn.',
    ],
    checklist: [
      'Có metric latency percentile, lỗi và dependency để xác định bottleneck.',
      'Danh sách được giới hạn; truy vấn và index có căn cứ workload.',
      'Cache key/TTL/invalidation tính tới phạm vi người dùng và dữ liệu cũ.',
      'Worker có timeout, retry/backoff, idempotency và theo dõi backlog.',
    ],
    exercise: 'API danh sách đơn chậm khi khách hàng có hàng trăm nghìn đơn. Hãy nêu ba phép đo hoặc kiểm tra đầu tiên, đề xuất cách phân trang và giải thích rủi ro nếu cache bằng URL mà không thêm customer ID vào key.',
  },
  {
    id: 'deployment-observability',
    title: 'Triển khai và observability',
    summary: 'Đưa thay đổi lên môi trường có kiểm soát, theo dõi lỗi và lên kế hoạch rollback an toàn.',
    goals: [
      'Mô tả các bước từ build/test tới deploy và xác minh sau phát hành.',
      'Phân biệt log, metric và trace trong điều tra sự cố.',
      'Thiết kế health check, migration và rollback không làm mất dữ liệu.',
    ],
    prerequisites: ['Các bài trước: có API, database, test và metric cơ bản.'],
    concept: [
      'Triển khai là đưa một phiên bản đã kiểm tra tới môi trường chạy. Một pipeline cơ bản cài dependency có khóa phiên bản, lint/test/build, tạo artifact, triển khai theo môi trường, chạy health check và theo dõi. Môi trường thật không nên dùng cấu hình mẫu hoặc secret trong source.',
      'Observability trả lời “hệ thống đang làm gì và vì sao?”. Log là sự kiện có ngữ cảnh; metric là số liệu theo thời gian như request rate, error rate, latency và saturation; trace nối các bước qua API, database và worker. Correlation/trace ID giúp nối request mà không cần log toàn bộ payload cá nhân.',
      'Schema migration cần tương thích với phiên bản cũ/mới khi deploy từng phần. Mẫu expand-and-contract thường thêm cột/tính năng tương thích trước, triển khai code mới, backfill, rồi mới loại bỏ cột cũ. Không nên giả định rollback code tự đảo ngược migration dữ liệu.',
      'Sự cố cần quy trình phát hiện, phân loại mức độ, giảm tác động, khôi phục và học sau sự cố. Canary/rolling deploy giúp phát hiện sớm; rollback phải được thực hành và không xóa dữ liệu vừa được tạo.',
    ],
    flow: [
      'Commit được kiểm tra tự động và tạo artifact có thể tái lập.',
      'Triển khai với config/secret đúng môi trường, migration tương thích và quyền tối thiểu.',
      'Health check xác nhận app sẵn sàng; smoke test tạo/đọc đơn thử nghiệm an toàn.',
      'Quan sát error rate, p95/p99, database và queue; dừng rollout hoặc rollback khi vượt ngưỡng.',
    ],
    designGuidance: [
      'Tách liveness (process còn sống) khỏi readiness (có thể nhận traffic); tránh health check gây tải nặng.',
      'Dùng migration theo hướng tương thích trước; backup và kế hoạch khôi phục được kiểm thử.',
      'Không ghi secret/PII vào log; giữ trace/correlation ID và thời gian lưu log phù hợp.',
      'Định nghĩa ngưỡng cảnh báo có hành động rõ, người nhận và hướng dẫn ứng phó.',
    ],
    example: {
      introduction: 'Một checklist phát hành cho phiên bản thêm trường trạng thái và luồng hủy đơn.',
      code: `1. CI: kiểm tra format, test unit/API, build artifact và scan dependency.
2. Deploy migration tương thích: thêm cấu trúc mới, chưa xóa cột cũ.
3. Rollout từng phần; health/readiness check và smoke test API đơn.
4. Theo dõi error rate, p95 latency, DB pool và queue backlog.
5. Nếu lỗi vượt ngưỡng: dừng rollout, rollback code tương thích; giữ dữ liệu an toàn.
6. Sau khi ổn định: backfill, xác minh dữ liệu, rồi lên kế hoạch loại bỏ cấu trúc cũ.`,
      annotations: [
        'Artifact đã build/test được triển khai thay vì build khác không kiểm chứng trên máy chủ.',
        'Migration tương thích cho phép code cũ và mới cùng tồn tại trong lúc rollout.',
        'Rollback code không có nghĩa rollback dữ liệu; destructive migration cần kế hoạch riêng.',
        'Theo dõi cả app, database và queue vì API có thể trả 2xx trong khi worker đang nghẽn.',
      ],
    },
    pitfalls: [
      'Triển khai trực tiếp không có test, health check hoặc cách dừng rollout.',
      'Chạy migration phá hủy trước khi mọi instance cũ ngừng dùng schema cũ.',
      'Ghi secret hoặc payload chứa địa chỉ/thông tin cá nhân vào log/trace.',
      'Coi HTTP process còn sống là đủ, không kiểm tra readiness và dependency thiết yếu.',
      'Tạo cảnh báo quá nhiều hoặc không gắn với hướng dẫn hành động, khiến cảnh báo bị bỏ qua.',
    ],
    checklist: [
      'Build/test tạo artifact đã kiểm tra và cấu hình/secret được cấp theo môi trường.',
      'Migration có thứ tự tương thích, backup và kế hoạch rollback/forward rõ.',
      'Có liveness/readiness, smoke test và theo dõi error rate/latency/dependency.',
      'Log/metric/trace có correlation ID nhưng tránh secret và dữ liệu cá nhân không cần thiết.',
    ],
    exercise: 'Lập kế hoạch phát hành thay đổi cho phép hủy đơn. Ghi thứ tự migration, cách triển khai code tương thích, hai metric cần theo dõi và điều kiện khiến bạn dừng rollout hoặc rollback.',
  },
];
