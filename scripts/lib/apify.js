import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

const API = 'https://api.apify.com/v2';
const TERMINAL = ['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'];

// Đọc APIFY_API_TOKEN từ file .env (không in token ra log)
export function getApifyToken() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return null;
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/^APIFY_API_TOKEN=(.+)$/m);
  return match ? match[1].trim() : null;
}

// Giải thích mã lỗi HTTP thường gặp của Apify bằng lời dễ hiểu
function explainStatus(status) {
  if (status === 400) return 'Input gửi lên không hợp lệ với actor (kiểm tra "input" trong config/trend-sources.json).';
  if (status === 401) return 'APIFY_API_TOKEN sai hoặc đã bị thu hồi.';
  if (status === 402) return 'Tài khoản Apify hết tín dụng hoặc vượt hạn mức gói.';
  if (status === 403) return 'Token không có quyền chạy actor này.';
  if (status === 404) return 'Không tìm thấy actor — kiểm tra lại actor ID.';
  if (status === 429) return 'Gọi API quá nhiều lần — đợi một lúc rồi chạy lại.';
  if (status >= 500) return 'Lỗi phía máy chủ Apify — thử lại sau.';
  return '';
}

async function apiFetch(url, token, label, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      // Gửi token qua header thay vì query string để không lộ trong log/URL
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(90 * 1000)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') throw new Error(`${label}: quá 90 giây không có phản hồi từ Apify.`);
    throw new Error(`${label}: không kết nối được Apify (${err.message}).`);
  }
  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    throw new Error(`${label}: Apify trả lỗi HTTP ${response.status}. ${explainStatus(response.status)}\n   Chi tiết: ${body}`);
  }
  return response.json();
}

/**
 * Chạy 1 actor Apify: khởi động run, chờ tới khi xong, rồi đọc dataset.
 * (Không dùng run-sync-get-dataset-items vì endpoint đó giới hạn 300 giây và không trả
 * thông tin chi phí của run.)
 *
 * Trả về { items, run } — run gồm id, trạng thái, chi phí USD và số sự kiện bị tính phí.
 * Ném Error với thông báo rõ ràng khi lỗi. Với dryRun = true: chỉ in input, không gọi API.
 *
 * maxChargeUsd: trần chi phí cho run (actor tính phí theo sự kiện sẽ tự dừng khi chạm trần).
 */
export async function runActor(actorId, input, { timeoutSeconds = 300, dryRun = false, label = actorId, maxChargeUsd = null } = {}) {
  if (dryRun) {
    console.log(`\n🧪 [dry-run] ${label} → actor ${actorId}${maxChargeUsd ? ` (trần ${maxChargeUsd} USD)` : ''}`);
    console.log(JSON.stringify(input, null, 2));
    return { items: [], run: null };
  }

  const token = getApifyToken();
  if (!token) {
    throw new Error('Không tìm thấy APIFY_API_TOKEN trong file .env (copy từ .env.example rồi điền token).');
  }

  // Apify dùng dấu ~ thay cho / trong đường dẫn actor
  const actorPath = actorId.replace('/', '~');
  const params = new URLSearchParams({ timeout: String(timeoutSeconds), waitForFinish: '60' });
  if (maxChargeUsd) params.set('maxTotalChargeUsd', String(maxChargeUsd));

  let run = (await apiFetch(`${API}/acts/${actorPath}/runs?${params}`, token, label, {
    method: 'POST',
    body: JSON.stringify(input)
  })).data;

  const deadline = Date.now() + (timeoutSeconds + 60) * 1000;
  while (!TERMINAL.includes(run.status)) {
    if (Date.now() > deadline) {
      throw new Error(`${label}: run ${run.id} chạy quá ${timeoutSeconds + 60} giây vẫn chưa xong.`);
    }
    run = (await apiFetch(`${API}/actor-runs/${run.id}?waitForFinish=60`, token, label)).data;
  }

  if (run.status !== 'SUCCEEDED') {
    throw new Error(`${label}: run ${run.id} kết thúc với trạng thái ${run.status}${run.statusMessage ? ` — ${run.statusMessage}` : ''}.`);
  }

  const items = await apiFetch(`${API}/datasets/${run.defaultDatasetId}/items?clean=true&format=json`, token, label);
  if (!Array.isArray(items)) {
    throw new Error(`${label}: Apify trả về dữ liệu không phải mảng.`);
  }

  // Actor tính phí theo sự kiện cập nhật chi phí chậm vài giây sau khi run xong: đọc lại run
  // tới khi số sự kiện "result" khớp số item (tối đa ~10 giây) để báo đúng chi phí
  for (let i = 0; i < 5 && run.chargedEventCounts && (run.chargedEventCounts.result ?? 0) < items.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    run = (await apiFetch(`${API}/actor-runs/${run.id}`, token, label)).data;
  }

  return {
    items,
    run: {
      id: run.id,
      actor: actorId,
      status: run.status,
      usage_usd: run.usageTotalUsd ?? null,
      charged_events: run.chargedEventCounts ?? null,
      dataset_items: items.length
    }
  };
}
