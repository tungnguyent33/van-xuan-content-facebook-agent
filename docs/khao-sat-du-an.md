# Khảo sát dự án agent content Vạn Xuân

Ngày khảo sát: 18/10/2026. Bước này chỉ đọc, chưa sửa file nào (ngoài việc tạo file này).

Đã đọc: `CLAUDE.md`, 5 file trong `.claude/commands/`, 3 file trong `.claude/skills/`, 5 file trong `scripts/`, `package.json`, `.env.example`, toàn bộ `context/` (kể cả `context/image/README.md`), `reference/brand-style.md`, `output/dashboard.md`. Không đọc `.env` (chứa token).

**Lưu ý đường dẫn:** thư mục `docs/` chưa tồn tại trước bước này. Hai file `dinh-huong-phat-trien-agent.md` và `danh-gia-noi-dung-agent.md` đang nằm ở `context/`, không phải `docs/`. Báo cáo này dùng bản ở `context/` (xem rủi ro R1).

---

## 1. Lệnh và skill hiện có

### 1.1. Lệnh (`.claude/commands/`)

| Lệnh | Làm gì | Đọc | Ghi | Gọi skill | Gọi script |
|---|---|---|---|---|---|
| `/init-context` | Hỏi link kênh + mô tả trung tâm, (nếu có Apify) lấy bài đăng công khai, tự tổng hợp file nền | Dữ liệu người dùng dán / Apify | `context/profile.md`, `business.md`, `strategy.md`, `icp.md`, `voice-analysis.md` | Không | Không ghi rõ script nào (chỉ nói "dùng Apify") |
| `/create-plan` | Lên lịch đăng (mặc định 4 tuần): ngày, chủ đề, nền tảng, định dạng | `context/strategy.md`, `posts/` | `plans/ke-hoach-<ngày>.md` | Không | Không |
| `/create-10-post` | 10 ý tưởng → viết full → đề xuất định dạng → **dừng chờ duyệt** → viết prompt ảnh Gemini → lưu | `CLAUDE.md`, toàn bộ `context/`, `posts/`, `reference/*-samples/` | `posts/bai-XX/noi-dung.md`, `anh-prompt.md` / `slide-N-prompt.md`, `output/` | `content-ideation` → `viral-replication` → `carousel-creation` (nếu carousel) | `fetch-trends.js` |
| `/create-1-post [chủ đề]` | Chọn chủ đề (theo tham số, hoặc bài tiếp theo trong plan mới nhất) → viết caption → **dừng chờ duyệt** → prompt ảnh → lưu, nhắc chạy watermark | `plans/` mới nhất, `posts/`, `context/trends.md`, `CLAUDE.md`, `business.md`, `profile.md`, `voice-analysis.md` | `posts/bai-XX/`, `output/dashboard.md` | **Không gọi skill nào** | `fetch-trends.js` |
| `/create-post` | Gần như bản sao `/create-1-post` (chỉ khác dòng tiêu đề và thứ tự tên lệnh ở dòng 5) | như trên | như trên | như trên | như trên |

### 1.2. Skill (`.claude/skills/`)

| Skill | Làm gì | Đọc |
|---|---|---|
| `content-ideation.md` | Liệt kê chủ đề đã dùng, **tự chạy lại `fetch-trends.js`**, kết hợp 5 nhóm chủ đề cốt lõi, gán định dạng (số liệu → infographic, câu chuyện → ảnh thật, nhiều bước → carousel), trình bảng `# \| Chủ đề \| Định dạng \| Lý do` để duyệt **trước khi viết full** | `business.md`, `icp.md`, `strategy.md`, `posts/`, `context/trends.md` |
| `viral-replication.md` | Học cấu trúc/hook từ mẫu, viết lại theo giọng Vạn Xuân, không bịa số liệu, rà "Chủ đề PHẢI tránh" | `reference/copywriting-samples/` (hiện chỉ có README, chưa có mẫu), `profile.md`, `CLAUDE.md` |
| `carousel-creation.md` | Cấu trúc slide (hook → mỗi slide 1 ý ≤ 20–25 từ → CTA), duyệt outline trước, rồi 1 prompt Gemini/slide có câu chừa góc logo | `reference/carousel-samples/` (chỉ có README) |

### 1.3. Thứ tự gọi

```
/init-context ──► /create-plan ──► /create-10-post  hoặc  /create-1-post (= /create-post)
                                      │                       │
                                      ├ fetch-trends.js       ├ fetch-trends.js
                                      ├ content-ideation      ├ (không dùng skill)
                                      │   └ fetch-trends.js   ├ viết caption
                                      │     (chạy lần 2)      ├ DỪNG duyệt
                                      ├ viral-replication     ├ prompt ảnh
                                      ├ carousel-creation*    └ lưu + dashboard
                                      ├ DỪNG duyệt                │
                                      ├ prompt ảnh                ▼
                                      └ lưu + output/      (thủ công) Gemini → tải ảnh
                                                            → apply-watermark.js
```

