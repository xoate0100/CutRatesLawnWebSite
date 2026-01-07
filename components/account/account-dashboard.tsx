"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { UserType } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

interface AccountDashboardProps {
  user: UserType
}

export function AccountDashboard({ user }: AccountDashboardProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push("/")
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100">
            <h2 className="font-bold text-xl text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("properties")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "properties"
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "orders"
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Order History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "settings"
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Account Settings
                </button>
              </li>
              <li className="pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4">
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-lg text-blue-800 mb-2">Active Services</h3>
                <p className="text-blue-700 text-3xl font-bold">
                  {user.properties?.length ? user.properties.length : 0}
                </p>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("properties")
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block mt-4"
                >
                  View Properties →
                </Link>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <h3 className="font-bold text-lg text-green-800 mb-2">Recent Orders</h3>
                <p className="text-green-700 text-3xl font-bold">{user.orders?.length ? user.orders.length : 0}</p>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("orders")
                  }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium inline-block mt-4"
                >
                  View Orders →
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/quote"
                  className="bg-white border border-gray-300 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all flex items-center"
                >
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Request a Quote</h4>
                    <p className="text-sm text-gray-600">Get a custom quote for your property</p>
                  </div>
                </Link>

                <Link
                  href="/services"
                  className="bg-white border border-gray-300 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all flex items-center"
                >
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Services</h4>
                    <p className="text-sm text-gray-600">Explore our lawn care services</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Properties</h2>
              <Link
                href="/quote"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Property
              </Link>
            </div>

            {user.properties && user.properties.length > 0 ? (
              <div className="space-y-4">
                {user.properties.map((property) => (
                  <div
                    key={property.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{property.address}</h3>
                    <p className="text-gray-600 mb-2">
                      {property.city}, {property.state} {property.zipCode}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{property.type}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{property.size}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-sm text-green-600 hover:text-green-800">Schedule Service</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">You haven't added any properties to your account yet.</p>
                <Link
                  href="/quote"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add Your First Property
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>

            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">Order #{order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 mb-3">Total: ${order.total.toFixed(2)}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Order Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link
                  href="/services"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Browse Services
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        defaultValue={user.firstName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        defaultValue={user.lastName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Update Information
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Change Password
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        defaultChecked
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smsNotifications"
                        defaultChecked
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="smsNotifications" className="ml-2 block text-gray-700">
                        SMS Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketingEmails"
                        defaultChecked
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketingEmails" className="ml-2 block text-gray-700">
                        Marketing Emails
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Preferences
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
