<template>
  <div class="flex min-h-screen flex-col bg-paper text-ink">
    <header class="page-frame flex h-16 items-center">
      <NuxtLink to="/" class="text-[0.9375rem] font-semibold tracking-tight">
        DoZLab
      </NuxtLink>
    </header>

    <!-- Lexington split: label and heading on the left, the form on the right -->
    <main class="page-frame grid flex-1 content-start gap-y-10 pt-10 pb-24 md:grid-cols-12 md:gap-x-8 md:pt-24">
      <div class="md:col-span-5 lg:col-span-6">
        <p class="lx-label lx-rise">
          {{ label }}
        </p>
        <h1 class="display lx-rise lx-rise-2 mt-4 text-5xl sm:text-6xl">
          {{ title }}
        </h1>
        <p class="lx-rise lx-rise-3 mt-5 max-w-md text-subtle text-pretty">
          {{ lede }}
        </p>
      </div>
      <div class="md:col-span-7 lg:col-span-5 lg:col-start-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string, title: string, lede: string }>()
</script>
