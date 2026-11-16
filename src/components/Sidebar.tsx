/* ==================== ORIGINAL CODE START ====================
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Grid3X3,
  BarChart3,
  Calendar,
  Settings,
  Download,
  Menu,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: Grid3X3 },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Achievements', href: '/achievements', icon: Sparkles },
  { name: 'Export', href: '/export', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-zinc-950 border-b border-zinc-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-zinc-900" />
            </div>
            <span className="font-bold text-base text-white">FocusFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-zinc-900 border-b border-zinc-800 shadow-xl">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white text-zinc-900'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}

      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-950 border-r border-zinc-800/50">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800/50">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="font-bold text-lg text-white">FocusFlow</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white text-zinc-900'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
              <span className="text-sm text-zinc-400">Account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Grid3X3,
  BarChart3,
  Calendar,
  Settings,
  Download,
  Menu,
  X,
  Trophy,
  HelpCircle,
} from 'lucide-react'
import { useState } from 'react'
import { FlameMark } from './ui/FlameMark'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: Grid3X3 },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Badges', href: '/achievements', icon: Trophy },
  { name: 'Export', href: '/export', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Navigation Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-[#09090b]/95 backdrop-blur-md border-b border-[#232328]">
        {/* Top row with logo and menu button */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 select-none">
            <FlameMark size={28} />
            <span className="font-extrabold text-lg text-white tracking-tight">
              Focus<span className="text-orange-500">Flow</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7 rounded-full border border-orange-500/30',
                },
              }}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-orange-500/40 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-[#131316] border-b border-[#232328] shadow-2xl animate-fade-in">
            <div className="p-4 space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_2px_14px_rgba(249,115,22,0.35)]'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 bg-[#0e0e11] border-r border-[#232328]">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-6 py-5 border-b border-[#232328] select-none hover:opacity-90 transition-opacity"
          >
            <FlameMark size={32} />
            <span className="font-black text-xl text-white tracking-tight">
              Focus<span className="text-orange-500">Flow</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                  )}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-zinc-400'} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#232328]">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141418] border border-[#232328]">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-full border border-orange-500/40',
                  },
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Your Account</span>
                <span className="text-xs text-orange-400/90 font-medium">FocusFlow</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
