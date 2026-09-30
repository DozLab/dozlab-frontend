// $fetch against the DozLab API (runtimeConfig.public.apiBase), with the user's JWT.
// On GitHub Pages the API is another origin (the Tailscale Funnel URL), so every call
// must go through this, not a relative '/api/...' path.
export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    }
  })
}
