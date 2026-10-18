# Hướng dẫn sử dụng agent content Vạn Xuân

Dành cho người không biết code. Mọi việc đều làm bằng cách mở Claude Code trong thư mục
`van-xuan-content-facebook-agent` rồi gõ lệnh bắt đầu bằng dấu `/`.

## Chuẩn bị (làm một lần)
1. Cài Node.js, mở terminal trong thư mục dự án, gõ `npm install`.
2. Copy file `.env.example` thành `.env`, điền `APIFY_API_TOKEN` (lấy ở apify.com → Settings →
   API & Integrations). Không gửi file `.env` cho ai, không đưa lên GitHub.
3. Điền những chỗ còn để tạm:
   - `config/trend-sources.json`, nguồn `facebook`: danh sách group công khai và page muốn theo dõi
     (hiện đang để tạm 1 group "ôn thi GPLX" và page VnExpress).
   - `config/own-channels.json`: tên kênh TikTok của trung tâm khi đã có.

## Mỗi tuần làm gì
| Bước | Gõ lệnh | Claude làm gì | Bạn cần làm |
|---|---|---|---|
| 1. Tìm chủ đề | `/find-topics` | Hỏi bạn có thu thập mới không (tốn tiền Apify), rồi chấm điểm chủ đề, cập nhật `context/topic-bank.md` | Trả lời có/không; xem chủ đề "cần duyệt", đổi trạng thái nếu đồng ý làm |
| 2. Lên kế hoạch | `/create-plan` | Xếp lịch 4 tuần từ topic-bank, cả bài và video | Xem file trong `plans/` |
| 3. Viết bài | `/create-10-post` hoặc `/create-1-post` | Đề xuất danh sách bài + định dạng, **dừng chờ bạn duyệt**, rồi viết bài và prompt ảnh | Duyệt danh sách; dán prompt vào Gemini tạo ảnh, lưu ảnh vào `posts/bai-XX/`, chạy `npm run watermark -- posts/bai-XX/` để ghép logo |
| 4. Viết kịch bản video | `/create-5-video` hoặc `/create-video-script 3` | Đề xuất 5 ý tưởng, **dừng chờ duyệt**, rồi viết kịch bản vào `videos/video-XX/kich-ban.md` | Duyệt; kiểm tra nguồn luật; chọn thầy cô lên hình, quay theo bảng cảnh |
| 5. Đăng bài | (tự đăng) | — | Copy phần "Nội dung bài đăng" lên Fanpage/Zalo; caption video lên TikTok/Reels |
| 6. Xem hiệu quả | `/review-performance` | Lấy số liệu fanpage/TikTok, cập nhật `context/matrix.md`, ghi khuyến nghị vào `context/strategy.md` | Đọc khuyến nghị; lần lên ý tưởng sau Claude tự ưu tiên cái hiệu quả |

Lệnh khác: `/init-context` (chỉ chạy khi khởi tạo lại dữ liệu nền).

## Quy tắc Claude luôn giữ
- Không cam kết "bao đậu", không chê trung tâm khác, không châm chọc CSGT hay cơ quan nhà nước,
  không hướng dẫn lách luật.
- Chủ đề tranh cãi phải trình bày hai phía và chốt bằng văn bản chính thức có link. Không đủ dữ
  liệu thì Claude hỏi bạn hoặc đổi chủ đề, không viết "tùy trường hợp, liên hệ".
- Chủ đề "cần duyệt" trong topic-bank không được tự làm cho tới khi bạn đổi trạng thái.
- Mọi bài và caption video kết thúc bằng khối liên hệ chuẩn trong `context/business.md`. Đổi số
  điện thoại/địa chỉ thì chỉ sửa ở đó.
- Bình luận lấy từ mạng đã được che tên; khi đưa lên video phải che cả tên và ảnh đại diện.

## Chi phí Apify dự kiến
Giá đo từ các lần chạy thử ngày 18/10/2026 (gói Free; gói trả phí rẻ hơn 20–50%).

| Việc | Khi nào chạy | Chi phí mỗi lần |
|---|---|---|
| Google (nguồn đang bật mặc định) | Khi dữ liệu cũ hơn 7 ngày, các lệnh viết bài tự chạy | khoảng 0,08 USD |
| TikTok + bình luận (220 video, 10 video lấy bình luận) | Trong `/find-topics` khi bạn đồng ý | khoảng 1,5–1,9 USD |
| Facebook group/page + bình luận (2 nơi × 30 bài) | như trên | khoảng 0,9 USD |
| YouTube + bình luận (70 video, 5 video lấy bình luận) | như trên | khoảng 0,7 USD |
| Diễn đàn otofun/voz (28 tìm kiếm, đọc 10 chủ đề) | như trên | khoảng 0,2 USD |
| **Thu thập đầy đủ mọi nguồn** (`--source=all`) | 1 lần/tuần | **khoảng 3,3–3,8 USD** |
| Số liệu fanpage/TikTok của trung tâm | `/review-performance` | khoảng 0,05–0,3 USD |

- Chạy đầy đủ mỗi tuần: khoảng **14–16 USD/tháng**, vượt mức 5 USD/tháng của gói Free. Cách tiết
  kiệm: chạy đầy đủ 2 tuần/lần (khoảng 7–8 USD/tháng), hoặc giảm `max_results_per_keyword` của
  TikTok từ 10 xuống 5 (còn khoảng 2–2,5 USD/lần).
- Mỗi nguồn có trần chi phí `max_charge_usd` trong `config/trend-sources.json`; chạm trần thì
  Apify tự dừng, không tính thêm.
- Chi phí từng lần chạy được in ra màn hình và lưu trong mục `runs` của file
  `context/trends/<ngày>.json`.
- Lần chạy thử ngày 18/10/2026 (tất cả nguồn ở mức thấp) tốn 1,04 USD, thu 335 mục.

## Thư mục quan trọng
- `context/topic-bank.md`: danh sách chủ đề đã chấm điểm, trạng thái từng chủ đề.
- `posts/bai-XX/`: bài viết + prompt ảnh. `videos/video-XX/`: kịch bản video.
- `output/dashboard.md`: bảng tổng hợp các bài để duyệt.
- `context/matrix.md`: số liệu hiệu quả thật.
