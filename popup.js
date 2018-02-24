
// popup.js
let historyItems = [];

/* visible item limit */
const VISIBLE_ITEM_LIMIT = 800;

window.addEventListener("load", function() {
	
	let filterTxt = document.getElementById("filter")
		, templateItem = document.getElementById("listitem-template")
		, timerId = -1;
		
	// remove the template item from the DOM 
	templateItem.removeAttribute("id");
	templateItem.parentNode.removeChild(templateItem);
		
	// Pressing ESCAPE will first clear the filter before
	// closing the window.
	window.addEventListener("keydown", function(ev) {
		if (ev.keyCode == 68 && ev.altKey) {
			// alt-d: toggle display mode.
			ev.preventDefault();
		} else if (ev.keyCode == keyCode.ESCAPE) {
			if (filterTxt.value) {
				// first press: clear the filter.
				ev.preventDefault();
				filterTxt.value = "";
				update();
				return false;
			}
			// second press: close the popup (chrome closes it automatically so no need for window.close).
			return true;
		}
	});
	
	// @todo
	function move(command) {
		let focusedElement = document.querySelector("*:focus");
		console.info(focusedElement);
		switch (command) {
			case keyCode.PAGE_DOWN:
				break;
			case keyCode.PAGE_UP:
				break;
			case keyCode.UP:
				break;
			case keyCode.DOWN:
				break;
		}
	}
	
	/* input field key listener. moves list selection on up/down keys, otherwise resets the filter timer. */
	filterTxt.addEventListener("keydown", function(ev) {
		switch (ev.keyCode) {
			case keyCode.PAGE_DOWN:
			case keyCode.PAGE_UP:
			case keyCode.UP:
			case keyCode.DOWN:
				ev.preventDefault();
				move(ev.keyCode);
				return;
		}
		clearTimeout(timerId);
		timerId = setTimeout(update, 400);
	});
	
	function itemClicked(e) {
		e.preventDefault();
		
		let t = e.target;
		
		// find the parent list item.
		if (t.nodeName == "SPAN") {
			t = t.parentNode.parentNode;
		} else if (t.nodeName == "A") {
			t = t.parentNode;
		}
		
		let url = t.getAttribute("data-url");
		
		chrome.tabs.create({ url:url }, function() {
			console.info(arguments);
		});
	}
	
	//
	// trim whitespace
	function trim(s) {
		return String(s).replace(/(^\s+|\s+$)/g,"");
	}
	
	// 
	// |val| is already trimmed and lowercase
	function stringFilter(val, key) {
		return function(item) {
			if (key) {
				return String(item[key]).toLowerCase().indexOf(val) !== -1;
			}
			return String(item).toLowerCase().indexOf(val) !== -1;
		};
	}
	
	//
	// return items filtered by input value.
	function applyFilter() {
		//
		// filter value string
		let val = trim(filterTxt.value);
		
		//
		// empty string
		if (!val) {
			return historyItems;
		}
		
		//
		// todo: also include title matches?
		val = val.toLowerCase();
		
		//
		// support multiple search "clauses" separated by '+'.
		if (val.indexOf('+') !== -1) {
			//
			// clauses are separated by '+'; empty clauses have no effect.
			let parts = val.split(/\+/).map(trim).filter(trim);
			let items = historyItems;
			for (let j=0; j < parts.length; ++j) {
				items = items.filter(stringFilter(parts[j], "url"));
				if (items.length === 0) {
					return [];
				}
			}
			return items;
		}
		
		//
		// simple search against a single term.
		return historyItems.filter(stringFilter(val, "url"));
	}
	
	// build listview contents
	function update() {
		// get filtered list of urls
		let arr = applyFilter();
		let len = arr.length;
		
		// build the list as a fragment for possibly slight performance gain
		let frag = document.createDocumentFragment();
		
		console.info(arr.slice(0,5));
		
		for (let j=0; j < len; ++j) {
			// configure the list item
			let item = templateItem.cloneNode(true);
			item.setAttribute("title", arr[j].title);
			item.setAttribute("data-url", arr[j].url);
			item.setAttribute("data-entryid", arr[j].id);
			item.querySelector("span.url").innerHTML = arr[j].url;
			item.querySelector("span.date").innerHTML = new Date(arr[j].lastVisitTime).toLocaleString();
			item.onclick = itemClicked;
			frag.appendChild(item);
			if (j >= VISIBLE_ITEM_LIMIT) {
				// configure the "more items..." element
				var info = document.createElement("h3");
				info.innerHTML = "<em>" + len + " matches...</em>";
				item = templateItem.cloneNode(true);
				item.appendChild(info);
				frag.appendChild(item);
				break;
			}
		}
		var lv = document.querySelector("#listview");
		lv.innerHTML = null;
		lv.appendChild(frag);
	}
	
	const millisPerYear = 3.15360e+10;
	let now = Date.now();
	
	chrome.history.search({
		maxResults: 0,
		startTime: (now - (millisPerYear * 2)),
		endTime: now,
		text: ""
	}, function(arr) {
		historyItems = arr;
		update();
	});
	
	// initial UI state
	filterTxt.focus();
});

