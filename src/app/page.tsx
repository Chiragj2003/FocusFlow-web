import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CheckCircle, BarChart3, Flame, Target, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold">FF</span>
          </div>
          <span className="font-bold text-xl text-gray-900">FocusFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Build Better Habits,{' '}
            <span className="text-primary">One Day at a Time</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            FocusFlow helps you track your daily habits, visualize your progress
            with beautiful charts, and build lasting streaks. Start your journey
            to a better you today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-6 py-3 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Start Tracking Free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CheckCircle,
              title: 'Daily Tracking',
              description:
                'Simple, beautiful grid to mark your habits complete each day.',
            },
            {
              icon: Flame,
              title: 'Streak Tracking',
              description:
                'Stay motivated with streak counters that celebrate your consistency.',
            },
            {
              icon: BarChart3,
              title: 'Visual Analytics',
              description:
                'See your progress with line charts, donut graphs, and weekly summaries.',
            },
            {
              icon: Target,
              title: 'Flexible Goals',
              description:
                'Track yes/no habits, durations, or quantities — whatever works for you.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 text-center py-16 px-8 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Join thousands of users who are building better habits with FocusFlow.
            It&apos;s free to get started.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            Create Your Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <p>© 2025 FocusFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
