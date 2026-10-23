<template>
  <div class="page-frame pt-10 md:pt-16">
    <p class="lx-label lx-rise">
      Instructors
    </p>
    <h1 class="display lx-rise lx-rise-2 mt-4 text-5xl sm:text-6xl">
      My VMs
    </h1>
    <p class="lx-rise lx-rise-3 mt-5 max-w-xl text-subtle text-pretty">
      Create a lab VM, see what it will take before you create it, and what your VMs hold now.
    </p>

    <p v-if="loading" class="mt-12 text-subtle" role="status">
      Loading…
    </p>

    <!-- Students: the API refuses these calls, so say why instead of showing errors -->
    <div v-else-if="!authStore.canManageVMs" class="lx-section mt-12">
      <p class="lx-label">
        Access
      </p>
      <div class="lx-body">
        <p>Only instructors and admins can create VMs here.</p>
        <ReadyLink to="/dashboard" :ready="pageReady.dashboard" class="lx-link mt-3">
          ← Dashboard
        </ReadyLink>
      </div>
    </div>

    <template v-else>
      <!-- Create a VM -->
      <section class="lx-section mt-12">
        <p class="lx-label">
          Create a VM
        </p>
        <div class="lx-body">
          <p v-if="labsError" class="notice-error" role="alert">
            {{ labsError }}
          </p>
          <p v-else-if="labs.length === 0" class="text-subtle">
            There are no labs yet.
          </p>

          <div v-else>
            <label for="lab" class="field-label">Lab</label>
            <select id="lab" v-model="selectedLabId" class="input-field sm:max-w-md">
              <option value="">
                Choose a lab…
              </option>
              <option v-for="lab in labs" :key="lab.id" :value="lab.id">
                {{ lab.name }}{{ lab.is_published ? '' : ' (not published)' }}
              </option>
            </select>
          </div>

          <template v-if="selectedLabId">
            <!-- Options -->
            <fieldset class="mt-8">
              <legend class="field-label">
                When the VM stops
              </legend>
              <div class="grid gap-3 sm:grid-cols-2">
                <label
                  class="flex cursor-pointer items-start gap-3 rounded border p-4 transition-colors"
                  :class="persistence === 'none' ? 'border-ink' : 'border-line hover:border-subtle'"
                >
                  <input v-model="persistence" type="radio" value="none" class="mt-1">
                  <span>
                    <span class="font-medium">Non-persistent</span>
                    <span class="mt-1 block text-sm text-subtle">
                      A clean VM every start. Everything on it is gone when it stops. The fastest start.
                    </span>
                  </span>
                </label>
                <label class="flex cursor-not-allowed items-start gap-3 rounded border border-line p-4 opacity-40">
                  <input type="radio" disabled class="mt-1">
                  <span>
                    <span class="font-medium">Persistent: keep files</span>
                    <span class="mt-1 block text-sm text-subtle">
                      Not available yet.
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            <!-- The estimate, before anything is created -->
            <p v-if="estimateError" class="notice-error mt-8" role="alert">
              {{ estimateError }}
            </p>
            <p v-else-if="!estimate" class="mt-8 text-subtle" role="status">
              Working out what this VM will take…
            </p>
            <div v-else class="mt-10">
              <h2 class="text-xl font-medium tracking-tight">
                What this VM will take
              </h2>
              <p class="mt-2 text-subtle">
                The VM has {{ estimate.vm.vcpus }} vCPU{{ estimate.vm.vcpus === 1 ? '' : 's' }},
                {{ formatMiB(estimate.vm.memory_mib) }} of memory and a {{ estimate.vm.disk_gib }} GiB disk.
              </p>

              <div class="mt-5 overflow-x-auto">
                <table class="lx-table">
                  <thead>
                    <tr>
                      <th>Part</th>
                      <th>Reserved</th>
                      <th>At most</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="part in estimate.containers" :key="part.name">
                      <td>{{ part.purpose }}</td>
                      <td class="text-subtle">
                        {{ formatAmount(part.reserved) }}
                      </td>
                      <td class="text-subtle">
                        {{ formatAmount(part.maximum) }}
                      </td>
                    </tr>
                    <tr class="font-medium">
                      <td>Total</td>
                      <td>{{ formatAmount(estimate.total.reserved) }}</td>
                      <td>{{ formatAmount(estimate.total.maximum) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ul class="mt-5 space-y-2 text-sm text-subtle">
                <li>
                  <span class="font-medium text-ink">Reserved</span> is set aside for the VM while it runs, so it
                  limits how many VMs fit on a node.
                </li>
                <li>
                  Storage while running: {{ formatMiB(estimate.storage.volumes_mib) }} in volumes, and up to
                  {{ formatMiB(estimate.storage.node_local_limit_mib) }} of temporary space on the node.
                </li>
                <li>
                  Storage after it stops:
                  {{ estimate.storage.after_stop_mib === 0 ? 'none' : formatMiB(estimate.storage.after_stop_mib) }}.
                </li>
              </ul>

              <p v-if="createError" class="notice-error mt-6" role="alert">
                {{ createError }}
              </p>
              <button class="btn-primary mt-6" :disabled="creating" @click="createVM">
                {{ creating ? 'Creating…' : 'Create VM' }}
              </button>
            </div>
          </template>
        </div>
      </section>

      <!-- What the VMs hold now -->
      <section class="lx-section">
        <div class="flex items-start justify-between md:col-span-4 md:block">
          <p class="lx-label">
            {{ authStore.isAdmin ? 'All VMs' : 'Your VMs' }}
          </p>
          <button class="lx-link text-sm md:mt-3" @click="loadUsage">
            Refresh ↻
          </button>
        </div>

        <div class="lx-body">
          <p v-if="usageError" class="notice-error" role="alert">
            {{ usageError }}
          </p>
          <p v-else-if="!usage" class="text-subtle" role="status">
            Loading…
          </p>
          <p v-else-if="usage.labs.length === 0" class="text-subtle">
            No VMs.
          </p>

          <template v-else>
            <p class="text-subtle">
              {{ usage.total.vms }} VM{{ usage.total.vms === 1 ? '' : 's' }}, {{ usage.total.running_vms }} running.
              Reserved now: {{ formatAmount(usage.total) }}. Storage held: {{ formatMiB(usage.total.storage_mib) }}.
            </p>

            <div v-for="lab in usage.labs" :key="lab.lab_id" class="mt-10">
              <h2 class="text-xl font-medium tracking-tight">
                {{ lab.lab_name }}
              </h2>
              <p class="mt-1 text-sm text-subtle">
                {{ lab.total.vms }} VM{{ lab.total.vms === 1 ? '' : 's' }}, {{ lab.total.running_vms }} running ·
                {{ formatAmount(lab.total) }} · {{ formatMiB(lab.total.storage_mib) }} storage
              </p>

              <div class="mt-4 overflow-x-auto">
                <table class="lx-table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Reserved</th>
                      <th>Storage</th>
                      <th>Created</th>
                      <th><span class="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="vm in lab.vms" :key="vm.session_id">
                      <td>
                        <span class="chip" :class="vm.usage?.running ? 'chip-live' : ''">
                          {{ vm.phase || vm.status }}
                        </span>
                      </td>
                      <td class="text-subtle">
                        {{ vm.usage ? (vm.usage.running ? formatAmount(vm.usage) : 'nothing') : 'not reported yet' }}
                      </td>
                      <td class="text-subtle">
                        {{ vm.usage ? formatMiB(vm.usage.storage_mib) : '–' }}
                      </td>
                      <td class="whitespace-nowrap text-subtle">
                        {{ formatDate(vm.created_at) }}
                      </td>
                      <td class="whitespace-nowrap text-right">
                        <NuxtLink :to="`/workspace/${vm.session_id}`" class="lx-link">
                          Open →
                        </NuxtLink>
                        <button
                          class="btn-danger ml-2 min-h-9"
                          :disabled="stopping === vm.session_id"
                          @click="stopVM(vm.session_id)"
                        >
                          {{ stopping === vm.session_id ? 'Deleting…' : 'Delete' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  useLabsApi,
  type Lab,
  type LabEstimate,
  type Persistence,
  type ResourceAmount,
  type UsageReport
} from '~/stores/labs'

const authStore = useAuthStore()
const labsStore = useLabsStore()
const labsApi = useLabsApi()

const loading = ref(true)
const labs = ref<Lab[]>([])
const labsError = ref('')

const selectedLabId = ref('')
const persistence = ref<Persistence>('none')
const estimate = ref<LabEstimate | null>(null)
const estimateError = ref('')
const creating = ref(false)
const createError = ref('')

const usage = ref<UsageReport | null>(null)
const usageError = ref('')
const stopping = ref('')

// The API's own message when it gives one
const messageOf = (err: unknown, fallback: string) => {
  const e = err as { data?: { error?: string }, message?: string }
  return e.data?.error || e.message || fallback
}

// 850 -> "0.85 CPU", 2000 -> "2 CPU"
const formatCPU = (millicores: number) => `${Number((millicores / 1000).toFixed(2))} CPU`
// 640 -> "640 MiB", 1920 -> "1.9 GiB"
const formatMiB = (mib: number) => (mib < 1024 ? `${mib} MiB` : `${Number((mib / 1024).toFixed(1))} GiB`)
const formatAmount = (amount: ResourceAmount) => `${formatCPU(amount.cpu_millicores)}, ${formatMiB(amount.memory_mib)}`
const formatDate = (iso: string) => new Date(iso).toLocaleString()

const loadLabs = async () => {
  try {
    labs.value = (await labsApi.listLabs({ limit: 100 })).labs
    labsError.value = ''
  } catch (err) {
    labsError.value = messageOf(err, 'Failed to load the labs')
  }
}

const loadUsage = async () => {
  try {
    usage.value = await labsApi.getUsage()
    usageError.value = ''
  } catch (err) {
    usageError.value = messageOf(err, 'Failed to load the VMs')
  }
}

// The estimate follows the chosen lab; a slow answer for an earlier choice is dropped
watch([selectedLabId, persistence], async ([labId, option]) => {
  estimate.value = null
  estimateError.value = ''
  createError.value = ''
  if (!labId) return
  try {
    const res = await labsApi.getLabEstimate(labId, option)
    if (selectedLabId.value === labId) {
      estimate.value = res.estimate
    }
  } catch (err) {
    if (selectedLabId.value === labId) {
      estimateError.value = messageOf(err, 'Failed to work out the estimate')
    }
  }
})

const createVM = async () => {
  creating.value = true
  createError.value = ''
  try {
    // Sends the lab only: non-persistent is the API's default and its only option today
    const session = await labsStore.createSession(selectedLabId.value)
    await navigateTo(`/workspace/${session.id}`)
  } catch (err) {
    createError.value = messageOf(err, 'Failed to create the VM')
  } finally {
    creating.value = false
  }
}

const stopVM = async (sessionId: string) => {
  stopping.value = sessionId
  try {
    await labsStore.stopSession(sessionId)
    await loadUsage()
  } catch (err) {
    usageError.value = messageOf(err, 'Failed to delete the VM')
  } finally {
    stopping.value = ''
  }
}

onMounted(async () => {
  // The layout does this too, but a page is mounted before its layout
  await authStore.initializeAuth()
  if (authStore.canManageVMs) {
    await Promise.all([loadLabs(), loadUsage()])
  }
  loading.value = false
})
</script>
