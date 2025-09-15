const token = localStorage.getItem('token');
const workoutsList = document.getElementById('workouts-list');
const editModal = document.getElementById('edit-modal');
const closeEdit = document.getElementById('close-edit');
const editForm = document.getElementById('edit-form');

let selectedWorkoutId = null;

// Redirect if not logged-in
if (!token) {
    alert("Please login to access your workouts");
    window.location.href = 'login.html';
}

// Fetch workouts
async function fetchWorkouts() {
    try {
        const res = await fetch('/api/workouts', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const workouts = await res.json();

        workoutsList.innerHTML = workouts
            .map(
                (w) => `
                    <div class="workout-card">
                        <h3>${w.exerciseName}</h3>
                        <p><strong>Sets:</strong> ${w.sets}</p>
                        <p><strong>Reps:</strong> ${w.reps}</p>
                        <p><strong>Notes:</strong> ${w.notes || '-'}</p>
                        <div class="card-actions">
                            <button class="edit-btn" onclick="openEditModal('${w._id}', ${w.sets}, ${w.reps}, '${w.notes || ''}')">Edit</button>
                            <button class="delete-btn" onclick="deleteWorkout('${w._id}')">Delete</button>
                        </div>
                    </div>
                `
            )
            .join('');
    } catch (error) {
        console.error(error);
        alert("Failed to fetch workouts.");
    }
};

// Open edit modal
function openEditModal(id, sets, reps, notes) {
    selectedWorkoutId = id;
    document.getElementById('edit-sets').value = sets;
    document.getElementById('edit-reps').value = reps;
    document.getElementById('edit-notes').value = notes;
    editModal.classList.remove('hidden');
};

// Close modal
closeEdit.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

// Handle edit submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sets = document.getElementById('edit-sets').value;
    const reps = document.getElementById('edit-reps').value;
    const notes = document.getElementById('edit-notes').value;

    try {
        const res = await fetch(`/api/workouts/${selectedWorkoutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sets, reps, notes }),
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message || 'Failed to updated workout.');
            return;
        }

        alert('Workout updated successfully!');
        editModal.classList.add('hidden');
        fetchWorkouts();
    } catch (error) {
        console.error(error);
        alert('Something went wrong.');
    }
});

// Delete workout
async function deleteWorkout(id) {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
        const res = await fetch(`/api/workouts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message || 'Failed to delete workout');
            return;
        }

        alert('Workout deleted successfully!');
        fetchWorkouts();
    } catch (error) {
        console.error(error);
        alert('Something went wrong.');
    }
};

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem("token");
    window.location.href = 'index.html';
});

// Initial fetch
fetchWorkouts();