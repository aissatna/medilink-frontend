const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  devServer: {
    port: 3000,
  },

  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
  },
});
