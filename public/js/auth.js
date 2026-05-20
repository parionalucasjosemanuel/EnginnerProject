const API_URL =
    'http://localhost:3000/api';

const loginForm =
    document.getElementById('loginForm');

const registerForm =
    document.getElementById('registerForm');

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    try {

        const response =
            await fetch(`${API_URL}/login`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email,
                    password
                })
            });

        const data =
            await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        localStorage.setItem(
            'token',
            data.token
        );

        localStorage.setItem(
            'user',
            JSON.stringify(data.user)
        );

        window.location.href =
            'dashboard.html';

    } catch (error) {

        console.error(error);

        alert('Login failed.');
    }
}

async function registerUser(event) {

    event.preventDefault();

    const username =
        document.getElementById('username').value;

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    try {

        const response =
            await fetch(`${API_URL}/register`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

        const data =
            await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        localStorage.setItem(
            'token',
            data.token
        );

        localStorage.setItem(
            'user',
            JSON.stringify(data.user)
        );

        window.location.href =
            'dashboard.html';

    } catch (error) {

        console.error(error);

        alert('Registration failed.');
    }
}

if (loginForm) {

    loginForm.addEventListener(
        'submit',
        loginUser
    );
}

if (registerForm) {

    registerForm.addEventListener(
        'submit',
        registerUser
    );
}