Script không do lệnh gọi: `create-post.js` (giữ chỗ thư mục, chạy tay hoặc qua `create-post.bat` / `.ps1`), `apply-watermark.js` (người dùng chạy sau khi tải ảnh), `create-logo.js` (chạy một lần), `clean-all-quotes.js` (xoá `>` đầu dòng trong mọi `noi-dung.md`; không có trong `package.json` và không được nhắc trong `CLAUDE.md`).

### 1.4. Chỗ lệch giữa tài liệu và thực tế

- `CLAUDE.md` (dòng 72 và bảng script) ghi `fetch-trends.js` tự chạy trong `/create-plan` và `/init-context`. **Thực tế hai lệnh này không gọi.** Chỉ `/create-1-post`, `/create-post`, `/create-10-post` và skill `content-ideation` gọi.
- `CLAUDE.md` ghi `create-post.md` "giống hệt" `create-1-post.md`. Thực tế khác 2 dòng (tiêu đề, thứ tự tên lệnh), nội dung xử lý giống nhau.
- `CLAUDE.md` ghi mọi file trong `context/` "vẫn là template trống". Đã lỗi thời: `business.md`, `profile.md`, `icp.md`, `voice-analysis.md`, `strategy.md` đã có nội dung; chỉ `matrix.md` còn trống hẳn.
- `/create-10-post` đánh số bước "4." hai lần. Bước 4 viết full nội dung ngay sau ideation, trong khi skill `content-ideation` bước 5 yêu cầu duyệt bảng ý tưởng **trước** khi viết full. Hai chỗ mâu thuẫn về điểm dừng thứ nhất.
- Link logo trong `CLAUDE.md` trỏ tới `c:/Users/Thinkpad P15V3/Downloads/van-xuan-content-agent/...`, sai thư mục dự án hiện tại.
- `reference/brand-style.md` (bảng màu, bố cục) không được lệnh hay skill nào nhắc. Các prompt ảnh vẫn dùng đúng màu, có lẽ do agent tự đọc khi duyệt `reference/`.

---

## 2. `scripts/fetch-trends.js`

**Ai gọi:**
| Nơi gọi | Vị trí |
|---|---|
| `/create-10-post` | `.claude/commands/create-10-post.md:6` |
| skill `content-ideation` (do `/create-10-post` gọi ở bước 3) | `.claude/skills/content-ideation.md:9` |
| `/create-1-post` | `.claude/commands/create-1-post.md:12` |
| `/create-post` | `.claude/commands/create-post.md:12` |
| Chạy tay | `npm run fetch-trends` |

Vì vậy mỗi lần `/create-10-post` chạy, script bị gọi **hai lần** (một lần ở lệnh, một lần trong skill), tốn gấp đôi tín dụng Apify.

**Làm gì:** gọi actor `apify/google-search-scraper` (đồng bộ, `run-sync-get-dataset-items`), 4 từ khóa cố định, 1 trang × 5 kết quả mỗi từ khóa, lấy `title`, `url`, `description` của `organicResults`.

**Ghi ra:** `context/trends.md`, **ghi đè toàn bộ**, dạng markdown `### N. tiêu đề / Link / Mô tả` kèm dòng thời gian cập nhật.

**Ai đọc `context/trends.md`:**
| Nơi đọc | Vị trí |
|---|---|
| skill `content-ideation` | `.claude/skills/content-ideation.md:10` |
| `/create-10-post` (bước 3, qua skill; bước 1 còn đọc "toàn bộ `context/`") | `.claude/commands/create-10-post.md:5,7` |
| `/create-1-post`, `/create-post` (đọc trực tiếp, không qua skill) | dòng 13 mỗi file |
| Gián tiếp: ghi chú nguồn trong `posts/bai-21`, `bai-26`, `bai-36`, `output/dashboard.md:80`, hai báo cáo trong `context/` | chỉ là trích dẫn, không đọc tự động |

Skill `viral-replication` và `carousel-creation` không đọc file này.

**Hành vi khi lỗi** (quan trọng cho bước đổi định dạng):
- Không có token, Apify trả lỗi, hoặc mất mạng: script chỉ in log rồi thoát với **exit code 0**, **giữ nguyên file cũ**. Agent không biết dữ liệu đã cũ (file hiện tại cập nhật 14/10/2026).
- Token nằm trên query string URL (`?token=...`), có thể lộ trong log.
- Từ khóa lệch đối tượng (B2, ô tô) và sai chính tả "phó thọ", như báo cáo định hướng đã nêu.

