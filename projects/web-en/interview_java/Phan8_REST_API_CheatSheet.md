# PHẦN 8 — REST API, MVC VÀ CÁCH TỔ CHỨC BACKEND

## 1. REST API và MVC khác nhau thế nào?

REST là phong cách thiết kế hợp đồng HTTP quanh resource: URL xác định resource, HTTP method mô tả thao tác, status/header/body diễn đạt kết quả. MVC là mô hình phân chia trách nhiệm trình bày và xử lý request. Spring MVC dùng `DispatcherServlet` để điều phối request tới controller. REST API có thể được triển khai bằng Spring MVC, nhưng REST không đồng nghĩa với MVC.

Trong REST API, response thường là JSON cho frontend/mobile thay vì template HTML. `@RestController` kết hợp vai trò controller với việc ghi kết quả method vào response body; Spring dùng message converter để chuyển Java object thành JSON.

## 2. Request đi qua những tầng nào?

```text
HTTP request → filter/security → DispatcherServlet → Controller → Service/use case
             → Repository → database
HTTP response ← JSON/status/headers ← Controller ← Service ← Repository
```

- **Controller:** biên HTTP; đọc path/query/body, chạy validation đầu vào, gọi use case và chọn status/header/response DTO. Tránh đặt quy tắc nghiệp vụ hoặc truy vấn DB trực tiếp ở đây.
- **Service/use case:** thực hiện một mục tiêu nghiệp vụ, phối hợp các bước và đặt ranh giới transaction. Đây thường là chỗ tốt để kiểm thử hành vi nghiệp vụ.
- **Repository:** trừu tượng hóa đọc/ghi dữ liệu. Không nên biết HTTP status, URL hay cách hiển thị lỗi cho client.
- **DTO:** hợp đồng dữ liệu vào/ra API. Tách khỏi Entity để tránh lộ field và tránh thay đổi schema DB làm đổi API ngoài ý muốn.
- **Entity/domain:** biểu diễn dữ liệu được lưu hoặc khái niệm nghiệp vụ. Không nên để client cập nhật thẳng mọi field của entity.

### Ví dụ tạo sản phẩm

Client gửi `POST /api/products` với `CreateProductRequest`. Controller nhận JSON và validation. Service kiểm tra quy tắc giá, tạo đối tượng và gọi repository. Repository lưu dữ liệu. Controller trả `201 Created`, header `Location: /api/products/{id}` và `ProductResponse`.

### Tại sao có Service?

Service tạo ranh giới cho use case: transaction, quy tắc nghiệp vụ, phối hợp nhiều repository hoặc gọi dịch vụ khác. Nếu controller gọi repository trực tiếp, một endpoint CRUD đọc rất đơn giản có thể ngắn hơn. Nhưng khi logic phát triển, controller dễ thành “fat controller”, quy tắc bị lặp, transaction khó nhìn thấy và test phải dựng nhiều chi tiết HTTP. Không cần tạo service chỉ để chuyển tiếp một dòng gọi vô nghĩa; thêm tầng khi nó đại diện một hành vi hoặc ranh giới hữu ích.

### Tại sao có Repository?

Repository gom cách truy cập dữ liệu phía sau interface. Spring Data cung cấp triển khai CRUD từ interface; tên method như `findByStatusAndCreatedAtAfter` có thể được phân tích để tạo truy vấn. Nhờ vậy service diễn đạt “cần sản phẩm nào” mà không phụ thuộc trực tiếp vào SQL/JPA chi tiết. Truy vấn phức tạp nên dùng `@Query`, Specification, Querydsl hoặc SQL phù hợp thay vì kéo dài tên method khó hiểu.

## 3. Một thiết kế API có chất lượng

```text
GET    /api/products?page=0&size=20&sort=name,asc
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
PATCH  /api/products/{id}
DELETE /api/products/{id}
```

- Đặt tên URL bằng danh từ/resource; dùng HTTP method để nói thao tác.
- Dùng path cho định danh resource, query string cho filter, sort, pagination.
- `GET` đọc; `POST` thường tạo; `PUT` thay toàn bộ biểu diễn; `PATCH` cập nhật một phần; `DELETE` xóa.
- Chỉ chọn `201 Created` khi tạo thành công; đặt `Location` nếu client cần địa chỉ resource mới. `204 No Content` phù hợp khi xóa thành công và không có response body.
- Validate cấu trúc/format của request ở DTO bằng Bean Validation. Bảo vệ quy tắc nghiệp vụ trong use case/domain, vì dữ liệu có thể đến từ nhiều entry point.
- Trả lỗi có cấu trúc và ổn định (`code`, `message`, field errors nếu phù hợp); không gửi stack trace hay thông tin nội bộ cho client.
- Dùng DTO riêng cho từng use case khi quyền cập nhật khác nhau; không bind request thẳng vào entity để tránh mass assignment.
- Với collection lớn, đặt giới hạn page size và hỗ trợ filter/sort có chủ đích.
- Bổ sung OpenAPI, authz, logging/correlation ID, metric, timeout và rate limit tùy yêu cầu hệ thống.

### Status thường gặp

| Status | Dùng khi |
|---|---|
| `200 OK` | Đọc hoặc cập nhật thành công, có response body |
| `201 Created` | Tạo resource thành công |
| `204 No Content` | Thành công, không trả body |
| `400 Bad Request` | Request sai format hoặc validation không đạt |
| `401 Unauthorized` | Thiếu/sai thông tin xác thực |
| `403 Forbidden` | Đã xác thực nhưng không có quyền |
| `404 Not Found` | Không tìm thấy resource |
| `409 Conflict` | Xung đột trạng thái hoặc dữ liệu |
| `500 Internal Server Error` | Lỗi không dự kiến phía server |

