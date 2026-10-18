# /create-10-post

Khi người dùng gõ lệnh này:

1. Đọc toàn bộ `CLAUDE.md` và `context/` để nắm giọng văn, quy tắc.
2. Chạy lệnh `node scripts/fetch-trends.js` để Apify tự động cào tin tức & luật giao thông mới nhất từ internet vào `context/trends.md`.
3. Áp dụng skill `content-ideation.md` để lên 10 ý tưởng dựa trên `context/trends.md`, KHÔNG trùng chủ đề đã có trong `posts/`.
4. Áp dụng skill `viral-replication.md` để viết full nội dung cho 10 bài theo đúng giọng Vạn Xuân.
4. Với mỗi bài, đề xuất định dạng: ảnh thật có sẵn trong `context/image/` / infographic AI / carousel (dùng skill `carousel-creation.md` nếu chọn carousel).
5. **DỪNG LẠI** — trình bày bảng tóm tắt 10 bài (chủ đề + định dạng đề xuất) và hỏi người dùng xác nhận/điều chỉnh TRƯỚC khi viết prompt ảnh.
6. Sau khi người dùng xác nhận, viết **prompt tạo ảnh cho Gemini** cho từng bài cần ảnh AI (tham
   chiếu `reference/infographic-samples/` hoặc `reference/carousel-samples/` để mô tả đúng màu/
   phông/layout brand trong prompt) — KHÔNG gọi API tạo ảnh, chỉ soạn prompt để người dùng tự dán
   vào Gemini.
7. Lưu từng bài vào `posts/bai-XX/`: nội dung bài viết + prompt ảnh (`anh-prompt.md`, hoặc
   `slide-N-prompt.md` mỗi slide nếu là carousel).
8. Cập nhật `output/` với bảng tổng hợp tất cả các bài vừa tạo để dễ xem/duyệt.
