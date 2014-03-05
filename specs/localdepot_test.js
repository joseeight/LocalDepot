/* Globals exposed by Jasmine*/
/* global jasmine, describe, it, expect, afterEach, beforeEach, spyOn,
   waitsFor, runs, alert */
/* Globals exposed by LocalDepot*/
/* global LocalDepot */
describe('LocalDepot', function() {

  it('should be defined', function() {
    expect(window.LocalDepot).toBeDefined();
    expect(LocalDepot.DB_INDEXING_KEY).toBe('item');
    expect(typeof LocalDepot.storageType).toBe('object');
    expect(LocalDepot.storageType.INDEXEDDB).toBe('indexeddb');
    expect(LocalDepot.storageType.WEBSQL).toBe('websql');
    expect(LocalDepot.storageType.LOCALSTORAGE).toBe('localstorage');
  });

  describe('LocalDepot.Depot', function() {
    var test, callback;

    beforeEach(function() {
      test = new LocalDepot.Depot(
          'test', LocalDepot.deviceStorageType);
      callback = function() {};
    });

    afterEach(function() {
      test = null;
      callback = null;
    });

    it('should have valid structure', function() {
      expect(test.constructor).toBe(LocalDepot.Depot);
      expect(test.name).toBe('test');
      expect(test.storageType).toBe(LocalDepot.deviceStorageType);
      expect(typeof test.getItem).toBe('function');
      expect(test.getItem.length).toBe(2);
      expect(typeof test.getKeys).toBe('function');
      expect(test.getKeys.length).toBe(1);
      expect(typeof test.setItem).toBe('function');
      expect(test.setItem.length).toBe(3);
      expect(typeof test.hasItem).toBe('function');
      expect(test.hasItem.length).toBe(2);
      expect(typeof test.removeItem).toBe('function');
      expect(test.removeItem.length).toBe(2);
      expect(typeof test.clear).toBe('function');
      expect(test.clear.length).toBe(0);
    });

    describe('interface', function() {
      describe('getItem', function() {
        it('should try to getItem', function() {
          spyOn(LocalDepot._Depot, 'getItem');

          test.getItem('test', callback);

          expect(LocalDepot._Depot.getItem).toHaveBeenCalledWith(
              test, 'test', callback);
        });
      });

      describe('getKeys', function() {
        it('should try to getKeys', function() {
          spyOn(LocalDepot._Depot, 'getKeys');

          test.getKeys(callback);

          expect(LocalDepot._Depot.getKeys).toHaveBeenCalledWith(
              test, callback);
        });
      });

      describe('setItem', function() {
        it('should try to setItem', function() {
          spyOn(LocalDepot._Depot, 'setItem');

          test.setItem('test', 'value', callback);

          expect(LocalDepot._Depot.setItem).toHaveBeenCalledWith(
              test, 'test', 'value', callback);
        });
      });

      describe('hasItem', function() {
        it('should try to check hasItem', function() {
          spyOn(LocalDepot._Depot, 'hasItem');

          test.hasItem('test', callback);

          expect(LocalDepot._Depot.hasItem).toHaveBeenCalledWith(
              test, 'test', callback);
        });
      });

      describe('removeItem', function() {
        it('should try to removeItem', function() {
          spyOn(LocalDepot._Depot, 'removeItem');

          test.removeItem('test', callback);

          expect(LocalDepot._Depot.removeItem).toHaveBeenCalledWith(
              test, 'test', callback);
        });
      });

      describe('clear', function() {
        it('should try to clear Depot', function() {
          spyOn(LocalDepot._Depot, 'clear');

          test.clear();

          expect(LocalDepot._Depot.clear).toHaveBeenCalledWith(test);
        });
      });
    });
  });

  describe('LocalDepot._Depot', function() {

    it('should have valid structure', function() {
      expect(typeof LocalDepot._Depot.getItem).toBe('function');
      expect(LocalDepot._Depot.getItem.length).toBe(3);
      expect(typeof LocalDepot._Depot.getKeys).toBe('function');
      expect(LocalDepot._Depot.getKeys.length).toBe(2);
      expect(typeof LocalDepot._Depot.setItem).toBe('function');
      expect(LocalDepot._Depot.setItem.length).toBe(4);
      expect(typeof LocalDepot._Depot.hasItem).toBe('function');
      expect(LocalDepot._Depot.hasItem.length).toBe(3);
      expect(typeof LocalDepot._Depot.removeItem).toBe('function');
      expect(LocalDepot._Depot.removeItem.length).toBe(3);
      expect(typeof LocalDepot._Depot.clear).toBe('function');
      expect(LocalDepot._Depot.clear.length).toBe(1);
      expect(typeof LocalDepot._Depot.openIndexedDb).toBe('function');
      expect(LocalDepot._Depot.openIndexedDb.length).toBe(3);
      expect(typeof LocalDepot._Depot.closeIndexedDb).toBe('function');
      expect(LocalDepot._Depot.closeIndexedDb.length).toBe(1);
    });

    describe('method', function() {
      var depot;

      beforeEach(function() {
        depot = new LocalDepot.Depot('test',
            LocalDepot.storageType.INDEXEDDB);
      });

      afterEach(function() {
        depot = null;
      });

      describe('getItem', function() {
        it('should use INDEXEDDB and work', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, test, success = 'win', request = {};

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  callback({
                    transaction: function(name) {
                      return {
                        objectStore: function(name) {
                          return {
                            get: function(name) {
                              return (done = true) ? request : null;
                            }
                          };
                        }
                      };
                    }
                  });
                });

            depot.getItem('item', function(result) {
              test = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);

            runs(function() {
              request.onsuccess({target: {result: {data: 'win'}}});
              expect(test).toBe(success);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        it('should use INDEXEDDB and fail', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, test = 'error', success = 'win', request = {};

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  callback({
                    transaction: function(name) {
                      return {
                        objectStore: function(name) {
                          return {
                            get: function(name) {
                              return (done = true) ? request : null;
                            }
                          };
                        }
                      };
                    }
                  });
                });

            depot.getItem('item', function(result) {
              test = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);

            runs(function() {
              request.onerror('error');
              expect(test).toBe(undefined);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('getKeys', function() {
        it('should use INDEXEDDB and work', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, test, success = 'win', dbCursor = {};

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  callback({
                    transaction: function(name) {
                      return {
                        objectStore: function(name) {
                          return {
                            openCursor: function() {
                              return (done = true) ? dbCursor : null;
                            }
                          };
                        }
                      };
                    }
                  });
                });

            depot.getKeys(function(result) {
              test = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);
            // TODO (jam@): Improve test to include data.
            runs(function() {
              dbCursor.onsuccess({target: {result: null}});
              expect(test).toEqual([]);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        it('should use INDEXEDDB and fail', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, test, success = 'win', dbCursor = {};

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  callback({
                    transaction: function(name) {
                      return {
                        objectStore: function(name) {
                          return {
                            openCursor: function() {
                              return (done = true) ? dbCursor : null;
                            }
                          };
                        }
                      };
                    }
                  });
                });

            depot.getKeys(function(result) {
              test = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);
            // TODO (jam@): Improve test to include data.
            runs(function() {
              dbCursor.onerror('error');
              expect(test).toEqual([]);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('setItem', function() {
        it('should use INDEXEDDB and work', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, success, request = {}, objStore, transaction;

            objStore = {
              put: function(item) {
                return request;
              }
            };

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  transaction = {
                    objectStore: function(name) {
                      return (done = true) ? objStore : null;
                    }
                  };
                  callback({
                    transaction: function(name, opts) {
                      return transaction;
                    }
                  });
                });

            depot.setItem('item', 'value', function(result) {
              success = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);

            runs(function() {
              transaction.oncomplete({});
              expect(success).toBe(true);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        it('should use INDEXEDDB and fail', function() {
          // Test per storage type.
          if (LocalDepot.deviceStorageType ===
              LocalDepot.storageType.INDEXEDDB) {
            var done, success, request = {}, objStore, transaction;

            objStore = {
              put: function(item) {
                return request;
              }
            };

            spyOn(LocalDepot._Depot, 'closeIndexedDb');
            // TODO (jam@): Move to mock.
            spyOn(LocalDepot._Depot, 'openIndexedDb').andCallFake(function(
                name, version, callback) {
                  transaction = {
                    objectStore: function(name) {
                      return (done = true) ? objStore : null;
                    }
                  };
                  callback({
                    transaction: function(name, opts) {
                      return transaction;
                    }
                  });
                });

            depot.setItem('item', 'value', function(result) {
              success = result;
            });

            waitsFor(function() {
              return done;
            }, 'waiting for async', 1000);

            runs(function() {
              transaction.onerror({});
              expect(success).toBe(false);
              expect(LocalDepot._Depot.closeIndexedDb).toHaveBeenCalled();
            });

          }
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('hasItem', function() {
        it('should use INDEXEDDB and work', function() {
          var test, done;
          spyOn(LocalDepot._Depot, 'getItem').andCallFake(function(
              dp, nm, cb) {
                // This makes sure that even null is a valid data store.
                cb(null);
                done = true;
              });

          depot.hasItem('name', function(result) {
            test = result;
          });

          waitsFor(function() {
            return done;
          }, 'waiting for async', 1000);

          runs(function() {
            expect(test).toBe(true);
            expect(LocalDepot._Depot.getItem).toHaveBeenCalledWith(
                depot, 'name', jasmine.any(Function));
          });
        });
        it('should use INDEXEDDB and fail', function() {
          var test, done;
          spyOn(LocalDepot._Depot, 'getItem').andCallFake(function(
              dp, nm, cb) {
                cb(undefined);
                done = true;
              });

          depot.hasItem('name', function(result) {
            test = result;
          });

          waitsFor(function() {
            return done;
          }, 'waiting for async', 1000);

          runs(function() {
            expect(test).toBe(false);
            expect(LocalDepot._Depot.getItem).toHaveBeenCalledWith(
                depot, 'name', jasmine.any(Function));
          });
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('removeItem', function() {
        it('should ', function() {
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('clear', function() {
        it('should ', function() {
        });
        // TODO (jam@): Add tests for WebSQL and localStorage.
      });

      describe('openIndexedDb', function() {
        it('should ', function() {
        });
      });

      describe('closeIndexedDb', function() {
        it('should ', function() {
        });
      });
    });

  });

  describe('LocalDepot.requestDepot', function() {
    it('should have valid structure', function() {
      expect(typeof LocalDepot.requestDepot).toBe('function');
      expect(LocalDepot._Depot.getItem.length).toBe(3);
    });
  });

  describe('LocalDepot.hasDepot', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot.deleteDepot', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot._hasDepot', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot._getDepot', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot._createDepot', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot._createIndexedDbInstance', function() {
    it('should ', function() {
    });
  });

  describe('LocalDepot._getStorageSupportedByBrowser', function() {
    var agent = navigator.userAgent.toLowerCase();
    it('should detect storage based on browser expectations', function() {
      if (agent.indexOf('chrome') > -1 || agent.indexOf('firefox') > -1) {
        expect(LocalDepot.deviceStorageType).toBe(
            LocalDepot.storageType.INDEXEDDB);
      } else if (agent.indexOf('safari') > -1) {
        expect(LocalDepot.deviceStorageType).toBe(
            LocalDepot.storageType.WEBSQL);
      } else if (agent.indexOf('msie') > -1 ||
          agent.indexOf('trident') > -1) {
        if (agent.indexOf('msie 9.0') > -1) {
          expect(LocalDepot.deviceStorageType).toBe(
              LocalDepot.storageType.LOCALSTORAGE);
        } else {
          expect(LocalDepot.deviceStorageType).toBe(
              LocalDepot.storageType.INDEXEDDB);
        }
      }
    });
  });

});
