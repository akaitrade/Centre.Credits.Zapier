
const send = require('./creates/send_data');
const recipe = require('./triggers/Trigger_');
module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  triggers: {
    //[recipe.key]: recipe
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [send.key]: send
  },

  resources: {},
};
