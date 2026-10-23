<template>
  <header class="lx-chrome sticky top-0 z-40">
    <nav aria-label="Main" class="page-frame">
      <div class="grid h-16 grid-cols-[1fr_auto] items-center sm:grid-cols-12">
        <NuxtLink :to="homePath" class="text-[0.9375rem] font-semibold tracking-tight sm:col-span-3">
          DoZLab
        </NuxtLink>

        <!-- Only pages that work are linked (composables/pages.ts) -->
        <div class="hidden items-center gap-6 sm:col-span-6 sm:flex">
          <ReadyLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            :ready="item.ready"
            class="text-sm text-subtle transition-colors hover:text-ink"
            active-class="!text-ink"
          >
            {{ item.label }}
          </ReadyLink>
        </div>

        <div class="hidden items-center justify-end gap-4 sm:col-span-3 sm:flex">
          <!-- Greyed out until there are notifications (composables/pages.ts) -->
          <button
            type="button"
            :disabled="!pageReady.notifications"
            :title="pageReady.notifications ? undefined : 'Not available yet'"
            class="rounded-full p-1 text-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-subtle"
          >
            <span class="sr-only">View notifications</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
            </svg>
          </button>

          <div ref="userMenuEl" class="relative">
            <button
              class="flex items-center gap-2 rounded-full text-sm transition-transform active:scale-95"
              :aria-expanded="showUserMenu"
              aria-haspopup="menu"
              @click="showUserMenu = !showUserMenu"
            >
              <span class="sr-only">Open user menu</span>
              <span class="flex size-8 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
                {{ initial }}
              </span>
            </button>

            <Transition name="lx-pop">
              <div
                v-if="showUserMenu"
                role="menu"
                class="absolute right-0 mt-2 w-60 origin-top-right rounded border border-line bg-paper py-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)]"
                @click="showUserMenu = false"
              >
                <div class="border-b border-line px-4 py-3">
                  <p class="truncate text-sm font-medium">
                    {{ authStore.fullName }}
                  </p>
                  <p class="truncate text-sm text-subtle">
                    {{ authStore.user?.email }}
                  </p>
                </div>
                <ReadyLink
                  to="/profile"
                  :ready="pageReady.profile"
                  role="menuitem"
                  class="block px-4 py-2.5 text-sm hover:bg-surface"
                >
                  Your Profile
                </ReadyLink>
                <button
                  role="menuitem"
                  class="block w-full px-4 py-2.5 text-left text-sm hover:bg-surface"
                  @click="handleLogout"
                >
                  Sign out
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex justify-end sm:hidden">
          <button
            class="inline-flex size-11 items-center justify-center rounded text-ink"
            :aria-expanded="showMobileMenu"
            @click="showMobileMenu = !showMobileMenu"
          >
            <span class="sr-only">{{ showMobileMenu ? 'Close main menu' : 'Open main menu' }}</span>
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-width="1.5" d="M4 8h16M4 16h16" />
              <path v-else stroke-linecap="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="lx-pop">
        <div v-if="showMobileMenu" class="pb-4 sm:hidden" @click="showMobileMenu = false">
          <ReadyLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            :ready="item.ready"
            class="flex min-h-11 items-center border-b border-line text-lg tracking-tight text-subtle"
            active-class="!text-ink"
          >
            {{ item.label }}
          </ReadyLink>
          <div class="mt-4">
            <p class="text-sm font-medium">
              {{ authStore.fullName }}
            </p>
            <p class="text-sm text-subtle">
              {{ authStore.user?.email }}
            </p>
          </div>
          <ReadyLink to="/profile" :ready="pageReady.profile" class="mt-3 flex min-h-11 items-center text-sm">
            Your Profile
          </ReadyLink>
          <button class="flex min-h-11 items-center text-sm" @click="handleLogout">
            Sign out
          </button>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const labsStore = useLabsStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuEl = ref<HTMLElement | null>(null)

const initial = computed(() =>
  (authStore.user?.firstName?.[0] || authStore.user?.username?.[0] || 'U').toUpperCase()
)

// Pages not ready yet (composables/pages.ts) stay in the menu, greyed out.
// Workspace, My VMs and Admin still depend on the session and the role, as before.
const navItems = computed(() => [
  { to: '/dashboard', label: 'Dashboard', show: true, ready: pageReady.dashboard },
  { to: '/labs', label: 'Lab Catalog', show: true, ready: pageReady.labs },
  {
    to: labsStore.currentSession ? `/workspace/${labsStore.currentSession.id}` : '',
    label: 'Workspace',
    show: !!labsStore.currentSession,
    ready: true
  },
  { to: '/vms', label: 'My VMs', show: authStore.canManageVMs, ready: true },
  { to: '/admin', label: 'Admin', show: authStore.isAdmin, ready: pageReady.admin }
].filter(item => item.show))

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
}

// Close the user menu on a click outside it
const onDocumentClick = (event: MouseEvent) => {
  if (!userMenuEl.value?.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>
