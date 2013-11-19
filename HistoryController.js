// :noTabs=true:mode=javascript:tabSize=2:indentSize=2:folding=indent:

var millisPerYear = 31536000000;

/**
 * Chrome history entries. Usage:
 *
 *  var hc = new HistoryController();
 * 	hc.load(mycallback);
 * 	hc.filter = "some string";
 * 	hc.items; // array of filtered items
 */
function HistoryController() {
	"use strict";
	
	// private state
	var items = [];
	var filter = false; 
	var visible = false;
	
	Object.defineProperties(this, {
    /**
     * Computes the visible items. An item is visible if it matches
     * the filter, or if the filter is null.
     */
		"items": {
			enumerable: true,
			configurable: false,
			get: function() {
				if (visible) {
					return [].concat(visible);
				}
				if (filter) {
					// filtered copy
					visible = items.filter(function(i) {
						return i.url.toLowerCase().indexOf(filter.toLowerCase()) != -1;
					});
				} else {
					// straight up copy
					visible = [].concat(items);
				}
				return [].concat(visible);
			}
		},
		/**
     * Filter for calculating visible items. Set to null to show all.
     */
		"filter": {
			enumerable: true,
			configurable: false,
			get: function() { return filter; },
			set: function(str) {
				visible = false;
				filter = str;
			}
		},
		/**
     * One-time dataset load.
     */
		"load": {
			enumerable: true,
			configurable: false,
			value: function(oncomplete) {
				var self = this;
				chrome.history.search({
					"text": "",
					"maxResults": 0,
					"startTime": (Date.now() - (millisPerYear * 2)),
					"endTime": Date.now()
				}, function(arr) {
					visible = filter = undefined;
					items = arr;
					if (oncomplete) {
						oncomplete.call(self);
					}
				});
			}
		}
	});
}

