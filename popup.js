
// popup.js
var historyItems = [];

// maximum list size
var ITEM_LIMIT = 800;

window.addEventListener("load", function() {
  
  var filterTxt = document.getElementById("filter")
    , templateItm = document.getElementById("listitem-template")
    , timerId = -1;
    
  // remove the template item from the DOM 
  templateItm.removeAttribute("id");
  templateItm.parentNode.removeChild(templateItm);
    
  // Pressing ESCAPE will first clear the filter before
  // closing the window.
  window.addEventListener("keydown", function(ev) {
    if (ev.keyCode == 68 && ev.altKey) {
      // alt-d: toggle display mode
      ev.preventDefault();
      return false;
    }
    if (ev.keyCode == 27) {
      // clear filter text on first escape
      if (filterTxt.value) {
        ev.preventDefault();
        filterTxt.value = "";
        update();
        return false;
      }
      return true;
    }
  });
  
  // @todo
  function move(command) {
    var focusedElement = document.querySelector("*:focus");
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
  
  filterTxt.addEventListener("keydown", function(ev) {
    switch (ev.keyCode) {
      case keyCode.PAGE_DOWN:
      case keyCode.PAGE_UP:
      case keyCode.UP:
      case keyCode.DOWN:
        ev.preventDefault();
        return move(ev.keyCode);
    }
    clearTimeout(timerId);
    timerId = setTimeout(update, 400);
  });
  
  // filter typing timer
  function itemclick(e) {
    e.preventDefault();
    
    var t = e.target;
    
    if (t.nodeName == "SPAN") {
      t = t.parentNode.parentNode;
    } else if (t.nodeName == "A") { 
      t = t.parentNode;
    }
    
    var url = t.getAttribute("data-url");
    
    chrome.tabs.create({ url:url }, function() {
      console.info(arguments);
    });
  }
  
  // return filtered array of history items
  function applyFilter() {
    var val = filterTxt.value;
    if (!val.replace(/\s+/g, "")) {
      return historyItems;
    } else {
      // todo: also include title matches?
      val = filterTxt.value.toLowerCase();
      return historyItems.filter(
        function(i) {
          return i.url.toLowerCase().indexOf(val) != -1;
        }
      );
    }
  }
  
  // build listview contents
  function update() {
    var arr = applyFilter();
    var len = arr.length;
    var frag = document.createDocumentFragment();
    
    // console.info(arr);
    for (var j=0; j < len; ++j) {
      var item = templateItm.cloneNode(true);
      item.setAttribute("title", arr[j].title);
      item.setAttribute("data-url", arr[j].url);
      item.setAttribute("data-entryid", arr[j].id);
      item.querySelector("span.url").innerHTML = arr[j].url;
      item.onclick = itemclick;
      frag.appendChild(item);
      if (j >= ITEM_LIMIT) {
        var info = document.createElement("h3");
        info.innerHTML = "<em>" + len + " matches...</em>";
        item = templateItm.cloneNode(true);
        item.appendChild(info);
        frag.appendChild(item);
        break;
      }
    }
    var lv = document.querySelector("#listview");
    lv.innerHTML = null;
    lv.appendChild(frag);
  }
  
  var millisPerYear = 3.15360e+10;
  var now = Date.now();
  
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

