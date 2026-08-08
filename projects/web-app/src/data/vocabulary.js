// Vocabulary data organized by category
export const vocabCategories = {
  greetings: { label: 'Chào hỏi & Giới thiệu', icon: '👋' },
  daily: { label: 'Sinh hoạt hàng ngày', icon: '🏠' },
  food: { label: 'Ăn uống', icon: '🍽️' },
  shopping: { label: 'Mua sắm', icon: '🛒' },
  travel: { label: 'Du lịch', icon: '✈️' },
  work: { label: 'Công việc', icon: '💼' },
  school: { label: 'Trường học', icon: '📚' },
  health: { label: 'Sức khỏe', icon: '🏥' },
  emotion: { label: 'Cảm xúc', icon: '❤️' },
  technology: { label: 'Công nghệ', icon: '💻' },
  time: { label: 'Thời gian', icon: '⏰' },
  weather: { label: 'Thời tiết', icon: '☀️' },
  nature: { label: 'Thiên nhiên', icon: '🌳' },
  family: { label: 'Gia đình', icon: '👨‍👩‍👧' },
};

export const vocabulary = [
  // Greetings
  { en: 'Hello', phonetic: '/həˈloʊ/', vi: 'Xin chào', tag: 'greetings', exampleEn: '"Hello, nice to meet you!"', exampleVi: '"Xin chào, rất vui được gặp bạn!"' },
  { en: 'Goodbye', phonetic: '/ɡʊdˈbaɪ/', vi: 'Tạm biệt', tag: 'greetings', exampleEn: '"Goodbye, see you tomorrow!"', exampleVi: '"Tạm biệt, hẹn gặp lại ngày mai!"' },
  { en: 'Thank you', phonetic: '/θæŋk juː/', vi: 'Cảm ơn', tag: 'greetings', exampleEn: '"Thank you for your help!"', exampleVi: '"Cảm ơn bạn đã giúp đỡ!"' },
  { en: 'Please', phonetic: '/pliːz/', vi: 'Làm ơn / Xin', tag: 'greetings', exampleEn: '"Please close the door."', exampleVi: '"Làm ơn đóng cửa lại."' },
  { en: 'Sorry', phonetic: '/ˈsɒri/', vi: 'Xin lỗi', tag: 'greetings', exampleEn: '"Sorry, I\'m late."', exampleVi: '"Xin lỗi, tôi đến muộn."' },
  { en: 'Welcome', phonetic: '/ˈwelkəm/', vi: 'Chào mừng', tag: 'greetings', exampleEn: '"Welcome to our home!"', exampleVi: '"Chào mừng đến nhà chúng tôi!"' },
  { en: 'Good morning', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', vi: 'Chào buổi sáng', tag: 'greetings', exampleEn: '"Good morning, how are you?"', exampleVi: '"Chào buổi sáng, bạn khỏe không?"' },
  { en: 'Good night', phonetic: '/ɡʊd naɪt/', vi: 'Chúc ngủ ngon', tag: 'greetings', exampleEn: '"Good night, sweet dreams!"', exampleVi: '"Chúc ngủ ngon, mơ đẹp nhé!"' },

  // Daily (Sinh hoạt hàng ngày)
  { en: 'Wake up', phonetic: '/weɪk ʌp/', vi: 'Thức dậy', tag: 'daily', exampleEn: '"I wake up at 6 a.m. every day."', exampleVi: '"Tôi thức dậy lúc 6 giờ sáng mỗi ngày."' },
  { en: 'Eat', phonetic: '/iːt/', vi: 'Ăn', tag: 'daily', exampleEn: '"I eat breakfast at 7 o\'clock."', exampleVi: '"Tôi ăn sáng lúc 7 giờ."' },
  { en: 'Drink', phonetic: '/drɪŋk/', vi: 'Uống', tag: 'daily', exampleEn: '"I drink a glass of water every morning."', exampleVi: '"Tôi uống một cốc nước mỗi sáng."' },
  { en: 'Sleep', phonetic: '/sliːp/', vi: 'Ngủ', tag: 'daily', exampleEn: '"I sleep 8 hours every night."', exampleVi: '"Tôi ngủ 8 tiếng mỗi đêm."' },
  { en: 'Bath', phonetic: '/bæθ/', vi: 'Tắm', tag: 'daily', exampleEn: '"I take a bath before going to bed."', exampleVi: '"Tôi tắm trước khi đi ngủ."' },
  { en: 'Brush teeth', phonetic: '/brʌʃ tiːθ/', vi: 'Đánh răng', tag: 'daily', exampleEn: '"I brush my teeth twice a day."', exampleVi: '"Tôi đánh răng hai lần mỗi ngày."' },
  { en: 'Work', phonetic: '/wɜːrk/', vi: 'Đi làm', tag: 'daily', exampleEn: '"I go to work at 8 o\'clock."', exampleVi: '"Tôi đi làm lúc 8 giờ."' },
  { en: 'Cook', phonetic: '/kʊk/', vi: 'Nấu ăn', tag: 'daily', exampleEn: '"I cook dinner for my family."', exampleVi: '"Tôi nấu bữa tối cho gia đình."' },
  { en: 'Clean', phonetic: '/kliːn/', vi: 'Dọn dẹp', tag: 'daily', exampleEn: '"I clean the house on weekends."', exampleVi: '"Tôi dọn dẹp nhà cửa vào cuối tuần."' },
  { en: 'Watch TV', phonetic: '/wɒtʃ tiː ˈviː/', vi: 'Xem TV', tag: 'daily', exampleEn: '"I watch TV in the evening."', exampleVi: '"Tôi xem TV vào buổi tối."' },

  // Food
  { en: 'Water', phonetic: '/ˈwɔːtər/', vi: 'Nước', tag: 'food', exampleEn: '"Can I have a glass of water?"', exampleVi: '"Tôi có thể xin một ly nước không?"' },
  { en: 'Coffee', phonetic: '/ˈkɒfi/', vi: 'Cà phê', tag: 'food', exampleEn: '"I drink coffee every morning."', exampleVi: '"Tôi uống cà phê mỗi sáng."' },
  { en: 'Apple', phonetic: '/ˈæpl/', vi: 'Quả táo', tag: 'food', exampleEn: '"An apple a day keeps the doctor away."', exampleVi: '"Một quả táo mỗi ngày giúp bạn không cần bác sĩ."' },
  { en: 'Bread', phonetic: '/bred/', vi: 'Bánh mì', tag: 'food', exampleEn: '"I eat bread for breakfast."', exampleVi: '"Tôi ăn bánh mì vào bữa sáng."' },
  { en: 'Rice', phonetic: '/raɪs/', vi: 'Cơm / Gạo', tag: 'food', exampleEn: '"We eat rice every day."', exampleVi: '"Chúng tôi ăn cơm mỗi ngày."' },
  { en: 'Fish', phonetic: '/fɪʃ/', vi: 'Cá', tag: 'food', exampleEn: '"I like grilled fish."', exampleVi: '"Tôi thích cá nướng."' },
  { en: 'Chicken', phonetic: '/ˈtʃɪkɪn/', vi: 'Gà', tag: 'food', exampleEn: '"Chicken is my favorite."', exampleVi: '"Gà là món tôi yêu thích."' },
  { en: 'Egg', phonetic: '/eɡ/', vi: 'Trứng', tag: 'food', exampleEn: '"I have two eggs for breakfast."', exampleVi: '"Tôi ăn hai quả trứng vào bữa sáng."' },

  // School
  { en: 'Book', phonetic: '/bʊk/', vi: 'Sách', tag: 'school', exampleEn: '"This book is very interesting."', exampleVi: '"Cuốn sách này rất thú vị."' },
  { en: 'Learn', phonetic: '/lɜːrn/', vi: 'Học', tag: 'school', exampleEn: '"I learn English every day."', exampleVi: '"Tôi học tiếng Anh mỗi ngày."' },
  { en: 'Study', phonetic: '/ˈstʌdi/', vi: 'Nghiên cứu / Học tập', tag: 'school', exampleEn: '"She studies at Harvard."', exampleVi: '"Cô ấy học tại Harvard."' },
  { en: 'Teacher', phonetic: '/ˈtiːtʃər/', vi: 'Giáo viên', tag: 'school', exampleEn: '"My teacher is very kind."', exampleVi: '"Giáo viên của tôi rất tốt."' },
  { en: 'Student', phonetic: '/ˈstjuːdənt/', vi: 'Học sinh / Sinh viên', tag: 'school', exampleEn: '"I am a student at university."', exampleVi: '"Tôi là sinh viên đại học."' },
  { en: 'Class', phonetic: '/klæs/', vi: 'Lớp học', tag: 'school', exampleEn: '"What class do you have today?"', exampleVi: '"Hôm nay bạn có lớp gì?"' },

  // Technology
  { en: 'Computer', phonetic: '/kəmˈpjuːtər/', vi: 'Máy tính', tag: 'technology', exampleEn: '"My computer is very slow."', exampleVi: '"Máy tính của tôi rất chậm."' },
  { en: 'Phone', phonetic: '/foʊn/', vi: 'Điện thoại', tag: 'technology', exampleEn: '"My phone battery is low."', exampleVi: '"Pin điện thoại của tôi sắp hết."' },
  { en: 'Internet', phonetic: '/ˈɪntərnet/', vi: 'Internet', tag: 'technology', exampleEn: '"The internet is down."', exampleVi: '"Internet bị chậm."' },
  { en: 'Email', phonetic: '/ˈiːmeɪl/', vi: 'Thư điện tử', tag: 'technology', exampleEn: '"I sent you an email."', exampleVi: '"Tôi đã gửi bạn một email."' },
  { en: 'Website', phonetic: '/ˈwebsaɪt/', vi: 'Trang web', tag: 'technology', exampleEn: '"This website is very useful."', exampleVi: '"Trang web này rất hữu ích."' },
  { en: 'App', phonetic: '/æp/', vi: 'Ứng dụng', tag: 'technology', exampleEn: '"I downloaded a new app."', exampleVi: '"Tôi đã tải một ứng dụng mới."' },

  // Work
  { en: 'Work', phonetic: '/wɜːrk/', vi: 'Làm việc', tag: 'work', exampleEn: '"I work at a tech company."', exampleVi: '"Tôi làm việc ở một công ty công nghệ."' },
  { en: 'Job', phonetic: '/dʒɒb/', vi: 'Công việc', tag: 'work', exampleEn: '"I have a good job."', exampleVi: '"Tôi có một công việc tốt."' },
  { en: 'Office', phonetic: '/ˈɒfɪs/', vi: 'Văn phòng', tag: 'work', exampleEn: '"The office is downtown."', exampleVi: '"Văn phòng ở trung tâm thành phố."' },
  { en: 'Meeting', phonetic: '/ˈmiːtɪŋ/', vi: 'Cuộc họp', tag: 'work', exampleEn: '"We have a meeting at 3pm."', exampleVi: '"Chúng tôi có cuộc họp lúc 3 giờ."' },
  { en: 'Project', phonetic: '/ˈprɒdʒekt/', vi: 'Dự án', tag: 'work', exampleEn: '"This project is important."', exampleVi: '"Dự án này rất quan trọng."' },
  { en: 'Deadline', phonetic: '/ˈdedlaɪn/', vi: 'Thời hạn', tag: 'work', exampleEn: '"The deadline is next Friday."', exampleVi: '"Thời hạn là thứ Sáu tuần sau."' },

  // Time
  { en: 'Time', phonetic: '/taɪm/', vi: 'Thời gian', tag: 'time', exampleEn: '"What time is it?"', exampleVi: '"Bây giờ là mấy giờ?"' },
  { en: 'Today', phonetic: '/təˈdeɪ/', vi: 'Hôm nay', tag: 'time', exampleEn: '"Today is Monday."', exampleVi: '"Hôm nay là thứ Hai."' },
  { en: 'Tomorrow', phonetic: '/təˈmɒroʊ/', vi: 'Ngày mai', tag: 'time', exampleEn: '"See you tomorrow!"', exampleVi: '"Hẹn gặp ngày mai!"' },
  { en: 'Yesterday', phonetic: '/ˈjestərdeɪ/', vi: 'Hôm qua', tag: 'time', exampleEn: '"Yesterday was my birthday."', exampleVi: '"Hôm qua là sinh nhật của tôi."' },
  { en: 'Week', phonetic: '/wiːk/', vi: 'Tuần', tag: 'time', exampleEn: '"This week is very busy."', exampleVi: '"Tuần này rất bận."' },
  { en: 'Month', phonetic: '/mʌnθ/', vi: 'Tháng', tag: 'time', exampleEn: '"I will travel next month."', exampleVi: '"Tôi sẽ đi du lịch vào tháng tới."' },

  // Travel
  { en: 'Car', phonetic: '/kɑːr/', vi: 'Ô tô', tag: 'travel', exampleEn: '"I drive a red car."', exampleVi: '"Tôi lái một chiếc ô tô màu đỏ."' },
  { en: 'Hotel', phonetic: '/hoʊˈtel/', vi: 'Khách sạn', tag: 'travel', exampleEn: '"The hotel is very expensive."', exampleVi: '"Khách sạn này rất đắt."' },
  { en: 'Airport', phonetic: '/ˈeərpɔːrt/', vi: 'Sân bay', tag: 'travel', exampleEn: '"The flight is at the airport."', exampleVi: '"Chuyến bay ở sân bay."' },
  { en: 'Ticket', phonetic: '/ˈtɪkɪt/', vi: 'Vé', tag: 'travel', exampleEn: '"I bought a plane ticket."', exampleVi: '"Tôi đã mua một vé máy bay."' },
  { en: 'Passport', phonetic: '/ˈpæspɔːrt/', vi: 'Hộ chiếu', tag: 'travel', exampleEn: '"Where is your passport?"', exampleVi: '"Hộ chiếu của bạn đâu?"' },

  // Shopping
  { en: 'Shop', phonetic: '/ʃɒp/', vi: 'Cửa hàng', tag: 'shopping', exampleEn: '"The shop opens at 8 a.m."', exampleVi: '"Cửa hàng mở cửa lúc 8 giờ sáng."' },
  { en: 'Price', phonetic: '/praɪs/', vi: 'Giá', tag: 'shopping', exampleEn: '"What is the price?"', exampleVi: '"Giá bao nhiêu?"' },
  { en: 'Buy', phonetic: '/baɪ/', vi: 'Mua', tag: 'shopping', exampleEn: '"I want to buy this shirt."', exampleVi: '"Tôi muốn mua chiếc áo này."' },
  { en: 'Sell', phonetic: '/sel/', vi: 'Bán', tag: 'shopping', exampleEn: '"They sell fresh fruits."', exampleVi: '"Họ bán trái cây tươi."' },
  { en: 'Money', phonetic: '/ˈmʌni/', vi: 'Tiền', tag: 'shopping', exampleEn: '"I don\'t have enough money."', exampleVi: '"Tôi không có đủ tiền."' },

  // Health
  { en: 'Hospital', phonetic: '/ˈhɒspɪtl/', vi: 'Bệnh viện', tag: 'health', exampleEn: '"The hospital is near here."', exampleVi: '"Bệnh viện ở gần đây."' },
  { en: 'Doctor', phonetic: '/ˈdɒktər/', vi: 'Bác sĩ', tag: 'health', exampleEn: '"I need to see a doctor."', exampleVi: '"Tôi cần gặp bác sĩ."' },
  { en: 'Medicine', phonetic: '/ˈmedɪsɪn/', vi: 'Thuốc', tag: 'health', exampleEn: '"Take this medicine twice a day."', exampleVi: '"Uống thuốc này hai lần một ngày."' },
  { en: 'Headache', phonetic: '/ˈhedeɪk/', vi: 'Đau đầu', tag: 'health', exampleEn: '"I have a headache."', exampleVi: '"Tôi bị đau đầu."' },
  { en: 'Fever', phonetic: '/ˈfiːvər/', vi: 'Sốt', tag: 'health', exampleEn: '"She has a high fever."', exampleVi: '"Cô ấy bị sốt cao."' },

  // Emotion
  { en: 'Happy', phonetic: '/ˈhæpi/', vi: 'Vui vẻ', tag: 'emotion', exampleEn: '"I am very happy today."', exampleVi: '"Tôi rất vui hôm nay."' },
  { en: 'Friend', phonetic: '/frend/', vi: 'Bạn bè', tag: 'emotion', exampleEn: '"He is my best friend."', exampleVi: '"An ấy là bạn thân của tôi."' },
  { en: 'Love', phonetic: '/lʌv/', vi: 'Yêu', tag: 'emotion', exampleEn: '"I love my family."', exampleVi: '"Tôi yêu gia đình."' },
  { en: 'Sad', phonetic: '/sæd/', vi: 'Buồn', tag: 'emotion', exampleEn: '"Why do you look sad?"', exampleVi: '"Sao bạn trông buồn vậy?"' },
  { en: 'Tired', phonetic: '/ˈtaɪərd/', vi: 'Mệt', tag: 'emotion', exampleEn: '"I am very tired today."', exampleVi: '"Tôi rất mệt hôm nay."' },
  { en: 'Excited', phonetic: '/ɪkˈsaɪtɪd/', vi: 'Hào hứng', tag: 'emotion', exampleEn: '"I am excited about the trip."', exampleVi: '"Tôi rất hào hứng về chuyến đi."' },

  // Weather
  { en: 'Sun', phonetic: '/sʌn/', vi: 'Mặt trời', tag: 'weather', exampleEn: '"The sun is very bright today."', exampleVi: '"Mặt trời rất chói chang hôm nay."' },
  { en: 'Rain', phonetic: '/reɪn/', vi: 'Mưa', tag: 'weather', exampleEn: '"It will rain this afternoon."', exampleVi: '"Chiều nay sẽ có mưa."' },
  { en: 'Hot', phonetic: '/hɒt/', vi: 'Nóng', tag: 'weather', exampleEn: '"It is very hot today."', exampleVi: '"Hôm nay trời rất nóng."' },
  { en: 'Cold', phonetic: '/koʊld/', vi: 'Lạnh', tag: 'weather', exampleEn: '"It is cold in winter."', exampleVi: '"Mùa đông trời rất lạnh."' },
  { en: 'Weather', phonetic: '/ˈweðər/', vi: 'Thời tiết', tag: 'weather', exampleEn: '"What is the weather like?"', exampleVi: '"Thời tiết như thế nào?"' },

  // Nature
  { en: 'Tree', phonetic: '/triː/', vi: 'Cây', tag: 'nature', exampleEn: '"There are many trees in the park."', exampleVi: '"Công viên có nhiều cây xanh."' },
  { en: 'Flower', phonetic: '/ˈflaʊər/', vi: 'Hoa', tag: 'nature', exampleEn: '"The flowers are beautiful."', exampleVi: '"Những bông hoa rất đẹp."' },
  { en: 'Mountain', phonetic: '/ˈmaʊntɪn/', vi: 'Núi', tag: 'nature', exampleEn: '"We climbed the mountain."', exampleVi: '"Chúng tôi đã leo núi."' },
  { en: 'River', phonetic: '/ˈrɪvər/', vi: 'Sông', tag: 'nature', exampleEn: '"The river is very long."', exampleVi: '"Con sông rất dài."' },
  { en: 'Sea', phonetic: '/siː/', vi: 'Biển', tag: 'nature', exampleEn: '"The sea is blue and calm."', exampleVi: '"Biển xanh và yên bình."' },

  // Family
  { en: 'Mother', phonetic: '/ˈmʌðər/', vi: 'Mẹ', tag: 'family', exampleEn: '"My mother is a teacher."', exampleVi: '"Mẹ tôi là giáo viên."' },
  { en: 'Father', phonetic: '/ˈfɑːðər/', vi: 'Bố', tag: 'family', exampleEn: '"My father works hard."', exampleVi: '"Bố tôi làm việc vất vả."' },
  { en: 'Brother', phonetic: '/ˈbrʌðər/', vi: 'Anh / Em trai', tag: 'family', exampleEn: '"My brother is older than me."', exampleVi: '"Anh trai tôi lớn hơn tôi."' },
  { en: 'Sister', phonetic: '/ˈsɪstər/', vi: 'Chị / Em gái', tag: 'family', exampleEn: '"My sister lives in Hanoi."', exampleVi: '"Chị gái tôi sống ở Hà Nội."' },
  { en: 'Baby', phonetic: '/ˈbeɪbi/', vi: 'Em bé', tag: 'family', exampleEn: '"The baby is sleeping."', exampleVi: '"Em bé đang ngủ."' },
];
