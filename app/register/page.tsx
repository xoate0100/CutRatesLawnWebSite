import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account | Cut Rates Lawn Care",
  description: "Create a Cut Rates Lawn Care account to manage your services, schedule appointments, and more.",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
        <RegisterForm />

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
