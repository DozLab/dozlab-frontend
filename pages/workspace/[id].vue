<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink to="/dashboard" class="text-blue-600 hover:text-blue-500 font-medium">
      ← Dashboard
    </NuxtLink>

    <div class="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ session?.lab?.name || 'Lab session' }}
      </h1>
      <p class="mt-2 text-gray-600">
        Status: <span class="font-medium">{{ phase || 'loading…' }}</span>
        <span v-if="message" class="text-gray-500"> ({{ message }})</span>
      </p>

      <p v-if="error" class="mt-4 text-red-600">
        {{ error }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <!-- A new tab, not an iframe: code-server's login cookie is third-party inside
             dozlab.github.io and browsers block it (dozlab-api docs/decision.md) -->
        <a
          v-if="endpoints.vscode"
          :href="endpoints.vscode"
          target="_blank"
          rel="noopener"
          class="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500"
        >
          Open VS Code
        </a>
        <button
          v-if="endpoints.terminal"
          class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          @click="showTerminal = !showTerminal"
        >
          {{ showTerminal ? 'Close terminal' : 'Open terminal' }}
        </button>
        <span v-if="!endpoints.vscode && !error" class="text-gray-500">
          Waiting for the lab to start…
        </span>
      </div>

      <!-- On this page, unlike VS Code: the terminal is only a WebSocket, with no page of its own -->
      <SessionTerminal
        v-if="showTerminal && endpoints.terminal"
        class="mt-6"
        :endpoint="endpoints.terminal"
        :session-id="sessionId"
      />

      <p v-if="password" class="mt-4 text-sm text-gray-600">
        VS Code password: <code class="bg-gray-100 px-1 rounded">{{ password }}</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Not auto-imported: only the store itself (useLabsStore) is
import { useLabsApi, type LabSession } from '~/stores/labs'

const route = useRoute()
const labsApi = useLabsApi()
const sessionId = route.params.id as string

const session = ref<LabSession | null>(null)
const phase = ref('')
const message = ref('')
const endpoints = ref<Record<string, string>>({})
const error = ref('')
const showTerminal = ref(false)
// Only known right after creating the session (the API returns it once)
const password = useState<string>(`vscode-password-${sessionId}`)

let timer: ReturnType<typeof setInterval> | undefined

const load = async () => {
  try {
    const res = await labsApi.getLabSession(sessionId)
    session.value = res.session
    phase.value = res.k8s_status?.phase || res.session.status
    message.value = res.k8s_status?.message || ''
    endpoints.value = res.k8s_status?.endpoints || {}
    error.value = ''
    if (endpoints.value.vscode || phase.value === 'Failed') {
      clearInterval(timer)
    }
  } catch (err) {
    const e = err as { data?: { error?: string }, message?: string }
    error.value = e.data?.error || e.message || 'Failed to load the session'
  }
}

onMounted(() => {
  load()
  // The controller sets the endpoints once the pod is ready
  timer = setInterval(load, 3000)
})
onUnmounted(() => clearInterval(timer))
</script>
