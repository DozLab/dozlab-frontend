<template>
  <div class="page-frame pt-10 md:pt-16">
    <!-- Back to My VMs for instructors; students' Dashboard is greyed out until it exists -->
    <NuxtLink v-if="authStore.canManageVMs" to="/vms" class="lx-link text-sm text-subtle">
      ← My VMs
    </NuxtLink>
    <ReadyLink v-else to="/dashboard" :ready="pageReady.dashboard" class="lx-link text-sm text-subtle">
      ← Dashboard
    </ReadyLink>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <p class="lx-label">
        Workspace
      </p>
      <span class="chip" :class="phaseChip" role="status">
        {{ phase || 'loading…' }}
      </span>
    </div>
    <h1 class="display lx-rise mt-4 text-5xl sm:text-6xl">
      {{ session?.lab?.name || 'Lab session' }}
    </h1>
    <p v-if="message" class="mt-4 text-subtle">
      {{ message }}
    </p>

    <p v-if="error" class="notice-error mt-6 max-w-2xl" role="alert">
      {{ error }}
    </p>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <!-- A new tab, not an iframe: code-server's login cookie is third-party inside
           dozlab.github.io and browsers block it (dozlab-api docs/decision.md) -->
      <a
        v-if="endpoints.vscode"
        :href="endpoints.vscode"
        target="_blank"
        rel="noopener"
        class="btn-primary"
      >
        Open VS Code ↗
      </a>
      <button
        v-if="endpoints.terminal"
        class="btn-secondary"
        @click="showTerminal = !showTerminal"
      >
        {{ showTerminal ? 'Close terminal' : 'Open terminal' }}
      </button>
      <span v-if="!endpoints.vscode && !error" class="text-subtle">
        Waiting for the lab to start…
      </span>
    </div>

    <p v-if="password" class="mt-5 text-sm text-subtle">
      VS Code password:
      <code class="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-ink">{{ password }}</code>
    </p>

    <!-- On this page, unlike VS Code: the terminal is only a WebSocket, with no page of its own -->
    <SessionTerminal
      v-if="showTerminal && endpoints.terminal"
      class="mt-8"
      :endpoint="endpoints.terminal"
      :session-id="sessionId"
    />
  </div>
</template>

<script setup lang="ts">
// Not auto-imported: only the store itself (useLabsStore) is
import { useLabsApi, type LabSession } from '~/stores/labs'

const route = useRoute()
const authStore = useAuthStore()
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

// The state chip: green once running, red on failure, pulsing while it starts
const phaseChip = computed(() => {
  if (phase.value === 'Failed' || error.value) return 'chip-error'
  if (endpoints.value.vscode) return 'chip-live'
  return 'chip-wait'
})

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
