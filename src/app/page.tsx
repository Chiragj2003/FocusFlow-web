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
  Moon,
  Zap,
  Star,
  ChevronRight,
  Github,
  Flame
} from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-80 h-80 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/dark.png"
              alt="FocusFlow"
              width={40}
              height={40}
              className="rounded-xl shadow-lg shadow-primary/25 dark:hidden"
            />
            <Image
              src="/light.png"
              alt="FocusFlow"
              width={40}
              height={40}
              className="rounded-xl shadow-lg shadow-primary/25 hidden dark:block"
            />
            <span className="font-bold text-xl text-foreground">FocusFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-primary to-primary/80 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Build habits that actually stick</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              Transform Your Life,{' '}
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  One Habit
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#FFB4A2"/>
                      <stop offset="1" stopColor="#CDE7E4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}at a Time
            </h1>
            
            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              The beautiful habit tracker that helps you build consistency, 
              track your streaks, and visualize your progress with stunning analytics.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-linear-to-r from-primary to-primary/80 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Building Habits
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-foreground bg-card border border-border rounded-2xl hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                See How It Works
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {['🧑‍💻', '👩‍🎨', '👨‍🏫', '👩‍⚕️', '🧑‍🚀'].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-linear-to-br from-muted to-muted/50 border-2 border-background flex items-center justify-center text-lg">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Loved by <span className="font-semibold text-foreground">1,000+</span> habit builders worldwide
              </p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl">
              <div className="bg-card rounded-3xl border border-border shadow-2xl shadow-black/10 overflow-hidden">
                {/* Browser Chrome */}
                <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-muted rounded-lg text-xs text-muted-foreground font-mono">
                      focusflow.app/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard Content */}
                <div className="p-6 bg-background/50">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Active Habits', value: '8', icon: '📊', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Completion', value: '87%', icon: '🎯', color: 'from-green-500 to-emerald-500' },
                      { label: 'Current Streak', value: '21', icon: '🔥', color: 'from-orange-500 to-red-500' },
                      { label: 'Best Streak', value: '45', icon: '🏆', color: 'from-purple-500 to-pink-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{stat.icon}</span>
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className={`text-2xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-card rounded-xl border border-border p-4 h-44">
                      <div className="text-sm font-medium text-foreground mb-4">Monthly Progress</div>
                      <div className="flex items-end gap-1.5 h-28">
                        {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-linear-to-t from-primary to-primary/40 rounded-t-sm transition-all hover:from-primary hover:to-primary/60" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-4 h-44 flex flex-col items-center justify-center">
                      <div className="relative w-28 h-28">
                        <svg className="w-28 h-28 -rotate-90">
                          <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" className="text-muted" strokeWidth="10" />
                          <circle cx="56" cy="56" r="48" fill="none" stroke="url(#donut-gradient)" strokeWidth="10" strokeDasharray="301" strokeDashoffset="39" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="donut-gradient">
                              <stop stopColor="#FFB4A2" />
                              <stop offset="1" stopColor="#CDE7E4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-foreground">87%</span>
                          <span className="text-xs text-muted-foreground">Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-sm font-medium text-foreground mb-4">
                <Zap className="w-4 h-4 text-accent" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Everything you need to{' '}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">succeed</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with the science of habit formation in mind. Every feature is designed to help you stay consistent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'Simple Daily Tracking',
                  description: 'Mark habits complete with a single tap. Clean, distraction-free interface.',
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: Flame,
                  title: 'Streak Motivation',
                  description: 'Watch your streaks grow. Never want to break the chain once you start.',
                  gradient: 'from-orange-500 to-red-500',
                },
                {
                  icon: BarChart3,
                  title: 'Beautiful Analytics',
                  description: 'Line charts, donut graphs, weekly bars. See your progress visualized.',
                  gradient: 'from-blue-500 to-indigo-500',
                },
                {
                  icon: Target,
                  title: 'Flexible Goals',
                  description: 'Binary (yes/no), duration (30 min), or quantity (8 glasses). Your choice.',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Calendar,
                  title: 'Year Calendar View',
                  description: 'See your entire year at a glance with color-coded progress circles.',
                  gradient: 'from-teal-500 to-cyan-500',
                },
                {
                  icon: Moon,
                  title: 'Dark Mode',
                  description: 'Easy on the eyes, day or night. Automatic or manual theme switching.',
                  gradient: 'from-slate-600 to-slate-800',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Start in{' '}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">3 simple steps</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get up and running in under a minute
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Habits',
                  description: 'Add the habits you want to build. Set your goals and pick your colors.',
                  icon: '✨',
                },
                {
                  step: '02',
                  title: 'Track Daily',
                  description: 'Check off your habits each day. Watch your streaks grow over time.',
                  icon: '📅',
                },
                {
                  step: '03',
                  title: 'See Your Progress',
                  description: 'View insights and analytics. Celebrate your wins and adjust as needed.',
                  icon: '📈',
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-border to-transparent" />
                  )}
                  <div className="bg-card rounded-2xl border border-border p-8 text-center relative hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl mx-auto mb-6">
                      {item.icon}
                    </div>
                    <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-muted/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Loved by{' '}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">habit builders</span>
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">Join thousands who have transformed their lives</p>
            </div>

            {/* First row - scrolling right to left */}
            <div className="relative mb-6">
              <div className="flex animate-scroll-left gap-6">
                {[
                  {
                    quote: "FocusFlow helped me build a 90-day meditation streak. The visual progress is incredibly motivating!",
                    author: "Sarah K.",
                    role: "Product Designer",
                    avatar: "👩‍🎨",
                  },
                  {
                    quote: "Finally, a habit tracker that's beautiful AND functional. I've tried many apps, this one sticks.",
                    author: "Mike R.",
                    role: "Software Engineer",
                    avatar: "👨‍💻",
                  },
                  {
                    quote: "The year calendar view is genius. Seeing my entire year of progress keeps me going every day.",
                    author: "Emily T.",
                    role: "Fitness Coach",
                    avatar: "👩‍🏫",
                  },
                  {
                    quote: "I love how simple yet powerful this app is. My morning routine has never been more consistent.",
                    author: "James L.",
                    role: "Entrepreneur",
                    avatar: "👨‍💼",
                  },
                  {
                    quote: "The dark mode is perfect for evening journaling. Such a thoughtful design overall!",
                    author: "Lisa M.",
                    role: "Writer",
                    avatar: "✍️",
                  },
                  {
                    quote: "Exporting my habit data to CSV has been a game changer for my personal analytics.",
                    author: "David P.",
                    role: "Data Analyst",
                    avatar: "📊",
                  },
                  // Duplicate for infinite scroll effect
                  {
                    quote: "FocusFlow helped me build a 90-day meditation streak. The visual progress is incredibly motivating!",
                    author: "Sarah K.2",
                    role: "Product Designer",
                    avatar: "👩‍🎨",
                  },
                  {
                    quote: "Finally, a habit tracker that's beautiful AND functional. I've tried many apps, this one sticks.",
                    author: "Mike R.2",
                    role: "Software Engineer",
                    avatar: "👨‍💻",
                  },
                  {
                    quote: "The year calendar view is genius. Seeing my entire year of progress keeps me going every day.",
                    author: "Emily T.2",
                    role: "Fitness Coach",
                    avatar: "👩‍🏫",
                  },
                  {
                    quote: "I love how simple yet powerful this app is. My morning routine has never been more consistent.",
                    author: "James L.2",
                    role: "Entrepreneur",
                    avatar: "👨‍💼",
                  },
                  {
                    quote: "The dark mode is perfect for evening journaling. Such a thoughtful design overall!",
                    author: "Lisa M.2",
                    role: "Writer",
                    avatar: "✍️",
                  },
                  {
                    quote: "Exporting my habit data to CSV has been a game changer for my personal analytics.",
                    author: "David P.2",
                    role: "Data Analyst",
                    avatar: "📊",
                  },
                ].map((testimonial) => (
                  <div key={testimonial.author} className="shrink-0 w-80 bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.author.replace(/\d+$/, '')}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second row - scrolling left to right */}
            <div className="relative">
              <div className="flex animate-scroll-right gap-6">
                {[
                  {
                    quote: "The streak system keeps me accountable. I've never stuck with habits this long before!",
                    author: "Chris W.",
                    role: "Marketing Manager",
                    avatar: "🎯",
                  },
                  {
                    quote: "Clean design, fast, no bloat. Exactly what a habit tracker should be. 10/10 would recommend.",
                    author: "Anna B.",
                    role: "UX Researcher",
                    avatar: "🔬",
                  },
                  {
                    quote: "Being able to see my progress over the entire year is incredibly satisfying and motivating.",
                    author: "Tom H.",
                    role: "Teacher",
                    avatar: "👨‍🏫",
                  },
                  {
                    quote: "The insights page helps me understand my patterns. I've optimized my schedule based on it!",
                    author: "Rachel G.",
                    role: "Project Manager",
                    avatar: "📋",
                  },
                  {
                    quote: "I've recommended FocusFlow to everyone in my productivity group. It's that good!",
                    author: "Kevin S.",
                    role: "Life Coach",
                    avatar: "🌟",
                  },
                  {
                    quote: "The PDF export feature is perfect for my monthly reviews. Love the attention to detail.",
                    author: "Michelle D.",
                    role: "Consultant",
                    avatar: "📑",
                  },
                  // Duplicate for infinite scroll effect
                  {
                    quote: "The streak system keeps me accountable. I've never stuck with habits this long before!",
                    author: "Chris W.2",
                    role: "Marketing Manager",
                    avatar: "🎯",
                  },
                  {
                    quote: "Clean design, fast, no bloat. Exactly what a habit tracker should be. 10/10 would recommend.",
                    author: "Anna B.2",
                    role: "UX Researcher",
                    avatar: "🔬",
                  },
                  {
                    quote: "Being able to see my progress over the entire year is incredibly satisfying and motivating.",
                    author: "Tom H.2",
                    role: "Teacher",
                    avatar: "👨‍🏫",
                  },
                  {
                    quote: "The insights page helps me understand my patterns. I've optimized my schedule based on it!",
                    author: "Rachel G.2",
                    role: "Project Manager",
                    avatar: "📋",
                  },
                  {
                    quote: "I've recommended FocusFlow to everyone in my productivity group. It's that good!",
                    author: "Kevin S.2",
                    role: "Life Coach",
                    avatar: "🌟",
                  },
                  {
                    quote: "The PDF export feature is perfect for my monthly reviews. Love the attention to detail.",
                    author: "Michelle D.2",
                    role: "Consultant",
                    avatar: "📑",
                  },
                ].map((testimonial) => (
                  <div key={testimonial.author} className="shrink-0 w-80 bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.author.replace(/\d+$/, '')}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/20 via-accent/10 to-primary/20 border border-primary/20 p-12 text-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Ready to Transform Your Habits?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of people building better habits with FocusFlow. It&apos;s free to get started.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/sign-up"
                    className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-linear-to-r from-primary to-primary/80 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Create Your Free Account
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">No credit card required • Free forever</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/dark.png"
                alt="FocusFlow"
                width={32}
                height={32}
                className="rounded-lg dark:hidden"
              />
              <Image
                src="/light.png"
                alt="FocusFlow"
                width={32}
                height={32}
                className="rounded-lg hidden dark:block"
              />
              <span className="font-semibold text-foreground">FocusFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <a href="https://github.com/Chiragj2003/FocusFlow-web" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FocusFlow. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
