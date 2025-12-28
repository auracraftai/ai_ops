import { useRouter } from "next/router"
import { useState } from "react"
import Link from "next/link"

export default function Signup() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async () => {
        if (!name || !email) return alert("Please fill all fields")

        setLoading(true)
        try {
            const res = await fetch("http://localhost:3005/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Signup failed")
            }
            if (data.email) {
                localStorage.setItem("user_email", data.email)
                localStorage.setItem("user_name", data.name)
                localStorage.setItem("user_id", data._id)
                router.push("/dashboard")
            }
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h2>Create an Account</h2>
            <input
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                style={styles.input}
                placeholder="Enter your Gmail"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button onClick={handleSignup} style={styles.button} disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p style={{ marginTop: "20px" }}>
                Already have an account? <Link href="/login">Login here</Link>
            </p>
        </div>
    )
}

const styles = {
    container: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    input: { padding: "10px", margin: "10px", width: "300px" },
    button: { padding: "12px 20px", cursor: "pointer", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "5px" }
}
