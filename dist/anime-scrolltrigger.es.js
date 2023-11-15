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
var d = {
  arr: function(e) {
    return Array.isArray(e);
  },
  obj: function(e) {
    return R(Object.prototype.toString.call(e), "Object");
  },
  pth: function(e) {
    return d.obj(e) && e.hasOwnProperty("totalLength");
  },
  svg: function(e) {
    return e instanceof SVGElement;
  },
  inp: function(e) {
    return e instanceof HTMLInputElement;
  },
  dom: function(e) {
    return e.nodeType || d.svg(e);
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
    return d.und(e) || e === null;
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
    return d.hex(e) || d.rgb(e) || d.hsl(e);
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
  var t = me(e), o = P(d.und(t[0]) ? 1 : t[0], 0.1, 100), a = P(d.und(t[1]) ? 100 : t[1], 0.1, 100), n = P(d.und(t[2]) ? 10 : t[2], 0.1, 100), s = P(d.und(t[3]) ? 0 : t[3], 0.1, 100), u = Math.sqrt(a / o), i = n / (2 * Math.sqrt(a * o)), v = i < 1 ? u * Math.sqrt(1 - i * i) : 0, l = 1, f = i < 1 ? (i * u + -s) / v : -s + u;
  function m(h) {
    var p = r ? r * h / 1e3 : h;
    return i < 1 ? p = Math.exp(-p * i * u) * (l * Math.cos(v * p) + f * Math.sin(v * p)) : p = (l + f * p) * Math.exp(-p * u), h === 0 || h === 1 ? h : 1 - p;
  }
  function c() {
    var h = W.springs[e];
    if (h)
      return h;
    for (var p = 1 / 6, b = 0, x = 0; ; )
      if (b += p, m(b) === 1) {
        if (x++, x >= 16)
          break;
      } else
        x = 0;
    var y = b * p * 1e3;
    return W.springs[e] = y, y;
  }
  return r ? m : c;
}
function Ve(e) {
  return e === void 0 && (e = 10), function(r) {
    return Math.ceil(P(r, 1e-6, 1) * e) * (1 / e);
  };
}
var je = function() {
  var e = 11, r = 1 / (e - 1);
  function t(l, f) {
    return 1 - 3 * f + 3 * l;
  }
  function o(l, f) {
    return 3 * f - 6 * l;
  }
  function a(l) {
    return 3 * l;
  }
  function n(l, f, m) {
    return ((t(f, m) * l + o(f, m)) * l + a(f)) * l;
  }
  function s(l, f, m) {
    return 3 * t(f, m) * l * l + 2 * o(f, m) * l + a(f);
  }
  function u(l, f, m, c, h) {
    var p, b, x = 0;
    do
      b = f + (m - f) / 2, p = n(b, c, h) - l, p > 0 ? m = b : f = b;
    while (Math.abs(p) > 1e-7 && ++x < 10);
    return b;
  }
  function i(l, f, m, c) {
    for (var h = 0; h < 4; ++h) {
      var p = s(f, m, c);
      if (p === 0)
        return f;
      var b = n(f, m, c) - l;
      f -= b / p;
    }
    return f;
  }
  function v(l, f, m, c) {
    if (!(0 <= l && l <= 1 && 0 <= m && m <= 1))
      return;
    var h = new Float32Array(e);
    if (l !== f || m !== c)
      for (var p = 0; p < e; ++p)
        h[p] = n(p * r, l, m);
    function b(x) {
      for (var y = 0, g = 1, k = e - 1; g !== k && h[g] <= x; ++g)
        y += r;
      --g;
      var I = (x - h[g]) / (h[g + 1] - h[g]), O = y + I * r, B = s(O, l, m);
      return B >= 1e-3 ? i(x, O, l, m) : B === 0 ? O : u(x, y, y + r, l, m);
    }
    return function(x) {
      return l === f && m === c || x === 0 || x === 1 ? x : n(b(x), f, c);
    };
  }
  return v;
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
      return function(u) {
        return u === 0 || u === 1 ? u : -n * Math.pow(2, 10 * (u - 1)) * Math.sin((u - 1 - s / (Math.PI * 2) * Math.asin(1 / n)) * (Math.PI * 2) / s);
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
      return function(u) {
        return 1 - a(n, s)(1 - u);
      };
    }, e["easeInOut" + o] = function(n, s) {
      return function(u) {
        return u < 0.5 ? a(n, s)(u * 2) / 2 : 1 - a(n, s)(u * -2 + 2) / 2;
      };
    }, e["easeOutIn" + o] = function(n, s) {
      return function(u) {
        return u < 0.5 ? (1 - a(n, s)(1 - u * 2)) / 2 : (a(n, s)(u * 2 - 1) + 1) / 2;
      };
    };
  }), e;
}();
function G(e, r) {
  if (d.fnc(e))
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
    return r.concat(d.arr(t) ? U(t) : t);
  }, []);
}
function ce(e) {
  return d.arr(e) ? e : (d.str(e) && (e = be(e) || e), e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e]);
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
    t[o] = d.und(e[o]) ? r[o] : e[o];
  return t;
}
function He(e) {
  var r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);
  return r ? "rgba(" + r[1] + ",1)" : e;
}
function Re(e) {
  var r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, t = e.replace(r, function(u, i, v, l) {
    return i + i + v + v + l + l;
  }), o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), a = parseInt(o[1], 16), n = parseInt(o[2], 16), s = parseInt(o[3], 16);
  return "rgba(" + a + "," + n + "," + s + ",1)";
}
function ze(e) {
  var r = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), t = parseInt(r[1], 10) / 360, o = parseInt(r[2], 10) / 100, a = parseInt(r[3], 10) / 100, n = r[4] || 1;
  function s(m, c, h) {
    return h < 0 && (h += 1), h > 1 && (h -= 1), h < 1 / 6 ? m + (c - m) * 6 * h : h < 1 / 2 ? c : h < 2 / 3 ? m + (c - m) * (2 / 3 - h) * 6 : m;
  }
  var u, i, v;
  if (o == 0)
    u = i = v = a;
  else {
    var l = a < 0.5 ? a * (1 + o) : a + o - a * o, f = 2 * a - l;
    u = s(f, l, t + 1 / 3), i = s(f, l, t), v = s(f, l, t - 1 / 3);
  }
  return "rgba(" + u * 255 + "," + i * 255 + "," + v * 255 + "," + n + ")";
}
function We(e) {
  if (d.rgb(e))
    return He(e);
  if (d.hex(e))
    return Re(e);
  if (d.hsl(e))
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
  return d.fnc(e) ? e(r.target, r.id, r.total) : e;
}
function w(e, r) {
  return e.getAttribute(r);
}
function re(e, r, t) {
  var o = E(r);
  if (X([t, "deg", "rad", "turn"], o))
    return r;
  var a = W.CSS[r + t];
  if (!d.und(a))
    return a;
  var n = 100, s = document.createElement(e.tagName), u = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
  u.appendChild(s), s.style.position = "absolute", s.style.width = n + t;
  var i = n / s.offsetWidth;
  u.removeChild(s);
  var v = i * parseFloat(r);
  return W.CSS[r + t] = v, v;
}
function Oe(e, r, t) {
  if (r in e.style) {
    var o = r.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), a = e.style[r] || getComputedStyle(e).getPropertyValue(o) || "0";
    return t ? re(e, a, t) : a;
  }
}
function ne(e, r) {
  if (d.dom(e) && !d.inp(e) && (!d.nil(w(e, r)) || d.svg(e) && e[r]))
    return "attribute";
  if (d.dom(e) && X(Fe, r))
    return "transform";
  if (d.dom(e) && r !== "transform" && Oe(e, r))
    return "css";
  if (e[r] != null)
    return "object";
}
function xe(e) {
  if (d.dom(e)) {
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
  if (d.col(e))
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
  for (var r = e.parentNode; d.svg(r) && d.svg(r.parentNode); )
    r = r.parentNode;
  return r;
}
function Se(e, r) {
  var t = r || {}, o = t.el || Ke(e), a = o.getBoundingClientRect(), n = w(o, "viewBox"), s = a.width, u = a.height, i = t.viewBox || (n ? n.split(" ") : [0, 0, s, u]);
  return {
    el: o,
    viewBox: i,
    x: i[0] / 1,
    y: i[1] / 1,
    w: s,
    h: u,
    vW: i[2],
    vH: i[3]
  };
}
function Je(e, r) {
  var t = d.str(e) ? be(e)[0] : e, o = r || 100;
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
  function o(l) {
    l === void 0 && (l = 0);
    var f = r + l >= 1 ? r + l : 0;
    return e.el.getPointAtLength(f);
  }
  var a = Se(e.el, e.svg), n = o(), s = o(-1), u = o(1), i = t ? 1 : a.w / a.vW, v = t ? 1 : a.h / a.vH;
  switch (e.property) {
    case "x":
      return (n.x - a.x) * i;
    case "y":
      return (n.y - a.y) * v;
    case "angle":
      return Math.atan2(u.y - s.y, u.x - s.x) * 180 / Math.PI;
  }
}
function ve(e, r) {
  var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, o = Me(d.pth(e) ? e.totalLength : e, r) + "";
  return {
    original: o,
    numbers: o.match(t) ? o.match(t).map(Number) : [0],
    strings: d.str(e) || r ? o.split(t) : []
  };
}
function oe(e) {
  var r = e ? U(d.arr(e) ? e.map(ce) : ce(e)) : [];
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
  if (/^spring/.test(t.easing) && (t.duration = ye(t.easing)), d.arr(e)) {
    var o = e.length, a = o === 2 && !d.obj(e[0]);
    a ? e = { value: e } : d.fnc(r.duration) || (t.duration = r.duration / o);
  }
  var n = d.arr(e) ? e : [e];
  return n.map(function(s, u) {
    var i = d.obj(s) && !d.pth(s) ? s : { value: s };
    return d.und(i.delay) && (i.delay = u ? 0 : r.delay), d.und(i.endDelay) && (i.endDelay = u === n.length - 1 ? r.endDelay : 0), i;
  }).map(function(s) {
    return $(s, t);
  });
}
function Xe(e) {
  for (var r = _(U(e.map(function(n) {
    return Object.keys(n);
  })), function(n) {
    return d.key(n);
  }).reduce(function(n, s) {
    return n.indexOf(s) < 0 && n.push(s), n;
  }, []), t = {}, o = function(n) {
    var s = r[n];
    t[s] = e.map(function(u) {
      var i = {};
      for (var v in u)
        d.key(v) ? v == s && (i.value = u[v]) : i[v] = u[v];
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
    d.key(a) && t.push({
      name: a,
      tweens: Ge(r[a], e)
    });
  return t;
}
function rr(e, r) {
  var t = {};
  for (var o in e) {
    var a = J(e[o], r);
    d.arr(a) && (a = a.map(function(n) {
      return J(n, r);
    }), a.length === 1 && (a = a[0])), t[o] = a;
  }
  return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t;
}
function nr(e, r) {
  var t;
  return e.tweens.map(function(o) {
    var a = rr(o, r), n = a.value, s = d.arr(n) ? n[1] : n, u = E(s), i = te(r.target, e.name, u, r), v = t ? t.to.original : i, l = d.arr(n) ? n[0] : v, f = E(l) || E(i), m = u || f;
    return d.und(s) && (s = v), a.from = ve(l, m), a.to = ve(ae(s, l), m), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = G(a.easing, a.duration), a.isPath = d.pth(n), a.isPathTargetInsideSVG = a.isPath && d.svg(r.target), a.isColor = d.col(a.from.original), a.isColor && (a.round = 1), t = a, a;
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
      o.list.forEach(function(s, u) {
        n += u + "(" + s + ") ";
      }), e.style.transform = n;
    }
  }
};
function Ee(e, r) {
  var t = Pe(e);
  t.forEach(function(o) {
    for (var a in r) {
      var n = J(r[a], o), s = o.target, u = E(n), i = te(s, a, u, o), v = u || E(i), l = ae(Me(n, v), i), f = ne(s, a);
      we[f](s, a, l, o.transforms, !0);
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
    return !d.und(t);
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
  var r = K(ge, e), t = K(Y, e), o = er(t, e), a = Pe(e.targets), n = ar(a, o), s = Ie(n, t), u = de;
  return de++, $(r, {
    id: u,
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
      var u = S[s];
      u.paused ? (S.splice(s, 1), n--) : (u.tick(a), s++);
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
  function u(y) {
    var g = window.Promise && new Promise(function(k) {
      return s = k;
    });
    return y.finished = g, g;
  }
  var i = ir(e);
  u(i);
  function v() {
    var y = i.direction;
    y !== "alternate" && (i.direction = y !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, a.forEach(function(g) {
      return g.reversed = i.reversed;
    });
  }
  function l(y) {
    return i.reversed ? i.duration - y : y;
  }
  function f() {
    r = 0, t = l(i.currentTime) * (1 / T.speed);
  }
  function m(y, g) {
    g && g.seek(y - g.timelineOffset);
  }
  function c(y) {
    if (i.reversePlayback)
      for (var k = n; k--; )
        m(y, a[k]);
    else
      for (var g = 0; g < n; g++)
        m(y, a[g]);
  }
  function h(y) {
    for (var g = 0, k = i.animations, I = k.length; g < I; ) {
      var O = k[g], B = O.animatable, F = O.tweens, L = F.length - 1, M = F[L];
      L && (M = _(F, function(De) {
        return y < De.end;
      })[0] || M);
      for (var A = P(y - M.start - M.delay, 0, M.duration) / M.duration, z = isNaN(A) ? 1 : M.easing(A), C = M.to.strings, N = M.round, q = [], Ae = M.to.numbers.length, D = void 0, V = 0; V < Ae; V++) {
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
      we[O.type](B.target, O.property, D, B.transforms), O.currentValue = D, g++;
    }
  }
  function p(y) {
    i[y] && !i.passThrough && i[y](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function x(y) {
    var g = i.duration, k = i.delay, I = g - i.endDelay, O = l(y);
    i.progress = P(O / g * 100, 0, 100), i.reversePlayback = O < i.currentTime, a && c(O), !i.began && i.currentTime > 0 && (i.began = !0, p("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, p("loopBegin")), O <= k && i.currentTime !== 0 && h(0), (O >= I && i.currentTime !== g || !g) && h(g), O > k && O < I ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, p("changeBegin")), p("change"), h(O)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, p("changeComplete")), i.currentTime = P(O, 0, g), i.began && p("update"), y >= g && (t = 0, b(), i.remaining ? (r = o, p("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && v()) : (i.paused = !0, i.completed || (i.completed = !0, p("loopComplete"), p("complete"), !i.passThrough && "Promise" in window && (s(), u(i)))));
  }
  return i.reset = function() {
    var y = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = y === "reverse", i.remaining = i.loop, a = i.children, n = a.length;
    for (var g = n; g--; )
      i.children[g].reset();
    (i.reversed && i.loop !== !0 || y === "alternate" && i.loop === 1) && i.remaining++, h(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = f, i.set = function(y, g) {
    return Ee(y, g), i;
  }, i.tick = function(y) {
    o = y, r || (r = o), x((o + (t - r)) * T.speed);
  }, i.seek = function(y) {
    x(l(y));
  }, i.pause = function() {
    i.paused = !0, f();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, S.push(i), f(), Be());
  }, i.reverse = function() {
    v(), i.completed = !i.reversed, f();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(y) {
    var g = oe(y);
    Le(g, i);
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
  var t = r.direction || "normal", o = r.easing ? G(r.easing) : null, a = r.grid, n = r.axis, s = r.from || 0, u = s === "first", i = s === "center", v = s === "last", l = d.arr(e), f = parseFloat(l ? e[0] : e), m = l ? parseFloat(e[1]) : 0, c = E(l ? e[1] : e) || 0, h = r.start || 0 + (l ? f : 0), p = [], b = 0;
  return function(x, y, g) {
    if (u && (s = 0), i && (s = (g - 1) / 2), v && (s = g - 1), !p.length) {
      for (var k = 0; k < g; k++) {
        if (!a)
          p.push(Math.abs(s - k));
        else {
          var I = i ? (a[0] - 1) / 2 : s % a[0], O = i ? (a[1] - 1) / 2 : Math.floor(s / a[0]), B = k % a[0], F = Math.floor(k / a[0]), L = I - B, M = O - F, A = Math.sqrt(L * L + M * M);
          n === "x" && (A = -L), n === "y" && (A = -M), p.push(A);
        }
        b = Math.max.apply(Math, p);
      }
      o && (p = p.map(function(C) {
        return o(C / b) * b;
      })), t === "reverse" && (p = p.map(function(C) {
        return n ? C < 0 ? C * -1 : -C : Math.abs(b - C);
      }));
    }
    var z = l ? (m - f) / b : f;
    return h + z * (Math.round(p[y] * 100) / 100) + c;
  };
}
function ur(e) {
  e === void 0 && (e = {});
  var r = T(e);
  return r.duration = 0, r.add = function(t, o) {
    var a = S.indexOf(r), n = r.children;
    a > -1 && S.splice(a, 1);
    function s(m) {
      m.passThrough = !0;
    }
    for (var u = 0; u < n.length; u++)
      s(n[u]);
    var i = $(t, K(Y, e));
    i.targets = i.targets || e.targets;
    var v = r.duration;
    i.autoplay = !1, i.direction = r.direction, i.timelineOffset = d.und(o) ? v : ae(o, v), s(r), r.seek(i.timelineOffset);
    var l = T(i);
    s(l), n.push(l);
    var f = Ie(n, e);
    return r.delay = f.delay, r.endDelay = f.endDelay, r.duration = f.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
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
    let u = document.createElement("div");
    return u.style.height = r, u.style.width = t, u.style.backgroundColor = o, u.style.position = s, u.style.top = a, n && (u.style.right = n), u;
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
      var m;
      if (n.animations = {}, n.hasTriggered = !1, n.isActive = !1, (m = n.scrollTrigger).actions ?? (m.actions = "play none none reverse"), n.scrollTrigger.actions = n.scrollTrigger.actions.split(" "), n.scrollTrigger.actions.length < 4)
        throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
      Object.keys(n).forEach((c) => {
        ["targets", "scrollTrigger", "animations"].includes(c) || (n.animations[c] = n[c]);
      }), n.scrollTrigger.lerp && (n.animations.easing = "linear");
      let u = {
        targets: n.targets,
        ...n.animations,
        autoplay: !1
      };
      n.scrollTrigger.onUpdate && (u.update = n.scrollTrigger.onUpdate), n.anime = T(u);
      const i = (c) => {
        switch (c) {
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
      n._onEnter = (c, h) => {
        c.scrollTrigger.onEnter && c.scrollTrigger.onEnter(c, h), c.scrollTrigger.lerp ? c.anime.seek(c.anime.duration * h) : i(c.scrollTrigger.actions[0]);
      }, n._onLeave = (c, h) => {
        c.scrollTrigger.onLeave && c.scrollTrigger.onLeave(c, h), i(c.scrollTrigger.actions[1]);
      }, n._onEnterBack = (c, h) => {
        c.scrollTrigger.onEnterBack && c.scrollTrigger.onEnterBack(c, h), c.scrollTrigger.lerp ? c.anime.seek(c.anime.duration * h) : i(c.scrollTrigger.actions[2]);
      }, n._onLeaveBack = (c, h) => {
        c.scrollTrigger.onLeaveBack && c.scrollTrigger.onLeaveBack(c, h), c.scrollTrigger.lerp || i(c.scrollTrigger.actions[3]);
      };
      let v = n.scrollTrigger.trigger.getBoundingClientRect(), l = n.scrollTrigger.start ?? "top center";
      if (l = l.split(" "), l.length < 2)
        throw new Error('Start must be in the format of "triggerOffset scrollOffset"');
      n.startTriggerOffset = v.top + v.height * this.getScrollOffsetPercentage(l[0]), n.startScrollPosition = l[1];
      let f = n.scrollTrigger.end ?? "bottom center";
      if (f = f.split(" "), f.length < 2)
        throw new Error('end must be in the format of "triggerOffset scrollOffset"');
      if (n.endScrollPosition = f[1], n.endTriggerOffset = v.top + v.height * this.getScrollOffsetPercentage(f[0]), n.animationTriggerStartOffset = n.startTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition), n.animationTriggerEndOffset = n.endTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition), n.animationTriggerStartOffset >= n.animationTriggerEndOffset && console.warn(`Trigger start offset of trigger - ${s} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`), n.scrollTrigger.debug) {
        let c = this.markerContainer ?? this.createMarkerContainer();
        n.scrollTrigger.startTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.startTriggerOffsetMarker ?? "#ff4949", n.startTriggerOffset + "px", v.right >= r.clientWidth ? r.clientWidth - 20 : v.right + "px"), n.scrollTrigger.endTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.endTriggerOffsetMarker ?? "#49deff", n.endTriggerOffset + "px", v.right >= r.clientWidth ? r.clientWidth - 20 : v.right + "px"), c.appendChild(n.scrollTrigger.startTriggerOffsetMarker), c.appendChild(n.scrollTrigger.endTriggerOffsetMarker), n.scrollTrigger.startScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.startScrollerOffsetMarker ?? "#ff4949", r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.endScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.endScrollerOffsetMarker ?? "#49deff", r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition) + "px", "0px", "absolute"), c.appendChild(n.scrollTrigger.startScrollerOffsetMarker), c.appendChild(n.scrollTrigger.endScrollerOffsetMarker);
      }
      n.scrollTrigger.pin && (n.initialTopOffset = n.startTriggerOffset + v.top);
    });
    let o = 0, a = !1;
    r.addEventListener("scroll", (n) => {
      a = r.scrollTop > o, o = r.scrollTop, t.forEach((s) => {
        let u = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.startScrollPosition), i = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.endScrollPosition);
        if (s.scrollTrigger.debug && (s.scrollTrigger.startScrollerOffsetMarker.style.top = u + "px", s.scrollTrigger.endScrollerOffsetMarker.style.top = i + "px"), r.scrollTop >= s.animationTriggerStartOffset && r.scrollTop <= s.animationTriggerEndOffset) {
          if (s.scrollTrigger.lerp || !s.isActive) {
            let v = this.lerp(s.animationTriggerStartOffset, s.animationTriggerEndOffset, r.scrollTop);
            (v > 0.99 || v < 0.09) && (v = Math.round(v)), a ? s._onEnter(s, v) : s._onEnterBack(s, v);
          }
          if (s.scrollTrigger.pin) {
            s.pinContainer ?? (s.pinContainer = this.createPinContainer(s.scrollTrigger.trigger));
            let v = r.scrollTop - s.initialTopOffset;
            s.pinContainer.style.transform = `translate3d(0,${v}px,0)`;
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
