import {defineConfig} from 'vite';
export default defineConfig({define:{'process.env.NODE_ENV':JSON.stringify('production')},publicDir:false,build:{outDir:'dist/modules/trips',emptyOutDir:true,lib:{entry:'trips/main.jsx',formats:['es'],fileName:()=> 'remote.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
