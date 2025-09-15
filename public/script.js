// Check if user is logged in to update navbar
const token = localStorage.getItem('token');
const navLinks = document.getElementById('nav-links');

if (token) {
    navLinks.innerHTML = `
        <a href="dashboard.html">Dashboard</a>
        <a href="workouts.html">Workouts</a>
        <a href="#" id="logout-btn">Logout</a>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href= 'index.html';
    });
}