/**
 * Prepare a photo for submission.
 *
 * Reports go through our API routes now (not straight to Supabase), and
 * Vercel caps a request body at 4.5 MB. A phone photo is often 3–8 MB as a
 * data URL, so anything large is scaled down in the browser first. Small
 * photos are passed through untouched.
 *
 * The evidence hash is still computed from the ORIGINAL file bytes (see
 * hash.ts), so the tamper-proof hash matches the photo the reporter keeps.
 * EXIF is extracted from the original file separately, before this runs.
 */

// ~1.5 MB of base64. Leaves plenty of headroom under Vercel's 4.5 MB limit
// once the rest of the JSON body (EXIF, notes) is added.
const MAX_DATA_URL_CHARS = 1_500_000;
const MAX_EDGE_PX = 2048;

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

export async function prepareUploadDataUrl(file: File): Promise<string> {
  const original = await readAsDataUrl(file);
  if (original.length <= MAX_DATA_URL_CHARS) return original;

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    // Not decodable as an image (HEIC on some browsers). Send as-is and let
    // the server reject it with a clear message rather than failing silently.
    return original;
  }

  const scale = Math.min(1, MAX_EDGE_PX / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Step quality down until it fits
  for (const quality of [0.85, 0.75, 0.65, 0.55]) {
    const out = canvas.toDataURL("image/jpeg", quality);
    if (out.length <= MAX_DATA_URL_CHARS) return out;
  }
  return canvas.toDataURL("image/jpeg", 0.45);
}
