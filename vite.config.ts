import path from "path"
import react from "@vitejs/plugin-react" // On utilise le plugin standard vu dans tes logs
import { defineConfig } from "vite"
import { fileURLToPath } from 'url'

// Ces deux lignes permettent de créer l'alias correctement sur ton Mac
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})