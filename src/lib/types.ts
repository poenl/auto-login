// 获取对象的路径
export type Paths<T, Prefix extends string = ''> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Record<string, unknown>
    ? Paths<NonNullable<T[K]>, `${Prefix}${K & string}.`> | `${Prefix}${K & string}`
    : never // 原始类型不生成路径
}[keyof T]
// 获取对象的路径类型
export type DeepPropType<T, P extends Paths<T>> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? DeepPropType<Exclude<T[K], undefined>, R> | (undefined extends T[K] ? undefined : never)
    : never
  : P extends keyof T
    ? T[P]
    : never
