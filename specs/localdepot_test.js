/* Globals exposed by Jasmine*/
/* global jasmine, describe, it, expect, afterEach, beforeEach, spyOn */
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

    describe('LocalDepot.Depot.getItem', function() {
      it('should try to getItem via interface', function() {
        spyOn(LocalDepot._Depot, 'getItem');

        test.getItem('test', callback);

        expect(LocalDepot._Depot.getItem).toHaveBeenCalledWith(
            test, 'test', callback);
      });
    });

    describe('LocalDepot.Depot.getKeys', function() {
      it('should try to getKeys via interface', function() {
        spyOn(LocalDepot._Depot, 'getKeys');

        test.getKeys(callback);

        expect(LocalDepot._Depot.getKeys).toHaveBeenCalledWith(test, callback);
      });
    });

    describe('LocalDepot.Depot.setItem', function() {
      it('should try to setItem via interface', function() {
        spyOn(LocalDepot._Depot, 'setItem');

        test.setItem('test', 'value', callback);

        expect(LocalDepot._Depot.setItem).toHaveBeenCalledWith(
            test, 'test', 'value', callback);
      });
    });

    describe('LocalDepot.Depot.hasItem', function() {
      it('should try to check hasItem via interface', function() {
        spyOn(LocalDepot._Depot, 'hasItem');

        test.hasItem('test', callback);

        expect(LocalDepot._Depot.hasItem).toHaveBeenCalledWith(
            test, 'test', callback);
      });
    });

    describe('LocalDepot.Depot.removeItem', function() {
      it('should try to removeItem via interface', function() {
        spyOn(LocalDepot._Depot, 'removeItem');

        test.removeItem('test', callback);

        expect(LocalDepot._Depot.removeItem).toHaveBeenCalledWith(
            test, 'test', callback);
      });
    });

    describe('LocalDepot.Depot.clear', function() {
      it('should try to clear Depot via interface', function() {
        spyOn(LocalDepot._Depot, 'clear');

        test.clear();

        expect(LocalDepot._Depot.clear).toHaveBeenCalledWith(test);
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

    describe('LocalDepot._Depot.getItem', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.getKeys', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.setItem', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.hasItem', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.removeItem', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.clear', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.openIndexedDb', function() {
      it('should ', function() {
      });
    });

    describe('LocalDepot._Depot.closeIndexedDb', function() {
      it('should ', function() {
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
    /*
expect(LocalDepot.deviceStorageType).toBe(
    LocalDepot.storageType.INDEXEDDB);
    expect(LocalDepot.deviceStorageType).toBe(
    LocalDepot.storageType.WEBSQL);
    expect(LocalDepot.deviceStorageType).toBe(
    LocalDepot.storageType.LOCALSTORAGE);
    expect(LocalDepot.deviceStorageType).toBe(
    undefined);
    */

    //var agent = navigator.userAgent.toLowerCase();
    //agent.indexOf('chrome') > -1
    //agent.indexOf('firefox') > -1
    //agent.indexOf('msie') > -1
    //agent.indexOf('safari') > -1

  });

});
