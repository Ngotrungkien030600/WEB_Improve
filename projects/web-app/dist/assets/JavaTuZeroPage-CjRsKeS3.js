import{E as e,F as t,H as n,J as r,L as i,M as a,P as o,Q as s,V as c,X as l,Y as u,Z as d,et as f,j as ee,k as p,y as te}from"./index-BGra_31G.js";import{n as ne}from"./navigate-Bl7ZK-rn.js";var m={chapters:[{id:`ch1`,emoji:`🧱`,title:`Biến, kiểu dữ liệu & toán tử`,time:`45 phút`,intro:`Mục tiêu: hiểu biến là gì, 5 kiểu dữ liệu hay gặp nhất, và tính toán số học đúng như Java tính.`,lessons:[{title:`1.1. Biến là "ngăn tủ" chứa dữ liệu`,paragraphs:[`Khi viết chương trình, bạn cần chỗ để NHỚ dữ liệu: tuổi người dùng, giá tiền, đúng/sai... Java gọi chỗ nhớ đó là biến (variable).`,`Muốn dùng biến phải KHAI BÁO trước: ghi kiểu dữ liệu rồi tên biến. Quy tắc đặt tên: camelCase, bắt đầu bằng chữ cái, không có dấu cách (vd: userAge, totalPrice).`,`5 kiểu hay gặp nhất: int (số nguyên), double (số thập phân), boolean (đúng/sai), char (1 ký tự), String (chuỗi chữ — viết hoa S vì là kiểu đặc biệt).`],codes:[{title:`Khai báo và in biến`,code:`public class Main {
    public static void main(String[] args) {
        int age = 20;          // khai báo + gán giá trị
        double price = 25.5;
        boolean isPassed = true;
        char grade = 'A';
        String name = "An";

        System.out.println(name + " - " + age + " tuổi");
    }
}`}]},{title:`1.2. Toán tử số học — chú ý phép chia số nguyên`,paragraphs:[`Các phép tính: + - * / % (% là phép chia lấy DƯ). Java tính theo đúng thứ tự: nhân chia trước, cộng trừ sau; ngoặc tròn tính trước.`,`Bẫy số 1 của người mới: 7 / 2 KHÔNG bằng 3.5. Hai số đều là int nên Java trả về int → 3 (phần dư bị bỏ). Muốn ra số thập phân phải có ít nhất một số double: 7.0 / 2 = 3.5.`,`Bẫy số 2: 10 + 2 * 3 = 16 (nhân trước), muốn 36 thì viết (10 + 2) * 3.`],codes:[{title:`Ví dụ đúng — sai lầm thường gặp`,code:`int a = 10 + 2 * 3;   // 16
int b = (10 + 2) * 3; // 36
int c = 7 / 2;        // 3 (chia 2 int)
double d = 7.0 / 2;   // 3.5
int e = 10 % 3;       // 1 (10 chia 3 dư 1)
int f = 17 % 5;       // 2`}]},{title:`1.3. Nối chuỗi với + và đọc từ bàn phím`,paragraphs:[`Dấu + khi gặp String sẽ NỐI chuỗi, không phải cộng số. Điều này gây bẫy: "Giá trị: " + 1 + 2 cho ra "Giá trị: 12". Vì Java gặp chuỗi trước nên mọi thứ sau đó đều thành chuỗi.`,`Muốn nhập liệu từ bàn phím dùng Scanner (phải import java.util.Scanner). Đây là câu hỏi "viết chương trình nhập..." hay gặp trong bài test. `],codes:[{title:`Nhập tên + tuổi rồi in lời chào`,code:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhập tên: ");
        String name = sc.nextLine();

        System.out.print("Nhập tuổi: ");
        int age = sc.nextInt();

        System.out.println("Chào " + name + ", bạn " + age + " tuổi!");
        sc.close();
    }
}`}]},{title:`1.4. Lỗi biên dịch hay gặp nhất`,paragraphs:[`Thiếu dấu ; cuối câu lệnh. Java hoa thường phân biệt: age và Age là hai biến khác nhau; tên lớp Main phải trùng tên file Main.java.`,`Biến chưa gán giá trị mà đã dùng → báo lỗi. Hãy đọc kỹ dòng lỗi đầu tiên: trình biên dịch chỉ đúng FILE và DÒNG gây lỗi.`,`Mẹo tư duy: khi code báo lỗi, đừng đoán — đọc dòng lỗi, đọc lại 3 dòng code quanh nó, rồi mới sửa.`]}],quiz:[{q:`int result = 7 / 2; — result bằng bao nhiêu?`,options:[`3.5`,`3`,`2.5`,`Lỗi biên dịch`],answer:1,why:`Cả 7 và 2 đều là int → Java chia số nguyên, bỏ phần dư → 3. Muốn 3.5 phải viết 7.0 / 2.`},{q:`System.out.println("Kết quả: " + 1 + 2); in ra gì?`,options:[`Kết quả: 3`,`Kết quả: 12`,`Lỗi biên dịch`,`Kết quả: 1 2`],answer:1,why:`Gặp chuỗi "Kết quả: " trước nên + sau đó đều là nối chuỗi → "Kết quả: 12".`},{q:`Khai báo nào ĐÚNG cú pháp?`,options:[`int 2so = 5;`,`double gia-tien = 3.5;`,`String userName = "An";`,`boolean = true;`],answer:2,why:`Tên biến không được bắt đầu bằng số, không chứa dấu gạch ngang, và phải có tên (không viết "boolean = true").`}]},{id:`ch2`,emoji:`🔀`,title:`Điều kiện & vòng lặp`,time:`60 phút`,intro:`Mục tiêu: cho máy biết "nếu... thì..." và bắt máy lặp công việc. Đây là nền của MỌI bài toán logic.`,lessons:[{title:`2.1. if / else if / else — ra quyết định`,paragraphs:[`if (điều kiện) { làm gì } else { làm gì khác }. Điều kiện luôn phải là boolean (đúng/sai).`,`Toán tử so sánh: == (bằng), != (khác), > < >= <=. Toán tử kết hợp: && (và), || (hoặc), ! (phủ định).`,`Bẫy kinh điển: so sánh String phải dùng .equals(...), KHÔNG dùng ==. Vì == so địa chỉ ô nhớ, .equals mới so nội dung.`,`Tư duy: khi gặp "nếu A và (B hoặc C)" hãy viết if (a && (b || c)) — ngoặc rất quan trọng.`],codes:[{title:`Xếp loại theo điểm`,code:`int score = 75;

if (score >= 90) {
    System.out.println("Xuất sắc");
} else if (score >= 70) {
    System.out.println("Khá");
} else if (score >= 50) {
    System.out.println("Trung bình");
} else {
    System.out.println("Yếu");
}`}]},{title:`2.2. Vòng lặp for — lặp ĐẾM được số lần`,paragraphs:[`for gồm 3 phần: (khởi tạo; điều kiện tiếp tục; bước nhảy). Chạy từng bước: khởi tạo 1 lần → kiểm tra điều kiện → làm thân → bước nhảy → kiểm tra lại...`,`i++ nghĩa là i = i + 1 (tăng 1). Vòng for (int i = 0; i < 5; i++) chạy đúng 5 lần với i = 0,1,2,3,4.`,`Khi lặp mảng/collection, dùng for-each: for (int value : numbers) — đọc là "với mỗi value trong numbers".`],codes:[{title:`In số 1..5 và tính tổng`,code:`int sum = 0;
for (int i = 1; i <= 5; i++) {
    System.out.println("i = " + i);
    sum = sum + i;   // sum += i viết gọn
}
System.out.println("Tổng = " + sum); // 15`}]},{title:`2.3. while và do-while`,paragraphs:[`while (điều kiện) { thân }: kiểm tra TRƯỚC, có thể chạy 0 lần nếu điều kiện sai ngay từ đầu.`,`do { thân } while (điều kiện);: chạy ít nhất 1 LẦN rồi mới kiểm tra. Dùng khi công việc phải làm 1 lần chắc chắn (vd: hỏi lại cho tới khi nhập đúng).`,`break: thoát ngay khỏi vòng lặp. continue: bỏ qua lượt hiện tại, sang lượt kế tiếp. Người mới hay lạm dụng — hãy ưu tiên viết điều kiện đúng thay vì dùng break.`],codes:[{title:`while — nhập cho tới khi đúng (kèm Scanner)`,code:`Scanner sc = new Scanner(System.in);
int pin = 0;
while (pin != 1234) {
    System.out.print("Nhập mã PIN: ");
    pin = sc.nextInt();
    if (pin != 1234) {
        System.out.println("Sai, thử lại!");
    }
}
System.out.println("Đúng rồi!");`}]},{title:`2.4. switch — nhiều nhánh cùng một biến`,paragraphs:[`Khi chỉ so sánh MỘT biến với nhiều giá trị cố định, switch gọn hơn if dài. Nhớ break ở cuối mỗi case (nếu không sẽ rơi tiếp xuống nhánh sau), và default cho trường hợp không khớp.`],codes:[{title:`switch với int`,code:`int day = 3;
switch (day) {
    case 2:
        System.out.println("Thứ Hai");
        break;
    case 3:
        System.out.println("Thứ Ba");
        break;
    default:
        System.out.println("Ngày khác");
}`}]}],quiz:[{q:`Vòng for (int i = 0; i < 3; i++) chạy bao nhiêu lần?`,options:[`2`,`3`,`4`,`Không chạy`],answer:1,why:`i = 0, 1, 2 — khi i = 3 thì điều kiện i < 3 sai nên dừng. Chạy đúng 3 lần.`},{q:`Đoạn sau in ra tổng bao nhiêu?
int sum = 0;
for (int i = 1; i <= 4; i++) { if (i == 3) continue; sum += i; }`,options:[`10`,`7`,`6`,`9`],answer:1,why:`continue bỏ qua i = 3. Cộng 1 + 2 + 4 = 7.`},{q:`Khác nhau giữa while và do-while?`,options:[`Không khác nhau`,`do-while luôn chạy ít nhất 1 lần`,`while chạy nhanh hơn`,`do-while không có điều kiện`],answer:1,why:`do-while kiểm tra điều kiện SAU khi chạy thân, nên thân luôn chạy ít nhất một lần.`}]},{id:`ch3`,emoji:`🗂️`,title:`Mảng & String`,time:`60 phút`,intro:`Mục tiêu: nhóm nhiều giá trị vào một biến (mảng) và thao tác chuỗi chữ — 2 thứ bạn sẽ gõ mỗi ngày.`,lessons:[{title:`3.1. Mảng — nhiều giá trị trong một biến`,paragraphs:[`Mảng là dãy các ô nhớ cùng kiểu, đánh số từ 0. int[] numbers = new int[3] tạo mảng 3 ô: numbers[0], numbers[1], numbers[2].`,`Độ dài mảng: numbers.length (lưu ý KHÔNG có ngoặc — length là thuộc tính, không phải hàm).`,`Lỗi kinh điển: truy cập numbers[3] khi mảng chỉ có 3 phần tử (chỉ số 0..2) → ArrayIndexOutOfBoundsException. Luôn nhớ: chỉ số chạy 0 → length - 1.`],codes:[{title:`Mảng có sẵn giá trị + tính tổng`,code:`int[] scores = { 7, 9, 5, 10, 6 };
int total = 0;
for (int i = 0; i < scores.length; i++) {
    total += scores[i];
}
double avg = (double) total / scores.length;
System.out.println("Trung bình: " + avg); // 7.4`}]},{title:`3.2. String — chuỗi chữ và các hàm hay dùng`,paragraphs:[`String là chuỗi các ký tự. Đặc biệt: KHÔNG ĐỔI ĐƯỢC (immutable) — mỗi thao tác "sửa" thực ra tạo chuỗi mới.`,`Các hàm phải nhớ: length() (độ dài), charAt(i) (ký tự tại vị trí i), toUpperCase()/toLowerCase(), trim() (bỏ khoảng trắng 2 đầu), substring(start, end), indexOf(chuỗi) (vị trí đầu tiên, -1 nếu không có), contains(chuỗi).`,`So sánh nội dung chuỗi: phải dùng .equals(), tuyệt đối không dùng ==. Đây là câu hỏi "tủ" trong phỏng vấn.`],codes:[{title:`Thao tác chuỗi cơ bản`,code:`String name = "  hello world  ";
String trimmed = name.trim();        // "hello world"
String upper = trimmed.toUpperCase(); // "HELLO WORLD"
char first = upper.charAt(0);         // 'H'
int index = trimmed.indexOf("world"); // 6
boolean has = trimmed.contains("lo"); // true
System.out.println(has);`}]},{title:`3.3. Vòng lặp for-each và StringBuilder`,paragraphs:[`for (int value : scores) đọc mọi phần tử mà không cần biết chỉ số — gọn và ít lỗi. Dùng khi KHÔNG cần vị trí i.`,`Nối chuỗi trong vòng lặp bằng + rất chậm (tạo nhiều chuỗi rác). Nối nhiều lần nên dùng StringBuilder: sb.append(...) rồi sb.toString().`,`Ví dụ đảo chuỗi là bài phỏng vấn kinh điển — tự viết bằng vòng lặp từ cuối về đầu trước khi dùng StringBuilder.reverse().`],codes:[{title:`for-each đếm số chẵn`,code:`int[] numbers = { 1, 4, 7, 8, 10 };
int evenCount = 0;
for (int n : numbers) {
    if (n % 2 == 0) {
        evenCount++;
    }
}
System.out.println("Số chẵn: " + evenCount); // 3`}]}],quiz:[{q:`int[] a = { 3, 8, 1 }; — a.length bằng bao nhiêu?`,options:[`2`,`3`,`4`,`Báo lỗi`],answer:1,why:`Mảng có 3 phần tử. Chỉ số hợp lệ là 0, 1, 2 — truy cập a[3] mới là lỗi.`},{q:`"HELLO".charAt(1) trả về gì?`,options:[`H`,`E`,`L`,`Lỗi`],answer:1,why:`charAt(0) = H, charAt(1) = E. Chỉ số bắt đầu từ 0.`},{q:`String a = "Java"; String b = "Java"; — a == b cho kết quả gì (không đảm bảo)?`,options:[`Luôn true`,`Luôn false`,`Không nên dùng == để so chuỗi`,`Lỗi biên dịch`],answer:2,why:`== so ô nhớ nên kết quả không đáng tin với chuỗi. So NỘI DUNG phải dùng a.equals(b).`}]},{id:`ch4`,emoji:`📦`,title:`OOP — Lập trình hướng đối tượng`,time:`90 phút`,intro:`Mục tiêu: hiểu class/object và 4 tính chất OOP. Đây là "điểm" lớn nhất trong phỏng vấn Java fresher — học kỹ bài này.`,lessons:[{title:`4.1. Class là bản vẽ, Object là sản phẩm`,paragraphs:[`Class = khuôn/bản vẽ mô tả thuộc tính (biến) và hành vi (phương thức). Object = một sản phẩm cụ thể tạo từ bản vẽ bằng từ khóa new.`,`Ví dụ: class Student có thuộc tính name, age. new Student() tạo ra một sinh viên cụ thể. Mỗi object có bản sao dữ liệu riêng.`,`Quy ước: tên class viết PascalCase (Student), tên biến/phương thức camelCase (getName).`],codes:[{title:`Tạo class Student và dùng nó`,code:`public class Student {
    String name;
    int age;

    void introduce() {
        System.out.println("Tôi là " + name + ", " + age + " tuổi");
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.name = "An";
        s.age = 20;
        s.introduce();
    }
}`}]},{title:`4.2. Constructor — hàm tạo và this`,paragraphs:[`Constructor là phương thức đặc biệt: trùng tên class, không có kiểu trả về, tự chạy khi new — dùng để GÁN GIÁ TRỊ BAN ĐẦU cho object.`,`this.name = name nghĩa là "name của object này" = "name tham số truyền vào". this phân biệt biến cùng tên.`,`Có thể có NHIỀU constructor khác tham số (overload) — vd: Student() và Student(String name, int age).`],codes:[{title:`Constructor gán giá trị ngay khi tạo`,code:`public class Student {
    String name;
    int age;

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void introduce() {
        System.out.println("Tôi là " + name);
    }
}

// Trong main:
Student s = new Student("An", 20);
s.introduce();`}]},{title:`4.3. static và final`,paragraphs:[`static: thuộc về CLASS, dùng chung cho mọi object, gọi qua tên class (Student.schoolName). Không cần new vẫn gọi được. static main chính là lý do chương trình chạy được.`,`final: giá trị không đổi sau khi gán (hằng số). final double PI = 3.14; final với class/method còn nghĩa khác (không kế thừa/không ghi đè) — đọc sau.`,`Bẫy: phương thức static KHÔNG gọi được biến instance trực tiếp vì chưa có object nào.`],codes:[{title:`static đếm số object đã tạo`,code:`public class Student {
    static int total = 0;
    String name;

    Student(String name) {
        this.name = name;
        total++; // mỗi lần new thì tăng 1
    }
}

// Trong main:
new Student("An");
new Student("Binh");
System.out.println(Student.total); // 2`}]},{title:`4.4. Bốn tính chất OOP — phần trọng tâm`,paragraphs:[`1. ĐÓNG GÓI (Encapsulation): thuộc tính để private, bên ngoài truy cập qua getter/setter. Bảo vệ dữ liệu, kiểm tra được giá trị.`,`2. KẾ THỪA (Inheritance): class con extends class cha, dùng lại + mở rộng. super() gọi constructor cha, super.method() gọi phương thức cha.`,`3. ĐA HÌNH (Polymorphism): cùng tên phương thức nhưng hành vi khác nhau — overload (cùng class, khác tham số) và override (@Override, class con viết lại method cha).`,`4. TRỪU TƯỢNG (Abstraction): abstract class (có thể có code sẵn + method trừu tượng) và interface (chỉ khai báo "làm được gì", class implements phải hiện thực). Vd: interface Flyable có fly(), class Bird implements Flyable phải viết fly().`,`Cách nhớ cho phỏng vấn: đóng gói giấu chi tiết · kế thừa dùng lại · đa hình 1 tên nhiều hành vi · trừu tượng chỉ ra "cái gì" không cần biết "làm sao".`],codes:[{title:`Getter/Setter + kế thừa`,code:`public class Animal {
    private String name; // đóng gói

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public void speak() { System.out.println("..."); }
}

public class Dog extends Animal {
    @Override
    public void speak() { System.out.println("Gâu gâu"); }
}

// Trong main:
Dog d = new Dog();
d.setName("Mực");
d.speak(); // Gâu gâu`}]}],quiz:[{q:`Vai trò của constructor?`,options:[`In ra màn hình`,`Gán giá trị ban đầu khi tạo object`,`Xóa object`,`Bắt buộc phải gọi bằng tay`],answer:1,why:`Constructor tự chạy khi new, dùng để khởi tạo trạng thái ban đầu của object.`},{q:`Từ khóa nào để class con "kế thừa" class cha?`,options:[`implements`,`extends`,`inherits`,`super`],answer:1,why:`extends dùng cho class kế thừa class/abstract class; implements dùng cho interface.`},{q:`Tại sao thuộc tính nên để private và truy cập qua getter/setter?`,options:[`Để code ngắn hơn`,`Để bảo vệ dữ liệu và kiểm soát giá trị gán vào`,`Vì Java bắt buộc`,`Để chương trình chạy nhanh hơn`],answer:1,why:`Đó là tính ĐÓNG GÓI: bên ngoài không sửa thẳng được dữ liệu, setter có thể kiểm tra (vd: tuổi không âm).`}]},{id:`ch5`,emoji:`🛡️`,title:`Exception — xử lý lỗi`,time:`45 phút`,intro:`Mục tiêu: chương trình sập là chuyện bình thường — người lập trình giỏi là người đoán được lỗi và xử lý chúng.`,lessons:[{title:`5.1. Các lỗi runtime phổ biến (phải thuộc)`,paragraphs:[`NullPointerException: gọi phương thức trên biến null (chưa có object). Lỗi gặp NHIỀU NHẤT khi đi làm.`,`ArrayIndexOutOfBoundsException: truy cập ngoài chỉ số mảng.`,`ArithmeticException: chia cho 0 (int). NumberFormatException: đổi chuỗi "abc" thành số.`,`Khi đọc stack trace: dòng "at ...(TênFile.java:dòng)" đầu tiên cho biết chính xác chỗ gây lỗi — đọc nó trước, không đoán mò.`],codes:[{title:`Lỗi NullPointerException điển hình`,code:`String text = null;
System.out.println(text.length()); 
// Lỗi: NullPointerException tại dòng này (text chưa trỏ tới object nào)

// Sửa: kiểm tra trước khi dùng
if (text != null) {
    System.out.println(text.length());
} else {
    System.out.println("text đang rỗng (null)");
}`}]},{title:`5.2. try / catch / finally`,paragraphs:[`try { } chứa code có thể lỗi. catch (Exception e) { } bắt lỗi và xử lý để chương trình KHÔNG sập. finally { } chạy LUÔN LUÔN (có lỗi hay không) — thường để đóng tài nguyên.`,`Có thể nhiều catch liên tiếp, bắt từ lỗi cụ thể đến lỗi tổng (Exception). e.printStackTrace() in toàn bộ vết lỗi để gỡ.`,`Đừng catch rồi "nuốt" lỗi (catch rỗng) — đó là thói quen xấu bị chê khi review code.`],codes:[{title:`Bắt lỗi chia 0`,code:`int a = 10;
int b = 0;

try {
    int result = a / b; // sẽ ném ArithmeticException
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Không thể chia cho 0!");
} finally {
    System.out.println("Luôn chạy tới đây");
}

System.out.println("Chương trình vẫn sống");`}]},{title:`5.3. Cách phòng lỗi — tư duy phòng thủ`,paragraphs:[`Thay vì đợi lỗi rồi catch, hãy KIỂM TRA TRƯỚC: nếu mảng/index/null có thể sai thì chặn ngay từ đầu bằng if.`,`Khi nhận dữ liệu từ bên ngoài (người dùng, API, file), luôn giả định nó SAI: null, rỗng, sai định dạng. Viết code theo kiểu "phòng thủ" là dấu hiệu của người đi làm được.`,`Thói quen tốt: tách phần "đọc số từ chuỗi" ra chỗ dễ catch — nhập sai cho nhập lại thay vì sập cả chương trình.`],codes:[{title:`Phòng thủ khi đổi chuỗi ra số`,code:`Scanner sc = new Scanner(System.in);
int n = 0;
boolean ok = false;

while (!ok) {
    System.out.print("Nhập số nguyên: ");
    String input = sc.nextLine();
    try {
        n = Integer.parseInt(input); // có thể ném NumberFormatException
        ok = true;
    } catch (NumberFormatException e) {
        System.out.println("Không phải số, nhập lại!");
    }
}
System.out.println("Bạn đã nhập: " + n);`}]}],quiz:[{q:`Lỗi nào xảy ra khi gọi method trên biến null?`,options:[`ArrayIndexOutOfBoundsException`,`NullPointerException`,`NumberFormatException`,`ArithmeticException`],answer:1,why:`Biến null không trỏ tới object nào nên không thể gọi method — Java ném NullPointerException.`},{q:`Trong try/catch/finally, khối finally:`,options:[`Chỉ chạy khi có lỗi`,`Chỉ chạy khi không lỗi`,`Luôn chạy (trừ khi JVM thoát hẳn)`,`Chạy trước try`],answer:2,why:`finally được thiết kế để chạy trong cả hai trường hợp — thường dùng để đóng file/kết nối.`}]},{id:`ch6`,emoji:`📚`,title:`Collection cơ bản: List, Set, Map`,time:`75 phút`,intro:`Mục tiêu: thoát khỏi mảng "cứng" — dùng List/Set/Map để lưu dữ liệu linh hoạt. Phỏng vấn fresher rất hay hỏi "chọn gì khi nào".`,lessons:[{title:`6.1. List / ArrayList — danh sách có thứ tự`,paragraphs:[`ArrayList là mảng "động": thêm bớt thoải mái, giữ thứ tự, cho phép trùng. Khai báo: List<String> names = new ArrayList<>();`,`Các hàm: add(x), get(i), remove(x), size(), contains(x), clear(). Duyệt bằng for-each hoặc for có chỉ số.`,`List<String> (kiểu interface) + new ArrayList<>() (kiểu hiện thực) là cách viết chuẩn — gán interface, đổi hiện thực sau này không vỡ code.`],codes:[{title:`Thêm, đọc, duyệt List`,code:`import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("An");
names.add("Binh");
names.add("An");   // List cho phép trùng

System.out.println(names.size()); // 3
for (String n : names) {
    System.out.println(n);
}`}]},{title:`6.2. Set / HashSet — KHÔNG trùng`,paragraphs:[`Set giống túi đồ không cho 2 thứ giống nhau: tự loại bỏ phần tử trùng, KHÔNG đảm bảo thứ tự.`,`HashSet dùng hashCode/equals để kiểm tra trùng — khi để object tự đặt vào Set, phải override equals + hashCode cho đúng.`,`Ví dụ thực tế: lọc danh sách mã trùng chỉ giữ lại một lần.`],codes:[{title:`Lọc phần tử trùng bằng HashSet`,code:`import java.util.HashSet;
import java.util.Set;

String[] words = { "java", "oop", "java", "list" };

Set<String> unique = new HashSet<>();
for (String w : words) {
    unique.add(w);
}
System.out.println(unique.size()); // 3: java, oop, list`}]},{title:`6.3. Map / HashMap — tra cứu theo khóa`,paragraphs:[`Map lưu cặp (khóa → giá trị) như từ điển: tra từ ra nghĩa. HashMap không giữ thứ tự, khóa KHÔNG trùng (trùng sẽ ghi đè).`,`Các hàm: put(k, v), get(k) (null nếu không có), containsKey(k), keySet() (tập khóa), entrySet() (tập cặp).`,`Bài phỏng vấn kinh điển "đếm số lần xuất hiện của mỗi từ" chính là dùng HashMap.`],codes:[{title:`Đếm tần suất từ bằng HashMap`,code:`import java.util.HashMap;
import java.util.Map;

String text = "java oop java list oop java";
Map<String, Integer> count = new HashMap<>();

for (String w : text.split(" ")) {
    // count.getOrDefault(w, 0): lấy giá trị cũ, chưa có thì 0
    count.put(w, count.getOrDefault(w, 0) + 1);
}

System.out.println(count); // {java=3, oop=2, list=1}`}]},{title:`6.4. Chọn cấu trúc nào khi nào`,paragraphs:[`Cần danh sách giữ THỨ TỰ, có thể trùng, truy cập theo vị trí → List (ArrayList).`,`Cần KHÔNG TRÙNG (tập hợp, lọc trùng) → Set (HashSet).`,`Cần TRA CỨU theo một khóa riêng (id → thông tin) → Map (HashMap).`,`Nói được câu này trôi chảy trong phỏng vấn là bạn đã "ăn điểm" phần Collection.`]}],quiz:[{q:`Cấu trúc nào KHÔNG cho phép phần tử trùng?`,options:[`ArrayList`,`HashSet`,`LinkedList`,`Mảng thường`],answer:1,why:`Set đảm bảo tính duy nhất của phần tử; List và mảng cho phép trùng.`},{q:`Map<String, Integer> m = ...; m.put("a", 1); m.put("a", 2); — m.get("a") trả về?`,options:[`1`,`2`,`Lỗi`,`null`],answer:1,why:`Khóa "a" đã tồn tại nên put thứ hai GHI ĐÈ — Map không lưu hai giá trị cho cùng khóa.`},{q:`Cần lưu danh sách học viên theo đúng thứ tự đăng ký → chọn gì?`,options:[`HashSet`,`HashMap`,`ArrayList`,`Set`],answer:2,why:`List giữ thứ tự thêm vào và cho truy cập theo vị trí — phù hợp danh sách có thứ tự.`}]}],exercises:[{id:`ex1`,level:`easy`,title:`Chào hỏi + phép cộng`,task:`Nhập tên và 2 số nguyên từ bàn phím. In ra "Xin chào <tên>!" và tổng 2 số.`,hint:`Dùng Scanner: sc.nextLine() cho tên, sc.nextInt() cho số. Nhớ import java.util.Scanner.`,explain:`nextLine đọc cả dòng chữ; nextInt đọc số. Sau khi nextInt, nếu đọc tiếp nextLine hãy gọi thêm sc.nextLine() rỗng để "nuốt" ký tự xuống dòng còn sót.`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhập tên: ");
        String name = sc.nextLine();

        System.out.print("Nhập số thứ nhất: ");
        int a = sc.nextInt();

        System.out.print("Nhập số thứ hai: ");
        int b = sc.nextInt();

        System.out.println("Xin chào " + name + "!");
        System.out.println("Tổng = " + (a + b));
        sc.close();
    }
}`},{id:`ex2`,level:`easy`,title:`Chẵn hay lẻ`,task:`Nhập một số nguyên, in "Chẵn" nếu chia hết cho 2, ngược lại in "Lẻ".`,hint:`Số chẵn khi n % 2 == 0. Dùng if/else.`,explain:`Toán tử % trả phần dư. n % 2 == 0 → chia hết cho 2 → chẵn. Chú ý số âm vẫn đúng vì -4 % 2 = 0.`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nhập số: ");
        int n = sc.nextInt();

        if (n % 2 == 0) {
            System.out.println("Chẵn");
        } else {
            System.out.println("Lẻ");
        }
        sc.close();
    }
}`},{id:`ex3`,level:`easy`,title:`Tổng từ 1 đến n`,task:`Nhập n, in tổng 1 + 2 + ... + n.`,hint:`Vòng for chạy i từ 1 đến n, cộng dồn vào biến sum khởi tạo = 0.`,explain:`Khuôn mẫu "cộng dồn" (accumulator): khởi tạo biến tổng bằng 0 TRƯỚC vòng lặp, trong vòng lặp sum += i. Công thức nhanh n*(n+1)/2 cũng đúng nhưng hãy tự luyện vòng lặp trước.`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nhập n: ");
        int n = sc.nextInt();

        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println("Tổng = " + sum);
        sc.close();
    }
}`},{id:`ex4`,level:`easy`,title:`Đếm ngược 10 → 1`,task:`In các số từ 10 xuống 1, mỗi số một dòng.`,hint:`Vòng for chạy NGƯỢC: for (int i = 10; i >= 1; i--).`,explain:`i-- giảm 1 mỗi vòng. Điều kiện i >= 1 giữ vòng chạy cho tới khi i = 1. Đây là bài "kiểm soát vòng lặp" đơn giản nhất.`,solution:`public class Main {
    public static void main(String[] args) {
        for (int i = 10; i >= 1; i--) {
            System.out.println(i);
        }
    }
}`},{id:`ex5`,level:`medium`,title:`Tìm số lớn nhất trong mảng`,task:`Cho mảng { 3, 9, 2, 11, 7 }. In ra số lớn nhất và vị trí của nó.`,hint:`Giả định phần tử đầu là max, duyệt so sánh từng phần tử còn lại. Nhớ lưu cả chỉ số khi tìm thấy max mới.`,explain:`Khuôn mẫu "tìm max": max = a[0]; for từ 1: nếu a[i] > max thì cập nhật max và ghi nhớ vị trí. Nếu chỉ hỏi giá trị, có thể bỏ biến vị trí.`,solution:`public class Main {
    public static void main(String[] args) {
        int[] a = { 3, 9, 2, 11, 7 };

        int max = a[0];
        int maxIndex = 0;
        for (int i = 1; i < a.length; i++) {
            if (a[i] > max) {
                max = a[i];
                maxIndex = i;
            }
        }
        System.out.println("Lớn nhất: " + max + " tại vị trí " + maxIndex);
    }
}`},{id:`ex6`,level:`medium`,title:`Đảo ngược chuỗi`,task:`Nhập một chuỗi, in chuỗi đảo ngược. Vd: "hello" → "olleh".`,hint:`Cách 1 (tự viết): vòng for chạy từ cuối về đầu, gom từng ký tự. Cách 2: new StringBuilder(s).reverse(). Làm cách 1 trước.`,explain:`Duyệt từ ký tự cuối (s.length() - 1) về 0, charAt(i) lấy từng ký tự rồi nối vào kết quả. Đây là bài kinh điển để kiểm tra khả năng vận dụng vòng lặp + String.`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nhập chuỗi: ");
        String s = sc.nextLine();

        String reversed = "";
        for (int i = s.length() - 1; i >= 0; i--) {
            reversed += s.charAt(i);
        }
        System.out.println("Đảo ngược: " + reversed);
        sc.close();
    }
}`},{id:`ex7`,level:`medium`,title:`Đếm ký tự trong chuỗi`,task:`Nhập chuỗi và 1 ký tự. Đếm xem ký tự đó xuất hiện bao nhiêu lần.`,hint:`Duyệt từng ký tự bằng charAt(i) và so sánh. Dùng biến đếm count tăng lên khi khớp.`,explain:`Khuôn mẫu "đếm": biến count = 0, tăng khi gặp điều kiện đúng. Chú ý char trong Java so bằng == (chỉ String mới cần equals).`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nhập chuỗi: ");
        String s = sc.nextLine();
        System.out.print("Nhập ký tự: ");
        char target = sc.nextLine().charAt(0);

        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == target) {
                count++;
            }
        }
        System.out.println("Số lần xuất hiện: " + count);
        sc.close();
    }
}`},{id:`ex8`,level:`medium`,title:`Kiểm tra số nguyên tố`,task:`Nhập n (n > 1). In "Nguyên tố" nếu n chỉ chia hết cho 1 và chính nó.`,hint:`Số nguyên tố khi KHÔNG có ước nào từ 2 đến n-1. Duyệt i từ 2; nếu n % i == 0 thì không phải. Tối ưu: chỉ cần chạy i*i <= n.`,explain:`Dùng biến cờ isPrime = true; nếu tìm thấy ước → gán false và break. Vòng chạy tới Math.sqrt(n) là đủ vì ước luôn đi cặp. Bài này xuất hiện rất nhiều trong test coding.`,solution:`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Nhập n: ");
        int n = sc.nextInt();

        boolean isPrime = n >= 2;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }

        System.out.println(isPrime ? "Nguyên tố" : "Không nguyên tố");
        sc.close();
    }
}`},{id:`ex9`,level:`medium`,title:`Bảng cửu chương`,task:`In bảng cửu chương của 5: 5 x 1 = 5 ... 5 x 10 = 50.`,hint:`Một vòng for i = 1..10, in "5 x " + i + " = " + (5 * i).`,explain:`Luyện cách in chuỗi có phép tính: nhớ bọc phép tính trong ngoặc (5 * i) để cộng số trước khi nối chuỗi.`,solution:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println("5 x " + i + " = " + (5 * i));
        }
    }
}`},{id:`ex10`,level:`medium`,title:`FizzBuzz — bài test "gà mờ"`,task:`In các số từ 1 đến 30. Số chia hết cho 3 → in "Fizz", chia hết cho 5 → in "Buzz", chia hết cho cả 3 và 5 → in "FizzBuzz", còn lại in số.`,hint:`KIỂM TRA CHIA HẾT CHO 15 (cả 3 và 5) TRƯỚC, rồi mới tới 3, rồi 5. Thứ tự if rất quan trọng — viết ngược là sai ngay.`,explain:`Nếu kiểm tra %3 trước, số 15 sẽ in "Fizz" và không bao giờ chạm nhánh FizzBuzz. Đây chính là bài phỏng vấn nổi tiếng nhất để loại ứng viên không biết lập trình cơ bản.`,solution:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 30; i++) {
            if (i % 15 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}`},{id:`ex11`,level:`medium`,title:`Class Student + sắp xếp đơn giản`,task:`Tạo class Student (name, score) có constructor và getter. Tạo 3 sinh viên trong main, in ra sinh viên có điểm cao nhất.`,hint:`Viết getter getScore(). Trong main: giữ biến best kiểu Student, so sánh từng cái qua getScore().`,explain:`Bài này luyện 3 kỹ năng cùng lúc: tạo class, dùng constructor, thao tác object trong mảng/biến. Kiểu "giữ object tốt nhất" rất hay gặp khi làm bài tập thực tế.`,solution:`public class Student {
    private String name;
    private int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("An", 8);
        Student s2 = new Student("Binh", 9);
        Student s3 = new Student("Chi", 7);

        Student best = s1;
        if (s2.getScore() > best.getScore()) best = s2;
        if (s3.getScore() > best.getScore()) best = s3;

        System.out.println("Cao nhất: " + best.getName());
    }
}`},{id:`ex12`,level:`hard`,title:`Đếm số lần xuất hiện của từng từ`,task:`Cho chuỗi "hoc java de di lam lam java". Đếm và in mỗi từ xuất hiện mấy lần (không phân biệt hoa thường).`,hint:`split(" ") tách từ. Dùng HashMap<String, Integer>; chuyển về thường bằng toLowerCase() trước khi đếm.`,explain:`Đây là bài "tủ" đánh giá việc biết chọn đúng cấu trúc dữ liệu: HashMap lý tưởng cho đếm tần suất. getOrDefault giúp code gọn: chưa có khóa thì lấy 0 rồi cộng 1.`,solution:`import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        String text = "hoc java de di lam lam java";

        Map<String, Integer> count = new HashMap<>();
        for (String w : text.toLowerCase().split(" ")) {
            count.put(w, count.getOrDefault(w, 0) + 1);
        }

        for (Map.Entry<String, Integer> e : count.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`}],readCode:[{code:`int x = 5;
int y = x++;
System.out.println(x + " " + y);`,question:`In ra gì?`,options:[`5 5`,`6 5`,`5 6`,`6 6`],answer:1,explain:`x++ (hậu tố): lấy giá trị cũ gán cho y trước rồi mới tăng x. Nên y = 5, x = 6.`},{code:`int a = 2 + 3 * 4;
int b = (2 + 3) * 4;
System.out.println(a + " " + b);`,question:`In ra gì?`,options:[`20 20`,`14 20`,`20 14`,`14 14`],answer:1,explain:`Nhân chia trước cộng trừ: a = 2 + 12 = 14. Ngoặc ép tính trước: b = 5 * 4 = 20.`},{code:`String s = "Java";
for (int i = 0; i < s.length(); i++) {
    System.out.print(s.charAt(i) + "-");
}`,question:`In ra gì?`,options:[`J-a-v-a-`,`J-a-v-a`,`Java`,`J- a- v- a-`],answer:0,explain:`Vòng lặp in từng ký tự kèm dấu "-" phía sau, kể cả ký tự cuối → "J-a-v-a-".`},{code:`int total = 0;
for (int i = 0; i < 5; i++) {
    if (i == 3) break;
    total += i;
}
System.out.println(total);`,question:`In ra gì?`,options:[`10`,`6`,`3`,`7`],answer:1,explain:`i = 0, 1, 2 được cộng (0+1+2=6). Khi i = 3 gặp break → thoát ngay, không cộng 3 và 4.`},{code:`int n = 0;
do {
    n++;
} while (n < 0);
System.out.println(n);`,question:`In ra gì?`,options:[`0`,`1`,`Không in (lặp vô hạn)`,`Báo lỗi`],answer:1,explain:`do-while chạy thân TRƯỚC khi kiểm tra: n = 1 rồi mới thấy n < 0 sai → dừng. Thân luôn chạy ít nhất 1 lần.`},{code:`int[] nums = { 10, 20, 30 };
change(nums);
System.out.println(nums[0]);

static void change(int[] arr) {
    arr[0] = 99;
}`,question:`In ra gì?`,options:[`10`,`99`,`Lỗi biên dịch`,`Không xác định`],answer:1,explain:`Mảng truyền vào phương thức là THAM CHIẾU tới cùng vùng nhớ → sửa arr[0] bên trong là sửa luôn nums[0]. (Biến kiểu int thì ngược lại — truyền bản sao.)`},{code:`String a = "hello";
String b = a;
b = b.toUpperCase();
System.out.println(a);`,question:`In ra gì?`,options:[`HELLO`,`hello`,`helloHELLO`,`Báo lỗi`],answer:1,explain:`String bất biến: toUpperCase() tạo chuỗi MỚI gán cho b, còn a vẫn trỏ tới "hello" cũ → in "hello".`},{code:`int count = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) count++;
}
System.out.println(count);`,question:`In ra gì?`,options:[`4`,`5`,`6`,`10`],answer:1,explain:`Đếm số chẵn từ 1..10: 2, 4, 6, 8, 10 → 5 số.`},{code:`String s = null;
if (s != null && s.length() > 3) {
    System.out.println("dài");
} else {
    System.out.println("ngắn hoặc null");
}`,question:`Chương trình in ra gì?`,options:[`dài`,`ngắn hoặc null`,`NullPointerException`,`Lỗi biên dịch`],answer:1,explain:`&& dừng sớm (short-circuit): vế đầu s != null là false nên KHÔNG chạy s.length() → không lỗi, vào else.`},{code:`int a = 10;
int b = 3;
System.out.println(a / b);
System.out.println(a % b);`,question:`In ra 2 dòng gì?`,options:[`3 và 1`,`3.33 và 1`,`3 và 0`,`3.33 và 0.33`],answer:0,explain:`Chia 2 int bỏ phần dư: 10/3 = 3. % lấy phần dư: 10%3 = 1.`}]},re={class:`tu-zero-page`},ie={class:`tz-header`},h={class:`tz-heading`},g={class:`tz-tabs`},_=[`onClick`],v={class:`tz-chapter-head`},y={class:`tz-time`},b={class:`tz-intro`},x={class:`code-title`},S={key:0,class:`tz-quiz`},C={class:`quiz-q`},w={class:`quiz-options`},T=[`disabled`,`onClick`],E={key:0,class:`quiz-why`},D={key:1,class:`tz-section`},O={class:`tz-chapter-head`},k={class:`tz-time`},A={class:`ex-head`},j={class:`ex-task`},M={class:`ex-buttons`},N=[`onClick`],P=[`onClick`],F={key:0,class:`ex-hint`},I={key:1,class:`ex-answer`},ae={class:`code-card`},L={class:`ex-explain`},R={key:2,class:`tz-section`},z={class:`tz-chapter-head`},B={class:`tz-time`},V={class:`rc-index`},H={class:`code-card`},U={class:`quiz-q`},W={class:`quiz-options`},G=[`disabled`,`onClick`],K={key:0,class:`quiz-why`},q=te({__name:`JavaTuZeroPage`,setup(te){let q=ee(()=>m.chapters),J=l(`ch1`),Y=u({}),X=u({}),Z=u({});function Q(e,t){return e+`-`+t}function oe(e){return e.startsWith(`rc-`)?X:Y}function $(e,t,n,r){let i=e===`rc`?`rc-`+t:Q(e,t),a=oe(i)[i];return a===void 0?{}:n===r?{correct:!0}:n===a?{wrong:!0}:{}}function se(e,t,n){let r=Q(e,t);Y[r]===void 0&&(Y[r]=n)}function ce(e,t){let n=`rc-`+e;X[n]===void 0&&(X[n]=t)}function le(e){Z[e]||(Z[e]={hint:!1,answer:!1}),Z[e].hint=!Z[e].hint}function ue(e){Z[e]||(Z[e]={hint:!1,answer:!1}),Z[e].answer=!Z[e].answer}function de(e){return e===`easy`?`Dễ`:e===`medium`?`Trung bình`:`Khó`}function fe(){ne(`/java/hub`)}return(l,u)=>(c(),t(`div`,re,[a(`header`,ie,[a(`button`,{class:`tz-back`,onClick:fe},`← Java`),a(`div`,h,[u[2]||=a(`h1`,null,`🌱 Java Từ 0 — mất gốc → đi làm`,-1),a(`p`,null,` Dành cho người yếu Java và tư duy lập trình: 6 chương nền tảng + quiz, `+f(d(m).exercises.length)+` bài tập có lời giải từng bước, `+f(d(m).readCode.length)+` bài đọc-code đoán kết quả. `,1)])]),a(`nav`,g,[(c(!0),t(p,null,n(d(m).chapters,e=>(c(),t(`button`,{key:e.id,class:s([`tz-tab`,{active:J.value===e.id}]),onClick:t=>J.value=e.id},f(e.emoji)+` `+f(e.title),11,_))),128)),a(`button`,{class:s([`tz-tab`,{active:J.value===`exercises`}]),onClick:u[0]||=e=>J.value=`exercises`},` 💪 Bài tập `,2),a(`button`,{class:s([`tz-tab`,{active:J.value===`readcode`}]),onClick:u[1]||=e=>J.value=`readcode`},` 🔍 Đọc code `,2)]),J.value.startsWith(`ch`)?(c(!0),t(p,{key:0},n(q.value,i=>r((c(),t(`section`,{key:i.id,class:`tz-section`},[a(`div`,v,[a(`h2`,null,f(i.emoji)+` `+f(i.title),1),a(`span`,y,`⏱️ `+f(i.time),1)]),a(`p`,b,f(i.intro),1),(c(!0),t(p,null,n(i.lessons,e=>(c(),t(`div`,{key:e.title,class:`tz-lesson`},[a(`h3`,null,f(e.title),1),(c(!0),t(p,null,n(e.paragraphs,(e,n)=>(c(),t(`p`,{key:n,class:`tz-para`},f(e),1))),128)),(c(!0),t(p,null,n(e.codes,e=>(c(),t(`div`,{key:e.title,class:`code-card`},[a(`div`,x,f(e.title),1),a(`pre`,null,[a(`code`,null,f(e.code),1)])]))),128))]))),128)),i.quiz&&i.quiz.length?(c(),t(`div`,S,[u[3]||=a(`h3`,null,`✅ Kiểm tra nhanh — hiểu rồi mới sang bài sau`,-1),(c(!0),t(p,null,n(i.quiz,(e,r)=>(c(),t(`div`,{key:r,class:`quiz-item`},[a(`p`,C,f(e.q),1),a(`div`,w,[(c(!0),t(p,null,n(e.options,(n,a)=>(c(),t(`button`,{key:a,class:s([`quiz-opt`,$(i.id,r,a,e.answer)]),disabled:Y[Q(i.id,r)]!==void 0,onClick:e=>se(i.id,r,a)},f(n),11,T))),128))]),Y[Q(i.id,r)]===void 0?o(``,!0):(c(),t(`p`,E,f(Y[Q(i.id,r)]===e.answer?`✅ Đúng. `:`❌ Chưa đúng. `)+` `+f(e.why),1))]))),128))])):o(``,!0)])),[[e,J.value===i.id]])),128)):J.value===`exercises`?(c(),t(`section`,D,[a(`div`,O,[u[4]||=a(`h2`,null,`💪 Bài tập luyện tư duy`,-1),a(`span`,k,f(d(m).exercises.length)+` bài · Dễ → Khó`,1)]),u[9]||=a(`p`,{class:`tz-intro`},` Quy tắc vàng: tự viết 20–30 phút KHÔNG được thì mới xem gợi ý; viết tiếp vẫn bí mới xem đáp án. Chép đáp án không rèn được tư duy — hiểu "vì sao" mới là mục tiêu. `,-1),(c(!0),t(p,null,n(d(m).exercises,e=>(c(),t(`div`,{key:e.id,class:`ex-card`},[a(`div`,A,[a(`span`,{class:s([`ex-level`,`lv-`+e.level])},f(de(e.level)),3),a(`h3`,null,f(e.title),1)]),a(`div`,j,[u[5]||=a(`strong`,null,`Đề bài:`,-1),i(` `+f(e.task),1)]),a(`div`,M,[a(`button`,{class:`ex-btn`,onClick:t=>le(e.id)},f(Z[e.id]&&Z[e.id].hint?`Ẩn gợi ý`:`💡 Xem gợi ý`),9,N),a(`button`,{class:`ex-btn primary`,onClick:t=>ue(e.id)},f(Z[e.id]&&Z[e.id].answer?`Ẩn đáp án`:`✅ Xem đáp án`),9,P)]),Z[e.id]&&Z[e.id].hint?(c(),t(`div`,F,[u[6]||=a(`strong`,null,`Cách nghĩ:`,-1),i(` `+f(e.hint),1)])):o(``,!0),Z[e.id]&&Z[e.id].answer?(c(),t(`div`,I,[a(`div`,ae,[u[7]||=a(`div`,{class:`code-title`},`Lời giải`,-1),a(`pre`,null,[a(`code`,null,f(e.solution),1)])]),a(`p`,L,[u[8]||=a(`strong`,null,`Vì sao:`,-1),i(` `+f(e.explain),1)])])):o(``,!0)]))),128))])):(c(),t(`section`,R,[a(`div`,z,[u[10]||=a(`h2`,null,`🔍 Đọc code — đoán kết quả`,-1),a(`span`,B,f(d(m).readCode.length)+` câu hỏi bẫy`,1)]),u[11]||=a(`p`,{class:`tz-intro`},` Cách rèn "tư duy lập trình" nhanh nhất: đọc code như máy tính, chạy từng dòng trong đầu rồi đoán output. Sai bao nhiêu cũng được — đọc kỹ phần giải thích. `,-1),(c(!0),t(p,null,n(d(m).readCode,(e,r)=>(c(),t(`div`,{key:r,class:`rc-card`},[a(`span`,V,`Câu `+f(r+1),1),a(`div`,H,[a(`pre`,null,[a(`code`,null,f(e.code),1)])]),a(`p`,U,f(e.question),1),a(`div`,W,[(c(!0),t(p,null,n(e.options,(n,i)=>(c(),t(`button`,{key:i,class:s([`quiz-opt`,$(`rc`,r,i,e.answer)]),disabled:X[`rc-`+r]!==void 0,onClick:e=>ce(r,i)},f(n),11,G))),128))]),X[`rc-`+r]===void 0?o(``,!0):(c(),t(`p`,K,f(X[`rc-`+r]===e.answer?`✅ Đúng. `:`❌ Chưa đúng. `)+` `+f(e.explain),1))]))),128))]))]))}},[[`__scopeId`,`data-v-2203e295`]]);export{q as default};