'use client'

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Dashboard from "./dashboard/page"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-notion-gray-light">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-notion-blue rounded-lg flex items-center justify-center mx-auto">
            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Loading...</h2>
            <p className="text-sm text-gray-600">Authenticating your session</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-600 mt-2">You do not have permission to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard />
}