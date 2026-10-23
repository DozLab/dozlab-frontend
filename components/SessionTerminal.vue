<template>
  <div class="overflow-hidden rounded border border-line bg-[#0b0d12]">
    <div class="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[0.8125rem] text-white/60">
      <span class="flex items-center gap-2">
        <span
          class="size-1.5 rounded-full"
          :class="state === 'connected' ? 'bg-emerald-400' : state === 'connecting' ? 'animate-pulse bg-amber-300' : 'bg-red-400'"
        />
        Terminal: {{ state }}
      </span>
      <button
        v-if="state === 'disconnected'"
        class="font-medium text-white hover:text-[#8fb3ee]"
        @click="connect"
      >
        Reconnect
      </button>
    </div>
    <div ref="el" class="h-[28rem] p-3" />
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

const term = new Terminal({
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  theme: { background: '#0b0d12', cursor: '#8fb3ee', selectionBackground: '#4f83dd55' }
})
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
