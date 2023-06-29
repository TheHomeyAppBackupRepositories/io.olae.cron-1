'use strict';

const Homey = require('homey');

class CronApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('CronApp has been initialized');
  }

}

module.exports = CronApp;
