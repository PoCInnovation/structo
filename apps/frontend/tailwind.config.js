/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'structo-bg': '#05031A',
                'structo-secondary-text': '#D9E1FA',
                'structo-outline': 'rgba(255, 255, 255, 0.30)',
            },
            backgroundImage: {
                'structo-gradient': 'linear-gradient(98deg, #009DEB 0%, #BE00CC 37.02%, #F44166 69.23%, #FE9B20 100%)',
                'background-gradient': 'radial-gradient(87.89% 140.38% at 50% 0%, #05031A 57.21%, #2559B1 100%)',
                'structo-title-gradient': 'linear-gradient(92deg, #FFF 32.58%, #A6A7DF 99.67%)',
                'structo-labels-gradient': 'radial-gradient(94.26% 50% at 50% 50%, rgba(5, 3, 26, 0.17) 69.71%, rgba(233, 233, 233, 0.17) 99.99%)',
            },
        },
    },
    plugins: [],
};