---

## 3. Những chỗ phải sửa

### 3(a). Đổi `context/trends.md` → `context/trends/YYYY-MM-DD.json` + `context/topic-bank.md`

| File | Dòng | Sửa gì |
|---|---|---|
| `scripts/fetch-trends.js` | 20, 64–83 | Đổi đích ghi sang `context/trends/<ngày>.json` (tạo thư mục nếu chưa có), không ghi đè ngày cũ. Thêm bước sinh/cập nhật `topic-bank.md` (trong script hay để Claude làm, xem câu hỏi Q3). Trả exit code ≠ 0 khi lỗi. |
| `.claude/commands/create-10-post.md` | 6, 7 | Bỏ chữ `context/trends.md`, thay bằng `topic-bank.md` (và JSON mới nhất nếu cần chi tiết). Bỏ một trong hai lần gọi script. |
| `.claude/commands/create-10-post.md` | 5 | "Đọc toàn bộ `context/`" sẽ quét cả thư mục `trends/` chứa JSON thô ngày càng nhiều. Cần loại trừ `context/trends/`. |
| `.claude/skills/content-ideation.md` | 8–10 | Đổi nguồn đọc sang `topic-bank.md`. Nên bỏ việc skill tự chạy script, để lệnh gọi một lần. Nếu topic-bank có điểm số/trạng thái, thêm bước chọn theo điểm và đánh dấu chủ đề đã dùng. |
| `.claude/commands/create-1-post.md` | 11–13 | Đổi bước đọc sang `topic-bank.md`. Nếu không có tham số và không có plan, có thể lấy chủ đề điểm cao nhất chưa dùng trong topic-bank. |
| `.claude/commands/create-post.md` | 11–13 | Sửa giống trên, hoặc xoá/hợp nhất file trước (xem Q1). |
| `.claude/commands/create-plan.md` | 1–4 | Hiện không đọc xu hướng. Nếu muốn kế hoạch dựa trên topic-bank, thêm một bước đọc. |
| `CLAUDE.md` | 72–73, bảng script dòng 83 | Cập nhật mô tả output, sửa danh sách lệnh gọi script cho đúng thực tế. |
| `context/trends.md` | — | Quyết định xoá, giữ làm lưu trữ, hay chuyển một lần sang JSON (Q4). Bài 21, 26, 36 và `dashboard.md` đang trích dẫn tên file này. |
| `.gitignore` | — | Cân nhắc có commit `context/trends/*.json` không (dữ liệu thô, có thể chứa bình luận người dùng). |

### 3(b). Thêm lệnh tạo kịch bản video

| File | Sửa / thêm gì |
|---|---|
| `.claude/commands/create-video-script.md` (mới) | Theo định hướng mục 5: nhận `[chủ đề \| số trong topic-bank]`, đọc `topic-bank.md`, `business.md`, `voice-analysis.md`, gọi skill mới, **dừng chờ duyệt** trước khi viết chi tiết, lưu `videos/video-XX/kich-ban.md`. |
| `.claude/commands/create-5-video.md` (mới, nếu làm) | 5 ý tưởng → duyệt → viết chi tiết. |
| `.claude/skills/video-scripting.md` (mới) | Khung kịch bản (hook 3 phương án, bảng cảnh, CTA, caption, hashtag, ghi chú quay, checklist), 7 format, hàng rào an toàn cho chủ đề tranh cãi. |
| `.claude/skills/content-ideation.md` dòng 17 | Thêm "video ngắn" vào danh sách định dạng, nếu muốn `/create-10-post` đề xuất được video. |
| `.claude/commands/create-plan.md` dòng 3 | Thêm TikTok/Reels vào cột nền tảng/định dạng. |
| `scripts/create-post.js` | Hiện chỉ tạo `posts/bai-XX`. Nếu muốn giữ chỗ cho video, cần tham số hoặc script riêng cho `videos/video-XX`. |
| `CLAUDE.md` | Thêm TikTok vào "Nền tảng ưu tiên", thêm `videos/` vào "Cấu trúc dữ liệu", thêm lệnh mới vào danh sách và chuỗi lệnh, thêm hàng rào chủ đề tranh cãi. Quy tắc "Copy-ready" (không dùng `>`) nên áp dụng cho `kich-ban.md`. |
| `context/strategy.md`, `context/profile.md` | Đang ghi "TikTok chưa có". Cần cập nhật khi mở kênh. |
| `context/voice-analysis.md` | Chỉ có quy tắc cho Facebook (độ dài 80–250 chữ). Cần thêm phần giọng nói/lời thoại video. |
| `output/dashboard.md` | Thêm bảng theo dõi video. |
| `reference/` | Chưa có thư mục mẫu kịch bản/video. |

