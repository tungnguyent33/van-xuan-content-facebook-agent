# Skill: Content Ideation

Quy trình lên ý tưởng nội dung cho Vạn Xuân.

## Các bước
1. Đọc `context/business.md`, `context/icp.md`, `context/strategy.md` để nắm khóa học, học viên mục
   tiêu, mục tiêu nội dung. Đọc `context/matrix.md` (nếu đã có số liệu) để biết format, chủ đề,
   kiểu hook nào đang hiệu quả nhất — ưu tiên những cái đó.
2. **Đọc lịch sử để tránh lặp:** lấy tiêu đề + dòng mở đầu + câu CTA của **15 bài/kịch bản gần
   nhất** (gộp `posts/bai-XX/noi-dung.md` và `videos/video-XX/kich-ban.md`, theo số thứ tự lớn
   nhất). Quy tắc:
   - Không đề xuất chủ đề trùng (cùng câu hỏi chính) với bài/video trong **4 tuần** gần nhất
     (xem ngày ở `plans/`, `output/dashboard.md`, `topic-bank.md` dòng "Đã dùng ở"; không rõ ngày
     thì coi 15 bài gần nhất là trong 4 tuần).
   - Không dùng **cùng câu mở đầu (kiểu hook) hoặc cùng kiểu CTA** ở 2 bài liên tiếp — CTA chọn
     xoay vòng từ "Ngân hàng CTA" trong `context/voice-analysis.md`.
3. **Nguồn ý tưởng theo thứ tự ưu tiên:**
   1. `context/topic-bank.md`: chủ đề trạng thái `mới`, điểm cao trước. Chủ đề `đã dùng` chỉ dùng
      lại khi nó mới có video mà chưa có bài Fanpage (hoặc ngược lại) — xem "Liên kết bài ↔ video".
      **Không bao giờ** dùng chủ đề `cần duyệt`.
   2. `context/trends.md` (tóm tắt) / file mới nhất trong `context/trends/`: tin tức, luật mới.
      Chỉ chạy lại `node scripts/fetch-trends.js` khi file mới nhất cũ hơn 7 ngày (nguồn Google,
      khoảng 0,1 USD); muốn thu thập đa nguồn thì dùng `/find-topics`.
   3. Nhóm chủ đề cốt lõi của Vạn Xuân: mẹo thi sa hình & lý thuyết; quy định mới; lỗi hay bị trừ
      điểm; giới thiệu giáo viên/cơ sở vật chất/ảnh thật; FAQ trong `business.md`.
4. Với mỗi ý tưởng, xác định định dạng phù hợp nhất: ảnh thật có sẵn / infographic / carousel —
   dựa trên nội dung (số liệu → infographic; câu chuyện → ảnh thật; hướng dẫn nhiều bước →
   carousel). Chủ đề tranh cãi điểm cao có gợi ý "video" trong topic-bank → ghi chú "nên làm
   thêm video bằng `/create-video-script`".
5. Loại khỏi danh sách: chủ đề trạng thái `cần duyệt`, chủ đề không đủ dữ liệu để trả lời rõ
   (xem mục "Quy tắc với chủ đề tranh cãi" trong CLAUDE.md), chủ đề có ngày (lịch thi, khai giảng)
   đã qua so với hôm nay.
6. Trình bày danh sách ý tưởng dưới dạng bảng: # | Chủ đề (số topic-bank nếu có) | Định dạng đề
   xuất | Kiểu hook | Kiểu CTA | Lý do — để người dùng duyệt trước khi viết full nội dung.

## Liên kết bài ↔ video
Một chủ đề tranh cãi có thể ra cả 1 bài Fanpage và 1 video:
- Trong `posts/bai-XX/noi-dung.md`, phần ghi chú đầu file (trước "## Nội dung bài đăng"), thêm
  dòng `- **Video liên quan:** videos/video-YY/kich-ban.md` (nếu có) và `- **Topic-bank:** #N`.
- Trong `videos/video-YY/kich-ban.md`, dòng `- Bài Fanpage liên quan: posts/bai-XX/noi-dung.md`.
- Trong `context/topic-bank.md`, dòng "Đã dùng ở" ghi cả hai đường dẫn.

## Kiểm tra trước khi lưu bài (bắt buộc)
- [ ] **Số ý khớp tiêu đề**: tiêu đề/hook nói "5 điểm", "3 lỗi"... thì thân bài (và số slide nội
      dung nếu carousel) đếm đủ đúng số đó.
- [ ] **Prompt ảnh** (mọi file `anh-prompt.md`, `slide-N-prompt.md`) có câu chừa góc logo:
      `Logo placement: reserve clean, empty space in the top-left corner for overlaying the official Vạn Xuân logo — do not generate any text or icons in top-left area.`
- [ ] **Ảnh không lộ thông tin cá nhân**: không dùng `context/image/VanPhong.jpg`; ảnh thật không
      lộ họ tên, ảnh thẻ, số giấy tờ, biển số; prompt AI không yêu cầu chữ là tên người thật.
- [ ] **Ngày nhắc tới chưa qua**: mọi ngày (lịch thi, khai giảng, hạn nộp hồ sơ) phải sau hôm nay;
      ngày đã qua thì bỏ hoặc hỏi người dùng lịch mới.
- [ ] Khối liên hệ chuẩn ở cuối bài khớp từng ký tự với `business.md`.
- [ ] Không có dấu `>` đầu dòng trong phần nội dung copy-ready.
