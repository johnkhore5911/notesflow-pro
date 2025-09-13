// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { LayoutDashboard, FileText, Plus, Settings, LogOut, Crown, Menu, X } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function Sidebar() {
//   const { user, logout } = useAuth()
//   const pathname = usePathname()
//   const [isCollapsed, setIsCollapsed] = useState(false)

//   const navigation = [
//     { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//     { name: "Notes", href: "/notes", icon: FileText },
//     { name: "Create Note", href: "/notes/create", icon: Plus },
//   ]

//   if (user?.role === "admin") {
//     navigation.push({ name: "Settings", href: "/settings", icon: Settings })
//   }

//   return (
//     <>
//       {/* Mobile menu button */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="fixed top-4 left-4 z-50 md:hidden"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//       </Button>

//       {/* Sidebar */}
//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
//           isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
//         )}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="p-6 border-b border-sidebar-border">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                 <FileText className="w-4 h-4 text-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="font-semibold text-sidebar-foreground">NotesFlow Pro</h1>
//                 <p className="text-xs text-sidebar-foreground/60">{user?.tenant?.name}</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4 space-y-2">
//             {navigation.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                     isActive
//                       ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                       : "text-sidebar-foreground hover:bg-sidebar-accent/50",
//                   )}
//                 >
//                   <Icon className="w-4 h-4" />
//                   {item.name}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* Subscription status */}
//           <div className="p-4 border-t border-sidebar-border">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm font-medium text-sidebar-foreground">Plan</span>
//               <Badge variant={user?.tenant?.subscription_plan === "pro" ? "default" : "secondary"}>
//                 {user?.tenant?.subscription_plan === "pro" ? (
//                   <>
//                     <Crown className="w-3 h-3 mr-1" /> Pro
//                   </>
//                 ) : (
//                   "Free"
//                 )}
//               </Badge>
//             </div>

//             {user?.tenant.subscription_plan === "free" && (
//               <Link href="/upgrade">
//                 <Button className="w-full" size="sm">
//                   Upgrade to Pro
//                 </Button>
//               </Link>
//             )}
//           </div>

//           {/* User info and logout */}
//           <div className="p-4 border-t border-sidebar-border">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                 <span className="text-xs font-medium text-primary">{user?.email.charAt(0).toUpperCase()}</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email}</p>
//                 <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
//               </div>
//             </div>
//             <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {!isCollapsed && (
//         <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsCollapsed(true)} />
//       )}
//     </>
//   )
// }

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, FileText, Plus, Settings, LogOut, Crown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Add loading state check
  if (!user) {
    return null // or a loading skeleton
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Create Note", href: "/notes/create", icon: Plus },
  ]

  if (user?.role === "admin") {
    navigation.push({ name: "Settings", href: "/settings", icon: Settings })
  }

  // Safe access to subscription plan
  const subscriptionPlan = user?.tenant?.subscription_plan || "free"
  const tenantName = user?.tenant?.name || "Loading..."

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sidebar-foreground">NotesFlow Pro</h1>
                <p className="text-xs text-sidebar-foreground/60">{tenantName}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Subscription status - FIXED */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-sidebar-foreground">Plan</span>
              <Badge variant={subscriptionPlan === "pro" ? "default" : "secondary"}>
                {subscriptionPlan === "pro" ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" /> Pro
                  </>
                ) : (
                  "Free"
                )}
              </Badge>
            </div>

            {/* Fixed conditional rendering */}
            {subscriptionPlan === "free" && (
              <Link href="/upgrade">
                <Button className="w-full" size="sm">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>

          {/* User info and logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email || "Unknown"}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role || "user"}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsCollapsed(true)} />
      )}
    </>
  )
}
