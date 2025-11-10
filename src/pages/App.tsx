import * as React from 'react'
import { DocumentUpload } from '../components/DocumentUpload'
import { DocumentList } from '../components/DocumentList'
import { NotificationCenter } from '../components/NotificationCenter'

export const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden btn-outline px-3 py-2" aria-label="Open menu" onClick={() => setMenuOpen(v => !v)}>
              ☰
            </button>
            <div className="font-semibold">Signaturit</div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <a className="text-sm text-gray-700 hover:text-gray-900" href="#">Dashboard</a>
            <a className="text-sm text-gray-700 hover:text-gray-900" href="#">Settings</a>
          </nav>
        </div>
        {menuOpen ? (
          <div className="md:hidden border-t px-4 py-2">
            <a className="block py-2 text-sm" href="#">Dashboard</a>
            <a className="block py-2 text-sm" href="#">Settings</a>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-medium mb-3">Upload document</h2>
          <DocumentUpload />
        </section>

        <section>
          <h2 className="text-lg font-medium mb-3">Documents</h2>
          <DocumentList />
        </section>
      </main>

      <NotificationCenter />
    </div>
  )
}

