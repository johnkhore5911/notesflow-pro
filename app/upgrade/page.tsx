"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Users, Search, BarChart3, Shield, Star } from "lucide-react"

export default function UpgradePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user?.tenant.slug) return

    setIsLoading(true)
    try {
      const response = await apiClient.upgradeSubscription(user.tenant.slug)
      if (response.success) {
        alert("Upgrade successful! Please refresh the page.")
        window.location.reload()
      } else {
        alert(response.message || "Upgrade failed")
      }
    } catch (error: any) {
      alert(error.message || "Upgrade failed")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      name: "Notes Limit",
      free: "3 Notes",
      pro: "Unlimited Notes",
      icon: Crown,
    },
    {
      name: "Advanced Search",
      free: "Basic Search",
      pro: "Full-text Search & Filters",
      icon: Search,
    },
    {
      name: "Team Collaboration",
      free: "Personal Only",
      pro: "Team Sharing & Comments",
      icon: Users,
    },
    {
      name: "Analytics Dashboard",
      free: "Basic Stats",
      pro: "Advanced Analytics",
      icon: BarChart3,
    },
    {
      name: "Customer Support",
      free: "Community Support",
      pro: "Priority Support",
      icon: Shield,
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Scale Your Team's Productivity",
      description: "Remove all limits and let your team create unlimited notes and collaborate seamlessly.",
    },
    {
      icon: Search,
      title: "Advanced Search & Filtering",
      description: "Find any note instantly with powerful search capabilities and smart filtering options.",
    },
    {
      icon: Users,
      title: "Team Collaboration Tools",
      description: "Share notes with team members, add comments, and work together in real-time.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Get insights into your team's productivity with detailed analytics and reporting.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content:
        "NotesFlow Pro transformed how our team collaborates. The unlimited notes and advanced search are game-changers!",
    },
    {
      name: "Mike Chen",
      role: "Engineering Lead",
      content: "The analytics dashboard helps us track our documentation efforts. Worth every penny!",
    },
  ]

  if (user?.tenant.subscription_plan === "pro") {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="p-8">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">You're Already Pro!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You're currently on the Pro plan and have access to all premium features.
                </p>
                <Button onClick={() => window.history.back()}>Back to Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <div className="p-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Unlock Unlimited Potential</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take your note-taking to the next level with Pro features designed for teams and power users.
            </p>
          </div>

          {/* Comparison Table */}
          <Card className="max-w-4xl mx-auto mb-12 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Feature</h3>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Current Plan
                  </Badge>
                  <h3 className="font-semibold text-lg">Free</h3>
                </div>
                <div className="text-center">
                  <Badge className="mb-2">
                    <Crown className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                  <h3 className="font-semibold text-lg">Pro</h3>
                </div>

                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="contents">
                      <div className="flex items-center gap-3 p-4">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-muted-foreground">{feature.free}</span>
                      </div>
                      <div className="p-4 text-center">
                        <span className="font-medium text-primary">{feature.pro}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 text-center">
                <div className="text-3xl font-bold mb-2">
                  $29<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleUpgrade} disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Pro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end
                    of your billing period.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">What happens to my notes if I downgrade?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your notes will remain safe. However, you'll be limited to viewing only your first 3 notes until you
                    upgrade again or delete some notes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 30-day money-back guarantee, so you can try Pro risk-free for a full month.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
