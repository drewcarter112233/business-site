"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin/dashboard")
    } else {
      setError("Invalid password")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
