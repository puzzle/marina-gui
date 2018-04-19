const translations = require.context("./", true, /\.json$/);

export default translations.keys()
  .reduce(
    (acc, item) => ({
      ...acc,
      [item.replace(/\.\/(\w+)\.json$/, "$1")]: true,
    }),
    {}
  )
