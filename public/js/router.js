const Router = (() => {

    const routes = {

        '/':
            'index.html',

        '/login':
            'login.html',

        '/register':
            'register.html',

        '/dashboard':
            'dashboard.html',

        '/practice':
            'practice.html',

        '/analytics':
            'analytics.html',

        '/leaderboard':
            'leaderboard.html',

        '/profile':
            'profile.html'
    };

    function navigate(path) {

        const route =
            routes[path];

        if (route) {

            window.location.href =
                route;
        }
    }

    function initializeLinks() {

        document
            .querySelectorAll(
                '[data-route]'
            )
            .forEach(link => {

                link.addEventListener(
                    'click',
                    event => {

                        event.preventDefault();

                        navigate(
                            link.dataset.route
                        );
                    }
                );
            });
    }

    return {
        navigate,
        initializeLinks
    };
})();

window.addEventListener(
    'DOMContentLoaded',
    () => {

        Router.initializeLinks();
    }
);