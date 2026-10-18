# Định hướng phát triển agent Vạn Xuân: đa nguồn, chủ đề tranh cãi, kịch bản TikTok/Reels

Ngày: 18/10/2026. Dựa trên [báo cáo đánh giá nội dung](danh-gia-noi-dung-agent.md) và mã nguồn `scripts/fetch-trends.js`, `context/trends.md`.

## 1. Hiện trạng phần thu thập xu hướng

`scripts/fetch-trends.js` chỉ gọi một actor `apify/google-search-scraper`, với 4 từ khóa, mỗi từ khóa lấy 5 kết quả, rồi ghi đè `context/trends.md`. Các vấn đề:

| Vấn đề | Hệ quả |
|---|---|
| Chỉ có Google, chỉ lấy tiêu đề và đoạn trích | Không biết người ta **đang bàn tán gì**, không có số view, like, bình luận |
| Từ khóa lệch đối tượng: "mẹo thi sa hình b2", "học lái xe ô tô", có lỗi chính tả "phó thọ" | Trung tâm chỉ dạy A1, A và cấp đổi, nhưng phần lớn kết quả lại về ô tô B2 |
| Kết quả chủ yếu là trang SEO của trung tâm khác ("Top 5 trung tâm…") | Agent học theo nội dung đối thủ thay vì học theo nhu cầu người học |
| Ghi đè file mỗi lần chạy | Không thấy chủ đề nào đang nóng lên hay nguội đi |
| Không lấy bình luận | Mất nguồn ý tưởng tốt nhất: câu hỏi và tranh cãi thật của người dùng |

**Đính chính cho báo cáo đánh giá:** `business.md` và bài 05 ghi A1 là "xe máy dưới 175cc". Theo Luật Trật tự, an toàn giao thông đường bộ 2024 (hiệu lực 01/01/2025), A1 là xe đến 125cc (hoặc động cơ điện đến 11 kW), còn A là trên 125cc. Mình viết theo trí nhớ, cần kiểm tra lại văn bản trước khi sửa bài.

## 2. Kiến trúc đề xuất: 3 tầng

```
[1. THU THẬP đa nguồn]  →  [2. CHẤM ĐIỂM & LỌC]  →  [3. SẢN XUẤT]
 Google / Google News       độ hot × độ tranh cãi      bài Fanpage (đang có)
 TikTok + bình luận         × độ liên quan × độ an toàn kịch bản TikTok/Reels (mới)
 Facebook group/page + BL   → context/topic-bank.md    bài Zalo (đang có)
 YouTube + bình luận
 Diễn đàn (otofun, voz)
```

Mỗi lần chạy lưu thành `context/trends/YYYY-MM-DD.json` (dữ liệu thô) và cập nhật `context/topic-bank.md` (danh sách chủ đề đã chấm điểm), thay vì ghi đè một file.

## 3. Tầng 1: nguồn thu thập qua Apify

| Nguồn | Actor Apify | Lấy gì | Dùng để |
|---|---|---|---|
| TikTok | `clockworks/tiktok-scraper` (tìm theo từ khóa, hashtag) | Video, view, like, số bình luận, lượt chia sẻ | Tìm video ngành đang lên, học hook và format |
| Bình luận TikTok | `clockworks/tiktok-comments-scraper` | Bình luận và trả lời của top video | Tìm câu hỏi, tranh cãi thật |
| Facebook group | `apify/facebook-groups-scraper` | Bài trong group công khai (group học lái xe, group địa phương Phú Thọ, group luật giao thông) | Nỗi lo của người học khu vực |
| Facebook page và bình luận | `apify/facebook-posts-scraper` + `apify/facebook-comments-scraper` | Bài và bình luận trên page báo (VnExpress, Dân trí, Báo Giao thông…) về luật GPLX | Phản ứng của dư luận với quy định mới |
| YouTube | `streamers/youtube-scraper` + `streamers/youtube-comments-scraper` | Video "thi bằng A1", bình luận | Câu hỏi dài, chi tiết hơn TikTok |
| Diễn đàn | `apify/website-content-crawler` trên otofun.net, voz.vn | Chủ đề thảo luận về thi bằng, luật mới | Tranh luận sâu, nhiều lập luận hai phía |
| Google, Google News | `apify/google-search-scraper` (giữ lại, sửa từ khóa) | Tin tức, văn bản luật | **Nguồn xác minh**, không phải nguồn ý tưởng |

Mã actor TikTok và Facebook đã đối chiếu trên Apify Store. Mã actor YouTube và website crawler là theo trí nhớ, cần kiểm tra lại trên Store trước khi viết code.

