const express = require("express")
const axios = require("axios")
const simpleGit = require("simple-git")
const fs = require("fs")
const path = require("path")

const router = express.Router()

router.post("/analyze", async (req, res) => {
  const { token, repoUrl } = req.body

  if (!token || !repoUrl) {
    return res.status(400).json({ error: "Missing token or repoUrl" })
  }

  try {
    const parts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = parts[0]
    const repo = parts[1]

    await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` }
    })

    const tempDir = path.join(__dirname, "..", "tmp", `${owner}-${repo}`)
    fs.rmSync(tempDir, { recursive: true, force: true })

    const git = simpleGit()
    await git.clone(`https://${token}@github.com/${owner}/${repo}.git`, tempDir)

    const files = fs.readdirSync(tempDir)
    const hasPackageJson = files.includes("package.json")
    const hasIndexHtml = files.includes("index.html") || files.includes("index.htm")
    const hasDockerfile = files.includes("Dockerfile")
    const hasGithubActions = fs.existsSync(path.join(tempDir, ".github", "workflows"))

    // It is "deployable" if it has package.json (node) OR index.html (static)
    const isDeployable = hasPackageJson || hasIndexHtml

    // "Perfect" means it has explicit Docker/CI configs
    const isPerfect = hasDockerfile && hasGithubActions

    res.json({
      repo: `${owner}/${repo}`,
      deployable: isDeployable,
      perfect: isPerfect,
      missing: {
        dockerfile: !hasDockerfile,
        githubActions: !hasGithubActions
      }
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Failed to analyze repository", details: err.message })
  }
})

/**
 * POST /api/github/fix
 * usage: Pushes missing files to the repo
 */
router.post("/fix", async (req, res) => {
  const { token, repoUrl, missing } = req.body

  if (!token || !repoUrl) return res.status(400).json({ error: "Missing required fields" })

  try {
    const parts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = parts[0]
    const repo = parts[1]
    const tempDir = path.join(__dirname, "..", "tmp", `${owner}-${repo}`)

    // If tmp dir doesn't exist, re-clone (safety check)
    if (!fs.existsSync(tempDir)) {
      const git = simpleGit()
      await git.clone(`https://${token}@github.com/${owner}/${repo}.git`, tempDir)
    }

    // 1. Create Dockerfile if missing
    if (missing.dockerfile) {
      const dockerContent = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
      `.trim()
      fs.writeFileSync(path.join(tempDir, "Dockerfile"), dockerContent)
    }

    // 2. Create GitHub Action if missing
    if (missing.githubActions) {
      const workflowDir = path.join(tempDir, ".github", "workflows")
      if (!fs.existsSync(workflowDir)) fs.mkdirSync(workflowDir, { recursive: true })

      const yamlContent = `
name: CI/CD Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - run: npm install
      - run: npm test
      `.trim()
      fs.writeFileSync(path.join(workflowDir, "deploy.yml"), yamlContent)
    }

    // 3. Commit and Push
    const git = simpleGit(tempDir)
    await git.addConfig("user.name", "AutoOps Bot")
    await git.addConfig("user.email", "bot@autoops.com")
    await git.add(".")
    await git.commit("Add missing deployment files (Dockerfile / CI/CD)")
    await git.push()

    res.json({ success: true, message: "Files pushed successfully" })

  } catch (err) {
    console.error("Fix failed:", err.message)
    res.status(500).json({ error: "Failed to push files", details: err.message })
  }
})

module.exports = router
