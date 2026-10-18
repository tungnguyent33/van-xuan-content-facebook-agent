# Skill: Carousel Creation

Quy trình tạo carousel (PDF/ảnh nhiều slide) chuẩn cho Vạn Xuân.

## Cấu trúc mỗi carousel
- Slide 1: Heading thu hút + hình ảnh/nền theo đúng brand
- Slide 2 → n-1: Mỗi slide 1 ý — có heading nhỏ, subtitle, và 1 takeaway ngắn
- Slide cuối: Kêu gọi hành động (CTA) — ví dụ: liên hệ đăng ký, theo dõi fanpage

## Các bước
0. Nếu chủ đề là chủ đề tranh cãi (từ `context/topic-bank.md`): tuân theo mục "Quy tắc với chủ đề
   tranh cãi" trong CLAUDE.md — có 1 slide trình bày hai phía, slide chốt ghi nguồn chính thức, không
   đưa ảnh chụp bình luận có tên/ảnh đại diện.
1. Tham khảo `reference/carousel-samples/` để giữ đúng bố cục, font, màu.
2. Với chủ đề có nhiều bước/nhiều ý (ví dụ: "5 bước đăng ký học lái xe", "7 lỗi hay bị trừ điểm B2") — ưu tiên carousel thay vì bài viết dài.
3. Giữ mỗi slide ngắn gọn — không quá 1 ý chính, không quá 20-25 từ.
4. Trước khi viết prompt ảnh, trình bày outline text từng slide để người dùng duyệt trước.
5. Sau khi duyệt, viết 1 prompt tạo ảnh Gemini riêng cho mỗi slide (mô tả heading/subtitle/takeaway của slide đó + màu/phông/layout brand tham chiếu từ `reference/carousel-samples/`).
   - **Quy tắc chừa vị trí Logo (Phương pháp 1)**: Mọi prompt slide PHẢI chứa câu: `Logo placement: reserve clean, empty space in the top-left corner for overlaying the official Vạn Xuân logo — do not generate any text or icons in top-left area.`
   - Hướng dẫn người dùng tạo ảnh xong dán vào thư mục bài viết và chạy `node scripts/apply-watermark.js posts/bai-XX/` để ghép tự động logo Vạn Xuân chuẩn nét.
