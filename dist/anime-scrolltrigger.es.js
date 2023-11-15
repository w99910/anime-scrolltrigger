var ge = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: "normal",
  autoplay: !0,
  timelineOffset: 0
}, Y = {
  duration: 1e3,
  delay: 0,
  endDelay: 0,
  easing: "easeOutElastic(1, .5)",
  round: 0
}, Fe = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"], W = {
  CSS: {},
  springs: {}
};
function P(e, r, t) {
  return Math.min(Math.max(e, r), t);
}
function R(e, r) {
  return e.indexOf(r) > -1;
}
function Q(e, r) {
  return e.apply(null, r);
}
var c = {
  arr: function(e) {
    return Array.isArray(e);
  },
  obj: function(e) {
    return R(Object.prototype.toString.call(e), "Object");
  },
  pth: function(e) {
    return c.obj(e) && e.hasOwnProperty("totalLength");
  },
  svg: function(e) {
    return e instanceof SVGElement;
  },
  inp: function(e) {
    return e instanceof HTMLInputElement;
  },
  dom: function(e) {
    return e.nodeType || c.svg(e);
  },
  str: function(e) {
    return typeof e == "string";
  },
  fnc: function(e) {
    return typeof e == "function";
  },
  und: function(e) {
    return typeof e > "u";
  },
  nil: function(e) {
    return c.und(e) || e === null;
  },
  hex: function(e) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e);
  },
  rgb: function(e) {
    return /^rgb/.test(e);
  },
  hsl: function(e) {
    return /^hsl/.test(e);
  },
  col: function(e) {
    return c.hex(e) || c.rgb(e) || c.hsl(e);
  },
  key: function(e) {
    return !ge.hasOwnProperty(e) && !Y.hasOwnProperty(e) && e !== "targets" && e !== "keyframes";
  }
};
function me(e) {
  var r = /\(([^)]+)\)/.exec(e);
  return r ? r[1].split(",").map(function(t) {
    return parseFloat(t);
  }) : [];
}
function ye(e, r) {
  var t = me(e), o = P(c.und(t[0]) ? 1 : t[0], 0.1, 100), a = P(c.und(t[1]) ? 100 : t[1], 0.1, 100), n = P(c.und(t[2]) ? 10 : t[2], 0.1, 100), s = P(c.und(t[3]) ? 0 : t[3], 0.1, 100), l = Math.sqrt(a / o), i = n / (2 * Math.sqrt(a * o)), d = i < 1 ? l * Math.sqrt(1 - i * i) : 0, f = 1, v = i < 1 ? (i * l + -s) / d : -s + l;
  function u(m) {
    var h = r ? r * m / 1e3 : m;
    return i < 1 ? h = Math.exp(-h * i * l) * (f * Math.cos(d * h) + v * Math.sin(d * h)) : h = (f + v * h) * Math.exp(-h * l), m === 0 || m === 1 ? m : 1 - h;
  }
  function y() {
    var m = W.springs[e];
    if (m)
      return m;
    for (var h = 1 / 6, b = 0, x = 0; ; )
      if (b += h, u(b) === 1) {
        if (x++, x >= 16)
          break;
      } else
        x = 0;
    var g = b * h * 1e3;
    return W.springs[e] = g, g;
  }
  return r ? u : y;
}
function Ve(e) {
  return e === void 0 && (e = 10), function(r) {
    return Math.ceil(P(r, 1e-6, 1) * e) * (1 / e);
  };
}
var je = function() {
  var e = 11, r = 1 / (e - 1);
  function t(f, v) {
    return 1 - 3 * v + 3 * f;
  }
  function o(f, v) {
    return 3 * v - 6 * f;
  }
  function a(f) {
    return 3 * f;
  }
  function n(f, v, u) {
    return ((t(v, u) * f + o(v, u)) * f + a(v)) * f;
  }
  function s(f, v, u) {
    return 3 * t(v, u) * f * f + 2 * o(v, u) * f + a(v);
  }
  function l(f, v, u, y, m) {
    var h, b, x = 0;
    do
      b = v + (u - v) / 2, h = n(b, y, m) - f, h > 0 ? u = b : v = b;
    while (Math.abs(h) > 1e-7 && ++x < 10);
    return b;
  }
  function i(f, v, u, y) {
    for (var m = 0; m < 4; ++m) {
      var h = s(v, u, y);
      if (h === 0)
        return v;
      var b = n(v, u, y) - f;
      v -= b / h;
    }
    return v;
  }
  function d(f, v, u, y) {
    if (!(0 <= f && f <= 1 && 0 <= u && u <= 1))
      return;
    var m = new Float32Array(e);
    if (f !== v || u !== y)
      for (var h = 0; h < e; ++h)
        m[h] = n(h * r, f, u);
    function b(x) {
      for (var g = 0, p = 1, k = e - 1; p !== k && m[p] <= x; ++p)
        g += r;
      --p;
      var I = (x - m[p]) / (m[p + 1] - m[p]), O = g + I * r, B = s(O, f, u);
      return B >= 1e-3 ? i(x, O, f, u) : B === 0 ? O : l(x, g, g + r, f, u);
    }
    return function(x) {
      return f === v && u === y || x === 0 || x === 1 ? x : n(b(x), v, y);
    };
  }
  return d;
}(), Te = function() {
  var e = { linear: function() {
    return function(o) {
      return o;
    };
  } }, r = {
    Sine: function() {
      return function(o) {
        return 1 - Math.cos(o * Math.PI / 2);
      };
    },
    Circ: function() {
      return function(o) {
        return 1 - Math.sqrt(1 - o * o);
      };
    },
    Back: function() {
      return function(o) {
        return o * o * (3 * o - 2);
      };
    },
    Bounce: function() {
      return function(o) {
        for (var a, n = 4; o < ((a = Math.pow(2, --n)) - 1) / 11; )
          ;
        return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((a * 3 - 2) / 22 - o, 2);
      };
    },
    Elastic: function(o, a) {
      o === void 0 && (o = 1), a === void 0 && (a = 0.5);
      var n = P(o, 1, 10), s = P(a, 0.1, 2);
      return function(l) {
        return l === 0 || l === 1 ? l : -n * Math.pow(2, 10 * (l - 1)) * Math.sin((l - 1 - s / (Math.PI * 2) * Math.asin(1 / n)) * (Math.PI * 2) / s);
      };
    }
  }, t = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
  return t.forEach(function(o, a) {
    r[o] = function() {
      return function(n) {
        return Math.pow(n, a + 2);
      };
    };
  }), Object.keys(r).forEach(function(o) {
    var a = r[o];
    e["easeIn" + o] = a, e["easeOut" + o] = function(n, s) {
      return function(l) {
        return 1 - a(n, s)(1 - l);
      };
    }, e["easeInOut" + o] = function(n, s) {
      return function(l) {
        return l < 0.5 ? a(n, s)(l * 2) / 2 : 1 - a(n, s)(l * -2 + 2) / 2;
      };
    }, e["easeOutIn" + o] = function(n, s) {
      return function(l) {
        return l < 0.5 ? (1 - a(n, s)(1 - l * 2)) / 2 : (a(n, s)(l * 2 - 1) + 1) / 2;
      };
    };
  }), e;
}();
function G(e, r) {
  if (c.fnc(e))
    return e;
  var t = e.split("(")[0], o = Te[t], a = me(e);
  switch (t) {
    case "spring":
      return ye(e, r);
    case "cubicBezier":
      return Q(je, a);
    case "steps":
      return Q(Ve, a);
    default:
      return Q(o, a);
  }
}
function be(e) {
  try {
    var r = document.querySelectorAll(e);
    return r;
  } catch {
    return;
  }
}
function _(e, r) {
  for (var t = e.length, o = arguments.length >= 2 ? arguments[1] : void 0, a = [], n = 0; n < t; n++)
    if (n in e) {
      var s = e[n];
      r.call(o, s, n, e) && a.push(s);
    }
  return a;
}
function U(e) {
  return e.reduce(function(r, t) {
    return r.concat(c.arr(t) ? U(t) : t);
  }, []);
}
function ce(e) {
  return c.arr(e) ? e : (c.str(e) && (e = be(e) || e), e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e]);
}
function X(e, r) {
  return e.some(function(t) {
    return t === r;
  });
}
function ee(e) {
  var r = {};
  for (var t in e)
    r[t] = e[t];
  return r;
}
function K(e, r) {
  var t = ee(e);
  for (var o in e)
    t[o] = r.hasOwnProperty(o) ? r[o] : e[o];
  return t;
}
function $(e, r) {
  var t = ee(e);
  for (var o in r)
    t[o] = c.und(e[o]) ? r[o] : e[o];
  return t;
}
function He(e) {
  var r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);
  return r ? "rgba(" + r[1] + ",1)" : e;
}
function Re(e) {
  var r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, t = e.replace(r, function(l, i, d, f) {
    return i + i + d + d + f + f;
  }), o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), a = parseInt(o[1], 16), n = parseInt(o[2], 16), s = parseInt(o[3], 16);
  return "rgba(" + a + "," + n + "," + s + ",1)";
}
function ze(e) {
  var r = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), t = parseInt(r[1], 10) / 360, o = parseInt(r[2], 10) / 100, a = parseInt(r[3], 10) / 100, n = r[4] || 1;
  function s(u, y, m) {
    return m < 0 && (m += 1), m > 1 && (m -= 1), m < 1 / 6 ? u + (y - u) * 6 * m : m < 1 / 2 ? y : m < 2 / 3 ? u + (y - u) * (2 / 3 - m) * 6 : u;
  }
  var l, i, d;
  if (o == 0)
    l = i = d = a;
  else {
    var f = a < 0.5 ? a * (1 + o) : a + o - a * o, v = 2 * a - f;
    l = s(v, f, t + 1 / 3), i = s(v, f, t), d = s(v, f, t - 1 / 3);
  }
  return "rgba(" + l * 255 + "," + i * 255 + "," + d * 255 + "," + n + ")";
}
function We(e) {
  if (c.rgb(e))
    return He(e);
  if (c.hex(e))
    return Re(e);
  if (c.hsl(e))
    return ze(e);
}
function E(e) {
  var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
  if (r)
    return r[1];
}
function _e(e) {
  if (R(e, "translate") || e === "perspective")
    return "px";
  if (R(e, "rotate") || R(e, "skew"))
    return "deg";
}
function J(e, r) {
  return c.fnc(e) ? e(r.target, r.id, r.total) : e;
}
function w(e, r) {
  return e.getAttribute(r);
}
function re(e, r, t) {
  var o = E(r);
  if (X([t, "deg", "rad", "turn"], o))
    return r;
  var a = W.CSS[r + t];
  if (!c.und(a))
    return a;
  var n = 100, s = document.createElement(e.tagName), l = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
  l.appendChild(s), s.style.position = "absolute", s.style.width = n + t;
  var i = n / s.offsetWidth;
  l.removeChild(s);
  var d = i * parseFloat(r);
  return W.CSS[r + t] = d, d;
}
function Oe(e, r, t) {
  if (r in e.style) {
    var o = r.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), a = e.style[r] || getComputedStyle(e).getPropertyValue(o) || "0";
    return t ? re(e, a, t) : a;
  }
}
function ne(e, r) {
  if (c.dom(e) && !c.inp(e) && (!c.nil(w(e, r)) || c.svg(e) && e[r]))
    return "attribute";
  if (c.dom(e) && X(Fe, r))
    return "transform";
  if (c.dom(e) && r !== "transform" && Oe(e, r))
    return "css";
  if (e[r] != null)
    return "object";
}
function xe(e) {
  if (c.dom(e)) {
    for (var r = e.style.transform || "", t = /(\w+)\(([^)]*)\)/g, o = /* @__PURE__ */ new Map(), a; a = t.exec(r); )
      o.set(a[1], a[2]);
    return o;
  }
}
function Ue(e, r, t, o) {
  var a = R(r, "scale") ? 1 : 0 + _e(r), n = xe(e).get(r) || a;
  return t && (t.transforms.list.set(r, n), t.transforms.last = r), o ? re(e, n, o) : n;
}
function te(e, r, t, o) {
  switch (ne(e, r)) {
    case "transform":
      return Ue(e, r, o, t);
    case "css":
      return Oe(e, r, t);
    case "attribute":
      return w(e, r);
    default:
      return e[r] || 0;
  }
}
function ae(e, r) {
  var t = /^(\*=|\+=|-=)/.exec(e);
  if (!t)
    return e;
  var o = E(e) || 0, a = parseFloat(r), n = parseFloat(e.replace(t[0], ""));
  switch (t[0][0]) {
    case "+":
      return a + n + o;
    case "-":
      return a - n + o;
    case "*":
      return a * n + o;
  }
}
function Me(e, r) {
  if (c.col(e))
    return We(e);
  if (/\s/g.test(e))
    return e;
  var t = E(e), o = t ? e.substr(0, e.length - t.length) : e;
  return r ? o + r : o;
}
function ie(e, r) {
  return Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
}
function $e(e) {
  return Math.PI * 2 * w(e, "r");
}
function Ne(e) {
  return w(e, "width") * 2 + w(e, "height") * 2;
}
function qe(e) {
  return ie(
    { x: w(e, "x1"), y: w(e, "y1") },
    { x: w(e, "x2"), y: w(e, "y2") }
  );
}
function ke(e) {
  for (var r = e.points, t = 0, o, a = 0; a < r.numberOfItems; a++) {
    var n = r.getItem(a);
    a > 0 && (t += ie(o, n)), o = n;
  }
  return t;
}
function Ze(e) {
  var r = e.points;
  return ke(e) + ie(r.getItem(r.numberOfItems - 1), r.getItem(0));
}
function Ce(e) {
  if (e.getTotalLength)
    return e.getTotalLength();
  switch (e.tagName.toLowerCase()) {
    case "circle":
      return $e(e);
    case "rect":
      return Ne(e);
    case "line":
      return qe(e);
    case "polyline":
      return ke(e);
    case "polygon":
      return Ze(e);
  }
}
function Qe(e) {
  var r = Ce(e);
  return e.setAttribute("stroke-dasharray", r), r;
}
function Ke(e) {
  for (var r = e.parentNode; c.svg(r) && c.svg(r.parentNode); )
    r = r.parentNode;
  return r;
}
function Se(e, r) {
  var t = r || {}, o = t.el || Ke(e), a = o.getBoundingClientRect(), n = w(o, "viewBox"), s = a.width, l = a.height, i = t.viewBox || (n ? n.split(" ") : [0, 0, s, l]);
  return {
    el: o,
    viewBox: i,
    x: i[0] / 1,
    y: i[1] / 1,
    w: s,
    h: l,
    vW: i[2],
    vH: i[3]
  };
}
function Je(e, r) {
  var t = c.str(e) ? be(e)[0] : e, o = r || 100;
  return function(a) {
    return {
      property: a,
      el: t,
      svg: Se(t),
      totalLength: Ce(t) * (o / 100)
    };
  };
}
function Ye(e, r, t) {
  function o(f) {
    f === void 0 && (f = 0);
    var v = r + f >= 1 ? r + f : 0;
    return e.el.getPointAtLength(v);
  }
  var a = Se(e.el, e.svg), n = o(), s = o(-1), l = o(1), i = t ? 1 : a.w / a.vW, d = t ? 1 : a.h / a.vH;
  switch (e.property) {
    case "x":
      return (n.x - a.x) * i;
    case "y":
      return (n.y - a.y) * d;
    case "angle":
      return Math.atan2(l.y - s.y, l.x - s.x) * 180 / Math.PI;
  }
}
function ve(e, r) {
  var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, o = Me(c.pth(e) ? e.totalLength : e, r) + "";
  return {
    original: o,
    numbers: o.match(t) ? o.match(t).map(Number) : [0],
    strings: c.str(e) || r ? o.split(t) : []
  };
}
function oe(e) {
  var r = e ? U(c.arr(e) ? e.map(ce) : ce(e)) : [];
  return _(r, function(t, o, a) {
    return a.indexOf(t) === o;
  });
}
function Pe(e) {
  var r = oe(e);
  return r.map(function(t, o) {
    return { target: t, id: o, total: r.length, transforms: { list: xe(t) } };
  });
}
function Ge(e, r) {
  var t = ee(r);
  if (/^spring/.test(t.easing) && (t.duration = ye(t.easing)), c.arr(e)) {
    var o = e.length, a = o === 2 && !c.obj(e[0]);
    a ? e = { value: e } : c.fnc(r.duration) || (t.duration = r.duration / o);
  }
  var n = c.arr(e) ? e : [e];
  return n.map(function(s, l) {
    var i = c.obj(s) && !c.pth(s) ? s : { value: s };
    return c.und(i.delay) && (i.delay = l ? 0 : r.delay), c.und(i.endDelay) && (i.endDelay = l === n.length - 1 ? r.endDelay : 0), i;
  }).map(function(s) {
    return $(s, t);
  });
}
function Xe(e) {
  for (var r = _(U(e.map(function(n) {
    return Object.keys(n);
  })), function(n) {
    return c.key(n);
  }).reduce(function(n, s) {
    return n.indexOf(s) < 0 && n.push(s), n;
  }, []), t = {}, o = function(n) {
    var s = r[n];
    t[s] = e.map(function(l) {
      var i = {};
      for (var d in l)
        c.key(d) ? d == s && (i.value = l[d]) : i[d] = l[d];
      return i;
    });
  }, a = 0; a < r.length; a++)
    o(a);
  return t;
}
function er(e, r) {
  var t = [], o = r.keyframes;
  o && (r = $(Xe(o), r));
  for (var a in r)
    c.key(a) && t.push({
      name: a,
      tweens: Ge(r[a], e)
    });
  return t;
}
function rr(e, r) {
  var t = {};
  for (var o in e) {
    var a = J(e[o], r);
    c.arr(a) && (a = a.map(function(n) {
      return J(n, r);
    }), a.length === 1 && (a = a[0])), t[o] = a;
  }
  return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t;
}
function nr(e, r) {
  var t;
  return e.tweens.map(function(o) {
    var a = rr(o, r), n = a.value, s = c.arr(n) ? n[1] : n, l = E(s), i = te(r.target, e.name, l, r), d = t ? t.to.original : i, f = c.arr(n) ? n[0] : d, v = E(f) || E(i), u = l || v;
    return c.und(s) && (s = d), a.from = ve(f, u), a.to = ve(ae(s, f), u), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = G(a.easing, a.duration), a.isPath = c.pth(n), a.isPathTargetInsideSVG = a.isPath && c.svg(r.target), a.isColor = c.col(a.from.original), a.isColor && (a.round = 1), t = a, a;
  });
}
var we = {
  css: function(e, r, t) {
    return e.style[r] = t;
  },
  attribute: function(e, r, t) {
    return e.setAttribute(r, t);
  },
  object: function(e, r, t) {
    return e[r] = t;
  },
  transform: function(e, r, t, o, a) {
    if (o.list.set(r, t), r === o.last || a) {
      var n = "";
      o.list.forEach(function(s, l) {
        n += l + "(" + s + ") ";
      }), e.style.transform = n;
    }
  }
};
function Ee(e, r) {
  var t = Pe(e);
  t.forEach(function(o) {
    for (var a in r) {
      var n = J(r[a], o), s = o.target, l = E(n), i = te(s, a, l, o), d = l || E(i), f = ae(Me(n, d), i), v = ne(s, a);
      we[v](s, a, f, o.transforms, !0);
    }
  });
}
function tr(e, r) {
  var t = ne(e.target, r.name);
  if (t) {
    var o = nr(r, e), a = o[o.length - 1];
    return {
      type: t,
      property: r.name,
      animatable: e,
      tweens: o,
      duration: a.end,
      delay: o[0].delay,
      endDelay: a.endDelay
    };
  }
}
function ar(e, r) {
  return _(U(e.map(function(t) {
    return r.map(function(o) {
      return tr(t, o);
    });
  })), function(t) {
    return !c.und(t);
  });
}
function Ie(e, r) {
  var t = e.length, o = function(n) {
    return n.timelineOffset ? n.timelineOffset : 0;
  }, a = {};
  return a.duration = t ? Math.max.apply(Math, e.map(function(n) {
    return o(n) + n.duration;
  })) : r.duration, a.delay = t ? Math.min.apply(Math, e.map(function(n) {
    return o(n) + n.delay;
  })) : r.delay, a.endDelay = t ? a.duration - Math.max.apply(Math, e.map(function(n) {
    return o(n) + n.duration - n.endDelay;
  })) : r.endDelay, a;
}
var de = 0;
function ir(e) {
  var r = K(ge, e), t = K(Y, e), o = er(t, e), a = Pe(e.targets), n = ar(a, o), s = Ie(n, t), l = de;
  return de++, $(r, {
    id: l,
    children: [],
    animatables: a,
    animations: n,
    duration: s.duration,
    delay: s.delay,
    endDelay: s.endDelay
  });
}
var S = [], Be = function() {
  var e;
  function r() {
    !e && (!he() || !T.suspendWhenDocumentHidden) && S.length > 0 && (e = requestAnimationFrame(t));
  }
  function t(a) {
    for (var n = S.length, s = 0; s < n; ) {
      var l = S[s];
      l.paused ? (S.splice(s, 1), n--) : (l.tick(a), s++);
    }
    e = s > 0 ? requestAnimationFrame(t) : void 0;
  }
  function o() {
    T.suspendWhenDocumentHidden && (he() ? e = cancelAnimationFrame(e) : (S.forEach(
      function(a) {
        return a._onDocumentVisibility();
      }
    ), Be()));
  }
  return typeof document < "u" && document.addEventListener("visibilitychange", o), r;
}();
function he() {
  return !!document && document.hidden;
}
function T(e) {
  e === void 0 && (e = {});
  var r = 0, t = 0, o = 0, a, n = 0, s = null;
  function l(g) {
    var p = window.Promise && new Promise(function(k) {
      return s = k;
    });
    return g.finished = p, p;
  }
  var i = ir(e);
  l(i);
  function d() {
    var g = i.direction;
    g !== "alternate" && (i.direction = g !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, a.forEach(function(p) {
      return p.reversed = i.reversed;
    });
  }
  function f(g) {
    return i.reversed ? i.duration - g : g;
  }
  function v() {
    r = 0, t = f(i.currentTime) * (1 / T.speed);
  }
  function u(g, p) {
    p && p.seek(g - p.timelineOffset);
  }
  function y(g) {
    if (i.reversePlayback)
      for (var k = n; k--; )
        u(g, a[k]);
    else
      for (var p = 0; p < n; p++)
        u(g, a[p]);
  }
  function m(g) {
    for (var p = 0, k = i.animations, I = k.length; p < I; ) {
      var O = k[p], B = O.animatable, F = O.tweens, L = F.length - 1, M = F[L];
      L && (M = _(F, function(De) {
        return g < De.end;
      })[0] || M);
      for (var A = P(g - M.start - M.delay, 0, M.duration) / M.duration, z = isNaN(A) ? 1 : M.easing(A), C = M.to.strings, N = M.round, q = [], Ae = M.to.numbers.length, D = void 0, V = 0; V < Ae; V++) {
        var j = void 0, se = M.to.numbers[V], ue = M.from.numbers[V] || 0;
        M.isPath ? j = Ye(M.value, z * se, M.isPathTargetInsideSVG) : j = ue + z * (se - ue), N && (M.isColor && V > 2 || (j = Math.round(j * N) / N)), q.push(j);
      }
      var le = C.length;
      if (!le)
        D = q[0];
      else {
        D = C[0];
        for (var H = 0; H < le; H++) {
          C[H];
          var fe = C[H + 1], Z = q[H];
          isNaN(Z) || (fe ? D += Z + fe : D += Z + " ");
        }
      }
      we[O.type](B.target, O.property, D, B.transforms), O.currentValue = D, p++;
    }
  }
  function h(g) {
    i[g] && !i.passThrough && i[g](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function x(g) {
    var p = i.duration, k = i.delay, I = p - i.endDelay, O = f(g);
    i.progress = P(O / p * 100, 0, 100), i.reversePlayback = O < i.currentTime, a && y(O), !i.began && i.currentTime > 0 && (i.began = !0, h("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, h("loopBegin")), O <= k && i.currentTime !== 0 && m(0), (O >= I && i.currentTime !== p || !p) && m(p), O > k && O < I ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, h("changeBegin")), h("change"), m(O)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, h("changeComplete")), i.currentTime = P(O, 0, p), i.began && h("update"), g >= p && (t = 0, b(), i.remaining ? (r = o, h("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && d()) : (i.paused = !0, i.completed || (i.completed = !0, h("loopComplete"), h("complete"), !i.passThrough && "Promise" in window && (s(), l(i)))));
  }
  return i.reset = function() {
    var g = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = g === "reverse", i.remaining = i.loop, a = i.children, n = a.length;
    for (var p = n; p--; )
      i.children[p].reset();
    (i.reversed && i.loop !== !0 || g === "alternate" && i.loop === 1) && i.remaining++, m(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = v, i.set = function(g, p) {
    return Ee(g, p), i;
  }, i.tick = function(g) {
    o = g, r || (r = o), x((o + (t - r)) * T.speed);
  }, i.seek = function(g) {
    x(f(g));
  }, i.pause = function() {
    i.paused = !0, v();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, S.push(i), v(), Be());
  }, i.reverse = function() {
    d(), i.completed = !i.reversed, v();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(g) {
    var p = oe(g);
    Le(p, i);
  }, i.reset(), i.autoplay && i.play(), i;
}
function pe(e, r) {
  for (var t = r.length; t--; )
    X(e, r[t].animatable.target) && r.splice(t, 1);
}
function Le(e, r) {
  var t = r.animations, o = r.children;
  pe(e, t);
  for (var a = o.length; a--; ) {
    var n = o[a], s = n.animations;
    pe(e, s), !s.length && !n.children.length && o.splice(a, 1);
  }
  !t.length && !o.length && r.pause();
}
function or(e) {
  for (var r = oe(e), t = S.length; t--; ) {
    var o = S[t];
    Le(r, o);
  }
}
function sr(e, r) {
  r === void 0 && (r = {});
  var t = r.direction || "normal", o = r.easing ? G(r.easing) : null, a = r.grid, n = r.axis, s = r.from || 0, l = s === "first", i = s === "center", d = s === "last", f = c.arr(e), v = parseFloat(f ? e[0] : e), u = f ? parseFloat(e[1]) : 0, y = E(f ? e[1] : e) || 0, m = r.start || 0 + (f ? v : 0), h = [], b = 0;
  return function(x, g, p) {
    if (l && (s = 0), i && (s = (p - 1) / 2), d && (s = p - 1), !h.length) {
      for (var k = 0; k < p; k++) {
        if (!a)
          h.push(Math.abs(s - k));
        else {
          var I = i ? (a[0] - 1) / 2 : s % a[0], O = i ? (a[1] - 1) / 2 : Math.floor(s / a[0]), B = k % a[0], F = Math.floor(k / a[0]), L = I - B, M = O - F, A = Math.sqrt(L * L + M * M);
          n === "x" && (A = -L), n === "y" && (A = -M), h.push(A);
        }
        b = Math.max.apply(Math, h);
      }
      o && (h = h.map(function(C) {
        return o(C / b) * b;
      })), t === "reverse" && (h = h.map(function(C) {
        return n ? C < 0 ? C * -1 : -C : Math.abs(b - C);
      }));
    }
    var z = f ? (u - v) / b : v;
    return m + z * (Math.round(h[g] * 100) / 100) + y;
  };
}
function ur(e) {
  e === void 0 && (e = {});
  var r = T(e);
  return r.duration = 0, r.add = function(t, o) {
    var a = S.indexOf(r), n = r.children;
    a > -1 && S.splice(a, 1);
    function s(u) {
      u.passThrough = !0;
    }
    for (var l = 0; l < n.length; l++)
      s(n[l]);
    var i = $(t, K(Y, e));
    i.targets = i.targets || e.targets;
    var d = r.duration;
    i.autoplay = !1, i.direction = r.direction, i.timelineOffset = c.und(o) ? d : ae(o, d), s(r), r.seek(i.timelineOffset);
    var f = T(i);
    s(f), n.push(f);
    var v = Ie(n, e);
    return r.delay = v.delay, r.endDelay = v.endDelay, r.duration = v.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
  }, r;
}
T.version = "3.2.1";
T.speed = 1;
T.suspendWhenDocumentHidden = !0;
T.running = S;
T.remove = or;
T.get = te;
T.set = Ee;
T.convertPx = re;
T.path = Je;
T.setDashoffset = Qe;
T.stagger = sr;
T.timeline = ur;
T.easing = G;
T.penner = Te;
T.random = function(e, r) {
  return Math.floor(Math.random() * (r - e + 1)) + e;
};
class lr {
  getScrollOffsetPercentage(r) {
    if (r.includes("%"))
      return parseInt(r.substring(0, r.length - 1)) / 100;
    if (parseInt(r))
      return parseInt(r);
    switch (r) {
      case "top":
        return 0;
      case "bottom":
        return 1;
      case "center":
        return 0.5;
      default:
        return null;
    }
  }
  createMarker(r, t, o, a, n = null, s = "absolute") {
    let l = document.createElement("div");
    return l.style.height = r, l.style.width = t, l.style.backgroundColor = o, l.style.position = s, l.style.top = a, n && (l.style.right = n), l;
  }
  createMarkerContainer() {
    return this.element.style.position = "relative", this.markerContainer = document.createElement("div"), this.markerContainer.style.overflow = "hidden", this.markerContainer.style.height = this.element.scrollHeight + "px", this.markerContainer.style.width = this.element.scrollWidth + "px", this.markerContainer.style.position = "absolute", this.markerContainer.style.left = "0", this.markerContainer.style.top = "0", this.element.prepend(this.markerContainer), this.markerContainer;
  }
  lerp(r, t, o) {
    let a = Math.abs(t - r), n = Math.max(t - o, 0);
    return 1 - Math.min(n / a, 1);
  }
  createPinContainer(r) {
    let t = document.createElement("div");
    return t.className = "pin-container", t.style.height = r.getBoundingClientRect().height + "px", t.style.width = r.getBoundingClientRect().width + "px", t.style.willChange = "transform", r.parentElement.appendChild(t), t.prepend(r), t;
  }
  removePinContainer(r) {
    r.parentElement.appendChild(r.children[0]), r.remove();
  }
  constructor(r, t) {
    this.element = r, t.forEach((n, s) => {
      var v;
      if (n.animations = {}, n.hasTriggered = !1, n.isActive = !1, (v = n.scrollTrigger).actions ?? (v.actions = "play none none reverse"), n.scrollTrigger.actions = n.scrollTrigger.actions.split(" "), n.scrollTrigger.actions.length < 4)
        throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
      if (Object.keys(n).forEach((u) => {
        ["targets", "scrollTrigger", "animations"].includes(u) || (n.animations[u] = n[u]);
      }), Object.keys(n.animations).length > 0) {
        n.scrollTrigger.lerp && (n.animations.easing = "linear");
        let u = {
          targets: n.targets,
          ...n.animations,
          autoplay: !1
        };
        n.scrollTrigger.onUpdate && (u.update = n.scrollTrigger.onUpdate), n.anime = T(u);
      }
      const l = (u) => {
        switch (u) {
          case "play":
            return n.anime.reversed && n.anime.reverse(), n.anime.play();
          case "pause":
            return n.anime.pause();
          case "reverse":
            return n.anime.reversed || n.anime.reverse(), n.anime.play();
          case "restart":
            return n.anime.reversed && n.anime.reverse(), n.anime.restart();
          case "reset":
            return n.anime.reversed && n.anime.reverse(), n.anime.reset();
          default:
            return null;
        }
      };
      n._onEnter = (u, y) => {
        if (u.scrollTrigger.onEnter && u.scrollTrigger.onEnter(u, y), !u.anime)
          return null;
        u.scrollTrigger.lerp ? u.anime.seek(u.anime.duration * y) : l(u.scrollTrigger.actions[0]);
      }, n._onLeave = (u, y) => {
        if (u.scrollTrigger.onLeave && u.scrollTrigger.onLeave(u, y), !u.anime)
          return null;
        l(u.scrollTrigger.actions[1]);
      }, n._onEnterBack = (u, y) => {
        if (u.scrollTrigger.onEnterBack && u.scrollTrigger.onEnterBack(u, y), !u.anime)
          return null;
        u.scrollTrigger.lerp ? u.anime.seek(u.anime.duration * y) : l(u.scrollTrigger.actions[2]);
      }, n._onLeaveBack = (u, y) => {
        if (u.scrollTrigger.onLeaveBack && u.scrollTrigger.onLeaveBack(u, y), !u.anime)
          return null;
        u.scrollTrigger.lerp || l(u.scrollTrigger.actions[3]);
      };
      let i = n.scrollTrigger.trigger.getBoundingClientRect(), d = n.scrollTrigger.start ?? "top center";
      if (d = d.split(" "), d.length < 2)
        throw new Error('Start must be in the format of "triggerOffset scrollOffset"');
      n.startTriggerOffset = i.top + i.height * this.getScrollOffsetPercentage(d[0]), n.startScrollPosition = d[1];
      let f = n.scrollTrigger.end ?? "bottom center";
      if (f = f.split(" "), f.length < 2)
        throw new Error('end must be in the format of "triggerOffset scrollOffset"');
      if (n.endScrollPosition = f[1], n.endTriggerOffset = i.top + i.height * this.getScrollOffsetPercentage(f[0]), n.animationTriggerStartOffset = n.startTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition), n.animationTriggerEndOffset = n.endTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition), n.animationTriggerStartOffset >= n.animationTriggerEndOffset && console.warn(`Trigger start offset of trigger - ${s} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`), n.scrollTrigger.debug) {
        let u = this.markerContainer ?? this.createMarkerContainer();
        n.scrollTrigger.startTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.startTriggerOffsetMarker ?? "#ff4949", n.startTriggerOffset + "px", i.right >= r.clientWidth ? r.clientWidth - 20 : i.right + "px"), n.scrollTrigger.endTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.endTriggerOffsetMarker ?? "#49deff", n.endTriggerOffset + "px", i.right >= r.clientWidth ? r.clientWidth - 20 : i.right + "px"), u.appendChild(n.scrollTrigger.startTriggerOffsetMarker), u.appendChild(n.scrollTrigger.endTriggerOffsetMarker), n.scrollTrigger.startScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.startScrollerOffsetMarker ?? "#ff4949", r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.endScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.endScrollerOffsetMarker ?? "#49deff", r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition) + "px", "0px", "absolute"), u.appendChild(n.scrollTrigger.startScrollerOffsetMarker), u.appendChild(n.scrollTrigger.endScrollerOffsetMarker);
      }
      n.scrollTrigger.pin && (n.initialTopOffset = n.startTriggerOffset);
    });
    let o = 0, a = !1;
    this.animations = t, r.addEventListener("scroll", (n) => {
      a = r.scrollTop > o, o = r.scrollTop, t.forEach((s) => {
        let l = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.startScrollPosition), i = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.endScrollPosition);
        if (s.scrollTrigger.debug && (s.scrollTrigger.startScrollerOffsetMarker.style.top = l + "px", s.scrollTrigger.endScrollerOffsetMarker.style.top = i + "px"), r.scrollTop >= s.animationTriggerStartOffset && r.scrollTop <= s.animationTriggerEndOffset) {
          if (s.scrollTrigger.lerp || !s.isActive) {
            let d = this.lerp(s.animationTriggerStartOffset, s.animationTriggerEndOffset, r.scrollTop);
            (d > 0.99 || d < 0.09) && (d = Math.round(d)), a ? s._onEnter(s, d) : s._onEnterBack(s, d);
          }
          if (s.scrollTrigger.pin) {
            s.pinContainer ?? (s.pinContainer = this.createPinContainer(s.scrollTrigger.trigger));
            let d = r.scrollTop - s.initialTopOffset;
            s.pinContainer.style.transform = `translate3d(0,${d}px,0)`;
          }
          s.isActive = !0;
          return;
        }
        if (r.scrollTop >= s.animationTriggerEndOffset && s.isActive) {
          s._onLeave(s), s.isActive = !1;
          return;
        }
        r.scrollTop < s.animationTriggerStartOffset && s.isActive && (s._onLeaveBack(s), s.isActive = !1, s.scrollTrigger.pin && s.pinContainer && (this.removePinContainer(s.pinContainer), s.pinContainer = null));
      });
    });
  }
}
export {
  lr as default
};
