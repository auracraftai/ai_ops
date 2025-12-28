module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/pages/platform.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlatformPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
const platforms = [
    {
        id: "AWS",
        name: "AWS",
        fields: [
            "Access Key ID",
            "Secret Access Key"
        ]
    },
    {
        id: "Azure",
        name: "Azure",
        fields: [
            "Subscription ID",
            "Client ID",
            "Client Secret"
        ]
    },
    {
        id: "GCP",
        name: "Google Cloud",
        fields: [
            "Project ID",
            "JSON Key (Base64)"
        ]
    },
    {
        id: "Vercel",
        name: "Vercel",
        fields: [
            "Vercel Token",
            "Team ID (Optional)"
        ]
    },
    {
        id: "Docker",
        name: "Docker Hub",
        fields: [
            "Username",
            "Access Token"
        ]
    },
    {
        id: "Railway",
        name: "Railway",
        fields: [
            "Railway Token"
        ]
    },
    {
        id: "Render",
        name: "Render",
        fields: [
            "API Key",
            "Service ID"
        ]
    }
];
function PlatformPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [credentials, setCredentials] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleInputChange = (field, value)=>{
        setCredentials((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const handleDeploy = async ()=>{
        if (!selected) return alert("Please select a platform");
        // Check if all fields are filled
        for (const field of selected.fields){
            if (!credentials[field]) return alert(`Please enter ${field}`);
        }
        const repo = localStorage.getItem("github_repo_url");
        if (!repo) {
            alert("GitHub repo info missing. Please go back.");
            router.push("/github");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3005/api/deployments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    repo: repo,
                    platform: selected.id,
                    credentials: credentials
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Deployment failed");
            // Save deployment id
            localStorage.setItem("deployment_id", data._id);
            alert("Deployment Started! Redirecting to dashboard...");
            // Small delay to simulate "Connecting..."
            setTimeout(()=>{
                router.push("/dashboard");
            }, 1000);
        } catch (err) {
            alert(err.message);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "Select Deployment Platform"
            }, void 0, false, {
                fileName: "[project]/pages/platform.js",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.grid,
                children: platforms.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        onClick: ()=>{
                            setSelected(p);
                            setCredentials({});
                        },
                        style: {
                            ...styles.card,
                            border: selected?.id === p.id ? "2px solid #000" : "1px solid #ddd",
                            backgroundColor: selected?.id === p.id ? "#f0f8ff" : "#fff"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                            children: p.name
                        }, void 0, false, {
                            fileName: "[project]/pages/platform.js",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    }, p.id, false, {
                        fileName: "[project]/pages/platform.js",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/platform.js",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        children: [
                            "Configure ",
                            selected.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/platform.js",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    selected.fields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "block",
                                        marginBottom: 5
                                    },
                                    children: field
                                }, void 0, false, {
                                    fileName: "[project]/pages/platform.js",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    style: styles.input,
                                    value: credentials[field] || "",
                                    onChange: (e)=>handleInputChange(field, e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/platform.js",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, field, true, {
                            fileName: "[project]/pages/platform.js",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        style: styles.button,
                        onClick: handleDeploy,
                        disabled: loading,
                        children: loading ? "Connecting & Deploying..." : "Connect & Deploy"
                    }, void 0, false, {
                        fileName: "[project]/pages/platform.js",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/platform.js",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/platform.js",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
const styles = {
    container: {
        padding: "40px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "10px",
        marginBottom: "40px"
    },
    card: {
        padding: "15px",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "14px"
    },
    form: {
        textAlign: "left",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "8px"
    },
    input: {
        width: "100%",
        padding: "8px",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "10px",
        marginTop: "20px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08a68c03._.js.map