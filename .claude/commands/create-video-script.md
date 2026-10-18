# /create-video-script

Yêu cầu người dùng: $ARGUMENTS

Viết 1 kịch bản TikTok/Reels (9:16, 30–60 giây).

1. **Xác định chủ đề** từ `$ARGUMENTS`:
   - Là số (vd. `3`) → chủ đề số đó trong `context/topic-bank.md`.
   - Là chữ → tìm chủ đề khớp nhất trong topic-bank; nếu không có, dùng đúng chủ đề người dùng
     đưa và ghi "ngoài topic-bank".
   - Trống → chọn chủ đề điểm cao nhất có trạng thái `mới` và gợi ý format "video".
   - Chủ đề `cần duyệt` → dừng, báo lý do, hỏi người dùng (theo "Quy tắc với chủ đề tranh cãi").
2. Đọc `CLAUDE.md`, `context/business.md`, `context/voice-analysis.md`, `context/matrix.md`, mục
   chủ đề trong topic-bank, và các kịch bản đã có trong `videos/` (không lặp hook/CTA của video gần
   nhất).
3. Kiểm tra nguồn: mở/đối chiếu nguồn chính thức ghi trong topic-bank (tìm thêm trên web nếu
   cần, ghi link). Không đủ dữ liệu để chốt → dừng và hỏi người dùng.
4. Áp dụng skill `video-scripting.md`, viết đủ các mục của khung kịch bản.
5. Lưu tại `videos/video-XX/kich-ban.md` — `XX` là số tiếp theo (2 chữ số) sau thư mục lớn nhất
   trong `videos/`.
6. Cập nhật `context/topic-bank.md`: đổi trạng thái chủ đề thành `đã dùng`, ghi
   `videos/video-XX/kich-ban.md` vào dòng "Đã dùng ở" (cả trong bảng và mục chi tiết). Nếu chủ đề
   đã có bài Fanpage, ghi liên kết chéo hai chiều (dòng "Bài Fanpage liên quan" trong kịch bản và
   dòng "Video liên quan" trong `posts/bai-XX/noi-dung.md` — đặt ở phần ghi chú cuối file, ngoài
   phần copy-ready).
7. Tự kiểm tra checklist trong kịch bản (khối liên hệ khớp từng ký tự với `business.md`), rồi cho
   người dùng xem tóm tắt: hook đề xuất, bảng cảnh, việc cần người dùng xác minh.
