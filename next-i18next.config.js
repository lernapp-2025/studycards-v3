module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    localeDetection: false,
  },
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};