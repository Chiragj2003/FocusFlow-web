'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  HelpCircle, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Book,
  Zap,
  Shield,
  Smartphone,
  BarChart3,
  Trophy,
  Clock,
  Mail,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'How do I create my first habit?',
    answer: 'Go to the Habits page and click the "Add Habit" button. You can either create a custom habit, use a pre-built template, or let AI generate one for you based on your goals. Fill in the details like name, category, and goal type, then click Create.'
  },
  {
    category: 'Getting Started',
    question: 'What are the different goal types?',
    answer: 'FocusFlow supports three goal types: Binary (Yes/No) - for habits you simply complete or not, Duration - for time-based habits measured in minutes, and Quantity - for habits tracked by count (like glasses of water or pages read).'
  },
  {
    category: 'Getting Started',
    question: 'How do I track my habits daily?',
    answer: 'On the Habits page, you\'ll see a monthly grid. Simply click on any cell to mark a habit as complete for that day. The cell will fill with your habit\'s color to show completion.'
  },
  // Features
  {
    category: 'Features',
    question: 'What is the Focus Timer?',
    answer: 'The Focus Timer is a Pomodoro-style timer that helps you stay focused. It includes 25-minute focus sessions, 5-minute short breaks, and 15-minute long breaks. You can link timer sessions to specific habits to track your focused time.'
  },
  {
    category: 'Features',
    question: 'How do badges work?',
    answer: 'Badges are achievements you earn as you build habits. There are streak badges (for consecutive days), completion badges (for perfect weeks/months), milestone badges (for total completions), and special badges for specific achievements. Check your Dashboard to see your earned badges!'
  },
  {
    category: 'Features',
    question: 'Can I export my data?',
    answer: 'Yes! Go to the Export page to download your habit data. You can export as CSV for spreadsheets or generate a beautiful PDF report of your insights. Choose specific date ranges or export everything.'
  },
  {
    category: 'Features',
    question: 'What are Challenges?',
    answer: 'Challenges are pre-built programs with multiple habits designed to help you achieve specific goals like fitness, mindfulness, or productivity. Each challenge has a set duration and includes all the habits you need to succeed.'
  },
  // Analytics
  {
    category: 'Analytics',
    question: 'How are streaks calculated?',
    answer: 'A streak counts consecutive days where you completed a habit. Your current streak shows ongoing consecutive days, while longest streak tracks your personal best. Missing a day resets your current streak to zero.'
  },
  {
    category: 'Analytics',
    question: 'What do the Insights charts show?',
    answer: 'The Insights page shows: Donut chart (monthly completion rate), Weekly bars (performance by week), Trend line (30-day progress), Category radar (performance by habit type), Heatmap (activity over time), and Day analysis (best/worst days).'
  },
  // Account
  {
    category: 'Account',
    question: 'How do I change my timezone?',
    answer: 'Go to Settings and find the Timezone section. Select your timezone from the dropdown and click Save. This ensures your habits are tracked correctly based on your local time.'
  },
  {
    category: 'Account',
    question: 'What happens if I deactivate my account?',
    answer: 'Deactivating your account temporarily pauses all tracking and hides your habits. Your data is preserved and you can reactivate anytime. This is different from deletion, which permanently removes everything.'
  },
  {
    category: 'Account',
    question: 'Is my data secure?',
    answer: 'Yes! We use Clerk for secure authentication, your data is stored in encrypted databases, and we never share your information with third parties. You can delete your account and all data at any time from Settings.'
  },
  // Mobile & PWA
  {
    category: 'Mobile',
    question: 'Can I use FocusFlow on my phone?',
    answer: 'Absolutely! FocusFlow is fully responsive and works great on mobile devices. You can also install it as a Progressive Web App (PWA) for a native-like experience - just look for the install option in your browser.'
  },
  {
    category: 'Mobile',
    question: 'How do I install the app on my phone?',
    answer: 'On iOS Safari, tap the Share button and select "Add to Home Screen". On Android Chrome, tap the menu (three dots) and select "Install app" or "Add to Home screen". The app will appear on your home screen like a native app.'
  },
]

const CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: Book },
  { id: 'Getting Started', name: 'Getting Started', icon: Zap },
  { id: 'Features', name: 'Features', icon: Trophy },
  { id: 'Analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'Account', name: 'Account', icon: Shield },
  { id: 'Mobile', name: 'Mobile', icon: Smartphone },
]

