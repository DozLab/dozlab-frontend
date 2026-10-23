// Pages that aren't ready (composables/pages.ts) are not rendered, even from a typed address
export default defineNuxtRouteMiddleware((to) => {
  const path = to.path.replace(/\/+$/, '') || '/'
  if (hiddenPaths[path] === false) {
    return navigateTo(homePath)
  }
})
