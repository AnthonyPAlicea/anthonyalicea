module.exports = config => {
  
    config.addPassthroughCopy("assets");

    config.addFilter('dateDisplay', require('./filters/date-display.js'));

    config.addCollection('postsWithoutDrafts', (collection) =>
      [...collection.getFilteredByGlob('./blog/*.md')].filter(
        (post) => !post.data.draft
      )
    );
  
    return {
      pathPrefix: require('./globals/site.json').baseUrl,
      dir: {
        input: './',
        output: '_site',
        includes: 'includes',
        layouts: 'includes/layouts',
        data: 'globals',
      },
    };
  };