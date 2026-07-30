// 12 thì tiếng Anh
export const tenses = [
  {
    name: "Present Simple",
    title: "Thì hiện tại đơn",
    form: "S + V(s/es)",
    usage: "Diễn tả thói quen, sự thật hiển nhiên, chân lý.",
    signal: "every day, usually, often, always, sometimes, never",
    exampleEn: "She goes to school every day.",
    exampleVi: "Cô ấy đi học mỗi ngày.",
    note: "Simple present = hiện tại đơn. Dùng cho hành động lặp lại hoặc sự thật."
  },
  {
    name: "Present Continuous",
    title: "Thì hiện tại tiếp diễn",
    form: "S + am/is/are + V-ing",
    usage: "Diễn tả hành động đang diễn ra tại thời điểm nói.",
    signal: "now, right now, at the moment, Look!, Listen!",
    exampleEn: "I am studying English now.",
    exampleVi: "Tôi đang học tiếng Anh bây giờ.",
    note: "Present continuous = hiện tại tiếp diễn. Dùng be + V-ing để nói đang làm gì."
  },
  {
    name: "Present Perfect",
    title: "Thì hiện tại hoàn thành",
    form: "S + have/has + V3/ed",
    usage: "Diễn tả hành động đã xảy ra trong quá khứ, kết quả ở hiện tại.",
    signal: "just, already, yet, ever, never, since, for",
    exampleEn: "I have finished my homework.",
    exampleVi: "Tôi đã làm xong bài tập về nhà.",
    note: "Present perfect = hiện tại hoàn thành. Kết nối quá khứ với hiện tại."
  },
  {
    name: "Present Perfect Continuous",
    title: "Thì hiện tại hoàn thành tiếp diễn",
    form: "S + have/has + been + V-ing",
    usage: "Diễn tả hành động bắt đầu trong quá khứ và tiếp tục đến hiện tại.",
    signal: "for, since, all day, all morning",
    exampleEn: "She has been working for 3 hours.",
    exampleVi: "Cô ấy đã làm việc được 3 tiếng.",
    note: "Present perfect continuous = hiện tại hoàn thành tiếp diễn. Nhấn mạnh khoảng thời gian."
  },
  {
    name: "Past Simple",
    title: "Thì quá khứ đơn",
    form: "S + V2/ed",
    usage: "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ.",
    signal: "yesterday, last week, ago, in 2010",
    exampleEn: "I visited Paris last year.",
    exampleVi: "Tôi đã thăm Paris năm ngoái.",
    note: "Past simple = quá khứ đơn. Dùng với động từ quá khứ (V2/ed)."
  },
  {
    name: "Past Continuous",
    title: "Thì quá khứ tiếp diễn",
    form: "S + was/were + V-ing",
    usage: "Diễn tả hành động đang diễn ra tại một thời điểm trong quá khứ.",
    signal: "at 8 p.m. yesterday, while, when",
    exampleEn: "I was reading when she called.",
    exampleVi: "Tôi đang đọc sách thì cô ấy gọi.",
    note: "Past continuous = quá khứ tiếp diễn. Dùng was/were + V-ing."
  },
  {
    name: "Past Perfect",
    title: "Thì quá khứ hoàn thành",
    form: "S + had + V3/ed",
    usage: "Diễn tả hành động xảy ra trước một hành động khác trong quá khứ.",
    signal: "before, after, by the time",
    exampleEn: "He had left before I arrived.",
    exampleVi: "Anh ấy đã rời đi trước khi tôi đến.",
    note: "Past perfect = quá khứ hoàn thành. Hành động xảy ra trước trong quá khứ."
  },
  {
    name: "Past Perfect Continuous",
    title: "Thì quá khứ hoàn thành tiếp diễn",
    form: "S + had + been + V-ing",
    usage: "Diễn tả hành động đã diễn ra liên tục trước một hành động trong quá khứ.",
    signal: "before, until, for",
    exampleEn: "They had been waiting for an hour before the bus came.",
    exampleVi: "Họ đã đợi một tiếng trước khi xe buýt đến.",
    note: "Past perfect continuous = quá khứ hoàn thành tiếp diễn. Nhấn mạnh sự liên tục."
  },
  {
    name: "Future Simple",
    title: "Thì tương lai đơn",
    form: "S + will + V",
    usage: "Diễn tả hành động sẽ xảy ra trong tương lai, quyết định tại chỗ.",
    signal: "tomorrow, next week, in the future, soon",
    exampleEn: "I will help you tomorrow.",
    exampleVi: "Tôi sẽ giúp bạn ngày mai.",
    note: "Future simple = tương lai đơn. Dùng will + động từ nguyên thể."
  },
  {
    name: "Future Continuous",
    title: "Thì tương lai tiếp diễn",
    form: "S + will + be + V-ing",
    usage: "Diễn tả hành động sẽ đang diễn ra tại một thời điểm trong tương lai.",
    signal: "at this time tomorrow, at 8 p.m. next Monday",
    exampleEn: "I will be studying at 8 p.m. tomorrow.",
    exampleVi: "Tôi sẽ đang học vào lúc 8 giờ tối mai.",
    note: "Future continuous = tương lai tiếp diễn. Sẽ đang làm gì vào một thời điểm."
  },
  {
    name: "Future Perfect",
    title: "Thì tương lai hoàn thành",
    form: "S + will + have + V3/ed",
    usage: "Diễn tả hành động sẽ hoàn thành trước một thời điểm trong tương lai.",
    signal: "by next year, by the time, by 2030",
    exampleEn: "I will have finished the project by Friday.",
    exampleVi: "Tôi sẽ hoàn thành dự án trước thứ Sáu.",
    note: "Future perfect = tương lai hoàn thành. Hoàn thành trước một thời điểm tương lai."
  },
  {
    name: "Future Perfect Continuous",
    title: "Thì tương lai hoàn thành tiếp diễn",
    form: "S + will + have + been + V-ing",
    usage: "Diễn tả hành động sẽ diễn ra liên tục đến một thời điểm trong tương lai.",
    signal: "for, by the time",
    exampleEn: "By next month, I will have been working here for 2 years.",
    exampleVi: "Vào tháng sau, tôi sẽ đã làm việc ở đây được 2 năm.",
    note: "Future perfect continuous = tương lai hoàn thành tiếp diễn. Nhấn mạnh liên tục đến tương lai."
  }
];

// Expose to window for non-module scripts
if (typeof window !== 'undefined') {
  window.tenses = tenses;
}
