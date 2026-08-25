/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			// Une seule superfamille, deux voix : le sans porte les libellés,
  			// le mono porte toutes les données et les graduations.
  			sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
  			mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// --- Direction « instrument de mesure » ---
  			// Neutres légèrement biaisés vers le vert de l'accent, pour qu'ils
  			// lisent comme choisis et non hérités.
  			paper: '#F6F8F7',
  			surface: '#FCFCFB',
  			sunk: '#F0F3F1',
  			ink: {
  				DEFAULT: '#14181A',
  				2: '#4A5257',
  				3: '#7E878C',
  				4: '#A2ABAE'
  			},
  			rule: {
  				DEFAULT: '#E0E4E2',
  				firm: '#C6CCC9'
  			},
  			// Rampe ordinale du potentiel : une seule teinte, trois pas validés
  			// (monotonie de luminance, écarts, contraste sur la surface), plus un
  			// gris pour l'état exclu — qui n'est pas un degré de l'échelle.
  			pot: {
  				fort: '#0D5B55',
  				moyen: '#12968A',
  				faible: '#38ADA0',
  				hors: '#A8B0AD'
  			},
  			// Nommé « gauge » et non « accent » : shadcn occupe déjà ce jeton.
  			gauge: {
  				DEFAULT: '#0D5B55',
  				ink: '#0B4B46'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}