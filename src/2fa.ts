import { createHmac } from 'crypto'

function base32Decode(str: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (let char of str.toUpperCase()) {
    if (char === '=') break
    const index = alphabet.indexOf(char)
    if (index === -1) throw new Error('Invalid base32 character')
    bits += index.toString(2).padStart(5, '0')
  }
  const bytes: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    const byteStr = bits.slice(i, i + 8)
    if (byteStr.length === 8) {
      bytes.push(parseInt(byteStr, 2))
    }
  }
  return Buffer.from(bytes)
}

function generateTOTP(secret: string, timeStep: number = 30): string {
  const key = base32Decode(secret)
  const time = Math.floor(Date.now() / 1000 / timeStep)
  const timeBuffer = Buffer.alloc(8)
  timeBuffer.writeBigUInt64BE(BigInt(time))
  const hmac = createHmac('sha1', key)
  hmac.update(timeBuffer)
  const hash = hmac.digest()
  const offset = (hash[hash.length - 1] as number) & 0xf
  const code = (hash.readUInt32BE(offset) & 0x7fffffff) % 1000000
  return code.toString().padStart(6, '0')
}
