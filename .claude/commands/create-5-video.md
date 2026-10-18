# /create-5-video

Yêu cầu người dùng (nếu có): $ARGUMENTS

Sản xuất 5 kịch bản TikTok/Reels từ topic-bank, có bước duyệt.

1. Đọc `CLAUDE.md`, `context/topic-bank.md`, `context/matrix.md`, `context/business.md` và tiêu đề
   các kịch bản trong `videos/` + 15 bài gần nhất trong `posts/` (không trùng chủ đề đã làm trong
   4 tuần, không lặp hook/CTA của video gần nhất).
2. Chọn 5 ý tưởng từ chủ đề trạng thái `mới`, ưu tiên điểm cao và format đang hiệu quả trong
   `matrix.md`; đa dạng format (không quá 2 video cùng format). Bỏ chủ đề `cần duyệt`.
3. Trình bày bảng: # | Chủ đề (số topic-bank) | Format | Hook đề xuất | Lý do chọn | Nguồn chốt.
4. **DỪNG LẠI** — chờ người dùng duyệt/chỉnh danh sách. Đây là quy tắc cứng, giống bước duyệt của
   `/create-10-post`: không viết kịch bản chi tiết khi chưa có xác nhận.
5. Sau khi duyệt, với từng ý tưởng làm đúng các bước 3–7 của `/create-video-script` (skill
   `video-scripting.md`), lưu `videos/video-XX/kich-ban.md` (tự tăng số), đánh dấu `đã dùng` trong
   topic-bank.
6. Cuối cùng liệt kê 5 đường dẫn kịch bản và danh sách việc người dùng cần làm trước khi quay
   (xác minh nguồn, chọn người lên hình...).
