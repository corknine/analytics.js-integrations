
var integration = require('analytics.js-integration');
var push        = require('global-queue')('_attrq');

var user;

/**
 * Expose `Attribution IO` integration.
 */

var Attribution = module.exports = integration('Attribution')
  .global('_attrq')
  .option('projectId', '')
  .tag('attr', '<script src="//localhost:8080/attribution.js">');

/**
 * Initialize.
 *
 */

Attribution.prototype.initialize = function(){
  window._attrq = window._attrq || [];
  window.Attribution = window.Attribution || {};
  window.Attribution.projectId = this.options.projectId;
  this.load(this.ready);
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
  if (traits) push('set', {user_id: id, traits: traits});
};
