<template>
  <!-- A page that isn't ready (composables/pages.ts) keeps its button, greyed out and not clickable -->
  <NuxtLink v-if="ready" :to="to" v-bind="$attrs">
    <slot />
  </NuxtLink>
  <span
    v-else
    v-bind="$attrs"
    role="link"
    aria-disabled="true"
    title="Not available yet"
    class="pointer-events-auto cursor-not-allowed opacity-40 select-none"
    @click.prevent
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ to: string, ready: boolean }>()
</script>
