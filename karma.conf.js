/* global module */
// karma.conf.js
module.exports = function(config) {
  config.set({
    // global config of your BrowserStack account
    browserStack: {
      username: 'developers+browserstack@tradeshift.com',
      accessKey: 'xQqKme1qpzznhmB7RzwJ'
    },

    // define browsers
    customLaunchers: {
      // Desktop Browsers --------------------------------------------
      
      // Internet Explorer.
      bs_ie_11: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '8.1'
      },
      bs_ie_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '8'
      },
      bs_ie_9: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      
      // Firefox.
      bs_firefox_win: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '27.0',
        os: 'Windows',
        os_version: '8'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '27.0',
        os: 'OS X',
        os_version: 'Mavericks'
      },
      
      // Chrome.
      bs_chrome_win: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '32.0',
        os: 'Windows',
        os_version: '8'
      },
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '32.0',
        os: 'OS X',
        os_version: 'Mavericks'
      },
      
      // Safari.
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '7.0',
        os: 'OS X',
        os_version: 'Mavericks'
      },
      
      // Mobile Browsers --------------------------------------------
      
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '7.0'
      }
    }
  });
};