import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Cut Rates Lawn Care",
  description: "Login to your Cut Rates Lawn Care account to manage your services and view your order history.",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
        <LoginForm />

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-600 hover:text-green-800 font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
