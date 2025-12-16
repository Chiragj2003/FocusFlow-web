import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { 
  CheckCircle, 
  BarChart3, 
  Target, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Download,
  Zap,
  Star,
  ChevronRight,
  Github,
  Flame,
  TrendingUp,
  Trophy
} from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-zinc-700/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-zinc-800/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        
        {/* Pulsing dots */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-zinc-500 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse-slow animation-delay-2000" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-zinc-500 rounded-full animate-pulse-slow animation-delay-4000" />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-zinc-600 rounded-full animate-pulse-slow" />
      </div>

      {/* Header */}
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

      <main>
        {/* Hero Section - Full Viewport */}
        <section className="relative min-h-[90vh] flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-zinc-300">Build better habits, one day at a time</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight">
              Transform Your Life
              <br />
              <span className="text-zinc-400">One Habit at a Time</span>
            </h1>
            
            <p className="mt-8 text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              The beautiful habit tracker that helps you build consistency, 
              track your streaks, and visualize your progress with stunning analytics.
            </p>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {['Streak Tracking', 'Smart Analytics', 'Achievements', 'Calendar View'].map((feature) => (
                <span key={feature} className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800/50 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="group w-full sm:w-auto px-8 py-4 text-base font-bold text-zinc-900 bg-white rounded-2xl hover:bg-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-zinc-800/50 border border-zinc-700/50 rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
              >
                See Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Setup in 30 Seconds
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 border-y border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Active Users', icon: '👥' },
                { value: '500K+', label: 'Habits Tracked', icon: '✓' },
                { value: '1M+', label: 'Streaks Built', icon: '🔥' },
                { value: '4.9', label: 'User Rating', icon: '⭐' },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-white transition-transform duration-300 group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm font-medium text-zinc-300 mb-4">
                <Zap className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Everything you need to{' '}
                <span className="text-zinc-400">succeed</span>
              </h2>
              <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
                Built with the science of habit formation in mind. Every feature is designed to help you stay consistent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'Smart Habit Tracking',
                  description: 'Mark habits complete with a single tap. Binary, duration, or quantity goals.',
                },
                {
                  icon: BarChart3,
                  title: 'Clean Analytics',
                  description: 'Beautiful charts and graphs. See your progress visualized in stunning detail.',
                },
                {
                  icon: Flame,
                  title: 'Streak Motivation',
                  description: 'Watch your streaks grow. Never want to break the chain once you start.',
                },
                {
                  icon: Calendar,
                  title: 'Calendar Overview',
                  description: 'See your entire year at a glance with color-coded progress indicators.',
                },
                {
                  icon: TrendingUp,
                  title: 'Progress Insights',
                  description: 'Detailed breakdowns by day, week, and month. Understand your patterns.',
                },
                {
                  icon: Download,
                  title: 'Export Data',
                  description: 'Download your habit data as CSV or beautiful PDF reports anytime.',
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 mb-5 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Marquee */}
        <section id="testimonials" className="py-24 bg-zinc-900/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Loved by{' '}
                <span className="text-zinc-400">habit builders</span>
              </h2>
              <p className="text-zinc-500 mt-4 text-lg">Join thousands who have transformed their lives</p>
            </div>

            {/* First row - scrolling left */}
            <div className="relative mb-6">
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
              
              <div className="flex animate-marquee gap-6">
                {[
                  { quote: "FocusFlow helped me build a 90-day meditation streak. The visual progress is incredibly motivating!", author: "Sarah K.", role: "Product Designer", avatar: "👩‍🎨" },
                  { quote: "Finally, a habit tracker that's beautiful AND functional. I've tried many apps, this one sticks.", author: "Mike R.", role: "Software Engineer", avatar: "👨‍💻" },
                  { quote: "The year calendar view is genius. Seeing my entire year of progress keeps me going every day.", author: "Emily T.", role: "Fitness Coach", avatar: "👩‍🏫" },
                  { quote: "I love how simple yet powerful this app is. My morning routine has never been more consistent.", author: "James L.", role: "Entrepreneur", avatar: "👨‍💼" },
                  { quote: "The dark mode is perfect for evening journaling. Such a thoughtful design overall!", author: "Lisa M.", role: "Writer", avatar: "✍️" },
                  { quote: "Exporting my habit data to CSV has been a game changer for my personal analytics.", author: "David P.", role: "Data Analyst", avatar: "📊" },
                  // Duplicates for seamless loop
                  { quote: "FocusFlow helped me build a 90-day meditation streak. The visual progress is incredibly motivating!", author: "Sarah K.2", role: "Product Designer", avatar: "👩‍🎨" },
                  { quote: "Finally, a habit tracker that's beautiful AND functional. I've tried many apps, this one sticks.", author: "Mike R.2", role: "Software Engineer", avatar: "👨‍💻" },
                  { quote: "The year calendar view is genius. Seeing my entire year of progress keeps me going every day.", author: "Emily T.2", role: "Fitness Coach", avatar: "👩‍🏫" },
                  { quote: "I love how simple yet powerful this app is. My morning routine has never been more consistent.", author: "James L.2", role: "Entrepreneur", avatar: "👨‍💼" },
                  { quote: "The dark mode is perfect for evening journaling. Such a thoughtful design overall!", author: "Lisa M.2", role: "Writer", avatar: "✍️" },
                  { quote: "Exporting my habit data to CSV has been a game changer for my personal analytics.", author: "David P.2", role: "Data Analyst", avatar: "📊" },
                ].map((testimonial) => (
                  <div key={testimonial.author} className="shrink-0 w-80 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-zinc-300 mb-6 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.author.replace(/\d+$/, '')}</div>
                        <div className="text-xs text-zinc-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second row - scrolling right */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
              
              <div className="flex animate-marquee-reverse gap-6">
                {[
                  { quote: "The streak system keeps me accountable. I've never stuck with habits this long before!", author: "Chris W.", role: "Marketing Manager", avatar: "🎯" },
                  { quote: "Clean design, fast, no bloat. Exactly what a habit tracker should be. 10/10 would recommend.", author: "Anna B.", role: "UX Researcher", avatar: "🔬" },
                  { quote: "Being able to see my progress over the entire year is incredibly satisfying and motivating.", author: "Tom H.", role: "Teacher", avatar: "👨‍🏫" },
                  { quote: "The insights page helps me understand my patterns. I've optimized my schedule based on it!", author: "Rachel G.", role: "Project Manager", avatar: "📋" },
                  { quote: "I've recommended FocusFlow to everyone in my productivity group. It's that good!", author: "Kevin S.", role: "Life Coach", avatar: "🌟" },
                  { quote: "The PDF export feature is perfect for my monthly reviews. Love the attention to detail.", author: "Michelle D.", role: "Consultant", avatar: "📑" },
                  // Duplicates for seamless loop
                  { quote: "The streak system keeps me accountable. I've never stuck with habits this long before!", author: "Chris W.2", role: "Marketing Manager", avatar: "🎯" },
                  { quote: "Clean design, fast, no bloat. Exactly what a habit tracker should be. 10/10 would recommend.", author: "Anna B.2", role: "UX Researcher", avatar: "🔬" },
                  { quote: "Being able to see my progress over the entire year is incredibly satisfying and motivating.", author: "Tom H.2", role: "Teacher", avatar: "👨‍🏫" },
                  { quote: "The insights page helps me understand my patterns. I've optimized my schedule based on it!", author: "Rachel G.2", role: "Project Manager", avatar: "📋" },
                  { quote: "I've recommended FocusFlow to everyone in my productivity group. It's that good!", author: "Kevin S.2", role: "Life Coach", avatar: "🌟" },
                  { quote: "The PDF export feature is perfect for my monthly reviews. Love the attention to detail.", author: "Michelle D.2", role: "Consultant", avatar: "📑" },
                ].map((testimonial) => (
                  <div key={testimonial.author} className="shrink-0 w-80 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-all">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-zinc-300 mb-6 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.author.replace(/\d+$/, '')}</div>
                        <div className="text-xs text-zinc-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Build Better Habits?
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Join thousands of people building better habits with FocusFlow. It&apos;s free to get started.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-zinc-900 bg-white rounded-2xl hover:bg-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
            >
              Start Building Habits
              <ChevronRight className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-zinc-600">No credit card required • Free forever</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-zinc-900" />
              </div>
              <div>
                <span className="font-bold text-white">FocusFlow</span>
                <p className="text-xs text-zinc-500">Build better habits</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms</Link>
            </div>

            {/* Copyright */}
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
