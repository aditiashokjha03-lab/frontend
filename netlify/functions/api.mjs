import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Environment – Netlify Functions use process.env (NOT Vite's import.meta.env)
// The deployer must set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify env vars.
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

/** Extract and validate the Bearer token, returning a user-scoped Supabase
 *  client together with the authenticated user object. */
async function authenticate(request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { err: error("Server misconfigured – missing Supabase credentials", 500) };
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { err: error("Missing or invalid Authorization header", 401) };
  }

  const token = authHeader.substring(7);

  // Create a Supabase client scoped to this user's JWT.
  // This respects Row-Level Security policies on every query.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error: authError } = await supabase.auth.getUser(token);

  if (authError || !data?.user) {
    return { err: error(authError?.message || "Invalid or expired token", 401) };
  }

  return { user: data.user, supabase };
}

/** Parse the sub-path after /api/v1/  e.g. "/api/v1/habits/123" → ["habits","123"] */
function parsePath(url) {
  const { pathname, searchParams } = new URL(url);
  const prefix = "/api/v1/";
  const sub = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  const segments = sub.split("/").filter(Boolean);
  return { segments, searchParams };
}

// ---------------------------------------------------------------------------
// Resource handlers
// ---------------------------------------------------------------------------

// ── Habits ────────────────────────────────────────────────────────────────
async function handleHabits(method, segments, searchParams, body, supabase, user) {
  const id = segments[1]; // e.g. /habits/:id

  if (method === "GET" && !id) {
    const { data, error: e } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "POST" && !id) {
    const { data, error: e } = await supabase
      .from("habits")
      .insert({ ...body, user_id: user.id })
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data }, 201);
  }

  if (method === "PUT" && id) {
    const { user_id, id: _id, ...updates } = body || {};
    const { data, error: e } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "DELETE" && id) {
    const { data, error: e } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  return error("Not found", 404);
}

// ── Logs ──────────────────────────────────────────────────────────────────
async function handleLogs(method, segments, searchParams, body, supabase, user) {
  if (method === "GET") {
    const date = searchParams.get("date");
    let query = supabase.from("logs").select("*").eq("user_id", user.id);
    if (date) query = query.eq("date", date);
    const { data, error: e } = await query.order("created_at", { ascending: false });
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "POST") {
    // Upsert: if a log for this habit+date+user exists, update it; otherwise create.
    const logData = { ...body, user_id: user.id };

    // Try upsert on the unique constraint (user_id, habit_id, date)
    const { data, error: e } = await supabase
      .from("logs")
      .upsert(logData, { onConflict: "user_id,habit_id,date" })
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data }, 201);
  }

  return error("Not found", 404);
}

// ── Goals ─────────────────────────────────────────────────────────────────
async function handleGoals(method, segments, searchParams, body, supabase, user) {
  const id = segments[1];

  if (method === "GET" && !id) {
    const { data, error: e } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "POST" && !id) {
    const { data, error: e } = await supabase
      .from("goals")
      .insert({ ...body, user_id: user.id })
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data }, 201);
  }

  if ((method === "PATCH" || method === "PUT") && id) {
    const { user_id, id: _id, ...updates } = body || {};
    const { data, error: e } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "DELETE" && id) {
    const { data, error: e } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  return error("Not found", 404);
}

// ── Reminders ─────────────────────────────────────────────────────────────
async function handleReminders(method, segments, searchParams, body, supabase, user) {
  const id = segments[1];

  if (method === "GET" && !id) {
    const { data, error: e } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "POST" && !id) {
    const { data, error: e } = await supabase
      .from("reminders")
      .insert({ ...body, user_id: user.id })
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data }, 201);
  }

  if (method === "PUT" && id) {
    const { user_id, id: _id, ...updates } = body || {};
    const { data, error: e } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  if (method === "DELETE" && id) {
    const { data, error: e } = await supabase
      .from("reminders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (e) return error(e.message, 500);
    return json({ data });
  }

  return error("Not found", 404);
}

// ── Analytics ─────────────────────────────────────────────────────────────
async function handleAnalytics(method, segments, searchParams, supabase, user) {
  if (method !== "GET") return error("Method not allowed", 405);

  const action = segments[1]; // summary | heatmap | weekly-report | monthly-report | insights

  if (action === "summary") {
    const { data: habits, error: he } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);
    if (he) return error(he.message, 500);

    const { data: logs, error: le } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user.id);
    if (le) return error(le.message, 500);

    const today = new Date().toISOString().slice(0, 10);
    const todayLogs = logs.filter((l) => l.date === today && l.completed);
    const totalXp = logs.reduce((sum, l) => sum + (l.xp_earned || 0), 0);
    const bestStreak = Math.max(0, ...habits.map((h) => h.best_streak || 0));

    return json({
      data: {
        total_habits: habits.length,
        completed_today: todayLogs.length,
        total_logs: logs.length,
        total_xp: totalXp,
        best_streak: bestStreak,
        completion_rate:
          habits.length > 0
            ? Math.round((todayLogs.length / habits.length) * 100)
            : 0,
      },
    });
  }

  if (action === "heatmap") {
    const { data: logs, error: le } = await supabase
      .from("logs")
      .select("date, completed")
      .eq("user_id", user.id)
      .eq("completed", true);
    if (le) return error(le.message, 500);

    const counts = {};
    for (const l of logs) {
      counts[l.date] = (counts[l.date] || 0) + 1;
    }
    const heatmap = Object.entries(counts).map(([date, count]) => ({ date, count }));
    return json({ data: heatmap });
  }

  if (action === "weekly-report" || action === "monthly-report") {
    const days = action === "weekly-report" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const { data: logs, error: le } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", sinceStr);
    if (le) return error(le.message, 500);

    const { data: habits, error: he } = await supabase
      .from("habits")
      .select("id, name")
      .eq("user_id", user.id);
    if (he) return error(he.message, 500);

    const completedLogs = logs.filter((l) => l.completed);
    const totalPossible = habits.length * days;

    return json({
      data: {
        period_days: days,
        total_logs: logs.length,
        completed: completedLogs.length,
        total_possible: totalPossible,
        completion_rate:
          totalPossible > 0
            ? Math.round((completedLogs.length / totalPossible) * 100)
            : 0,
        xp_earned: completedLogs.reduce((s, l) => s + (l.xp_earned || 0), 0),
      },
    });
  }

  if (action === "insights") {
    const { data: habits, error: he } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);
    if (he) return error(he.message, 500);

    const insights = [];
    const topStreak = [...habits].sort(
      (a, b) => (b.current_streak || 0) - (a.current_streak || 0)
    )[0];
    if (topStreak && topStreak.current_streak > 0) {
      insights.push({
        type: "streak",
        message: `"${topStreak.name}" has a ${topStreak.current_streak}-day streak!`,
      });
    }
    if (habits.length === 0) {
      insights.push({
        type: "tip",
        message: "Create your first habit to start tracking progress.",
      });
    }
    return json({ data: insights });
  }

  return error("Not found", 404);
}

