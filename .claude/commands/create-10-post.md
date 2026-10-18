# /create-10-post

Khi người dùng gõ lệnh này:

1. Đọc toàn bộ `CLAUDE.md` và `context/` để nắm giọng văn, quy tắc (đặc biệt "Khối liên hệ chuẩn",
   "Quy tắc với chủ đề tranh cãi", `context/topic-bank.md`, `context/matrix.md`).
2. Dữ liệu xu hướng: nếu file mới nhất trong `context/trends/` cũ hơn 7 ngày, chạy
   `node scripts/fetch-trends.js` (nguồn Google, khoảng 0,1 USD). Muốn thu thập đa nguồn và chấm
   lại chủ đề tranh cãi thì đề nghị người dùng chạy `/find-topics` trước (tốn tín dụng hơn).
3. Áp dụng skill `content-ideation.md` để lên 10 ý tưởng: **ưu tiên chủ đề `mới` điểm cao trong
   `context/topic-bank.md`**, rồi mới tới `context/trends.md` và nhóm chủ đề cốt lõi; đọc 15 bài/kịch
   bản gần nhất trong `posts/` và `videos/` để không trùng chủ đề trong 4 tuần, không lặp kiểu
   hook/CTA ở 2 bài liên tiếp (CTA xoay vòng từ "Ngân hàng CTA" trong `voice-analysis.md`).
4. Áp dụng skill `viral-replication.md` để viết full nội dung cho 10 bài theo đúng giọng Vạn Xuân.
5. Với mỗi bài, đề xuất định dạng: ảnh thật có sẵn trong `context/image/` / infographic AI / carousel (dùng skill `carousel-creation.md` nếu chọn carousel).
6. **DỪNG LẠI** — trình bày bảng tóm tắt 10 bài (chủ đề + số topic-bank + định dạng đề xuất + kiểu
   CTA) và hỏi người dùng xác nhận/điều chỉnh TRƯỚC khi viết prompt ảnh.
7. Sau khi người dùng xác nhận, viết **prompt tạo ảnh cho Gemini** cho từng bài cần ảnh AI (tham
   chiếu `reference/infographic-samples/` hoặc `reference/carousel-samples/` để mô tả đúng màu/
   phông/layout brand trong prompt) — KHÔNG gọi API tạo ảnh, chỉ soạn prompt để người dùng tự dán
   vào Gemini.
8. Chạy checklist "Kiểm tra trước khi lưu bài" của skill `content-ideation.md` cho từng bài.
9. Lưu từng bài vào `posts/bai-XX/`: nội dung bài viết + prompt ảnh (`anh-prompt.md`, hoặc
   `slide-N-prompt.md` mỗi slide nếu là carousel). Chủ đề lấy từ topic-bank → đổi trạng thái
   `đã dùng`, ghi đường dẫn, liên kết chéo với video nếu có.
10. Cập nhật `output/` với bảng tổng hợp tất cả các bài vừa tạo để dễ xem/duyệt.
