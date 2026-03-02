import { InferSelectModel } from 'drizzle-orm'
import { int, text, sqliteTable, blob, integer } from 'drizzle-orm/sqlite-core'
import { SiteState } from '../lib/common'

export const sitesTable = sqliteTable('sites', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  url: text().unique().notNull(),
  storage: text(),
  cookie: text(),
  state: text().notNull().$type<SiteState>(),
  screenshot: blob({ mode: 'buffer' }),
  interval: text().notNull(),
  createdAt: int().notNull().default(Date.now()),
  updatedAt: int().notNull().default(Date.now())
})

export type SiteSchema = InferSelectModel<typeof sitesTable>

export const recordsTable = sqliteTable('records', {
  id: int().primaryKey({ autoIncrement: true }),
  siteId: integer()
    .references(() => sitesTable.id, { onDelete: 'cascade' })
    .notNull(),
  state: text().notNull().$type<SiteState>(),
  screenshot: blob({ mode: 'buffer' }).notNull(),
  createdAt: int().notNull().default(Date.now())
})

export type RecordSchema = InferSelectModel<typeof recordsTable>