// ── AI ────────────────────────────────────────────────────────────────────
async function handleAI(method, segments, body) {
  // POST /ai/habit-ai/suggestions
  if (method === "POST" && segments[1] === "habit-ai" && segments[2] === "suggestions") {
    const goal = body?.goal || "";
    // Return simple rule-based suggestions (no external AI dependency required)
    const suggestions = generateHabitSuggestions(goal);
    return json({ data: suggestions });
  }
  return error("Not found", 404);
}

function generateHabitSuggestions(goal) {
  const lower = (goal || "").toLowerCase();
  const base = [
    { name: "Daily reflection", description: "Spend 5 minutes journaling about your progress", frequency: "daily", difficulty: "easy" },
    { name: "Weekly review", description: "Review your goals and adjust plans every Sunday", frequency: "weekly", difficulty: "medium" },
  ];

  if (lower.includes("exercise") || lower.includes("fitness") || lower.includes("health")) {
    return [
      { name: "Morning workout", description: "30 minutes of exercise each morning", frequency: "daily", difficulty: "medium" },
      { name: "10k steps", description: "Walk at least 10,000 steps daily", frequency: "daily", difficulty: "easy" },
      { name: "Stretch routine", description: "15-minute stretching session", frequency: "daily", difficulty: "easy" },
      ...base,
    ];
  }
  if (lower.includes("read") || lower.includes("learn") || lower.includes("study")) {
    return [
      { name: "Read 20 pages", description: "Read at least 20 pages of a book", frequency: "daily", difficulty: "easy" },
      { name: "Study session", description: "Focus study block of 45 minutes", frequency: "daily", difficulty: "medium" },
      { name: "Learn something new", description: "Watch an educational video or tutorial", frequency: "daily", difficulty: "easy" },
      ...base,
    ];
  }
  if (lower.includes("meditat") || lower.includes("mindful") || lower.includes("calm")) {
    return [
      { name: "Morning meditation", description: "10-minute guided meditation", frequency: "daily", difficulty: "easy" },
      { name: "Breathing exercise", description: "5-minute deep breathing before bed", frequency: "daily", difficulty: "easy" },
      { name: "Gratitude journal", description: "Write 3 things you are grateful for", frequency: "daily", difficulty: "easy" },
      ...base,
    ];
  }
  return [
    { name: "Plan your day", description: "Spend 10 minutes planning your day each morning", frequency: "daily", difficulty: "easy" },
    { name: "Track progress", description: "Log your progress at the end of each day", frequency: "daily", difficulty: "easy" },
    ...base,
  ];
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export default async function handler(request) {
  const method = request.method;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const { segments, searchParams } = parsePath(request.url);
  const resource = segments[0]; // habits | logs | goals | reminders | analytics | ai

  if (!resource) {
    return json({ message: "HabitForge API v1", status: "ok" });
  }

  // Authenticate
  const auth = await authenticate(request);
  if (auth.err) return auth.err;
  const { user, supabase } = auth;

  // Parse body for mutation requests
  let body = null;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  // Route to resource handler
  switch (resource) {
    case "habits":
      return handleHabits(method, segments, searchParams, body, supabase, user);
    case "logs":
      return handleLogs(method, segments, searchParams, body, supabase, user);
    case "goals":
      return handleGoals(method, segments, searchParams, body, supabase, user);
    case "reminders":
      return handleReminders(method, segments, searchParams, body, supabase, user);
    case "analytics":
      return handleAnalytics(method, segments, searchParams, supabase, user);
    case "ai":
      return handleAI(method, segments, body);
    default:
      return error(`Unknown resource: ${resource}`, 404);
  }
}

// ---------------------------------------------------------------------------
// Netlify Functions v2 configuration
// ---------------------------------------------------------------------------
export const config = {
  path: "/api/v1/*",
};
