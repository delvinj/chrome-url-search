// :noTabs=true:mode=javascript:tabSize=2:indentSize=2:folding=indent:

var util = {
  ancestorOrSelf: function(node, selector) {
    var temp = node;
    while (temp) {
      if (temp.webkitMatchesSelector(selector))
        return temp;
      temp = temp.parentNode;
    }
    return null;
  },
  queryAncestors: function(node, selector) {
    var p = node.parentNode, res = [];
    while (p) {
      if (p.webkitMatchesSelector(selector)) {
        res.push(p);
      }
      p = p.parentNode;
    }
    return res;
  },
  queryAncestor: function(node, selector) {
    var p = node.parentNode;
    while (p) {
      if (p.webkitMatchesSelector(selector)) {
        return p;
      }
      p = p.parentNode;
    }
    return null;
  },
  linkToNewTab: function(url, callback) {
    chrome.tabs.create({ 
			url: url
		}, function() {
		  if (callback) {
		    callback.apply(window, arguments);
		  }
    });
  },
  linkToLastActiveTab: function(url) {
    var handler = function(tabs) {
      if (tabs && tabs[0]) {
        chrome.tabs.update(tabs[0].id, { url: url });
      } else {
        util.linkToNewTab(url);
      }
    };
    chrome.tabs.query({
      "active": true,
      "lastFocusedWindow": true,
      "windowType": "normal"
    }, handler);
  },
};
