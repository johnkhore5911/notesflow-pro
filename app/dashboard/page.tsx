"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Users, Crown, Clock, Eye } from "lucide-react"
import Link from "next/link"

interface DashboardData {
  stats: {
    totalNotes: number
    notesLimit: number
    subscriptionPlan: string
  }
  recentNotes: Array<{
    id: string
    title: string
    content: string
    created_at: string
    updated_at: string
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tenantInfo, notes] = await Promise.all([apiClient.getTenantInfo(), apiClient.getNotes({ limit: 5 })])

        setData({
          stats: {
            totalNotes: notes.data?.notes?.length || 0,
            notesLimit: user?.tenant.subscription_plan === "pro" ? -1 : 3,
            subscriptionPlan: user?.tenant.subscription_plan || "free",
          },
          recentNotes: notes.data?.notes || [],
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const canCreateNote =
    data?.stats.subscriptionPlan === "pro" || (data?.stats.totalNotes || 0) < (data?.stats.notesLimit || 3)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.email.split("@")[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your notes today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.stats.totalNotes || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.stats.subscriptionPlan === "pro"
                    ? "Unlimited"
                    : `${data?.stats.totalNotes || 0} of ${data?.stats.notesLimit} used`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{data?.stats.subscriptionPlan}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.stats.subscriptionPlan === "pro" ? "All features unlocked" : "Limited features"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.tenant?.name}</div>
                <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/notes/create">
                  <Button className="w-full justify-start" disabled={!canCreateNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Note
                  </Button>
                </Link>

                {!canCreateNote && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">You've reached your note limit</p>
                    <Link href="/upgrade">
                      <Button size="sm" variant="outline">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )}

                <Link href="/notes">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recentNotes.length ? (
                  <div className="space-y-3">
                    {data.recentNotes.map((note) => (
                      <Link
                        key={note.id}
                        href={`/notes/${note.id}`}
                        className="block p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <h4 className="font-medium text-sm mb-1 truncate">{note.title || "Untitled"}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{note.content || "No content"}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.updated_at).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No notes yet. Create your first note to get started!
                    </p>
                    <Link href="/notes/create">
                      <Button size="sm" disabled={!canCreateNote}>
                        Create Note
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
