import Link from 'next/link'
import { Sparkles, Check, Crown, ChevronRight, ChevronDown } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/50">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="font-bold text-xl text-white">FocusFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-bold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          {/* Limited Time Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-zinc-300">Limited Time Offer</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Simple, Transparent{' '}
            <span className="text-zinc-400">Pricing</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Everything you need to build better habits. Start free, upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {/* Basic Plan */}
          <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-zinc-700">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-zinc-500 text-sm">Perfect for getting started</p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-black text-white">Free</span>
              <span className="text-zinc-500 ml-2">forever</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                '5 active habits',
                'Basic analytics',
                'Streak tracking',
                'CSV export',
                'Dark mode',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/sign-up"
              className="block w-full py-3 px-6 text-center font-bold text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-3xl border-2 border-zinc-600 bg-zinc-900/80 backdrop-blur-sm p-8 transition-all duration-300 hover:border-zinc-500">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-sm font-bold">
                <Crown className="w-4 h-4" />
                FREE FOR NOW
              </div>
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-zinc-500 text-sm">For serious habit builders</p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-black text-white">₹0</span>
              <span className="text-zinc-500 ml-2 line-through">₹99/mo</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Unlimited habits',
                'Advanced analytics',
                'All streak features',
                'PDF export',
                'Priority support',
                'Early access features',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/sign-up"
              className="block w-full py-3 px-6 text-center font-bold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all group"
            >
              <span className="flex items-center justify-center gap-2">
                Start Free Trial
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: 'Is FocusFlow really free?',
                answer: 'Yes! The Basic plan is completely free forever. We also have a promotional period where Pro features are available at no cost.',
              },
              {
                question: 'What happens when Pro becomes paid?',
                answer: 'We\'ll give you plenty of notice before any changes. Early adopters will receive special discounts and grandfathered pricing.',
              },
              {
                question: 'Can I export my data?',
                answer: 'Absolutely. All users can export their habit data as CSV. Pro users also get beautiful PDF reports with charts and insights.',
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes. We use industry-standard encryption and never share your personal data. Your habits are private and secure.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-white">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-zinc-900" />
              </div>
              <div>
                <span className="font-bold text-white">FocusFlow</span>
                <p className="text-xs text-zinc-500">Build better habits</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms</Link>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} FocusFlow
              </p>
              <p className="text-xs text-zinc-600">Made with ♥ for habit builders</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
