const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('https://expert-zebra-97xxg55r7v96297q-5000.app.github.dev/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Registration failed');
            return;
        }

        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error(error);
        alert('Something went wrong. Please try again.');
    }
});