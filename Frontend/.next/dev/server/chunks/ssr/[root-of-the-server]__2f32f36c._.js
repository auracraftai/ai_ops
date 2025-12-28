module.exports = [
"[project]/pages/platform.js [ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const express = (()=>{
    const e = new Error("Cannot find module 'express'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const Deployment = (()=>{
    const e = new Error("Cannot find module '../models/Deployment'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const router = express.Router();
/**
 * POST /api/deployments
 * Create a new deployment entry
 *
 * Body:
 * {
 *   repo: string,
 *   platform: string
 * }
 */ router.post("/", async (req, res)=>{
    try {
        const { repo, platform } = req.body;
        // Basic validation
        if (!repo || !platform) {
            return res.status(400).json({
                error: "repo and platform are required"
            });
        }
        // Create deployment entry
        const deployment = await Deployment.create({
            repo,
            platform,
            status: "DEPLOYING"
        });
        res.json(deployment);
    } catch (err) {
        console.error("Deployment creation failed:", err.message);
        res.status(500).json({
            error: "Failed to create deployment"
        });
    }
});
/**
 * GET /api/deployments
 * Fetch all deployments (for dashboard)
 */ router.get("/", async (req, res)=>{
    try {
        const deployments = await Deployment.find().sort({
            createdAt: -1
        });
        res.json(deployments);
    } catch (err) {
        console.error("Fetching deployments failed:", err.message);
        res.status(500).json({
            error: "Failed to fetch deployments"
        });
    }
});
module.exports = router;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f32f36c._.js.map