## 4. Các kiểu tổ chức API/backend

### Layered architecture

`Controller → Service → Repository → Database`. Dễ học, dễ điều hướng, hợp nhiều ứng dụng CRUD. Giữ phụ thuộc đi theo một chiều và mỗi tầng chỉ làm đúng việc của mình.

### Controller gọi Repository trực tiếp

Có thể chấp nhận với endpoint đọc rất đơn giản hoặc prototype. Khi xuất hiện nghiệp vụ, nhiều bước, transaction, phân quyền theo đối tượng hoặc nhiều adapter thì chuyển hành vi vào service/use case để kiểm thử và tái sử dụng tốt hơn.

### Feature-first / vertical slice

Tổ chức theo tính năng (`products`, `orders`) và để các phần liên quan gần nhau thay vì chia toàn dự án thành các thư mục controller/service/repository khổng lồ. Hợp codebase lớn hoặc team làm theo feature. Có thể kết hợp với layered architecture bên trong từng feature.

### Hexagonal / ports and adapters

Use case/domain phụ thuộc vào interface (port); database, HTTP client, queue là adapter ở ngoài. Giúp test nghiệp vụ và thay adapter dễ hơn. Đổi lại có thêm interface và cấu trúc; dùng khi boundary/độ phức tạp thực sự cần.

### CQRS

Tách mô hình ghi và đọc khi hai nhu cầu khác nhau đáng kể về hiệu năng, dữ liệu hoặc scale. Không phải lựa chọn mặc định cho CRUD vì tăng đồng bộ dữ liệu và độ phức tạp vận hành.

### Các kiểu giao tiếp

- **REST:** tài nguyên qua HTTP, phổ biến cho web/mobile.
- **GraphQL:** client chọn trường dữ liệu cần lấy, hữu ích khi nhiều client cần hình dạng dữ liệu khác nhau.
- **gRPC:** RPC có schema/contract rõ, phù hợp giao tiếp typed giữa các service.
- **Messaging/event:** gửi thông điệp xử lý bất đồng bộ, phù hợp tác vụ dài hoặc cần giảm phụ thuộc thời gian thực.

Kiểu giao tiếp và kiến trúc bên trong là hai quyết định riêng: một service dùng REST bên ngoài vẫn có thể tổ chức theo layered hoặc hexagonal.

## 5. Câu hỏi phỏng vấn — trả lời có lý do

### “REST API là gì? MVC liên quan ra sao?”

> “REST là cách tổ chức hợp đồng HTTP quanh resource và biểu diễn kết quả bằng status, header, body. MVC là cách chia trách nhiệm khi xử lý request. Spring MVC cung cấp cơ chế điều phối request; tôi có thể dùng nó để xây REST API trả JSON. Vì vậy REST nói về cách client giao tiếp, còn MVC nói về cách ứng dụng xử lý request.”

### “Tại sao không viết hết trong Controller?”

> “Controller là biên HTTP nên tôi giữ nó tập trung vào nhận request, gọi use case và tạo response. Nghiệp vụ đặt ở service để có thể phối hợp nhiều bước, quản lý transaction và test độc lập với HTTP. Nếu endpoint chỉ đọc đơn giản thì gọi repository trực tiếp có thể chấp nhận, nhưng tôi tránh để logic nghiệp vụ tích tụ trong controller.”

### “Tại sao không trả JPA Entity trực tiếp?”

> “Entity phản ánh persistence, còn API là hợp đồng với client. Tôi dùng DTO để kiểm soát field được expose, validate request và để thay đổi database không vô tình phá API. Điều này cũng giúp tránh lộ dữ liệu nhạy cảm hoặc cho client ghi những field họ không được phép sửa.”

### “Tạo mới thành công nên trả gì?”

> “Tôi thường trả 201 Created. Nếu resource có URL riêng, tôi đặt URL đó trong Location header. Tôi có thể trả response DTO trong body nếu client cần ID hoặc dữ liệu chuẩn hóa ngay sau khi tạo.”

### “Khi nào chọn hexagonal thay cho layered?”

> “Layered phù hợp khi luồng CRUD và boundary đơn giản. Tôi cân nhắc ports and adapters nếu logic nghiệp vụ cần độc lập với framework hoặc có nhiều adapter cần thay thế, ví dụ database, queue và external API. Tôi sẽ không thêm abstraction nếu nó chưa giải quyết một khó khăn thực tế.”

## 6. Bài tập thực hành

Thiết kế `POST /api/orders` để tạo đơn hàng:

1. Viết JSON request và DTO có validation.
2. Chọn status code và response body; nêu khi nào dùng `Location`.
3. Liệt kê trách nhiệm của controller, service và repository.
4. Xử lý trường hợp sản phẩm không tồn tại, số lượng không hợp lệ và tồn kho không đủ.
5. Nói rõ quy tắc nào là input validation, quy tắc nào là nghiệp vụ.
6. Thử bỏ Service: điều gì trở nên khó khi tạo đơn hàng cần kiểm tra kho, tính giá và lưu nhiều dòng?

## CHECKLIST

- [ ] Giải thích được REST khác MVC thế nào.
- [ ] Kể được vòng đời request trong Spring MVC.
- [ ] Nêu rõ vì sao có Controller, Service, Repository và DTO.
- [ ] Chọn status/header phù hợp cho tạo, đọc, validation, không tìm thấy.
- [ ] Giải thích PUT và PATCH bằng ví dụ.
- [ ] So sánh layered, feature-first, hexagonal và CQRS theo trade-off.
- [ ] Có thể trình bày bài toán API bằng ví dụ thực chiến, không chỉ định nghĩa.
