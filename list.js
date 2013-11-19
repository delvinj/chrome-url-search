// :noTabs=true:mode=javascript:tabSize=2:indentSize=2:folding=indent:

(function() {
  "use strict";

  var input, historyController;
  var overflowItems = [];
  
  function createListItem(dataItem) {
    var item = document.createElement("div");
    item.setAttribute("role", "listitem");
    
    var anchor = item.appendChild(document.createElement("a"));
    anchor.href = dataItem.url;
    
    var heading = anchor.appendChild(document.createElement("h3"));
    heading.innerHTML = dataItem.url;
    
    var detail = anchor.appendChild(document.createElement("p"));
    detail.innerHTML = dataItem.title + "<br />" + dataItem.lastVisitTime;
    
    return item;
  }
  
  var updateView = function() {
    var items = this.items;
    var len = items.length;
    
    var frag = document.createDocumentFragment();
    
    for (var j=0; j < len; ++j) {
      
      var item = createListItem(items[j]);
      frag.appendChild(item);
      
      if (j >= 150) {
        // Stop at 150 for now. If you want more, feel free to change this value.
        // In the future I will make this configurable, or a "click to see more".

        var moreResults = document.createElement("div");
        moreResults.setAttribute("role", "listitem");
        moreResults.classList.add("show-more");
        moreResults.innerHTML = "<a href=#><h3>Show More...</h3><p><br /></p></a>";
        
        frag.appendChild(moreResults);
        
        overflowItems = items.slice(j);
        break;
      }
    }
    
    var list = document.querySelector("#data-slide > list");
    list.innerHTML = null;
    list.appendChild(frag);
  };
  
  /**
   * Setup the input filter timer.
   */
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
      // TODO:
      // UP and DOWN should change the selected list item, just like
      // the omnibox
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
  }
  
  function getAnchorForTarget(ev) {
    var listitem = util.ancestorOrSelf(ev.target, "div[role=listitem]");
    if (listitem) {
      return listitem.querySelector("a").href;
    } else {
      (window.console && console.error && console.error("getAnchorForTarget: null", ev));
    }
    return null;
  }
  
  var escapeHook = function(ev) {
    if (ev.keyCode === keyCode.ESCAPE) {
      if (input.value != "") {
        input.value = "";
        input.focus();
        ev.preventDefault();
      }
    }
  };
  
  document.addEventListener("click", 
    function(ev) {
      var href = getAnchorForTarget(ev);
      if (!href) {
        return;
      }
      ev.preventDefault();
      if (ev.button === 1) {
        util.linkToNewTab(href, function() { window.close(); });
      } else {
        util.linkToLastActiveTab(href);
        window.close();
      }
    });
  
  window.addEventListener("load", 
    function() {
      input = document.querySelector("#q");
      document.body.addEventListener("keydown", escapeHook, false);
      
      initFilter();
      
      historyController = new HistoryController();
      historyController.load(updateView);
    
      window.historyController = historyController;
    });

})();

