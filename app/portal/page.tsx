"use client"

import { redirect } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gift } from "lucide-react"

// Mock data - in a real application, this would come from your backend
const upcomingServices = [
  { id: 1, service: "Lawn Mowing", date: "2023-06-15", status: "Scheduled" },
  { id: 2, service: "Pest Control", date: "2023-06-22", status: "Pending" },
  { id: 3, service: "Fertilization", date: "2023-07-01", status: "Scheduled" },
]

const pastServices = [
  { id: 101, service: "Lawn Mowing", date: "2023-05-15", status: "Completed" },
  { id: 102, service: "Pest Control", date: "2023-05-22", status: "Completed" },
  { id: 103, service: "Spring Cleanup", date: "2023-04-01", status: "Completed" },
]

const pastInvoices = [
  { id: 1001, service: "Lawn Mowing", date: "2023-05-15", amount: 50, status: "Paid" },
  { id: 1002, service: "Pest Control", date: "2023-05-22", amount: 75, status: "Paid" },
  { id: 1003, service: "Spring Cleanup", date: "2023-04-01", amount: 150, status: "Paid" },
]

const referralInfo = {
  link: "https://cutratelawn.com/ref/johndoe",
  referrals: 2,
  creditsEarned: 100,
}

export default function CustomerPortalPage() {
  redirect("https://cutrateslawn.fieldportals.com/landing/index")
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Portal</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Manage your services, view invoices, and track your referral rewards all in one place.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {upcomingServices.slice(0, 3).map((service) => (
                          <li key={service.id} className="flex justify-between items-center">
                            <span>{service.service}</span>
                            <span className="text-sm text-gray-500">{new Date(service.date).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("services")}>
                        View All Services
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pastInvoices.slice(0, 3).map((invoice) => (
                          <li key={invoice.id} className="flex justify-between items-center">
                            <span>{invoice.service}</span>
                            <span>${invoice.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("invoices")}>
                        View All Invoices
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full">Schedule New Service</Button>
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Services</CardTitle>
                    <CardDescription>View and manage your scheduled and past services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Upcoming Services</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>{service.service}</TableCell>
                            <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                            <TableCell>{service.status}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <h3 className="text-lg font-semibold mb-4 mt-8">Past Services</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>{service.service}</TableCell>
                            <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                            <TableCell>{service.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button>Schedule New Service</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>View your billing history and manage payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.service}</TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                            <TableCell>${invoice.amount}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Download All Invoices</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="referrals">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referrals</CardTitle>
                    <CardDescription>Track your referrals and earned credits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <p className="font-semibold mb-2">Your Referral Link:</p>
                      <div className="flex">
                        <input
                          type="text"
                          value={referralInfo.link}
                          readOnly
                          className="flex-grow p-2 border rounded-l"
                        />
                        <Button className="rounded-l-none">Copy</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Referrals Made:</p>
                        <p className="text-2xl">{referralInfo.referrals}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Credits Earned:</p>
                        <p className="text-2xl">${referralInfo.creditsEarned}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      Refer More Friends <Gift className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="communication">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                    <CardDescription>Manage how we contact you and receive important updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive updates and reminders via email</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Get text message alerts for important information</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Service Reminders</h3>
                          <p className="text-sm text-gray-500">
                            Choose how you want to be reminded of upcoming services
                          </p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Personal Information</h3>
                          <p className="text-sm text-gray-500">Update your name, email, and phone number</p>
                        </div>
                        <Button variant="outline">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Password</h3>
                          <p className="text-sm text-gray-500">Change your account password</p>
                        </div>
                        <Button variant="outline">Change</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Billing Information</h3>
                          <p className="text-sm text-gray-500">Manage your payment methods and billing address</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Notification Preferences</h3>
                          <p className="text-sm text-gray-500">Choose how and when you want to be notified</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}

