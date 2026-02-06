import { drizzle } from 'drizzle-orm/better-sqlite3'

const db = drizzle('/tmp/test.db')

export default db
