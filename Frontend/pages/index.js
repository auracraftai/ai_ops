import Link from "next/link"

export default function Welcome() {
  return (
    <div style={styles.container}>
      <h1>🚀 AutoOpsGPT</h1>
      <p>Automate CI/CD, Deployment & Monitoring with AI</p>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/login">
          <button style={styles.button}>Login</button>
        </Link>
        <Link href="/signup">
          <button style={{ ...styles.button, backgroundColor: "#fff", color: "#000", border: "1px solid #000" }}>Sign Up</button>
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer"
  }
}
