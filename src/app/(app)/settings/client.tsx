'use client'

import { useState, useEffect } from 'react'
import { UserButton, useClerk } from '@clerk/nextjs'
import { User, Globe, Palette, Sun, Moon, Monitor, AlertTriangle, Trash2, Power, Shield, LogOut, HelpCircle, MessageSquare } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useRouter } from 'next/navigation'

interface SettingsClientProps {
  user: {
    id: string
    email: string
    name: string | null
    timezone: string
  }
  clerkUser: {
    firstName: string | null
    lastName: string | null
    imageUrl: string
  }
}

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
]

export function SettingsClient({ user, clerkUser }: SettingsClientProps) {
  const [timezone, setTimezone] = useState(user.timezone)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { theme, setTheme } = useTheme()
  const { signOut } = useClerk()
  const router = useRouter()

  // Account management states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isDeactivated, setIsDeactivated] = useState(false)
  const [accountError, setAccountError] = useState('')

  // Check deactivation status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/account/status')
        if (res.ok) {
          const data = await res.json()
          setIsDeactivated(data.isDeactivated)
        }
      } catch (error) {
        console.error('Failed to check account status:', error)
      }
    }
    checkStatus()
  }, [])

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'delete my account') {
      setAccountError('Please type "delete my account" exactly to confirm')
      return
    }

    setIsDeleting(true)
    setAccountError('')

    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Sign out and redirect to home
      await signOut({ redirectUrl: '/' })
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  const handleDeactivateAccount = async () => {
    setIsDeactivating(true)
    setAccountError('')

    try {
      const res = await fetch('/api/account/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isDeactivated ? 'reactivate' : 'deactivate' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update account status')
      }

      const data = await res.json()
      setIsDeactivated(data.status === 'deactivated')
      setShowDeactivateModal(false)
      router.refresh()
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Failed to update account')
    } finally {
      setIsDeactivating(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, you'd have an API endpoint for this
      // For now, we'll just simulate a save
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-16 h-16',
              },
            }}
          />
          <div>
            <p className="font-medium text-white">
              {clerkUser.firstName} {clerkUser.lastName}
            </p>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Managed by Clerk — click avatar to edit
            </p>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Timezone</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Your Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 text-white"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-sm text-zinc-500">
              Used for accurate date tracking and streak calculations
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-zinc-900 bg-white rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={20} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-white">Theme</p>
                <p className="text-sm text-zinc-400">Choose your preferred appearance</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'system'
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                }`}
              >
                <Monitor size={16} />
                System
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
            <div>
              <p className="font-medium text-white">Notifications</p>
              <p className="text-sm text-zinc-400">Daily reminders</p>
            </div>
            <span className="px-3 py-1 text-sm bg-zinc-700 text-zinc-400 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Account Management</h2>
        </div>

        {isDeactivated && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={16} />
              <p className="font-medium">Your account is deactivated</p>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Your habits are hidden and tracking is paused. Reactivate to resume.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Log Out Option */}
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <LogOut size={18} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Log Out</p>
                <p className="text-sm text-zinc-400">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="px-4 py-2 text-sm font-medium text-white border border-zinc-600 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Log Out
            </button>
          </div>

          {/* Deactivate/Reactivate Option */}
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Power size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-white">
                  {isDeactivated ? 'Reactivate Account' : 'Deactivate Account'}
                </p>
                <p className="text-sm text-zinc-400">
                  {isDeactivated
                    ? 'Reactivate your account to resume tracking'
                    : 'Temporarily disable your account without losing data'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                isDeactivated
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'text-amber-400 border border-amber-500/50 hover:bg-amber-500/10'
              }`}
            >
              {isDeactivated ? 'Reactivate' : 'Deactivate'}
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <p className="font-medium text-red-400">Delete Account</p>
                <p className="text-sm text-zinc-400">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Help & Feedback Section */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <HelpCircle size={20} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Help & Support</h2>
            <p className="text-sm text-zinc-400">Get help or send us feedback</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/help')}
            className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 hover:border-violet-500/50 transition-all group"
          >
            <div className="p-3 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
              <HelpCircle size={24} className="text-violet-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Help Center</p>
              <p className="text-sm text-zinc-400">FAQs & documentation</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/help?tab=feedback')}
            className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 hover:border-emerald-500/50 transition-all group"
          >
            <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <MessageSquare size={24} className="text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">Send Feedback</p>
              <p className="text-sm text-zinc-400">We&apos;d love to hear from you</p>
            </div>
          </button>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Power size={20} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {isDeactivated ? 'Reactivate Account?' : 'Deactivate Account?'}
              </h3>
            </div>

            {isDeactivated ? (
              <p className="text-zinc-400 mb-6">
                Welcome back! Reactivating your account will restore all your habits and resume tracking.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                <p className="text-zinc-400">
                  Deactivating your account will:
                </p>
                <ul className="text-sm text-zinc-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    Pause all habit tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    Hide your habits from the dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Keep all your data safe
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Allow reactivation at any time
                  </li>
                </ul>
              </div>
            )}

            {accountError && (
              <p className="text-red-400 text-sm mb-4">{accountError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateModal(false)
                  setAccountError('')
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={isDeactivating}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 ${
                  isDeactivated
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {isDeactivating
                  ? 'Processing...'
                  : isDeactivated
                  ? 'Reactivate Account'
                  : 'Deactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-red-500/30 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Delete Account</h3>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-zinc-400">
                This action is <span className="text-red-400 font-semibold">permanent and irreversible</span>.
                Deleting your account will:
              </p>
              <ul className="text-sm text-zinc-400 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Delete all your habits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Delete all tracking history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Remove your account permanently
                </li>
              </ul>

              <div className="pt-4 border-t border-zinc-800">
                <label className="block text-sm font-medium text-white mb-2">
                  Type <span className="font-mono text-red-400 bg-red-500/10 px-1 rounded">delete my account</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="delete my account"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {accountError && (
              <p className="text-red-400 text-sm mb-4">{accountError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                  setAccountError('')
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'delete my account'}
                className="flex-1 px-4 py-3 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
