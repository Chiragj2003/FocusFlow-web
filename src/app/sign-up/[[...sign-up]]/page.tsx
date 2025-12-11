import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* Light theme logo */}
            <Image
              src="/light.png"
              alt="FocusFlow"
              width={48}
              height={48}
              className="rounded-xl dark:hidden"
            />
            {/* Dark theme logo */}
            <Image
              src="/dark.png"
              alt="FocusFlow"
              width={48}
              height={48}
              className="rounded-xl hidden dark:block"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1">Start building better habits today</p>
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
