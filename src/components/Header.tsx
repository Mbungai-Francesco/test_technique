import { Link, useNavigate } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Layers, LogOut, Menu, X } from 'lucide-react'
import { logout } from '@/api/auth'
import { useAppContext } from '@/hooks/useAppContext'

export default function Header() {
  const { id } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const leave = () => {
    logout()
      .then((mesg) => {
        console.log(mesg)
      })
      .catch((err) => {
        console.error('Logout error:', err)
      })
      .finally(() => {
        setIsOpen(false)
        navigate({ to: '/login' })
      })
  }

  return (
    <>
      <header className="sticky top-0 p-4 flex items-center bg-blue-600 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <h2 className="text-2xl font-bold">Cesco Security</h2>
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
          <div>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-800 transition-colors mb-2',
              }}
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/library"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-800 transition-colors mb-2',
              }}
            >
              <Layers size={20} />
              <span className="font-medium">Library</span>
            </Link>
          </div>

          {
            (id === '' ? (
              <button
                onClick={() => {
                  navigate({ to: '/login' })
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-800 transition-colors mb-2"
              >
                <LogOut size={20} />
                <span className="font-medium">Login</span>
              </button>
            ) : (
              <button
                onClick={leave}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-800 transition-colors mb-2"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            ))
          }

          {/* Demo Links Start */}

          {/* <Link
            to="/demo/tanstack-query"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-blue-800 transition-colors mb-2',
            }}
          >
            <Network size={20} />
            <span className="font-medium">TanStack Query</span>
          </Link> */}

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}
