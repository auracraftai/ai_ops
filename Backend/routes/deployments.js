const express = require("express")
const router = express.Router()
const Deployment = require("../models/Deployment")
const simpleGit = require("simple-git")
const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

// Helper: Append log
async function appendLog(id, message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`
    await Deployment.findByIdAndUpdate(id, { $push: { logs: line } })
}

// Helper: Clone Repo
async function cloneRepository(deploymentId, repoUrl) {
    const deployment = await Deployment.findById(deploymentId)
    const repoName = repoUrl.split("/").pop().replace(".git", "")
    const buildDir = path.join(__dirname, "..", "tmp", "builds", deploymentId.toString())

    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true })
    fs.mkdirSync(buildDir, { recursive: true })

    await appendLog(deploymentId, `Cloning ${repoUrl}...`)

    // Use user token if available
    let cloneUrl = repoUrl
    // Ideally, insert token into URL: https://TOKEN@github.com/...
    // For now, we assume public or SSH/Agent usage in local environment

    await simpleGit().clone(cloneUrl, buildDir)
    await appendLog(deploymentId, "Repository cloned successfully.")

    return buildDir
}

// 1. Simulate Deployment (Generic)
async function deploySimulated(deploymentId) {
    await appendLog(deploymentId, "Initializing simulated deployment environment...")
    await new Promise(r => setTimeout(r, 2000))

    await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })
    await appendLog(deploymentId, "Building project...")

    // Simulation: random failure chance
    if (Math.random() > 0.7) {
        await appendLog(deploymentId, "❌ Error: Build failed. Missing dependency 'lib-optimus'.")
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
        return
    }

    await new Promise(r => setTimeout(r, 3000))
    await appendLog(deploymentId, "Build complete. Allocating resources...")
    await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
    await appendLog(deploymentId, "🚀 Service is live at: https://vercel.app/project-xyz")
}

// 2. Real Vercel Deployment
async function deployToVercel(deploymentId, repoUrl, credentials) {
    try {
        await appendLog(deploymentId, "Starting Vercel Deployment...")
        const buildDir = await cloneRepository(deploymentId, repoUrl)

        await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })
        await appendLog(deploymentId, "Installing Vercel CLI...")

        // Verify token
        const token = credentials["Vercel Token"]
        if (!token) throw new Error("Vercel Token is required")

        await appendLog(deploymentId, "Triggering Vercel Deploy...")

        // vercel deploy --prod --token <TOKEN> --yes
        const vercel = spawn("npx", ["vercel", "deploy", "--prod", "--token", token, "--yes"], { cwd: buildDir })

        vercel.stdout.on("data", (data) => appendLog(deploymentId, `[Vercel]: ${data.toString().trim()}`))
        vercel.stderr.on("data", (data) => {
            const msg = data.toString().trim()
            appendLog(deploymentId, `[Vercel Info]: ${msg}`)
        })

        vercel.on("close", async (code) => {
            if (code === 0) {
                await appendLog(deploymentId, "✅ Vercel Deployment Successful!")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
            } else {
                await appendLog(deploymentId, "❌ Vercel Deployment Failed.")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
            }
        })

    } catch (err) {
        await appendLog(deploymentId, `❌ Error: ${err.message}`)
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
    }
}

// 3. Real Docker Deployment
async function deployToDocker(deploymentId, repoUrl, credentials) {
    try {
        await appendLog(deploymentId, "Starting Docker Deployment Process...")
        const buildDir = await cloneRepository(deploymentId, repoUrl)
        await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })

        await appendLog(deploymentId, "Analyzing project structure...")
        const files = fs.readdirSync(buildDir)
        const hasPackageJson = files.includes("package.json")
        const hasIndexHtml = files.includes("index.html") || files.includes("index.htm")

        if (!hasPackageJson && hasIndexHtml) {
            await appendLog(deploymentId, "⚠️ Static Site Detected (No package.json). Switching to Nginx.")
            const nginxDockerfile = `
FROM nginx:alpine
COPY . /usr/share/nginx/html
      `.trim()
            fs.writeFileSync(path.join(buildDir, "Dockerfile"), nginxDockerfile)
        }

        await appendLog(deploymentId, "Building Docker Image...")

        const username = credentials["Username"] || "localuser"
        const repoName = repoUrl.split("/").pop().replace(".git", "").toLowerCase().replace(/[^a-z0-9]/g, "")
        const imageName = `${username}/${repoName}:${deploymentId}`

        await appendLog(deploymentId, `Image Tag: ${imageName}`)

        // docker build --no-cache -t <tag> .
        const build = spawn("docker", ["build", "--no-cache", "-t", imageName, "."], { cwd: buildDir })

        build.stdout.on("data", (data) => appendLog(deploymentId, `[Docker Build]: ${data.toString().trim()}`))
        build.stderr.on("data", (data) => appendLog(deploymentId, `[Docker Info]: ${data.toString().trim()}`))

        build.on("close", async (code) => {
            if (code === 0) {
                await appendLog(deploymentId, "✅ Docker Image Built Successfully.")

                // Run Container
                await appendLog(deploymentId, "Starting Container...")
                // docker run -d -P <image>
                const run = spawn("docker", ["run", "-d", "-P", imageName])

                run.stdout.on("data", (data) => appendLog(deploymentId, `[Container ID]: ${data.toString().trim()}`))

                run.on("close", async (runCode) => {
                    if (runCode === 0) {
                        await appendLog(deploymentId, "✅ Container Running!")
                        await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
                    } else {
                        await appendLog(deploymentId, "❌ Failed to start container.")
                        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
                    }
                })
            } else {
                await appendLog(deploymentId, "❌ Docker Build Failed.")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
            }
        })

    } catch (err) {
        await appendLog(deploymentId, `❌ Critical Error: ${err.message}`)
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
    }
}

// GET /api/deployments
router.get("/", async (req, res) => {
    const data = await Deployment.find().sort({ createdAt: -1 })
    res.json(data)
})

// GET /api/deployments/:id
router.get("/:id", async (req, res) => {
    const deployment = await Deployment.findById(req.params.id)
    res.json(deployment)
})

// DELETE /api/deployments/:id
router.delete("/:id", async (req, res) => {
    try {
        await Deployment.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" })
    }
})

// POST /api/deployments
router.post("/", async (req, res) => {
    const { repoUrl, platform, credentials } = req.body

    const deployment = await Deployment.create({
        repo: repoUrl,
        platform,
        status: "QUEUED",
        logs: ["Deployment Queued..."]
    })

    res.json(deployment)

    // Trigger Asynchronous Deployment
    if (platform === "Vercel") {
        deployToVercel(deployment._id, repoUrl, credentials)
    } else if (platform === "Docker") {
        deployToDocker(deployment._id, repoUrl, credentials)
    } else {
        deploySimulated(deployment._id)
    }
})

module.exports = router
