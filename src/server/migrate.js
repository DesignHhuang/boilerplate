'use strict';

/**
 * Add server folder to path
 */
require('app-module-path').addPath(__dirname);

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Application dependencies
 */
var globber = require('app/shared/utility/globber.js');
var db = require('app/db.js');

/**
 * Define migration schema
 */
var MigrationSchema = new Schema({
  file: String,
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Define migration model
 */
var MIGRATIONS_PATH = './server/migrations/';
var Migration = mongoose.model('Migration', MigrationSchema);

/**
 * Available commands
 */
var commands = {

  /**
   * Migrate up
   */
  up: function(done) {

    //Load all migrations from the migrations path
    var migrations = globber.files(MIGRATIONS_PATH + '**/*.js');

    //Nothing to do?
    if (migrations.length === 0) {
      return done(null, 'No migrations found');
    }

    //Query existing migrations
    Migration.find({}).then(function(migrations) {
      var existing = {};
      if (migrations.length) {
        migrations.forEach(function(migration) {
          existing[migration.file] = migration;
        });
      }
      return existing;
    }).then(function(existing) {

      //Helper to run migrations one by one
      function next() {

        //Done installing
        if (migrations.length === 0) {
          return done(null, 'Finished all migrations');
        }

        //Get migration
        var migration = migrations.shift();
        var script = require(path.resolve(migration));

        //Log
        process.stdout.write(chalk.grey(
          'Running migration ' + migration.replace(MIGRATIONS_PATH, '') + '... '
        ));

        //Check if already ran before
        if (existing[migration]) {
          process.stdout.write(chalk.yellow('SKIP\n'));
          console.warn(chalk.yellow('Already executed on', existing[migration].date));
          return next();
        }

        //Validate migration
        if (typeof script.up !== 'function') {
          process.stdout.write(chalk.yellow('SKIP\n'));
          console.warn(chalk.yellow('No `up` migration present'));
          return next();
        }

        //Run migration
        script.up(function(error) {
          if (error) {
            process.stdout.write(chalk.red('FAIL\n'));
            console.error(chalk.red(error.message));
            if (error.stack) {
              console.error(chalk.red(error.stack));
            }
          }
          else {
            process.stdout.write(chalk.green('OK\n'));
          }

          //Save and run next migration
          Migration.create({
            file: migration
          }).then(next, function(error) {
            done('Failed to save migration:\n' + error.message);
          });
        });
      }

      //Install now
      next();
    }, function(error) {
      done('Failed to read existing migrations:\n' + error.message);
    });
  },

  /**
   * Migrate down
   */
  down: function(done) {

    //Query existing migrations (last run first)
    Migration.find({}).sort({
      date: -1
    }).then(function(migrations) {

      //No existing migrations?
      if (!migrations.length) {
        return done(null, 'No existing migrations to roll back');
      }

      //Helper to run migrations one by one
      function next() {

        //Done migrating down
        if (migrations.length === 0) {
          return done(null, 'Finished all migrations');
        }

        //Get migration
        var migration = migrations.shift();

        //Log
        process.stdout.write(chalk.grey(
          'Rolling back migration ' + migration.file.replace(MIGRATIONS_PATH, '') + '... '
        ));

        //Try to load the script
        try {
          var script = require(path.resolve(migration.file));
        }
        catch (error) {
          process.stdout.write(chalk.red('FAIL\n'));
          console.error(chalk.red(error.message));
          migration.remove().then(next, function(error) {
            done('Failed to remove migration:\n' + error.message);
          });
          return;
        }

        //Validate migration
        if (typeof script.down !== 'function') {
          process.stdout.write(chalk.yellow('SKIP\n'));
          console.warn(chalk.yellow('No `down` migration present'));
          return next();
        }

        //Run migration
        script.down(function(error) {
          if (error) {
            process.stdout.write(chalk.red('FAIL\n'));
            console.error(chalk.red(error.message));
            if (error.stack) {
              console.error(chalk.red(error.stack));
            }
          }
          else {
            process.stdout.write(chalk.green('OK\n'));
          }

          //Remove and run next migration
          migration.remove().then(next, function(error) {
            done('Failed to remove migration:\n' + error.message);
          });
        });
      }

      //Run next
      next();
    }, function(error) {
      done('Failed to read existing migrations:\n' + error.message);
    });
  },

  /**
   * Refresh database (migrate down and up again)
   */
  refresh: function(done) {
    commands.down(function(error) {
      if (error) {
        return done(error);
      }
      commands.up(function(error) {
        if (error) {
          return done(error);
        }
        done(null, 'Database refreshed');
      });
    });
  }
};

//Defaults
var command = 'up';
var debug = false;

//Process CLI args to determine command
var args = process.argv;
args.shift();
args.shift();
if (args.length) {
  command = args.shift();
  args.forEach(function(arg) {
    if (arg === '-d') {
      debug = true;
    }
  });
}

//Validate it
if (!command || !commands[command]) {
  console.error(chalk.red('Unknown migration command:', command));
  process.exit(0);
}

//Run when DB connected
db(null, {
  debug: debug
}).connection.on('connected', function() {
  commands[command](function(error, success) {
    if (error) {
      console.error(chalk.red(error));
    }
    else if (success) {
      console.log(chalk.green(success));
    }
    process.exit(0);
  });
});
