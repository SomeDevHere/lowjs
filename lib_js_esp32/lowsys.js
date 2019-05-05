'use strict';

let native = require('native');
let config = native.lowsysConfig();

/**
 * Methods to control low.js itself
 * @module lowsys
 */

module.exports = {
    /**
     * The 12-digit code/base MAC address of the device
     * @property {String}
     * @name codeMAC
     */
    codeMAC: config.codeMAC,

    partitions: {},
//    setSettings: native.setSettings,

    /**
     * Calls the garbage collector. Useful if you want to see the actual usage of memory in the graph of the neonious IDE.
     * Not needed for correct functioning of low.js however: The garbage collector is automatically called when there is no free memory
     * availavble.
     * @function gc
     */
    gc: native.gc,

    /**
     * Ends the process just like process.exit (with call to process event exit), but restarts the process afterwards
     * @function restart
     */
    restart: native.restart,

    /**
     * Callback which is called when a transfer completed.
     *
     * @callback HimemTransferCallback
     * @param {?Error} err optional error
     */

    /**
     * Allows user program to write to the higher 4 MB of PSRAM
     * if ESP-WROVER-B is used. This memory is not used by low.js itself
     * because it cannot be accessed directly bei the ESP32 chip.
     * @function himemWrite
     * @param {Buffer} buffer the buffer with data
     * @param {Number} himemOffset the offset in high memory to start writing
     * @param {Number} [bufOffset=0] the offset in the buffer where to get the data
     * @param {Number} [length=buffer.length-bufOffset] the number of bytes to write
     * @param {HimemTransferCallback} callback the callback to call when the data is written
     */
    himemWrite: native.himemWrite,

    /**
     * Allows user program to read from the higher 4 MB of PSRAM
     * if ESP-WROVER-B is used. This memory is not used by low.js itself
     * because it cannot be accessed directly bei the ESP32 chip.
     * @function himemRead
     * @param {Buffer} buffer the buffer to fill
     * @param {Number} himemOffset the offset in high memory where to start reading
     * @param {Number} [bufOffset=0] the offset in the buffer where to start writing to
     * @param {Number} [length=buffer.length-bufOffset] the number of bytes to read
     * @param {HimemTransferCallback} callback the callback to call when the data is read
     */
    himemRead: native.himemRead,

    /**
     * The user program can use a RTC or GPS module to get the current time
     * and pass it to this method to set the system time to it
     * @function setSystemTime
     * @param {Date} time the new system time
     */
    setSystemTime: (time) => {
        native.setSystemTime(time.getTime());
    },

    /**
     * Kicks the watchdog. Required to do by the user program if the code.watchdog_mode
     * setting is not set to "off", and it takes too long to get back to the event loop or
     * code.kick_watchdog_event_loop is not true.
     * @function kickWatchdog
     */
    kickWatchdog: native.kickWatchdog
};

/**
 * An object holding status information
 * @property {String} status.eth Status of Ethernet interface
 * @property {String} status.wifi Status of Wifi interface
 * @property {String} status.time Status of requesting time from time server
 * @property {String} status.sdcard Status of SD card
 * @name status
 */

 /**
 * An object holding status information
 * @property {String} status.eth Status of Ethernet interface
 * @property {String} status.wifi Status of Wifi interface
 * @property {String} status.time Status of requesting time from time server
 * @property {String} status.sdcard Status of SD card
 * @name status
 */
Object.defineProperty(module.exports, 'status', {
    enumerable: true,
    get: function () {
        return native.getStatus();
    }
});

/*
Object.defineProperty(module.exports, 'settings', {
    enumerable: true,
    get: function () {
        return native.getSettings();
    }
});
*/

/**
 * An object holding information about all available parititons
 * @property {Number} partitions.flash.used Bytes used of flash partition
 * @property {Number} partitions.flash.size Total size of flash partition in bytes
 * @property {Number} [partitions.sdcard.used] Bytes used of SD card partition
 * @property {Number} [partitions.sdcard.size] Total size of SD card partition in bytes
 * @property {Number} [partitions.himem.size] Bytes of RAM not used by low.js and available via himemRead/himemWrite
 * @name partitions
 */
Object.defineProperty(module.exports.partitions, 'flash', {
    enumerable: true,
    get: function () {
        return native.statPartition(0);
    }
});
Object.defineProperty(module.exports.partitions, 'sdcard', {
    enumerable: true,
    get: function () {
        return native.statPartition(1);
    }
});
module.exports.partitions.himem = {size: config.himemLength};
