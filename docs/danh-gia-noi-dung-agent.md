# Đánh giá nội dung agent Facebook – Đào tạo lái xe Vạn Xuân

Ngày đánh giá: 18/10/2026. Phạm vi: 39 bài trong `posts/` (bai-01 → bai-39), 49 prompt ảnh, `CLAUDE.md`, `context/`, `reference/brand-style.md`, 2 kế hoạch trong `plans/` và `output/dashboard.md`.
Thư mục `.claude/commands` và `.claude/skills` không có trong bản đồng bộ, nên chưa đánh giá được bản thân các lệnh `/create-10-post`, `/create-1-post`.

## 1. Kết luận nhanh

**Điểm tổng: 6,5/10.** Agent tuân thủ quy tắc rất tốt (không bịa số liệu, không cam kết đậu, giọng gần gũi), nhưng chính vì thiếu dữ liệu thật nên khoảng 1/3 số bài rỗng nội dung, lặp ý và chưa đủ sức thuyết phục người học bấm liên hệ.

| Tiêu chí | Điểm | Nhận xét ngắn |
|---|---|---|
| Tuân thủ quy tắc / an toàn pháp lý | 9/10 | Không có "bao đậu", luôn ghi chú "cần xác nhận lại". Vài chỗ còn sót (mục 4). |
| Giọng điệu | 8/10 | Đúng "mình – bạn", thân thiện, không sáo rỗng. Hơi đều đều, thiếu cảm xúc. |
| Thông điệp / giá trị cho người đọc | 5,5/10 | Bài mẹo tốt; bài FAQ thì phần lớn trả lời "tùy trường hợp, nhắn Zalo". |
| Phù hợp khách hàng học lái xe | 7/10 | Đúng nỗi lo (chi phí ẩn, lịch học, thi trượt). Chưa có câu chuyện, gương mặt thật. |
| CTA | 6/10 | Có ở mọi bài nhưng gần như một câu lặp lại, ít lý do để hành động ngay. |
| Tính nhất quán | 5/10 | Lệch số điện thoại, địa chỉ, tên gọi, thông tin học phí giữa các bài. |
| Hình ảnh / prompt | 6,5/10 | Bám bảng màu thương hiệu tốt; 30/49 prompt thiếu câu chừa góc logo bắt buộc. |

## 2. Điểm mạnh

