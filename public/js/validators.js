const Validators = (() => {

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }

    function isStrongPassword(password) {

        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password)
        );
    }

    function isEmpty(value) {

        return !value ||
            value.trim().length === 0;
    }

    function validateCodeLength(code) {

        return code.length >= 20;
    }

    return {
        isValidEmail,
        isStrongPassword,
        isEmpty,
        validateCodeLength
    };
})();