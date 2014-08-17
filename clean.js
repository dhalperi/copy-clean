function clean(url) {
  if (!url)
    return "";

  // If this URL doesn't have a query string, not a lot we can do
  var q = url.indexOf('?');
  if (q == -1)
    return url;

  // Google: look for a URL link and extract+clean the URL parameter
  var pattern = "http://www.google.com/url?";
  if (startsWith(url, pattern)) {
    return decodeURIComponent(find_arg("url", url));
  }
  pattern = "https://www.google.com/url?";
  if (startsWith(url, pattern)) {
    return decodeURIComponent(find_arg("url", url));
  }

  // Washington Post: delete the query string
  pattern = "http://www.washingtonpost.com/wp-dyn/content/article/";
  if (startsWith(url, pattern))
    return url.substring(0, q);
  pattern = "http://www.washingtonpost.com/wp-srv/";
  if (startsWith(url, pattern))
    return url.substring(0, q);
  // Slate
  pattern = "http://www.slate.com/id";
  if (startsWith(url, pattern))
    return url.substring(0, q);

  return url;
}

function startsWith(s, a) {
  return s.length >= a.length && s.substring(0, a.length) == a;
}

function find_arg(name, url) {
  // Is this URL a query string?
  var q = url.indexOf('?');
  if (q === -1) {
    return url;
  }

  // Make sure name ends in =
  if (name.length < 1) {
    return url;
  }
  if (name.charAt(name.length - 1) != '=') {
    name = name + '=';
  }

  // Look for an arg named name
  var args = url.substring(q, url.length).split('&');
  for (var i = 0; i < args.length; ++i) {
    if (args[i].length >= name.length && args[i].substring(0, name.length) == name) {
      return args[i].substring(name.length, args[i].length);
    }
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    "type": "normal",
    "title": chrome.i18n.getMessage("contextMenu_command_menu_clean"),
    "contexts": ["link"],
    "onclick": (
      function (link, tab) {
        var doc = chrome.extension.getBackgroundPage().document;
        var textarea = doc.getElementById('copy-clean-textarea');

        var text = clean(link.linkUrl);
        if (text) {
          textarea.value = text;
          textarea.select();
          doc.execCommand("copy");
        }
      }
      )
  })
});