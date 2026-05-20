const UI = (() => {

    function showLoader() {

        const loader =
            document.createElement('div');

        loader.id =
            'globalLoader';

        loader.innerHTML = `
            <div class="loader-spinner"></div>
        `;

        document.body.appendChild(loader);
    }

    function hideLoader() {

        const loader =
            document.getElementById(
                'globalLoader'
            );

        if (loader) {

            loader.remove();
        }
    }

    function showToast(
        message,
        type = 'success'
    ) {

        const toast =
            document.createElement('div');

        toast.className =
            `toast toast-${type}`;

        toast.textContent =
            message;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add('toast-visible');

        }, 100);

        setTimeout(() => {

            toast.remove();

        }, 4000);
    }

    function createModal(
        title,
        content
    ) {

        const modal =
            document.createElement('div');

        modal.className =
            'modal-overlay';

        modal.innerHTML = `
            <div class="modal-window">

                <div class="modal-header">

                    <h2>${title}</h2>

                    <button id="closeModalBtn">
                        ✕
                    </button>

                </div>

                <div class="modal-content">
                    ${content}
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        document
            .getElementById(
                'closeModalBtn'
            )
            .addEventListener(
                'click',
                () => modal.remove()
            );

        return modal;
    }

    return {
        showLoader,
        hideLoader,
        showToast,
        createModal
    };
})();