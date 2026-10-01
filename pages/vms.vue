<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900">
      My VMs
    </h1>
    <p class="mt-1 text-gray-600">
      Create a lab VM, see what it will take before you create it, and what your VMs hold now.
    </p>

    <p v-if="loading" class="mt-6 text-gray-500">
      Loading…
    </p>

    <!-- Students: the API refuses these calls, so say why instead of showing errors -->
    <div v-else-if="!authStore.canManageVMs" class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p class="text-gray-700">
        Only instructors and admins can create VMs here.
      </p>
      <NuxtLink to="/dashboard" class="mt-3 inline-block text-blue-600 hover:text-blue-500 font-medium">
        ← Dashboard
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Create a VM -->
      <section class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900">
          Create a VM
        </h2>

        <p v-if="labsError" class="mt-3 text-red-600">
          {{ labsError }}
        </p>
        <p v-else-if="labs.length === 0" class="mt-3 text-gray-500">
          There are no labs yet.
        </p>

        <div v-else class="mt-4">
          <label for="lab" class="block text-sm font-medium text-gray-700">Lab</label>
          <select
            id="lab"
            v-model="selectedLabId"
            class="mt-1 w-full sm:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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
          <fieldset class="mt-6">
            <legend class="text-sm font-medium text-gray-700">
              When the VM stops
            </legend>
            <div class="mt-2 space-y-2">
              <label class="flex items-start gap-3">
                <input
                  v-model="persistence"
                  type="radio"
                  value="none"
                  class="mt-1"
                >
                <span>
                  <span class="font-medium text-gray-900">Non-persistent</span>
                  <span class="block text-sm text-gray-600">
                    A clean VM every start. Everything on it is gone when it stops. The fastest start.
                  </span>
                </span>
              </label>
              <label class="flex items-start gap-3 opacity-60">
                <input type="radio" disabled class="mt-1">
                <span>
                  <span class="font-medium text-gray-900">Persistent: keep files</span>
                  <span class="block text-sm text-gray-600">
                    Not available yet.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <!-- The estimate, before anything is created -->
          <p v-if="estimateError" class="mt-6 text-red-600">
            {{ estimateError }}
          </p>
          <p v-else-if="!estimate" class="mt-6 text-gray-500">
            Working out what this VM will take…
          </p>
          <div v-else class="mt-6">
            <h3 class="text-sm font-medium text-gray-700">
              What this VM will take
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              The VM has {{ estimate.vm.vcpus }} vCPU{{ estimate.vm.vcpus === 1 ? '' : 's' }},
              {{ formatMiB(estimate.vm.memory_mib) }} of memory and a {{ estimate.vm.disk_gib }} GiB disk.
            </p>

            <div class="mt-3 overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-500 border-b border-gray-200">
                    <th class="py-2 pr-4 font-medium">
                      Part
                    </th>
                    <th class="py-2 pr-4 font-medium">
                      Reserved
                    </th>
                    <th class="py-2 font-medium">
                      At most
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="part in estimate.containers" :key="part.name" class="border-b border-gray-100">
                    <td class="py-2 pr-4 text-gray-900">
                      {{ part.purpose }}
                    </td>
                    <td class="py-2 pr-4 text-gray-700">
                      {{ formatAmount(part.reserved) }}
                    </td>
                    <td class="py-2 text-gray-700">
                      {{ formatAmount(part.maximum) }}
                    </td>
                  </tr>
                  <tr class="font-semibold text-gray-900">
                    <td class="py-2 pr-4">
                      Total
                    </td>
                    <td class="py-2 pr-4">
                      {{ formatAmount(estimate.total.reserved) }}
                    </td>
                    <td class="py-2">
                      {{ formatAmount(estimate.total.maximum) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul class="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>
                <span class="font-medium text-gray-900">Reserved</span> is set aside for the VM while it runs, so it
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

            <p v-if="createError" class="mt-4 text-red-600">
              {{ createError }}
            </p>
            <button
              class="btn-primary mt-4 disabled:opacity-50"
              :disabled="creating"
              @click="createVM"
            >
              {{ creating ? 'Creating…' : 'Create VM' }}
            </button>
          </div>
        </template>
      </section>

      <!-- What the VMs hold now -->
      <section class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ authStore.isAdmin ? 'All VMs' : 'Your VMs' }}
          </h2>
          <button class="text-sm text-blue-600 hover:text-blue-500 font-medium" @click="loadUsage">
            Refresh
          </button>
        </div>

        <p v-if="usageError" class="mt-3 text-red-600">
          {{ usageError }}
        </p>
        <p v-else-if="!usage" class="mt-3 text-gray-500">
          Loading…
        </p>
        <p v-else-if="usage.labs.length === 0" class="mt-3 text-gray-500">
          No VMs.
        </p>

        <template v-else>
          <p class="mt-3 text-sm text-gray-700">
            {{ usage.total.vms }} VM{{ usage.total.vms === 1 ? '' : 's' }}, {{ usage.total.running_vms }} running.
            Reserved now: {{ formatAmount(usage.total) }}. Storage held: {{ formatMiB(usage.total.storage_mib) }}.
          </p>

          <div v-for="lab in usage.labs" :key="lab.lab_id" class="mt-6">
            <h3 class="font-medium text-gray-900">
              {{ lab.lab_name }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ lab.total.vms }} VM{{ lab.total.vms === 1 ? '' : 's' }}, {{ lab.total.running_vms }} running ·
              {{ formatAmount(lab.total) }} · {{ formatMiB(lab.total.storage_mib) }} storage
            </p>

            <div class="mt-2 overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-500 border-b border-gray-200">
                    <th class="py-2 pr-4 font-medium">
                      State
                    </th>
                    <th class="py-2 pr-4 font-medium">
                      Reserved
                    </th>
                    <th class="py-2 pr-4 font-medium">
                      Storage
                    </th>
                    <th class="py-2 pr-4 font-medium">
                      Created
                    </th>
                    <th class="py-2 font-medium">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="vm in lab.vms" :key="vm.session_id" class="border-b border-gray-100">
                    <td class="py-2 pr-4">
                      <span
                        class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="vm.usage?.running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'"
                      >
                        {{ vm.phase || vm.status }}
                      </span>
                    </td>
                    <td class="py-2 pr-4 text-gray-700">
                      {{ vm.usage ? (vm.usage.running ? formatAmount(vm.usage) : 'nothing') : 'not reported yet' }}
                    </td>
                    <td class="py-2 pr-4 text-gray-700">
                      {{ vm.usage ? formatMiB(vm.usage.storage_mib) : '–' }}
                    </td>
                    <td class="py-2 pr-4 text-gray-500">
                      {{ formatDate(vm.created_at) }}
                    </td>
                    <td class="py-2 text-right whitespace-nowrap">
                      <NuxtLink :to="`/workspace/${vm.session_id}`" class="text-blue-600 hover:text-blue-500 font-medium">
                        Open
                      </NuxtLink>
                      <button
                        class="ml-4 text-red-600 hover:text-red-500 font-medium disabled:opacity-50"
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
