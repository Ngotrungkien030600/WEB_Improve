/**
 * Phần bổ sung cho từng đề bài: kiểu tham số (để sinh harness Java), code khởi tạo và
 * lời giải mẫu cho Java/Python, và tài liệu học.
 * Mọi lời giải ở đây được .tmp-check/test-code-lab-languages.mjs chạy thật qua
 * javac/node/py nên sửa gì cũng phải chạy lại test đó.
 */
import { CODE_PROBLEMS } from './code-problems.js';

const PACKS = {
  'two-sum': {
    params: ['int[]', 'int'],
    returns: 'int[]',
    javaStarter: `public static int[] twoSum(int[] nums, int target) {
    // Viết code của bạn ở đây
    return new int[]{};
}`,
    javaSolution: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    pythonStarter: `def two_sum(nums, target):
    # Viết code của bạn ở đây
    return []`,
    pythonSolution: `def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        need = target - value
        if need in seen:
            return [seen[need], index]
        seen[value] = index
    return []`,
    docs: {
      theory: [
        'Bài toán cần tra cứu nhanh "số này đã gặp ở chỉ số nào chưa". Cấu trúc phù hợp là **bảng băm** (hash map / dictionary): tra cứu trung bình O(1) thay vì quét lại mảng.',
        'Điểm mấu chốt: với mỗi số `x`, phần bù cần tìm là `target - x`. Nếu phần bù đã có trong bảng thì ta có ngay đáp án.',
      ],
      steps: [
        'Tạo bảng băm rỗng: khoá là giá trị đã gặp, giá trị là chỉ số của nó.',
        'Duyệt mảng từ trái sang phải, tính `need = target - nums[i]`.',
        'Nếu `need` có trong bảng → trả về chỉ số của nó và `i`.',
        'Nếu chưa có → lưu `nums[i]` với chỉ số `i` rồi đi tiếp.',
      ],
      complexity: { time: 'O(n) — mỗi phần tử chỉ được xử lý một lần', space: 'O(n) — bảng băm lưu tối đa n phần tử' },
      pitfalls: [
        'Phải kiểm tra phần bù **trước khi** lưu số hiện tại, nếu không sẽ tự ghép một phần tử với chính nó.',
        'Đề cho đáp án duy nhất nên có thể trả về ngay khi tìm thấy, không cần xét các cặp còn lại.',
        'Thứ tự hai chỉ số không quan trọng — bộ chấm so khớp không phân biệt thứ tự.',
      ],
    },
  },
  'reverse-string': {
    params: ['String'],
    returns: 'String',
    javaStarter: `public static String reverseString(String s) {
    // Viết code của bạn ở đây
    return "";
}`,
    javaSolution: `public static String reverseString(String s) {
    return new StringBuilder(s).reverse().toString();
}`,
    pythonStarter: `def reverse_string(s):
    # Viết code của bạn ở đây
    return ""`,
    pythonSolution: `def reverse_string(s):
    return s[::-1]`,
    docs: {
      theory: [
        'Chuỗi trong Java là bất biến (immutable) nên không sửa được tại chỗ; phải tạo chuỗi mới.',
        'Cách hai con trỏ: đổi chỗ ký tự đầu với ký tự cuối rồi thu hẹp dần vào giữa — chỉ cần đi nửa chuỗi.',
      ],
      steps: [
        'Java: dùng `StringBuilder` rồi gọi `reverse()`, hoặc tự đổi chỗ trong mảng `char[]`.',
        'Python: dùng cắt mảng `s[::-1]` để tạo chuỗi đảo ngược.',
        'JavaScript: `s.split("").reverse().join("")`, hoặc hai con trỏ đổi chỗ trong mảng.',
      ],
      complexity: { time: 'O(n)', space: 'O(n) do phải tạo chuỗi kết quả' },
      pitfalls: [
        'Đừng quên xử lý chuỗi rỗng — hàm phải trả về chuỗi rỗng chứ không lỗi.',
        'Trong Java, `String` so sánh bằng `.equals()` chứ không dùng `==`.',
      ],
    },
  },
  'is-palindrome': {
    params: ['String'],
    returns: 'boolean',
    javaStarter: `public static boolean isPalindrome(String s) {
    // Viết code của bạn ở đây
    return false;
}`,
    javaSolution: `public static boolean isPalindrome(String s) {
    String clean = s.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0;
    int right = clean.length() - 1;
    while (left < right) {
        if (clean.charAt(left) != clean.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`,
    pythonStarter: `def is_palindrome(s):
    # Viết code của bạn ở đây
    return False`,
    pythonSolution: `import re


def is_palindrome(s):
    clean = re.sub(r'[^a-z0-9]', '', s.lower())
    return clean == clean[::-1]`,
    docs: {
      theory: [
        'Chuỗi đối xứng là chuỗi đọc xuôi giống đọc ngược. Sau khi bỏ ký tự đặc biệt và đưa về chữ thường, chỉ cần so ký tự ở hai đầu.',
        'Cách hai con trỏ tránh phải tạo chuỗi đảo ngược, tiết kiệm bộ nhớ.',
      ],
      steps: [
        'Lọc chuỗi: bỏ mọi ký tự không phải chữ hoặc số, đưa hết về chữ thường.',
        'Đặt `left = 0`, `right = độ dài - 1`.',
        'So hai ký tự; khác nhau thì trả `false` ngay.',
        'Nếu hai con trỏ gặp nhau mà chưa lệch thì trả `true`.',
      ],
      complexity: { time: 'O(n)', space: 'O(1) nếu dùng hai con trỏ, O(n) nếu tạo chuỗi đã lọc' },
      pitfalls: [
        'Chuỗi rỗng được coi là đối xứng → trả `true`.',
        '`"0P"` sau khi chuẩn hoá thành `"0p"` nên **không** đối xứng — đừng chỉ so chữ cái mà bỏ qua chữ số.',
        'Nhớ đưa về chữ thường trước khi so, nếu không `"Aa"` sẽ bị coi là sai.',
      ],
    },
  },
  'valid-parentheses': {
    params: ['String'],
    returns: 'boolean',
    javaStarter: `public static boolean isValid(String s) {
    // Viết code của bạn ở đây
    return false;
}`,
    javaSolution: `public static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char current : s.toCharArray()) {
        if (current == '(' || current == '[' || current == '{') {
            stack.push(current);
            continue;
        }
        if (stack.isEmpty()) return false;
        char open = stack.pop();
        if ((current == ')' && open != '(') || (current == ']' && open != '[') || (current == '}' && open != '{')) {
            return false;
        }
    }
    return stack.isEmpty();
}`,
    pythonStarter: `def is_valid(s):
    # Viết code của bạn ở đây
    return False`,
    pythonSolution: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch not in pairs:
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return len(stack) == 0`,
    docs: {
      theory: [
        'Ngoặc đóng luôn phải khớp với ngoặc mở **gần nhất chưa được đóng** — đúng mô hình vào sau ra trước (LIFO).',
        'Cấu trúc dữ liệu cho LIFO là **ngăn xếp (stack)**: Java dùng `Deque`/`ArrayDeque`, Python dùng `list` với `append`/`pop`.',
      ],
      steps: [
        'Gặp ngoặc mở `(`, `[`, `{` → đẩy vào ngăn xếp.',
        'Gặp ngoặc đóng → lấy phần tử trên cùng ra; nếu ngăn xếp rỗng hoặc không phải cặp tương ứng thì trả `false`.',
        'Duyệt hết chuỗi mà ngăn xếp rỗng → `true`; còn phần tử trong ngăn xếp → `false`.',
      ],
      complexity: { time: 'O(n)', space: 'O(n) cho ngăn xếp' },
      pitfalls: [
        'Phải kiểm tra ngăn xếp rỗng trước khi `pop()`, nếu không sẽ lỗi khi chuỗi bắt đầu bằng ngoặc đóng.',
        'Cuối cùng bắt buộc kiểm tra ngăn xếp rỗng: `"("` phải trả `false`.',
        'Đừng chỉ đếm số lượng ngoặc — `"([)]"` có số lượng cân bằng nhưng vẫn sai thứ tự.',
      ],
    },
  },
  'max-subarray': {
    params: ['int[]'],
    returns: 'int',
    javaStarter: `public static int maxSubArray(int[] nums) {
    // Viết code của bạn ở đây
    return 0;
}`,
    javaSolution: `public static int maxSubArray(int[] nums) {
    int best = nums[0];
    int current = nums[0];
    for (int i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
    pythonStarter: `def max_sub_array(nums):
    # Viết code của bạn ở đây
    return 0`,
    pythonSolution: `def max_sub_array(nums):
    best = current = nums[0]
    for value in nums[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best`,
    docs: {
      theory: [
        'Thuật toán **Kadane**: tại mỗi vị trí, dãy con tốt nhất kết thúc ở đó chỉ có hai lựa chọn — nối tiếp dãy trước, hoặc bắt đầu lại từ chính phần tử này.',
        'Vì mỗi bước chỉ cần kết quả của bước ngay trước, ta không cần mảng quy hoạch động đầy đủ, chỉ cần một biến.',
      ],
      steps: [
        'Khởi tạo `best = current = nums[0]`.',
        'Với mỗi phần tử tiếp theo: `current = max(nums[i], current + nums[i])`.',
        'Cập nhật `best = max(best, current)`.',
        'Trả về `best`.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
      pitfalls: [
        'Mảng toàn số âm vẫn phải trả về số **lớn nhất** (ví dụ `-1`), nên không được khởi tạo `best = 0`.',
        'Không cần xét dãy rỗng vì đề yêu cầu ít nhất một phần tử.',
        'Trong Java, `Math.max(int, int)` trả về `int`; đừng trộn với `long` nếu không cần.',
      ],
    },
  },
  'group-anagrams': {
    params: ['String[]'],
    returns: 'String[][]',
    javaStarter: `public static String[][] groupAnagrams(String[] words) {
    // Viết code của bạn ở đây
    return new String[][]{};
}`,
    javaSolution: `public static String[][] groupAnagrams(String[] words) {
    Map<String, List<String>> groups = new LinkedHashMap<>();
    for (String word : words) {
        char[] letters = word.toCharArray();
        Arrays.sort(letters);
        String key = new String(letters);
        groups.computeIfAbsent(key, ignored -> new ArrayList<>()).add(word);
    }
    String[][] result = new String[groups.size()][];
    int index = 0;
    for (List<String> group : groups.values()) {
        result[index++] = group.toArray(new String[0]);
    }
    return result;
}`,
    pythonStarter: `def group_anagrams(words):
    # Viết code của bạn ở đây
    return []`,
    pythonSolution: `def group_anagrams(words):
    groups = {}
    for word in words:
        key = ''.join(sorted(word))
        groups.setdefault(key, []).append(word)
    return list(groups.values())`,
    docs: {
      theory: [
        'Cần một "dấu vân tay" chung cho mọi từ đảo chữ: sắp xếp ký tự của từ lại thì `eat`, `tea`, `ate` đều thành `aet`.',
        'Dùng **bảng băm** với khoá là dấu vân tay, giá trị là danh sách các từ cùng nhóm.',
      ],
      steps: [
        'Tạo bảng băm rỗng.',
        'Với mỗi từ: sắp xếp các ký tự để tạo khoá.',
        'Thêm từ vào danh sách của khoá đó (tạo danh sách nếu chưa có).',
        'Trả về danh sách các nhóm.',
      ],
      complexity: { time: 'O(n · k log k) với k là độ dài từ dài nhất (do phải sắp xếp ký tự)', space: 'O(n · k)' },
      pitfalls: [
        'Thứ tự các nhóm và thứ tự từ trong nhóm không quan trọng — bộ chấm so khớp kiểu "set of sets".',
        'Trong Java, mảng không dùng làm khoá bảng băm được vì `hashCode` theo địa chỉ; phải đổi sang `String`.',
        'Đừng quên trường hợp từ rỗng: nhóm gồm một chuỗi rỗng.',
      ],
    },
  },
  'longest-substring': {
    params: ['String'],
    returns: 'int',
    javaStarter: `public static int lengthOfLongestSubstring(String s) {
    // Viết code của bạn ở đây
    return 0;
}`,
    javaSolution: `public static int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right++) {
        char current = s.charAt(right);
        Integer seen = lastSeen.get(current);
        if (seen != null && seen >= left) left = seen + 1;
        lastSeen.put(current, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
    pythonStarter: `def length_of_longest_substring(s):
    # Viết code của bạn ở đây
    return 0`,
    pythonSolution: `def length_of_longest_substring(s):
    last_seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
    docs: {
      theory: [
        'Kỹ thuật **cửa sổ trượt**: giữ một đoạn `[left, right]` luôn chứa toàn ký tự khác nhau, rồi mở rộng dần sang phải.',
        'Khi gặp ký tự đã có trong cửa sổ, thay vì kéo `left` từng bước, ta nhảy thẳng tới vị trí sau lần xuất hiện trước đó — nhờ bảng băm lưu vị trí gần nhất.',
      ],
      steps: [
        'Tạo bảng băm lưu vị trí gần nhất của từng ký tự.',
        'Duyệt `right` từ 0 tới hết chuỗi.',
        'Nếu ký tự hiện tại đã xuất hiện trong cửa sổ (`vị trí >= left`) thì đặt `left = vị trí + 1`.',
        'Cập nhật độ dài lớn nhất `right - left + 1`.',
      ],
      complexity: { time: 'O(n) — mỗi ký tự được thêm/xoá khỏi cửa sổ một lần', space: 'O(k) với k là số ký tự khác nhau' },
      pitfalls: [
        'Phải kiểm tra `vị trí >= left` trước khi nhảy `left`; nếu không, vị trí cũ ngoài cửa sổ sẽ làm `left` lùi lại.',
        '`"dvdf"` cho đáp án 3 — cửa sổ phải bắt đầu lại từ `v`, không phải từ `d` đầu tiên.',
        'Khoảng trắng cũng là ký tự, `" "` cho đáp án 1.',
      ],
    },
  },
  'merge-intervals': {
    params: ['int[][]'],
    returns: 'int[][]',
    javaStarter: `public static int[][] mergeIntervals(int[][] intervals) {
    // Viết code của bạn ở đây
    return new int[][]{};
}`,
    javaSolution: `public static int[][] mergeIntervals(int[][] intervals) {
    int[][] sorted = new int[intervals.length][];
    for (int i = 0; i < intervals.length; i++) sorted[i] = intervals[i].clone();
    Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    for (int[] interval : sorted) {
        if (!merged.isEmpty() && interval[0] <= merged.get(merged.size() - 1)[1]) {
            int[] last = merged.get(merged.size() - 1);
            last[1] = Math.max(last[1], interval[1]);
        } else {
            merged.add(new int[]{interval[0], interval[1]});
        }
    }
    return merged.toArray(new int[0][]);
}`,
    pythonStarter: `def merge_intervals(intervals):
    # Viết code của bạn ở đây
    return []`,
    pythonSolution: `def merge_intervals(intervals):
    merged = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
    docs: {
      theory: [
        'Nếu mảng chưa sắp xếp thì rất khó biết khoảng nào gộp được với khoảng nào. Sắp xếp theo điểm bắt đầu đưa các khoảng gộp được về cạnh nhau.',
        'Sau khi sắp xếp chỉ cần so điểm bắt đầu hiện tại với điểm kết thúc của khoảng cuối trong kết quả.',
      ],
      steps: [
        'Sắp xếp các khoảng theo điểm bắt đầu.',
        'Duyệt từng khoảng: nếu điểm bắt đầu ≤ điểm kết thúc của khoảng cuối trong kết quả thì mở rộng khoảng cuối.',
        'Ngược lại thì thêm khoảng mới vào kết quả.',
        'Trả về danh sách khoảng đã gộp.',
      ],
      complexity: { time: 'O(n log n) do sắp xếp', space: 'O(n)' },
      pitfalls: [
        'Hai khoảng **chạm nhau** (`[1,4]` và `[4,5]`) vẫn tính là gộp → dùng `<=` chứ không phải `<`.',
        'Khi mở rộng khoảng cuối phải lấy `max` điểm kết thúc: `[[1,10],[2,3]]` giữ `[1,10]`.',
        'Trong Java, nhớ sao chép mảng con trước khi sửa để không làm hỏng dữ liệu test.',
      ],
    },
  },
  'coin-change': {
    params: ['int[]', 'int'],
    returns: 'int',
    javaStarter: `public static int coinChange(int[] coins, int amount) {
    // Viết code của bạn ở đây
    return -1;
}`,
    javaSolution: `public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int value = 1; value <= amount; value++) {
        for (int coin : coins) {
            if (coin <= value && dp[value - coin] != Integer.MAX_VALUE && dp[value - coin] + 1 < dp[value]) {
                dp[value] = dp[value - coin] + 1;
            }
        }
    }
    return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
}`,
    pythonStarter: `def coin_change(coins, amount):
    # Viết code của bạn ở đây
    return -1`,
    pythonSolution: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value:
                dp[value] = min(dp[value], dp[value - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]`,
    docs: {
      theory: [
        'Tham lam "chọn đồng to nhất trước" **không** luôn đúng với bộ mệnh giá tuỳ ý, nên phải dùng **quy hoạch động**.',
        'Định nghĩa `dp[x]` = số đồng ít nhất để đổi đủ số tiền `x`. Bài toán lớn xây từ bài toán nhỏ hơn.',
      ],
      steps: [
        'Tạo mảng `dp` gồm `amount + 1` phần tử, khởi tạo vô cực, `dp[0] = 0`.',
        'Với mỗi số tiền `x` từ 1 tới `amount`, thử mọi mệnh giá `c <= x`: `dp[x] = min(dp[x], dp[x - c] + 1)`.',
        'Sau khi duyệt xong, `dp[amount]` là đáp án; nếu vẫn vô cực thì trả `-1`.',
      ],
      complexity: { time: 'O(amount × số mệnh giá)', space: 'O(amount)' },
      pitfalls: [
        'Phải dùng giá trị vô cực an toàn: trong Java `Integer.MAX_VALUE + 1` sẽ tràn số thành số âm, nên phải kiểm tra `!= MAX_VALUE` trước khi cộng.',
        '`amount = 0` trả về `0` (không cần đồng nào).',
        'Không được trả `0` khi không đổi được — trường hợp đó là `-1`.',
      ],
    },
  },
};

export function languagePackFor(problemId) {
  return PACKS[problemId] || { params: ['int'], returns: 'int', docs: { theory: [], steps: [], complexity: {}, pitfalls: [] } };
}

export const CODE_PROBLEMS_FULL = CODE_PROBLEMS.map((problem) => ({ ...problem, ...languagePackFor(problem.id) }));
