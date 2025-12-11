'use client'

import { useState, useEffect } from 'react'
import { UserButton, useClerk } from '@clerk/nextjs'
import { User, Globe, Palette, Sun, Moon, Monitor, AlertTriangle, Trash2, Power, Shield } from 'lucide-react'
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
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Profile</h2>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-16 h-16',
              },
            }}
          />
          <div>
            <p className="font-medium text-card-foreground">
              {clerkUser.firstName} {clerkUser.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Managed by Clerk — click avatar to edit
            </p>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Timezone</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Your Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-card-foreground"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Used for accurate date tracking and streak calculations
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-card-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'system'
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
              >
                <Monitor size={16} />
                System
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-card-foreground">Notifications</p>
              <p className="text-sm text-muted-foreground">Daily reminders</p>
            </div>
            <span className="px-3 py-1 text-sm bg-border text-muted-foreground rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Account Management</h2>
        </div>

        {isDeactivated && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle size={16} />
              <p className="font-medium">Your account is deactivated</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your habits are hidden and tracking is paused. Reactivate to resume.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Deactivate/Reactivate Option */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Power size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">
                  {isDeactivated ? 'Reactivate Account' : 'Deactivate Account'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isDeactivated
                    ? 'Reactivate your account to resume tracking'
                    : 'Temporarily disable your account without losing data'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDeactivated
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'text-amber-500 border border-amber-500/50 hover:bg-amber-500/10'
              }`}
            >
              {isDeactivated ? 'Reactivate' : 'Deactivate'}
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-500">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Power size={20} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {isDeactivated ? 'Reactivate Account?' : 'Deactivate Account?'}
              </h3>
            </div>

            {isDeactivated ? (
              <p className="text-muted-foreground mb-6">
                Welcome back! Reactivating your account will restore all your habits and resume tracking.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                <p className="text-muted-foreground">
                  Deactivating your account will:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Pause all habit tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Hide your habits from the dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Keep all your data safe
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Allow reactivation at any time
                  </li>
                </ul>
              </div>
            )}

            {accountError && (
              <p className="text-red-500 text-sm mb-4">{accountError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateModal(false)
                  setAccountError('')
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-card-foreground bg-muted border border-border rounded-lg hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={isDeactivating}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-red-500/30 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-500">Delete Account</h3>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">
                This action is <span className="text-red-500 font-semibold">permanent and irreversible</span>.
                Deleting your account will:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Delete all your habits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Delete all tracking history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Remove your account permanently
                </li>
              </ul>

              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Type <span className="font-mono text-red-500 bg-red-500/10 px-1 rounded">delete my account</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="delete my account"
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {accountError && (
              <p className="text-red-500 text-sm mb-4">{accountError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                  setAccountError('')
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-card-foreground bg-muted border border-border rounded-lg hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'delete my account'}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
