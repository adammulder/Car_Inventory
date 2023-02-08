(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TORUS = {}));
}(this, (function (exports) { 'use strict';

  /**
   * ------------------------------------------------------------------------
   * Global namespace
   * ------------------------------------------------------------------------
   */

  var TORUS = TORUS || {};

  /**
   * ------------------------------------------------------------------------
   * Predefined CSS properties. Example: `[data-tor="bg-opacity()"]`
   * ------------------------------------------------------------------------
   */

  const CSS_PREDEFINED_PROPERTIES = [
    "bg",
    "bg-opacity",
    "bg-lighten",
    "bg-darken",
    "bg-brightness",
    "block",
    "border",
    "border-opacity",
    "blur",
    "blur.to",
    "blur.from",
    "clip",
    "push.up",
    "push.down",
    "push.left",
    "push.right",
    "pull.up",
    "pull.left",
    "pull.right",
    "pull.down",
    "fade.in",
    "fade.out",
    "fade.to",
    "fade.from",
    "opacity",
    "reveal",
    "reveal.hide",
    "rotate.to",
    "rotate.from",
    "rotateX.to",
    "rotateX.from",
    "rotateY.to",
    "rotateY.from",
    "scale.to",
    "scale.from",
    "scaleX.to",
    "scaleX.from",
    "scaleY.to",
    "scaleY.from",
    "shadow",
    "svg-shadow",
    "shadow-offset.down",
    "shadow-offset.up",
    "shadow-offset.left",
    "shadow-offset.right",
    "shadow-intensity",
    "shadow-color",
    "skew.to",
    "skew.from",
    "skewX.to",
    "skewX.from",
    "skewY.to",
    "skewY.from",
    "text",
    "text-opacity",
    "delay",
    "duration",
    "top",
    "bottom",
    "up",
    "down",
    "left",
    "right",
    "shift.up",
    "shift.right",
    "shift.down",
    "shift.left",
    "originX",
    "originY",
    "originZ",
    "wait",
    "place.top",
    "place.right",
    "place.bottom",
    "place.left",
  ];

  /**
   * ------------------------------------------------------------------------
   * Differents
   * ------------------------------------------------------------------------
   */

  const CSS_DIFFERENTS = {
    activeValue: {
      "block": "var(--tor-block);",
      "fade.in": "0;",
      "fade.out": "0;",
      "clip": "var(--tor-clip-idle);",
      "block": "var(--tor-block-idle);",
      "reveal": "var(--tor-reveal-idle);",
      "reveal.hide": "var(--tor-reveal-idle);",
    },
    additionalRules: {
      "block": "--tor-block-scale: var(--tor-block-scale-idle); --tor-clip-delay: calc(var(--tor-duration-all) + var(--tor-delay-all, 0ms)); --tor-block-delay: var(--tor-delay-all, 0ms); --tor-block: var(--tor-block-idle);",
      // "block": "--tor-block-scale: var(--tor-block-scale-idle);",
      "reveal": "--tor-translateX: var(--tor-translateX-idle); --tor-translateY: var(--tor-translateY-idle);",
      "reveal.hide": "--tor-translateX: var(--tor-translateX-idle); --tor-translateY: var(--tor-translateY-idle);",
    },
    alias: {
      "blur*": "blur",
      "push*": "push-pull",
      "pull*": "push-pull",
      "shadow-offset*": "shadow-offset",
    },
    calc: {
      "push.up": -1,
      "push.left": -1,
      "pull.down": -1,
      "pull.right": -1,
      "shadow-offset.up": -1,
      "shadow-offset.left": -1,
      "shift.up": -1,
      "shift.left": -1,
    },
    propertyAlias: {
      "bg": "background-color",
      "bg-lighten": "--tor-bg-lightness",
      "bg-darken": "--tor-bg-lightness",
      "bg-brightness": "--tor-bg-lightness",
      "border": "border-color",
      "push.up": "--tor-translateY",
      "push.down": "--tor-translateY",
      "push.left": "--tor-translateX",
      "push.right": "--tor-translateX",
      "pull.up": "--tor-translateY",
      "pull.down": "--tor-translateY",
      "pull.left": "--tor-translateX",
      "pull.right": "--tor-translateX",
      "fade*": "--tor-opacity",
      "shadow": "box-shadow",
      "svg-shadow": "filter",
      "shadow-offset.down": "--tor-shadow-offsetY",
      "shadow-offset.up": "--tor-shadow-offsetY",
      "shadow-offset.left": "--tor-shadow-offsetX",
      "shadow-offset.right": "--tor-shadow-offsetX",
      "text": "color",
      "shift.up": "--tor-shiftY",
      "shift.down": "--tor-shiftY",
      "shift.left": "--tor-shiftX",
      "shift.right": "--tor-shiftX",
      "place.top": "--tor-top",
      "place.right": "--tor-right",
      "place.bottom": "--tor-bottom",
      "place.left": "--tor-left",
    },
    cssNot: [
      "blur.from",
      "block",
      "pull*",
      "clip",
      "fade.in",
      "reveal",
      "rotate.from",
      "rotateX.from",
      "rotateY.from",
      "scale.from",
      "scaleX.from",
      "scaleY.from",
      "skew.from",
      "skewX.from",
      "skewY.from",
    ],
    percentage: [
      "bg-opacity",
      "bg-brightness",
      "fade.to",
      "fade.from",
      "opacity",
      "scale*",
      "scaleX*",
      "scaleY*",
      "text-opacity",
    ],
  };

  /**
   * ------------------------------------------------------------------------
   * Create object from `CSS_PREDEFINED_PROPERTIES`, compare with `CSS_DIFFERENTS`
   * and return the new object
   * ------------------------------------------------------------------------
   */

  const createPredefinedCSSObject = () => {
    const cssProperties = {};

    for (const propertyName of CSS_PREDEFINED_PROPERTIES) {
      cssProperties[propertyName] = {};

      /** If property has `.` dot, extract everything before. Example: `fade.out` */
      let exec = /^(.*?)\./.exec(propertyName);
      /** Assign extracted `exec` or default `property` */
      let item = exec ? exec[1] : propertyName;
      /** Add to object */
      cssProperties[propertyName].propertyAlias = `--tor-${item}`;

      addToPredefinedObject("propertyAlias", propertyName);
      addToPredefinedObject("activeValue", propertyName);
      addToPredefinedObject("additionalRules", propertyName);
      addToPredefinedObject("alias", propertyName);
      addToPredefinedObject("calc", propertyName);
      addToPredefinedObject("percentage", propertyName);
      addToPredefinedObject("cssNot", propertyName);
    }

    function addToPredefinedObject(object, propertyName) {
      let isArray = CSS_DIFFERENTS[object] instanceof Array ? true : false;

      for (const [key, value] of Object.entries(CSS_DIFFERENTS[object])) {
        let itemKey = isArray ? value : key;
        let itemValue = isArray ? true : value;

        /** If CSS_DIFFERENTS definition contains a `*` wildcard */
        if (/\*/g.test(itemKey)) {
          let matchKey = /^(.*?)\*/.exec(itemKey)[1];
          let matchName = /^(.*?)\./.exec(propertyName);

          if (matchName && matchKey === matchName[1]) {
            cssProperties[propertyName][object] = itemValue;
          }
        } else if (itemKey === propertyName) {
          cssProperties[propertyName][object] = itemValue;
        }
      }
    }

    return cssProperties;
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * WINDOW object
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  const WINDOW = {
    computedStyle: window.getComputedStyle(document.documentElement, null),
    height: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth,
    resolution: {},
    resizing: false,
    scroll: {
      running: false,
      tick: 0,
      y: 0,
      x: 0,
    },
    mouse: {
      running: false,
      tick: 0,
      x: 0,
      y: 0,
    },
    idleCallback: window.requestIdleCallback ? true : false,
    isChrome: !!window.chrome,
    isUnsupportedSVG: !!window.chrome || /AppleWebKit/i.test(navigator.userAgent),
    isSafari: /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
    mutationDone: false,
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * UTILITIES
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Get current resolution
   * ------------------------------------------------------------------------
   */

  const getCurrentResolution = () => {
    for (const [name, value] of Object.entries(CSS_BREAKPOINTS)) {
      if (WINDOW.width >= value.value) {
        WINDOW.resolution.name = name;
        WINDOW.resolution.value = value.value;
        break;
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Create iterable elements from given parameter
   * ------------------------------------------------------------------------
   */

  const getIterableElement = (elements) => {
    if (typeof elements === "string") {
      elements = [...document.querySelectorAll(elements)];
    }

    if (elements instanceof Node) {
      elements = [elements];
    }

    if (elements instanceof NodeList) {
      elements = [].slice.call(elements);
    }

    if (elements instanceof Set) {
      elements = [...elements];
    }

    if (!elements.length) {
      return false;
    }

    if (elements.length) {
      return elements;
    }

    else {
      return false;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Initialize Class
   * ------------------------------------------------------------------------
   */
  const initClass = (params) => {

    if (!params.elements) return;

    async function loop() {
      let promise;
      for (const i in params.elements) {
        let element = params.elements[i];

        if (!element.TORUS) {
          element.TORUS = element.TORUS || {};
        }
        if (!element.TORUS[params.name]) {
          element.TORUS[params.name] = new TORUS[params.name](element, params.options);
          promise = await element.TORUS[params.name];
        } else {
          element.TORUS[params.name].refresh && element.TORUS[params.name].refresh();
          promise = await element.TORUS[params.name].refresh;
        }
      }

      return promise;
    }

    loop();
  };


  /**
   * ------------------------------------------------------------------------
   * Replace all with regex
   * ------------------------------------------------------------------------
   */

  String.prototype.replaceAll = function (value) {
    let replacedString = this;
    for (let x in value) {
      replacedString = replacedString.replace(new RegExp(x, "g"), value[x]);
    }
    return replacedString;
  };

  /**
   * ------------------------------------------------------------------------
   * Optimize given attributes
   * ------------------------------------------------------------------------
   */

  const optimizeAttribute = (attribute, shortcuts) => {
    if (!attribute) {
      return "";
    }

    /**
     * Find `@parallax` and `@tilt` shortcuts
     */

    if (shortcuts) {
      shortcuts = attribute.match(/(scroll|mouse|mouseX|mouseY|sensorX|sensorY)(.*?):(.*?)(@parallax|@tilt)\(.*?\)/g);

      if (shortcuts) {
        for (const shortcut of shortcuts) {
          let replace = /@(.*?)\)/.exec(shortcut)[0];
          let value = /\((.*?)\)/.exec(replace)[1];

          let transforms = {
            "@parallax": {
              name: "translate",
              method: "continuous",
              unit: "px",
              events: {
                mouseX: "X",
                mouseY: "Y",
                scroll: "Y",
              },
            },
            "@tilt": {
              name: "rotate",
              method: "self-continuous",
              unit: "deg",
              events: {
                mouseX: "Y",
                mouseY: "X",
              },
            },
          };

          for (const [type, values] of Object.entries(transforms)) {
            for (let [event, axis] of Object.entries(values.events)) {
              let test = new RegExp(`${event}(.*?)${type}`);

              /** Only one direction: `mouseX, mouseY, scroll` */
              if (test.test(shortcut)) {
                value = (type === "@tilt" && event === "mouseY") ? value : value.replace(/\d*/g, match => match && match.replace(match, `-${match}`));
                attribute = attribute.replace(replace, `@T=${values.name}${axis}(${value}${values.unit};0${values.unit},{method:${values.method}})`);
              }
              else { /** Two directions: `mouse` */
                test = new RegExp("^mouse:");

                if (test.test(shortcut)) {
                  let arr = [];
                  let re = new RegExp(`(mouse)(.*?)(${replace.replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`, "g");
                  let exec = re.exec(shortcut);

                  for (const [event, axis] of Object.entries(values.events)) {
                    let symbol = (type === "@tilt" && event === "mouseY") ? "" : "-";
                    arr.push(exec[1].replace(exec[1], event) + exec[2] + `@T=${values.name}${axis}(${symbol}${value}${values.unit};0${values.unit}, {method:${values.method}})`);
                  }

                  let include = new RegExp(type);
                  if (include.test(shortcut)) {
                    attribute = attribute.replace(shortcut, arr.join(" "));
                  }
                }
              }

            }
          }
        }
      }
    }

    /**
     * Optimize
     */

    let optimized = removeSpaces (
      attribute
        .replace(/\s\s+/g, " ")
        .replace(/ $/g, ""),
      "\\[ | \\]|{ | }| { | : |: | :| ; |; | ;| ,|, | , |\\( | \\)|\\(\\( | \\(\\(| \\(\\( | \\)\\)| =>|=> | => | \\+| \\+ |\\+ | ~| ~ |~ | \\(")
      .replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░"))
      .replace(/\\/g, "")
      .replace(/@T=/g, "@transform=")
      .replace(/@F=/g, "@filter=")
      .trim();

    return optimized;
  };

  /**
   * ------------------------------------------------------------------------
   * Get resolution and value from
   * ------------------------------------------------------------------------
   */

  const getResolution = (value) => {
    let resolution = null;
    value = value;

    if (/(xs|sm|md|lg|xl|xxl)::/g.test(value)) {
      let split = value.split("::");
      resolution = split[0];
      value = split[1];
    }

    return {
      resolution,
      value,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Get data from such as `value`, `unit`...
   * ------------------------------------------------------------------------
   */

  const getValueData = (value) => {
    let unit = null;

    if (!/^@/.test(value) && /^(-|\+|\/\+|\/-|\/~|\.|.*?)\d/g.test(value) && !Number(value)) {
      let unitMatch = /(?!\d)(px|deg|%|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|ms|s)+/g.exec(value.replace(/\/+/g, ""));
      if (unitMatch) {
        unit = unitMatch[1];
        value = value.replace(unit, "");
      }
    }

    value = parseValue(value);

    if (/^--/.test(value)) {
      value = `var(${value})`;
    }

    return {
      value,
      unit,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Helper function that returns CSS `var(--tor-*)` property
   * ------------------------------------------------------------------------
   */

  const getCSSVariable = (params) => {
    let property = params.property;
    let value = params.value;
    let unit = params.unit ? params.unit : "";
    let wrap = params.wrap;

    let CSSVariable;
    let tempProperty;

    /** If value is from predefined ones */
    if (CSS_PREDEFINED_VARIABLES.includes(value)) {
      /** If there is alias for property. Example `push.up` has `push` alias */
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].alias) {
        tempProperty = CSS_PROPERTIES[property].alias ? CSS_PROPERTIES[property].alias : property;
      }
      else {
        tempProperty = property;
      }

      /** Check for `calc`. Some properties needs to be calculated in reversed direction. Example: `push.up` has `calc: -1` */
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].calc) {
        CSSVariable = `calc(var(--tor-${tempProperty}-${value}) * ${CSS_PROPERTIES[property].calc})`;
      }
      else {
        CSSVariable = `var(--tor-${tempProperty}-${value})`;
      }
    }
    /** It's a custom value */
    else {
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].calc) {
        CSSVariable = `${value * CSS_PROPERTIES[property].calc}${unit}`;
      }
      else {
        CSSVariable = wrap ? `${wrap}(${value}${unit})` : `${value}${unit}`;
      }
    }

    /** If has active value, that has to be added immediately. Example: `fade.in` has `activeValue = 0` (opacity: 0) */
    if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].activeValue) {
      CSSVariable = CSS_PROPERTIES[property].activeValue;
    }

    return CSSVariable;
  };

  /**
   * ------------------------------------------------------------------------
   * Expand cluster defined by `[]`
   * Example: active:[opacity(50%) bg(red)] -> active:opacity(50%) active:bg(red)
   * ------------------------------------------------------------------------
   */

  const expandCluster = (attributes) => {
    let matches = attributes.match(/\b([^\s]+)\[(.*?)\]/g);

    if (matches) {
      /** Loop trough all matches */
      for (let match of matches) {
        let attributesArray = [];
        let original = match;

        /** Extract options defined by `{<options>}` */
        let options = /,{(?:.(?!,{))+}(?=\])/g.exec(match);

        if (options) {
          match = match.replace(options[0], "");
          options = /,{(.*?)}/.exec(options[0])[1];
        }

        /** Extract trigger defined by `trigger-name` and colon `:` */
        let trigger = /^(.*?)\:/.exec(match)[1];

        /** Extract everything between curly brackets `{}` and split by the space */
        let contents = /\[(.*?)\]+/g.exec(match)[1].split(" ");

        /** Combine every single content (attribute) with its trigger */
        for (let content of contents) {
          /** If has priority defined by `!` */
          if (/^!/.test(content)) {
            attributesArray.push(`!${trigger}:${getContent(options, content.replace("!", ""))}`);
          }
          else {
            attributesArray.push(`${trigger}:${getContent(options, content)}`);
          }
        }

        /** Replace original attribute cluster with separated attributes */
        attributes = attributes.replace(original, attributesArray.join(" "));
      }
    }

    function getContent(options, content) {
      if (options) {
        if (/}\)/.test(content)) {
          content = content.replace("})", `,${options}})`);
        } else {
          content = content.replace(")", `,{${options}})`);
        }
      }
      return content;
    }

    return attributes;
  };

  /**
   * ------------------------------------------------------------------------
   * Parse value. string/integer/float
   * ------------------------------------------------------------------------
   */

  const parseValue = (value) => {
    /** Check if number is float */
    if (/(^(\d.*?)|^()|^(-\d.*?))\.(\d)+/g.test(value)) {
      value = parseFloat(/((-|\+|)[0-9]*[.])?[0-9]+/g.exec(value)[0]);
    }
    /** Number is integer */
    else if (/^[-+]?\d+$/.test(value)) {
      value = parseInt(/[+-]?(\d)+/g.exec(value)[0]);
    }
    /** Number is string (or contains number with non-number character) */
    else {
      value = value;
    }

    return value;
  };

  /**
   * ------------------------------------------------------------------------
   * Remove unnecessary spaces and unify them, remove tabs, etc
   * ------------------------------------------------------------------------
   */

  const removeSpaces = (string, replacement) => {
    let oldString = string;
    let newString, re, replacedPattern;

    for (const pattern of replacement.split("|")) {
      replacedPattern = pattern.replace(/ /g, "");
      re = new RegExp(pattern, "g");
      newString = oldString.replace(re, replacedPattern);
      oldString = newString.replace(/\\+/g, "");
    }

    return newString;
  };

  /**
   * ------------------------------------------------------------------------
   * Insert generated CSS into <head> stylesheet
   * ------------------------------------------------------------------------
   */

  const insertStylesheet = (css) => {
    STYLE.sheet.insertRule(css, STYLE.sheet.cssRules.length);
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate percents based on mouse move
   * ------------------------------------------------------------------------
   */

  /**
   *
   * @param {object} _this Object contains element bounds
   * @param {string} origin Origin for mouse position calculation
   * @returns {number}
   */

  const getPercents = (_this, params) => {
    let percents = {};

    switch (params.event) {
      /**
       * Mouse
       */
      case "mouse": {
        switch (params.options.method) {
          case "middle": {
            percents = {
              x: 1 - Math.abs((WINDOW.width / 2 - WINDOW.mouse.x) / (WINDOW.width / 2)),
              y: (1 - Math.abs((WINDOW.height / 2 - WINDOW.mouse.y) / (WINDOW.height / 2))),
              all: (1 - Math.sqrt(Math.pow(WINDOW.width / 2 - WINDOW.mouse.x, 2) + Math.pow(WINDOW.height / 2 - WINDOW.mouse.y, 2)) / Math.sqrt(Math.pow(WINDOW.width / 2, 2) + Math.pow(WINDOW.height / 2, 2))),
            };
            break;
          }
          case "continuous": {
            percents = {
              x: (1 - (WINDOW.width / 2 - WINDOW.mouse.x) / (WINDOW.width / 2)),
              y: (1 - (WINDOW.height / 2 - WINDOW.mouse.y) / (WINDOW.height / 2)),
            };
            break;
          }
          case "self": {
            let _x = _this && 1 - Math.abs((WINDOW.mouse.x - _this.bounds.centerX) / _this.bounds.maxXSide);
            let _y = _this && 1 - Math.abs((WINDOW.mouse.y - _this.bounds.centerY) / _this.bounds.maxYSide);

            percents = {
              x: Math.min(1, Math.max(0, _x)),
              y: Math.min(1, Math.max(0, _y)),
              all: _this && (getMouseHoverPosition(_this, _this.bounds.centerX, _this.bounds.centerY))
            };
            break;
          }
          case "self-continuous": {
            percents = {
              x: _this && 1 + ((WINDOW.mouse.x - _this.bounds.centerX) / _this.bounds.maxXSide),
              y: _this && 1 + ((WINDOW.mouse.y - _this.bounds.centerY) / _this.bounds.maxYSide),
              // all:  _this && (getMouseHoverPosition(_this, _this.bounds.centerX/_this.bounds.maxXSide, _this.bounds.centerY/_this.bounds.maxYSide))
            };
            break;
          }
          case "parallax": {
            percents = {
              x: ((WINDOW.mouse.x - WINDOW.width / 2) / (WINDOW.width / 2)),
              y: ((WINDOW.mouse.y - WINDOW.height / 2) / (WINDOW.height / 2))
            };
            break;
          }
          case "start": {
            let _x = WINDOW.mouse.x / WINDOW.width;
            let _y = WINDOW.mouse.y / WINDOW.height;

            percents = {
              x: _x,
              y: _y,
              all: (_x + _y) / 2,
            };

            break;
          }

        }
        break;
      }
      /**
       * Scroll
       */
      case "scroll": {
        let start;
        let end;
        let x;
        let y;
        let shiftStart = 0;
        let shiftEnd = 0;

        let optionsEnd = params.options.end;
        let optionsStart = params.options.start;

        if (optionsEnd === "middle") {
          shiftEnd = _this.bounds.height / 2;
          optionsEnd = 50;
        }
        if (optionsStart === "shifted") {
          optionsStart = 0;
          shiftStart = _this.bounds.height / 2;
          shiftEnd = 0;
        }

        start = (WINDOW.height / 100) * optionsStart + shiftStart;
        end = ((WINDOW.height / 100) * (optionsEnd - optionsStart)) + shiftEnd;

        x = null;
        y = (WINDOW.height + WINDOW.scroll.y - _this.bounds.offsetTop - start) / end;

        // let usingOffsetAmount = (end || start) ? true : false;
        // // let usingScrollAmount = (afterScrolledStart || afterScrolledEnd) ? true : false;
        // let usingScrollAmount = false;

        // if (usingScrollAmount) {
        //   if (!afterScrolledStart) {
        //     afterEnd = afterScrolledEnd;
        //   } else {
        //     afterStart = afterScrolledEnd;
        //     afterEnd = afterScrolledStart;
        //   }

        //   if (afterScrolledStart && afterScrolledEnd) {
        //     afterScrollDifference = afterScrolledEnd - afterScrolledStart;
        //   }
        // }

        // let _x = null;
        // let _y = (-0.0001 + WINDOW.height - (_this.bounds.offsetTop - WINDOW.scroll.y + offsetA)) / (((WINDOW.height + (end === "middle" ? _this.bounds.height : 0)) / 100) * ((end === "middle" ? 49.99 : end) - offsetB));

        switch (params.options.method) {
          case "continuous": {
            percents = {
              x: x,
              y: y,
            };
            break;
          }

          case "regular": {
            // if (usingOffsetAmount) {
              percents = {
                x: x,
                y: Math.min(1, Math.max(0, y)),
              };
            // }
            // if (usingScrollAmount) {
            //   percents = {
            //     x: _x,
            //     y: (WINDOW.scroll.y - afterEnd) / (afterScrollDifference || (WINDOW.height / 2)),
            //   }
            // }
            break;
          }
        }
        break;
      }
    }

    return {
      x: Math.round(percents.x * 1000) / 1000,
      y: Math.round(percents.y * 1000) / 1000,
      all: Math.round(percents.all * 1000) / 1000,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate the longest distance from element center to one of the screen corners
   * ------------------------------------------------------------------------
   */

  const getMaxSide = (_this) => {
    let lt = Math.sqrt(Math.pow(_this.bounds.centerX, 2) + Math.pow(_this.bounds.centerY, 2));
    let lb = Math.sqrt(Math.pow(_this.bounds.centerX, 2) + Math.pow(WINDOW.height - _this.bounds.centerY, 2));
    let rt = Math.sqrt(Math.pow(WINDOW.width - _this.bounds.centerX, 2) + Math.pow(_this.bounds.centerY, 2));
    let rb = Math.sqrt((Math.pow(WINDOW.width - _this.bounds.centerX, 2) + Math.pow(WINDOW.height - _this.bounds.centerY, 2)));
    let ls = _this.bounds.centerX;
    let rs = WINDOW.width - _this.bounds.centerX;
    let ts = _this.bounds.centerY;
    let bs = WINDOW.height - _this.bounds.centerY;
    let corner = Math.max(...[lt, lb, rt, rb]);
    let xSide = Math.max(...[ls, rs]);
    let ySide = Math.max(...[ts, bs]);

    return { corner, xSide, ySide };
  };

  /**
   * ------------------------------------------------------------------------
   * Get the shortest distance from given centerX, centerY to mouse pointer
   * ------------------------------------------------------------------------
   */

  const getMouseHoverPosition = (_this, centerX, centerY) => {
    return 1 - Math.abs(Math.sqrt(Math.pow(Math.abs(centerX - WINDOW.mouse.x), 2) + Math.pow(Math.abs(centerY - WINDOW.mouse.y), 2)) / _this.bounds.maxDiagonal);
  };

  /**
   * ------------------------------------------------------------------------
   * Get scroll values
   * ------------------------------------------------------------------------
   */

  const getWindowScroll = () => {
    WINDOW.scroll.y = window.scrollY;
    WINDOW.scroll.x = window.scrollX;
  };

  /**
   * ------------------------------------------------------------------------
   * Return counting value
   * ------------------------------------------------------------------------
   */

  const getCounting = (count, value) => {
    value = value.replace(/\//g, "");

    /** Beginning value - defines the starting value of counting */
    let begin = /(.).*?(?=\+|-|~)/.exec(value);
    if (begin) {
      value = value.replace(begin[0], "");
      begin = getValueData(begin[0]).value;
    }

    let symbol = /\+|-|~/.exec(value);
    if (symbol) {
      symbol = symbol[0];
      value = value.replace(symbol, "");
    }

    let countValue = getValueData(value).value;
    let countUnit = getValueData(value).unit;

    switch (symbol) {
      case "+":
        count = count;
        break;

      case "-":
        count = -count;
        break;

      case "~":
        count = 1;
        countValue = (Math.round(Math.random() * (countValue - 0) + 0));
        break;
    }


    return `${begin + (count * countValue)}${countUnit ? countUnit : ""}`;
  };

  /**
   * ------------------------------------------------------------------------
   * Call given function in TORUS element
   * ------------------------------------------------------------------------
   */

  const callFunction = (params) => {
    if (!params.elements) return;
    if (!params.elements.length) return;

    for (const element of getIterableElement(params.elements)) {
      if (element.TORUS && element.TORUS[params.object]) {
        element.TORUS[params.object][params.fn](params.argument);
      }
    }
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * GLOBALS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Generated predefined CSS variables
   * ------------------------------------------------------------------------
   */

  const CSS_PREDEFINED_VARIABLES = WINDOW.computedStyle.getPropertyValue("--tor-predefined-values").trim().split(",");
  // const CSS_PREDEFINED_VARIABLES = "blue,indigo,purple,pink,red,orange,yellow,green,teal,cyan,white,gray,gray-dark,navy,maroon,brown,magenta,lime,black,primary,secondary,success,info,warning,danger,light,dark,no,xs,sm,md,lg,xl,full,half,risen,pop,fastest,faster,fast,slow,slower,slowest".split(",");

  /**
   * ------------------------------------------------------------------------
   * Breakpoints names with their resolutions
   * ------------------------------------------------------------------------
   */

  const CSS_BREAKPOINTS = {};
  const cssBreakpoints = WINDOW.computedStyle.getPropertyValue("--tor-resolutions").replace(/"| +/g, "").split(",");
  // const cssBreakpoints = ["xxl:1400px", "xl:1200px", "lg:992px", "md:768px", "sm:576px", "all:0px"];
  let cssBreakpointsLength = cssBreakpoints.length - 1;

  for (const breakpoint of cssBreakpoints) {
    let split = breakpoint.split(":");
    let data = getValueData(split[1]);

    CSS_BREAKPOINTS[split[0]] = {};
    CSS_BREAKPOINTS[split[0]].value = data.value;
    CSS_BREAKPOINTS[split[0]].unit = data.unit;
    CSS_BREAKPOINTS[split[0]].id = cssBreakpointsLength--;
  }

  getCurrentResolution();

  /**
   * ------------------------------------------------------------------------
   * Trigger aliases used to defined a CSS rule
   * ------------------------------------------------------------------------
   */

  const CSS_TRIGGER_ALIAS = {
    inview: ".inview",
    active: ".active",
    show: ".show",
    hover: ":hover",
    focus: ":focus",
    "focus-within": ":focus-within",
  };

  /**
   * ------------------------------------------------------------------------
   * Property alias for default CSS rule definition
   * ------------------------------------------------------------------------
   */

  const CSS_PROPERTIES = createPredefinedCSSObject();

  /**
   * ------------------------------------------------------------------------
   * Create <style> element
   * ------------------------------------------------------------------------
   */

  const STYLE = document.createElement("style");


  /**
   * ------------------------------------------------------------------------
   * Individual attribute properties
   * ------------------------------------------------------------------------
   */

  const ATTRIBUTE_SEGMENTS = {
    priority: {
      indexReplace: 0,
      indexValue: 0,
      regex: /^!(.*?)/,
    },
    trigger: {
      indexReplace: 0,
      indexValue: 0,
      regex: /^((?:.)(?:((?!::)+(?!{))))*?(?:\:)/,
    },
    resolution: {
      indexReplace: 0,
      indexValue: 2,
      regex: /^(<|=|)(xs|sm|md|lg|xl|xxl)(.*?)::/,
    },
    property: {
      indexReplace: 1,
      indexValue: 1,
      regex: /^(?:@|)(.*?)(\(|$)/,
    },
    values: {
      indexReplace: 0,
      indexValue: 1,
      regex: /^\((.*?)\)$/,
    },
  };

  /**
   * ------------------------------------------------------------------------
   * Properties object
   * ------------------------------------------------------------------------
   */

  const createPropertiesObject = (_this, array, group) => {
    let temp = {};
    _this.attributes[group] = _this.attributes[group] || {};

    /**
     * Sort attributes by their <group> and <trigger>
     */

    for (const item of array) {
      let triggerGroup;
      let trigger = /^((?:.)(?:((?!::)+(?!{))))*?(?=\:)/g.exec(item);
      _this.attributes[group] = _this.attributes[group] || {};

      if (trigger) {
        trigger = trigger[0].replace("!", "");
        temp[group] = temp[group] || {};

        if (/^(mouse|scroll|sensor)/.test(trigger)) {
          triggerGroup = /^.*?(?=(X|Y))/.exec(trigger);
          triggerGroup = triggerGroup ? triggerGroup[0] : trigger;

          _this.attributes[group][triggerGroup] = _this.attributes[group][triggerGroup] || {};
          _this.attributes[group][triggerGroup][trigger] = _this.attributes[group][triggerGroup][trigger] || {};

          temp[group][triggerGroup] = temp[group][triggerGroup] || {};
          temp[group][triggerGroup][trigger] = temp[group][triggerGroup][trigger] || [];
          temp[group][triggerGroup][trigger].push(item);
        } else {
          _this.attributes[group][trigger] = _this.attributes[group][trigger] || {};

          temp[group][trigger] = temp[group][trigger] || [];
          temp[group][trigger].push(item);
        }
      } else {
        _this.attributes[group].idle = _this.attributes[group].idle || {};
        temp[group] = temp[group] || {};
        temp[group].idle = temp[group].idle || [];
        temp[group].idle.push(item);
      }
    }

    /**
     * Call the `createSegment` function in loop
     */

    for (const [group, object] of Object.entries(temp)) {
      for (const [trigger, array] of Object.entries(object)) {
        if (/mouse|scroll|sensor/.test(trigger)) {
          for (const [specificTrigger, item] of Object.entries(array)) {
            createSegment(_this, group, trigger, item, specificTrigger);
          }
        } else {
          createSegment(_this, group, trigger, array);
        }
      }
    }

    /**
     * Create segment
     */

    function createSegment(_this, group, trigger, array, specificTrigger) {
      for (const [i, dataAttribute] of Object.entries(array)) {
        let temp = dataAttribute;
        let attribute;

        if (specificTrigger) {
          attribute = _this.attributes[group][trigger][specificTrigger][i] = {};
        } else {
          attribute = _this.attributes[group][trigger][i] = {};
        }

        /** Original [data-attribute] */
        attribute.original = dataAttribute;

        /** Check for custom property defined by `@`. Example: `hover:@opacity(0; 0.5)` */
        if (/@/.test(temp)) {
          attribute.isCustom = true;
          temp = temp.replace("@", "");
        }

        /** Loop through all `ATTRIBUTE_SEGMENTS` (priority, trigger, property...) */
        for (let [segmentName, segmentValue] of Object.entries(ATTRIBUTE_SEGMENTS)) {
          let exec = segmentValue.regex.exec(temp);
          if (exec) {
            temp = temp.replace(exec[segmentValue.indexReplace], "");
            createSegmentObject(_this, attribute, exec, segmentName, segmentValue);
          } else {
            createSegmentObject(_this, attribute, exec, `${segmentName}:default`, segmentValue);
          }
        }
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Segments
   * ------------------------------------------------------------------------
   */

  const createSegmentObject = (_this, attribute, exec, segmentName, segmentValue) => {
    switch (segmentName) {
      case "priority":
        attribute.priority = "important";
        break;

      case "trigger":
        attribute.trigger = {};
        let temp = exec[segmentValue.indexValue].replace(":", "");

        /** Check for trigger argument. @example: `hover(p):fade.in` */
        let argument = /\((.*?)\)/.exec(temp);

        if (argument) {
          attribute.trigger.name = temp.replace(argument[0], "");
          attribute.trigger.argument = argument[1];

          if (argument[1] === "p") {
            attribute.trigger.argument = "parent";
          }
          if (/^#/.test(argument[1])) {
            switch (attribute.trigger.name) {
              case "scroll":
                document.querySelector(argument[1]).addEventListener("scroll", ON_ELEMENT_SCROLL, { passive: true });
                break;

                default:
                  TORUS.Parent.init(document.querySelector(argument[1]), { trigger: attribute.trigger.name });
                break;
            }
          }
        } else {
          attribute.trigger.name = temp;
        }

        attribute.trigger.alias = CSS_TRIGGER_ALIAS[attribute.trigger.name];

        /** Direction. @example: `mouseX:`. direction = "x" */
        let match = /X$|Y$/i.exec(attribute.trigger.name);
        if (match) {
          attribute.trigger.direction = match[0].toLowerCase();
        } else {
          attribute.trigger.direction = "all";
        }

        if (attribute.trigger.name === "scroll") {
          attribute.trigger.direction = "y";
        }
        break;

      case "resolution":
        attribute.resolution = exec[segmentValue.indexValue];
        break;

      case "property":
        attribute.property = {};
        attribute.property.name = exec[segmentValue.indexValue];

        if (/=/.test(attribute.property.name)) {
          let split = attribute.property.name.split("=");
          attribute.property.cssFunction = split[0];
          attribute.property.name = split[1];
        }

        if (/^bg$|^border$|^color$|^shadow$/.test(attribute.property.name)) {
          attribute.priority = true;
        }
        if (/^background-color$/.test(attribute.property.name)) {
          attribute.joinSymbol = ",";
        } else {
          attribute.joinSymbol = " ";
        }

        checkPredefined(_this, attribute);
        break;

      case "values":
        createValues(_this, attribute, exec, segmentValue);

        switch (attribute.property.name) {
          case "offset":
            _this.is.inviewOffset = attribute.values.all.end.value;
            break;
        }
        break;

      case "resolution:default":
        attribute.resolution = "all";
        break;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Check for predefined properties
   * ------------------------------------------------------------------------
   */

  const checkPredefined = (_this, attribute) => {
    let predefined = CSS_PROPERTIES[attribute.property.name];

    if (predefined) {
      attribute.property.alias = predefined.propertyAlias || "";

      /** If defined, replace the original triggerAlias with `:not(<trigger>)` */
      if (predefined.cssNot && attribute.trigger) {
        attribute.trigger.alias = `:not(${CSS_TRIGGER_ALIAS[attribute.trigger.name]})`;
      }
    } else {
      /** Don't process the attribute, but only if it's not a custom one */
      if (!attribute.isCustom) {
        attribute.noCSSProcess = true;

        switch (attribute.original) {
          case "inview:revert":
            _this.is.inviewRevert = true;
            break;
        }
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Create <values> object
   * ------------------------------------------------------------------------
   */

  const createValues = (_this, attribute, exec, segmentValue) => {
    let valueSplit;
    let optionList;
    let tempValue;
    let valueObject = {};

    attribute.values = {};
    attribute.values.all = attribute.values.all || {};

    if (/\.\.\./.test(attribute.original)) {
      attribute.values.multi = true;
      let cssFunction = /\((.*?)\(/.exec(attribute.original);

      if (cssFunction) {
        attribute.values.cssFunction = cssFunction[1];
      }
    }

    tempValue = exec[segmentValue.indexValue];

    // if (/'(.*?)'/.test(tempValue)) {
    //   let exec = /'(.*?)'/.exec(tempValue);
    //   tempValue = tempValue.replace(exec[0], exec[0].replace(/,+/g, "|").replace(/'+/g, ""))
    // }

    /**
     * <options>
     * If value has options defined by `{}`
     */

    attribute.options = {};

    /** Default options */
    if (attribute.trigger) {
      if (/mouse/.test(attribute.original)) {
        attribute.options.method = "middle";
      }
      if (/scroll(?!(.*?)class)/.test(attribute.original)) {
        attribute.options.start = 0;
        attribute.options.end = "middle";
        attribute.options.method = "regular";
      }
    }

    optionList = /(,{|^{)(.*?)}/.exec(tempValue);

    if (optionList) {
      for (const option of optionList[2].split(",")) {
        let split = option.split(":");
        let optionName = split[0];
        let optionValue = split[1];

        switch (optionName) {
          case "target":
            optionValue = optionValue.replace(/\|+/g, ",").replace(/░+/g, " ");
            attribute.options[optionName] = document.querySelectorAll(optionValue);
            break;

          default:
            if (/^--/.test(optionValue)) {
              attribute.options[optionName] = `var(${optionValue})`;
            } else {
              if (CSS_PREDEFINED_VARIABLES.includes(optionValue)) {
                attribute.options[optionName] = `var(--tor-${optionValue})`;
              } else {
                attribute.options[optionName] = /true|false/.test(optionValue) ? JSON.parse(optionValue) : optionValue;
              }
            }
            break;
        }
      }

      tempValue = tempValue.replace(optionList[0], "");
    }

    /** Check for <start> and <end> values */
    valueSplit = tempValue.split(";");
    valueObject.end = valueSplit[1];

    if (valueObject.end) {
      valueObject.start = checkMultiValues(valueSplit[0]);
      valueObject.end = checkMultiValues(valueSplit[1]);
    } else {
      valueObject.start = null;
      valueObject.end = valueSplit[0];
    }


    /**
     * <resolutions>
     * Value has resolutions defined by `::`. Example: `hover:scale.to(2 lg::3)`
     */

    for (const type of ["start", "end"]) {
      if (valueObject[type]) {
        if (/(xs|sm|md|lg|xl|xxl)::/g.test(valueObject[type])) {
          for (const value of valueObject[type].split("░")) {
            const GR = getResolution(value);
            let data = checkPercentage(getValueData(GR.value));

            if (GR.resolution) {
              attribute.values[GR.resolution] = attribute.values[GR.resolution] || {};
              addData(GR.resolution, type, data);
            }
            else {
              addData("all", type, data);
            }
          }
        } else {
          /** Value has no resolutions */
          addData("all", type, checkPercentage(getValueData(valueObject[type])) );
        }
      }
    }

    /**
     * Check if it's `class-actions` attribute
     */

    if (/:class./.test(attribute.original)) {
      if (!attribute.options.target) {
        attribute.options.target = _this.element;
      }
    }

    /** Helper function */

    function addData(resolution, type, data) {
      attribute.values[resolution][type] = {};
      attribute.values[resolution].original = tempValue;

      for (const [key, value] of Object.entries({ value: data.value, unit: data.unit })) {
        attribute.values[resolution][type][key] = (value || value === 0) ? value : null;
      }
    }

    /**
    * <percentage>
    * If value has `percentage` flag - the input value is in percents. Example `opacity(50%)` -> opacity: .5
    */

    function checkPercentage(params) {
      let value;
      let unit;

      if (CSS_PROPERTIES[attribute.property.name] && CSS_PROPERTIES[attribute.property.name].percentage) {
        value = params.unit === "%" ? params.value / 100 : params.value;
        unit = null;
      } else {
        value = params.value;
        unit = params.unit;
      }

      return {
        value,
        unit
      };
    }

    /**
     * Check for multi values defined by `...`
     * @param {string} original
     * @returns {object or string}
     */

    function checkMultiValues(original) {
      let temp = original;

      if (/\.\.\./.test(temp)) {
        temp = {};
        original = original.replace("...", "");
        original = attribute.values.cssFunction ? original.replace(attribute.values.cssFunction, "").replace(/\(|\)/g, "") : original;

        for (const [i, value] of Object.entries(original.split(",") ) ) {
          let GVD = getValueData(value);
          temp[i] = {};
          temp[i].value = GVD.value;
          temp[i].unit = GVD.unit;
        }
      }

      return temp;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Get values
   * ------------------------------------------------------------------------
   */

  const getValuesForCurrentResolution = (attribute, percents, index) => {
    if (!attribute.values) {
      return {
        value: null,
        unit: null,
      };
    }

    let unit;
    let start = 0;
    let end;
    let value;

    for (let i = 0; i <= CSS_BREAKPOINTS[WINDOW.resolution.name].id; i++) {
      let breakpoints = Object.keys(CSS_BREAKPOINTS).find(key => CSS_BREAKPOINTS[key].id === i);
      let available = attribute.values[breakpoints];

      if (available) {
        if (available.start) {
          start = index ? available.start.value[index].value : available.start.value;
        }
        if (available.end) {
          end = index ? available.end.value[index].value : available.end.value;

          if (index) {
            unit = available.end.value[index].unit ? available.end.value[index].unit : "";
          } else {
            unit = available.end.unit ? available.end.unit : "";
          }
        }
      }

      if (typeof start === "string" || typeof end === "string")  {
        value = percents < 1 ? start : end;
      } else {
        value = Math.round((start + ((end - start) * percents)) * 1000) / 1000;
      }
    }

    if (/true|false/.test(value)) {
      value = JSON.parse(value);
    }

    return {
      value,
      unit,
      start,
      end,
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Wrap element
   * ------------------------------------------------------------------------
   */

  const wrapElement = (elements, wrapper, elementClass) => {
    if(elements instanceof Node) {
      elements = [elements];
    }

    if (wrapper instanceof Object) {
      let newElement = document.createElement("div");
      for (const element of elements) {
        newElement.appendChild(element);
      }

      wrapper.appendChild(newElement);
      elementClass && newElement.classList.add(elementClass);
    }
    else {
      for(let element of elements) {
        let newElement;
        let parentElement;
        let nextElement;

        nextElement = element.nextElementSibling;

        if(wrapper === "svg") {
          newElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          newElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }
        else {
          newElement = document.createElement(wrapper);
        }

        parentElement = element.parentElement;
        newElement.appendChild(element);
        elementClass && newElement.classList.add(elementClass);
        parentElement.insertBefore(newElement, nextElement);
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Transform string to camel case
   * ------------------------------------------------------------------------
   */

   String.prototype.toCamelCase = function () {
    return this.replace(/[-_]+/g, " ").replace(/ (.)/g, function ($1) { return $1.toUpperCase(); }).replace(/ /g, "");
  };

  /**
   * ------------------------------------------------------------------------
   * Check if SVG element (including <g> element) is in viewport
   * ------------------------------------------------------------------------
   */

  const SVGIntersection = (bounds, method) => {
    let addition = 0;

    if (method === "intersecting") {
      addition = WINDOW.height/2;
    }

    return WINDOW.scroll.y + WINDOW.height + addition >= bounds.offsetTop &&
           WINDOW.scroll.y + WINDOW.height - addition <= bounds.offsetTop + bounds.height + WINDOW.height
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate SVG elements bounds (Chrome only)
   * ------------------------------------------------------------------------
   */

  const SVGBounds = (entry) => {
    if (WINDOW.idleCallback) {
      requestIdleCallback(() => {
        bounds(entry);
      });
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bounds(entry);
        }, 0);
      });
    }

    function bounds(entry) {
      if (/svg/i.test(entry.target.nodeName)) {
        entry.target.TORUS = entry.target.TORUS || {};
        entry.target.TORUS.svg = entry.target.TORUS.svg || {};

        let rect = entry.boundingClientRect;
        let target = entry.target.TORUS.svg;
        let realWidth = entry.target.width.baseVal.value;
        let viewBoxWidth = entry.target.viewBox.baseVal.width ? entry.target.viewBox.baseVal.width : realWidth;

        target.rect = {
          offsetLeft: rect.left + WINDOW.scroll.x,
          offsetTop: rect.top + WINDOW.scroll.y,
        };

        for (const _this of target.children) {
          _this.set.bounds(_this.element.getBBox(), { rect: target.rect, ratio: realWidth / viewBoxWidth });
          _this.set.intersecting(SVGIntersection(_this.bounds, "intersecting"));

          if (_this.is.inviewElement) {
            _this.set.inview(SVGIntersection(_this.bounds, "inview"));
          }
        }
        target.calculated = true;
      }
    }
  };

  const inviewOriginalPosition = (_this) => {
    let scrolledTop = ((WINDOW.scroll.y + WINDOW.height - _this.bounds.offsetTopOriginal) / WINDOW.height) * 100;
    let scrolledBottom = ((WINDOW.scroll.y + WINDOW.height - _this.bounds.offsetBottom) / WINDOW.height) * 100;

    if (scrolledTop >= 0 && scrolledBottom < 100) {
      !_this.is.inview && _this.set.inview(true, true);
    } else {
      _this.is.inview && _this.set.inview(false, true);
    }
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * SETS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * CSS
   * ------------------------------------------------------------------------
   */

  const CSS_SET = {
    breakpoints: {},
    styles: new Set(),
  };

  for (const breakpoint of Object.keys(CSS_BREAKPOINTS)) {
    CSS_SET.breakpoints[breakpoint] = new Set();
  }

  /**
   * ------------------------------------------------------------------------
   * ELements sets
   * ------------------------------------------------------------------------
   */

  const INVIEW_ELEMENTS = new Set();
  const SCROLL_ELEMENTS = new Set();
  const MOUSE_ELEMENTS = new Set();
  const GROUP_ELEMENTS = new Set();
  const CLASS_SCROLL_ELEMENTS = new Set();
  const SVG_ELEMENTS = new Set();

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * OBSERVERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Intersection observer
   * ------------------------------------------------------------------------
   */

  const onIntersect = (entries, observer) => {
    for (const entry of entries) {
      const _this = entry.target.TORUS;

      if(_this) {
        /**
         * Main `data-tor` element
         */
        if (_this.Main) {
          /** Calculate the element bounds. Run only once */
          if (!_this.Main.bounds.calculated) {

            /** ScrollY is not undefined */
            if (WINDOW.scroll.y !== undefined) {
              _this.Main.set.bounds(entry.boundingClientRect);

              /** Element is intersecting */
              if (!_this.Main.is.svgChild) {
                if (entry.isIntersecting) {
                  /** Check intersecting */
                  _this.Main.set.intersecting(entry.isIntersecting);

                  /** Check inview */
                  // if (_this.Main.is.inviewElement) {
                  //   _this.Main.run.inview();
                  // }
                }
              }
            }
          }

          if (/ 50%/.test(observer.rootMargin)) {
            if (!_this.Main.is.svgChild) {
              _this.Main.set.intersecting(entry.isIntersecting);
            }
          }

          if (/ 0%/.test(observer.rootMargin)) {
            if (!_this.Main.has.originalPosition) {
              _this.Main.set.inview(entry.isIntersecting);
            } else {
              inviewOriginalPosition(_this.Main);
            }
          }
        }

        /**
         * parent `data-tor-parent` element
         */
        if (_this.Parent) {
          if (_this.Parent.is.inviewElement) {
            _this.Parent.run.inview();
          }
          if (/ 0%/.test(observer.rootMargin)) {
            _this.Parent.set.inview(entry.isIntersecting);
          }
        }

        /**
         * Chrome bug
         *
         * `intersectionObserver` doesn't work in Chrome for SVG elements, so we need to get the parent SVG rect
         * and use them on `getIntersectionList` function later
         */

        if (WINDOW.isUnsupportedSVG && _this.svg) {
          SVGBounds(entry);
        }
      }
    }
  };

  const INTERSECTION_OBSERVER = new IntersectionObserver(onIntersect, {root: null, rootMargin: "50%"});
  const INVIEW_OBSERVER = new IntersectionObserver(onIntersect, {root: null, rootMargin: "0%"});

  /**
   * ------------------------------------------------------------------------
   * Mutation
   * ------------------------------------------------------------------------
   */

  let MUTATION_OBSERVER;

  const MUTATION = () => {
    /** Append new <style> to <head> */
    document.head.appendChild(STYLE);

    const inits = ["Group", "Parent", "Main", "Slider"];

    const callback = () => {
      for (let i = 0; i < inits.length; i++) {
        TORUS[inits[i]].init();
      }

    };

    MUTATION_OBSERVER = new MutationObserver(callback);
    MUTATION_OBSERVER.observe(document, {childList: true, subtree: true});
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * LISTENER HANDLERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  function ON_RESIZE() {
    let tick = 0;

    if (!WINDOW.resizing) {
      requestAnimationFrame(raf);
      WINDOW.resizing = true;
    }

    function raf() {
      if (tick >= 50) {
        WINDOW.resizing = false;
        cancelAnimationFrame(raf);

        WINDOW.height = window.innerHeight || document.documentElement.clientHeight;
        WINDOW.width = window.innerWidth || document.documentElement.clientWidth;
        getCurrentResolution();

        if (TORUS.Main) {
          TORUS.Main.refresh();
        }

        if (TORUS.Loop) {
          TORUS.Loop.refresh();
        }

        if (TORUS.Slider) {
          TORUS.Slider.refresh();
        }
      }
      else {
        tick = tick + 1;
        requestAnimationFrame(raf);
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * On Scroll
   * ------------------------------------------------------------------------
   */

  const ON_SCROLL = () => {
    let scroll = WINDOW.scroll;

    scroll.tick = 0;
    getWindowScroll();

    if (!scroll.running) {
      requestAnimationFrame(ON_RAF);
      scroll.running = true;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * On Element Scroll
   * ------------------------------------------------------------------------
   */

  const ON_ELEMENT_SCROLL = (e) => {

    // scroll.tick = 0;
    console.log(e.target.scrollTop);

    // if (!scroll.running) {
    //   requestAnimationFrame(ON_RAF);
    //   scroll.running = true;
    // }
  };

  /**
   * ------------------------------------------------------------------------
   * On Mouse
   * ------------------------------------------------------------------------
   */

  const ON_MOUSE = (e) => {
    let mouse = WINDOW.mouse;

    mouse.tick = 0;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!mouse.running) {
      requestAnimationFrame(ON_RAF);
      mouse.running = true;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * On RequestAnimationFrame
   * ------------------------------------------------------------------------
   */

  const ON_RAF = () => {
    let mouseActive = checkMouse(WINDOW.mouse).running;
    let scrollActive = checkScroll(WINDOW.scroll).running;

    if (mouseActive) {
      for (const _this of MOUSE_ELEMENTS) {
        _this.run.event("mouse");
      }
    }

    if (scrollActive) {
      for (const _this of SCROLL_ELEMENTS) {
        _this.run.event("scroll");
      }

      for (const _this of MOUSE_ELEMENTS) {
        if (_this.is.intersecting) {
          _this._setBounds(false);
        }
      }

      for (const _this of CLASS_SCROLL_ELEMENTS) {
        _this.run.classScroll();
      }

      if (WINDOW.isUnsupportedSVG) {
        for (const _this of SVG_ELEMENTS) {
          _this.set.intersecting(SVGIntersection(_this.bounds, "intersecting"));
          if (_this.is.inviewElement) {
            _this.set.inview(SVGIntersection(_this.bounds, "inview"));
          }
        }
      }

      for (const _this of INVIEW_ELEMENTS) {
        if (_this.is.intersecting && _this.is.inviewOffset) {
          let scrolled = ((WINDOW.scroll.y + WINDOW.height - _this.bounds.offsetTop) / WINDOW.height) * 100;
          if (scrolled >= _this.is.inviewOffset) {
            !_this.is.inview && _this.set.inview(true, true);
          } else {
            _this.is.inview && _this.set.inview(false, true);
          }
        } else if (_this.has.originalPosition) {
          inviewOriginalPosition(_this);
        } else {
          INVIEW_OBSERVER.observe(_this.element);
        }
      }
    }

    if (scrollActive || mouseActive) {
      requestAnimationFrame(ON_RAF);
    } else {
      cancelAnimationFrame(ON_RAF);
    }

  };

  function checkScroll(e) {
    if (e.tick >= 10) {
      e.running = false;
    } else {
      e.tick += 1;
    }
    return e;
  }

  function checkMouse(e) {
    if (e.tick >= 5) {
      e.running = false;
    } else {
      e.tick += 1;
    }
    return e;
  }

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * On DOMContentLoaded
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  const ON_DOM = () => {
    WINDOW.DOMReady = true;

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === document.documentElement) {
          if (WINDOW.idleCallback) {
            requestIdleCallback(() => TORUS.Main.refresh());
          } else {
            requestAnimationFrame(() => TORUS.Main.refresh());
          }
        }
      }
    });

    requestAnimationFrame(() => {
      document.body.classList.add("tor-loaded");
      WINDOW.isChrome && document.body.classList.add("tor-chrome");
      WINDOW.isSafari && document.body.classList.add("tor-safari");
      MUTATION_OBSERVER.disconnect();
      TORUS.BgImage.init();
      ro.observe(document.documentElement);
    });

    if (WINDOW.idleCallback) {
      requestIdleCallback(() => getWindowScroll());
    } else {
      requestAnimationFrame(() => getWindowScroll());
    }
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * LISTENERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  window.addEventListener("scroll", ON_SCROLL, { passive: true });
  window.addEventListener("pointermove", ON_MOUSE, { passive: true });
  window.addEventListener("resize", ON_RESIZE);
  window.addEventListener("DOMContentLoaded", ON_DOM);

  TORUS.Group = class {
    constructor(element) {
      /** this element */
      this.element = element;

      if (!this.element.dataset.torGroup) {
        return;
      }

      /** Optimize and replace original [data-tor] attribute */
      this.element.dataset.torGroup = optimizeAttribute(this.element.dataset.torGroup);

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.torGroup.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░"));

      /** Create store objects */
      this.attributes = this.attributes || {};
      this.targets = [];

      this._sortAttributes();
      this._assignAttributes();
      TORUS.Main.init(this.targets);
    }

    _sortAttributes() {
      let group = this.dataset.match(/(.*?);(?![^()]*\))/g);

      if (!group) {
        console.error("Missing semicolon at the end of " + this.dataset);
        return;
      }

      for (const item of group) {
        let target = /^(.*?)=>/.exec(item)[1];
        let attributes = /=>(.*?)$/.exec(item)[1].replace(/;$/, "").replace(/\s+(?=[^[\]]*\])/g, "░");

        this.attributes[target] = this.attributes[target] || {};

        for (const [i, attribute] of Object.entries(attributes.split(" "))) {
          this.attributes[target][i] = attribute;
        }
      }
    }

    _assignAttributes() {
      for (const [targets, attributes] of Object.entries(this.attributes)) {
        let count = 0;
        let allTargets = this.element.querySelectorAll(targets);

        for (const target of allTargets) {
          let tempAttributes = [];

          for (let attribute of Object.values(attributes)) {
            attribute = attribute.replace(/░+/g, " ");

            /** Has counting */
            if (/\/(.*?)\//.test(attribute)) {
              tempAttributes.push(this._counting(count, attribute));
            } else {
              tempAttributes.push(attribute);
            }
          }
          count += 1;

          if (target.dataset.tor) {
            target.dataset.tor = target.dataset.tor + " " + tempAttributes.join(" ");
          } else {
            target.dataset.tor = tempAttributes.join(" ");
          }
          GROUP_ELEMENTS.add(target);
          this.targets.push(target);
        }
      }
    }

    _counting(count, attribute) {
      let startFinal;
      let endFinal;

      const original = attribute.match(/\/(.*?)\/+/g);

      for (const match of original) {
        const split = match.split(";");
        let start = split[0];
        let end = split[1];

        /** Only <start> and no <end> value */
        if (!end) {
          end = start;
          start = null;
        }

        /** Check if <start> value has counting defined by `//` */
        if (/\/(.*?)\//.test(start)) {
          startFinal = getCounting(count, start);
        } else {
          startFinal = start;
        }

        /** Check if <end> value has counting defined by `//` */
        if (/\/(.*?)\//.test(end)) {
          endFinal = getCounting(count, end);
        } else {
          endFinal = end;
        }
        attribute = attribute.replace(match, `${startFinal ? startFinal + ";" : ""}${endFinal}`);
      }
      return attribute;
    }

    /**
     * ------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------
     */

    static init(elements) {
      elements = getIterableElement(elements || "[data-tor-group]");
      initClass({ name: "Group", elements: elements });
    }

  };

  var group = TORUS.Group;

  TORUS.Parent = class {
    constructor(element, options) {
      /** this element */
      this.element = element;

      this.element.torusInitializedParent = true;

      if (options) {
        if (options.trigger) {
          this.element.dataset.torParent = this.element.dataset.torParent ? this.element.dataset.torParent + " " + options.trigger : options.trigger;
        }
      }

      /** Optimize and replace original [data-tor-parent] attribute */
      this.element.dataset.torParent = expandCluster(optimizeAttribute(this.element.dataset.torParent, true));

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.torParent.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.is = this.is || {};
      this.has = this.has || {};
      this.attributes = this.attributes || {};

      this._getterSetter();
      this._sortAttributes();
      this._addToElementsSet();
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Setter */
      this.set = {
        inview: (status, force) => {
          if (!this.is.inviewOffset || force) {
            this.is.inview = status;

            if (status) {
              requestAnimationFrame(() => this.element.classList.add("inview"));
            } else {
              if (this.is.inviewRevert) {
                this.element.classList.remove("inview");
              }
            }
          }
        },
      };

      /** Runner */
      this.run = {
        inview: () => {
          INVIEW_OBSERVER.observe(this.element);
        },
      };

    }

    /**
     * ------------------------------------------------------------------------
     * Sort attributes
     * ------------------------------------------------------------------------
     */

    _sortAttributes() {
      let temp = {};

      for (const dataAttribute of this.dataset) {
        temp.static = temp.static || [];
        temp.static.push(dataAttribute);
      }

      for (const [group, array] of Object.entries(temp)) {
        createPropertiesObject(this, array, group);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Add element to corresponding set
     * ------------------------------------------------------------------------
     */

    _addToElementsSet() {
      if (/inview/.test(this.dataset)) {
        this.is.inviewElement = true;
        INVIEW_ELEMENTS.add(this);
        this.run.inview();
      }
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static init(elements, options) {
      elements = getIterableElement(elements || "[data-tor-parent~='inview']");

      if(elements) {
        initClass({ name: "Parent", elements: elements, options: options });
      }
    }
  };

  var parent = TORUS.Parent;

  TORUS.Main = class {
    constructor(element) {
      /** this element */
      this.element = element;

      this.element.torMainInit = true;

      /** Optimize and replace original [data-tor] attribute */
      this.element.dataset.tor = expandCluster(optimizeAttribute(this.element.dataset.tor, true));

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.tor.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.is = this.is || {};
      this.has = this.has || {};
      this.attributes = this.attributes || {};
      this.bounds = this.bounds || {};

      /** Getters and Setters init */
      this._getterSetter();

      /** Call functions */
      this._sortAttributes();
      this.get.bounds();
      this._addToElementsSet();
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Getter */
      this.get = {
        bounds: () => {
          this._getBounds();
        }
      };

      /** Setter */
      this.set = {
        bounds: (bounds, svgParentRect) => {
          this._setBounds(bounds, svgParentRect);
          // TODO:
          // requestAnimationFrame(() => this.element.classList.remove("tor-hidden"));
        },

        intersecting: (status) => {
          this.is.intersecting = status;
        },

        inview: (status, force) => {
          if (!this.is.inviewOffset || force) {
            this.is.inview = status;

            if (status) {
              /**
               * Chrome bug
               *
               * Sometimes when user start to scroll immediately before DOMContentReady,
               * the `.inview` class is being added immediately without CSS transition.
               * To hack this, we need to add a little bit of delay if DOM is not ready
               */
              let delay = 0;
              if (WINDOW.isChrome) {
                delay = WINDOW.DOMReady ? 0 : 200;
              }

              requestAnimationFrame(() => {
                setTimeout(() => {
                  this.element.classList.add("inview");
                }, delay);
              });
            } else {
              if (this.is.inviewRevert) {
                requestAnimationFrame(() => this.element.classList.remove("inview"));
              }
            }
          }
        },
      };

      /** Runner */
      this.run = {
        inview: () => {
          INVIEW_OBSERVER.observe(this.element);
        },
        event: (event, params) => {
          this._runEvent(event, params);
        },
        classScroll: () => {
          this._onClassScroll();
        },
      };

    }

    /**
     * ------------------------------------------------------------------------
     * Sort attributes
     * ------------------------------------------------------------------------
     */

    _sortAttributes() {
      let temp = {};

      for (const dataAttribute of this.dataset) {
        if (/class./.test(dataAttribute)) {
          temp.class = temp.class || [];
          temp.class.push(dataAttribute);
        } else if (/mouse|scroll|sensor/.test(dataAttribute)) {
          temp.dynamic = temp.dynamic || [];
          temp.dynamic.push(dataAttribute);
          this.is.dynamicAttribute = true;
        } else if (/loop:/.test(dataAttribute)) {
          temp.loop = temp.loop || [];
          temp.loop.push(dataAttribute);
        } else {
          temp.static = temp.static || [];
          temp.static.push(dataAttribute);

          if (/^inview(.*?)(pull\.up|@transform=translateY\(\d)/.test(dataAttribute)) {
            this.has.originalPosition = true;
            this.element.classList.add("tor-original-position");
          }
        }
      }

      for (const [group, array] of Object.entries(temp)) {
        createPropertiesObject(this, array, group);

        group === "static" && this._CSSAddToSet(this.attributes.static);
        group === "loop"   && this._LOOPCreate();
        group === "class"  && this._CLASSAddListeners(array);
      }

      if (this.attributes.dynamic && this.is.dynamicAttribute) {
        this.attributes.dynamic.styles = {};
        this.attributes.dynamic.currentStyles = new Set();

        // TODO:
        // this.element.classList.add("tor-hidden");
      }

      /** Create hover hit area for some effects */
      if (/hover:(.*?)(push|pull|rotate)/.test(this.dataset)) {
        if (!this.element.querySelector(".tor-hit-area")) {
          const hit = document.createElement("span");
          hit.classList.add("tor-hit-area");
          this.element.appendChild(hit);
        }
      }

      if (/:block\(/.test(this.dataset)) {
        let block = document.createElement("span");
        block.classList.add("tor-block-element");
        this.element.appendChild(block);
      }

      // this.element.style.setProperty("transform", "none", "important");
    }

    /**
     * ------------------------------------------------------------------------
     * Create CSS looped animations rules
     * ------------------------------------------------------------------------
     */

    _LOOPCreate() {
      if (!this.attributes.loop) {
        return;
      }

      let names = [];
      let durations = [];
      let timings = [];
      let directions = [];
      let delays = [];
      let pauses = {};
      let hasPause = false;
      let indexes = {};

      for (const [i, attribute] of Object.entries(this.attributes.loop.loop)) {
        let radiate = /(radiate)(.*?)+/.exec(attribute.property.name);
        if (radiate) {
          attribute.property.name = attribute.property.name.replace(radiate[0], radiate[1]);
        }

        let name = `loop-${attribute.property.name.replace(/\./g, "-")}`;
        let duration = `calc(var(--tor-${name}-duration) * var(--tor-${name}-speed,1))`;
        let timing = `var(--tor-${name}-timing)`;
        let direction = `var(--tor-${name}-direction)`;

        let currentEnd = getValuesForCurrentResolution(attribute, 1);
        let currentStart = getValuesForCurrentResolution(attribute, 1).start;

        pauses[name] = {
          index: Number(i),
          pause: null,
          iterations: 0,
          currentIteration: 0,
        };

        indexes[i] = false;

        if (currentEnd.value) {
          this.element.style.setProperty(`--tor-${name}-value`, `${currentEnd.value}${currentEnd.unit}`);
        } else {
          this.element.style.removeProperty(`--tor-${name}-value`);
        }

        if (currentStart) {
          this.element.style.setProperty(`--tor-${name}-value-start`, `${currentStart}${currentEnd.unit}`);
        }

        if (attribute.options) {
          for (const [key, value] of Object.entries(attribute.options)) {
            switch (key) {
              case "pause":
                let temp = getValueData(attribute.options.pause);
                pauses[name].pause = temp.unit === "s" ? temp.value * 1000 : temp.value;
                hasPause = true;
                break;

              case "iterations":
                pauses[name].iterations = Number(attribute.options.iterations);
                break;

              case "delay":
                delays.push(`var(--tor-${name}-delay)`);
                this.element.style.setProperty(`--tor-${name}-delay`, `${value}`);
                break;

              default:
                this.element.style.setProperty(`--tor-${name}-${key}`, `${value}`);
                break;
            }
          }
        }

        names.push(name);
        durations.push(duration);
        timings.push(timing);
        directions.push(direction);
      }

      this.element.style.setProperty("animation-name", names.join(", "));
      this.element.style.setProperty("animation-duration", durations.join(", "));
      this.element.style.setProperty("animation-timing-function", timings.join(", "));
      this.element.style.setProperty("animation-direction", directions.join(", "));
      delays.length && this.element.style.setProperty("animation-delay", delays.join(", "));

      if (hasPause) {
        /** Do on animation iteration */
        this.element.onanimationiteration = (e) => {

          /** Do only it it's current element */
          if (e.target === this.element) {

            /** If loop has `iterations` option, add to `currentIteration` counter */
            if (pauses[e.animationName].iterations) {
              pauses[e.animationName].currentIteration++;
            }

            /** If `currentIteration` equals the predefined iteration */
            if (pauses[e.animationName].iterations === pauses[e.animationName].currentIteration) {
              pauses[e.animationName].currentIteration = 0;

              if (pauses[e.animationName].pause) {
                let pause = pauses[e.animationName].pause;
                indexes[pauses[e.animationName].index] = true;

                let states = [...Object.values(indexes)].map(item => { return item ? "paused" : "running" });
                this.element.style.setProperty("animation-play-state", states.join(", "));

                let time = setTimeout(() => {
                  indexes[pauses[e.animationName].index] = false;
                  states = [...Object.values(indexes)].map(item => { return !item ? "running" : "paused" });
                  this.element.style.setProperty("animation-play-state", states.join(", "));
                  clearTimeout(time);
                }, pause);
              }
            }
          }
        };
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Create `@media` CSS rules and add to global CSS_SET
     * ------------------------------------------------------------------------
     */

    _CSSAddToSet(attributes) {

      for (const items of Object.values(attributes)) {
        for (const attribute of Object.values(items)) {
          if (attribute.noCSSProcess) {
            continue;
          }

          let CSSOptions = "";
          let CSSAdditional = "";
          let CSSParent = "";
          let tempOptions = [];
          let CSSWrap = null;

          let CSSTrigger = attribute.trigger ? `-${attribute.trigger.name}` : "";
          let CSSTriggerAlias = attribute.trigger ? attribute.trigger.alias : "";
          let CSSPriority = attribute.priority ? " !important" : "";
          let CSSPropertyName = attribute.property.name;
          let CSSPropertyAlias = attribute.property.alias;

          /** Default if no values */
          if (!attribute.values) {
            attribute.values = {
              all: {
                end: {
                  value: "0%",
                }
              }
            };
          }

          if (attribute.trigger && attribute.trigger.argument) {
            if (attribute.trigger.argument === "parent") {
              CSSParent = `[data-tor-parent~="${attribute.trigger.name}"]`;
            } else {
              CSSParent = `${attribute.trigger.argument}`;
            }
          }

          if (attribute.property.cssFunction) {
            CSSWrap = CSSPropertyName;
            CSSPropertyName = attribute.property.cssFunction;
          }

          /**
           * ---
           * If it's <custom> attribute. Example: `hover@padding(3rem)`
           * ---
           */

          if (attribute.isCustom) {
            /** Responsive <effect>. Example: `hover:xl::@margin(50%)` */
            for (const type of ["start", "end"]) {

              /** If attribute has <start> or <end> values */
              if (attribute.values.all[type]) {

                let triggerAlias = (type === "end") ? CSSTriggerAlias : "";
                let parent = CSSParent ? CSSParent + triggerAlias : "";

                /** default (start) value */
                addCSSRules({
                  triggerAlias: triggerAlias,
                  rule: CSSPropertyName,
                  value: attribute.values.all[type].value,
                  unit: attribute.values.all[type].unit,
                  cssParent: parent,
                });

                /** Responsive <values>. Example: `hover:opacity(10% xl::50%)` */
                for (const [breakpoint, value] of Object.entries(attribute.values)) {
                  addCSSRules({
                    resolution: breakpoint,
                    triggerAlias: triggerAlias,
                    rule: CSSPropertyName,
                    value: value[type].value,
                    unit: value[type].unit,
                    cssParent: parent,
                  });
                }
              }
            }
          } else {

            /**
             * ---
             * Else, it's <static> attribute. Example: `hover:blur(sm)`
             * ---
             */

            let CSSValue = "";
            let CSSUnit = "";

            if (attribute.values) {
              /** Values */
              if (attribute.values.all.end) {
                CSSValue = attribute.values.all.end.value;
              } else {
                console.warn(`No default responsive value in "${attribute.original}" attribute. Setting "0" as default.`);
                CSSValue = "0";
              }

              /** Unit */
              if (attribute.values.all.end) {
                CSSUnit = attribute.values.all.end.unit;
              }
            }

            /**
             * Create CSS variables from options and push them to array
             */

            if (attribute.options) {
              for (const [key, value] of Object.entries(attribute.options)) {
                if (key !== "target") {
                  tempOptions.push(`--tor-${attribute.property.name}-${key}: ${getCSSVariable({ property: key, value: value })}`);
                }
              }
              CSSOptions = `${tempOptions.length === 1 ? `${tempOptions};` : tempOptions.join(";")}`;
            }

            /**
             * Add additional CSS rules if applicable
             */

            if (CSS_PROPERTIES[attribute.property.name].additionalRules) {
              CSSAdditional = CSS_PROPERTIES[attribute.property.name].additionalRules;
            }

            /**
            * Add <default> CSS rule
            */

            let parent = CSSParent ? CSSParent + CSSTriggerAlias : "";

            addCSSRules.call(this, {
              trigger: CSSTrigger,
              triggerAlias: CSSTriggerAlias,
              rule: CSSPropertyAlias,
              value: CSSValue,
              unit: CSSUnit,
              cssParent: parent,
            });

            /**
            * Add <custom> CSS rule
            * Responsive <values>. Example: `hover:opacity(10% xl::50%)`
            */

            for (const [breakpoint, value] of Object.entries(attribute.values)) {
              if (breakpoint !== "all") {
                addCSSRules.call(this, {
                  resolution: breakpoint,
                  triggerAlias: CSSTriggerAlias,
                  rule: CSSPropertyAlias,
                  value: value.end.value,
                  unit: value.end.unit,
                  cssParent: parent,
                });
              }
            }
          }

          /**
           * Create and add CSS rules to CSS_SET
           */


          function addCSSRules(_) {

            const getCSS = getCSSVariable({
              property: _.propertyName || CSSPropertyName,
              value: _.value,
              unit: _.unit,
              wrap: CSSWrap
            });

            let css =
              `${_.cssParent ? _.cssParent : ""} [data-tor${_.selector || "~"}="${_.original || attribute.original}"]${!_.cssParent ? _.triggerAlias : ""} {
              ${_.rule}: ${getCSS}${_.priority || CSSPriority};
              ${/\:not/.test(_.triggerAlias) ? "" : _.options || CSSOptions}
              ${CSSAdditional}
            }
            ${_.options || CSSOptions ? `[data-tor${_.selector || "~"}="${_.original || attribute.original}"]{
              ${_.options || CSSOptions}
            }` : ""}
            `
                .replace(/ +/g, " ").replace(/\t|\n|\r+/g, "").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(";;", ";").trim();

            let breakpoint = _.resolution || attribute.resolution;
            let set = CSS_SET.breakpoints[breakpoint];

            if (!set.has(css)) {
              insertStylesheet(`@media (min-width: ${CSS_BREAKPOINTS[breakpoint].value}${CSS_BREAKPOINTS[breakpoint].unit}) { ${css} }`);
              set.add(css);
            }
          }

        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Get element bounds
     * ------------------------------------------------------------------------
     */

    _getBounds() {
      this.bounds.calculated = false;
      let svgParent = this.element.ownerSVGElement;

      if (/^inview(.*?)(pull\.up|@transform=translateY\(\d)/.test(this.dataset)) {
        this.element.classList.add("tor-original-position");
      }

      /**
       * Chrome bug
       *
       * `intersectionObserver` doesn't work in Chrome, so we need to get the parent SVG rect
       */

      if (WINDOW.isUnsupportedSVG && svgParent) {
        if (svgParent) {
          let svg;

          svgParent.TORUS = svgParent.TORUS || {};
          svgParent.TORUS.svg = svgParent.TORUS.svg || {};

          this.is.svgChild = true;
          this.has.svgParent = svgParent;

          svg = svgParent.TORUS.svg;
          svg.children = svg.children || new Set();
          svg.children.add(this);

          if (WINDOW.isSafari) {
            // requestAnimationFrame(() => {
              setTimeout(() => {
                INTERSECTION_OBSERVER.observe(svgParent);
              }, 50);
            // })
          } else {
            INTERSECTION_OBSERVER.observe(svgParent);
          }
        }
      } else {
        INTERSECTION_OBSERVER.observe(this.element);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Set element bounds
     * ------------------------------------------------------------------------
     */

    _setBounds(bounds, svgParentRect) {
      let max;
      let B = this.bounds;
      let ratio = 1;
      let scrollLeft = WINDOW.scroll.x;
      let scrollTop = WINDOW.scroll.y;

      if (WINDOW.isUnsupportedSVG && svgParentRect) {
        ratio = svgParentRect.ratio;
        scrollLeft = svgParentRect.rect.offsetLeft;
        scrollTop = svgParentRect.rect.offsetTop;
      }

      if (bounds) {
        B.calculated  = true;
        B.rect        = bounds;
        B.width       = B.rect.width * ratio;
        B.height      = B.rect.height * ratio;
        B.top         = B.rect.y * ratio;
        B.left        = B.rect.x * ratio;
        B.right       = B.rect.right || B.left + B.width;
        B.bottom      = B.rect.bottom || B.top + B.height;
        B.offsetLeft  = B.left + scrollLeft;
        B.offsetTop   = B.top + scrollTop;
        B.offsetBottom = B.bottom + scrollTop;
        B.centerX     = B.offsetLeft + B.width / 2 - WINDOW.scroll.x;
        B.centerY     = B.offsetTop + B.height / 2 - WINDOW.scroll.y;

        if (/^inview(.*?)(pull\.up|@transform=translateY\(\d)/.test(this.dataset)) {
          B.offsetTopOriginal = B.offsetTop;
          this.element.classList.remove("tor-original-position");
        }

        // this._runAllEvents();
      } else {
        // TODO: test dynamic scrollTop for SVG on Chrome

        B.centerX = B.offsetLeft + B.width / 2 - WINDOW.scroll.x;
        B.centerY = B.offsetTop + B.height / 2 - WINDOW.scroll.y;
        this._runAllEvents("mouse");
      }

      max = getMaxSide(this);
      this.bounds.maxDiagonal = Math.round(max.corner);
      this.bounds.maxXSide = max.xSide;
      this.bounds.maxYSide = max.ySide;

      // TODO:
      // if (this.is.dynamicAttribute) {
      //   requestAnimationFrame(() => this.element.classList.remove("tor-hidden"))
      // }
    }

    /**
     * ------------------------------------------------------------------------
     * Add element to corresponding set
     * ------------------------------------------------------------------------
     */

    _addToElementsSet() {
      if (/scroll(.*?)\:(?!(.*?)class)/.test(this.dataset)) {
        SCROLL_ELEMENTS.add(this);
      }
      if (/scroll(.*?)class/.test(this.dataset)) {
        CLASS_SCROLL_ELEMENTS.add(this);
      }
      if (/mouse(.*?)\:/.test(this.dataset)) {
        MOUSE_ELEMENTS.add(this);
      }
      if (/inview(?!\()/.test(this.dataset)) {
        this.is.inviewElement = true;
        INVIEW_ELEMENTS.add(this);
      }
      if (this.element.ownerSVGElement) {
        SVG_ELEMENTS.add(this);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Run all events in loop to set the starting value immediately
     * ------------------------------------------------------------------------
     */

    _runAllEvents(event) {
      if (event) {
        if (this.attributes.dynamic && this.attributes.dynamic[event]) {
          this.run.event(event, true);
        }
      } else {
        for (const event of ["mouse", "scroll", "sensor", "inview"]) {
          if (event === "inview" && this.is.inviewElement) {
            this.run.inview();
          }
          if (this.attributes.dynamic && this.attributes.dynamic[event]) {
            this.run.event(event, true);
          }
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Run events for dynamic attributes
     * @example: `scroll:@scale(0;1)`
     * ------------------------------------------------------------------------
     */

    _runEvent(event, force) {
      if (!this.is.intersecting) {
        if(!force) {
          return;
        }
      }

      let cssName;
      let fullValue;
      let wrap = [];
      let dynamic = this.attributes.dynamic;

      if (!dynamic) {
        return;
      }

      dynamic.allStyles = dynamic.allStyles || {};

      /**
       * Create `styles` object that stores the `live` CSS values
       */

      for (const group of Object.values(dynamic[event])) {
        for (const attribute of Object.values(group)) {
          let all;
          let percents = getPercents(this, { event: event, options: attribute.options })[attribute.trigger.direction];

          dynamic.styles[attribute.resolution] = dynamic.styles[attribute.resolution] || {};
          dynamic.styles[attribute.resolution][attribute.property.name] = dynamic.styles[attribute.resolution][attribute.property.name] || {};

          /**
           * Declare CSS styles
           */

          /** Attribute has multi values defined by `...` */
          if (attribute.values.multi) {
            all = [];

            for (let i in attribute.values.all.start.value) {
              let GV = getValuesForCurrentResolution(attribute, percents, i);
              all.push(`${GV.value}${GV.unit}`);
            }

            all = attribute.values.cssFunction ? `${attribute.values.cssFunction}(${all.join(attribute.joinSymbol)})` : all.join(" ");
          } else {
            let GV = getValuesForCurrentResolution(attribute, percents);
            dynamic.styles[attribute.resolution][attribute.property.name].cssFunction = attribute.property.cssFunction;
            all = `${GV.value}${GV.unit}`;
          }

          dynamic.styles[attribute.resolution][attribute.property.name][`${event}${attribute.trigger.direction}`] = all;
          dynamic.styles[attribute.resolution][attribute.property.name].targets = attribute.options.target;
          dynamic.styles[attribute.resolution][attribute.property.name].priority = attribute.priority || "";
        }
      }

      /**
       * Loop trough all breakpoints from the current one down, and find the first object from the `styles`, that matches
       * the resolution from the loop
       */

      for (let i = CSS_BREAKPOINTS[WINDOW.resolution.name].id; i >= 0; i--) {
        let availableBreakpoints = Object.keys(CSS_BREAKPOINTS).find(key => CSS_BREAKPOINTS[key].id === i);

        if (dynamic.styles[availableBreakpoints]) {
          dynamic.currentStyles.add(Object.keys(dynamic.styles[availableBreakpoints])[0]);
          dynamic.allStyles[Object.keys(dynamic.styles[availableBreakpoints])[0]] = dynamic.styles[availableBreakpoints];
          break;
        } else {
          dynamic.currentStyles.clear();
        }
      }

      /**
       * Loop trough <all> available styles for the attribute and find if the <currentStyle> is used or not
       */

      for (const [name, style] of Object.entries(dynamic.allStyles)) {
        if (dynamic.currentStyles.has(name)) {
          assignCSS.call(this, style, "add");
        } else {
          assignCSS.call(this, style, "remove");
        }
      }

      /**
       * Add or remove the CSS style from the target element
       */

      function assignCSS(style, method) {
        let obj = {};
        for (const [name, value] of Object.entries(style)) {
          let tempValue = [];
          cssName = name;

          switch (method) {
            case "add": {
              for (const event of ["mouseall", "mousex", "mousey", "scrollall", "scrollx", "scrolly", "sensorall", "sensorx", "sensory"]) {
                value[event] && tempValue.push(value[event]);
              }

              fullValue = tempValue.length > 1 ? `calc(${tempValue.join(" + ")})` : tempValue[0];

              if (value.cssFunction) {
                cssName = value.cssFunction;
                let perspective = /rotate/.test(name) ? " perspective(1000px)" : "";
                wrap.push(`${name}(${fullValue}) ${perspective}`);
              }

              /** Group multiple events together */
              obj[cssName] = {
                value: value.cssFunction ? wrap.join(" ") : fullValue,
                priority: value.priority,
              };

              if (value.targets) {
                for (const target of value.targets) {
                  for (const [name, value] of Object.entries(obj)) {
                    target.style.setProperty(name, value.value, value.priority);
                  }
                }
              } else {
                for (const [name, value] of Object.entries(obj)) {
                  this.element.style.setProperty(name, value.value, value.priority);
                }
              }

              break;
            }

            case "remove": {
              if (value.targets) {
                for (const target of value.targets) {
                  if (value.cssFunction) {
                    target.style.this.element.style[value.cssFunction] = target.style[value.cssFunction].replace(target.style[value.cssFunction], "");
                  }
                  target.style.removeProperty(cssName);
                }
              } else {
                if (value.cssFunction) {
                  this.element.style[value.cssFunction] = this.element.style[value.cssFunction].replace(this.element.style[value.cssFunction], "");
                }
                this.element.style.removeProperty(cssName);
              }

              delete dynamic.allStyles[cssName];
              break;
            }
          }
        }
      }
    }

    /**
     * ------------------------------------------------------------------------------------------------
     * CLASS ACTIONS
     * ------------------------------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Class: Add event listeners
     * ------------------------------------------------------------------------
     */

     _CLASSAddListeners(array) {
       const bodyIO = new IntersectionObserver((entries) => {
         WINDOW.documentHeight = Math.round(entries[0].boundingClientRect.height);

         this._CLASSCreateActions();

         if (array.some(item => /click:/.test(item))) {
           this.element.addEventListener("click", this._onClassClick.bind(this));
         }
         if (array.some(item => /hover:/.test(item))) {
           this.element.addEventListener("mouseenter", this._onClassMouseEnter.bind(this));
           this.element.addEventListener("mouseleave", this._onClassMouseLeave.bind(this));
         }
         if (array.some(item => /timeout:/.test(item))) {
           this._onClassTimeout();
         }
       });

       bodyIO.observe(document.documentElement);
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Create `actions` object that stores the necessary data that
     * will be used when user performs a <trigger>
     * ------------------------------------------------------------------------
     */

    _CLASSCreateActions() {
      for (const attributes of Object.values(this.attributes.class)) {
        for (const attribute of Object.values(attributes.scroll ? attributes.scroll : attributes)) {
          let start = null;
          let end = null;
          let unit = null;

          if (attribute.options.start) {
            start = getValueData(attribute.options.start);
          }
          if (attribute.options.end) {
            end = getValueData(attribute.options.end);
          }

          switch (attribute.trigger.name) {
            case "timeout":
              if (start) {
                start = start.unit === "s" ? start.value * 1000 : start.value;
              }
              if (end) {
                end = end.unit === "s" ? end.value * 1000 : end.value;
              }
              break;

            default:
              if (start) {
                unit = start.unit;
                start = start.value;
              }
              if (end) {
                unit = end.unit;
                end = end.value;
              }
              break;
          }

          attribute.actions = {
            method: /class\.(.*?)$/.exec(attribute.property.name)[1],
            classes: attribute.values.all.original.split("░"),
            target: attribute.options.target,
            trigger: attribute.trigger.name,
            start: start,
            end: end,
            unit: unit,
            disable: attribute.options.disable,
          };
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On click
     * ------------------------------------------------------------------------
     */

    _onClassClick() {
      for (const attribute of Object.values(this.attributes.class.click)) {
        this._CLASSTriggerNewState(attribute);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On mouse enter (hover)
     * ------------------------------------------------------------------------
     */

    _onClassMouseEnter() {
      for (const attribute of Object.values(this.attributes.class.hover)) {
        this._CLASSTriggerNewState(attribute);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On mouse leave (hover out)
     * ------------------------------------------------------------------------
     */

    _onClassMouseLeave() {
      for (const attribute of Object.values(this.attributes.class.hover)) {
        if (attribute.actions.method === "toggle") {
          this._CLASSTriggerOldState(attribute);
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On time out
     * ------------------------------------------------------------------------
     */

    _onClassTimeout() {
      for (const attribute of Object.values(this.attributes.class.timeout)) {
        let start = attribute.actions.start;
        let end = attribute.actions.end;

        attribute.time = setTimeout(() => {
          /** Trigger active state */
          this._CLASSTriggerNewState(attribute);

          /** If timeOut has end value */
          if (end) {
            attribute.time = setTimeout(() => {

              /** Trigger state back to inactive (original) */
              this._CLASSTriggerOldState(attribute);

              clearTimeout(attribute.time);
            }, end);
          }
          else {
            clearTimeout(attribute.time);
          }

        }, start);

      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On scroll
     * ------------------------------------------------------------------------
     */

     _onClassScroll() {
      for (const attribute of Object.values(this.attributes.class.scroll.scroll)) {
        if (attribute.actions) {
          let scrolled = WINDOW.scroll.y;

          if (attribute.actions.unit === "%") {
            scrolled = WINDOW.scroll.y / (WINDOW.documentHeight - WINDOW.height) * 100;
          }

          if (attribute.actions.end) {
            if (scrolled >= attribute.actions.start && scrolled <= attribute.actions.end) {
              checkScroll.call(this, attribute, "in");
            } else {
              checkScroll.call(this, attribute, "out");
            }
          } else {
            if (scrolled >= attribute.actions.start) {
              checkScroll.call(this, attribute, "in");
            } else {
              if (attribute.actions.method === "toggle") {
                attribute.actions.done && toggle.call(this, attribute, true);
              }
            }
          }
        }
      }

      function checkScroll(attribute, method) {
        switch (method) {
          case "in":
            if (attribute.actions.method === "toggle") {
              !attribute.actions.done && toggle.call(this, attribute, false);
            } else {
              toggle.call(this, attribute, false);
            }
            break;

          case "out":
            if (attribute.actions.method === "toggle") {
              attribute.actions.done && toggle.call(this, attribute, true);
            } else {
              toggle.call(this, attribute, true);
            }
            break;
        }
      }

      function toggle(attribute, done) {
        if (!done) {
          this._CLASSTriggerNewState(attribute);
          attribute.actions.done = true;
        }
        if (done) {
          this._CLASSTriggerOldState(attribute);
          attribute.actions.done = false;
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Trigger new state (add/remove/toggle class)
     * ------------------------------------------------------------------------
     */

    _CLASSTriggerNewState(attribute) {
      if (this.element.torClassDisabled) {
        return;
      }

      for (const target of getIterableElement(attribute.actions.target)) {
        if (attribute.priority) {
          setTimeout(() => {
            [...attribute.actions.classes].map(_class => target.classList[attribute.actions.method](_class) );
          }, 10);
        } else {
          [...attribute.actions.classes].map(_class => target.classList[attribute.actions.method](_class) );
        }

        if (attribute.actions.disable) {
          target.torClassDisabled = true;
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Trigger old state (revert classList back to original)
     * ------------------------------------------------------------------------
     */

    _CLASSTriggerOldState(attribute) {
      if (this.element.torClassDisabled) {
        return;
      }

      let newMethod;

      switch (attribute.actions.method) {
        case "add":
          newMethod = "remove";
          break;

        case "remove":
          newMethod = "add";
          break;

        default:
          newMethod = "toggle";
          break;
      }

      for (const target of getIterableElement(attribute.actions.target)) {
        [...attribute.actions.classes].map(_class => target.classList[newMethod](_class) );
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Refresh
     * ------------------------------------------------------------------------
     */

    _refresh() {
      this.get.bounds();
      this._runAllEvents();
      this._LOOPCreate();
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Public functions
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static refresh(elements) {
      INTERSECTION_OBSERVER.disconnect();

      callFunction({
        elements: getIterableElement(elements || "[data-tor]"),
        object: "Main",
        fn: "_refresh",
      });
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static init(elements, options) {
      /** Get only elements that have not been initialized - doesn't have TORUS.Main class */
      elements = getIterableElement(elements || "[data-tor]");

      if (elements) {
        elements = elements.filter(item => { return !item.TORUS || !item.TORUS.Main });
        initClass({ name: "Main", elements: elements});
      }

    }
  };

  MUTATION();

  var main = TORUS.Main;

  /**
   * ------------------------------------------------------------------------
   * Slider
   * (c) Torus Kit
   * ------------------------------------------------------------------------
   */

  TORUS.Slider = class {
    constructor(element, options) {
      /** Main element */
      this.element = element;

      /** Element has been fully initialized */
      this.element.torusInitializedSlider = true;

      /** Optimize and replace original [data-tor] attribute */
      this.element.dataset.torSlider = optimizeAttribute(this.element.dataset.torSlider);

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.torSlider.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.attributes = {};
      this.bounds = {};
      this.items = {};
      this.navigation = {};

      /** Default Options */
      this.defaults = {
        count: 1,                   // Number of visible items per slide
        margin: 0,                  // Margin (space) between the items
        pullArea: 20,               // If the slider doesn't exceed this area when dragging, it reverses back
        stretchOnDrag: true,        // Stretch space between items on bounds when dragging
        stretchOnClick: false,      // Stretch space between items on bounds on click next/prev button
        addParent: false,          // Add parent `[data-tor-parent]` to `.tor-slider-item`
        slide: true,                // Enable slider sliding
        vertical: false,
        drag: true,
      };

      this.sliderStart = 0;
      this.activeSlide = 0;
      this.lastSlide = 0;
      this.lastDifferenceStart = 0;
      this.axis = "x";
      this.bounds.lastStart = -1;
      this.bounds.lastEnd = 0;

      /** Run Getter and setter function */
      this._getterSetter();
      /** Set default and merge user options */
      this._setOptions(options);
      /** Wrap and create inner slider elements */
      this._wrapItems();
      /** Get slider and slider items dimensions */
      this.get.bounds();
      /** Add event listeners */
      this._addListeners();
    }

    /**
     * ------------------------------------------------------------------------
     * Options
     * ------------------------------------------------------------------------
     */

    _setOptions(options) {
      /** Options defined in [data-tor-slider] attribute */
      createPropertiesObject(this, this.dataset, "slider");

      /** Merge user options with defaults */
      this.options = Object.assign(this.defaults, options);
      this.options.additional = {};

      /** If there are additional options defined in `[data-tor-slider]`, create them or replace the default ones */
      for (const attribute of Object.values(this.attributes.slider.idle)) {
        if (attribute.values) {
          let GV = getValuesForCurrentResolution(attribute, 1);
          let name = attribute.property.name.toCamelCase();
          this.options[name] = GV.value;

          if (Object.keys(attribute.options).length) {
            for (const [key, value] of Object.entries(attribute.options)) {
              this.options.additional[name] = this.options.additional[name] || {};
              this.options.additional[name][key] = value;
            }
          }
        }
      }

      /** If `stack(true)` override some default options */
      if (this.options.stack) {
        this.options.slide = false;
        this.options.drag = false;
        this.options.count = 1;
        this.options.margin = 0;
      }

      this.options.count  && this.element.style.setProperty("--tor-slider-items-count", this.options.count);
      (this.options.margin || this.options.margin === 0) && this.element.style.setProperty("--tor-slider-margin", `${this.options.margin}px`);

      if (this.options.additional) {
        let options = this.options.additional;

        (options.controls && options.controls.icons === "chevron")    && this.element.classList.add("tor-slider-controls-chevron");
        (options.controls && options.controls.theme === "dark")       && this.element.classList.add("tor-slider-controls-dark");
        (options.indicators && options.indicators.theme === "dark")   && this.element.classList.add("tor-slider-indicators-dark");
        (options.indicators && options.indicators.justify)            && this.element.style.setProperty("--tor-indicators-justify", options.indicators.justify);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Wrap elements into corresponding wrappers
     * ------------------------------------------------------------------------
     */

    _wrapItems() {
      /** Select `.tor-slider-wrapper` wrapper element */
      this.slider = this.element.querySelector(".tor-slider-wrapper");

      /** If slider contains a wrapper */
      if (this.slider) {
        wrap.call(this, this.slider.children);
      } else {
        wrap.call(this, this.element.children);
        wrapElement(this.itemsElements, this.element, "tor-slider-wrapper");
        this.slider = this.element.querySelector(".tor-slider-wrapper");
      }

      /** Wrap each children into `.tor-slider-item` */
      function wrap([...children]) {
        children.map(item => {
          !/tor-slider/.test(item.classList) && wrapElement(item, "div", "tor-slider-item");
        });

        this.itemsElements = this.element.querySelectorAll(".tor-slider-item");
      }

      /** Add parent triggers if  */
      if (this.options.addParent) {
        for (const [i, item] of Object.entries(this.itemsElements)) {
          i === "0" && item.classList.add("active", "show");
          item.dataset.torParent = this.options.addParent.replace(/░/g, " ");
        }
      }

      /** If slider contains images */
      this.images = [...this.element.querySelectorAll("img")];

      /** If slider contains `data-tor` elements */
      this.torElements = [...this.element.querySelectorAll("[data-tor]")];

      this.itemsLength = this.itemsElements.length;
      this._createItemsObject();
    }

    /**
     * ------------------------------------------------------------------------
     * Create `this.items` object that stores data about each `.tor-slider-item`
     * ------------------------------------------------------------------------
     */

    _createItemsObject() {
      for (const [i, item] of Object.entries(this.itemsElements)) {
        this.items[i] = {};
        this.items[i].id = i;
        this.items[i].element = item;
        this.items[i].bounds = {};

        this.items[i].element.TORUS = this.items[i].element.TORUS || {};
        this.items[i].element.TORUS.sliderItem = {
          parent: this,
          id: i,
          calculated: false,
        };
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Defaults
     * ------------------------------------------------------------------------
     */

    _calculateDefaults() {
      this.maxStart = 0;
      this.maxEnd = -this.sliderSize + this.bounds.size - this.options.margin;
      this.maxSlides = this.itemsLength - this.options.count;

      if (this.options.vertical) {
        this.element.style.setProperty("--tor-slider-height", `${this.bounds.size}px`);
        this.axis = "y";
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Getter */
      this.get = {
        bounds: () => {
          this._getBounds();
        },
        images: url => new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(img);

          img.src = url;
        }),
      };

      /** Setter */
      this.set = {
        bounds: (bounds, isItem) => {
          this._setBounds(bounds, isItem);
        },
      };
    }

    /**
     * ------------------------------------------------------------------------
     * Get slider and child items bounds
     * ------------------------------------------------------------------------
     */

    _getBounds(params) {
      this.promises = [];
      this.sliderSize = 0;
      this.bounds.lastStart = -1;



      /** IO callback */
      const onIntersect = (entries) => {

        for (const entry of entries) {
          let _this = entry.target.TORUS;
          if (_this.Slider /*&& !this.bounds.calculated*/) {
             this.set.bounds(entry.boundingClientRect);
          }
          if (_this.sliderItem /*&& !_this.sliderItem.calculated*/) {
            this.set.bounds(entry.boundingClientRect, _this.sliderItem.id);
          }
        }

        IO.disconnect();

        Promise.all(this.promises).then(() => {
          this._promisesDone(params);
        });
      };

      /** IO init */
      const IO = new IntersectionObserver(onIntersect);

      if (this.images.length) {
        Promise.allSettled(this.images.map(item => item.src).map(this.get.images))
          .then(() => {
            runIO.call(this);
          });
      } else {
        runIO.call(this);
      }

      function runIO() {
        IO.observe(this.element);
        for (const item of Object.values(this.items)) {
          IO.observe(item.element);
        }
      }

    }

    /**
     * ------------------------------------------------------------------------
     * Set element bounds
     * ------------------------------------------------------------------------
     */

    _setBounds(bounds, id) {
      let promise = new Promise((resolve) => {
        let B;

        if (id) {
          B = this.items[id].bounds;
        } else {
          B = this.bounds;
        }

        B.calculated    = true;
        B.rect          = bounds;
        B.bottom        = Math.round(B.rect.bottom);
        B.width         = Math.round(B.rect.width);
        B.height        = Math.round(B.rect.height);

        if (id) {
          if (this.options.vertical) {
            B.size    = B.height + (Number(id) < this.itemsLength  ? this.options.margin : -this.options.margin);
          } else {
            B.size    = B.width + (Number(id) < this.itemsLength ? this.options.margin : -this.options.margin);
          }

          if (this.bounds.lastStart < 0) {
            this.bounds.lastStart = 0;
            B.start = 0;
            B.end = B.size;
          } else {
            this.bounds.lastStart += B.size;
            B.start = this.bounds.lastStart;
            B.end = B.start + B.size;
          }

          B.center  = B.start + B.size / 2;
          this.sliderSize = Math.abs(this.sliderStart) + B.end - (this.options.margin*2);

        } else {
          if (this.options.vertical) {
            B.size = B.height - this.options.margin;
          } else {
            B.size = B.width;
          }
        }

        resolve(B);
      });

      this.promises.push(promise);
    }

    /**
    * ------------------------------------------------------------------------
    * When all promises are settled
    * ------------------------------------------------------------------------
    */

    _promisesDone(params) {
      this.element.classList.add("tor-done");
      this._calculateDefaults();
      this._checkBounds();
      this._createNavigation();
      this._setClass("show");
      this._setClass("active");

      if (params && params.refreshing) {
        this.lastDifferenceStart = -this.items[this.activeSlide].bounds.start;
        this.sliderStart = -this.items[this.activeSlide].bounds.start;
        this._translate(this.sliderStart);
      }

      this._setIndicatorsClass();
    }

    /**
     * ------------------------------------------------------------------------
     * Set `.active` or `.show` class
     * ------------------------------------------------------------------------
     */

    _setClass(_class) {
      for (const item of Object.values(this.items)) {
        if (item.bounds.center + this.sliderStart > 0 && item.bounds.center + this.sliderStart < this.bounds.size) {
          item[_class] = true;
          item.element.classList.add(_class);
        } else {
          item[_class] = false;
          item.element.classList.remove(_class);
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Define the sliding direction
     * ------------------------------------------------------------------------
     */

    _slideTo(direction) {
      switch (direction) {
        case "next":
          if (this.activeSlide < this.maxSlides) {
            this.activeSlide++;
            setActiveAndTranslate.call(this);
          }
          break;

        case "prev":
          if (this.activeSlide > 0) {
            this.activeSlide--;
            setActiveAndTranslate.call(this);
          }
          break;

        default:
          if (Number(direction) < this.maxSlides) {
            this.activeSlide = Number(direction);
          } else {
            this.activeSlide = this.maxSlides;
          }
          setActiveAndTranslate.call(this);
          break;
      }

      function setActiveAndTranslate() {
        if (this.activeSlide !== this.lastSlide) {
          this.sliderStart = this.lastDifferenceStart = -this.items[this.activeSlide].bounds.start;
          this._translate(this.sliderStart);
          this._checkBounds();

          (!this.options.stack || !this.options.slide) && this.element.classList.add("tor-translating");
        }
      }

      if (this.options.stack) {
        this._setClass("active");
      }

      this._setIndicatorsClass();
      this.lastSlide = this.activeSlide;
    }

    /**
     * ------------------------------------------------------------------------
     * When slider transition (sliding) ends
     * ------------------------------------------------------------------------
     */

    _onTransitionEnd(e) {
      if (e.propertyName === "transform" && e.target === this.slider) {
        this._setClass("active");
        this.element.classList.remove("tor-translating");

        this._setIndicatorsClass();
      }
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer down (mouse or touch down)
     * ------------------------------------------------------------------------
     */

    _onDown(e) {
      requestAnimationFrame(() => {
        if (e.button === 0) {
          this.isDown = true;
          this.startX = e.clientX;
          this.startY = e.clientY;
          this._checkBounds();
        }
      });
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer move (mouse or touch moving)
     * ------------------------------------------------------------------------
     */

     _onMove(e) {
      requestAnimationFrame(() => {
        if (this.isDown) {
          this.element.classList.add("tor-dragging");

          if (this.options.vertical) {
            this.differenceStart = e.clientY - this.startY;
          } else {
            this.differenceStart = e.clientX - this.startX;
          }

          this.sliderStart = this.lastDifferenceStart + this.differenceStart;

          if (this.sliderStart > this.maxStart) {
            this.sliderStart = this.maxStart;
          }
          if (this.sliderStart < this.maxEnd) {
            this.sliderStart = this.maxEnd;
          }

          this._translate(this.sliderStart);
        }
      });
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer up (mouse or touch release)
     * ------------------------------------------------------------------------
     */

    _onUp() {
      if (this.isDown) {
        this.element.classList.remove("tor-dragging");
        this.isDown = false;

        if (this.differenceStart < 0) {
          for (let i = 0; i < this.itemsLength; i++) {
            let draggedStart = this.items[i].bounds.start + this.sliderStart;
            if (draggedStart > -this.options.pullArea) {
              setActiveAndTranslate.call(this, i);
              break;
            }
          }
        }

        if (this.differenceStart > 0) {
          for (let i = this.itemsLength - 1; i >= 0; i--) {
            let draggedStart = this.items[i].bounds.start + this.sliderStart;

            if (draggedStart < this.options.pullArea) {
              setActiveAndTranslate.call(this, i);
              break;
            }
          }
        }

        // TODO: Free drag
        // this.sliderStart += this.differenceStart;
        // if (this.sliderStart > this.maxStart) {
        //   this.sliderStart = this.maxStart;
        // }
        // if (this.sliderStart < this.maxEnd) {
        //   this.sliderStart = this.maxEnd;
        // }
        // this._translate({left: this.sliderStart});

        this.lastDifferenceStart = this.sliderStart;
        this._setClass("active");

        function setActiveAndTranslate(i) {
          this.activeSlide = Number(this.items[i].id);
          this.sliderStart = -this.items[this.activeSlide].bounds.start;
          this._translate(this.sliderStart);
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * On drag start
     *
     * Disable browser dragging behavior when pointer starts to drag a slider
     * ------------------------------------------------------------------------
     */

      _onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
      }

    /**
     * ------------------------------------------------------------------------
     * Check if left or right bound has reached
     * ------------------------------------------------------------------------
     */

     _checkBounds() {
      this.reachedStart = this.sliderStart >= 0;
      this.reachedEnd = this.sliderStart <= this.maxEnd;
    }

    /**
     * ------------------------------------------------------------------------
     * Translate the `.tor-slider-wrapper` element
     * ------------------------------------------------------------------------
     */

    _translate(transform) {
      if (!this.options.stack) {
        let x = this.axis === "x" ? transform : 0;
        let y = this.axis === "y" ? transform : 0;

        this.slider.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0px)`);
      }

      this._setClass("show");
    }

    /**
     * ------------------------------------------------------------------------
     * Add event listeners
     * ------------------------------------------------------------------------
     */

    _addListeners() {
      if (this.options.drag) {
        document.addEventListener("pointerup", this._onUp.bind(this));
        document.addEventListener("pointermove", this._onMove.bind(this), {passive: true});
        // document.addEventListener("mousemove", this._onMove.bind(this), {passive: true});
        // document.addEventListener("touchmove", this._onMove.bind(this), {passive: true});
        this.slider.addEventListener("pointerdown", this._onDown.bind(this));
      }

      this.slider.addEventListener("transitionend", this._onTransitionEnd.bind(this));
      this.slider.addEventListener("dragstart", this._onDragStart.bind(this));
    }

    /**
     * ------------------------------------------------------------------------
     * Set or remove `.active` class from indicator item elements
     * ------------------------------------------------------------------------
     */

    _setIndicatorsClass() {
      if (this.options.indicators) {
        if (this.navigation.indicatorsElements && this.navigation.indicatorsElements[this.activeSlide]) {
          [...Object.values(this.navigation.indicatorsElements)].map(item => item.classList.remove("active"));
          this.navigation.indicatorsElements[this.activeSlide].classList.add("active");
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Create Controls
     * ------------------------------------------------------------------------
     */

    _createNavigation() {
      if (this.options.controls) {
        /** At first, remove the controls element */
        this.navigation.controls && this.navigation.controls.remove();

        this.navigation.controls = document.createElement("nav");
        this.navigation.controls.classList.add("tor-slider-controls");
        this.element.appendChild(this.navigation.controls);

        for (const direction of ["prev", "next"]) {
          let control;
          control = document.createElement("div");
          control.addEventListener("click", this._slideTo.bind(this, direction));
          control.classList.add(`tor-slider-${direction}`);
          control.setAttribute("role", "button");
          control.setAttribute("aria-label", `Slider ${direction} button`);
          this.navigation.controls.appendChild(control);
        }
      } else {
        this.navigation.controls && this.navigation.controls.remove();
      }

      if (this.options.indicators) {
        /** At first, remove the indicator element */
        if (this.navigation.indicators) {
          [...Object.values(this.navigation.indicatorsElements)].map(item => item.remove());
          this.navigation.indicators.remove();
        }

        this.navigation.indicatorsElements = {};

        this.navigation.indicators = document.createElement("ul");
        this.navigation.indicators.classList.add("tor-slider-indicators");
        this.navigation.indicators.addEventListener("click", clicked.bind(this));
        this.element.appendChild(this.navigation.indicators);

        for (let i = 0; i < this.itemsLength / this.options.count; i++) {
          let indicator;
          indicator = document.createElement("li");
          indicator.setAttribute("role", "button");
          indicator.setAttribute("aria-label", `Show the number ${i * this.options.count} slide button`);
          indicator.setAttribute("data-tor-slide-to", i * this.options.count);
          this.navigation.indicators.appendChild(indicator);
          this.navigation.indicatorsElements[i * this.options.count] = indicator;
        }

        function clicked(e) {
          this._slideTo(Number(e.target.dataset.torSlideTo));
        }
      } else {
        this.navigation.indicators && this.navigation.indicators.remove();
      }
    }

    _refresh() {
      this._setOptions();
      this.get.bounds({refreshing: true});
    }

    /**
     * ------------------------------------------------------------------------
     * Static functions
     * ------------------------------------------------------------------------
     */

    /**
     * Slide to specific slide
     */

    static slideTo(elements, direction) {
      callFunction({
        elements: getIterableElement(elements),
        object: "Slider",
        fn: "_slideTo",
        argument: direction,
      });
    }

    /**
     * Refresh slider
     */

    static refresh(elements) {
      callFunction({
        elements: getIterableElement(elements || "[data-tor-slider]"),
        object: "Slider",
        fn: "_refresh",
      });
    }

    /**
     * Create external controls
     */

    static externalNavigation() {
      for (const navigation of document.querySelectorAll("[data-tor-slider-target]")) {

        if (!navigation.torExternalControl) {
          const targets = document.querySelectorAll(navigation.dataset.torSliderTarget);
          navigation.torExternalControl = true;

          navigation.addEventListener("click", (e) => {
            e.preventDefault();
            let control = e.target.dataset.torSlideTo;
            if (control) {
              [...targets].map(target => TORUS.Slider.slideTo(target, control));
            }
          });
        }
      }
    }

    /**
     * Init
     */

    static init(elements, options) {
      elements = getIterableElement(elements || "[data-tor-slider]");
      initClass({ name: "Slider", elements: elements, options: options });
      this.externalNavigation();
    }
  };

  var slider = TORUS.Slider;

  /**
   * ------------------------------------------------------------------------
   * Background Image
   * (c) Torus Kit
   * ------------------------------------------------------------------------
   */

  TORUS.BgImage = class {
    constructor(element, options) {
      this.element = element;
      this.bgImageElement = element.querySelector(".bg-img");

      if(this.bgImageElement) {
        this.element.style.setProperty("background-image", `url('${this.bgImageElement.getAttribute("src")}')`);
      }

      if(options) {
        this.element.style.setProperty("background-image", `url('${options}')`);
      }
    }

    static init(elements, options) {
      elements = getIterableElement(elements || ".has-bg-img, .has-bg-pattern");
      initClass({name: "BgImage", elements: elements, options: options});
    }
  };

  var bg = TORUS.BgImage;

  exports.Bg = bg;
  exports.Group = group;
  exports.Main = main;
  exports.Parent = parent;
  exports.Slider = slider;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=toruskit.js.map
