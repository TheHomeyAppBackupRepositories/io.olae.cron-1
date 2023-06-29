'use strict';

const { Device } = require('homey');
const CRON = require("node-cron");

class CrontabDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('CrontabDevice has been initialized');

    this._triggered = this.homey.flow.getDeviceTriggerCard("triggered");

    this.tabs = [];
    this.updateScheduleTasks(this.getSetting("tab"));
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('CrontabDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('CrontabDevice settings where changed');

    this.updateScheduleTasks(newSettings.tab);
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('CrontabDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('CrontabDevice has been deleted');

    // Stop and remove all existing tasks
    this.tabs.forEach(function(i) {
      i.stop();
    });
    this.tabs = [];
  }

  updateScheduleTasks(crontab) {
    this.log("Updating scheduled tasks");

    // Save for later
    let device = this;

    // Stop and remove all existing tasks
    this.tabs.forEach(function(i) {
      i.stop();
    });
    this.tabs = [];

    // Make sure there is a tab
    if(crontab === "") {
      device.log("Crontab was empty, nothing to add");
      return;
    }

    // Schedule tasks
    let lines = crontab.split("\n");
    device.log("Got " + lines.length + " crontab line(s)");
    for(let i = 0; i < lines.length; i++) {
      device.log("Processing line: " + lines[i]);
      if(CRON.validate(lines[i])) {
        device.log("Success");
        CRON.schedule(lines[i], () => {
          device.log("Cron triggered");
          device._triggered.trigger(device, {}, {})
          .then(device.log("Trigger triggered successfully"));
        });
      } else {
        device.log("Failed validation");
        device.homey.notifications.createNotification({
          excerpt: "Cron: Invalid crontab entry ignored: " + lines[i]
        })
      }
    }
  }

}

module.exports = CrontabDevice;
