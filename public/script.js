const API_BASE = "https://expert-zebra-97xxg55r7v96297q-5000.app.github.dev/api";

const pages = document.querySelectorAll(".page");
function showPage(pageId) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// Auth elements
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toLogin = document.getElementById("toLogin");
const toRegister = document.getElementById("toRegister");

let token = localStorage.getItem("token");
let currentUser = null;

// Register
registerBtn?.addEventListener("click", async () => {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !password) {
    document.getElementById("registerMsg").innerText = "All fields are required";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    document.getElementById("registerMsg").innerText = data.message || "Registered successfully!";
    if (res.ok) showPage("loginPage");
  } catch (err) {
    console.error(err);
    document.getElementById("registerMsg").innerText = "Registration failed";
  }
});

// Login
loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    document.getElementById("LoginMsg").innerText = "All fields are required";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok && data.token && data.user) {
      token = data.token;
      localStorage.setItem("token", token);
      currentUser = data.user;
      document.getElementById("welcomeMsg").innerText = `Welcome, ${currentUser.name || "User"}`;
      await loadWorkouts();
      showPage("homePage");
    } else {
      document.getElementById("LoginMsg").innerText = data.message || "Login failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("LoginMsg").innerText = "Login failed";
  }
});

// Logout
logoutBtn?.addEventListener("click", () => {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  showPage("loginPage");
});

toLogin?.addEventListener("click", () => showPage("loginPage"));
toRegister?.addEventListener("click", () => showPage("registerPage"));

// Workouts
const addWorkoutBtn = document.getElementById("addWorkoutBtn");
const workoutList = document.getElementById("workoutList");
const workoutSelect = document.getElementById("workoutSelect");

async function loadWorkouts() {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/workouts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const workouts = await res.json();

    workoutList.innerHTML = "";
    workoutSelect.innerHTML = "";

    workouts.forEach(w => {
      const li = document.createElement("li");
      li.textContent = w.title;
      workoutList.appendChild(li);

      const option = document.createElement("option");
      option.value = w._id;
      option.textContent = w.title;
      workoutSelect.appendChild(option);
    });
  } catch (err) { console.error(err); }
}

addWorkoutBtn?.addEventListener("click", async () => {
  const title = document.getElementById("workoutName").value.trim();
  if (!title || !token) return;

  try {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    if (res.ok) {
      document.getElementById("workoutName").value = "";
      await loadWorkouts();
    }
  } catch (err) { console.error(err); }
});

// Exercises
const addExerciseBtn = document.getElementById("addExerciseBtn");
const exerciseList = document.getElementById("exerciseList");

async function loadExercises(workoutId) {
  if (!workoutId || !token) return;
  try {
    const res = await fetch(`${API_BASE}/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const workout = await res.json();

    exerciseList.innerHTML = "";
    workout.exercises.forEach(ex => {
      const li = document.createElement("li");
      li.textContent = `${ex.name || "-"} - ${ex.bodyPart || "-"} - ${ex.equipment || "-"} (${ex.sets || "-"}x${ex.reps || "-"}, ${ex.duration || "-"} min)`;
      exerciseList.appendChild(li);
    });
  } catch (err) { console.error(err); }
}

addExerciseBtn?.addEventListener("click", async () => {
  const workoutId = workoutSelect.value;
  if (!workoutId || !token) return;

  const exercise = {
    name: document.getElementById("exerciseName").value.trim(),
    bodyPart: document.getElementById("bodyPart").value.trim(),
    equipment: document.getElementById("equipment").value.trim(),
    sets: Number(document.getElementById("sets").value) || 0,
    reps: Number(document.getElementById("reps").value) || 0,
    duration: Number(document.getElementById("duration").value) || 0
  };

  try {
    const res = await fetch(`${API_BASE}/workouts/${workoutId}/addExercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ exercise })
    });
    if (res.ok) {
      ["exerciseName","bodyPart","equipment","sets","reps","duration"].forEach(id => document.getElementById(id).value = "");
      await loadExercises(workoutId);
    }
  } catch (err) { console.error(err); }
});

workoutSelect?.addEventListener("change", e => loadExercises(e.target.value));