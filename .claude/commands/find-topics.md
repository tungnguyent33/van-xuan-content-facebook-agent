# /find-topics

Tìm chủ đề tranh cãi từ dữ liệu đa nguồn và cập nhật `context/topic-bank.md`.

Khi người dùng gõ lệnh này:

1. Đọc `CLAUDE.md` (đặc biệt mục "Quy tắc với chủ đề tranh cãi"), `context/business.md`.
2. **Thu thập dữ liệu mới (tốn tín dụng Apify — PHẢI hỏi trước):**
   - Xem file mới nhất trong `context/trends/` (ngày, nguồn đã chạy, mục `runs` có chi phí).
   - Hỏi người dùng: dùng dữ liệu đang có, hay chạy thu thập mới? Nếu chạy mới, nêu rõ lệnh và
     chi phí ước tính trước khi chạy:
     - `npm run fetch-trends` — chỉ nguồn đang bật (Google), khoảng 0,1 USD.
     - `node scripts/fetch-trends.js --source=all` — mọi nguồn theo giới hạn trong
       `config/trend-sources.json`, khoảng 3–4 USD/lần (xem `docs/huong-dan-su-dung.md`).
   - Chỉ chạy khi người dùng đồng ý. Nếu người dùng nói "dùng dữ liệu có sẵn" hoặc gọi lệnh kèm
     "không crawl", bỏ qua bước này.
3. Chạy `node scripts/score-topics.js` (không tốn tín dụng) → sinh `context/topic-candidates.json`.
4. Áp dụng skill `topic-scoring.md`: đọc `topic-candidates.json`, phân loại bình luận, chấm điểm,
   giữ trạng thái chủ đề cũ, ghi `context/topic-bank.md`.
5. Trình bày cho người dùng bảng tóm tắt top 10 chủ đề (điểm, trạng thái, định dạng gợi ý) và
   danh sách chủ đề `cần duyệt` kèm lý do — hỏi người dùng có muốn đổi trạng thái chủ đề nào không.
