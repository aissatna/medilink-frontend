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
          primary: '#1A4D8F',    // bleu pro
          secondary: '#0E88D4',  // accent frais
          info: '#0288D1',
          success: '#2E7D32',
          warning: '#F9A825',
          error: '#C62828',
          background: '#F4F6F8',
          surface: '#FFFFFF',
          'on-background': '#1E2A40',
          'on-surface': '#1E2A40',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        },
      },
    },
  },
});
