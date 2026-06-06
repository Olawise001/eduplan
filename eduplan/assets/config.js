// ============================================================
//  EduPlan — Global Configuration
//  Replace placeholders before going live
// ============================================================

const EDUPLAN_CONFIG = {
  // ── Supabase ──────────────────────────────────────────────
  SUPABASE_URL:     "YOUR_SUPABASE_PROJECT_URL",   // e.g. https://xyzabc.supabase.co
  SUPABASE_ANON:    "YOUR_SUPABASE_ANON_KEY",      // found in Project Settings → API

  // ── Flutterwave ───────────────────────────────────────────
  FLUTTERWAVE_PUBLIC: "FLWPUBK-11c14c1b4c26cae251267524a97f4c78-X", // e.g. FLWPUBK_TEST-... or FLWPUBK-...

  // ── Anthropic (Claude API) ────────────────────────────────
  // NOTE: Store this server-side via a Supabase Edge Function in production
  // For Phase 1 the user can paste their own key in Settings
  CLAUDE_MODEL:     "claude-sonnet-4-20250514",

  // ── Credits ───────────────────────────────────────────────
  CREDITS_PER_GENERATION: 5,
  CREDITS_PER_NAIRA:      0.1,   // 1000 NGN → 100 credits
  TOPUP_PACKAGES: [
    { naira: 1000,  credits: 100,  label: "Starter"    },
    { naira: 3000,  credits: 320,  label: "Standard"   },
    { naira: 5000,  credits: 600,  label: "Pro"        },
    { naira: 10000, credits: 1300, label: "Premium"    },
  ],

  // ── Pricing Plans ─────────────────────────────────────────
  PLANS: {
    individual: { name: "Individual", monthlyNaira: 0,     credits: 0,    description: "Pay per credit" },
    school:     { name: "School",     monthlyNaira: 15000, credits: 2000, description: "Shared school pool + review workflow" },
  },

  // ── App meta ──────────────────────────────────────────────
  APP_NAME: "EduPlan",
  APP_TAGLINE: "AI-Powered Lesson Planning for Nigerian Teachers",
};

// ── Lightweight Auth State (replaced by Supabase in production) ──
const Auth = {
  _key: "eduplan_user",
  get() {
    try { return JSON.parse(localStorage.getItem(this._key)); } catch { return null; }
  },
  set(user) { localStorage.setItem(this._key, JSON.stringify(user)); },
  clear()   { localStorage.removeItem(this._key); },
  isLoggedIn() { return !!this.get(); },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = "login.html"; return false; }
    return true;
  },
  credits() {
    const u = this.get(); return u ? (u.credits || 0) : 0;
  },
  deductCredits(n) {
    const u = this.get();
    if (!u) return false;
    if (u.credits < n) return false;
    u.credits -= n;
    this.set(u);
    return true;
  },
  addCredits(n) {
    const u = this.get();
    if (!u) return;
    u.credits = (u.credits || 0) + n;
    this.set(u);
  },
};

// ── Toast notifications ──────────────────────────────────────
function showToast(msg, type = "info", duration = 3500) {
  const existing = document.getElementById("ep-toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.id = "ep-toast";
  t.className = `ep-toast ep-toast--${type}`;
  t.innerHTML = `<span class="ep-toast-icon">${{success:"✓",error:"✕",info:"ℹ",warning:"⚠"}[type]||"ℹ"}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("ep-toast--show"), 10);
  setTimeout(() => { t.classList.remove("ep-toast--show"); setTimeout(() => t.remove(), 350); }, duration);
}

// ── Format numbers ───────────────────────────────────────────
function fmtNaira(n) { return "₦" + Number(n).toLocaleString("en-NG"); }
