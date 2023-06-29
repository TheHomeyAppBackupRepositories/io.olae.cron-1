'use strict';

const { Driver } = require('homey');

class CrontabDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('CrontabDriver has been initialized');
  }

  async onPair(session) {
    // We don't need to do anything here
  }

}

module.exports = CrontabDriver;
