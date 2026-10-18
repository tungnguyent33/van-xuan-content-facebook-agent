# /create-post

Yêu cầu người dùng (nếu có): $ARGUMENTS

Khi người dùng thực hiện lệnh `/create-post` hoặc `/create-1-post`:

1. **Xác định chủ đề bài viết**:
   - Nếu `$ARGUMENTS` là số → chủ đề số đó trong `context/topic-bank.md`.
   - Nếu `$ARGUMENTS` là chữ → dùng chủ đề "$ARGUMENTS" (tìm mục khớp trong topic-bank để lấy
     nguồn, bình luận tiêu biểu).
   - Nếu KHÔNG truyền tham số: chọn theo thứ tự ưu tiên của skill `content-ideation.md` (topic-bank
     trạng thái `mới` điểm cao → bài tiếp theo chưa làm trong kế hoạch mới nhất ở `plans/`).
   - Chủ đề `cần duyệt` → dừng, báo lý do, hỏi người dùng.

2. **Đọc lịch sử & tránh lặp** theo bước 2 của skill `content-ideation.md` (15 bài/kịch bản gần
   nhất trong `posts/` và `videos/`; không trùng chủ đề trong 4 tuần; không lặp kiểu hook/CTA của
   bài liền trước — chọn CTA từ "Ngân hàng CTA" trong `context/voice-analysis.md`).

3. **Dữ liệu xu hướng** (chỉ khi cần): nếu chủ đề là tin tức/luật mới mà file mới nhất trong
   `context/trends/` cũ hơn 7 ngày, chạy `node scripts/fetch-trends.js` (nguồn Google, khoảng
   0,1 USD) rồi đọc `context/trends.md`.

4. **Đọc ngữ cảnh & Quy tắc**:
   - Đọc `CLAUDE.md` (đặc biệt "Khối liên hệ chuẩn", "Quy tắc với chủ đề tranh cãi"),
     `context/business.md`, `context/profile.md`, `context/voice-analysis.md`, `context/matrix.md`.
   - Áp dụng giọng văn Vạn Xuân: gần gũi, thực tế, chính xác quy định, không cam kết lừa dối.
   - Chủ đề tranh cãi: trình bày hai phía, chốt bằng nguồn chính thức (dòng **Nguồn:** có link);
     không đủ dữ liệu để chốt thì dừng và hỏi.

5. **Soạn thảo bài viết & Đề xuất định dạng**:
   - Soạn full caption bài viết, kết thúc bằng **nguyên văn khối liên hệ chuẩn** trong
     `context/business.md` (không dùng số/địa chỉ/tên gọi kiểu cũ).
   - Đề xuất định dạng hiển thị (Carousel / Infographic / Ảnh thật).

6. **Tạm dừng xin duyệt (Quy tắc bắt buộc trong CLAUDE.md)**:
   - Trình bày tóm tắt bản thảo bài viết + các slide/định dạng đề xuất cho người dùng duyệt TRƯỚC khi soạn prompt ảnh.

7. **Soạn Prompt ảnh Gemini (Phương pháp 1)**:
   - Sau khi duyệt, viết prompt ảnh chi tiết cho từng slide/ảnh (tiếng Anh).
   - **BẮT BUỘC chừa vị trí Logo**: Mọi prompt PHẢI chứa câu: `Logo placement: reserve clean, empty space in the top-left corner for overlaying the official Vạn Xuân logo — do not generate any text or icons in top-left area.`

8. **Kiểm tra trước khi lưu**: chạy đủ checklist "Kiểm tra trước khi lưu bài" trong skill
   `content-ideation.md` (số ý khớp tiêu đề, câu chừa logo, ảnh không lộ thông tin cá nhân, ngày
   chưa qua, khối liên hệ khớp, không dấu `>`).

9. **Lưu trữ & Cập nhật**:
   - Tìm thư mục bài tiếp theo trong `posts/` (ví dụ `posts/bai-40/`).
   - Lưu file `noi-dung.md` dưới dạng **văn bản thuần copy-ready (KHÔNG dùng dấu `>` ở đầu dòng)**.
   - Lưu các file prompt ảnh (`slide-N-prompt.md` hoặc `anh-prompt.md`).
   - Nếu chủ đề lấy từ topic-bank: đổi trạng thái thành `đã dùng`, ghi đường dẫn bài vào "Đã dùng
     ở"; nếu chủ đề đã có video, ghi liên kết chéo bài ↔ video (xem skill `content-ideation.md`).
   - Hướng dẫn người dùng sau khi lưu ảnh từ Gemini về thì chạy `node scripts/apply-watermark.js posts/bai-XX/` để tự động ghép Logo Vạn Xuân.
   - Cập nhật `output/dashboard.md`.
