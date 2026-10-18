// Che tên người dùng còn sót trong NỘI DUNG bình luận (các trường tên/ảnh/id đã bị bỏ khi chuẩn hóa).
// Facebook chèn tên người được trả lời vào đầu bình luận ("Nguyễn Văn A bạn thử..."), nhóm ẩn danh
// dùng biệt danh dạng "SpiritedKangaroo9248"; TikTok/YouTube dùng "@tên"; bài diễn đàn hay có dòng
// chỉ ghi tên người đăng.
// Đây là heuristic: bắt được tên 2–4 chữ viết hoa ở đầu/cuối câu hoặc đứng riêng 1 dòng, không bắt
// được tên 1 chữ giữa câu nếu không đứng sau từ xưng hô. Skill topic-scoring vẫn phải tự kiểm tra lại trước khi trích bình luận.

const NAME_WORD = '\\p{Lu}[\\p{Ll}\\p{M}]+';
const LEADING_NAME = new RegExp(`^(?:${NAME_WORD}\\s+){1,3}${NAME_WORD}(?=[\\s,:]+[\\p{Ll}\\d"'(])`, 'u');
const TRAILING_NAME = new RegExp(`\\s(?:${NAME_WORD}\\s+){1,3}${NAME_WORD}\\s*$`, 'u');
const NAME_LINE = new RegExp(`^[ \\t]*(?:${NAME_WORD}[ \\t]+){1,3}${NAME_WORD}[ \\t]*$`, 'gmu');
// Tên 1–3 chữ đứng sau từ xưng hô ("chị Phượng", "anh Tuấn Anh") — giữ từ xưng hô, che tên
// (không dùng cờ i: tên phải viết hoa chữ đầu; từ xưng hô nhận cả viết hoa đầu câu)
const KIN_WORDS = 'chị|anh|em|cô|chú|bác|bạn|cụ|thím|mợ|dì|cậu|ông|bà|thầy';
const KIN_ALT = KIN_WORDS.split('|').flatMap(w => [w, w[0].toUpperCase() + w.slice(1)]).join('|');
const KIN_NAME = new RegExp(`(?<![\\p{L}])(${KIN_ALT})\\s+(?:${NAME_WORD}\\s+){0,2}${NAME_WORD}(?![\\p{L}])`, 'gu');
const PSEUDONYM = /\b\p{Lu}\p{Ll}+\p{Lu}\p{Ll}+\d{2,5}\b/gu;
const MENTION = /@[\p{L}\p{N}._-]+/gu;

export function hideNames(text) {
  if (!text) return text ?? null;
  return text
    .replace(MENTION, '@…')
    .replace(NAME_LINE, '(ẩn tên)')
    .replace(KIN_NAME, (m, kin) => `${kin} (ẩn tên)`)
    .replace(PSEUDONYM, '(ẩn tên)')
    .replace(LEADING_NAME, '(ẩn tên)')
    .replace(TRAILING_NAME, ' (ẩn tên)');
}
