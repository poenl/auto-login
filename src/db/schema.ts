import { InferSelectModel } from 'drizzle-orm'
import { int, text, sqliteTable, blob, integer } from 'drizzle-orm/sqlite-core'

export enum SiteState {
  // 初始化
  Initializing = 'initializing',
  // 成功
  Success = 'success',
  // 失败
  Failed = 'failed',
  // 正在运行
  Running = 'running',
  // 检查中
  Checking = 'checking',
  // 超时
  Timeout = 'timeout'
}

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
    .references(() => sitesTable.id)
    .notNull(),
  state: text().notNull().$type<SiteState>(),
  screenshot: blob({ mode: 'buffer' }).notNull(),
  createdAt: int().notNull().default(Date.now())
})

export type RecordSchema = InferSelectModel<typeof recordsTable>