1. **Kỷ luật dữ liệu rất tốt.** Agent từ chối bịa học phí, lịch khai giảng, câu chuyện học viên; hoãn các chủ đề "giới thiệu giáo viên", "câu chuyện học viên" vì chưa có dữ liệu (ghi rõ ở `output/dashboard.md`). Đây là nền tảng uy tín quan trọng cho ngành đào tạo lái xe.
2. **Không có cam kết sai luật.** Câu "Kết quả thi còn tùy luyện tập…" xuất hiện đều đặn; bài 33, 36 nói thẳng "không cam kết đậu".
3. **Bài mẹo thực hành có giá trị thật:** bài 01 (ôn lý thuyết), 02 (lỗi sa hình), 11 (lỗi thi lý thuyết), 19 (giữ thăng bằng), 25 (điểm liệt), 22 (tâm lý trước thi). Ngắn, cụ thể, làm theo được ngay.
4. **Chất lượng tăng rõ theo thời gian.** Bài 36 (một buổi học) và 39 (đăng group cộng đồng) là hai bài tốt nhất: có hình ảnh cụ thể ("cô giáo đứng ngay cạnh"), có số liệu thật (học phí từ 1.200.000đ, 4,8/5 Google Maps), có lời kêu gọi tag người quen. Bài 38 (khảo sát Zalo kèm bình chọn) là cách dùng nội dung để lấy dữ liệu rất thông minh.
5. **Có hệ thống:** kế hoạch theo tuần, dashboard theo dõi trạng thái, ghi chú nguồn, cảnh báo ảnh trùng, cảnh báo ảnh lộ thông tin học viên (bài 39 nhắc `VanPhong.jpg`).
6. **Prompt ảnh mô tả thương hiệu chi tiết** (mã màu #0E3970 / #048DD1 / #E4661F, bố cục chéo, thanh liên hệ cam), giúp ảnh Gemini ra đồng bộ.

## 3. Điểm yếu chính

### 3.1. Bài FAQ "rỗng" – lỗi lớn nhất
Bài 06, 14, 15, 16, 17, 20 (và một phần 07, 08) có cùng một khuôn: đặt câu hỏi → "tùy trường hợp / đang cập nhật" → "nhắn Zalo". Ví dụ bài 17: *"Phụ thuộc tiến độ học của từng người và lịch tổ chức thi — không có mốc cố định chung."*
Người đọc không nhận được gì, dễ cảm thấy trung tâm né tránh, trái ngược thông điệp "minh bạch". **Nguyên nhân gốc:** `context/business.md` còn trống học phí, thời gian đào tạo, giờ làm việc, lịch khai giảng; agent làm đúng khi không bịa, nhưng nên dừng lại hỏi thay vì vẫn xuất bài.

### 3.2. Lặp chủ đề và lặp câu chữ
- Mẹo thi lý thuyết xuất hiện ở 7 bài (01, 11, 12, 22, 25, 30, 36); giữ thăng bằng ở 3 bài (19, 24, 36); checklist hồ sơ ở 3 bài (03, 29, 32); lịch cho người đi làm ở 2 bài (15, 16).
- Câu CTA *"📌 Cần tư vấn thêm, nhắn Zalo OA hoặc để lại bình luận nhé"* lặp khoảng 10 lần; *"minh bạch học phí, không phát sinh chi phí ẩn"* lặp ở 08, 10, 23, 27, 29. Người theo dõi Fanpage sẽ thấy bài na ná nhau.

### 3.3. Thiếu yếu tố con người và bằng chứng xã hội
Chưa có bài nào có tên giáo viên, học viên thật, lời trích, ảnh trước–sau. Số liệu có sẵn trong `business.md` ("hơn 500 học viên", "tỉ lệ đỗ trên 90%", "hoạt động từ 2023") chưa được dùng ở bài nào. Với khách học lái xe (đặc biệt phụ huynh của nhóm 18 tuổi), niềm tin đến từ người thật, kết quả thật.

### 3.4. CTA yếu và đơn điệu
CTA gần như luôn là "nhắn Zalo". Thiếu: lý do hành động ngay (ngày thi, số suất, ưu đãi có thật), lời mời tương tác để Facebook phân phối bài (hỏi ý kiến, mời bình luận câu hỏi, tag bạn bè). Chỉ bài 37, 39 có kêu gọi tag.

### 3.5. Thiếu nhất quán thông tin thương hiệu
| Mục | Các phiên bản đang xuất hiện |
|---|---|
| Số điện thoại | 0823279999 (đa số) · 0823.279.999 – 0978.639.199 (34, 35, 38) · chỉ 0978 639 199 (39) |
| Địa chỉ | Số 21, Khu 21 (`business.md`) · Thôn 18 (35) · Nhà văn hóa thôn 18 (39) |
| Tên gọi | "Trung tâm đào tạo lái xe Phú Thọ – chi nhánh Vạn Xuân" · "Văn phòng đào tạo lái xe Vạn Xuân" (39) |
| Học phí | "đang cập nhật, liên hệ báo giá" (08, 20, 27) · "từ 1.200.000đ" (39) |
| Hashtag | Không có ở bài 01–33, có từ bài 34, mỗi bài một bộ khác nhau |
| Xưng hô | "mình" (đa số) · "chúng tôi" (37) · "văn phòng" (39) |

## 4. Rủi ro cần xử lý trước khi đăng

1. **Bài 21 hứa "5 điểm mới" nhưng chỉ có 4 slide nội dung** (slide 2–5). Cần thêm 1 điểm (ví dụ "phải đỗ lý thuyết mới được thi thực hành", có trong `context/trends.md` mục 38) hoặc sửa thành "4 điểm".
2. **Bài 21, slide 3–4 (bằng hết hạn 30 ngày – dưới 1 năm / từ 1 năm trở lên):** không tìm thấy nguồn trong `context/trends.md`. Cần xác minh theo Thông tư 108/2026/TT-BCA trước khi đăng.
3. **Bài 06 mâu thuẫn bài 21:** bài 06 nói "tùy thời gian hết hạn", bài 21 lại nêu quy định cụ thể. Cập nhật bài 06 sau khi xác minh.
4. **Bài 31 ghi giấy khám sức khỏe "thường khoảng 6 tháng":** theo mình nhớ, Thông tư 36/2024/TT-BYT quy định 12 tháng. Đây là suy luận, cần kiểm tra lại.
5. **Bài 30 "600 câu cho 15 hạng":** số câu có thể đã đổi theo Thông tư 108/2026 (trends ghi A/A1 tăng lên 40 câu/đề). Cần kiểm tra.
6. **Bài 07 dùng ảnh `VanPhong.jpg`,** trong khi bài 39 tự cảnh báo ảnh này lộ biên bản kết quả sát hạch có ảnh và họ tên học viên. Đổi ảnh hoặc che thông tin.
7. **Bài 32–35 đã quá ngày:** lịch thi 12, 15, 16/10 đã qua (hôm nay 18/10). Nếu chưa đăng thì bỏ. Bài 33 còn viết "lịch thi tháng 10… sẽ thông báo ngay khi có", mâu thuẫn với bài 34 đã công bố ngày.
8. **Một số khẳng định chưa có nguồn:** bài 13 "giao diện thi giống hệt lúc thi thật", bài 26 "Vạn Xuân vẫn lồng ghép luyện phản xạ tình huống vào chương trình", bài 33 "mỗi đợt nhận số lượng vừa đủ để giáo viên kèm sát". Cần trung tâm xác nhận.
9. **30/49 prompt ảnh (bài 01, 02, 05, 10, 11, 14, 15, 17, 19, 20, 21) thiếu câu bắt buộc** *"Logo placement: reserve clean, empty space in the top-left corner…"*. Một số còn yêu cầu Gemini vẽ "small logo mark", dễ ra logo sai. Bổ sung câu này trước khi tạo ảnh.
10. **Bài 37 (tuyển dụng)** dùng 💰 🎁, trái với `voice-analysis.md` mục 4. Với bài tuyển dụng có thể chấp nhận, nhưng nên quyết định rõ để agent không áp dụng lan sang bài khác.

## 5. Đề xuất cải thiện

### Việc của trung tâm (quan trọng nhất, agent không tự làm được)
1. **Điền dữ liệu thật vào `context/business.md`:** học phí từng hạng (đã có "từ 1.200.000đ"), thời gian khóa học, giờ làm việc, địa chỉ văn phòng và sân tập chính thức, hotline chính thức, tên gọi chính thức. Chỉ riêng việc này sẽ biến 6–8 bài FAQ rỗng thành bài hữu ích.
2. **Cung cấp 3–5 câu chuyện thật:** tên/ảnh giáo viên, học viên đã đỗ (có xin phép), ảnh nhận bằng, ảnh buổi thi, đánh giá Google Maps chụp màn hình.
3. **Điền `context/matrix.md` và `strategy.md`:** số follower, bài nhiều tương tác nhất, mục tiêu quý. Agent sẽ biết nên viết nhiều loại bài nào.
4. **Bỏ vào `reference/copywriting-samples/` 5–10 bài** viral của ngành hoặc bài tốt nhất từng đăng. Hiện thư mục trống nên agent không có mẫu để học hook/cấu trúc.

### Việc chỉnh trong agent (`CLAUDE.md`, `voice-analysis.md`, các lệnh)
1. **Quy tắc "không đủ dữ liệu thì không xuất bài":** nếu câu trả lời FAQ chỉ là "tùy trường hợp", agent phải hỏi người dùng hoặc đổi chủ đề thay vì vẫn viết.
2. **Ngân hàng 6–8 kiểu CTA xoay vòng**, ví dụ: hỏi ý kiến ("Bạn đang ôn tới phần nào rồi? Bình luận để thầy cô gợi ý"), tag bạn bè, giữ suất theo ngày thi thật, đăng ký học thử, nhận tài liệu điểm liệt qua Zalo.
3. **Khối thông tin liên hệ chuẩn** (1 tên gọi, 1–2 số điện thoại, 1 địa chỉ, 1 bộ hashtag cố định) đặt trong `business.md` và bắt buộc chèn nguyên văn.
4. **Kiểm tra trùng lặp trước khi viết:** đọc tiêu đề 15 bài gần nhất, không cho trùng chủ đề trong 4 tuần, không dùng cùng câu mở/CTA ở 2 bài liên tiếp.
5. **Kiểm tra tự động trước khi lưu bài:** đếm số ý khớp tiêu đề ("5 điểm" thì đủ 5), prompt ảnh có câu chừa logo, ảnh không lộ thông tin cá nhân, ngày nhắc tới chưa qua.
6. **Thêm định dạng mới:** video ngắn/Reels (kịch bản 30 giây quay sân sa hình), "Đúng hay sai?" (đố luật, kéo bình luận), mini-series "Hỏi thầy" theo tuần, bài đếm ngược ngày thi.
7. **Dùng nhiều hơn những gì đã chứng minh hiệu quả:** mô tả cảnh thật như bài 36, đăng group cộng đồng như bài 39, bình chọn như bài 38.

## 6. Bài nên dùng ngay, sửa, hoặc bỏ

| Nhóm | Bài |
|---|---|
| Đăng được ngay | 01, 02, 11, 19, 22, 23, 25, 36, 38, 39 |
| Sửa rồi đăng | 21 (thiếu điểm thứ 5, xác minh hết hạn), 30 (số câu), 31 (thời hạn giấy khám), 07 (đổi ảnh), 13 và 26 (xác nhận khẳng định), 27, 29 |
| Viết lại khi có dữ liệu | 06, 08, 14, 15, 16, 17, 20 |
| Chỉ dùng cho Zalo | 12, 24 (bản rút gọn của 11, 19, không đăng lại lên Fanpage) |
| Bỏ | 32–35 (quá ngày thi), trừ khi chưa đăng và đổi thành thông báo đợt sau |
