const token = localStorage.getItem("token");
const exerciseList = document.getElementById("exercise-list");
const modal = document.getElementById("workout-modal");
const closeModal = document.getElementById("close-modal");
const exerciseTitle = document.getElementById("exercise-title");
const workoutForm = document.getElementById("workout-form");

let selectedExercise = null;

// Redirect if not authenticated
if (!token) {
    alert("Please login to access the dashboard");
    window.location.href = "login.html";
}

// Fetch exercises from backend
async function fetchExercises() {
    try {
        const res = await fetch(
            "https://expert-zebra-97xxg55r7v96297q-5000.app.github.dev/api/exercises/all",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!res.ok) throw new Error("Failed to fetch exercises");

        const data = await res.json();
        const exercises = data.exercises;

        exerciseList.innerHTML = exercises
            .map(
                (ex) => `
            <div class="exercise-card">
                <img src="${ex.youtubeThumbnail || 'placeholder.jpg'}" alt="${ex.name} Thumbnail" />
                <h3>${ex.name}</h3>
                <p>Body Part: ${ex.bodyPart}</p>
                <button onclick="openModal('${ex.id}', '${ex.name}')">Add to Workout</button>
            </div>
        `
            )
            .join("");
    } catch (error) {
        console.error(error);
        alert("Failed to fetch exercises.");
    }
}

// Open modal
function openModal(id, name) {
    selectedExercise = { id, name };
    exerciseTitle.textContent = `Add ${name} to Workout`;
    modal.classList.remove("hidden");
}

// Close modal
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// Submit workout
workoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const notes = document.getElementById("notes").value;

    try {
        const res = await fetch(
            "https://expert-zebra-97xxg55r7v96297q-5000.app.github.dev/api/workouts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    exerciseId: selectedExercise.id,
                    exerciseName: selectedExercise.name,
                    sets,
                    reps,
                    notes,
                }),
            }
        );

        const data = await res.json();
        if (!res.ok) alert(data.message || "Failed to add workout.");
        else {
            alert("Workout added successfully!");
            modal.classList.add("hidden");
            workoutForm.reset();
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

// Initial fetch
fetchExercises();