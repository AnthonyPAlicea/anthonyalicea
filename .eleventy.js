const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = config => {
  
    config.addPassthroughCopy("assets");
    config.addPassthroughCopy("projects/interface-normalization");

    config.addFilter('dateDisplay', require('./filters/date-display.js'));

    config.addPlugin(syntaxHighlight);

    config.addPlugin(pluginRss);

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