# /review-performance

Đánh giá hiệu quả bài/video đã đăng theo số liệu thật và cập nhật `context/matrix.md`,
`context/strategy.md`.

Khi người dùng gõ lệnh này:

1. **Lấy số liệu (tốn tín dụng Apify, ít):** xem file mới nhất trong `context/own-stats/`. Nếu cũ hơn
   7 ngày hoặc chưa có, báo người dùng chi phí ước tính (khoảng 0,05–0,3 USD tùy số bài) rồi chạy
   `node scripts/fetch-own-stats.js` (fanpage `hoclaixephutho` + kênh TikTok nếu đã điền trong
   `config/own-channels.json`). Nếu chưa có tên kênh TikTok, nhắc người dùng điền.
2. **Ghép số liệu với nội dung đã làm:** với mỗi bài/video trong own-stats, tìm file tương ứng trong
   `posts/bai-XX/noi-dung.md` hoặc `videos/video-XX/kich-ban.md`:
   - So khớp theo nội dung: câu đầu/tiêu đề, cụm từ đặc trưng (ngày thi, tên chương trình), rồi
     theo ngày đăng gần nhất với ngày tạo bài trong `output/dashboard.md` / `plans/`.
   - Không khớp được → ghi "không có trong posts/" (bài người dùng tự đăng).
   - Lấy từ file đã khớp: định dạng (ảnh thật / infographic / carousel / video + format video),
     chủ đề (số topic-bank nếu có), kiểu hook, kiểu CTA (theo "Ngân hàng CTA").
3. **Cập nhật `context/matrix.md`** (ghi đè phần số liệu, giữ phần "Lịch sử" và thêm 1 dòng mới):
   follower fanpage/TikTok, số bài trong kỳ, view trung bình (nếu có), tương tác trung bình
   (like + bình luận + chia sẻ), tỷ lệ tương tác trên follower, **top 5 bài/video** (link, file khớp,
   số liệu), và bảng hiệu quả theo **định dạng / chủ đề / kiểu hook / kiểu CTA** (số bài, tương tác
   trung bình). Ghi rõ cỡ mẫu; dưới 5 bài thì ghi "mẫu nhỏ, chỉ tham khảo".
4. **Ghi 3–5 khuyến nghị** vào mục "Khuyến nghị từ số liệu" trong `context/strategy.md` (thay khuyến
   nghị cũ, ghi ngày): mỗi khuyến nghị nêu số liệu làm căn cứ và việc cụ thể cho lần lên ý tưởng
   tiếp theo. Không bịa số; số nào actor không trả (vd. view bài ảnh Facebook) thì ghi "không có".
5. Cho người dùng xem tóm tắt: top 5, format hiệu quả nhất, các khuyến nghị.

Skill `content-ideation.md` và `video-scripting.md` đọc `context/matrix.md` để ưu tiên format/chủ đề
đang hiệu quả.
