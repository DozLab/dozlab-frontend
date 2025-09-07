export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface TerminalMessage extends WebSocketMessage {
  type: 'terminal'
  data: {
    sessionId: string
    output: string
  }
}

export interface FileSystemMessage extends WebSocketMessage {
  type: 'filesystem'
  data: {
    sessionId: string
    action: 'create' | 'update' | 'delete'
    path: string
    content?: string
  }
}

export interface StatusMessage extends WebSocketMessage {
  type: 'status'
  data: {
    sessionId: string
    status: 'starting' | 'running' | 'stopped' | 'error'
    message?: string
  }
}