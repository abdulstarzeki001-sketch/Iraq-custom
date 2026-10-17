import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],base:'/creative-app/',build:{outDir:'../creative-app',emptyOutDir:true,cssCodeSplit:true,rollupOptions:{output:{manualChunks:{'react-core':['react','react-dom/client']}}}}});
