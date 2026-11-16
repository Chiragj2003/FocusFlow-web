/* ==================== ORIGINAL CODE START ====================
import { SignUp } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-zinc-900" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-zinc-400 mt-1">Start building better habits today</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-white hover:bg-zinc-200 text-zinc-900',
              card: 'shadow-none bg-zinc-900 border border-zinc-800',
              headerTitle: 'text-white',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700',
              formFieldLabel: 'text-zinc-300',
              formFieldInput: 'bg-zinc-800 border-zinc-700 text-white',
              footerActionLink: 'text-white hover:text-zinc-300',
            },
          }}
        />
      </div>
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

import { SignUp } from '@clerk/nextjs'
import { BrandMark } from '@/components/ui/BrandMark'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden py-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-6 flex flex-col items-center">
          <Link href="/" className="mb-4 inline-block hover:scale-105 transition-transform">
            <BrandMark size={72} />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Focus<span className="text-orange-500">Flow</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Light your first spark and start building consistency</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-[0_2px_14px_rgba(249,115,22,0.35)]',
              card: 'shadow-2xl bg-[#131316] border border-[#232328] rounded-3xl',
              headerTitle: 'text-white font-black',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-[#18181d] border border-[#232328] text-white hover:border-orange-500/40',
              formFieldLabel: 'text-zinc-300 font-semibold',
              formFieldInput: 'bg-[#18181d] border-[#232328] text-white focus:border-orange-500',
              footerActionLink: 'text-orange-400 hover:text-orange-300 font-bold',
            },
          }}
        />
      </div>
    </div>
  )
}
