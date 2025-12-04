import Link from "next/link"
import { Sms } from "iconsax-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sms size={24} variant="Bulk" color="currentcolor" className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MboaSMS</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your SMS
            <span className="block text-purple-600">Campaigns Efficiently</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Send, track, and analyze your SMS campaigns with our powerful platform.
            Reach your audience instantly with MboaSMS.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sms size={24} variant="Bulk" color="currentcolor" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bulk SMS</h3>
            <p className="text-gray-600">
              Send thousands of messages at once with our bulk SMS feature
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sms size={24} variant="Bulk" color="currentcolor" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Management</h3>
            <p className="text-gray-600">
              Organize and manage your contacts with groups and categories
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sms size={24} variant="Bulk" color="currentcolor" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track your campaign performance with detailed analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
