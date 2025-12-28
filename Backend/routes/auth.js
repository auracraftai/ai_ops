const express = require("express")
const User = require("../models/User")

const router = express.Router()

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body
    if (!email || !name) return res.status(400).json({ error: "Missing fields" })

    let user = await User.findOne({ email })
    if (user) {
      // If user exists, just update name if needed and login
      if (user.name === "User" && name !== "User") {
        user.name = name
        await user.save()
      }
      return res.json(user)
    }

    // Create new user
    user = await User.create({ name, email })
    res.json(user)
  } catch (err) {
    console.error("Signup Error:", err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: "Email is required" })

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "Account not found. Please Sign Up first." })
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router
