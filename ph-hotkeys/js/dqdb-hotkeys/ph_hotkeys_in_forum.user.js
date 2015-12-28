// ==UserScript==
// @name          prohardver.hu : forum : hotkeys in forum
// @namespace     http://www.prohardver.hu/
// @include       http://www.prohardver.hu/*
// @include       http://prohardver.hu/*
// @include       http://mobilarena.hu/*
// @include       http://logout.hu/*
// ==/UserScript==

/**
 * Ez volt eddig a pillanatig myware* állapotban. Emlékeim szerint Logouton nagyon 
 * nem működik az egész (sem a cikkekben, sem a fórumon), ITCafén a cikkekben igen, 
 * míg a fórumon nem, PH-n és MA-n tökéletes. Vagy 10 perc lenne kijavítani, de legalább 
 * 1 éve lusta vagyok rá.
 * @see http://prohardver.hu/tema/opera_bongeszo_2/hsz_19029-19029.html
 */
function documentLoadedHandler()
{
  var is_in_article = function()
  {
    var path = document.location.pathname;
    return (path.substr(0, 6) === "/teszt"
            || path.substr(0, 5) === "/cikk"
            || path.substr(0, 4) === "/hir");
  };

  var get_article_pages = function(id, path)
  {
    var obj = document.getElementById(id);
    if (obj === null)
      return null;

    return document.evaluate(path, obj, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  };

  var go_to_forum = function(in_new_window)
  {
    if (typeof in_new_window === "boolean" && in_new_window) {
      window.open("/forum/index.html");
    }
    else if (document.location.pathname !== "/forum/index.html") {
      document.location.href = "/forum/index.html";
    }
  };

  var go_to_forum_in_new_window = function()
  {
    go_to_forum(true);
  };

  var go_to_private_messages = function(in_new_window)
  {
    if (typeof in_new_window === "boolean" && in_new_window) {
      window.open("/privatok/listaz.php");
    }
    else if (document.location.pathname !== "/privatok/listaz.php") {
      document.location.href = "/privatok/listaz.php";
    }
  };

  var go_to_private_messages_in_new_window = function()
  {
    go_to_private_messages(true);
  };

  var go_to_article_page = function(target)
  {
    var pages = get_article_pages("toc1", "div[1]/ul/li/a");
    if (pages === null)
      pages = get_article_pages("navi_top_pages", "div[1]/div[1]/ul/li/a");

    if (pages === null)
      return;

    var count = pages.snapshotLength;
    var index = null;
    if (target === "first" && count > 0)
    {
      index = 0;
    }
    else if (target === "last" && count > 0)
    {
      index = count - 1;
    }
    else
    {
      var current = null;
      var href = window.location.href;
      for (var n = 0; n < count; n++)
      {
        if (pages.snapshotItem(n).href === href)
        {
          current = n;
          break;
        }
      }

      if (current !== null)
      {
        if (target === "next" && current < count - 1)
          index = current + 1;
        else if (target === "prev" && current > 0)
          index = current - 1;
      }
    }

    if (index !== null)
    {
      href = pages.snapshotItem(index).href;
      if (href !== document.location.href)
        document.location.href = href;
    }
  };

  var go_to_prev_page = function()
  {
    if (is_in_article())
    {
      go_to_article_page("prev");
      return;
    }

    var prev = document.evaluate("//img[@src=\"/design/arr-prev-norm.gif\"]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (prev)
      document.location.href = prev.parentNode.href;
  };

  var go_to_next_page = function()
  {
    if (is_in_article())
    {
      go_to_article_page("next");
      return;
    }

    var next = document.evaluate("//img[@src=\"/design/arr-next-norm.gif\"]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (next)
      document.location.href = next.parentNode.href;
  };

  var go_to_first_page = function()
  {
    if (is_in_article())
    {
      go_to_article_page("first");
      return;
    }

    var path = document.location.pathname;
    if (path.substr(0, 7) === "/temak/")
    {
      path = path.substr(0, path.lastIndexOf("/")) + "/listaz.php";
    }
    else
    {
      var block_size = document.evaluate("//div[@id=\"navi_top_prefs\"]/div[1]/a/b", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (block_size === null)
        return;
      block_size = block_size.innerText * 1;
      path = path.substr(0, path.lastIndexOf("/")) + "/hsz_1-" + block_size + ".html";
    }

    if (path !== document.location.pathname)
      document.location.pathname = path;
  };

  var go_to_last_page = function()
  {
    if (is_in_article())
    {
      go_to_article_page("last");
      return;
    }

    var path = document.location.pathname;
    var is_in_topic_list = (path.substr(0, 7) === "/temak/");
    var last = document.evaluate("//div[@id=\"navi_top_pages\"]/div[1]/div[1]/ul/li[last()]/a/span[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var block_size = document.evaluate("//div[@id=\"navi_top_prefs\"]/div[1]/a/b", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (last === null || block_size === null)
      return;
    last = last.innerText * 1;
    block_size = block_size.innerText * 1;
    last -= (last % block_size);
    if (is_in_topic_list)
      path = path.substr(0, path.lastIndexOf("/")) + "/listaz.php?offset=" + last;
    else
      path = path.substr(0, path.lastIndexOf("/")) + "/hsz_" + (last + 1) + "-" + (last + block_size) + ".html";
    if (path !== document.location.pathname)
      document.location.pathname = path;
  };

  var hotkeys =
          {
            "ctrl-alt-f": go_to_forum,
            "ctrl-shift-f": go_to_forum_in_new_window,
            "ctrl-alt-p": go_to_private_messages,
            "ctrl-shift-p": go_to_private_messages_in_new_window,
            "ctrl-alt-2": go_to_prev_page,
            "ctrl-alt-3": go_to_next_page,
            "ctrl-alt-1": go_to_first_page,
            "ctrl-alt-4": go_to_last_page
          };

  keylib_initialize(window, hotkeys);
}

if (document.body)
  documentLoadedHandler();
else
  window.addEventListener("load", documentLoadedHandler, false);