import * as React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './pages/App'
import { AppProvider } from './state/AppContext'
import { Toaster } from '@/components/ui/sonner'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
	<React.StrictMode>
		<AppProvider>
			<Toaster />
			<App />
		</AppProvider>
	</React.StrictMode>
)

