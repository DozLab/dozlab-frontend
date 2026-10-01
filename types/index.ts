export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface WebSocketMessage {
  type: string
  data: unknown
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