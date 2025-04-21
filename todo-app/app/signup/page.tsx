import { SignupForm } from "@/components/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="font-bold text-xl">
          DoDidDone
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-muted-foreground mt-2">Enter your information to create an account</p>
          </div>
          <SignupForm />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline underline-offset-4 hover:text-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
