import fs from 'node:fs/promises'
import path from 'node:path'

export const GET = async (_: unknown, { params }: { params: Promise<{ path: string[] }> }) => {
  const { path: requestedPath } = await params
  const filePath = path.join(process.cwd(), '/config/assets', ...requestedPath)

  try {
    const file = await fs.readFile(filePath)
    const fileType = path.extname(filePath).slice(1)
    return new Response(file, {
      headers: {
        'content-type': `image/${fileType}`
      }
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
