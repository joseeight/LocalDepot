/**
 * @license Crossbrowser localStorage-like library.
 *
 * Copyright (C) 2014, Tradeshift. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author jam@tradeshift.com (José Antonio Márquez Russo)
 * https://github.com/Tradeshift/LocalDepot
 */

if (typeof window !== 'undefined') {
  (function() {
    'use strict';
    // Checking for LocalDepot.
    if (!window.LocalDepot) {
      // Firefox makes this a getter only, so adding a check to prevent error.
      if (!window.indexedDB) {
        window.indexedDB = window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB;
      }
      var LocalDepot = window.LocalDepot = {};
      /**
       * Error handling method called in unexpected library errors.
       * @type {?Function}
       */
      LocalDepot.onError = null;
      /**
       * The type of storage available on the device.
       * @type {?LocalDepot.storageType} One of the storageType values.
       */
      LocalDepot.deviceStorageType = null;
      /**
       * The version number to use when creating tables.
       * @type {number} Any number, should increase when schema updates.
       */
      LocalDepot.indexedDbVersion = 1;
      /**
       * The default key used for indexing in the table created.
       * @const
       * @type {string}
       */
      LocalDepot.DB_INDEXING_KEY = 'item';
      /**
       * Storage types supported by library.
       * @enum {string}
       */
      LocalDepot.storageType = {
        INDEXEDDB: 'indexeddb',
        WEBSQL: 'websql',
        LOCALSTORAGE: 'localstorage'
      };
      /**
       * A Depot.
       *
       * @typedef {{
       *    name: {string},
       *    storageType: {LocalDepot.storageType},
       *    database: {*=},
       *    getItem: {function(string, function(string=))},
       *    getKeys: {function(function(Array.<string>))},
       *    setItem: {function(string, string, function(boolean)=},
       *    hasItem: {function(string, function(boolean))},
       *    removeItem: {function(string, function(boolean))},
       *    clear: {function(function(boolean))},
       * }}
       * @constructor
       * @param {string} name The name of the Depot.
       * @param {LocalDepot.storageType} One of the storageType values.
       */
      LocalDepot.Depot = function Depot(name, storageType) {
        this.name = name;
        this.storageType = storageType;
        // Getting the item from Depot.
        this.getItem = function getItem(name, callback) {
          LocalDepot._Depot.getItem(this, name, callback);
        };
        // Getting the keys from Depot.
        this.getKeys = function getKeys(callback) {
          LocalDepot._Depot.getKeys(this, callback);
        };
        // Setting item in Depot.
        this.setItem = function setItem(name, itemValue, callback) {
          LocalDepot._Depot.setItem(this, name, itemValue, callback);
        };
        // Checking for item in Depot.
        this.hasItem = function hasItem(name, callback) {
          LocalDepot._Depot.hasItem(this, name, callback);
        };
        // Removing item from Depot.
        this.removeItem = function removeItem(name, callback) {
          LocalDepot._Depot.removeItem(this, name, callback);
        };
        // Removing all items from Depot.
        this.clear = function clear() {
          LocalDepot._Depot.clear(this);
        };
      };
      /**
       * Interface-like handler for Depot actions.
       * @struct
       * @private
       */
      LocalDepot._Depot = {
        /**
         * Gets an item from the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         * @param {string} name The name of the item.
         * @param {function(string=)} callback The method to send the outcome.
         */
        getItem: function getItem(depot, name, callback) {
          // Getting item according to the storage detected.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // Opening database to perform operation.
            LocalDepot._Depot.openIndexedDb(depot.name,
                LocalDepot.indexedDbVersion, function(database) {
                  var objectStore, transaction, request;
                  // Creating transaction.
                  transaction = database.transaction([depot.name]);
                  // Reference to object store.
                  objectStore = transaction.objectStore(depot.name);
                  // Making request to get item.
                  request = objectStore.get(name);
                  // Success handler, makes callback.
                  request.onsuccess = function(evt) {
                    var item = evt.target.result;
                    if (typeof callback === 'function') {
                      if (item) {
                        callback(item.data);
                      } else {
                        callback(undefined);
                      }
                    }
                    // Closing database.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                  // Error handler, makes callback.
                  request.onerror = function(error) {
                    // TODO (jam@): Determine appropiate return value.
                    if (typeof callback === 'function') {
                      callback(undefined);
                    }
                    // Closing database.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                }
            );
          }
        },
        /**
         * Gets all the key names in the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         * @param {function(Array.<string>=)} callback The method to send
         *     the outcome.
         */
        getKeys: function getKeys(depot, callback) {
          // Gettings keys according to the storage detected.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // Opening database to perform operation.
            LocalDepot._Depot.openIndexedDb(depot.name,
                LocalDepot.indexedDbVersion, function(database) {
                  var objectStore, transaction, keys = [], keyCursor;
                  // Creating transaction.
                  transaction = database.transaction([depot.name]);
                  // Reference to object store.
                  objectStore = transaction.objectStore(depot.name);
                  // Getting reference to the cursor.
                  keyCursor = objectStore.openCursor();
                  // Success in getting cursor.
                  keyCursor.onsuccess = function(evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                      keys.push(cursor.value.item);
                      cursor.continue();
                    } else {
                      if (typeof callback === 'function') {
                        callback(keys);
                      }
                      // Closing database.
                      LocalDepot._Depot.closeIndexedDb(database);
                    }
                  };
                  // Failed to get cursor.
                  keyCursor.onerror = function(evt) {
                    // TODO (jam@): Dispatch error.
                    if (typeof callback === 'function') {
                      callback(keys);
                    }
                    // Closing database.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                }
            );
          } else if (depot.storageType === LocalDepot.storageType.WEBSQL) {
            console.log('WEBSQL');
          } else if (depot.storageType ===
              LocalDepot.storageType.LOCALSTORAGE) {
            console.log('LOCALSTORAGE');
          } else {
            // TODO (jam@): Add error handling.
          }
        },
        /**
         * Sets an item in the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         * @param {string} name The name of the item.
         * @param {string} itemValue The value of the item.
         * @param {function(boolean)=} opt_callback The method to send
         *     the outcome.
         */
        setItem: function setItem(depot, name, itemValue, opt_callback) {
          // Setting item according to the storage detected.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // Opening database to perform operation.
            LocalDepot._Depot.openIndexedDb(depot.name,
                LocalDepot.indexedDbVersion, function(database) {
                  var objectStore, request,
                      // Creating writable transaction reference to database.
                      transaction = database.transaction(
                          [depot.name], 'readwrite');
                  // Creating reference to store in database.
                  objectStore = transaction.objectStore(depot.name);
                  // Success, closing connection to database.
                  transaction.oncomplete = function(event) {
                    if (typeof opt_callback === 'function') {
                      opt_callback(true);
                    }
                    // Closing instance of indexedDb.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                  // Error, dispatching notification.
                  transaction.onerror = function(event) {
                    // TODO (jam@): Add error handling.
                    if (typeof opt_callback === 'function') {
                      opt_callback(false);
                    }
                    // Closing instance of indexedDb.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                  // Putting item in table.
                  request = objectStore.put({item: name, data: itemValue});
                  //request.onsuccess = function (e) {};
                  //request.onerror = function(e) {
                  // TODO (jam@): Add error handling.
                  //if (typeof opt_callback === 'function') {
                  //opt_callback(false);
                  //}
                  //};
                }
            );
          } else if (depot.storageType === LocalDepot.storageType.WEBSQL) {
            console.log('WEBSQL');
          } else if (depot.storageType ===
              LocalDepot.storageType.LOCALSTORAGE) {
            console.log('LOCALSTORAGE');
          } else {
            // TODO (jam@): Add error handling.
          }
        },
        /**
         * Checks for an item to exist in the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         * @param {string} name The name of the item.
         * @param {function(boolean)} callback The method to send
         *     the outcome.
         */
        hasItem: function hasItem(depot, name, callback) {
          // Checking for item according to the storage detected.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // IndexedDb doesn't have a simple exists method, so looking up
            // item and return boolean if returned.
            LocalDepot._Depot.getItem(depot, name, function(exists) {
              callback((typeof exists !== 'undefined') ? true : false);
            });
          } else if (depot.storageType === LocalDepot.storageType.WEBSQL) {
            console.log('WEBSQL');
          } else if (depot.storageType ===
              LocalDepot.storageType.LOCALSTORAGE) {
            console.log('LOCALSTORAGE');
          } else {
            // TODO (jam@): Add error handling.
          }
        },
        /**
         * Removes an item from the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         * @param {string} name The name of the item.
         * @param {function(boolean)} callback The method to send
         *     the outcome.
         */
        removeItem: function removeItem(depot, name, callback) {
          // Removing item according to the storage detected.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // Opening database to perform operation.
            LocalDepot._Depot.openIndexedDb(depot.name,
                LocalDepot.indexedDbVersion, function(database) {
                  var objectStore, transaction, request;
                  // Creating transaction.
                  transaction = database.transaction([depot.name], 'readwrite');
                  // Reference to object store.
                  objectStore = transaction.objectStore(depot.name);
                  // Making request to delete item.
                  request = objectStore.delete(name);
                  // Success handler, makes callback.
                  request.onsuccess = function(evt) {
                    if (typeof callback === 'function') {
                      callback(true);
                    }
                    // Closing database.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                  // Error handler, makes callback.
                  request.onerror = function(error) {
                    if (typeof callback === 'function') {
                      callback(false);
                    }
                    // Closing database.
                    LocalDepot._Depot.closeIndexedDb(database);
                  };
                }
            );
          } else if (depot.storageType === LocalDepot.storageType.WEBSQL) {
            console.log('WEBSQL');
          } else if (depot.storageType ===
              LocalDepot.storageType.LOCALSTORAGE) {
            console.log('LOCALSTORAGE');
          } else {
            // TODO (jam@): Add error handling.
          }
        },
        /**
         * Removes all items in the Depot.
         * @param {LocalDepot.Depot} depot The Depot to perform action on.
         */
        clear: function clear(depot) {
          // Checking to see what type of storage to clear.
          if (depot.storageType === LocalDepot.storageType.INDEXEDDB) {
            // Opening database to perform operation.
            LocalDepot._Depot.openIndexedDb(depot.name,
                LocalDepot.indexedDbVersion, function(database) {
                  window.indexedDB.deleteDatabase(depot.name);
                  // Closing instance of indexedDb.
                  LocalDepot._Depot.closeIndexedDb(database);
                }
            );
          } else if (depot.storageType === LocalDepot.storageType.WEBSQL) {
            console.log('WEBSQL');
          } else if (depot.storageType ===
              LocalDepot.storageType.LOCALSTORAGE) {
            console.log('LOCALSTORAGE');
          } else {
            // TODO (jam@): Add error handling.
          }
        },
        /**
         * Opens a connection to the IndexedDb specified.
         * @param {string} name The name of the table to open.
         * @param {number} version The version to use when opening.
         * @param {function(IDBDatabase=)} callback The outcome handler.
         */
        openIndexedDb: function openIndexedDb(name, version, callback) {
          // Creating reference to opening the database.
          var request = window.indexedDB.open(name, version);
          // Error handling request.
          request.onerror = function(event) {
            // TODO (jam@): Add error handling.
            callback(null);
          };
          // Handling upgrade of database tables.
          request.onupgradeneeded = function(event) {
            // Creating table if not already present.
            if (!request.result.objectStoreNames.contains(name)) {
              var objectStore = request.result.createObjectStore(name,
                  {keyPath: LocalDepot.DB_INDEXING_KEY});
              objectStore.createIndex(LocalDepot.DB_INDEXING_KEY,
                  LocalDepot.DB_INDEXING_KEY, {unique: true});
            }
          };
          //
          request.onsuccess = function(event) {
            if (typeof callback === 'function') {
              callback(request.result);
            }
          };
        },
        /**
         * Closes the opened indexedDb database.
         * @param {IDBDatabase} database The instance to close.
         */
        closeIndexedDb: function closeIndexedDb(database) {
          if (database && database.close) {
            database.close();
          }
        }
      };
      /**
       * Requests a Depot, checks to see if it exists, and if it exists it
       * returns the already existing, otherwise creates a new one.
       * @param {string} name The name of the Depot.
       * @param {function(LocalDepot.Depot)} onSuccess Success handler.
       * @param {function=} opt_onError Error handler.
       * @return {LocalDepot.Depot} localStorage like handler object of the
       *     data stored in the Depot.
       */
      LocalDepot.requestDepot = function requestDepot(
          name, onSuccess, opt_onError) {
        // Checking for Depot to exists.
        LocalDepot._hasDepot(name, function requestDepotHandler(exists) {
          if (exists) {
            // Calling success method with the existing Depot.
            onSuccess(LocalDepot._getDepot(name));
          } else {
            // Attempting to create Depot since it doesn't exist.
            LocalDepot._createDepot(name, onSuccess, opt_onError);
          }
        });
      };
      /**
       * Checks to see if a Depot exists.
       * @param {string} name The name of the Depot.
       * @param {function(boolean)} callback Check result handler.
       */
      LocalDepot.hasDepot = function hasDepot(name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
          LocalDepot._hasDepot(name, callback);
        } else {
          // TODO (jam@): Dispatch error.
          callback(false);
        }
      };
      /**
       * Deletes a Depot if it exists.
       * @param {string} name The name of the Depot.
       * @param {function(boolean)=} opt_callback Operation result handler.
       */
      LocalDepot.deleteDepot = function deleteDepot(name, opt_callback) {
        if (LocalDepot.deviceStorageType === // Using IndexedDb.
            LocalDepot.storageType.INDEXEDDB) {
          // Making request to delete.
          var request = window.indexedDB.deleteDatabase(name);
          // Success handler.
          request.onsuccess = function() {
            if (typeof opt_callback === 'function') {
              opt_callback(true);
            }
          };
          // Failure handler.
          request.onerror = function() {
            if (typeof opt_callback === 'function') {
              opt_callback(false);
            }
          };
        } else if (LocalDepot.deviceStorageType === // Using WebSQL.
            LocalDepot.storageType.WEBSQL) {
          console.log('WEBSQL');
        } else if (LocalDepot.deviceStorageType === // Using localStorage.
            LocalDepot.storageType.LOCALSTORAGE) {
          console.log('LOCALSTORAGE');
        } else {
          // TODO (jam@): Add error handling.
          console.log('UNSUPPORTED');
        }
      };
      /**
       * Checks for a Depot to exists.
       * @private
       * @param {string} name The name of the Depot.
       * @param {function(boolean)} callback Check result handler.
       */
      LocalDepot._hasDepot = function _hasDepot(name, callback) {
        if (LocalDepot.deviceStorageType === // Using IndexedDb.
            LocalDepot.storageType.INDEXEDDB) {
          // Since there is no method to check if database exists in all
          // browsers, attempting to open database as a hack check.
          var request = window.indexedDB.open(name);
          // Preventing the database from being created if doesn't exists.
          request.onupgradeneeded = function(e) {
            e.target.transaction.abort();
          };
          // Database exists.
          request.onsuccess = function() {
            if (typeof callback === 'function') {
              // Closing instance of indexedDb.
              LocalDepot._Depot.closeIndexedDb(request);
              callback(true);
            }
          };
          // Database doesn't exissts.
          request.onerror = function() {
            if (typeof callback === 'function') {
              // Closing instance of indexedDb.
              LocalDepot._Depot.closeIndexedDb(request);
              callback(false);
            }
          };
        } else if (LocalDepot.deviceStorageType === // Using WebSQL.
            LocalDepot.storageType.WEBSQL) {
          console.log('WEBSQL');
        } else if (LocalDepot.deviceStorageType === // Using localStorage.
            LocalDepot.storageType.LOCALSTORAGE) {
          console.log('LOCALSTORAGE');
        } else {
          // TODO (jam@): Add error handling.
          console.log('UNSUPPORTED');
        }
      };
      /**
       * Gets a Depot and returns a localStorage like interface to handle
       * the data stored in the Depot.
       * @private
       * @param {string} name The name of the Depot.
       * @return {LocalDepot.Depot} localStorage like handler object of the
       *     data stored in the Depot.
       */
      LocalDepot._getDepot = function _getDepot(name) {
        return new LocalDepot.Depot(name,
            LocalDepot.deviceStorageType);
      };
      /**
       * Creates a Depot locally.
       * @private
       * @param {string} name The name of the Depot.
       * @param {function(LocalDepot.Depot)} onSuccess Success handler.
       * @param {function=} opt_onError Error handler.
       * @return {boolean} Whether the Depot was created.
       */
      LocalDepot._createDepot = function _createDepot(
          name, onSuccess, opt_onError) {
        // Creating the storage based on capability and order of preference.
        if (LocalDepot.deviceStorageType === // Using IndexedDb.
            LocalDepot.storageType.INDEXEDDB) {
          LocalDepot._createIndexedDbInstance(name, onSuccess, opt_onError);
        } else if (LocalDepot.deviceStorageType === // Using WebSQL.
            LocalDepot.storageType.WEBSQL) {
          console.log('WEBSQL');
        } else if (LocalDepot.deviceStorageType === // Using localStorage.
            LocalDepot.storageType.LOCALSTORAGE) {
          console.log('LOCALSTORAGE');
        } else {
          // TODO (jam@): Add error handling.
          console.log('UNSUPPORTED');
        }
      };
      /**
       * Creates an IndexedDb instance with the given name.
       * @private
       * @param {string} name The name of the table to create.
       * @param {function(LocalDepot.Depot)} onSuccess Success handler.
       * @param {function=} opt_onError Error handler.
       */
      LocalDepot._createIndexedDbInstance = function _createIndexedDbInstance(
          name, onSuccess, opt_onError) {
        // Creating reference to opening the database.
        var request = window.indexedDB.open(name, LocalDepot.indexedDbVersion);
        // Error handling request.
        request.onerror = function(event) {
          // Sending error notification to requesting handler.
          if (typeof opt_onError === 'function') {
            // TODO (jam@): Improve error messaging.
            opt_onError(event);
          }
          // Sending error notification to global handler.
          if (typeof LocalDepot.onError === 'function') {
            // TODO (jam@): Improve error messaging.
            LocalDepot.onError(event);
          }
        };
        // Handling upgrade of database tables.
        request.onupgradeneeded = function(event) {
          // Creating table if not already present.
          if (!request.result.objectStoreNames.contains(name)) {
            // Creating database.
            var objectStore = request.result.createObjectStore(name,
                {keyPath: LocalDepot.DB_INDEXING_KEY});
            // Creating indexing lookup.
            objectStore.createIndex(LocalDepot.DB_INDEXING_KEY,
                LocalDepot.DB_INDEXING_KEY, {unique: true});
          }
        };
        // Handling success.
        request.onsuccess = function(event) {
          // Sending created with the Depot for handling.
          if (typeof onSuccess === 'function') {
            onSuccess(new LocalDepot.Depot(name,
                LocalDepot.storageType.INDEXEDDB));
            LocalDepot._Depot.closeIndexedDb(request.result);
          }
        };
      };
      /**
       * Determines the storage type supported by the browser.
       * @private
       * @return {LocalDepot.storageType} One of the storageType values.
       */
      LocalDepot._getStorageSupportedByBrowser =
          function _getStorageSupportedByBrowser() {
        var storageType;
        // IndexedDB is the preferred method.
        if (window.indexedDB !== undefined) {
          storageType = LocalDepot.storageType.INDEXEDDB;
        } else if (window.openDatabase) {
          // Fallback support for Safari.
          storageType = LocalDepot.storageType.WEBSQL;
        } else if ('localStorage' in window) {
          // Fallback support for IE 9, and others.
          storageType = LocalDepot.storageType.LOCALSTORAGE;
        }
        return storageType;
      };
      /**
       * Initilization method of the library.
       * @private
       */
      LocalDepot._init = function _init() {
        LocalDepot.deviceStorageType =
            LocalDepot._getStorageSupportedByBrowser();
      };
      // Initializing the LocalDepot library.
      LocalDepot._init();
    }
  }());
}
