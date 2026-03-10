import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        display: 'Space Grotesk:700',
        mono: 'JetBrains Mono'
      }
    })
  ],
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      dark: '#0f172a',
      darker: '#020617',
      surface: '#1e293b',
      light: '#f8fafc',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      neon: {
        pink: '#ff10f0',
        cyan: '#00ffff',
        purple: '#bf00ff',
        green: '#39ff14'
      }
    },
    animation: {
      keyframes: {
        'pulse-glow': '{0%, 100% { box-shadow: 0 0 5px theme("colors.neon.cyan"), 0 0 10px theme("colors.neon.cyan"), 0 0 20px theme("colors.neon.cyan") } 50% { box-shadow: 0 0 10px theme("colors.neon.cyan"), 0 0 20px theme("colors.neon.cyan"), 0 0 40px theme("colors.neon.cyan") }}',
        'float': '{0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) }}',
        'shake': '{0%, 100% { transform: rotate(0deg) } 25% { transform: rotate(-5deg) } 75% { transform: rotate(5deg) }}',
        'gradient-shift': '{0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% }}'
      },
      durations: {
        'pulse-glow': '2s',
        'float': '3s',
        'shake': '0.5s',
        'gradient-shift': '3s'
      },
      timingFns: {
        'pulse-glow': 'ease-in-out',
        'float': 'ease-in-out',
        'shake': 'ease-in-out',
        'gradient-shift': 'ease'
      },
      counts: {
        'pulse-glow': 'infinite',
        'float': 'infinite',
        'shake': 'infinite',
        'gradient-shift': 'infinite'
      }
    }
  },
  shortcuts: {
    'btn': 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer',
    'btn-primary': 'btn bg-primary hover:bg-secondary text-white hover:shadow-lg hover:shadow-primary/30',
    'btn-neon': 'btn bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark animate-pulse-glow',
    'btn-glass': 'btn bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    'card': 'bg-surface/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl',
    'input-field': 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
    'gradient-text': 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
    'glass': 'bg-white/5 backdrop-blur-lg border border-white/10'
  },
  rules: [
    ['text-neon-pink', { color: '#ff10f0' }],
    ['text-neon-cyan', { color: '#00ffff' }],
    ['text-neon-purple', { color: '#bf00ff' }],
    ['text-neon-green', { color: '#39ff14' }],
    ['bg-neon-pink', { 'background-color': '#ff10f0' }],
    ['bg-neon-cyan', { 'background-color': '#00ffff' }],
    ['bg-neon-purple', { 'background-color': '#bf00ff' }],
    ['bg-neon-green', { 'background-color': '#39ff14' }],
    ['shadow-neon-cyan', { 'box-shadow': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff' }],
    ['shadow-neon-pink', { 'box-shadow': '0 0 5px #ff10f0, 0 0 10px #ff10f0, 0 0 20px #ff10f0' }],
    ['shadow-neon-purple', { 'box-shadow': '0 0 5px #bf00ff, 0 0 10px #bf00ff, 0 0 20px #bf00ff' }],
    ['animate-float', { animation: 'float 3s ease-in-out infinite' }],
    ['animate-pulse-glow', { animation: 'pulse-glow 2s ease-in-out infinite' }],
    ['animate-shake', { animation: 'shake 0.5s ease-in-out infinite' }]
  ]
})
