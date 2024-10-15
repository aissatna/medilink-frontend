const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  devServer: {
    port: 3000,  // The port your Vue dev server runs on
    allowedHosts: "all",  // Allow all hosts (including ngrok) 
    client: {
      webSocketURL: 'auto://0.0.0.0/ws',  // WebSocket for HMR over any network
    },
  },
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
  },
});
