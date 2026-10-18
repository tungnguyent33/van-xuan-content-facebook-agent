# /create-1-post

Yêu cầu người dùng (nếu có): $ARGUMENTS

Khi người dùng thực hiện lệnh `/create-1-post` hoặc `/create-post`:

1. **Xác định chủ đề bài viết**:
   - Nếu người dùng có truyền tham số/chủ đề trong lệnh (`$ARGUMENTS`): Dùng ngay chủ đề "$ARGUMENTS" để viết bài.
   - Nếu KHÔNG truyền tham số: Đọc file kế hoạch mới nhất trong `plans/` (ví dụ `plans/ke-hoach-2026-09-13.md`), tự chọn bài tiếp theo chưa làm trong `posts/`.

2. **Cập nhật dữ liệu xu hướng mới nhất từ Apify**:
   - Chạy lệnh terminal: `node scripts/fetch-trends.js`
   - Đọc file `context/trends.md` để lấy tin tức, luật giao thông và bài viết hot cào thực tế từ Apify.

3. **Đọc ngữ cảnh & Quy tắc**:
   - Đọc `CLAUDE.md`, `context/business.md`, `context/profile.md`, `context/voice-analysis.md`.
   - Áp dụng giọng văn Vạn Xuân: gần gũi, thực tế, chính xác quy định, không cam kết lừa dối.

4. **Soạn thảo bài viết & Đề xuất định dạng**:
   - Soạn full caption bài viết (nút bấm, hotline 0823279999, hashtag).
   - Đề xuất định dạng hiển thị (Carousel / Infographic / Ảnh thật).

5. **Tạm dừng xin duyệt (Quy tắc bắt buộc trong CLAUDE.md)**:
   - Trình bày tóm tắt bản thảo bài viết + các slide/định dạng đề xuất cho người dùng duyệt TRƯỚC khi soạn prompt ảnh.

6. **Soạn Prompt ảnh Gemini (Phương pháp 1)**:
   - Sau khi duyệt, viết prompt ảnh chi tiết cho từng slide/ảnh (tiếng Anh).
   - **BẮT BUỘC chừa vị trí Logo**: Mọi prompt PHẢI chứa câu: `Logo placement: reserve clean, empty space in the top-left corner for overlaying the official Vạn Xuân logo — do not generate any text or icons in top-left area.`

7. **Lưu trữ & Cập nhật**:
   - Tìm thư mục bài tiếp theo trong `posts/` (ví dụ `posts/bai-23/`).
   - Lưu file `noi-dung.md` dưới dạng **văn bản thuần copy-ready (KHÔNG dùng dấu `>` ở đầu dòng)**.
   - Lưu các file prompt ảnh (`slide-N-prompt.md` hoặc `anh-prompt.md`).
   - Hướng dẫn người dùng sau khi lưu ảnh từ Gemini về thì chạy `node scripts/apply-watermark.js posts/bai-XX/` để tự động ghép Logo Vạn Xuân.
   - Cập nhật `output/dashboard.md`.
