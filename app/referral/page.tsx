import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gift, DollarSign, Users } from "lucide-react"
import CTASection from "@/components/cta-section"

export default function ReferralPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Refer a Friend</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Share the love for a beautiful lawn and earn rewards. Refer your friends and family to Cut Rates Lawn
              Care!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    icon: Users,
                    title: "Refer",
                    description: "Share your unique referral link with friends and family.",
                  },
                  {
                    icon: Gift,
                    title: "They Sign Up",
                    description: "When your friend signs up for a service, they get 20% off their first service.",
                  },
                  {
                    icon: DollarSign,
                    title: "You Earn",
                    description: "You earn a $50 credit towards your next service for each successful referral.",
                  },
                ].map((step, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <step.icon className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <CardTitle>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                  <CardDescription>Share this link with your friends to start earning rewards!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex">
                    <Input value="https://cutratelawn.com/ref/yourname" readOnly className="flex-grow" />
                    <Button className="ml-2">Copy</Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-600">Referrals made: 0</p>
                  <p className="text-sm text-gray-600">Credits earned: $0</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Referral Program FAQ</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Is there a limit to how many people I can refer?",
                  answer: "No, there's no limit! The more you refer, the more you can earn.",
                },
                {
                  question: "How long does it take to receive my credit?",
                  answer:
                    "Credits are typically applied to your account within 7 days after your referred friend's first service is completed.",
                },
                {
                  question: "Can I use multiple credits on one service?",
                  answer: "Yes, you can use multiple credits on a single service, up to the full value of the service.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Start Referring?"
          description="Share your love for a beautiful lawn and earn rewards. It's a win-win!"
          primaryButtonText="Share Your Link"
          primaryButtonLink="#"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

