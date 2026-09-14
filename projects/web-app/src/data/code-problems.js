/**
 * Ngân hàng đề bài Phòng luyện code.
 * Mỗi bài có test hiện (visible: true) và test ẩn; lời giải mẫu được test tự động
 * kiểm chứng trong .tmp-check/test-code-lab-logic.mjs nên đổi test phải chạy lại test đó.
 */

export const CODE_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Hai số cộng lại bằng đích',
    summary: 'Tìm hai chỉ số trong mảng sao cho tổng bằng target.',
    difficulty: 'easy',
    category: 'Mảng',
    tags: ['mảng', 'bảng băm'],
    compare: 'unordered',
    functionName: 'twoSum',
    description: [
      'Cho một mảng số nguyên `nums` và một số nguyên `target`. Hãy trả về **chỉ số** của hai phần tử trong mảng sao cho tổng của chúng bằng `target`.',
      'Mỗi phần tử chỉ được dùng một lần, và đề bài đảm bảo luôn có đúng một đáp án. Thứ tự hai chỉ số trong kết quả không quan trọng.',
    ],
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explain: 'nums[0] + nums[1] = 2 + 7 = 9.' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explain: 'nums[1] + nums[2] = 2 + 4 = 6.' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10^4', '-10^9 ≤ nums[i], target ≤ 10^9', 'Chỉ có đúng một đáp án'],
    hints: [
      'Cách chậm nhất là thử mọi cặp hai chỉ số — mất O(n²).',
      'Nếu biết trước một số, số còn lại phải bằng target trừ số đó. Vậy cần tra cứu nhanh "số này đã gặp ở chỉ số nào".',
      'Dùng Map: duyệt mảng một lần, trước khi lưu số hiện tại hãy kiểm tra phần bù của nó đã xuất hiện chưa.',
    ],
    starter: `function twoSum(nums, target) {
  // Viết code của bạn ở đây
  return [];
}`,
    solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], visible: true },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
    ],
  },
  {
    id: 'reverse-string',
    title: 'Đảo ngược chuỗi',
    summary: 'Trả về chuỗi mới với thứ tự ký tự bị đảo ngược.',
    difficulty: 'easy',
    category: 'Chuỗi',
    tags: ['chuỗi', 'hai con trỏ'],
    compare: 'exact',
    functionName: 'reverseString',
    description: [
      'Cho chuỗi `s`, hãy trả về **chuỗi mới** có thứ tự ký tự đảo ngược lại.',
      'Lưu ý: `s` là tham số, hàm phải trả về chuỗi mới — không sửa giá trị mà hàm nhận được.',
    ],
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "Xin chào"', output: '"oàhc niX"' },
    ],
    constraints: ['0 ≤ s.length ≤ 10^5'],
    hints: [
      'Chuỗi trong JavaScript không sửa tại chỗ được, nên cần tạo chuỗi/ mảng mới.',
      'Có thể tách thành mảng ký tự, đảo mảng rồi ghép lại.',
      'Cách hai con trỏ: đặt left ở đầu, right ở cuối rồi hoán đổi và đi vào giữa.',
    ],
    starter: `function reverseString(s) {
  // Viết code của bạn ở đây
  return '';
}`,
    solution: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
    tests: [
      { args: ['hello'], expected: 'olleh', visible: true },
      { args: ['Xin chào'], expected: 'oàhc niX' },
      { args: [''], expected: '' },
      { args: ['a'], expected: 'a' },
      { args: ['12345'], expected: '54321' },
    ],
  },
  {
    id: 'is-palindrome',
    title: 'Chuỗi đối xứng',
    summary: 'Kiểm tra chuỗi đọc xuôi và đọc ngược giống nhau (bỏ ký tự đặc biệt).',
    difficulty: 'easy',
    category: 'Chuỗi',
    tags: ['chuỗi', 'hai con trỏ'],
    compare: 'exact',
    functionName: 'isPalindrome',
    description: [
      'Cho chuỗi `s`, trả về `true` nếu sau khi **bỏ hết ký tự không phải chữ và số** và **không phân biệt chữ hoa chữ thường**, chuỗi đọc xuôi giống đọc ngược.',
      'Ví dụ: `"A man, a plan, a canal: Panama"` → bỏ ký tự đặc biệt còn `amanaplanacanalpanama`, đọc ngược vẫn giống nhau nên kết quả là `true`.',
    ],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    constraints: ['0 ≤ s.length ≤ 2 * 10^5', 's chỉ gồm ký tự ASCII'],
    hints: [
      'Bước 1: lọc bỏ ký tự không phải chữ/số, đưa về chữ thường.',
      'Cách gọn: dùng biểu thức chính quy thay thế `[^a-z0-9]` bằng chuỗi rỗng.',
      'Bước 2: so sánh chuỗi đã lọc với chính nó khi đảo ngược.',
    ],
    starter: `function isPalindrome(s) {
  // Viết code của bạn ở đây
  return false;
}`,
    solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    tests: [
      { args: ['A man, a plan, a canal: Panama'], expected: true, visible: true },
      { args: ['race a car'], expected: false },
      { args: [''], expected: true },
      { args: ['0P'], expected: false },
      { args: ['ab_a'], expected: true },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Ngoặc hợp lệ',
    summary: 'Kiểm tra chuỗi ngoặc mở/đóng có khớp và đúng thứ tự.',
    difficulty: 'medium',
    category: 'Ngăn xếp',
    tags: ['ngăn xếp', 'chuỗi'],
    compare: 'exact',
    functionName: 'isValid',
    description: [
      'Cho chuỗi `s` chỉ gồm các ký tự `(`, `)`, `{`, `}`, `[`, `]`. Trả về `true` nếu chuỗi hợp lệ.',
      'Chuỗi hợp lệ khi: ngoặc mở phải đóng bằng đúng loại ngoặc, và phải đóng theo đúng thứ tự (mở sau thì đóng trước).',
    ],
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "([)]"', output: 'false', explain: 'Ngoặc tròn mở trước nhưng bị đóng sau ngoặc vuông.' },
    ],
    constraints: ['0 ≤ s.length ≤ 10^5', 's chỉ gồm ngoặc'],
    hints: [
      'Ngoặc đóng luôn phải khớp với ngoặc mở **gần nhất chưa được đóng** — đó là cấu trúc vào sau ra trước.',
      'Vào sau ra trước chính là ngăn xếp (stack): mảng có push/pop.',
      'Gặp ngoặc mở thì push; gặp ngoặc đóng thì kiểm tra đỉnh ngăn xếp có phải cặp của nó không, sai thì trả false ngay.',
    ],
    starter: `function isValid(s) {
  // Viết code của bạn ở đây
  return false;
}`,
    solution: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const char of s) {
    if (!pairs[char]) {
      stack.push(char);
      continue;
    }
    if (stack.pop() !== pairs[char]) return false;
  }
  return stack.length === 0;
}`,
    tests: [
      { args: ['()[]{}'], expected: true, visible: true },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: ['('], expected: false },
      { args: [']'], expected: false },
      { args: [''], expected: true },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Tổng dãy con lớn nhất',
    summary: 'Tìm tổng lớn nhất của một dãy con liên tiếp (thuật toán Kadane).',
    difficulty: 'medium',
    category: 'Quy hoạch động',
    tags: ['mảng', 'quy hoạch động'],
    compare: 'exact',
    functionName: 'maxSubArray',
    description: [
      'Cho mảng số nguyên `nums`, hãy trả về **tổng lớn nhất** của một dãy con liên tiếp (ít nhất một phần tử).',
      'Dãy con liên tiếp nghĩa là các phần tử đứng cạnh nhau trong mảng gốc, không được bỏ cách quãng.',
    ],
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explain: 'Dãy [4, -1, 2, 1] có tổng 6.' },
      { input: 'nums = [-3, -1, -2]', output: '-1', explain: 'Toàn số âm nên chọn phần tử lớn nhất.' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10^5', '-10^4 ≤ nums[i] ≤ 10^4'],
    hints: [
      'Đừng thử mọi dãy con (O(n²) hoặc O(n³)) — sẽ quá thời gian với mảng lớn.',
      'Khi đang đứng ở phần tử thứ i, dãy con tốt nhất **kết thúc tại i** chỉ có hai lựa chọn: nối tiếp dãy trước đó, hoặc bắt đầu lại từ chính nó.',
      'Công thức: current = max(nums[i], current + nums[i]); đáp án là max của mọi current.',
    ],
    starter: `function maxSubArray(nums) {
  // Viết code của bạn ở đây
  return 0;
}`,
    solution: `function maxSubArray(nums) {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, visible: true },
      { args: [[-3, -1, -2]], expected: -1 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-2, -1]], expected: -1 },
    ],
  },
  {
    id: 'group-anagrams',
    title: 'Nhóm từ đảo chữ',
    summary: 'Gom các từ có cùng bộ ký tự vào một nhóm.',
    difficulty: 'medium',
    category: 'Bảng băm',
    tags: ['bảng băm', 'chuỗi', 'sắp xếp'],
    compare: 'set-of-sets',
    functionName: 'groupAnagrams',
    description: [
      'Cho mảng chuỗi `words`, hãy gom những từ là **đảo chữ** của nhau vào cùng một nhóm rồi trả về mảng các nhóm.',
      'Hai từ là đảo chữ khi chúng có cùng bộ ký tự với cùng số lần xuất hiện, chỉ khác thứ tự. Thứ tự các nhóm và thứ tự từ trong nhóm không quan trọng.',
    ],
    examples: [
      { input: 'words = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]' },
    ],
    constraints: ['1 ≤ words.length ≤ 10^4', 'words[i] chỉ gồm chữ cái thường'],
    hints: [
      'Cần một "dấu vân tay" chung cho mọi từ đảo chữ của nhau.',
      'Sắp xếp ký tự của từ lại: "eat", "tea", "ate" đều thành "aet" — đó chính là dấu vân tay.',
      'Dùng Map với khoá là dấu vân tay, giá trị là mảng các từ cùng nhóm.',
    ],
    starter: `function groupAnagrams(words) {
  // Viết code của bạn ở đây
  return [];
}`,
    solution: `function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = word.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return Array.from(groups.values());
}`,
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], visible: true },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
      { args: [['ab', 'ba', 'abc', 'cab', 'bac']], expected: [['ab', 'ba'], ['abc', 'cab', 'bac']] },
    ],
  },
  {
    id: 'longest-substring',
    title: 'Chuỗi con dài nhất không lặp ký tự',
    summary: 'Độ dài chuỗi con liên tiếp dài nhất mà không có ký tự nào lặp (cửa sổ trượt).',
    difficulty: 'hard',
    category: 'Cửa sổ trượt',
    tags: ['chuỗi', 'cửa sổ trượt', 'bảng băm'],
    compare: 'exact',
    functionName: 'lengthOfLongestSubstring',
    description: [
      'Cho chuỗi `s`, trả về **độ dài** của chuỗi con liên tiếp dài nhất mà không có ký tự nào xuất hiện hai lần.',
      '"Chuỗi con" nghĩa là các ký tự đứng liền nhau, không được bỏ cách quãng.',
    ],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explain: 'Chuỗi con "abc" dài 3.' },
      { input: 's = "pwwkew"', output: '3', explain: 'Chuỗi con "wke" dài 3; "pwke" không liền nhau nên không tính.' },
    ],
    constraints: ['0 ≤ s.length ≤ 5 * 10^4', 's gồm chữ cái, số và ký hiệu'],
    hints: [
      'Cách chậm: kiểm tra mọi chuỗi con — O(n²) hoặc tệ hơn.',
      'Giữ một "cửa sổ" [left, right] luôn chứa toàn ký tự khác nhau; mở rộng right, khi gặp ký tự trùng thì kéo left lên.',
      'Dùng Map lưu vị trí gần nhất của từng ký tự để nhảy left tới ngay sau vị trí trùng đó (không cần kéo từng bước).',
    ],
    starter: `function lengthOfLongestSubstring(s) {
  // Viết code của bạn ở đây
  return 0;
}`,
    solution: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right += 1) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    tests: [
      { args: ['abcabcbb'], expected: 3, visible: true },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: ['dvdf'], expected: 3 },
      { args: [' '], expected: 1 },
    ],
  },
  {
    id: 'merge-intervals',
    title: 'Gộp các khoảng',
    summary: 'Gộp mọi khoảng giao nhau thành khoảng lớn hơn.',
    difficulty: 'hard',
    category: 'Mảng',
    tags: ['mảng', 'sắp xếp'],
    compare: 'sorted-rows',
    functionName: 'mergeIntervals',
    description: [
      'Cho mảng các khoảng `intervals`, mỗi khoảng là `[bắt đầu, kết thúc]`. Hãy gộp tất cả các khoảng giao nhau rồi trả về mảng khoảng **đã sắp xếp theo điểm bắt đầu**.',
      'Hai khoảng giao nhau khi điểm bắt đầu của khoảng sau không lớn hơn điểm kết thúc của khoảng trước (chạm nhau cũng tính là giao).',
    ],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explain: '[1,3] và [2,6] chồng nhau nên gộp thành [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
    ],
    constraints: ['1 ≤ intervals.length ≤ 10^4', '0 ≤ bắt đầu ≤ kết thúc ≤ 10^4'],
    hints: [
      'Nếu mảng chưa sắp xếp thì rất khó biết khoảng nào gộp được với khoảng nào.',
      'Sắp xếp theo điểm bắt đầu trước; khi đó các khoảng gộp được sẽ nằm cạnh nhau.',
      'Duyệt và so sánh điểm bắt đầu hiện tại với điểm kết thúc của khoảng cuối trong kết quả: nhỏ hơn hoặc bằng thì mở rộng khoảng cuối, lớn hơn thì thêm khoảng mới.',
    ],
    starter: `function mergeIntervals(intervals) {
  // Viết code của bạn ở đây
  return [];
}`,
    solution: `function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of sorted) {
    const last = merged[merged.length - 1];
    if (last && interval[0] <= last[1]) {
      last[1] = Math.max(last[1], interval[1]);
    } else {
      merged.push([...interval]);
    }
  }
  return merged;
}`,
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], visible: true },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      { args: [[[5, 6], [1, 2], [3, 4]]], expected: [[1, 2], [3, 4], [5, 6]] },
    ],
  },
  {
    id: 'coin-change',
    title: 'Đổi tiền ít đồng nhất',
    summary: 'Số đồng xu ít nhất để đổi đủ số tiền (quy hoạch động).',
    difficulty: 'hard',
    category: 'Quy hoạch động',
    tags: ['quy hoạch động', 'mảng'],
    compare: 'exact',
    functionName: 'coinChange',
    description: [
      'Cho mảng mệnh giá `coins` và số tiền `amount`. Trả về **số đồng xu ít nhất** để đổi đủ số tiền, mỗi mệnh giá dùng được nhiều lần.',
      'Nếu không thể đổi đủ thì trả về `-1`.',
    ],
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explain: '11 = 5 + 5 + 1.' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 10^4', '0 ≤ amount ≤ 10^4'],
    hints: [
      'Tham lam "chọn đồng to nhất trước" không phải lúc nào cũng đúng với bộ mệnh giá lạ.',
      'Bài toán lớn xây từ bài toán nhỏ: để đổi số tiền x, thử mọi mệnh giá c rồi lấy 1 + kết quả tốt nhất của (x - c).',
      'Dùng mảng dp có amount + 1 phần tử, dp[0] = 0, các ô khác khởi tạo Infinity; duyệt x từ 1 đến amount.',
    ],
    starter: `function coinChange(coins, amount) {
  // Viết code của bạn ở đây
  return -1;
}`,
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let value = 1; value <= amount; value += 1) {
    for (const coin of coins) {
      if (coin <= value && dp[value - coin] + 1 < dp[value]) {
        dp[value] = dp[value - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    tests: [
      { args: [[1, 2, 5], 11], expected: 3, visible: true },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[2, 5, 10, 1], 27], expected: 4 },
      { args: [[3, 7], 5], expected: -1 },
    ],
  },
];
