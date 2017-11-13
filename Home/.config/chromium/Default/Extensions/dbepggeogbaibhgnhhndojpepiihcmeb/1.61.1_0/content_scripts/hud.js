// Generated by CoffeeScript 1.12.7
(function() {
  var HUD, Tween, root;

  HUD = {
    tween: null,
    hudUI: null,
    _displayElement: null,
    findMode: null,
    abandon: function() {
      var ref;
      return (ref = this.hudUI) != null ? ref.hide(false) : void 0;
    },
    init: function() {
      if (this.hudUI == null) {
        this.hudUI = new UIComponent("pages/hud.html", "vimiumHUDFrame", (function(_this) {
          return function(arg) {
            var data, name;
            data = arg.data;
            return typeof _this[name = data.name] === "function" ? _this[name](data) : void 0;
          };
        })(this));
      }
      return this.tween != null ? this.tween : this.tween = new Tween("iframe.vimiumHUDFrame.vimiumUIComponentVisible", this.hudUI.shadowDOM);
    },
    showForDuration: function(text, duration) {
      this.show(text);
      return this._showForDurationTimerId = setTimeout(((function(_this) {
        return function() {
          return _this.hide();
        };
      })(this)), duration);
    },
    show: function(text) {
      return DomUtils.documentComplete((function(_this) {
        return function() {
          _this.init();
          clearTimeout(_this._showForDurationTimerId);
          _this.hudUI.activate({
            name: "show",
            text: text
          });
          return _this.tween.fade(1.0, 150);
        };
      })(this));
    },
    showFindMode: function(findMode) {
      this.findMode = findMode != null ? findMode : null;
      return DomUtils.documentComplete((function(_this) {
        return function() {
          _this.init();
          _this.hudUI.activate({
            name: "showFindMode"
          });
          return _this.tween.fade(1.0, 150);
        };
      })(this));
    },
    search: function(data) {
      var matchCount, showMatchText;
      this.findMode.findInPlace(data.query, {
        "postFindFocus": this.hudUI.iframeElement.contentWindow
      });
      matchCount = FindMode.query.parsedQuery.length > 0 ? FindMode.query.matchCount : 0;
      showMatchText = FindMode.query.rawQuery.length > 0;
      return this.hudUI.postMessage({
        name: "updateMatchesCount",
        matchCount: matchCount,
        showMatchText: showMatchText
      });
    },
    hide: function(immediate, updateIndicator) {
      if (immediate == null) {
        immediate = false;
      }
      if (updateIndicator == null) {
        updateIndicator = true;
      }
      if ((this.hudUI != null) && (this.tween != null)) {
        clearTimeout(this._showForDurationTimerId);
        this.tween.stop();
        if (immediate) {
          if (updateIndicator) {
            return Mode.setIndicator();
          } else {
            return this.hudUI.hide();
          }
        } else {
          return this.tween.fade(0, 150, (function(_this) {
            return function() {
              return _this.hide(true, updateIndicator);
            };
          })(this));
        }
      }
    },
    hideFindMode: function(arg) {
      var exitEventIsEnter, exitEventIsEscape, focusNode, postExit, ref;
      exitEventIsEnter = arg.exitEventIsEnter, exitEventIsEscape = arg.exitEventIsEscape;
      this.findMode.checkReturnToViewPort();
      window.focus();
      focusNode = DomUtils.getSelectionFocusElement();
      if ((ref = document.activeElement) != null) {
        ref.blur();
      }
      if (focusNode != null) {
        if (typeof focusNode.focus === "function") {
          focusNode.focus();
        }
      }
      if (exitEventIsEnter) {
        handleEnterForFindMode();
        if (FindMode.query.hasResults) {
          postExit = function() {
            return new PostFindMode;
          };
        }
      } else if (exitEventIsEscape) {
        postExit = handleEscapeForFindMode;
      }
      this.findMode.exit();
      return typeof postExit === "function" ? postExit() : void 0;
    }
  };

  Tween = (function() {
    Tween.prototype.opacity = 0;

    Tween.prototype.intervalId = -1;

    Tween.prototype.styleElement = null;

    function Tween(cssSelector, insertionPoint) {
      this.cssSelector = cssSelector;
      if (insertionPoint == null) {
        insertionPoint = document.documentElement;
      }
      this.styleElement = DomUtils.createElement("style");
      if (!this.styleElement.style) {
        Tween.prototype.fade = Tween.prototype.stop = Tween.prototype.updateStyle = function() {};
        return;
      }
      this.styleElement.type = "text/css";
      this.styleElement.innerHTML = "";
      insertionPoint.appendChild(this.styleElement);
    }

    Tween.prototype.fade = function(toAlpha, duration, onComplete) {
      var alphaStep, fromAlpha, performStep, startTime;
      clearInterval(this.intervalId);
      startTime = (new Date()).getTime();
      fromAlpha = this.opacity;
      alphaStep = toAlpha - fromAlpha;
      performStep = (function(_this) {
        return function() {
          var elapsed, value;
          elapsed = (new Date()).getTime() - startTime;
          if (elapsed >= duration) {
            clearInterval(_this.intervalId);
            _this.updateStyle(toAlpha);
            return typeof onComplete === "function" ? onComplete() : void 0;
          } else {
            value = (elapsed / duration) * alphaStep + fromAlpha;
            return _this.updateStyle(value);
          }
        };
      })(this);
      this.updateStyle(this.opacity);
      return this.intervalId = setInterval(performStep, 50);
    };

    Tween.prototype.stop = function() {
      return clearInterval(this.intervalId);
    };

    Tween.prototype.updateStyle = function(opacity) {
      this.opacity = opacity;
      return this.styleElement.innerHTML = this.cssSelector + " {\n  opacity: " + this.opacity + ";\n}";
    };

    return Tween;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : (window.root != null ? window.root : window.root = {});

  root.HUD = HUD;

  if (typeof exports === "undefined" || exports === null) {
    extend(window, root);
  }

}).call(this);
