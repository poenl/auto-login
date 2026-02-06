import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const sitesTable = sqliteTable('sites', {
  id: int().primaryKey({ autoIncrement: true }),
  url: text(),
  storage: text(),
  cookie: text()
})
