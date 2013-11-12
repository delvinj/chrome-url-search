// :noTabs=false:mode=javascript:tabSize=2:indentSize=2:folding=indent:

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
	
	var items = [];
	var filter = false; 
	var visible = false;
	
	Object.defineProperties(this, {
		
		"items": {
			enumerable: true,
			
			// computes the visible (non-filtered) items on-demand.
			// returns a copy of the data, so feel free to modify it
			get: function() {
				if (visible) 
					return [].concat(visible);
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
		
		// Items that match the filter string are shown. All others are hidden.
		// Set to null or false to show all items.
		"filter": {
			enumerable: true,
			get: function() { return filter; },
			set: function(str) {
				visible = false;
				filter = str;
			}
		},
		
		"load": {
			enumerable: true,
			// Load history elements from chrome.
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

