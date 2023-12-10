var me = {
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
}, J = {
  duration: 1e3,
  delay: 0,
  endDelay: 0,
  easing: "easeOutElastic(1, .5)",
  round: 0
}, Fe = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"], W = {
  CSS: {},
  springs: {}
};
function S(e, r, t) {
  return Math.min(Math.max(e, r), t);
}
function H(e, r) {
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
    return H(Object.prototype.toString.call(e), "Object");
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
    return !me.hasOwnProperty(e) && !J.hasOwnProperty(e) && e !== "targets" && e !== "keyframes";
  }
};
function ge(e) {
  var r = /\(([^)]+)\)/.exec(e);
  return r ? r[1].split(",").map(function(t) {
    return parseFloat(t);
  }) : [];
}
function ye(e, r) {
  var t = ge(e), i = S(d.und(t[0]) ? 1 : t[0], 0.1, 100), a = S(d.und(t[1]) ? 100 : t[1], 0.1, 100), n = S(d.und(t[2]) ? 10 : t[2], 0.1, 100), s = S(d.und(t[3]) ? 0 : t[3], 0.1, 100), u = Math.sqrt(a / i), o = n / (2 * Math.sqrt(a * i)), v = o < 1 ? u * Math.sqrt(1 - o * o) : 0, c = 1, f = o < 1 ? (o * u + -s) / v : -s + u;
  function l(g) {
    var h = r ? r * g / 1e3 : g;
    return o < 1 ? h = Math.exp(-h * o * u) * (c * Math.cos(v * h) + f * Math.sin(v * h)) : h = (c + f * h) * Math.exp(-h * u), g === 0 || g === 1 ? g : 1 - h;
  }
  function y() {
    var g = W.springs[e];
    if (g)
      return g;
    for (var h = 1 / 6, b = 0, k = 0; ; )
      if (b += h, l(b) === 1) {
        if (k++, k >= 16)
          break;
      } else
        k = 0;
    var m = b * h * 1e3;
    return W.springs[e] = m, m;
  }
  return r ? l : y;
}
function je(e) {
  return e === void 0 && (e = 10), function(r) {
    return Math.ceil(S(r, 1e-6, 1) * e) * (1 / e);
  };
}
var Ve = function() {
  var e = 11, r = 1 / (e - 1);
  function t(c, f) {
    return 1 - 3 * f + 3 * c;
  }
  function i(c, f) {
    return 3 * f - 6 * c;
  }
  function a(c) {
    return 3 * c;
  }
  function n(c, f, l) {
    return ((t(f, l) * c + i(f, l)) * c + a(f)) * c;
  }
  function s(c, f, l) {
    return 3 * t(f, l) * c * c + 2 * i(f, l) * c + a(f);
  }
  function u(c, f, l, y, g) {
    var h, b, k = 0;
    do
      b = f + (l - f) / 2, h = n(b, y, g) - c, h > 0 ? l = b : f = b;
    while (Math.abs(h) > 1e-7 && ++k < 10);
    return b;
  }
  function o(c, f, l, y) {
    for (var g = 0; g < 4; ++g) {
      var h = s(f, l, y);
      if (h === 0)
        return f;
      var b = n(f, l, y) - c;
      f -= b / h;
    }
    return f;
  }
  function v(c, f, l, y) {
    if (!(0 <= c && c <= 1 && 0 <= l && l <= 1))
      return;
    var g = new Float32Array(e);
    if (c !== f || l !== y)
      for (var h = 0; h < e; ++h)
        g[h] = n(h * r, c, l);
    function b(k) {
      for (var m = 0, p = 1, M = e - 1; p !== M && g[p] <= k; ++p)
        m += r;
      --p;
      var B = (k - g[p]) / (g[p + 1] - g[p]), O = m + B * r, I = s(O, c, l);
      return I >= 1e-3 ? o(k, O, c, l) : I === 0 ? O : u(k, m, m + r, c, l);
    }
    return function(k) {
      return c === f && l === y || k === 0 || k === 1 ? k : n(b(k), f, y);
    };
  }
  return v;
}(), Te = function() {
  var e = { linear: function() {
    return function(i) {
      return i;
    };
  } }, r = {
    Sine: function() {
      return function(i) {
        return 1 - Math.cos(i * Math.PI / 2);
      };
    },
    Circ: function() {
      return function(i) {
        return 1 - Math.sqrt(1 - i * i);
      };
    },
    Back: function() {
      return function(i) {
        return i * i * (3 * i - 2);
      };
    },
    Bounce: function() {
      return function(i) {
        for (var a, n = 4; i < ((a = Math.pow(2, --n)) - 1) / 11; )
          ;
        return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((a * 3 - 2) / 22 - i, 2);
      };
    },
    Elastic: function(i, a) {
      i === void 0 && (i = 1), a === void 0 && (a = 0.5);
      var n = S(i, 1, 10), s = S(a, 0.1, 2);
      return function(u) {
        return u === 0 || u === 1 ? u : -n * Math.pow(2, 10 * (u - 1)) * Math.sin((u - 1 - s / (Math.PI * 2) * Math.asin(1 / n)) * (Math.PI * 2) / s);
      };
    }
  }, t = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
  return t.forEach(function(i, a) {
    r[i] = function() {
      return function(n) {
        return Math.pow(n, a + 2);
      };
    };
  }), Object.keys(r).forEach(function(i) {
    var a = r[i];
    e["easeIn" + i] = a, e["easeOut" + i] = function(n, s) {
      return function(u) {
        return 1 - a(n, s)(1 - u);
      };
    }, e["easeInOut" + i] = function(n, s) {
      return function(u) {
        return u < 0.5 ? a(n, s)(u * 2) / 2 : 1 - a(n, s)(u * -2 + 2) / 2;
      };
    }, e["easeOutIn" + i] = function(n, s) {
      return function(u) {
        return u < 0.5 ? (1 - a(n, s)(1 - u * 2)) / 2 : (a(n, s)(u * 2 - 1) + 1) / 2;
      };
    };
  }), e;
}();
function G(e, r) {
  if (d.fnc(e))
    return e;
  var t = e.split("(")[0], i = Te[t], a = ge(e);
  switch (t) {
    case "spring":
      return ye(e, r);
    case "cubicBezier":
      return Q(Ve, a);
    case "steps":
      return Q(je, a);
    default:
      return Q(i, a);
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
function z(e, r) {
  for (var t = e.length, i = arguments.length >= 2 ? arguments[1] : void 0, a = [], n = 0; n < t; n++)
    if (n in e) {
      var s = e[n];
      r.call(i, s, n, e) && a.push(s);
    }
  return a;
}
function _(e) {
  return e.reduce(function(r, t) {
    return r.concat(d.arr(t) ? _(t) : t);
  }, []);
}
function fe(e) {
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
  for (var i in e)
    t[i] = r.hasOwnProperty(i) ? r[i] : e[i];
  return t;
}
function N(e, r) {
  var t = ee(e);
  for (var i in r)
    t[i] = d.und(e[i]) ? r[i] : e[i];
  return t;
}
function Re(e) {
  var r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);
  return r ? "rgba(" + r[1] + ",1)" : e;
}
function He(e) {
  var r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, t = e.replace(r, function(u, o, v, c) {
    return o + o + v + v + c + c;
  }), i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), a = parseInt(i[1], 16), n = parseInt(i[2], 16), s = parseInt(i[3], 16);
  return "rgba(" + a + "," + n + "," + s + ",1)";
}
function Ue(e) {
  var r = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), t = parseInt(r[1], 10) / 360, i = parseInt(r[2], 10) / 100, a = parseInt(r[3], 10) / 100, n = r[4] || 1;
  function s(l, y, g) {
    return g < 0 && (g += 1), g > 1 && (g -= 1), g < 1 / 6 ? l + (y - l) * 6 * g : g < 1 / 2 ? y : g < 2 / 3 ? l + (y - l) * (2 / 3 - g) * 6 : l;
  }
  var u, o, v;
  if (i == 0)
    u = o = v = a;
  else {
    var c = a < 0.5 ? a * (1 + i) : a + i - a * i, f = 2 * a - c;
    u = s(f, c, t + 1 / 3), o = s(f, c, t), v = s(f, c, t - 1 / 3);
  }
  return "rgba(" + u * 255 + "," + o * 255 + "," + v * 255 + "," + n + ")";
}
function We(e) {
  if (d.rgb(e))
    return Re(e);
  if (d.hex(e))
    return He(e);
  if (d.hsl(e))
    return Ue(e);
}
function E(e) {
  var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
  if (r)
    return r[1];
}
function ze(e) {
  if (H(e, "translate") || e === "perspective")
    return "px";
  if (H(e, "rotate") || H(e, "skew"))
    return "deg";
}
function Y(e, r) {
  return d.fnc(e) ? e(r.target, r.id, r.total) : e;
}
function P(e, r) {
  return e.getAttribute(r);
}
function re(e, r, t) {
  var i = E(r);
  if (X([t, "deg", "rad", "turn"], i))
    return r;
  var a = W.CSS[r + t];
  if (!d.und(a))
    return a;
  var n = 100, s = document.createElement(e.tagName), u = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
  u.appendChild(s), s.style.position = "absolute", s.style.width = n + t;
  var o = n / s.offsetWidth;
  u.removeChild(s);
  var v = o * parseFloat(r);
  return W.CSS[r + t] = v, v;
}
function Oe(e, r, t) {
  if (r in e.style) {
    var i = r.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), a = e.style[r] || getComputedStyle(e).getPropertyValue(i) || "0";
    return t ? re(e, a, t) : a;
  }
}
function ne(e, r) {
  if (d.dom(e) && !d.inp(e) && (!d.nil(P(e, r)) || d.svg(e) && e[r]))
    return "attribute";
  if (d.dom(e) && X(Fe, r))
    return "transform";
  if (d.dom(e) && r !== "transform" && Oe(e, r))
    return "css";
  if (e[r] != null)
    return "object";
}
function ke(e) {
  if (d.dom(e)) {
    for (var r = e.style.transform || "", t = /(\w+)\(([^)]*)\)/g, i = /* @__PURE__ */ new Map(), a; a = t.exec(r); )
      i.set(a[1], a[2]);
    return i;
  }
}
function _e(e, r, t, i) {
  var a = H(r, "scale") ? 1 : 0 + ze(r), n = ke(e).get(r) || a;
  return t && (t.transforms.list.set(r, n), t.transforms.last = r), i ? re(e, n, i) : n;
}
function te(e, r, t, i) {
  switch (ne(e, r)) {
    case "transform":
      return _e(e, r, i, t);
    case "css":
      return Oe(e, r, t);
    case "attribute":
      return P(e, r);
    default:
      return e[r] || 0;
  }
}
function ae(e, r) {
  var t = /^(\*=|\+=|-=)/.exec(e);
  if (!t)
    return e;
  var i = E(e) || 0, a = parseFloat(r), n = parseFloat(e.replace(t[0], ""));
  switch (t[0][0]) {
    case "+":
      return a + n + i;
    case "-":
      return a - n + i;
    case "*":
      return a * n + i;
  }
}
function xe(e, r) {
  if (d.col(e))
    return We(e);
  if (/\s/g.test(e))
    return e;
  var t = E(e), i = t ? e.substr(0, e.length - t.length) : e;
  return r ? i + r : i;
}
function ie(e, r) {
  return Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
}
function Ne(e) {
  return Math.PI * 2 * P(e, "r");
}
function qe(e) {
  return P(e, "width") * 2 + P(e, "height") * 2;
}
function $e(e) {
  return ie(
    { x: P(e, "x1"), y: P(e, "y1") },
    { x: P(e, "x2"), y: P(e, "y2") }
  );
}
function Me(e) {
  for (var r = e.points, t = 0, i, a = 0; a < r.numberOfItems; a++) {
    var n = r.getItem(a);
    a > 0 && (t += ie(i, n)), i = n;
  }
  return t;
}
function Ze(e) {
  var r = e.points;
  return Me(e) + ie(r.getItem(r.numberOfItems - 1), r.getItem(0));
}
function Ce(e) {
  if (e.getTotalLength)
    return e.getTotalLength();
  switch (e.tagName.toLowerCase()) {
    case "circle":
      return Ne(e);
    case "rect":
      return qe(e);
    case "line":
      return $e(e);
    case "polyline":
      return Me(e);
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
function we(e, r) {
  var t = r || {}, i = t.el || Ke(e), a = i.getBoundingClientRect(), n = P(i, "viewBox"), s = a.width, u = a.height, o = t.viewBox || (n ? n.split(" ") : [0, 0, s, u]);
  return {
    el: i,
    viewBox: o,
    x: o[0] / 1,
    y: o[1] / 1,
    w: s,
    h: u,
    vW: o[2],
    vH: o[3]
  };
}
function Ye(e, r) {
  var t = d.str(e) ? be(e)[0] : e, i = r || 100;
  return function(a) {
    return {
      property: a,
      el: t,
      svg: we(t),
      totalLength: Ce(t) * (i / 100)
    };
  };
}
function Je(e, r, t) {
  function i(c) {
    c === void 0 && (c = 0);
    var f = r + c >= 1 ? r + c : 0;
    return e.el.getPointAtLength(f);
  }
  var a = we(e.el, e.svg), n = i(), s = i(-1), u = i(1), o = t ? 1 : a.w / a.vW, v = t ? 1 : a.h / a.vH;
  switch (e.property) {
    case "x":
      return (n.x - a.x) * o;
    case "y":
      return (n.y - a.y) * v;
    case "angle":
      return Math.atan2(u.y - s.y, u.x - s.x) * 180 / Math.PI;
  }
}
function de(e, r) {
  var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, i = xe(d.pth(e) ? e.totalLength : e, r) + "";
  return {
    original: i,
    numbers: i.match(t) ? i.match(t).map(Number) : [0],
    strings: d.str(e) || r ? i.split(t) : []
  };
}
function oe(e) {
  var r = e ? _(d.arr(e) ? e.map(fe) : fe(e)) : [];
  return z(r, function(t, i, a) {
    return a.indexOf(t) === i;
  });
}
function Se(e) {
  var r = oe(e);
  return r.map(function(t, i) {
    return { target: t, id: i, total: r.length, transforms: { list: ke(t) } };
  });
}
function Ge(e, r) {
  var t = ee(r);
  if (/^spring/.test(t.easing) && (t.duration = ye(t.easing)), d.arr(e)) {
    var i = e.length, a = i === 2 && !d.obj(e[0]);
    a ? e = { value: e } : d.fnc(r.duration) || (t.duration = r.duration / i);
  }
  var n = d.arr(e) ? e : [e];
  return n.map(function(s, u) {
    var o = d.obj(s) && !d.pth(s) ? s : { value: s };
    return d.und(o.delay) && (o.delay = u ? 0 : r.delay), d.und(o.endDelay) && (o.endDelay = u === n.length - 1 ? r.endDelay : 0), o;
  }).map(function(s) {
    return N(s, t);
  });
}
function Xe(e) {
  for (var r = z(_(e.map(function(n) {
    return Object.keys(n);
  })), function(n) {
    return d.key(n);
  }).reduce(function(n, s) {
    return n.indexOf(s) < 0 && n.push(s), n;
  }, []), t = {}, i = function(n) {
    var s = r[n];
    t[s] = e.map(function(u) {
      var o = {};
      for (var v in u)
        d.key(v) ? v == s && (o.value = u[v]) : o[v] = u[v];
      return o;
    });
  }, a = 0; a < r.length; a++)
    i(a);
  return t;
}
function er(e, r) {
  var t = [], i = r.keyframes;
  i && (r = N(Xe(i), r));
  for (var a in r)
    d.key(a) && t.push({
      name: a,
      tweens: Ge(r[a], e)
    });
  return t;
}
function rr(e, r) {
  var t = {};
  for (var i in e) {
    var a = Y(e[i], r);
    d.arr(a) && (a = a.map(function(n) {
      return Y(n, r);
    }), a.length === 1 && (a = a[0])), t[i] = a;
  }
  return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t;
}
function nr(e, r) {
  var t;
  return e.tweens.map(function(i) {
    var a = rr(i, r), n = a.value, s = d.arr(n) ? n[1] : n, u = E(s), o = te(r.target, e.name, u, r), v = t ? t.to.original : o, c = d.arr(n) ? n[0] : v, f = E(c) || E(o), l = u || f;
    return d.und(s) && (s = v), a.from = de(c, l), a.to = de(ae(s, c), l), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = G(a.easing, a.duration), a.isPath = d.pth(n), a.isPathTargetInsideSVG = a.isPath && d.svg(r.target), a.isColor = d.col(a.from.original), a.isColor && (a.round = 1), t = a, a;
  });
}
var Pe = {
  css: function(e, r, t) {
    return e.style[r] = t;
  },
  attribute: function(e, r, t) {
    return e.setAttribute(r, t);
  },
  object: function(e, r, t) {
    return e[r] = t;
  },
  transform: function(e, r, t, i, a) {
    if (i.list.set(r, t), r === i.last || a) {
      var n = "";
      i.list.forEach(function(s, u) {
        n += u + "(" + s + ") ";
      }), e.style.transform = n;
    }
  }
};
function Ee(e, r) {
  var t = Se(e);
  t.forEach(function(i) {
    for (var a in r) {
      var n = Y(r[a], i), s = i.target, u = E(n), o = te(s, a, u, i), v = u || E(o), c = ae(xe(n, v), o), f = ne(s, a);
      Pe[f](s, a, c, i.transforms, !0);
    }
  });
}
function tr(e, r) {
  var t = ne(e.target, r.name);
  if (t) {
    var i = nr(r, e), a = i[i.length - 1];
    return {
      type: t,
      property: r.name,
      animatable: e,
      tweens: i,
      duration: a.end,
      delay: i[0].delay,
      endDelay: a.endDelay
    };
  }
}
function ar(e, r) {
  return z(_(e.map(function(t) {
    return r.map(function(i) {
      return tr(t, i);
    });
  })), function(t) {
    return !d.und(t);
  });
}
function Be(e, r) {
  var t = e.length, i = function(n) {
    return n.timelineOffset ? n.timelineOffset : 0;
  }, a = {};
  return a.duration = t ? Math.max.apply(Math, e.map(function(n) {
    return i(n) + n.duration;
  })) : r.duration, a.delay = t ? Math.min.apply(Math, e.map(function(n) {
    return i(n) + n.delay;
  })) : r.delay, a.endDelay = t ? a.duration - Math.max.apply(Math, e.map(function(n) {
    return i(n) + n.duration - n.endDelay;
  })) : r.endDelay, a;
}
var ve = 0;
function ir(e) {
  var r = K(me, e), t = K(J, e), i = er(t, e), a = Se(e.targets), n = ar(a, i), s = Be(n, t), u = ve;
  return ve++, N(r, {
    id: u,
    children: [],
    animatables: a,
    animations: n,
    duration: s.duration,
    delay: s.delay,
    endDelay: s.endDelay
  });
}
var w = [], Ie = function() {
  var e;
  function r() {
    !e && (!he() || !T.suspendWhenDocumentHidden) && w.length > 0 && (e = requestAnimationFrame(t));
  }
  function t(a) {
    for (var n = w.length, s = 0; s < n; ) {
      var u = w[s];
      u.paused ? (w.splice(s, 1), n--) : (u.tick(a), s++);
    }
    e = s > 0 ? requestAnimationFrame(t) : void 0;
  }
  function i() {
    T.suspendWhenDocumentHidden && (he() ? e = cancelAnimationFrame(e) : (w.forEach(
      function(a) {
        return a._onDocumentVisibility();
      }
    ), Ie()));
  }
  return typeof document < "u" && document.addEventListener("visibilitychange", i), r;
}();
function he() {
  return !!document && document.hidden;
}
function T(e) {
  e === void 0 && (e = {});
  var r = 0, t = 0, i = 0, a, n = 0, s = null;
  function u(m) {
    var p = window.Promise && new Promise(function(M) {
      return s = M;
    });
    return m.finished = p, p;
  }
  var o = ir(e);
  u(o);
  function v() {
    var m = o.direction;
    m !== "alternate" && (o.direction = m !== "normal" ? "normal" : "reverse"), o.reversed = !o.reversed, a.forEach(function(p) {
      return p.reversed = o.reversed;
    });
  }
  function c(m) {
    return o.reversed ? o.duration - m : m;
  }
  function f() {
    r = 0, t = c(o.currentTime) * (1 / T.speed);
  }
  function l(m, p) {
    p && p.seek(m - p.timelineOffset);
  }
  function y(m) {
    if (o.reversePlayback)
      for (var M = n; M--; )
        l(m, a[M]);
    else
      for (var p = 0; p < n; p++)
        l(m, a[p]);
  }
  function g(m) {
    for (var p = 0, M = o.animations, B = M.length; p < B; ) {
      var O = M[p], I = O.animatable, F = O.tweens, A = F.length - 1, x = F[A];
      A && (x = z(F, function(Le) {
        return m < Le.end;
      })[0] || x);
      for (var D = S(m - x.start - x.delay, 0, x.duration) / x.duration, U = isNaN(D) ? 1 : x.easing(D), C = x.to.strings, q = x.round, $ = [], De = x.to.numbers.length, L = void 0, j = 0; j < De; j++) {
        var V = void 0, se = x.to.numbers[j], le = x.from.numbers[j] || 0;
        x.isPath ? V = Je(x.value, U * se, x.isPathTargetInsideSVG) : V = le + U * (se - le), q && (x.isColor && j > 2 || (V = Math.round(V * q) / q)), $.push(V);
      }
      var ue = C.length;
      if (!ue)
        L = $[0];
      else {
        L = C[0];
        for (var R = 0; R < ue; R++) {
          C[R];
          var ce = C[R + 1], Z = $[R];
          isNaN(Z) || (ce ? L += Z + ce : L += Z + " ");
        }
      }
      Pe[O.type](I.target, O.property, L, I.transforms), O.currentValue = L, p++;
    }
  }
  function h(m) {
    o[m] && !o.passThrough && o[m](o);
  }
  function b() {
    o.remaining && o.remaining !== !0 && o.remaining--;
  }
  function k(m) {
    var p = o.duration, M = o.delay, B = p - o.endDelay, O = c(m);
    o.progress = S(O / p * 100, 0, 100), o.reversePlayback = O < o.currentTime, a && y(O), !o.began && o.currentTime > 0 && (o.began = !0, h("begin")), !o.loopBegan && o.currentTime > 0 && (o.loopBegan = !0, h("loopBegin")), O <= M && o.currentTime !== 0 && g(0), (O >= B && o.currentTime !== p || !p) && g(p), O > M && O < B ? (o.changeBegan || (o.changeBegan = !0, o.changeCompleted = !1, h("changeBegin")), h("change"), g(O)) : o.changeBegan && (o.changeCompleted = !0, o.changeBegan = !1, h("changeComplete")), o.currentTime = S(O, 0, p), o.began && h("update"), m >= p && (t = 0, b(), o.remaining ? (r = i, h("loopComplete"), o.loopBegan = !1, o.direction === "alternate" && v()) : (o.paused = !0, o.completed || (o.completed = !0, h("loopComplete"), h("complete"), !o.passThrough && "Promise" in window && (s(), u(o)))));
  }
  return o.reset = function() {
    var m = o.direction;
    o.passThrough = !1, o.currentTime = 0, o.progress = 0, o.paused = !0, o.began = !1, o.loopBegan = !1, o.changeBegan = !1, o.completed = !1, o.changeCompleted = !1, o.reversePlayback = !1, o.reversed = m === "reverse", o.remaining = o.loop, a = o.children, n = a.length;
    for (var p = n; p--; )
      o.children[p].reset();
    (o.reversed && o.loop !== !0 || m === "alternate" && o.loop === 1) && o.remaining++, g(o.reversed ? o.duration : 0);
  }, o._onDocumentVisibility = f, o.set = function(m, p) {
    return Ee(m, p), o;
  }, o.tick = function(m) {
    i = m, r || (r = i), k((i + (t - r)) * T.speed);
  }, o.seek = function(m) {
    k(c(m));
  }, o.pause = function() {
    o.paused = !0, f();
  }, o.play = function() {
    o.paused && (o.completed && o.reset(), o.paused = !1, w.push(o), f(), Ie());
  }, o.reverse = function() {
    v(), o.completed = !o.reversed, f();
  }, o.restart = function() {
    o.reset(), o.play();
  }, o.remove = function(m) {
    var p = oe(m);
    Ae(p, o);
  }, o.reset(), o.autoplay && o.play(), o;
}
function pe(e, r) {
  for (var t = r.length; t--; )
    X(e, r[t].animatable.target) && r.splice(t, 1);
}
function Ae(e, r) {
  var t = r.animations, i = r.children;
  pe(e, t);
  for (var a = i.length; a--; ) {
    var n = i[a], s = n.animations;
    pe(e, s), !s.length && !n.children.length && i.splice(a, 1);
  }
  !t.length && !i.length && r.pause();
}
function or(e) {
  for (var r = oe(e), t = w.length; t--; ) {
    var i = w[t];
    Ae(r, i);
  }
}
function sr(e, r) {
  r === void 0 && (r = {});
  var t = r.direction || "normal", i = r.easing ? G(r.easing) : null, a = r.grid, n = r.axis, s = r.from || 0, u = s === "first", o = s === "center", v = s === "last", c = d.arr(e), f = parseFloat(c ? e[0] : e), l = c ? parseFloat(e[1]) : 0, y = E(c ? e[1] : e) || 0, g = r.start || 0 + (c ? f : 0), h = [], b = 0;
  return function(k, m, p) {
    if (u && (s = 0), o && (s = (p - 1) / 2), v && (s = p - 1), !h.length) {
      for (var M = 0; M < p; M++) {
        if (!a)
          h.push(Math.abs(s - M));
        else {
          var B = o ? (a[0] - 1) / 2 : s % a[0], O = o ? (a[1] - 1) / 2 : Math.floor(s / a[0]), I = M % a[0], F = Math.floor(M / a[0]), A = B - I, x = O - F, D = Math.sqrt(A * A + x * x);
          n === "x" && (D = -A), n === "y" && (D = -x), h.push(D);
        }
        b = Math.max.apply(Math, h);
      }
      i && (h = h.map(function(C) {
        return i(C / b) * b;
      })), t === "reverse" && (h = h.map(function(C) {
        return n ? C < 0 ? C * -1 : -C : Math.abs(b - C);
      }));
    }
    var U = c ? (l - f) / b : f;
    return g + U * (Math.round(h[m] * 100) / 100) + y;
  };
}
function lr(e) {
  e === void 0 && (e = {});
  var r = T(e);
  return r.duration = 0, r.add = function(t, i) {
    var a = w.indexOf(r), n = r.children;
    a > -1 && w.splice(a, 1);
    function s(l) {
      l.passThrough = !0;
    }
    for (var u = 0; u < n.length; u++)
      s(n[u]);
    var o = N(t, K(J, e));
    o.targets = o.targets || e.targets;
    var v = r.duration;
    o.autoplay = !1, o.direction = r.direction, o.timelineOffset = d.und(i) ? v : ae(i, v), s(r), r.seek(o.timelineOffset);
    var c = T(o);
    s(c), n.push(c);
    var f = Be(n, e);
    return r.delay = f.delay, r.endDelay = f.endDelay, r.duration = f.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
  }, r;
}
T.version = "3.2.1";
T.speed = 1;
T.suspendWhenDocumentHidden = !0;
T.running = w;
T.remove = or;
T.get = te;
T.set = Ee;
T.convertPx = re;
T.path = Ye;
T.setDashoffset = Qe;
T.stagger = sr;
T.timeline = lr;
T.easing = G;
T.penner = Te;
T.random = function(e, r) {
  return Math.floor(Math.random() * (r - e + 1)) + e;
};
class ur {
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
  createMarker(r, t, i, a, n = null, s = "absolute") {
    let u = document.createElement("div");
    return u.style.height = r, u.style.width = t, u.style.backgroundColor = i, u.style.position = s, u.style.top = a, n && (u.style.right = n), u;
  }
  createMarkerContainer() {
    return this.element.style.position = "relative", this.markerContainer = document.createElement("div"), this.markerContainer.style.overflow = "hidden", this.markerContainer.style.height = this.element.scrollHeight + "px", this.markerContainer.style.width = this.element.scrollWidth + "px", this.markerContainer.style.position = "absolute", this.markerContainer.style.left = "0", this.markerContainer.style.top = "0", this.markerContainer.style.pointerEvents = "none", this.element.prepend(this.markerContainer), this.markerContainer;
  }
  lerp(r, t, i) {
    let a = Math.abs(t - r), n = Math.max(t - i, 0);
    return 1 - Math.min(n / a, 1);
  }
  // createPinContainer(triggerElement) {
  //     // it is important to insert at the same position.
  //     let pinContainer = document.createElement('div');
  //     pinContainer.className = 'pin-container';
  //     let style = window.getComputedStyle(triggerElement.parentElement);
  //     Object.keys(style).forEach((attr) => {
  //         if (!/(webkit)|(\d+)/i.test(attr)) {
  //             pinContainer.style[attr] = style[attr];
  //         }
  //     })
  //     pinContainer.style.height = triggerElement.parentElement.getBoundingClientRect().height + 'px';
  //     pinContainer.style.width = triggerElement.parentElement.getBoundingClientRect().width + 'px';
  //     pinContainer.style.willChange = 'transform';
  //
  //     if (triggerElement.parentElement.children.length > 1) {
  //         triggerElement.insertAdjacentElement('beforebegin', pinContainer)
  //     } else {
  //         triggerElement.parentElement.appendChild(pinContainer)
  //     }
  //     pinContainer.prepend(triggerElement)
  //     return pinContainer;
  // }
  createPinContainer(r) {
    let t = document.createElement("div");
    t.className = "pin-container";
    let i = window.getComputedStyle(r.parentElement), a = r.parentElement.getBoundingClientRect(), n = document.createElement("div");
    return Object.keys(i).forEach((s) => {
      /(webkit)|(\d+)/i.test(s) || (t.style[s] = i[s]);
    }), t.style.height = a.height + "px", t.style.width = a.width + "px", t.style.position = "relative", n.style.height = r.getBoundingClientRect().height + "px", n.style.width = a.width + "px", n.style.position = "absolute", n.style.left = r.getBoundingClientRect().left + "px", t.appendChild(n), r.parentElement.children.length > 1 ? r.insertAdjacentElement("beforebegin", t) : r.parentElement.appendChild(t), n.prepend(r), t;
  }
  // removePinContainer(pinContainer) {
  //     // it is important to insert at the same position.
  //     let parentEl = pinContainer.parentElement;
  //     if (parentEl.children.length > 1) {
  //         pinContainer.replaceWith(pinContainer.children[0])
  //     } else {
  //         parentEl.appendChild(pinContainer.children[0]);
  //     }
  //     pinContainer.remove();
  // }
  removePinContainer(r) {
    let t = r.parentElement;
    t.children.length > 1 ? r.replaceWith(r.children[0].children[0]) : t.appendChild(r.children[0].children[0]), r.remove();
  }
  getElement(r, t) {
    return typeof r == "string" ? document.querySelector(r) : typeof r == "object" ? r : t;
  }
  getDistanceBetween(r, t, i = 0) {
    const a = (u, o, v = !1) => {
      let c = 0, f = u;
      for (; c += u.getBoundingClientRect().top + i - parseInt(window.getComputedStyle(u).marginTop), v && console.log(f, u, c), !(!u.parentElement || u.tagName === "BODY"); )
        u = u.parentElement;
      return c;
    }, n = a(r, i, !0), s = a(t);
    return Math.abs(s - n);
  }
  constructor(r, t) {
    this.element = r, t.forEach((n, s) => {
      var f;
      if (n.animations = {}, n.hasTriggered = !1, n.isActive = !1, (f = n.scrollTrigger).actions ?? (f.actions = "play none none reverse"), n.scrollTrigger.actions = n.scrollTrigger.actions.split(" "), n.scrollTrigger.trigger = this.getElement(n.scrollTrigger.trigger), n.scrollTrigger.actions.length < 4)
        throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
      if (Object.keys(n).forEach((l) => {
        ["targets", "scrollTrigger", "animations"].includes(l) || (n.animations[l] = n[l]);
      }), Object.keys(n.animations).length > 0) {
        n.scrollTrigger.lerp && (n.animations.easing = "linear");
        let l = {
          targets: n.targets,
          ...n.animations,
          autoplay: !1
        };
        n.anime = T(l);
      }
      const u = (l) => {
        switch (l) {
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
      n._onEnter = (l, y) => {
        if (l.scrollTrigger.onEnter && !l.isActive && l.scrollTrigger.onEnter(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, y), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration * y) : u(l.scrollTrigger.actions[0]);
      }, n._onLeave = (l, y) => {
        if (l.scrollTrigger.onLeave && l.scrollTrigger.onLeave(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, 1), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration) : u(l.scrollTrigger.actions[1]);
      }, n._onEnterBack = (l, y) => {
        if (l.scrollTrigger.onEnterBack && !l.isActive && l.scrollTrigger.onEnterBack(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, y), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration * y) : u(l.scrollTrigger.actions[2]);
      }, n._onLeaveBack = (l, y) => {
        if (l.scrollTrigger.onLeaveBack && l.scrollTrigger.onLeaveBack(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, 0), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(0) : u(l.scrollTrigger.actions[3]);
      };
      let o = n.scrollTrigger.trigger.getBoundingClientRect(), v = n.scrollTrigger.start ?? "top center";
      if (v = v.split(" "), v.length < 2)
        throw new Error('Start must be in the format of "triggerOffset scrollOffset"');
      n.startTriggerOffset = o.top + o.height * this.getScrollOffsetPercentage(v[0]), n.startScrollPosition = v[1];
      let c = n.scrollTrigger.end ?? "bottom center";
      if (c = c.split(" "), c.length < 2)
        throw new Error('end must be in the format of "triggerOffset scrollOffset"');
      if (n.endScrollPosition = c[1], n.endTriggerOffset = o.top + o.height * this.getScrollOffsetPercentage(c[0]), n.animationTriggerStartOffset = Math.round(n.startTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition)), n.animationTriggerEndOffset = Math.round(n.endTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition)), n.animationTriggerStartOffset >= n.animationTriggerEndOffset && console.warn(`Start offset of trigger - ${s} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`), n.scrollTrigger.debug) {
        let l = this.markerContainer ?? this.createMarkerContainer();
        n.scrollTrigger.startTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.startTriggerOffsetMarker ?? "#ff4949", n.startTriggerOffset + "px", o.right >= r.clientWidth ? Math.min(r.clientWidth, window.innerWidth) - 20 : o.right + "px"), n.scrollTrigger.endTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.endTriggerOffsetMarker ?? "#49deff", n.endTriggerOffset + "px", o.right >= r.clientWidth ? Math.min(r.clientWidth, window.innerWidth) - 20 : o.right + "px"), l.appendChild(n.scrollTrigger.startTriggerOffsetMarker), l.appendChild(n.scrollTrigger.endTriggerOffsetMarker), n.scrollTrigger.startScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.startScrollerOffsetMarker ?? "#ff4949", r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.endScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.endScrollerOffsetMarker ?? "#49deff", r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition) + "px", "0px", "absolute"), l.appendChild(n.scrollTrigger.startScrollerOffsetMarker), l.appendChild(n.scrollTrigger.endScrollerOffsetMarker);
      }
    });
    let i = 0, a = !1;
    this.animations = t, r.addEventListener("scroll", (n) => {
      a = r.scrollTop > i, i = r.scrollTop, t.forEach((s) => {
        let u = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.startScrollPosition), o = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.endScrollPosition);
        if (s.scrollTrigger.debug && (s.scrollTrigger.startScrollerOffsetMarker.style.top = u + "px", s.scrollTrigger.endScrollerOffsetMarker.style.top = o + "px"), r.scrollTop >= s.animationTriggerStartOffset && r.scrollTop <= s.animationTriggerEndOffset) {
          if (s.scrollTrigger.lerp || !s.isActive) {
            let v = this.lerp(s.animationTriggerStartOffset, s.animationTriggerEndOffset, r.scrollTop);
            a ? s._onEnter(s, v) : s._onEnterBack(s, v);
          }
          if (s.scrollTrigger.pin) {
            let v = this.getElement(s.scrollTrigger.pin, s.scrollTrigger.trigger);
            if (s.pinOffset || (s.pinOffset = r.scrollTop + r.getBoundingClientRect().top + v.getBoundingClientRect().top - parseInt(window.getComputedStyle(v).marginTop)), r.scrollTop >= s.pinOffset) {
              s.pinContainer ?? (s.pinContainer = this.createPinContainer(v));
              let c = r.scrollTop - s.pinOffset;
              s.pinContainer.children[0].style.setProperty("top", c + "px");
            }
          }
          s.isActive = !0;
          return;
        }
        if (r.scrollTop >= s.animationTriggerEndOffset && s.isActive) {
          s._onLeave(s), s.isActive = !1;
          return;
        }
        r.scrollTop < s.animationTriggerStartOffset && s.isActive && (s._onLeaveBack(s), s.isActive = !1, s.scrollTrigger.pin && s.pinContainer && (this.removePinContainer(s.pinContainer), s.pinContainer = null, s.pinOffset = null));
      });
    });
  }
}
export {
  ur as default
};
