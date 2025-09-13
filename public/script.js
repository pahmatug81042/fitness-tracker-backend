const e = require("cors");

const API_URL = "http://localhost:5000/api";
let token = localStorage.getItem("token");

// Pages
const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");
const homePage = document.getElementById("homePage");
const welcomePage = document.getElementById("welcomeMsg");

function showPage (page) {
    [registerPage, loginPage, homePage].forEach(p => p.classList.remove("active"));
    page.classList.add("active");
}

// Navigation
document.getElementById("toLogin").addEventListener("click", () => showPage(loginPage));
document.getElementById("toRegister").addEventListener("click", () => showPage(registerPage));

// ------------------
// Register
// ------------------
document.getElementById("registerPage").addEventListener("click", async () => {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        document.getElementById("registerMsg").innerText = data.message || data.error;
        if (res.ok) showPage(loginPage);
    } catch (error) {
        console.error(error);
    }
});

// ------------------
// Login
// ------------------
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            token = data.token;
            localStorage.setItem("token", token);
            welcomeMsg.innerText = `Welcome, ${data.user.name}!`;
            showPage(homePage);
            loadWorkouts();
        } else {
            document.getElementById("loginMsg").innerText = data.error;
        }
    } catch (error) {
        console.error(error);
    }
});

// ------------------
// Logout
// ------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
    token = null;
    localStorage.removeItem("token");
    showPage(loginPage);
});

// ------------------
// Workouts
// ------------------
async function loadWorkouts () {
    try {
        const res = await fetch(`${API_URL}/workouts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const workouts = await res.json();

        const workoutList = document.getElementById("workoutList");
        const workoutSelect = document.getElementById("workoutSelect");

        workoutList.innerHTML = "";
        workoutSelect.innerHTML = "";

        workouts.forEach(w => {
            const li = document.createElement("li");
            li.innerText = w.title;
            workoutList.appendChild(li);

            const option = document.createElement("option");
            option.value = w._id;
            option.innerText = w.title;
            workoutSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
};

document.getElementById("addWorkoutBtn").addEventListener("click", async () => {
    const title = document.getElementById("workoutName").value;
    try {
        const res = await fetch(`${API_URL}/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                body: JSON.stringify({ title })
            },
        });
        if (res.ok) {
            document.getElementById("workoutName").value = "";
            loadWorkouts();
        }
    } catch (error) {
        console.error(error);
    }
});

// ------------------
// Exercises
// ------------------
document.getElementById("addExerciseBtn").addEventListener("click", async () => {
    const workoutId = document.getElementById("workoutSelect").value;
    const exercise = {
        name: document.getElementById("exerciseName").value,
        bodyPart: document.getElementById("bodyPart").value,
        equipment: document.getElementById("equipment").value,
        sets: Number(document.getElementById("sets").value),
        reps: Number(document.getElementById("reps").value),
        duration: Number(document.getElementById("duration").value)
    };

    try {
        const res = await fetch(`${API_URL}/workouts/${workoutId}/addExercise`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ exercise }),
        });
        if (res.ok) {
            document.getElementById("exerciseName").value = "";
            document.getElementById("bodyPart").value = "";
            document.getElementById("equipment").value = "";
            document.getElementById("sets").value = "";
            document.getElementById("reps").value = "";
            document.getElementById("duration").value = "";
            loadExercises(workoutId);
        }
    } catch (error) {
        console.error(error);
    }
});

async function loadExercises (workoutId) {
    try {
        const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
           headers: { Authorization: `Bearer ${token}` }, 
        });
        const workout = await res.json();
        const exerciseList = document.getElementById("exerciseList");
        exerciseList.innerHTML = "";
        workout.exercises.forEach(ex => {
            const li = document.createElement("li");
            li.innerText = `${ex.name} - ${ex.bodyPart} - ${ex.equipment} (${ex.sets || "-"} sets x ${ex.reps || "-"} reps, ${ex.duration || "-"} min)`;
            exerciseList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
};

// ------------------
// YouTube Search
// ------------------
document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("searchQuery").value;
    try {
        const res = await fetch(`${API_URL}/youtube/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const videos = await res.json();
        const container = document.getElementById("videoContainer");
        container.innerHTML = "";
        videos.forEach(video => {
            const iframe = document.getElementById("iframe");
            iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
            iframe.width = "300";
            iframe.height = "200";
            iframe.allowFullscreen = true;
            container.appendChild(iframe);
        });
    } catch (error) {
        console.error(error);
    }
});

// ------------------
// Init
// ------------------
if (token) {
    showPage(homePage);
    loadWorkouts();
} else {
    showPage(loginPage);
}