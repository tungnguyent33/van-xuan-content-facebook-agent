# Skill: Topic Scoring (chấm điểm chủ đề tranh cãi → topic-bank)

Đọc `context/topic-candidates.json` (do `scripts/score-topics.js` sinh) và cập nhật
`context/topic-bank.md`. Dùng trong lệnh `/find-topics`.

## Đầu vào
- `context/topic-candidates.json`: mỗi cụm có `name`, `raw_score` (hot 0–30, controversy 0–30 tính
  bằng code), `stats`, `links` (link nguồn kèm số liệu), `sample_comments` (tối đa 100 bình luận
  đã che tên).
- `context/business.md` (khóa học thật: A1, A, cấp đổi; mục "Thông tin chưa xác minh"),
  `CLAUDE.md` (mục "Quy tắc với chủ đề tranh cãi"), `context/matrix.md` (format/chủ đề đang hiệu
  quả, nếu đã có số liệu).
- `context/topic-bank.md` hiện có (để giữ trạng thái chủ đề cũ).
- Mục "Quy tắc với chủ đề tranh cãi" trong `CLAUDE.md`: chấm Độ an toàn theo đúng các quy tắc này
  (chủ đề dễ vi phạm thì điểm thấp → `cần duyệt`).

## Các bước
1. **Lọc cụm rác**: bỏ cụm mà bình luận/bài không nói về lái xe, thi bằng, luật giao thông (vd.
   video giải trí lọt vào kết quả tìm kiếm), cụm chỉ có 1 bài và không có bình luận. Ghi số cụm
   đã bỏ ở cuối topic-bank.
2. **Gộp cụm trùng ý** (vd. "thi bằng A1" và "#thibanglaixe" cùng nói chuyện thi A1) thành 1 chủ
   đề; cộng link và bình luận.
3. **Đặt tên chủ đề** dạng câu hỏi gây tò mò mà người học thật sự đang hỏi, dựa trên bình luận
   (không dựa trên tiêu đề SEO của trung tâm khác). Ví dụ: "Bằng A1 cũ có được lái xe 150cc
   không?".
4. **Phân loại bình luận mẫu** của mỗi chủ đề thành 4 nhóm và đếm: **đồng ý / phản đối / hỏi
   thêm / kể trải nghiệm**. Bình luận cảm ơn, xin vía, chào hỏi → bỏ, không đếm. "Đồng ý" và
   "phản đối" là so với quan điểm chính của chủ đề (ghi rõ quan điểm đó).
5. **Chấm điểm (0–100)**:
   - **Độ hot (30)**: lấy `raw_score.hot` làm gốc, được chỉnh ±5 nếu bình luận cho thấy chủ đề
     đang nóng/đã nguội (vd. luật vừa áp dụng, nhiều người hỏi cùng lúc).
   - **Độ tranh cãi (30)**: cao khi phe đồng ý và phe phản đối cùng lớn. Gợi ý:
     `30 × min(đồng ý, phản đối) / max(đồng ý, phản đối)` × hệ số đủ mẫu (≥ 20 bình luận có nội
     dung = 1; 10–19 = 0,7; < 10 = 0,4), cộng tối đa +5 nếu có nhiều "hỏi thêm" (người ta đang
     bối rối) và `raw_score.controversy` cao. Không vượt 30.
   - **Độ liên quan Vạn Xuân (25)**: chạm A1, A, cấp đổi/cấp lại, người học ở Phú Thọ → cao.
     Chủ đề về ô tô B/C/D, xe tải → trừ mạnh (tối đa 8/25). Chủ đề không có khóa tương ứng ở
     `business.md` → không quá 12/25.
   - **Độ an toàn (15)**: có văn bản chính thức để chốt đúng/sai (luật, nghị định, thông tư, trang
     Bộ Công an/Cục CSGT) → cao. Trừ điểm nếu: chưa tìm được nguồn chính thức, dính tới điểm trong
     mục "Thông tin chưa xác minh" của `business.md`, dễ thành chê trung tâm khác/cơ quan nhà
     nước, dễ bị hiểu là hướng dẫn lách luật, hoặc cần thông tin trung tâm chưa công bố (học phí
     chi tiết, lệ phí...).
6. **Trạng thái**:
   - Chủ đề mới → `mới`.
   - Độ an toàn **dưới 8/15** → `cần duyệt` (dù mới hay cũ). Chủ đề `cần duyệt` KHÔNG được tự sản
     xuất bài/video cho tới khi người dùng đổi trạng thái.
   - Chủ đề đã có trong topic-bank cũ: **giữ nguyên trạng thái cũ** (`đã dùng`, `cần duyệt`, `mới`
     hoặc trạng thái người dùng tự ghi), chỉ cập nhật điểm, link, bình luận, ngày cập nhật.
     Chủ đề cũ không còn trong dữ liệu mới vẫn giữ lại (đánh dấu "không có dữ liệu mới").
7. **Ghi `context/topic-bank.md`** theo mẫu dưới đây, sắp theo tổng điểm giảm dần.

## Quy tắc ẩn danh (bắt buộc)
- Chỉ trích **3 bình luận tiêu biểu** mỗi chủ đề, mỗi câu ≤ 25 từ, được rút gọn/sửa chính tả nhẹ.
- Trước khi trích, kiểm tra lại: không có họ tên, biệt danh, `@tên`, số điện thoại, tên trường/lớp
  cụ thể của người bình luận. Script đã che phần lớn tên ("(ẩn tên)", "@…") nhưng có thể sót tên 1
  chữ — tự xóa nếu thấy.
- Không ghi tên kênh/người đăng video; link TikTok đã ở dạng `tiktok.com/@/video/<id>`.

## Nguồn cần xác minh
- Ghi văn bản gốc cần mở để chốt (số hiệu luật/nghị định/thông tư, điều khoản) và link nguồn đã
  đối chiếu được. Bài báo, trang trung tâm khác chỉ là nguồn thứ cấp — ghi rõ "thứ cấp".
- Không tự khẳng định nội dung luật nếu chưa đọc được nguồn; ghi "cần xác nhận lại quy định mới
  nhất".

## Mẫu topic-bank.md
```markdown
# Topic bank — chủ đề tranh cãi đã chấm điểm

Cập nhật: YYYY-MM-DD · Dữ liệu: context/trends/YYYY-MM-DD.json · Chạy bằng /find-topics
Trạng thái: `mới` (được dùng) · `cần duyệt` (chờ người dùng duyệt, KHÔNG tự sản xuất) · `đã dùng`

| # | Chủ đề | Điểm | Hot | Tranh cãi | Liên quan | An toàn | Định dạng gợi ý | Trạng thái |
|---|---|---|---|---|---|---|---|---|

## 1. <Tên chủ đề dạng câu hỏi>
- **Trạng thái:** mới · **Điểm:** 78 (hot 22 · tranh cãi 20 · liên quan 24 · an toàn 12)
- **Phân loại bình luận (n = …):** đồng ý … · phản đối … · hỏi thêm … · kể trải nghiệm …
- **Điểm tranh cãi:** Phe A nghĩ … / Phe B nghĩ …
- **Bình luận tiêu biểu (đã ẩn danh):** "…" · "…" · "…"
- **Link nguồn:** …
- **Nguồn chính thức cần xác minh:** …
- **Định dạng gợi ý:** bài Fanpage (…) / video (format …)
- **Đã dùng ở:** (để trống; lệnh tạo bài/video ghi đường dẫn vào đây)
```
