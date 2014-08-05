
var callback    = require('callback');
var integration = require('analytics.js-integration');
var load        = require('load-script');
var push        = require('global-queue')('_attrq');

var user;

/**
 * Expose plugin.
 */

module.exports = exports = function(analytics){
  analytics.addIntegration(Attribution);
  user = analytics.user();
};

/**
 * Expose `Attribution IO` integration.
 */

var Attribution = exports.Integration = integration('Attribution')
  .readyOnInitialize()
  .global('_attrq')
  .option('projectId', '')

/**
 * Initialize.
 *
 */

Attribution.prototype.initialize = function(){
  window.Attribution = window.Attribution || {};
  window.Attribution.projectId = this.options.projectId;
  this.load();
};

/**
 * Load the Attribution library.
 *
 * @param {Function} callback
 */

Attribution.prototype.load = function(callback){
  load('//localhost:9292/attribution.js', callback);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Attribution.prototype.page = function(page){
  this.track(page.track());
};

/**
 * Track.
 *
 * @param {Track} track
 */

Attribution.prototype.track = function(track) {
  if(user)
    track.user_id = user.id();
  push('track', track);
}

/**
 * Identify.
 *
 * @param {Identify} identify
 */

Attribution.prototype.identify = function(identify){
  var traits = identify.traits();
  var id = identify.userId();
  if (id) push('identify', {user_id: id});
};
