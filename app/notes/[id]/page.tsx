"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export default function ViewNotePage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const noteId = params.id as string

  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await apiClient.request(`/notes/${noteId}`)
        if (response.success) {
          setNote(response.data.note)
        } else {
          router.push("/notes")
        }
      } catch (error) {
        console.error("Failed to fetch note:", error)
        router.push("/notes")
      } finally {
        setIsLoading(false)
      }
    }

    if (noteId) {
      fetchNote()
    }
  }, [noteId, router])

  const deleteNote = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await apiClient.deleteNote(noteId)
      router.push("/notes")
    } catch (error) {
      console.error("Failed to delete note:", error)
      alert("Failed to delete note")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="p-8">
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-2">Note not found</h2>
                <p className="text-muted-foreground mb-4">
                  The note you're looking for doesn't exist or has been deleted.
                </p>
                <Link href="/notes">
                  <Button>Back to Notes</Button>
                </Link>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/notes">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{note.title || "Untitled"}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {new Date(note.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/notes/edit/${note.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={deleteNote}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="max-w-4xl">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {note.content ? (
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">{note.content}</div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>This note has no content yet.</p>
                      <Link href={`/notes/edit/${note.id}`}>
                        <Button variant="outline" className="mt-4 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Add Content
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
