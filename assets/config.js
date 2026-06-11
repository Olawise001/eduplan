// ============================================================
//  EduPlan — Global Configuration
// ============================================================

const EDUPLAN_CONFIG = {
  // ── Supabase ──────────────────────────────────────────────
  SUPABASE_URL:  "https://ajgxhmtbmckfyrhojssh.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3hobXRibWNrZnlyaG9qc3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDg2MDksImV4cCI6MjA5NjQ4NDYwOX0.ZdZi02b3NQ9S4X_kUafu_C8b9iAYWyNUbg3IvrTlbQs",

  // ── Flutterwave ───────────────────────────────────────────
  FLUTTERWAVE_PUBLIC: "FLWPUBK-11c14c1b4c26cae251267524a97f4c78-X",

  // ── Anthropic (Claude API) ────────────────────────────────
  CLAUDE_MODEL: "claude-sonnet-4-20250514",

  // ── Credits ───────────────────────────────────────────────
  CREDITS_PER_GENERATION: 5,
  TOPUP_PACKAGES: [
    { naira: 1000,  credits: 100,  label: "Starter"  },
    { naira: 3000,  credits: 320,  label: "Standard" },
    { naira: 5000,  credits: 600,  label: "Pro"      },
    { naira: 10000, credits: 1300, label: "Premium"  },
  ],

  APP_NAME:    "EduPlan",
  APP_TAGLINE: "AI-Powered Lesson Planning for Nigerian Teachers",
};

// ============================================================
//  Supabase client — requires supabase-js CDN in each page
// ============================================================
function getSupabase() {
  if (!window._sb) {
    window._sb = supabase.createClient(
      EDUPLAN_CONFIG.SUPABASE_URL,
      EDUPLAN_CONFIG.SUPABASE_ANON
    );
  }
  return window._sb;
}

