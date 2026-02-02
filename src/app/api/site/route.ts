import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const res = await request.json()
  console.log('🚀 ~ POST ~ res:', res)
  return new Response('Hello, Next.js!')
}
