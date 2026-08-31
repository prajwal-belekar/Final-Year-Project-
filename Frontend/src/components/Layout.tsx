import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlusCircle, History, BookOpen,
  Server, Database, Info, Activity, Wifi,
  ChevronLeft, ChevronRight, Heart, Menu, FileText, Rocket
} from 'lucide-react'
import { cn } from '../lib/utils'
import { api } from '../services/api'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analysis/new', icon: PlusCircle, label: 'New Analysis' },
  { to: '/history', icon: History, label: 'Previous Diagnoses' },
  { to: '/methodology', icon: BookOpen, label: 'Methodology' },
  { to: '/architecture', icon: Server, label: 'System Architecture' },
  { to: '/dataset', icon: Database, label: 'Dataset' },
  { to: '/api-docs', icon: FileText, label: 'API Integration' },
  { to: '/future-scope', icon: Rocket, label: 'Future Scope' },
  { to: '/about', icon: Info, label: 'About Project' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    api.getStatus().then(() => setApiOnline(true)).catch(() => setApiOnline(false))
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-50 h-full bg-navy-900/95 backdrop-blur-xl border-r border-navy-700/50 flex flex-col transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('p-4 border-b border-navy-700/50', collapsed && 'px-3')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <h1 className="text-base font-bold text-white tracking-tight">CardioMVP AI</h1>
                <p className="text-[10px] text-cyan-400/80 font-medium tracking-wider uppercase">Explainable Cardiac Screening</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-cyan-600/15 text-cyan-400 border border-cyan-600/20'
                    : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
                )
              }
            >
              <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-navy-700/50 p-3 space-y-2">
          {/* API Status */}
          <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg', collapsed && 'justify-center px-0')}>
            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400')} />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[11px] text-navy-400">API Status</p>
                <p className={cn('text-xs font-medium', apiOnline ? 'text-emerald-400' : 'text-red-400')}>{apiOnline ? 'Online' : 'Offline'}</p>
              </div>
            )}
          </div>
          {/* User */}
          <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg bg-navy-800/50', collapsed && 'justify-center px-0')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-navy-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">CR</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-navy-200 truncate">Clinical Research</p>
                <p className="text-[10px] text-navy-500">Prototype v1.0</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-navy-800 border border-navy-600 items-center justify-center text-navy-400 hover:text-navy-200 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800/50">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-navy-500 uppercase tracking-wider font-medium">
                  {navItems.find(n => location.pathname === n.to || location.pathname.startsWith(n.to + '/'))?.label || 'CardioMVP AI'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-info hidden sm:inline-flex">
                <Wifi className="w-3 h-3 mr-1" />
                {apiOnline ? 'Backend Connected' : 'Backend Offline'}
              </span>
              <span className="badge-success hidden sm:inline-flex">
                <Activity className="w-3 h-3 mr-1" />
                System Active
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
