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
               primary: '#00897B',
               bgColor: '#F5F5F5',
            },
          },
        },
      },
});
