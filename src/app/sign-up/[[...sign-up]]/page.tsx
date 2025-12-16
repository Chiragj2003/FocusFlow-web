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
