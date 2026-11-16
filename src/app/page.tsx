/* ==================== ORIGINAL CODE START ====================
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { 
  CheckCircle, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Download,
  Zap,
  Star,
  ChevronRight,
  Flame,
  TrendingUp
} from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-zinc-700/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-zinc-800/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-20 left-20 w-2 h-2 bg-zinc-500 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse-slow animation-delay-2000" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-zinc-500 rounded-full animate-pulse-slow animation-delay-4000" />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-zinc-600 rounded-full animate-pulse-slow" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/50">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="font-bold text-xl text-white">FocusFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Stats</a>
            <a href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Testimonials</a>
            <Link href="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-bold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  CheckCircle,
  BarChart3,
  ArrowRight,
  Sparkles,
  Download,
  Zap,
  Star,
  ChevronRight,
  Flame,
  Clock,
  Award,
} from 'lucide-react'
import { FlameMark } from '@/components/ui/FlameMark'
import { Mascot } from '@/components/ui/Mascot'

export default async function HomePage() {
  const { userId } = await auth()

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Background with warm ambient gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-orange-600/10 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-[#232328]">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <FlameMark size={32} />
            <span className="font-black text-xl text-white tracking-tight">
              Focus<span className="text-orange-500">Flow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#mascot" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Meet Sparky
            </a>
            <a href="#stats" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Stats
            </a>
            <a href="#testimonials" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Testimonials
            </a>
            <Link href="/pricing" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-[0_2px_14px_rgba(249,115,22,0.35)] transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-8 backdrop-blur-sm text-orange-400 shadow-[0_0_16px_rgba(249,115,22,0.15)]">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">Build better habits, one day at a time</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight">
              Watch Your Fire Grow
              <br />
              <span className="text-gradient">One Habit at a Time</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Meet Sparky and build unstoppable streaks. Focus with ambient sounds, collect 3D medals, and visualize your progress on mobile and web.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="group w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl hover:from-orange-600 hover:to-amber-600 shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Building Habits
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-zinc-300 bg-[#131316] border border-[#232328] rounded-2xl hover:border-orange-500/40 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Explore Features
              </Link>
            </div>

            {/* Fire Flame Progression Showcase */}
            <div className="mt-16 p-6 rounded-3xl bg-[#131316] border border-[#232328] max-w-4xl mx-auto shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Mascot mood="proud" size={48} animated={false} />
                  <div className="text-left">
                    <p className="font-black text-white text-sm">Duolingo-Style Growing Flames</p>
                    <p className="text-xs text-zinc-400">Your fire grows stronger as your streak lengthens</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                  Streak Evolution
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 pt-2">
                {[
                  { days: '1-2 Days', label: 'Spark', img: '/flames/flame-1-spark.png' },
                  { days: '3-6 Days', label: 'Small', img: '/flames/flame-2-small.png' },
                  { days: '7-13 Days', label: 'Medium', img: '/flames/flame-3-medium.png' },
                  { days: '14-29 Days', label: 'Large', img: '/flames/flame-4-large.png' },
                  { days: '30-99 Days', label: 'Blue Fire', img: '/flames/flame-5-blue.png' },
                  { days: '100+ Days', label: 'Legendary', img: '/flames/flame-6-legendary.png' },
                  { days: 'Frozen', label: 'Streak Freeze', img: '/flames/flame-frozen.png' },
                ].map((f) => (
                  <div key={f.label} className="p-3 rounded-2xl bg-[#18181d] border border-[#232328] flex flex-col items-center text-center">
                    <Image src={f.img} alt={f.label} width={40} height={40} className="object-contain mb-1 select-none" />
                    <span className="text-xs font-black text-white">{f.label}</span>
                    <span className="text-[10px] text-zinc-400">{f.days}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Synced with Mobile App
              </div>
            </div>
          </div>
        </section>

        {/* Meet Sparky Section */}
        <section id="mascot" className="py-20 border-y border-[#232328] bg-[#0d0d10]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your Habit Companion
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Meet Sparky, Your Cheerleader Fox
                </h2>
                <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                  Sparky reacts to your real-time progress! He greets you in the morning, cheers when you complete your list, looks proud when you hit streak milestones, and sleeps peacefully at night.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#131316] border border-[#232328]">
                    <span className="text-sm font-bold text-white">🌅 Morning Wave</span>
                    <p className="text-xs text-zinc-400 mt-0.5">Encourages you to start small</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131316] border border-[#232328]">
                    <span className="text-sm font-bold text-white">🎉 Jumping Cheer</span>
                    <p className="text-xs text-zinc-400 mt-0.5">Celebrates when all habits are done</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131316] border border-[#232328]">
                    <span className="text-sm font-bold text-white">🔥 Proud Streak</span>
                    <p className="text-xs text-zinc-400 mt-0.5">Recognizes your multi-day consistency</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#131316] border border-[#232328]">
                    <span className="text-sm font-bold text-white">🌙 Sleeping Soundly</span>
                    <p className="text-xs text-zinc-400 mt-0.5">Rests during late night hours</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-[#18181d] to-[#121215] border border-[#232328] shadow-[0_0_50px_rgba(249,115,22,0.15)]">
                <Mascot mood="happy" size={240} />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 border-b border-[#232328]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Active Habit Builders' },
                { value: '500K+', label: 'Check-ins Completed' },
                { value: '1M+', label: 'Streaks Ignited' },
                { value: '4.9★', label: 'App Store Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-white group-hover:text-orange-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-sm font-bold text-orange-400">
                <Zap className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Everything you need to <span className="text-gradient">succeed</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Built with the psychology of habit formation and gamification.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: '1-Tap Daily Check-ins',
                  description: 'Check off habits in one tap. Instant visual confirmation with smooth haptic feedback.',
                },
                {
                  icon: Flame,
                  title: 'Growing Fire Streaks',
                  description: 'From a tiny spark to legendary flames, your streak visually evolves as you stay consistent.',
                },
                {
                  icon: Clock,
                  title: 'Focus Timer with Ambient Sounds',
                  description: 'Listen to rain, ocean waves, lo-fi beats, or brown noise while you work or study.',
                },
                {
                  icon: Award,
                  title: '3D Medals & Badges',
                  description: 'Collect beautifully crafted 3D achievement medals as you hit milestones.',
                },
                {
                  icon: BarChart3,
                  title: 'Clean Analytics',
                  description: 'Visualize your consistency with monthly trends, weekly bars, and category radar.',
                },
                {
                  icon: Download,
                  title: 'Export & Backup',
                  description: 'Download your habit records as CSV spreadsheets or comprehensive PDF summaries.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-8 bg-[#131316] rounded-3xl border border-[#232328] hover:border-orange-500/40 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 mb-5">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-[#0d0d10] border-t border-[#232328]">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Loved by <span className="text-gradient">habit builders</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">Join thousands who have transformed their routines</p>
          </div>

          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'FocusFlow helped me build a 90-day meditation streak. Sparky mascot makes showing up fun!',
                author: 'Sarah K.',
                role: 'Product Designer',
              },
              {
                quote: 'Finally, a habit tracker that is beautiful AND functional on both my phone and laptop.',
                author: 'Mike R.',
                role: 'Software Engineer',
              },
              {
                quote: 'The ambient sounds during focus mode and the growing flame system keep me locked in.',
                author: 'Emily T.',
                role: 'Fitness Coach',
              },
            ].map((t) => (
              <div key={t.author} className="p-6 rounded-3xl bg-[#131316] border border-[#232328] text-left space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">“{t.quote}”</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.author}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto px-6 space-y-6">
            <Mascot mood="celebrate" size={120} />
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Ready to Light Your Fire?
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
              Join FocusFlow today for free. Available on your phone and on the web.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-[0_4px_24px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-0.5"
            >
              Start Free Today
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#232328] bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <FlameMark size={28} />
            <span className="font-extrabold text-lg text-white">
              Focus<span className="text-orange-500">Flow</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/child-safety" className="hover:text-white transition-colors">Child Safety</Link>
            <Link href="/account-deletion" className="hover:text-white transition-colors">Delete Account</Link>
          </div>

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} FocusFlow. Built for habit builders.
          </p>
        </div>
      </footer>
    </div>
  )
}
