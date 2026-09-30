// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Static site for GitHub Pages: no Nuxt server, the browser calls the API directly
  // (dozlab-api docs/decision.md, "frontend on GitHub Pages")
  ssr: false,
  // pages/, stores/, assets/ are at the repo root (Nuxt 3 layout); Nuxt 4 defaults to app/
  srcDir: '.',
  app: {
    // '/dozlab-frontend/' on Pages (set by the deploy workflow), '/' locally
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],
  typescript: {
    strict: true,
    typeCheck: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080/api/v1'
    }
  }
})
