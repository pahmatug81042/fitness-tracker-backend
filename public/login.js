const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Login failed');
            return;
        }

        // Save JWT token in localStorage
        localStorage.setItem('token', data.token);
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again.')
    }
});