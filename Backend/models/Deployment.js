const mongoose = require("mongoose")

const DeploymentSchema = new mongoose.Schema({
  repo: String,
  platform: String,
  credentials: Object, // Store simplified credentials object
  status: String,
  logs: [String],
  aiAnalysis: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Deployment", DeploymentSchema)