---

## 4. Rủi ro và điểm chưa rõ cần anh/chị trả lời

### Rủi ro

- **R1. Báo cáo nằm trong `context/` sẽ bị agent đọc như dữ liệu nền.** `/create-10-post` bước 1 đọc "toàn bộ `context/`", nên hai báo cáo đánh giá/định hướng (có nhận định chưa xác minh, ví dụ "A1 đến 125cc… viết theo trí nhớ", "Thông tư 36/2024… 12 tháng") có thể bị đưa vào bài như thông tin thật. Nên chuyển sang `docs/`.
- **R2. Dữ liệu xu hướng cũ không báo lỗi.** Script lỗi vẫn exit 0 và giữ file cũ. Khi đổi sang JSON theo ngày, agent cần cách biết lần chạy hôm nay có thành công không.
- **R3. Gọi Apify hai lần mỗi lần `/create-10-post`.** Tốn tín dụng gấp đôi, nhất là khi thêm actor TikTok/Facebook (định hướng ước tính 5–15 USD/tháng).
- **R4. Thông tin luật chưa xác minh đang nằm trong dữ liệu nền.** `business.md` ghi A1 "dưới 175cc", báo cáo định hướng cho rằng đã đổi thành 125cc. Kịch bản mẫu "Bằng A1 lái được xe 150cc?" phụ thuộc trực tiếp vào điểm này.
- **R5. Thu bình luận TikTok/Facebook liên quan dữ liệu cá nhân.** File JSON thô sẽ chứa tên, nội dung bình luận người dùng thật. Cần quy định lưu giữ và có commit hay không.
- **R6. `apply-watermark.js` chạy lại trên cùng thư mục sẽ đóng logo hai lần** (ghi đè file gốc, không đánh dấu ảnh đã xử lý). Không liên quan trực tiếp tới hai thay đổi, nhưng sẽ gặp lại nếu video có ảnh bìa.
- **R7. Thư mục mẫu trống.** `reference/copywriting-samples/` và `carousel-samples/` chỉ có README, nên `viral-replication` không có gì để học. Skill video mới sẽ gặp vấn đề tương tự.
- **R8. Dự án chưa dùng git.** Sửa nhiều lệnh/skill cùng lúc mà không có bản lưu thì khó quay lại.

### Câu hỏi cần trả lời trước khi làm tiếp

- **Q1.** `create-post.md`: xoá, giữ làm alias, hay hợp nhất với `create-1-post.md`? (Nếu giữ, mỗi thay đổi phải sửa hai nơi.)
- **Q2.** Chuyển `dinh-huong-phat-trien-agent.md` và `danh-gia-noi-dung-agent.md` từ `context/` sang `docs/` được không?
- **Q3.** Ai chấm điểm và viết `topic-bank.md`: script Node tự tính bằng công thức (view, tỷ lệ bình luận…), hay Claude đọc JSON rồi chấm (cần đọc bình luận để phân loại đồng ý/phản đối)? Hay kết hợp: script tính "độ hot", Claude chấm phần còn lại?
- **Q4.** `context/trends.md` hiện tại: xoá, giữ làm lưu trữ, hay chuyển một lần sang `context/trends/2026-10-14.json`?
- **Q5.** Định dạng `topic-bank.md`: chỉ thêm chủ đề mới, hay viết lại toàn bộ mỗi lần? Có cột trạng thái (mới / đã dùng / cần duyệt / loại) và liên kết tới bài/video đã làm không?
- **Q6.** Giai đoạn đầu chỉ đổi định dạng với nguồn Google hiện có, hay làm luôn TikTok/Facebook/YouTube? Ngân sách Apify mỗi tháng là bao nhiêu?
- **Q7.** Script có được gọi tự động trong mỗi lệnh nữa không, hay chỉ chạy khi JSON hôm nay chưa có (tránh tốn tiền khi chạy nhiều lệnh trong ngày)?
- **Q8.** Lệnh video: làm cả `/create-video-script` và `/create-5-video`, hay chỉ một? Đặt ở `videos/video-XX/` như định hướng?
- **Q9.** Trung tâm đã có kênh TikTok chưa, và đã có thầy/cô đồng ý lên hình chưa? Nếu chưa, kịch bản nên viết theo dạng không cần người thật (chữ + giọng đọc + cảnh sân tập)?
- **Q10.** Ai duyệt chủ đề tranh cãi có điểm an toàn thấp (định hướng đề xuất ngưỡng < 8/15)?
- **Q11.** Có muốn `git init` trước khi sửa để dễ quay lại không?
- **Q12.** Có sửa luôn các chỗ `CLAUDE.md` lệch thực tế (mục 1.4) trong lần làm tiếp theo không?
