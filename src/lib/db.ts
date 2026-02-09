import { drizzle } from 'drizzle-orm/libsql'

const db = drizzle('file:config/config.db')

export default db
