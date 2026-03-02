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

// 状态中文
export const stateMap: Record<SiteState, string> = {
  initializing: '初始化',
  running: '运行中',
  checking: '检查中',
  success: '成功',
  failed: '失败',
  timeout: '超时'
}
