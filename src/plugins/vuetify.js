// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';
export default createVuetify({
    theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
          myCustomTheme: {
            dark: false,
            colors: {
              'primary': '#00897B',
              'primary-light': '#4DB6AC',
              'primary-dark': '#00695C',
              'text-color': '#333333',
              'background-color': '#F5F5F5',
            },
          },
        },
      },
});
