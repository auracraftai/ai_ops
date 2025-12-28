import { useRouter } from "next/router"
import { useState } from "react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email) return alert("Please enter email")

    setLoading(true)
    try {
      const res = await fetch("http://localhost:3005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }
      if (data.email) {
        localStorage.setItem("user_email", data.email)
        localStorage.setItem("user_name", data.name)
        localStorage.setItem("user_id", data._id)
        router.push("/dashboard")
      }
    } catch (err) {
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Login to AutoOpsGPT</h2>
      <input
        style={styles.input}
        placeholder="Enter your Gmail"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleLogin} style={styles.button} disabled={loading}>
        {loading ? "Logging in..." : "Continue with Gmail"}
      </button>

      <p style={{ marginTop: "20px" }}>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  )
}

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  input: { padding: "10px", margin: "10px", width: "300px" },
  button: { padding: "12px 20px", cursor: "pointer" }
}
