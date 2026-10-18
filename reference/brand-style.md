# Brand Style — Bộ nhận diện hình ảnh Vạn Xuân

> Rút ra từ banner treo biển thật (`Đào_tạo_lái_xe_Vạn_xuân_khổ_3_2.png`) — đây là tài sản
> thương hiệu cụ thể nhất hiện có, nên dùng làm gốc cho mọi định dạng khác (carousel,
> infographic). Mã màu bên dưới lấy mẫu trực tiếp từ file ảnh (ước lượng theo pixel) — nếu có
> file gốc logo (AI/SVG/PNG nền trong suốt) thì nên đối chiếu lại cho chính xác 100%.
>
> Dùng file này khi viết **prompt tạo ảnh** cho Gemini (theo đúng quy tắc trong `CLAUDE.md`:
> Gemini không tự đọc được ảnh mẫu, phải mô tả bằng lời) — copy các mục 1–4 vào phần mô tả
> phong cách của prompt.

## 1. Bảng màu
| Vai trò | Mã hex | Dùng khi nào |
|---|---|---|
| Xanh navy đậm | `#0E3970` | Nền góc tối, vùng gradient sẫm, logo phần chữ V |
| Xanh dương chính | `#048DD1` | Nền chủ đạo (gradient sáng hơn), màu nhận diện chính |
| Cam nhấn | `#E4661F` | Logo phần chữ X, nút/nhãn CTA, thanh liên hệ, chi tiết cần nổi bật |
| Trắng | `#FFFFFF` | Nền panel logo, viền ảnh, chữ trên nền xanh |
| Đen/xám đậm | dùng làm bóng đổ nhẹ cho chữ, không phải màu nền |

## 2. Logo
- Biểu tượng "VX" cách điệu: chữ **V** màu xanh navy lồng hình vô-lăng bên trong, chữ **X** tạo bằng dải ruy-băng gradient xanh → cam vắt chéo qua.
- Luôn đặt trên nền đủ tương phản (nền trắng hoặc nền xanh navy đặc) — không đặt trực tiếp lên ảnh thật (ảnh học viên/xe) vì dễ bị chìm.
- Vị trí chuẩn: góc trên-trái, trong khối nền trắng riêng biệt với phần còn lại.

## 3. Kiểu chữ (typography)
- **Tiêu đề chính**: chữ hoa toàn bộ, font sans-serif cực đậm (extra-bold/black), có hiệu ứng bóng đổ/nổi khối nhẹ (bevel) để nổi bật trên nền xanh — không dùng font mảnh hay chữ thường cho tiêu đề.
- **Nhãn phụ nhấn mạnh** (kiểu "HẠNG A, A1"): chữ hoa đậm, trắng trên nền cam bo góc — dùng cho 1 cụm từ khoá quan trọng nhất của bài/slide.
- **Chữ thông tin** (liên hệ, địa chỉ): đậm vừa phải, rõ ràng, không dùng font trang trí/viết tay.

## 4. Bố cục / mô-típ hình ảnh
- **Chia chéo (diagonal split)**: mảng trắng chứa logo ở góc trên-trái, cắt chéo sang mảng xanh navy/gradient chiếm phần lớn khung hình.
- **Hoạ tiết vòng lặp con đường**: đường cong mờ dạng vòng lặp, viền trắng mảnh, độ trong suốt thấp ở nền — chi tiết ngầm gợi "đường/lái xe", không lấn át nội dung chính. Có thể bỏ ở các định dạng đơn giản (slide nội dung, infographic) để đỡ rối.
- **Ảnh thật** (học viên/xe/cơ sở vật chất): đặt trong khung viền trắng mỏng, hơi nghiêng — tạo cảm giác ảnh dán trên bảng, tăng độ chân thực, tránh nhìn như ảnh stock.
- **Thanh liên hệ**: khối màu cam, góc dưới-trái, có icon điện thoại/Zalo đi kèm số.
- **Địa chỉ**: đặt trên nền trắng, thường ở cuối bố cục.
- **QR code** (nếu có): góc dưới-phải.

## 5. Áp dụng cho từng loại nội dung

### Carousel (Facebook, nhiều slide)
- **Slide bìa**: giữ nguyên tinh thần banner — nền xanh navy/gradient, logo góc trên-trái, tiêu đề chữ hoa đậm trắng, 1 nhãn cam nhấn từ khoá chính của bài (thay vì "HẠNG A, A1" thì đổi thành tên chủ đề, VD "MẸO THI SA HÌNH").
- **Slide nội dung** (giữa): đơn giản hoá để dễ đọc — nền trắng hoặc nền xanh navy đặc (bỏ hoạ tiết vòng lặp), giữ logo nhỏ góc để nhận diện xuyên suốt, dùng khối cam cho số thứ tự/icon nhấn ý, chữ tối màu trên nền sáng.
- **Slide cuối (CTA)**: quay lại tông banner — nền cam hoặc xanh đậm, nhắc lại số điện thoại/Zalo đúng kiểu thanh liên hệ trên banner.

### Infographic (1 ảnh, nhiều thông tin)
- Tiêu đề trên cùng theo đúng kiểu chữ hoa đậm/bóng đổ như banner.
- Nội dung chia khối rõ ràng (số liệu, các bước, lỗi hay gặp...), dùng cam đánh dấu số/icon quan trọng, xen kẽ nền trắng/xanh navy để phân tách khối.
- Chân trang lặp lại thanh liên hệ cam giống banner — tạo cảm giác mọi nội dung đều từ cùng một nguồn nhất quán.

### Copywriting
- Đồng bộ với giọng "thẳng thắn, minh bạch, gần gũi" đã định nghĩa ở `voice-analysis.md`. Logic màu cam = "trọng tâm cần chú ý" trong hình ảnh nên khớp với cách dùng emoji nhấn ý (📌 ⚠️ ✅) trong bài viết — visual và câu chữ cùng một logic nhấn mạnh.

## 6. Khung prompt tạo ảnh gợi ý (Gemini, viết bằng tiếng Anh khi dùng thật)

```
Style: modern Vietnamese driving-school ad graphic, bold and trustworthy, not playful.
Palette: deep navy blue (#0E3970) to vivid blue (#048DD1) gradient background, orange accent
(#E4661F) for callout badges/CTA blocks, white for text and photo frames.
Typography: extra-bold condensed sans-serif, all caps, white with subtle bevel/drop-shadow for
headline; bold white-on-orange rounded badge for one key phrase.
Layout: diagonal split with a white panel (top-left) transitioning into the navy/blue panel;
faint looping road-line motif in the background at low opacity; real photo inset with a thin
white border, slightly tilted; orange contact bar (bottom-left) with phone/Zalo icon; address on
white strip; QR code bottom-right if needed.
Logo placement: reserve top-left white area for the "VX" logo (steering-wheel V + blue-to-orange
ribbon X) — do not redraw the logo itself, leave clean space to overlay it afterward.
```
*(Không tự tạo file ảnh — theo đúng quy tắc trong `CLAUDE.md`, viết prompt để người dùng tự dán vào Gemini.)*

## 7. Việc cần làm tiếp
- Lưu banner gốc vào `reference/carousel-samples/` hoặc tạo thư mục mới `reference/brand-assets/` để mở lại xem khi viết prompt.
- Nếu có file gốc logo (vector/PNG nền trong suốt) hoặc bảng màu chính thức từ nhà thiết kế, nên thêm vào cùng thư mục và cập nhật lại mã hex ở mục 1 cho chính xác tuyệt đối.
