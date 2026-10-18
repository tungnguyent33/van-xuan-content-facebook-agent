# Voice Analysis — Giọng văn cho Bài viết Facebook

> **Trạng thái: nháp ban đầu.** File này được xây dựng từ mục "Giọng điệu bắt buộc" và
> "Điểm khác biệt" trong `CLAUDE.md` / `context/business.md`, VÌ CHƯA có dữ liệu bài đăng thật
> (chưa chạy Apify scrape Fanpage, chưa có bài mẫu dán tay). Khi có bài đăng thật, chạy lại
> `/init-context` để Claude phân tích và **thay thế** các con số/quy tắc bên dưới bằng số liệu đo
> được thật (độ dài câu trung bình thật, tần suất emoji thật...) thay vì giữ nguyên bản nháp này.

## 1. Mức độ trang trọng
Thân thiện – trung lập, giống người quen làm ở trung tâm tư vấn trực tiếp, không phải fanpage doanh nghiệp nói giọng hành chính. Không dùng "kính gửi", "quý khách hàng thân mến". Không suồng sã kiểu ngôn ngữ giới trẻ/teencode, vì đối tượng có cả nhóm 25+ đi đổi bằng.

## 2. Xưng hô
- Xưng "mình" (đại diện trung tâm), gọi người đọc là "bạn".
- Khi kể chuyện học viên có thể chuyển sang xưng tên/vai trò cụ thể ("anh Long — học viên hạng B2").

## 3. Độ dài câu & đoạn (áp dụng cho Facebook, đọc trên di động)
- Câu ngắn, mỗi câu 1 ý. Tránh câu ghép nhiều mệnh đề.
- Đoạn tối đa 2–3 dòng rồi xuống dòng — không viết thành khối chữ dài.
- Bài viết Facebook thường: 80–150 chữ cho bài ngắn (mẹo nhanh, FAQ), 150–250 chữ cho bài có câu chuyện/giải thích luật.

## 4. Emoji
- Dùng tiết chế: 1 emoji mở đầu hook (tuỳ chọn) + 2–4 emoji đánh dấu ý trong bài (không trang trí cuối mỗi câu).
- Emoji nên mang nghĩa chức năng, không phải trang trí: ✅ (mẹo/đúng), ⚠️ (cảnh báo/lỗi hay gặp), 📌 (lưu ý quan trọng), 📅 (lịch/thời gian).
- Tránh: emoji cảm xúc quá đà (😍🥰), icon tiền/chiến thắng kiểu quảng cáo (💰🔥🎉) — không hợp giọng "minh bạch, không sáo rỗng".

## 5. Cụm từ đặc trưng nên lặp lại (xây bản sắc thương hiệu)
- "đồng hành cùng bạn từ ngày đăng ký tới khi nhận bằng"
- "minh bạch học phí — không phát sinh chi phí ẩn"
- "cập nhật đúng quy định hiện hành" (khi nói về luật/lệ phí)
- Ký tên cuối bài: dùng **khối liên hệ chuẩn** trong `business.md` (dòng đầu "— Văn phòng đào tạo lái xe Vạn Xuân"), không dùng kiểu ký tên cũ.

## 6. Cụm từ / giọng điệu PHẢI tránh (đồng bộ với `CLAUDE.md`)
- "bao đậu", "chắc chắn đậu 100%", "học nhanh không cần thi lý thuyết"
- So sánh hạ thấp trung tâm khác
- Ngôn ngữ quảng cáo sáo rỗng kiểu "ưu đãi khủng", "duy nhất hôm nay", "số lượng có hạn" (trừ khi là thông tin lịch khai giảng có thật)
- Số liệu/quy định chưa xác minh — nếu không chắc, viết "cần xác nhận lại quy định mới nhất" thay vì bịa

## 7. Hook (câu mở đầu) ưu tiên
Chọn 1 trong 3 kiểu tùy chủ đề:
1. **Tình huống thật**: "Chuẩn bị thi mà tay cứ run, sợ quên bài — bạn có giống vậy không?"
2. **Cảnh báo định tính** (không bịa số liệu %): "Phần lớn học viên hay mất điểm ở đúng bài này..."
3. **Câu hỏi trực tiếp**: "Biết đổi bằng giấy sang thẻ PET cần giấy tờ gì chưa?"

## 8. Cấu trúc thân bài theo từng dạng nội dung

**Kinh nghiệm thi hạng bằng**
Hook (tình huống lo lắng) → 2–3 mẹo cụ thể, thực hành được ngay → nhắc nhẹ "kết quả còn tùy luyện tập, trung tâm chỉ đồng hành hỗ trợ" (không cam kết đậu) → CTA nhẹ.