// ============================================================
//  Auth helpers
// ============================================================
const Auth = {
  _key: "eduplan_profile",

  get()        { try { return JSON.parse(localStorage.getItem(this._key)); } catch { return null; } },
  set(p)       { localStorage.setItem(this._key, JSON.stringify(p)); },
  clear()      { localStorage.removeItem(this._key); localStorage.removeItem("eduplan_plans"); },
  isLoggedIn() { return !!this.get(); },
  credits() {
    const profile = this.get();
    if (!profile) return 0;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
    // Show personal credits + school pool combined for school users
    if (profile.type === "school") {
      const personal = profile.credits || 0;
      const school   = profile.school_credits || 0;
      return personal + school;
<<<<<<< HEAD
=======
    // School accounts show school pool balance
    if (profile.type === "school" && profile.school_credits !== undefined) {
      return profile.school_credits || 0;
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
    }
    return profile.credits || 0;
  },

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
  personalCredits() {
    return this.get()?.credits || 0;
  },

  schoolCredits() {
    return this.get()?.school_credits || 0;
  },

<<<<<<< HEAD
=======
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
  async deductCredits(n) {
    const profile = this.get();
    if (!profile) return false;
    const sb = getSupabase();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
    if (profile.type === "school") {
      const personal = profile.credits || 0;
      const school   = profile.school_credits || 0;

      if (personal + school < n) return false; // not enough total

      if (personal >= n) {
        // Deduct from personal credits first
        const newVal = personal - n;
        const { error } = await sb.from("profiles")
          .update({ credits: newVal }).eq("id", profile.id);
        if (error) return false;
        await sb.from("transactions").insert({
          user_id: profile.id, type: "debit",
          label: "Plan generation (personal)", amount: n, naira: 0
        });
        profile.credits = newVal;
        this.set(profile);
        return true;
      } else {
        // Not enough personal — deduct from school pool
        const { data: schoolData } = await sb.from("schools")
          .select("credits").eq("id", profile.school_id).single();
        if (!schoolData || schoolData.credits < n) return false;
        const newVal = schoolData.credits - n;
        const { error } = await sb.from("schools")
          .update({ credits: newVal }).eq("id", profile.school_id);
        if (error) return false;
        await sb.from("transactions").insert({
          user_id: profile.id, type: "debit",
          label: "Plan generation (school pool)", amount: n, naira: 0
        });
        profile.school_credits = newVal;
        this.set(profile);
        return true;
      }
<<<<<<< HEAD
    } else {
      // Individual account — personal credits only
      if ((profile.credits || 0) < n) return false;
=======
    if (profile.type === "school" && profile.school_id) {
      // Deduct from school credits pool
      const { data: school } = await sb.from("schools")
        .select("credits").eq("id", profile.school_id).single();
      if (!school || school.credits < n) return false;
      const newVal = school.credits - n;
      const { error } = await sb.from("schools")
        .update({ credits: newVal }).eq("id", profile.school_id);
      if (error) return false;
      await sb.from("transactions").insert({
        user_id: profile.id, type: "debit",
        label: "Plan generation", amount: n, naira: 0
      });
      profile.school_credits = newVal;
      this.set(profile);
      return true;
    } else {
      // Individual account
      if (profile.credits < n) return false;
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
    } else {
      // Individual account — personal credits only
      if ((profile.credits || 0) < n) return false;
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
      const newVal = profile.credits - n;
      const { error } = await sb.from("profiles")
        .update({ credits: newVal }).eq("id", profile.id);
      if (error) return false;
      await sb.from("transactions").insert({
        user_id: profile.id, type: "debit",
        label: "Plan generation", amount: n, naira: 0
      });
      profile.credits = newVal;
      this.set(profile);
      return true;
    }
  },

  async addCredits(n, naira, ref, label) {
    const profile = this.get();
    if (!profile) return false;
    const sb = getSupabase();

<<<<<<< HEAD
<<<<<<< HEAD
    if (profile.type === "school" && profile.role === "admin") {
      // Admin tops up school pool
=======
    if (profile.type === "school" && profile.school_id) {
      // Add to school credits pool
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
    if (profile.type === "school" && profile.role === "admin") {
      // Admin tops up school pool
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
      const { data: school } = await sb.from("schools")
        .select("credits").eq("id", profile.school_id).single();
      const newVal = (school?.credits || 0) + n;
      await sb.from("schools").update({ credits: newVal }).eq("id", profile.school_id);
      await sb.from("transactions").insert({
        user_id: profile.id, type: "credit",
<<<<<<< HEAD
<<<<<<< HEAD
        label: label || `School pool top-up: ${n} credits`,
=======
        label: label || `School top-up: ${n} credits`,
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
        label: label || `School pool top-up: ${n} credits`,
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
        amount: n, naira: naira || 0, reference: ref || ""
      });
      profile.school_credits = newVal;
      this.set(profile);
      return true;
    } else {
<<<<<<< HEAD
<<<<<<< HEAD
      // Individual or school staff — adds to personal credits
=======
      // Individual account
>>>>>>> 6b07b76be845512ac9adfd780b0fcb5be7f3e065
=======
      // Individual or school staff — adds to personal credits
>>>>>>> 64b4459b9d552f54d2fe44af20dd10241a9c558c
      const newVal = (profile.credits || 0) + n;
      await sb.from("profiles").update({ credits: newVal }).eq("id", profile.id);
      await sb.from("transactions").insert({
        user_id: profile.id, type: "credit",
        label: label || `Top-up: ${n} credits`,
        amount: n, naira: naira || 0, reference: ref || ""
      });
      profile.credits = newVal;
      this.set(profile);
      return true;
    }
  },

  // Call on every protected page load
  async requireAuth() {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { window.location.href = "login.html"; return false; }
    await this.refreshProfile(session.user.id);
    return true;
  },

  async refreshProfile(uid) {
    const sb = getSupabase();
    const id = uid || (await sb.auth.getUser()).data?.user?.id;
    if (!id) return null;
    // Fetch profile first
    const { data, error } = await sb.from("profiles").select("*").eq("id", id).single();
    if (error) {
      console.error("refreshProfile error:", error.message, "for id:", id);
      return this.get();
    }
    // Then fetch school data separately if school_id exists
    if (data?.school_id) {
      const { data: schoolData } = await sb.from("schools")
        .select("id, name, address, state, school_type, credits, subscription_status")
        .eq("id", data.school_id)
        .single();
      if (schoolData) {
        data.school_name    = schoolData.name;
        data.school_address = schoolData.address;
        data.state          = schoolData.state;
        data.school_type    = schoolData.school_type;
        data.school_credits = schoolData.credits; // school shared pool
      }
    }
    if (data) this.set(data);
    return data;
  },
};

// ============================================================
//  Toast notifications
// ============================================================
function showToast(msg, type = "info", duration = 3500) {
  const existing = document.getElementById("ep-toast");
  if (existing) existing.remove();
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const t = document.createElement("div");
  t.id = "ep-toast";
  t.className = `ep-toast ep-toast--${type}`;
  t.innerHTML = `<span class="ep-toast-icon">${icons[type]||"ℹ"}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("ep-toast--show"), 10);
  setTimeout(() => {
    t.classList.remove("ep-toast--show");
    setTimeout(() => t.remove(), 350);
  }, duration);
}

function fmtNaira(n) { return "₦" + Number(n).toLocaleString("en-NG"); }