'use strict';

module.exports = lando => {
  // Modules
  const _ = lando.node._;
  const fs = lando.node.fs;
  const path = require('path');
  const Promise = lando.Promise;

  // Collect the methods
  const methods = [];

  // Create the starting set of options/questions
  let options = {
    recipe: {
      describe: 'The recipe to use',
      choices: lando.recipes.get(),
      alias: ['r'],
      string: true,
      interactive: {
        type: 'list',
        message: 'What recipe do you want to use?',
        default: 'custom',
        choices: _.map(lando.recipes.get(), recipe => ({name: recipe, value: recipe})),
        weight: 500,
      },
    },
  };

  // Merge in or alter other options provided by method plugins
  _.forEach(lando.init.get(), method => {
    methods.push(method);
    options = _.merge(options, lando.init.get(method).options);
  });

  // Specify more auxopts
  const auxOpts = {
    destination: {
      describe: 'Specify where to init the app',
      alias: ['dest', 'd'],
      string: true,
      default: process.cwd(),
    },
    webroot: {
      describe: 'Specify the webroot relative to destination',
      string: true,
      interactive: {
        type: 'input',
        message: 'Where is your webroot relative to the init destination?',
        default: '.',
        when: answers => {
          const recipe = answers.recipe || lando.cli.argv().recipe;
          return lando.recipes.webroot(recipe);
        },
        weight: 900,
      },
    },
    name: {
      describe: 'The name of the app',
      string: true,
      interactive: {
        type: 'input',
        message: 'What do you want to call this app?',
        default: 'My Lando App',
        filter: value => {
          if (value) {
            return _.kebabCase(value);
          }
        },
        when: answers => {
          const recipe = answers.recipe || lando.cli.argv().recipe;
          return lando.recipes.name(recipe);
        },
        weight: 1000,
      },
    },
    yes: {
      describe: 'Auto answer yes to prompts',
      alias: ['y'],
      default: false,
      boolean: true,
    },
  };

  // The task object
  return {
    command: 'init [method]',
    describe: 'Initialize a lando app, optional methods: ' + methods.join(', '),
    options: _.merge(options, auxOpts),
    run: options => {
      // Generate a machine name for the app.
      options.name = _.kebabCase(options.name);

      // Get absolute path of destination
      options.destination = path.resolve(options.destination);

      // Create directory if needed
      if (!fs.existsSync(options.destination)) {
        mkdirp.sync(options.destination);
      }

      // Set node working directory to the destination
      process.chdir(options.destination);

      // Set the basics
      const config = {
        name: options.name,
        recipe: options.recipe,
      };

      // If we have a webroot let's set it
      if (!_.isEmpty(options.webroot)) {
        _.set(config, 'config.webroot', options.webroot);
      }

      // Method specific build steps if applicable
      return Promise.try(() => lando.init.build(config.name, options.method, options))
      // Kill any build containers if needed
      .then(() => lando.init.kill(config.name, options.destination))
      // Check to see if our recipe provides additional yaml augment
      .then(() => lando.init.yaml(options.recipe, config, options))
      // Create the lando yml
      .then(config => {
        // Where are we going?
        const dest = path.join(options.destination, '.lando.yml');

        // Rebase on top of any existing yaml
        if (fs.existsSync(dest)) {
          const pec = lando.yaml.load(dest);
          config = _.mergeWith(pec, config, lando.utils.merger);
        }

        // Dump it
        lando.yaml.dump(dest, config);
      })

      // Tell the user things
      .then(() => {
        // Header it
        console.log(lando.cli.makeArt('init'));

        // Grab a new cli table
        const table = lando.cli.makeTable();

        // Get docs link
        const docBase = 'https://docs.devwithlando.io/tutorials/';
        const docUrl = docBase + config.recipe + '.html';

        // Add data
        table.add('NAME', config.name);
        table.add('LOCATION', options.destination);
        table.add('RECIPE', options.recipe);
        table.add('DOCS', docUrl);

        // Add some other things if needed
        if (!_.isEmpty(options.method)) {
          table.add('METHOD', options.method);
        }

        // Print the table
        console.log(table.toString());

        // Space it
        console.log('');
      });
    },
  };
};