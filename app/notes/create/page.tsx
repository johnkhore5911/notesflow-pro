"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import Link from "next/link"

export default function CreateNotePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const canCreateNote = user?.tenant.subscription_plan === "pro" || true // We'll check on server

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

    setIsLoading(true)
    try {
      const response = await apiClient.createNote({
        title: title.trim(),
        content: content.trim(),
        tags,
      })

      if (response.success) {
        router.push("/notes")
      } else {
        alert(response.message || "Failed to create note")
      }
    } catch (error: any) {
      alert(error.message || "Failed to create note")
    } finally {
      setIsLoading(false)
    }
  }

  if (!canCreateNote) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="p-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Note Limit Reached</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  You've reached your note limit. Upgrade to Pro for unlimited notes.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/upgrade">
                    <Button>Upgrade to Pro</Button>
                  </Link>
                  <Link href="/notes">
                    <Button variant="outline">Back to Notes</Button>
                  </Link>
                </div>
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
          <div className="flex items-center gap-4 mb-8">
            <Link href="/notes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Note</h1>
              <p className="text-muted-foreground">Write your thoughts and ideas</p>
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
              <Button type="submit" disabled={!title.trim() || isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Note
                  </>
                )}
              </Button>

              <Link href="/notes">
                <Button variant="outline" disabled={isLoading}>
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
