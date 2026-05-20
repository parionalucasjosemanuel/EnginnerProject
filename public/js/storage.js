const StorageManager = (() => {

    function save(
        key,
        value
    ) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }

    function load(key) {

        const value =
            localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : null;
    }

    function remove(key) {

        localStorage.removeItem(key);
    }

    function clearAll() {

        localStorage.clear();
    }

    return {
        save,
        load,
        remove,
        clearAll
    };
})();