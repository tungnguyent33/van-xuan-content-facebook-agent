// Che tên người dùng còn sót trong NỘI DUNG bình luận (các trường tên/ảnh/id đã bị bỏ khi chuẩn hóa).
// Facebook chèn tên người được trả lời vào đầu bình luận ("Nguyễn Văn A bạn thử..."), nhóm ẩn danh
// dùng biệt danh dạng "SpiritedKangaroo9248"; TikTok/YouTube dùng "@tên"; bài diễn đàn hay có dòng
// chỉ ghi tên người đăng.
// Đây là heuristic: bắt được tên 2–4 chữ viết hoa ở đầu/cuối câu hoặc đứng riêng 1 dòng, không bắt
// được tên 1 chữ giữa câu. Skill topic-scoring vẫn phải tự kiểm tra lại trước khi trích bình luận.

const NAME_WORD = '\\p{Lu}[\\p{Ll}\\p{M}]+';
const LEADING_NAME = new RegExp(`^(?:${NAME_WORD}\\s+){1,3}${NAME_WORD}(?=[\\s,:]+[\\p{Ll}\\d"'(])`, 'u');
const TRAILING_NAME = new RegExp(`\\s(?:${NAME_WORD}\\s+){1,3}${NAME_WORD}\\s*$`, 'u');
const NAME_LINE = new RegExp(`^[ \\t]*(?:${NAME_WORD}[ \\t]+){1,3}${NAME_WORD}[ \\t]*$`, 'gmu');
const PSEUDONYM = /\b\p{Lu}\p{Ll}+\p{Lu}\p{Ll}+\d{2,5}\b/gu;
const MENTION = /@[\p{L}\p{N}._-]+/gu;

export function hideNames(text) {
  if (!text) return text ?? null;
  return text
    .replace(MENTION, '@…')
    .replace(NAME_LINE, '(ẩn tên)')
    .replace(PSEUDONYM, '(ẩn tên)')
    .replace(LEADING_NAME, '(ẩn tên)')
    .replace(TRAILING_NAME, ' (ẩn tên)');
}
