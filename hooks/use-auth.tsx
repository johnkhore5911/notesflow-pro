// "use client"

// import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
// import { apiClient } from "@/lib/api-client"

// interface User {
//   id: string
//   email: string
//   role: "admin" | "member"
//   tenant: {
//     id: string
//     slug: string
//     name: string
//     subscription_plan: "free" | "pro"
//   }
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<any>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       apiClient.setToken(token)
//       // Verify token and set user
//       apiClient
//         .verifyToken()
//         .then((response) => {
//           if (response.success) {
//             setUser(response.data.user)
//           } else {
//             localStorage.removeItem("token")
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem("token")
//         })
//         .finally(() => {
//           setIsLoading(false)
//         })
//     } else {
//       setIsLoading(false)
//     }
//   }, [])

//   const login = async (email: string, password: string) => {
//     const response = await apiClient.login(email, password)
//     if (response.success) {
//       localStorage.setItem("token", response.data.token)
//       apiClient.setToken(response.data.token)
//       setUser(response.data.user)
//       return response
//     }
//     throw new Error(response.message)
//   }

//   const logout = () => {
//     localStorage.removeItem("token")
//     setUser(null)
//     apiClient.setToken("")
//   }

//   return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// "use client"

// import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
// import { useRouter } from "next/navigation" // Add this import
// import { apiClient } from "@/lib/api-client"

// interface User {
//   id: string
//   email: string
//   role: "admin" | "member"
//   tenant: {
//     id: string
//     slug: string
//     name: string
//     subscription_plan: "free" | "pro"
//   }
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<any>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter() // Add this

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       apiClient.setToken(token)
//       // Verify token and set user
//       apiClient
//         .verifyToken()
//         .then((response) => {
//           if (response.success) {
//             setUser(response.data.user)
//           } else {
//             localStorage.removeItem("token")
//             apiClient.setToken("")
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem("token")
//           apiClient.setToken("")
//         })
//         .finally(() => {
//           setIsLoading(false)
//         })
//     } else {
//       setIsLoading(false)
//     }
//   }, [])

//   const login = async (email: string, password: string) => {
//     const response = await apiClient.login(email, password)
//     if (response.success) {
//       localStorage.setItem("token", response.data.token)
//       apiClient.setToken(response.data.token)
//       setUser(response.data.user)
      
//       // Redirect to dashboard after successful login
//       router.push("/dashboard")
      
//       return response
//     }
//     throw new Error(response.message)
//   }

//   const logout = () => {
//     console.log("Logging out...") // Debug log
    
//     // Clear token from localStorage
//     localStorage.removeItem("token")
    
//     // Clear user state
//     setUser(null)
    
//     // Clear token from API client
//     apiClient.setToken("")
    
//     console.log("User logged out, redirecting to login...") // Debug log
    
//     // Redirect to login page
//     router.push("/login")
//   }

//   return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }


"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  email: string
  role: "admin" | "member"
  tenant: {
    id: string
    slug: string
    name: string
    subscription_plan: "free" | "pro"
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      apiClient.setToken(token)
      // Get full profile instead of just verifying token
      apiClient
        .getProfile() // This gives you full user data with tenant info
        .then((response) => {
          console.log("Profile response:", response) // Debug log
          if (response.success) {
            setUser(response.data)
          } else {
            console.log("Profile failed, removing token")
            localStorage.removeItem("token")
            apiClient.setToken("")
          }
        })
        .catch((error) => {
          console.error("Profile fetch failed:", error)
          localStorage.removeItem("token")
          apiClient.setToken("")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      console.log("Login response:", response) // Debug log
      
      if (response.success) {
        localStorage.setItem("token", response.data.token)
        apiClient.setToken(response.data.token)
        setUser(response.data.user)
        
        // Redirect to dashboard after successful login
        router.push("/dashboard")
        
        return response
      }
      throw new Error(response.message)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out...")
    
    // Clear token from localStorage
    localStorage.removeItem("token")
    
    // Clear user state
    setUser(null)
    
    // Clear token from API client
    apiClient.setToken("")
    
    console.log("User logged out, redirecting to login...")
    
    // Redirect to login page
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
