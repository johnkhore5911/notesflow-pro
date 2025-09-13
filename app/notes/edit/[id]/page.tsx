"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import Link from "next/link"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export default function EditNotePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string

  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await apiClient.request(`/notes/${noteId}`)
        if (response.success) {
          const noteData = response.data.note
          setNote(noteData)
          setTitle(noteData.title || "")
          setContent(noteData.content || "")
          setTags(noteData.tags || [])
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

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSaving(true)
    try {
      const response = await apiClient.updateNote(noteId, {
        title: title.trim(),
        content: content.trim(),
        tags,
      })

      if (response.success) {
        router.push("/notes")
      } else {
        alert(response.message || "Failed to update note")
      }
    } catch (error: any) {
      alert(error.message || "Failed to update note")
    } finally {
      setIsSaving(false)
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/notes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Note</h1>
              <p className="text-muted-foreground">Update your note content</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <Input
                      placeholder="Note title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
                      maxLength={200}
                    />
                    <div className="text-xs text-muted-foreground mt-1">{title.length}/200 characters</div>
                  </div>

                  {/* Tags Input */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={addTag} disabled={!tagInput.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Content Textarea */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Start writing your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] border-none bg-transparent px-0 focus-visible:ring-0 resize-none"
                    maxLength={10000}
                  />
                  <div className="text-xs text-muted-foreground">{content.length}/10,000 characters</div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={!title.trim() || isSaving} className="min-w-[120px]">
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Link href="/notes">
                <Button variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