**Lỗi hay bị trừ điểm khi thi sát hạch**
Hook cảnh báo → liệt kê lỗi (2–4 gạch đầu dòng) → cách khắc phục từng lỗi → CTA.

**Thay đổi quy định/luật giao thông**
Hook thời sự ngắn → nội dung thay đổi, viết đúng những gì đã xác minh → ảnh hưởng thực tế đến người học/người lái → câu chốt "cần xác nhận lại quy định mới nhất" nếu có phần chưa chắc chắn.

**Câu chuyện học viên**
Trước (khó khăn ban đầu) → Trong (quá trình học, có thể trích lời học viên) → Sau (kết quả) → 1 câu bài học/thông điệp chung.

**Giới thiệu giáo viên / cơ sở vật chất**
Mô tả ngắn, cụ thể, dùng ảnh thật trong `context/image/` — nêu điểm khác biệt thật, không thổi phồng ("giàu kinh nghiệm" cần đi kèm chi tiết cụ thể nếu có, không thì bỏ qua thay vì nói chung chung).

**Giải đáp câu hỏi thường gặp (FAQ)**
Câu hỏi học viên hay hỏi thật (lấy từ `business.md` mục FAQ) → trả lời ngắn gọn, đúng trọng tâm → nếu chưa có số liệu chính xác (VD học phí), ghi rõ "liên hệ trung tâm để có báo giá chính xác", không bịa số.

## 9. Kết bài / CTA
Nhẹ nhàng, không thúc ép kiểu "chốt đơn ngay". Ưu tiên dẫn về kênh đã có trong `strategy.md`:
- "Cần tư vấn thêm, nhắn Zalo OA hoặc để lại bình luận nhé."
- "Theo dõi Fanpage để cập nhật lịch khai giảng mới nhất."

## 9b. Ngân hàng CTA (xoay vòng — không dùng cùng kiểu ở 2 bài/video liên tiếp)
Câu CTA đứng ngay trước khối liên hệ chuẩn. Chọn 1 kiểu, ghi tên kiểu vào bảng duyệt bài.

| # | Kiểu | Mẫu câu (sửa cho hợp chủ đề) | Hợp với |
|---|---|---|---|
| 1 | Hỏi ý kiến | "Bạn thấy quy định này hợp lý không? Để lại bình luận cho mình biết nhé." | Chủ đề tranh cãi, luật mới |
| 2 | Hỏi trải nghiệm | "Bạn từng trượt ở bài nào? Kể mình nghe để mình gợi ý cách tập." | Mẹo thi, lỗi trừ điểm |
| 3 | Tag bạn bè | "Tag người bạn đang định thi bằng để cùng đọc nhé." | Mẹo, FAQ, thông báo |
| 4 | Lưu bài | "Lưu bài lại, gần ngày thi mở ra xem lại một lượt." | Checklist, mẹo nhiều ý |
| 5 | Giữ suất theo lịch thật | "Muốn kịp đợt thi <tháng/ngày thật trong business.md>, nhắn Zalo để mình giữ suất hồ sơ." — CHỈ dùng khi có lịch thật chưa qua | Thông báo lịch thi/khai giảng |
| 6 | Học thử / đến xem sân | "Ghé sân tập Thôn 18 xem thử một buổi, nhắn trước để mình hẹn giờ." | Giới thiệu sân, giáo viên |
| 7 | Nhận tài liệu qua Zalo | "Nhắn Zalo chữ \"TÀI LIỆU\" để mình gửi bộ câu hỏi ôn tập." — chỉ dùng khi trung tâm có tài liệu thật để gửi | Ôn lý thuyết, câu điểm liệt |
| 8 | Hỏi riêng trường hợp | "Trường hợp của bạn khác? Nhắn Zalo, mình xem giấy tờ giúp." | Cấp đổi, cấp lại, hết hạn |

Không dùng CTA thúc ép ("chốt ngay", "chỉ hôm nay", "số lượng có hạn" khi không có thật).

## 10. Ví dụ minh họa (bài mẫu theo giọng này)

> ⚠️ Lỗi này rất nhiều học viên hay mắc khi thi sa hình: quên bật xi-nhan trước khi chuyển làn, dù xe đã đi đúng hướng.
>
> Theo quy định, chỉ cần thiếu xi-nhan là bị trừ điểm ngay, dù kỹ năng lái không sai.
>
> Mẹo nhỏ: tập thành phản xạ "nhìn gương → bật xi-nhan → rồi mới đánh lái", làm đi làm lại vài lần trong buổi thực hành là quen tay.
>
> Kết quả thi còn tùy vào luyện tập của mỗi người, nhưng đây là lỗi hoàn toàn có thể tránh được nếu để ý sớm.
>
> 📌 Cần tư vấn thêm, nhắn Zalo OA hoặc để lại bình luận nhé.
> — Vạn Xuân
