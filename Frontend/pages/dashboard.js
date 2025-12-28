import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Basic auth check
    const email = localStorage.getItem("user_email")
    if (!email) {
      router.push("/login")
      return
    }

    fetch("http://localhost:3005/api/deployments")
      .then(res => res.json())
      .then(data => {
        setDeployments(data)
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this project?")) return

    try {
      await fetch(`http://localhost:3005/api/deployments/${id}`, {
        method: "DELETE"
      })
      setDeployments(prev => prev.filter(d => d._id !== id))
    } catch (err) {
      alert("Failed to delete")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_id")
    router.push("/login")
  }

  if (loading) return <div style={styles.container}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2>Dashboard</h2>
          <p>Welcome, {typeof window !== 'undefined' ? (localStorage.getItem("user_name") || localStorage.getItem("user_email")) : ""}</p>
        </div>
        <button onClick={handleLogout} style={styles.smallButton}>Logout</button>
      </div>

      <div style={styles.content}>
        {/* Section 1: Previous Knowledge / Deployments */}
        <div style={styles.section}>
          <h3>Knowledge of Websites</h3>
          {deployments.length === 0 ? (
            <p>No websites deployed yet.</p>
          ) : (
            <div style={styles.grid}>
              {deployments.map(d => (
                <div key={d._id} style={styles.card}>
                  <h4 style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    margin: "0 0 10px 0"
                  }} title={d.repo}>
                    {d.repo}
                  </h4>
                  <p>Platform: <strong>{d.platform}</strong></p>
                  <p>Status: {d.status}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={`/monitor/${d._id}`}>
                      <button style={styles.smallButton}>View Logs & AI Ops</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(d._id)}
                      style={{ ...styles.smallButton, backgroundColor: '#d9534f' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Start New Journey */}
        <div style={styles.section}>
          <h3>{deployments.length > 0 ? "Expand Your Portfolio" : "Deploy a New Project"}</h3>
          <p>
            {deployments.length > 0
              ? "Ready to launch another idea? Deploy another model with our AI Ops platform."
              : "Start your website deployment journey with our AIOps platform."}
          </p>
          <Link href="/github">
            <button style={styles.mainButton}>
              {deployments.length > 0 ? "Deploy Another Model" : "Start Deployment Journey"}
            </button>
          </Link>
        </div>
      </div>
    </div>

  )
}

const styles = {
  container: { padding: "40px", fontFamily: "Arial, sans-serif" },
  header: { marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  content: { display: "flex", flexDirection: "column", gap: "40px" },
  section: { padding: "20px", background: "#f9f9f9", borderRadius: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" },
  card: { padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  mainButton: { padding: "12px 24px", fontSize: "16px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" },
  smallButton: { padding: "8px 16px", background: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }
}
