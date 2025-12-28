import { useState } from "react"
import { useRouter } from "next/router"

export default function GitHubPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [token, setToken] = useState("")

  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [fixing, setFixing] = useState(false)

  const handleAnalyze = async () => {
    if (!username || !repoUrl || !token) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:3005/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repoUrl })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Analysis failed")

      setAnalysis(data)

      // Save credentials for later
      localStorage.setItem("github_username", username)
      localStorage.setItem("github_repo_url", repoUrl)
      localStorage.setItem("github_token", token)

      if (data.perfect) {
        // If perfect, maybe auto-redirect or show success
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFix = async () => {
    if (!analysis) return
    setFixing(true)
    try {
      const res = await fetch("http://localhost:3005/api/github/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          repoUrl,
          missing: analysis.missing
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      alert("Files pushed successfully! Redirecting to Platform selection...")
      router.push("/platform")
    } catch (err) {
      alert("Failed to fix: " + err.message)
    } finally {
      setFixing(false)
    }
  }

  const handleContinue = () => {
    router.push("/platform")
  }

  return (
    <div style={styles.container}>
      <h2>Connect GitHub Repository</h2>

      {!analysis ? (
        <>
          <input
            placeholder="GitHub Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="GitHub Repo URL"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="GitHub Personal Access Token"
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAnalyze} disabled={loading} style={styles.button}>
            {loading ? "Analyzing..." : "Analyze Repo"}
          </button>
        </>
      ) : (
        <div style={styles.resultBox}>
          <h3>Repository Analysis</h3>
          <p><strong>Status:</strong> {analysis.perfect ? "✅ Ready for Deployment" : "⚠️ Missing Configurations"}</p>

          {!analysis.perfect && (
            <ul style={{ textAlign: 'left' }}>
              {analysis.missing.dockerfile && <li>Missing Dockerfile</li>}
              {analysis.missing.githubActions && <li>Missing GitHub Actions Workflow</li>}
            </ul>
          )}

          <div style={{ marginTop: 20 }}>
            {!analysis.perfect ? (
              <button onClick={handleFix} disabled={fixing} style={{ ...styles.button, backgroundColor: "#f5a623" }}>
                {fixing ? "Fixing & Pushing..." : "Fix Issues & Continue"}
              </button>
            ) : (
              <button onClick={handleContinue} style={{ ...styles.button, backgroundColor: "#27ae60" }}>
                Proceed to Platform
              </button>
            )}

            {/* Allow bypassing if they really want to */}
            {!analysis.perfect && (
              <button onClick={handleContinue} style={{ ...styles.button, backgroundColor: "#ccc", marginLeft: 10 }}>
                Skip & Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  input: { padding: "10px", margin: "8px", width: "340px" },
  button: { marginTop: "12px", padding: "10px 18px", cursor: "pointer", border: "none", color: "#fff", backgroundColor: "#0070f3", borderRadius: "5px" },
  resultBox: { border: "1px solid #ddd", padding: "30px", borderRadius: "8px", textAlign: "center", maxWidth: "400px" }
}
