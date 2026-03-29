const CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djh3yrih2";
const PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  "rebookindia_uploads";

// Upload image → returns Cloudinary URL
export async function uploadToCloudinary(
  file: File,
  folder: string = "rebookindia"
): Promise<{ url: string; publicId: string }> {
  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rebookindia_uploads";
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}


// Get optimized URL from Cloudinary
export function optimizeImage(
  url: string,
  width = 300,
  height = 400
): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
  );
}

// Smart image URL — tries Cloudinary first,
// then Open Library, then placeholder
export function getBookImage(
  cloudUrl?: string,
  isbn?: string,
  title?: string
): string {
  if (cloudUrl && cloudUrl.includes("cloudinary"))
    return cloudUrl;
  if (isbn)
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  return `https://placehold.co/180x240/1B3A6B/white?text=${
    encodeURIComponent(title?.slice(0, 12) || "Book")
  }`;
}
