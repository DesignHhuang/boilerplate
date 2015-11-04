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
 * Define migration model and load migrations
 */
var Migration = mongoose.model('Migration', MigrationSchema);
var migrations = globber.files('./server/migrations/**/*.js');
var existing = {};

/**
 * Run migrations
 */
function run() {

  //Nothing to do?
  if (migrations.length === 0) {
    return;
  }

  /**
   * Helper to run migrations one by one
   */
  function runNext() {

    //Done installing
    if (migrations.length === 0) {
      process.exit(0);
      return;
    }

    //Get migration
    var migration = migrations.shift();
    var script = require(path.resolve(migration));

    //Log
    console.log(
      chalk.grey('Running migration %s...'), migration.replace('./server/migrations/', '')
    );

    //Check if already ran before
    if (existing[migration]) {
      console.warn(chalk.yellow('Already executed on', existing[migration].date));
      return runNext();
    }

    //Validate migration
    if (typeof script.up !== 'function') {
      console.error(chalk.red('No `up` migration present'));
      return runNext();
    }

    //Run migration
    script.up(function(error) {
      if (error) {
        console.error(chalk.red('Failed:\n' + error.message));
      }
      else {
        console.log(chalk.green('Ok'));
      }

      //Save and run next migration
      Migration.create({
        file: migration
      }).then(runNext, function(error) {
        console.error(chalk.red('Failed to save migration:\n' + error.message));
        process.exit(0);
      });
    });
  }

  //Install now
  runNext();
}

//Run when DB connected
db().connection.on('connected', function() {

  //Query existing migrations
  Migration.find({}).then(function(migrations) {

    //Flag existing migrations
    if (migrations.length) {
      migrations.forEach(function(migration) {
        existing[migration.file] = migration;
      });
    }

    //Run migrations script now
    run();
  });
});
