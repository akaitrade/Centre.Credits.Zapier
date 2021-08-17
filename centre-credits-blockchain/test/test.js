
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('triggers', () => {

      appTester(App.triggers.Trigger_.operation.perform, bundle)
        .then(results => {
          done();
        })
        .catch(done);
    });

