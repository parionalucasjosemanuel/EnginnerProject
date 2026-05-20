const API = (() => {

    const BASE_URL =
        'http://localhost:3000/api';

    async function request(
        endpoint,
        method = 'GET',
        body = null,
        requiresAuth = false
    ) {

        const headers = {
            'Content-Type': 'application/json'
        };

        if (requiresAuth) {

            const token =
                localStorage.getItem('token');

            if (token) {

                headers.Authorization =
                    `Bearer ${token}`;
            }
        }

        const configuration = {
            method,
            headers
        };

        if (body) {

            configuration.body =
                JSON.stringify(body);
        }

        const response =
            await fetch(
                `${BASE_URL}${endpoint}`,
                configuration
            );

        return response.json();
    }

    return {

        get: endpoint =>
            request(endpoint),

        post: (
            endpoint,
            body,
            requiresAuth = false
        ) =>
            request(
                endpoint,
                'POST',
                body,
                requiresAuth
            ),

        put: (
            endpoint,
            body,
            requiresAuth = false
        ) =>
            request(
                endpoint,
                'PUT',
                body,
                requiresAuth
            ),

        delete: (
            endpoint,
            requiresAuth = false
        ) =>
            request(
                endpoint,
                'DELETE',
                null,
                requiresAuth
            )
    };
})();