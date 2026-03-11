/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts () {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader');

  webFontLoader.load({
    google: {
      families: ['Inter:300,400,500,600,700,800&display=swap', 'Roboto:100,300,400,500,700,900&display=swap'],
    },
  });
}
