import { useState } from "react"
import { useRouter } from "next/router"

const platforms = [
  { id: "AWS", name: "AWS", fields: ["Access Key ID", "Secret Access Key"] },
  { id: "Azure", name: "Azure", fields: ["Subscription ID", "Client ID", "Client Secret"] },
  { id: "GCP", name: "Google Cloud", fields: ["Project ID", "JSON Key (Base64)"] },
  { id: "Vercel", name: "Vercel", fields: ["Vercel Token", "Team ID (Optional)"] },
  { id: "Docker", name: "Docker Hub", fields: ["Username", "Access Token"] },
  { id: "Railway", name: "Railway", fields: ["Railway Token"] },
  { id: "Render", name: "Render", fields: ["API Key", "Service ID"] }
]

export default function PlatformPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [credentials, setCredentials] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const handleDeploy = async () => {
    if (!selected) return alert("Please select a platform")

    // Check if all fields are filled
    for (const field of selected.fields) {
      if (!credentials[field]) return alert(`Please enter ${field}`)
    }

    const repo = localStorage.getItem("github_repo_url")
    if (!repo) {
      alert("GitHub repo info missing. Please go back.")
      router.push("/github")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:3005/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repo,
          platform: selected.id,
          credentials: credentials
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Deployment failed")

      // Save deployment id
      localStorage.setItem("deployment_id", data._id)

      alert("Deployment Started! Redirecting to dashboard...")

      // Small delay to simulate "Connecting..."
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Select Deployment Platform</h2>

      <div style={styles.grid}>
        {platforms.map(p => (
          <div
            key={p.id}
            onClick={() => { setSelected(p); setCredentials({}); }}
            style={{
              ...styles.card,
              border: selected?.id === p.id ? "2px solid #000" : "1px solid #ddd",
              backgroundColor: selected?.id === p.id ? "#f0f8ff" : "#fff"
            }}
          >
            <strong>{p.name}</strong>
          </div>
        ))}
      </div>

      {selected && (
        <div style={styles.form}>
          <h3>Configure {selected.name}</h3>
          {selected.fields.map(field => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ display: "block", marginBottom: 5 }}>{field}</label>
              <input
                type="password"
                style={styles.input}
                value={credentials[field] || ""}
                onChange={e => handleInputChange(field, e.target.value)}
              />
            </div>
          ))}

          <button style={styles.button} onClick={handleDeploy} disabled={loading}>
            {loading ? "Connecting & Deploying..." : "Connect & Deploy"}
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: "40px", textAlign: "center", maxWidth: "800px", margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px", marginBottom: "40px" },
  card: { padding: "15px", cursor: "pointer", borderRadius: "8px", fontSize: "14px" },
  form: { textAlign: "left", maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid #eee", borderRadius: "8px" },
  input: { width: "100%", padding: "8px", boxSizing: "border-box" },
  button: { width: "100%", padding: "10px", marginTop: "20px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }
}
