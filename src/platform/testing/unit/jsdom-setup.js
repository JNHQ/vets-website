import { JSDOM } from 'jsdom';
import '../../site-wide/moment-setup';
import sinon from 'sinon';

require('es6-promise').polyfill();

import 'isomorphic-fetch';

global.__BUILDTYPE__ = process.env.BUILDTYPE || 'localhost';
global.__ALL_CLAIMS_ENABLED__ =
  global.__BUILDTYPE__ === 'localhost' ||
  process.env.ALL_CLAIMS_ENABLED === 'true';

/**
 * Sets up JSDom in the testing environment. Allows testing of DOM functions without a browser.
 */
export default function setupJSDom() {
  // if (global.document || global.window) {
  //   throw new Error('Refusing to override existing document and window.');
  // }

  // setup the simplest document possible
  const dom = new JSDOM('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  const win = dom.window;

  global.dom = dom;
  global.document = win.document;
  global.window = win;

  win.VetsGov = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  win.Forms = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  win.dataLayer = [];
  win.scrollTo = () => {};
  win.sessionStorage = {};
  win.settings = {};
  win.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  win.requestAnimationFrame = func => func();

  global.Blob = window.Blob;
  global.window.location.replace = sinon.spy();
  global.open = sinon.spy(); // Source: https://stackoverflow.com/a/41888736

  // from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
  function propagateToGlobal(window) {
    /* eslint-disable */
    for (const key in window) {
      if (!window.hasOwnProperty(key)) continue;
      if (key in global) continue;

      global[key] = window[key];
    }
    /* eslint-enable */

    // Mock fetch
    // This was causing some tests to fail, so we'll have to loop back around to it later
    // global.fetch = sinon.stub();
  }

  propagateToGlobal(win);
}

setupJSDom();
