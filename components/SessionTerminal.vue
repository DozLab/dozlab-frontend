<template>
  <div>
    <div class="flex items-center justify-between text-sm text-gray-600">
      <span>Terminal: {{ state }}</span>
      <button
        v-if="state === 'disconnected'"
        class="text-blue-600 hover:text-blue-500 font-medium"
        @click="connect"
      >
        Reconnect
      </button>
    </div>
    <div ref="el" class="mt-2 h-96 rounded-md bg-black p-2" />
  </div>
</template>

<script setup lang="ts">
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

// endpoint is the session's terminal URL from the controller (https://…/sessions/{id}/terminal/)
const props = defineProps<{ endpoint: string, sessionId: string }>()

const el = ref<HTMLElement | null>(null)
const state = ref<'connecting' | 'connected' | 'disconnected'>('connecting')

const term = new Terminal({ cursorBlink: true, fontSize: 14 })
const fit = new FitAddon()
term.loadAddon(fit)

let ws: WebSocket | undefined

// The terminal sidecar's messages: input and resize go up, output comes down
const send = (msg: { type: 'input', data: string } | { type: 'resize', cols: number, rows: number }) => {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
}

const connect = () => {
  // The sidecar serves the WebSocket at /terminal, under the session's terminal route
  const url = new URL('terminal', props.endpoint.endsWith('/') ? props.endpoint : `${props.endpoint}/`)
  url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:'
  // The sidecar keeps one shell per session_id and closes it when its connection ends, so
  // each connection gets its own
  url.searchParams.set('session_id', `${props.sessionId}-${Date.now()}`)

  state.value = 'connecting'
  const socket = new WebSocket(url)
  ws = socket
  socket.onopen = () => {
    state.value = 'connected'
    fit.fit()
    send({ type: 'resize', cols: term.cols, rows: term.rows })
    term.focus()
  }
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data) as { type: string, data: string }
    if (msg.type === 'output') term.write(msg.data)
  }
  socket.onclose = () => {
    // A newer connection may already have replaced this one
    if (ws === socket) state.value = 'disconnected'
  }
}

const onWindowResize = () => fit.fit()

onMounted(() => {
  term.open(el.value!)
  fit.fit()
  term.onData(data => send({ type: 'input', data }))
  term.onResize(({ cols, rows }) => send({ type: 'resize', cols, rows }))
  window.addEventListener('resize', onWindowResize)
  connect()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  ws?.close()
  term.dispose()
})
</script>
