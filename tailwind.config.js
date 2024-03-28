module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            boxShadow: {
                'bxl': '1px 1px 5px 4px #fbf9f1',
              }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
