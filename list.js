// :noTabs=false:mode=javascript:tabSize=5:indentSize=5:folding=indent:

(function() {
	"use strict";

	var input, historyController;
	
	/*var updateView = function() {
		var frag = document.createDocumentFragment();
		var opt = document.createElement("option");
		
		this.items.forEach(function(i) {
			var item = document.createElement("option");
			item.text = i.url;
			item._hit = i;
			frag.appendChild(item);
		});
		
		document.querySelector("#item-list").innerHTML = null;
		document.querySelector("#item-list").appendChild(frag);
	};*/
	
	var updateView = function() {
		var items = this.items;
		var len = items.length;
		
		var frag = document.createDocumentFragment();
		
		for (var j=0; j < len; ++j) {
			
			var item = document.createElement("div");
			item.setAttribute("role", "listitem");
			
			var anchor = item.appendChild(document.createElement("a"));
			anchor.href = items[j].url;
			
			var heading = anchor.appendChild(document.createElement("h3"));
			heading.innerHTML = items[j].url;
			
			var detail = anchor.appendChild(document.createElement("p"));
			detail.innerHTML = items[j].title + "<br />" + items[j].lastVisitTime;
			
			frag.appendChild(item);
			
			if (j >= 50) {
				break;
			}
		}
		
		var list = document.querySelector("#data-slide > list");
		list.innerHTML = null;
		list.appendChild(frag);
	};
	
	function initFilter() {
		var timerId = 0;
		
		var timerAction = function() {
			historyController.filter = input.value;
			updateView.call(historyController);
		};
		
		var resetTimer = function() {
			clearTimeout(timerId);
			timerId = setTimeout(timerAction, 300);
		};
		
		var keydown = function(ev) {
			if (ev.keyCode === keyCode.DOWN) {
				ev.preventDefault();
			} else if (ev.keyCode === keyCode.UP) {
				ev.preventDefault();
			} else if (ev.keyCode === keyCode.TAB) {
				ev.preventDefault();
			} else {
				resetTimer();
			}
		};
		input.addEventListener("keydown", keydown, false);
		input.focus();
	};
	
	var escapeHook = function(ev) {
		if (ev.keyCode === keyCode.ESCAPE) {
			if (input.value != "") {
				input.value = "";
				input.focus();
				ev.preventDefault();
			}
		}
	};
	
	window.addEventListener("load", function() {
		var handlers = {
			mousedown: function(ev) {
				ev.preventDefault();
			},
			click: function(ev) {
				ev.preventDefault();
				
				var target = ev.target;
				if (target.nodeName == "DIV") {
					target = target.querySelector("a");
				} else {
					while (target && target.nodeName != "A") {
						target = target.parentNode;
					}
				}
				if (target) {
					chrome.tabs.query({
						active: true,
						windowType: "normal",
						lastFocusedWindow: true
					}, function(tabs) { 
						var tab = tabs[0];
						if (tab) {
							chrome.tabs.update(tab.id, {
								url: target.href
							});
							window.close();
						}
					});
				}
			},
			mouseup: function(ev) {
				ev.preventDefault();
			},
		};
		
		Object.keys(handlers).forEach(function(item) {
			document.addEventListener(item, handlers[item], false);
		});
		
		document.addEventListener("filterChanged", function(ev) {
			(window.console && console.debug && console.debug("filterChanged", ev));
		}, false);
		
		input = document.querySelector("#q");
		document.body.addEventListener("keydown", escapeHook, false);
		
		initFilter();
		
		historyController = new HistoryController();
		historyController.load(updateView);
	
		window.historyController = historyController;
	});

})();

