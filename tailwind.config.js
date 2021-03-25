module.exports = {
  purge: {
    enable: true,
    content: ['./public/index.html', './public/js/app.js'],
  },

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      top: {
        '-13': '3.25rem',
      },
      height: {
        hero: '550px',
        'hero-md': '600px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