export function HelpClient() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'feedback' ? 'feedback' : 'faq'
  
  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>(initialTab)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Feedback form state
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [feedbackType, setFeedbackType] = useState<'feedback' | 'bug' | 'feature' | 'question'>('feedback')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (searchParams.get('tab') === 'feedback') {
      setActiveTab('feedback')
    }
  }, [searchParams])

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedbackEmail || !feedbackMessage) {
      setSubmitError('Please fill in all required fields')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: feedbackEmail,
          type: feedbackType,
          message: feedbackMessage,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send feedback')
      }

      setSubmitStatus('success')
      setFeedbackEmail('')
      setFeedbackMessage('')
      setFeedbackType('feedback')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send feedback')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-[72px] lg:pt-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/settings" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-3 sm:mb-4 text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            Back to Settings
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-linear-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl">
              <HelpCircle size={22} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-zinc-400 text-xs sm:text-base">Find answers or get in touch with us</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 bg-zinc-900/50 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-zinc-800/50">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-all ${
              activeTab === 'faq'
                ? 'bg-white text-zinc-900'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Book size={16} className="sm:w-[18px] sm:h-[18px]" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-all ${
              activeTab === 'feedback'
                ? 'bg-white text-zinc-900'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
            Feedback
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
              />
              <HelpCircle size={16} className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-violet-500 text-white'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline sm:inline">{category.name}</span>
                    <span className="xs:hidden sm:hidden">{category.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>

            {/* FAQ List */}
            <div className="space-y-2 sm:space-y-3">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <HelpCircle size={36} className="sm:w-12 sm:h-12 mx-auto text-zinc-600 mb-3 sm:mb-4" />
                  <p className="text-zinc-400 text-sm sm:text-base">No questions found matching your search.</p>
                </div>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 pr-2 sm:pr-4">
                        <span className="px-1.5 sm:px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] sm:text-xs rounded-full shrink-0 mt-0.5">
                          {faq.category}
                        </span>
                        <span className="font-medium text-white text-sm sm:text-base">{faq.question}</span>
                      </div>
                      {expandedFAQ === index ? (
                        <ChevronUp size={16} className="sm:w-5 sm:h-5 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="sm:w-5 sm:h-5 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                        <div className="pl-12 sm:pl-[72px] md:pl-[88px]">
                          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Still need help? */}
            <div className="bg-linear-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Still have questions?</h3>
              <p className="text-zinc-400 text-sm sm:text-base mb-3 sm:mb-4">Can&apos;t find what you&apos;re looking for? Send us a message!</p>
              <button
                onClick={() => setActiveTab('feedback')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-lg sm:rounded-xl transition-colors"
              >
                <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                Contact Us
              </button>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Feedback Form */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                  <MessageSquare size={18} className="sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white">Send us your feedback</h2>
                  <p className="text-xs sm:text-sm text-zinc-400">We read every message and appreciate your input</p>
                </div>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle size={24} className="sm:w-8 sm:h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1.5 sm:mb-2">Thank you!</h3>
                  <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6">Your feedback has been sent successfully. We&apos;ll get back to you if needed.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg sm:rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4 sm:space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                      Your Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base bg-zinc-800/50 border border-zinc-700/50 rounded-lg sm:rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                      <Mail size={16} className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </div>

                  {/* Feedback Type */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                      What&apos;s this about?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      {[
                        { id: 'feedback', label: 'Feedback', icon: MessageSquare, color: 'emerald' },
                        { id: 'bug', label: 'Bug', icon: AlertCircle, color: 'red' },
                        { id: 'feature', label: 'Feature', icon: Zap, color: 'amber' },
                        { id: 'question', label: 'Question', icon: HelpCircle, color: 'blue' },
                      ].map((type) => {
                        const Icon = type.icon
                        const isSelected = feedbackType === type.id
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id as typeof feedbackType)}
                            className={`flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${
                              isSelected
                                ? `bg-${type.color}-500/20 border-${type.color}-500/50 text-${type.color}-400`
                                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                            }`}
                            style={{
                              backgroundColor: isSelected ? `var(--${type.color}-bg, rgba(16, 185, 129, 0.2))` : undefined,
                              borderColor: isSelected ? `var(--${type.color}-border, rgba(16, 185, 129, 0.5))` : undefined,
                              color: isSelected ? `var(--${type.color}-text, rgb(52, 211, 153))` : undefined,
                            }}
                          >
                            <Icon size={14} className="sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                      Your Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      required
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800/50 border border-zinc-700/50 rounded-lg sm:rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && submitError && (
                    <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl text-red-400">
                      <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="text-xs sm:text-sm">{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium rounded-lg sm:rounded-xl transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Send Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Other ways to reach us</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 text-sm sm:text-base">
                  <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-violet-400" />
                  <span>chiragj2019@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-zinc-400 text-sm sm:text-base">
                  <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
                  <span>We typically respond within 24-48 hours</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab('faq')}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl hover:bg-zinc-800/50 hover:border-violet-500/30 transition-all group"
              >
                <div className="p-2 sm:p-3 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                  <Book size={20} className="sm:w-6 sm:h-6 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white text-sm sm:text-base">Browse FAQ</p>
                  <p className="text-xs sm:text-sm text-zinc-400">Find answers quickly</p>
                </div>
              </button>

              <Link
                href="/settings"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg sm:rounded-xl hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all group"
              >
                <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Shield size={20} className="sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white text-sm sm:text-base">Account Settings</p>
                  <p className="text-xs sm:text-sm text-zinc-400">Manage your profile</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
