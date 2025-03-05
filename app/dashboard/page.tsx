import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Calendar, FileText, Settings } from "lucide-react"

// This would typically come from an API or database
const upcomingServices = [
  { id: 1, service: "Lawn Mowing", date: "2023-06-15", status: "Scheduled" },
  { id: 2, service: "Pest Control", date: "2023-06-22", status: "Pending" },
  { id: 3, service: "Fertilization", date: "2023-07-01", status: "Scheduled" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Dashboard</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Manage your services, view upcoming appointments, and access your account information.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Upcoming Services */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Services</CardTitle>
                  <CardDescription>Your scheduled and pending services</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingServices.map((service) => (
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
                  <Link href="/schedule">
                    <Button variant="outline">
                      Schedule New Service <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/schedule" className="block">
                    <Button className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Service
                    </Button>
                  </Link>
                  <Link href="/invoices" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> View Invoices
                    </Button>
                  </Link>
                  <Link href="/account" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" /> Account Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