**Bộ từ khóa mới, đúng đối tượng** (thay cho 4 từ khóa cũ):
- Thi bằng: "thi bằng A1", "thi bằng lái xe máy", "thi A1 trượt", "sa hình A1", "thi bằng xe côn", "câu điểm liệt"
- Luật mới: "thông tư 108/2026", "bỏ thi mô phỏng", "11 tình huống thi xe máy", "bằng lái hết hạn", "trừ điểm bằng lái"
- Cấp đổi: "đổi bằng lái PET", "mất bằng lái làm lại", "bằng A1 cũ lái xe 150cc"
- Địa phương: "học lái xe Phú Thọ", "thi bằng lái Phú Thọ", "Vạn Xuân Phú Thọ"
- Hashtag TikTok: #thibanglaixe #thia1 #banglaixemay #sahinh #luatgiaothong

**Chi phí ước tính:** chạy mỗi tuần khoảng 200 video TikTok, 1.000 bình luận TikTok, 300 bài và bình luận Facebook, 200 bình luận YouTube thì vào khoảng 5–15 USD/tháng theo giá gói Starter. Gói Free có 5 USD tín dụng/tháng. Đây là ước tính, cần xem tab Pricing của từng actor.

## 4. Tầng 2: tìm và chấm điểm chủ đề tranh cãi

### Công thức chấm điểm (0–100)
```
Điểm = Độ hot (30) + Độ tranh cãi (30) + Độ liên quan Vạn Xuân (25) + Độ an toàn (15)
```
- **Độ hot:** view, tương tác so với trung bình cùng nguồn, tốc độ tăng so với lần chạy trước.
- **Độ tranh cãi:** tỷ lệ bình luận trên view cao (người ta muốn nói hơn là chỉ xem), nhiều chuỗi trả lời dài, có từ phản bác ("vô lý", "sai rồi", "làm khó dân", "tốn tiền", "ai bảo", "thật không"). Claude đọc mẫu 50–100 bình luận, phân loại **đồng ý / phản đối / hỏi thêm / kể trải nghiệm**. Chủ đề đáng làm là khi hai phe đồng ý và phản đối cùng lớn.
- **Độ liên quan:** chạm đến A1, A, cấp đổi, người học ở Phú Thọ. Chủ đề về ô tô B2 thì trừ điểm.
- **Độ an toàn:** có nguồn chính thức để chốt đúng sai không, có làm mất uy tín hay rủi ro pháp lý không.

### Ví dụ chủ đề tranh cãi hợp với Vạn Xuân (cần xác minh trước khi làm)
1. "Bỏ thi mô phỏng là dễ hơn hay khó hơn?"
2. "Thêm 11 tình huống thực hành cho xe máy: làm khó dân hay cần thiết?"
3. "Đi xe máy 10 năm rồi, còn cần đi học không, hay tự thi được?"
4. "Bằng A1 cũ có được lái xe 150cc không?" (nhiều người hiểu sai giới hạn mới 125cc)
5. "Bằng giấy cũ có bắt buộc đổi sang thẻ PET không?" (có nhiều tin đồn)
6. "Trung tâm 'bao đậu' có thật không, học phí rẻ bất thường có bẫy gì?"
7. "Thi xe ga hay xe côn: hạng A xe ga có lái được xe côn không?"
8. "Con 16–17 tuổi đi xe 50cc: bố mẹ có bị phạt không?"
9. "Học phí 1,2 triệu với 3 triệu khác nhau ở đâu?"

### Hàng rào an toàn cho chủ đề tranh cãi (thêm vào `CLAUDE.md`)
- Chỉ dùng tranh cãi để **giải thích và chốt bằng thông tin đã xác minh**, không tự tạo drama, không câu phẫn nộ bằng thông tin sai.
- Trình bày công bằng cả hai phía, kết luận dựa trên văn bản luật có dẫn nguồn.
- Không chê trung tâm khác, không châm chọc CSGT hay cơ quan nhà nước, không hướng dẫn lách luật.
- Không trích nguyên văn bình luận kèm tên, ảnh người dùng khi chưa xin phép.
- Chủ đề điểm an toàn dưới 8/15 thì đưa vào danh sách "cần người duyệt" thay vì tự sản xuất.

## 5. Tầng 3: agent kịch bản TikTok/Reels

### Lệnh và skill mới
- `/create-video-script [chủ đề | số trong topic-bank]` tạo 1 kịch bản. `/create-5-video` tạo 5 ý tưởng, **chờ duyệt** rồi mới viết chi tiết (giống quy tắc cứng của `/create-10-post`).
- Skill `video-scripting.md`: đọc `topic-bank.md`, `business.md`, `voice-analysis.md`, mục bình luận gốc của chủ đề, rồi viết kịch bản.
- Lưu tại `videos/video-XX/kich-ban.md`, mỗi video có kèm caption và hashtag cho TikTok và Reels.

