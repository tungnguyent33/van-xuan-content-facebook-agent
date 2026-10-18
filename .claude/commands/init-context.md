# /init-context

Khi người dùng gõ lệnh này:

1. Hỏi người dùng 2 việc (nếu chưa cung cấp trong lệnh):
   - Link các kênh: Fanpage, Zalo OA, Website, TikTok (nếu có)
   - Mô tả bằng ngôn ngữ tự nhiên: Vạn Xuân là ai, đào tạo hạng bằng gì, học phí, điểm khác biệt...
2. Nếu có cấu hình Apify (API key trong .env), dùng để lấy dữ liệu bài đăng công khai từ các link được cung cấp.
3. Nếu KHÔNG có Apify hoặc người dùng dán trực tiếp nội dung/bài viết cũ vào chat, dùng luôn dữ liệu đó.
4. Từ dữ liệu thu được, cập nhật các file sau (không hỏi lại từng file, tự tổng hợp):
   - `context/profile.md`
   - `context/business.md`
   - `context/strategy.md` (giữ nguyên phần người dùng đã điền tay nếu có, chỉ bổ sung)
   - `context/icp.md`
   - `context/voice-analysis.md` — phân tích giọng văn: độ dài câu trung bình, có dùng emoji không, mức độ trang trọng, các cụm từ hay lặp lại
5. Báo cáo tóm tắt những gì đã cập nhật cho người dùng xem lại.
