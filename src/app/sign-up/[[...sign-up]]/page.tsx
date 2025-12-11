import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">FF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start building better habits today</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-primary hover:bg-primary/90 text-white',
              card: 'shadow-none border border-gray-200',
            },
          }}
        />
      </div>
    </div>
  )
}
