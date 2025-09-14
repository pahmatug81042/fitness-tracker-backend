// ==============================
// Utility: API Base
// ==============================
const API_BASE = "http://localhost:5000/api";

// ==============================
// Utility: Page Navigation
// ==============================
const pages = document.querySelectorAll(".page");
function showPage(pageId) {
    pages.forEach((p) => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
};

// ==============================
// Auth: Register & Login
// ==============================
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const toLogin = document.getElementById("toLogin");
const toRegister = document.getElementById("toRegister");

let token = localStorage.getItem("token");
let currentUser = null;

// Register
registerBtn?.addEventListener("click", async () => {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        document.getElementById("registerMsg").innerText = data.message || "Registered successfully!";
        if (res.ok) {
            showPage("loginPage");
        }
    } catch (error) {
        console.error(error);
    }
});

// Login
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            token = data.token;
            localStorage.setItem("token", token);
            currentUser = data.user;
            document.getElementById("welcomeMsg").innerText = `Welcome, ${currentUser.name}`;
            await loadWorkouts();
            showPage("homePage");
        } else {
            document.getElementById("LoginMsg").innerText = data.message || "Login failed";
        }
    } catch (error) {
        console.error(error);
    }
});

// Logout
logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    token = null;
    currentUser = null;
    showPage("loginPage");
});

// Page links
toLogin?.addEventListener("click", () => showPage("loginPage"));
toRegister?.addEventListener("click", () => showPage("registerPage"));

// ==============================
// Workouts
// ==============================
const addWorkoutBtn = document.getElementById("addWorkoutBtn");
const workoutList = document.getElementById("workoutList");
const workoutSelect = document.getElementById("workoutSelect");

async function loadWorkouts () {
    try {
        const res = await fetch(`${API_BASE}/workouts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const workouts = await res.json();

        workoutList.innerHTML = "";
        workoutSelect.innerHTML = "";

        workouts.forEach((w) => {
            const li = document.createElement("li");
            li.textContent = w.title;
            workoutList.appendChild(li);

            const option = document.createElement("option");
            option.value = w._id;
            option.textContent = w.title;
            workoutSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
};

addWorkoutBtn?.addEventListener("click", async () => {
    const title = document.getElementById("workoutName").value;
    try {
        const res = await fetch(`${API_BASE}/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
        });
        if (res.ok) {
            await loadWorkouts();
        }
    } catch (error) {
        console.error(error);
    }
});

// ==============================
// Exercises
// ==============================
const addExerciseBtn = document.getElementById("addExerciseBtn");
const exerciseList = document.getElementById("exerciseList");

async function loadExercises (workoutId) {
    try {
        const res = await fetch(`${API_BASE}/workouts/${workoutId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const workout = await res.json();

        exerciseList.innerHTML = "";
        workout.exercises.forEach((ex) => {
            const li = document.createElement("li");
            li.textContent = `${ex.name} (${ex.sets}x${ex.reps}, ${ex.duration || 0} min)`;
            exerciseList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
};

addExerciseBtn?.addEventListener("click", async () => {
    const workoutId = workoutSelect.value;
    const name = document.getElementById("exerciseName").value;
    const bodyPart = document.getElementById("bodyPart").value;
    const equipment = document.getElementById("equipment").value;
    const sets = parseInt(document.getElementById("sets").value) || 0;
    const reps = parseInt(document.getElementById("reps").value) || 0;
    const duration = parseInt(document.getElementById("duration").value) || 0;

    try {
        const res = await fetch(`${API_BASE}/workouts/${workoutId}/exercises`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, bodyPart, equipment, sets, reps, duration }),
        });
        if (res.ok) {
            await loadExercises(workoutId);
        }
    } catch (error) {
        console.error(error);
    }
});

workoutSelect?.addEventListener("change", (e) => loadExercises(e.target.value));

// ==============================
// YouTube Search
// ==============================
const searchBtn = document.getElementById("searchBtn");
const videoContainer = document.getElementById("videoContainer");

searchBtn?.addEventListener("click", async () => {
    const query = document.getElementById("searchQuery").value;
    try {
        const res = await fetch(`${API_BASE}/youtube/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        videoContainer.innerHTML = "";
        if (data.contents) {
            data.contents.forEach((item) => {
                if (item.video) {
                    const iframe = document.createElement("iframe");
                    iframe.src = `https://www.youtube.com/embed/${item.video.videoId}`;
                    iframe.width = "300";
                    iframe.height = "200";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    videoContainer.appendChild(iframe);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
});

// ==============================
// Auto-login if token exists
// ==============================
window.addEventListener("DOMContentLoaded", async () => {
    if (token) {
        try {
            const res = await fetch(`${API_BASE}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                currentUser = data;
                document.getElementById("welcomeMsg").innerText = `Welcome, ${currentUser.name}`;
                await loadWorkouts();
                showPage("homePage");
            }
        } catch (error) {
            console.error(error);
        }
    }
});