"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, User, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const testAccounts = [
  { email: "admin@acme.test", password: "password", label: "Admin - Acme Corp", role: "admin", tenant: "Acme" },
  { email: "user@acme.test", password: "password", label: "Member - Acme Corp", role: "member", tenant: "Acme" },
  { email: "admin@globex.test", password: "password", label: "Admin - Globex Corp", role: "admin", tenant: "Globex" },
  { email: "user@globex.test", password: "password", label: "Member - Globex Corp", role: "member", tenant: "Globex" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (account: (typeof testAccounts)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg"
          >
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">NotesFlow Pro</h1>
          <p className="text-muted-foreground">Professional Notes Management</p>
        </div>

        {/* Login Card with Glassmorphism */}
        <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to your NotesFlow Pro account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Login Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="quick-login" className="text-sm font-medium">
                Quick Login (Demo Accounts)
              </Label>
              <Select
                onValueChange={(value) => {
                  const account = testAccounts.find((acc) => acc.email === value)
                  if (account) handleQuickLogin(account)
                }}
              >
                <SelectTrigger id="quick-login" className="bg-input border-border">
                  <SelectValue placeholder="Select a demo account" />
                </SelectTrigger>
                <SelectContent>
                  {testAccounts.map((account) => (
                    <SelectItem key={account.email} value={account.email}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{account.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </motion.div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Secure multi-tenant authentication</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>© 2024 NotesFlow Pro. Professional notes management for teams.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
