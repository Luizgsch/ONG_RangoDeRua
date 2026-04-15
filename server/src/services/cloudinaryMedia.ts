import { v2 as cloudinary } from 'cloudinary'

function ensureConfigured(): void {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME?.trim() || !CLOUDINARY_API_KEY?.trim() || !CLOUDINARY_API_SECRET?.trim()) {
    throw new Error(
      'Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.',
    )
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME.trim(),
    api_key: CLOUDINARY_API_KEY.trim(),
    api_secret: CLOUDINARY_API_SECRET.trim(),
    secure: true,
  })
}

const FOLDER = 'rango_manual'

export async function uploadManualImage(buffer: Buffer): Promise<{ imageUrl: string; imageKey: string }> {
  ensureConfigured()
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        overwrite: false,
        use_filename: true,
        unique_filename: true,
      },
      (err, res) => {
        if (err || !res?.secure_url || !res.public_id) {
          reject(err ?? new Error('Resposta inválida do Cloudinary.'))
          return
        }
        resolve({ secure_url: res.secure_url, public_id: res.public_id })
      },
    )
    stream.end(buffer)
  })
  return { imageUrl: result.secure_url, imageKey: result.public_id }
}

export async function deleteManualImage(imageKey: string): Promise<void> {
  if (!imageKey?.trim()) return
  try {
    ensureConfigured()
    await cloudinary.uploader.destroy(imageKey.trim(), { resource_type: 'image' })
  } catch {
    /* não bloqueia exclusão no banco se o asset já sumiu */
  }
}
