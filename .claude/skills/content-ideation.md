# Skill: Content Ideation

Quy trình lên ý tưởng nội dung cho Vạn Xuân.

## Các bước
1. Đọc `context/business.md`, `context/icp.md`, `context/strategy.md` để nắm khóa học, học viên mục tiêu, mục tiêu nội dung.
2. Đọc toàn bộ `posts/` hiện có — liệt kê các chủ đề đã dùng để KHÔNG lặp lại.
3. **Tự động cào dữ liệu xu hướng thực tế qua Apify API**:
   - Chạy lệnh `node scripts/fetch-trends.js` để Apify tự động tìm kiếm tin tức, luật giao thông mới, và các bài viết hot trong ngành đào tạo lái xe.
   - Đọc file `context/trends.md` vừa được sinh ra để lấy các chủ đề "nóng", luật mới, hoặc mẹo hay đang được tìm kiếm nhiều nhất làm nguồn ý tưởng thực tế.
   - Kết hợp với các nhóm chủ đề cốt lõi của Vạn Xuân:
     - Kinh nghiệm/mẹo thi sa hình & lý thuyết
     - Cập nhật thay đổi quy định/luật giao thông mới nhất từ tin tức thực tế
     - Lỗi hay bị trừ điểm khi thi sát hạch
     - Giới thiệu giáo viên/cơ sở vật chất/ảnh thật học viên
     - Giải đáp thắc mắc thường gặp (FAQ trong business.md)
4. Với mỗi ý tưởng, xác định định dạng phù hợp nhất: ảnh thật có sẵn / infographic / carousel — dựa trên nội dung (số liệu → infographic; câu chuyện → ảnh thật; hướng dẫn nhiều bước → carousel).
5. Trình bày danh sách ý tưởng dưới dạng bảng: # | Chủ đề | Định dạng đề xuất | Lý do — để người dùng duyệt trước khi viết full nội dung.
