// import type React from "react"
// import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
// import { AuthProvider } from "@/hooks/use-auth"
// import { Suspense } from "react"
// import "./globals.css"

// export const metadata: Metadata = {
//   title: "NotesFlow Pro - Professional Notes Management",
//   description: "Multi-tenant SaaS notes application for business teams",
//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon.ico',
//   },
// }
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/favicon.ico" type="image/x-icon" />
//         <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
//         <meta name="theme-color" content="#1e40af" />
//       </head>
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <Suspense fallback={<div>Loading...</div>}>
//           <AuthProvider>{children}</AuthProvider>
//         </Suspense>
//         <Analytics />
//       </body>
//     </html>
//   )
// }


import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/hooks/use-auth"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "NotesFlow Pro - Professional Notes Management",
  description: "Multi-tenant SaaS notes application for business teams",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