### 7 format video phù hợp trung tâm lái xe
| Format | Mô tả | Ví dụ |
|---|---|---|
| Đúng hay sai? | Nêu một quan niệm phổ biến, thầy chốt | "Bằng A1 lái được xe 150cc. Đúng hay sai?" |
| Trả lời bình luận | Dùng tính năng reply comment của TikTok | "Có bạn hỏi đi xe 10 năm có cần học không…" |
| Thầy chấm lỗi (POV) | Quay học viên làm bài sa hình, thầy chỉ lỗi | "Lỗi này trượt ngay vòng số 8" |
| 1 phút luật mới | Tóm tắt một điểm luật, có nguồn | "Thông tư 108: thi lý thuyết A1 giờ thế nào?" |
| Hai phe tranh luận | Chia đôi màn hình, hai người đóng hai quan điểm, thầy chốt | "Bỏ mô phỏng: dễ hay khó?" |
| Hỏi nhanh ngoài sân | Hỏi học viên một câu luật | "Gặp biển này bạn làm gì?" |
| Hậu trường | Một ngày ở sân Thôn 18, ngày thi, nhận bằng | Dựng niềm tin, có người thật |

### Khung kịch bản chuẩn (30–60 giây)
```
TIÊU ĐỀ / CHỦ ĐỀ:      …
FORMAT:                 Đúng hay sai? | Trả lời bình luận | …
NGUỒN XÁC MINH:          link văn bản / báo
ĐIỂM TRANH CÃI:          phe A nghĩ…, phe B nghĩ…
HOOK (0–3s), 3 phương án:  1) …  2) …  3) …
BẢNG CẢNH:
| Thời gian | Hình ảnh quay | Lời thoại | Chữ trên màn hình | Âm thanh |
CTA cuối (5s):           câu hỏi mời bình luận + nhắc Zalo/hotline
CAPTION TikTok / Reels:   …
HASHTAG:                 …
GHI CHÚ QUAY:            địa điểm, ai đóng, đạo cụ, quay dọc 9:16
CHECKLIST:               nguồn đã xác minh · không cam kết đậu · không lộ thông tin học viên
```

### Kịch bản mẫu: "Bằng A1 lái được xe 150cc?"
| Thời gian | Hình ảnh | Lời thoại | Chữ trên màn hình |
|---|---|---|---|
| 0–3s | Thầy đứng cạnh xe 150cc ở sân tập | "Có bằng A1 rồi thì lái xe này được không?" | ĐÚNG HAY SAI? |
| 3–12s | Cắt nhanh 3 bình luận (đã che tên) | "Nhiều bạn bảo được, vì bằng A1 cũ ghi dưới 175 phân khối." | "Bằng tôi ghi 175cc mà?" |
| 12–30s | Thầy cầm thẻ bằng, chỉ vào xe | "Theo luật mới, A1 chỉ đến 125 phân khối. Xe trên 125 cần bằng A. Riêng bằng A1 cấp trước 2025 thì…" (chốt theo văn bản đã xác minh) | A1 ≤ 125cc · A > 125cc |
| 30–40s | Toàn cảnh sân tập hạng A | "Đi xe trên 125 thì nên học hạng A cho chắc." | NGUỒN: Luật TTATGTĐB 2024 |
| 40–45s | Thầy chỉ vào camera | "Bằng bạn ghi gì? Bình luận để thầy xem giúp." | Zalo 0823 279 999 |

(Mục 12–30s phải điền đúng quy định chuyển tiếp cho bằng A1 cấp trước 2025 sau khi xác minh.)

## 6. Lộ trình triển khai

| Giai đoạn | Việc làm | Kết quả |
|---|---|---|
| Tuần 1 | Sửa dữ liệu nền theo báo cáo đánh giá (`business.md`: học phí, hotline, địa chỉ, A1 125cc). Sửa từ khóa, thêm lưu lịch sử trong `fetch-trends.js` | Nền dữ liệu đúng |
| Tuần 2 | Thêm nguồn TikTok + bình luận và Facebook group/bình luận vào script. Viết bước chấm điểm, sinh `topic-bank.md` | 20–30 chủ đề có điểm và trích bình luận |
| Tuần 3 | Thêm lệnh `/create-video-script`, skill `video-scripting.md`, hàng rào an toàn. Viết thử 5 kịch bản, trung tâm quay 2–3 video | Video đầu tiên |
| Tuần 4 | Thêm YouTube, diễn đàn. Ghi số liệu từng video và bài vào `matrix.md`, cho agent ưu tiên format hiệu quả | Vòng phản hồi theo số liệu thật |

**Việc của trung tâm:** chọn 1–2 thầy cô chịu lên hình, danh sách group Facebook và page muốn theo dõi, ngân sách Apify mỗi tháng, và người duyệt chủ đề tranh cãi trước khi quay.

## Nguồn
- [TikTok Comments Scraper – Apify](https://apify.com/clockworks/tiktok-comments-scraper)
- [Best TikTok scrapers (mã actor, giá)](https://use-apify.com/docs/best-apify-actors/best-tiktok-scrapers)
- [Scrape Facebook với Apify (mã actor)](https://use-apify.com/docs/how-to-use-apify/scrape-facebook)
