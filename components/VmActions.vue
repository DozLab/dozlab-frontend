<template>
  <!-- Open and Delete for one VM. Delete asks first, in place, and a failed delete is
       shown here rather than replacing the list -->
  <div class="flex flex-col gap-2" :class="stacked ? 'items-stretch' : 'items-end'">
    <div v-if="!confirming" class="flex items-center gap-3" :class="stacked ? 'justify-between' : 'justify-end'">
      <NuxtLink :to="`/workspace/${sessionId}`" class="btn-secondary" :class="stacked ? 'flex-1' : ''">
        Open
      </NuxtLink>
      <button class="btn-danger" :disabled="stopping" @click="$emit('ask')">
        {{ stopping ? 'Deleting…' : 'Delete' }}
      </button>
    </div>

    <div
      v-else
      role="alertdialog"
      :aria-label="`Delete the ${labName} VM`"
      class="flex flex-col gap-3 rounded border border-danger/40 bg-danger-soft p-3 text-left text-sm"
      :class="stacked ? '' : 'max-w-xs'"
    >
      <p class="text-ink">
        Delete this {{ running ? 'running ' : '' }}<strong>{{ labName }}</strong> VM?
        Everything on it is lost.
      </p>
      <div class="flex gap-2">
        <button ref="cancelEl" class="btn-secondary flex-1 bg-paper" @click="$emit('cancel')">
          Cancel
        </button>
        <button class="btn-primary flex-1 !bg-danger !text-paper" @click="$emit('confirm')">
          Delete VM
        </button>
      </div>
    </div>

    <p v-if="error" class="text-sm text-danger" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  sessionId: string
  labName: string
  running: boolean
  confirming: boolean
  stopping: boolean
  error?: string
  stacked?: boolean
}>()
defineEmits<{ ask: [], cancel: [], confirm: [] }>()

// Focus moves to Cancel when the question appears, so Enter doesn't delete by accident
const cancelEl = ref<HTMLButtonElement | null>(null)
watch(() => props.confirming, async (open) => {
  if (open) {
    await nextTick()
    cancelEl.value?.focus()
  }
})
</script>
