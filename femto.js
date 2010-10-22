(function() {
  var CSS, D, L, W, bindKey, expandURL, findRecipe, init, kCodes, menu, mkSlide, screen, showByKey, slides, toggle;
  var __hasProp = Object.prototype.hasOwnProperty;
  W = window;
  D = document;
  L = W.location.toString().replace(/(\?|\#).+$/, '');
  CSS = {
    menu: {
      position: 'fixed',
      display: 'none',
      right: 0,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '15px',
      background: '#303039',
      textAlign: 'center'
    },
    screen: {
      position: 'fixed',
      display: 'none',
      top: '2%',
      left: '50%'
    }
  };
  kCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48];
  menu = $('<nav>').css(CSS.menu);
  screen = $('<div>').css(CSS.screen);
  slides = {};
  mkSlide = function(u) {
    var key, url;
    url = expandURL(u);
    key = bindKey(kCodes.shift());
    slides[String(key)] = {
      slide: $('<img>').attr({
        src: url,
        style: 'display:none'
      }).appendTo(screen),
      thumb: $('<img>').attr({
        src: url,
        width: 10,
        height: 10,
        marginRight: '5px'
      }).appendTo(menu),
      key: String(key)
    };
    return slides[key];
  };
  expandURL = function(u) {
    return $('<a>').attr('href', u).get(0).href;
  };
  findRecipe = function(recipes) {
    var _result, images, r, route;
    _result = [];
    for (route in recipes) {
      if (!__hasProp.call(recipes, route)) continue;
      images = recipes[route];
      r = new RegExp(expandURL(route));
      if (r.test(L)) {
        return images;
      }
    }
    return _result;
  };
  showByKey = function(key) {
    var _ref, item, k;
    for (k in _ref = slides) {
      if (!__hasProp.call(_ref, k)) continue;
      item = _ref[k];
      k = String(k);
      if (k !== key) {
        item.slide.hide();
      }
    }
    if (slides[key] !== undefined) {
      slides[key].slide.show();
    }
    if (key === '48') {
      toggle();
    }
    return screen.css('marginLeft', -1 * (item.slide.width() / 2));
  };
  bindKey = function(key) {
    if (bindKey.listening !== true) {
      bindKey.listening = true;
      $(W).bind('keyup', function(e) {
        var c;
        c = String(e.keyCode || e.which);
        return bindKey.map[c] ? showByKey(c) : undefined;
      });
    }
    if (!bindKey.map[key]) {
      bindKey.map[String(key)] = true;
    }
    return key;
  };
  bindKey.map = {
    '48': true
  };
  toggle = function() {
    var nodes;
    nodes = menu.add(screen);
    return menu.is(':visible') ? nodes.hide() : nodes.show();
  };
  init = function(urls) {
    var i, item, u;
    for (i in urls) {
      if (!__hasProp.call(urls, i)) continue;
      u = urls[i];
      item = mkSlide(u);
      menu.append(item.thumb);
      screen.append(item.slide);
    }
    $(D.body).append(screen, menu);
    return (slides['48'] = {
      slide: $('<b>'),
      thumb: $('<b>'),
      key: 48
    });
  };
  W.femto = function(recipes) {
    var recipe;
    recipe = findRecipe(recipes);
    return recipe !== undefined ? init(recipe) : undefined;
  };
  $(function() {
    var recipeURL, s;
    recipeURL = $('script[src*=femto.js]:first').attr('src').match(/recipe\=([^&]+)/);
    if (recipeURL) {
      recipeURL = decodeURIComponent(recipeURL[1]);
      s = D.createElement('script');
      s.setAttribute('src', recipeURL);
      return D.body.appendChild(s);
    }
  });
}).call(this);
