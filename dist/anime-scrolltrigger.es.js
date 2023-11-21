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
function S(e, r, t) {
  return Math.min(Math.max(e, r), t);
}
function H(e, r) {
  return e.indexOf(r) > -1;
}
function Q(e, r) {
  return e.apply(null, r);
}
var f = {
  arr: function(e) {
    return Array.isArray(e);
  },
  obj: function(e) {
    return H(Object.prototype.toString.call(e), "Object");
  },
  pth: function(e) {
    return f.obj(e) && e.hasOwnProperty("totalLength");
  },
  svg: function(e) {
    return e instanceof SVGElement;
  },
  inp: function(e) {
    return e instanceof HTMLInputElement;
  },
  dom: function(e) {
    return e.nodeType || f.svg(e);
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
    return f.und(e) || e === null;
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
    return f.hex(e) || f.rgb(e) || f.hsl(e);
  },
  key: function(e) {
    return !me.hasOwnProperty(e) && !Y.hasOwnProperty(e) && e !== "targets" && e !== "keyframes";
  }
};
function ge(e) {
  var r = /\(([^)]+)\)/.exec(e);
  return r ? r[1].split(",").map(function(t) {
    return parseFloat(t);
  }) : [];
}
function ye(e, r) {
  var t = ge(e), o = S(f.und(t[0]) ? 1 : t[0], 0.1, 100), a = S(f.und(t[1]) ? 100 : t[1], 0.1, 100), n = S(f.und(t[2]) ? 10 : t[2], 0.1, 100), s = S(f.und(t[3]) ? 0 : t[3], 0.1, 100), u = Math.sqrt(a / o), i = n / (2 * Math.sqrt(a * o)), v = i < 1 ? u * Math.sqrt(1 - i * i) : 0, c = 1, d = i < 1 ? (i * u + -s) / v : -s + u;
  function l(g) {
    var h = r ? r * g / 1e3 : g;
    return i < 1 ? h = Math.exp(-h * i * u) * (c * Math.cos(v * h) + d * Math.sin(v * h)) : h = (c + d * h) * Math.exp(-h * u), g === 0 || g === 1 ? g : 1 - h;
  }
  function y() {
    var g = W.springs[e];
    if (g)
      return g;
    for (var h = 1 / 6, b = 0, M = 0; ; )
      if (b += h, l(b) === 1) {
        if (M++, M >= 16)
          break;
      } else
        M = 0;
    var m = b * h * 1e3;
    return W.springs[e] = m, m;
  }
  return r ? l : y;
}
function Ve(e) {
  return e === void 0 && (e = 10), function(r) {
    return Math.ceil(S(r, 1e-6, 1) * e) * (1 / e);
  };
}
var je = function() {
  var e = 11, r = 1 / (e - 1);
  function t(c, d) {
    return 1 - 3 * d + 3 * c;
  }
  function o(c, d) {
    return 3 * d - 6 * c;
  }
  function a(c) {
    return 3 * c;
  }
  function n(c, d, l) {
    return ((t(d, l) * c + o(d, l)) * c + a(d)) * c;
  }
  function s(c, d, l) {
    return 3 * t(d, l) * c * c + 2 * o(d, l) * c + a(d);
  }
  function u(c, d, l, y, g) {
    var h, b, M = 0;
    do
      b = d + (l - d) / 2, h = n(b, y, g) - c, h > 0 ? l = b : d = b;
    while (Math.abs(h) > 1e-7 && ++M < 10);
    return b;
  }
  function i(c, d, l, y) {
    for (var g = 0; g < 4; ++g) {
      var h = s(d, l, y);
      if (h === 0)
        return d;
      var b = n(d, l, y) - c;
      d -= b / h;
    }
    return d;
  }
  function v(c, d, l, y) {
    if (!(0 <= c && c <= 1 && 0 <= l && l <= 1))
      return;
    var g = new Float32Array(e);
    if (c !== d || l !== y)
      for (var h = 0; h < e; ++h)
        g[h] = n(h * r, c, l);
    function b(M) {
      for (var m = 0, p = 1, x = e - 1; p !== x && g[p] <= M; ++p)
        m += r;
      --p;
      var I = (M - g[p]) / (g[p + 1] - g[p]), O = m + I * r, B = s(O, c, l);
      return B >= 1e-3 ? i(M, O, c, l) : B === 0 ? O : u(M, m, m + r, c, l);
    }
    return function(M) {
      return c === d && l === y || M === 0 || M === 1 ? M : n(b(M), d, y);
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
      var n = S(o, 1, 10), s = S(a, 0.1, 2);
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
  if (f.fnc(e))
    return e;
  var t = e.split("(")[0], o = Te[t], a = ge(e);
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
function z(e, r) {
  for (var t = e.length, o = arguments.length >= 2 ? arguments[1] : void 0, a = [], n = 0; n < t; n++)
    if (n in e) {
      var s = e[n];
      r.call(o, s, n, e) && a.push(s);
    }
  return a;
}
function _(e) {
  return e.reduce(function(r, t) {
    return r.concat(f.arr(t) ? _(t) : t);
  }, []);
}
function fe(e) {
  return f.arr(e) ? e : (f.str(e) && (e = be(e) || e), e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e]);
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
function N(e, r) {
  var t = ee(e);
  for (var o in r)
    t[o] = f.und(e[o]) ? r[o] : e[o];
  return t;
}
function Re(e) {
  var r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);
  return r ? "rgba(" + r[1] + ",1)" : e;
}
function He(e) {
  var r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, t = e.replace(r, function(u, i, v, c) {
    return i + i + v + v + c + c;
  }), o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), a = parseInt(o[1], 16), n = parseInt(o[2], 16), s = parseInt(o[3], 16);
  return "rgba(" + a + "," + n + "," + s + ",1)";
}
function Ue(e) {
  var r = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), t = parseInt(r[1], 10) / 360, o = parseInt(r[2], 10) / 100, a = parseInt(r[3], 10) / 100, n = r[4] || 1;
  function s(l, y, g) {
    return g < 0 && (g += 1), g > 1 && (g -= 1), g < 1 / 6 ? l + (y - l) * 6 * g : g < 1 / 2 ? y : g < 2 / 3 ? l + (y - l) * (2 / 3 - g) * 6 : l;
  }
  var u, i, v;
  if (o == 0)
    u = i = v = a;
  else {
    var c = a < 0.5 ? a * (1 + o) : a + o - a * o, d = 2 * a - c;
    u = s(d, c, t + 1 / 3), i = s(d, c, t), v = s(d, c, t - 1 / 3);
  }
  return "rgba(" + u * 255 + "," + i * 255 + "," + v * 255 + "," + n + ")";
}
function We(e) {
  if (f.rgb(e))
    return Re(e);
  if (f.hex(e))
    return He(e);
  if (f.hsl(e))
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
function J(e, r) {
  return f.fnc(e) ? e(r.target, r.id, r.total) : e;
}
function P(e, r) {
  return e.getAttribute(r);
}
function re(e, r, t) {
  var o = E(r);
  if (X([t, "deg", "rad", "turn"], o))
    return r;
  var a = W.CSS[r + t];
  if (!f.und(a))
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
  if (f.dom(e) && !f.inp(e) && (!f.nil(P(e, r)) || f.svg(e) && e[r]))
    return "attribute";
  if (f.dom(e) && X(Fe, r))
    return "transform";
  if (f.dom(e) && r !== "transform" && Oe(e, r))
    return "css";
  if (e[r] != null)
    return "object";
}
function Me(e) {
  if (f.dom(e)) {
    for (var r = e.style.transform || "", t = /(\w+)\(([^)]*)\)/g, o = /* @__PURE__ */ new Map(), a; a = t.exec(r); )
      o.set(a[1], a[2]);
    return o;
  }
}
function _e(e, r, t, o) {
  var a = H(r, "scale") ? 1 : 0 + ze(r), n = Me(e).get(r) || a;
  return t && (t.transforms.list.set(r, n), t.transforms.last = r), o ? re(e, n, o) : n;
}
function te(e, r, t, o) {
  switch (ne(e, r)) {
    case "transform":
      return _e(e, r, o, t);
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
function ke(e, r) {
  if (f.col(e))
    return We(e);
  if (/\s/g.test(e))
    return e;
  var t = E(e), o = t ? e.substr(0, e.length - t.length) : e;
  return r ? o + r : o;
}
function ie(e, r) {
  return Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
}
function Ne(e) {
  return Math.PI * 2 * P(e, "r");
}
function $e(e) {
  return P(e, "width") * 2 + P(e, "height") * 2;
}
function qe(e) {
  return ie(
    { x: P(e, "x1"), y: P(e, "y1") },
    { x: P(e, "x2"), y: P(e, "y2") }
  );
}
function xe(e) {
  for (var r = e.points, t = 0, o, a = 0; a < r.numberOfItems; a++) {
    var n = r.getItem(a);
    a > 0 && (t += ie(o, n)), o = n;
  }
  return t;
}
function Ze(e) {
  var r = e.points;
  return xe(e) + ie(r.getItem(r.numberOfItems - 1), r.getItem(0));
}
function we(e) {
  if (e.getTotalLength)
    return e.getTotalLength();
  switch (e.tagName.toLowerCase()) {
    case "circle":
      return Ne(e);
    case "rect":
      return $e(e);
    case "line":
      return qe(e);
    case "polyline":
      return xe(e);
    case "polygon":
      return Ze(e);
  }
}
function Qe(e) {
  var r = we(e);
  return e.setAttribute("stroke-dasharray", r), r;
}
function Ke(e) {
  for (var r = e.parentNode; f.svg(r) && f.svg(r.parentNode); )
    r = r.parentNode;
  return r;
}
function Ce(e, r) {
  var t = r || {}, o = t.el || Ke(e), a = o.getBoundingClientRect(), n = P(o, "viewBox"), s = a.width, u = a.height, i = t.viewBox || (n ? n.split(" ") : [0, 0, s, u]);
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
  var t = f.str(e) ? be(e)[0] : e, o = r || 100;
  return function(a) {
    return {
      property: a,
      el: t,
      svg: Ce(t),
      totalLength: we(t) * (o / 100)
    };
  };
}
function Ye(e, r, t) {
  function o(c) {
    c === void 0 && (c = 0);
    var d = r + c >= 1 ? r + c : 0;
    return e.el.getPointAtLength(d);
  }
  var a = Ce(e.el, e.svg), n = o(), s = o(-1), u = o(1), i = t ? 1 : a.w / a.vW, v = t ? 1 : a.h / a.vH;
  switch (e.property) {
    case "x":
      return (n.x - a.x) * i;
    case "y":
      return (n.y - a.y) * v;
    case "angle":
      return Math.atan2(u.y - s.y, u.x - s.x) * 180 / Math.PI;
  }
}
function de(e, r) {
  var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, o = ke(f.pth(e) ? e.totalLength : e, r) + "";
  return {
    original: o,
    numbers: o.match(t) ? o.match(t).map(Number) : [0],
    strings: f.str(e) || r ? o.split(t) : []
  };
}
function oe(e) {
  var r = e ? _(f.arr(e) ? e.map(fe) : fe(e)) : [];
  return z(r, function(t, o, a) {
    return a.indexOf(t) === o;
  });
}
function Se(e) {
  var r = oe(e);
  return r.map(function(t, o) {
    return { target: t, id: o, total: r.length, transforms: { list: Me(t) } };
  });
}
function Ge(e, r) {
  var t = ee(r);
  if (/^spring/.test(t.easing) && (t.duration = ye(t.easing)), f.arr(e)) {
    var o = e.length, a = o === 2 && !f.obj(e[0]);
    a ? e = { value: e } : f.fnc(r.duration) || (t.duration = r.duration / o);
  }
  var n = f.arr(e) ? e : [e];
  return n.map(function(s, u) {
    var i = f.obj(s) && !f.pth(s) ? s : { value: s };
    return f.und(i.delay) && (i.delay = u ? 0 : r.delay), f.und(i.endDelay) && (i.endDelay = u === n.length - 1 ? r.endDelay : 0), i;
  }).map(function(s) {
    return N(s, t);
  });
}
function Xe(e) {
  for (var r = z(_(e.map(function(n) {
    return Object.keys(n);
  })), function(n) {
    return f.key(n);
  }).reduce(function(n, s) {
    return n.indexOf(s) < 0 && n.push(s), n;
  }, []), t = {}, o = function(n) {
    var s = r[n];
    t[s] = e.map(function(u) {
      var i = {};
      for (var v in u)
        f.key(v) ? v == s && (i.value = u[v]) : i[v] = u[v];
      return i;
    });
  }, a = 0; a < r.length; a++)
    o(a);
  return t;
}
function er(e, r) {
  var t = [], o = r.keyframes;
  o && (r = N(Xe(o), r));
  for (var a in r)
    f.key(a) && t.push({
      name: a,
      tweens: Ge(r[a], e)
    });
  return t;
}
function rr(e, r) {
  var t = {};
  for (var o in e) {
    var a = J(e[o], r);
    f.arr(a) && (a = a.map(function(n) {
      return J(n, r);
    }), a.length === 1 && (a = a[0])), t[o] = a;
  }
  return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t;
}
function nr(e, r) {
  var t;
  return e.tweens.map(function(o) {
    var a = rr(o, r), n = a.value, s = f.arr(n) ? n[1] : n, u = E(s), i = te(r.target, e.name, u, r), v = t ? t.to.original : i, c = f.arr(n) ? n[0] : v, d = E(c) || E(i), l = u || d;
    return f.und(s) && (s = v), a.from = de(c, l), a.to = de(ae(s, c), l), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = G(a.easing, a.duration), a.isPath = f.pth(n), a.isPathTargetInsideSVG = a.isPath && f.svg(r.target), a.isColor = f.col(a.from.original), a.isColor && (a.round = 1), t = a, a;
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
  var t = Se(e);
  t.forEach(function(o) {
    for (var a in r) {
      var n = J(r[a], o), s = o.target, u = E(n), i = te(s, a, u, o), v = u || E(i), c = ae(ke(n, v), i), d = ne(s, a);
      Pe[d](s, a, c, o.transforms, !0);
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
  return z(_(e.map(function(t) {
    return r.map(function(o) {
      return tr(t, o);
    });
  })), function(t) {
    return !f.und(t);
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
var ve = 0;
function ir(e) {
  var r = K(me, e), t = K(Y, e), o = er(t, e), a = Se(e.targets), n = ar(a, o), s = Ie(n, t), u = ve;
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
var C = [], Be = function() {
  var e;
  function r() {
    !e && (!he() || !T.suspendWhenDocumentHidden) && C.length > 0 && (e = requestAnimationFrame(t));
  }
  function t(a) {
    for (var n = C.length, s = 0; s < n; ) {
      var u = C[s];
      u.paused ? (C.splice(s, 1), n--) : (u.tick(a), s++);
    }
    e = s > 0 ? requestAnimationFrame(t) : void 0;
  }
  function o() {
    T.suspendWhenDocumentHidden && (he() ? e = cancelAnimationFrame(e) : (C.forEach(
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
  function u(m) {
    var p = window.Promise && new Promise(function(x) {
      return s = x;
    });
    return m.finished = p, p;
  }
  var i = ir(e);
  u(i);
  function v() {
    var m = i.direction;
    m !== "alternate" && (i.direction = m !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, a.forEach(function(p) {
      return p.reversed = i.reversed;
    });
  }
  function c(m) {
    return i.reversed ? i.duration - m : m;
  }
  function d() {
    r = 0, t = c(i.currentTime) * (1 / T.speed);
  }
  function l(m, p) {
    p && p.seek(m - p.timelineOffset);
  }
  function y(m) {
    if (i.reversePlayback)
      for (var x = n; x--; )
        l(m, a[x]);
    else
      for (var p = 0; p < n; p++)
        l(m, a[p]);
  }
  function g(m) {
    for (var p = 0, x = i.animations, I = x.length; p < I; ) {
      var O = x[p], B = O.animatable, F = O.tweens, D = F.length - 1, k = F[D];
      D && (k = z(F, function(Le) {
        return m < Le.end;
      })[0] || k);
      for (var A = S(m - k.start - k.delay, 0, k.duration) / k.duration, U = isNaN(A) ? 1 : k.easing(A), w = k.to.strings, $ = k.round, q = [], Ae = k.to.numbers.length, L = void 0, V = 0; V < Ae; V++) {
        var j = void 0, se = k.to.numbers[V], le = k.from.numbers[V] || 0;
        k.isPath ? j = Ye(k.value, U * se, k.isPathTargetInsideSVG) : j = le + U * (se - le), $ && (k.isColor && V > 2 || (j = Math.round(j * $) / $)), q.push(j);
      }
      var ue = w.length;
      if (!ue)
        L = q[0];
      else {
        L = w[0];
        for (var R = 0; R < ue; R++) {
          w[R];
          var ce = w[R + 1], Z = q[R];
          isNaN(Z) || (ce ? L += Z + ce : L += Z + " ");
        }
      }
      Pe[O.type](B.target, O.property, L, B.transforms), O.currentValue = L, p++;
    }
  }
  function h(m) {
    i[m] && !i.passThrough && i[m](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function M(m) {
    var p = i.duration, x = i.delay, I = p - i.endDelay, O = c(m);
    i.progress = S(O / p * 100, 0, 100), i.reversePlayback = O < i.currentTime, a && y(O), !i.began && i.currentTime > 0 && (i.began = !0, h("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, h("loopBegin")), O <= x && i.currentTime !== 0 && g(0), (O >= I && i.currentTime !== p || !p) && g(p), O > x && O < I ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, h("changeBegin")), h("change"), g(O)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, h("changeComplete")), i.currentTime = S(O, 0, p), i.began && h("update"), m >= p && (t = 0, b(), i.remaining ? (r = o, h("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && v()) : (i.paused = !0, i.completed || (i.completed = !0, h("loopComplete"), h("complete"), !i.passThrough && "Promise" in window && (s(), u(i)))));
  }
  return i.reset = function() {
    var m = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = m === "reverse", i.remaining = i.loop, a = i.children, n = a.length;
    for (var p = n; p--; )
      i.children[p].reset();
    (i.reversed && i.loop !== !0 || m === "alternate" && i.loop === 1) && i.remaining++, g(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = d, i.set = function(m, p) {
    return Ee(m, p), i;
  }, i.tick = function(m) {
    o = m, r || (r = o), M((o + (t - r)) * T.speed);
  }, i.seek = function(m) {
    M(c(m));
  }, i.pause = function() {
    i.paused = !0, d();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, C.push(i), d(), Be());
  }, i.reverse = function() {
    v(), i.completed = !i.reversed, d();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(m) {
    var p = oe(m);
    De(p, i);
  }, i.reset(), i.autoplay && i.play(), i;
}
function pe(e, r) {
  for (var t = r.length; t--; )
    X(e, r[t].animatable.target) && r.splice(t, 1);
}
function De(e, r) {
  var t = r.animations, o = r.children;
  pe(e, t);
  for (var a = o.length; a--; ) {
    var n = o[a], s = n.animations;
    pe(e, s), !s.length && !n.children.length && o.splice(a, 1);
  }
  !t.length && !o.length && r.pause();
}
function or(e) {
  for (var r = oe(e), t = C.length; t--; ) {
    var o = C[t];
    De(r, o);
  }
}
function sr(e, r) {
  r === void 0 && (r = {});
  var t = r.direction || "normal", o = r.easing ? G(r.easing) : null, a = r.grid, n = r.axis, s = r.from || 0, u = s === "first", i = s === "center", v = s === "last", c = f.arr(e), d = parseFloat(c ? e[0] : e), l = c ? parseFloat(e[1]) : 0, y = E(c ? e[1] : e) || 0, g = r.start || 0 + (c ? d : 0), h = [], b = 0;
  return function(M, m, p) {
    if (u && (s = 0), i && (s = (p - 1) / 2), v && (s = p - 1), !h.length) {
      for (var x = 0; x < p; x++) {
        if (!a)
          h.push(Math.abs(s - x));
        else {
          var I = i ? (a[0] - 1) / 2 : s % a[0], O = i ? (a[1] - 1) / 2 : Math.floor(s / a[0]), B = x % a[0], F = Math.floor(x / a[0]), D = I - B, k = O - F, A = Math.sqrt(D * D + k * k);
          n === "x" && (A = -D), n === "y" && (A = -k), h.push(A);
        }
        b = Math.max.apply(Math, h);
      }
      o && (h = h.map(function(w) {
        return o(w / b) * b;
      })), t === "reverse" && (h = h.map(function(w) {
        return n ? w < 0 ? w * -1 : -w : Math.abs(b - w);
      }));
    }
    var U = c ? (l - d) / b : d;
    return g + U * (Math.round(h[m] * 100) / 100) + y;
  };
}
function lr(e) {
  e === void 0 && (e = {});
  var r = T(e);
  return r.duration = 0, r.add = function(t, o) {
    var a = C.indexOf(r), n = r.children;
    a > -1 && C.splice(a, 1);
    function s(l) {
      l.passThrough = !0;
    }
    for (var u = 0; u < n.length; u++)
      s(n[u]);
    var i = N(t, K(Y, e));
    i.targets = i.targets || e.targets;
    var v = r.duration;
    i.autoplay = !1, i.direction = r.direction, i.timelineOffset = f.und(o) ? v : ae(o, v), s(r), r.seek(i.timelineOffset);
    var c = T(i);
    s(c), n.push(c);
    var d = Ie(n, e);
    return r.delay = d.delay, r.endDelay = d.endDelay, r.duration = d.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
  }, r;
}
T.version = "3.2.1";
T.speed = 1;
T.suspendWhenDocumentHidden = !0;
T.running = C;
T.remove = or;
T.get = te;
T.set = Ee;
T.convertPx = re;
T.path = Je;
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
  createMarker(r, t, o, a, n = null, s = "absolute") {
    let u = document.createElement("div");
    return u.style.height = r, u.style.width = t, u.style.backgroundColor = o, u.style.position = s, u.style.top = a, n && (u.style.right = n), u;
  }
  createMarkerContainer() {
    return this.element.style.position = "relative", this.markerContainer = document.createElement("div"), this.markerContainer.style.overflow = "hidden", this.markerContainer.style.height = this.element.scrollHeight + "px", this.markerContainer.style.width = this.element.scrollWidth + "px", this.markerContainer.style.position = "absolute", this.markerContainer.style.left = "0", this.markerContainer.style.top = "0", this.markerContainer.style.pointerEvents = "none", this.element.prepend(this.markerContainer), this.markerContainer;
  }
  lerp(r, t, o) {
    let a = Math.abs(t - r), n = Math.max(t - o, 0);
    return 1 - Math.min(n / a, 1);
  }
  createPinContainer(r) {
    let t = document.createElement("div");
    t.className = "pin-container";
    let o = window.getComputedStyle(r);
    return Object.keys(o).forEach((a) => {
      /[^0-9]/i.test(a) && (t.style[a] = o[a]);
    }), t.style.height = r.getBoundingClientRect().height + "px", t.style.width = r.getBoundingClientRect().width + "px", t.style.willChange = "transform", r.parentElement.children.length > 1 ? r.insertAdjacentElement("beforebegin", t) : r.parentElement.appendChild(t), t.prepend(r), t;
  }
  removePinContainer(r) {
    let t = r.parentElement;
    t.children.length > 1 ? r.replaceWith(r.children[0]) : t.appendChild(r.children[0]), r.remove();
  }
  getElement(r, t) {
    return typeof r == "string" ? document.querySelector(r) : typeof r == "object" ? r : t;
  }
  getDistanceBetween(r, t, o = 0) {
    const a = (u, i) => {
      let v = 0, c = 0;
      for (; v += u.getBoundingClientRect().top + o - parseInt(window.getComputedStyle(u).marginTop), c += parseInt(window.getComputedStyle(u).marginTop), !(!u.parentElement || u.tagName === "body"); )
        u = u.parentElement;
      return v;
    }, n = a(r), s = a(t);
    return Math.abs(s - n);
  }
  constructor(r, t) {
    this.element = r, t.forEach((n, s) => {
      var d;
      if (n.animations = {}, n.hasTriggered = !1, n.isActive = !1, (d = n.scrollTrigger).actions ?? (d.actions = "play none none reverse"), n.scrollTrigger.actions = n.scrollTrigger.actions.split(" "), n.scrollTrigger.trigger = this.getElement(n.scrollTrigger.trigger), n.scrollTrigger.actions.length < 4)
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
        if (l.scrollTrigger.onEnter && l.scrollTrigger.onEnter(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, y), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration * y) : u(l.scrollTrigger.actions[0]);
      }, n._onLeave = (l, y) => {
        if (l.scrollTrigger.onLeave && l.scrollTrigger.onLeave(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, 1), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration) : u(l.scrollTrigger.actions[1]);
      }, n._onEnterBack = (l, y) => {
        if (l.scrollTrigger.onEnterBack && l.scrollTrigger.onEnterBack(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, y), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(l.anime.duration * y) : u(l.scrollTrigger.actions[2]);
      }, n._onLeaveBack = (l, y) => {
        if (l.scrollTrigger.onLeaveBack && l.scrollTrigger.onLeaveBack(l), l.scrollTrigger.onUpdate && l.scrollTrigger.onUpdate(l, 0), !l.anime)
          return null;
        l.scrollTrigger.lerp ? l.anime.seek(0) : u(l.scrollTrigger.actions[3]);
      };
      let i = n.scrollTrigger.trigger.getBoundingClientRect(), v = n.scrollTrigger.start ?? "top center";
      if (v = v.split(" "), v.length < 2)
        throw new Error('Start must be in the format of "triggerOffset scrollOffset"');
      n.startTriggerOffset = i.top + i.height * this.getScrollOffsetPercentage(v[0]), n.startScrollPosition = v[1];
      let c = n.scrollTrigger.end ?? "bottom center";
      if (c = c.split(" "), c.length < 2)
        throw new Error('end must be in the format of "triggerOffset scrollOffset"');
      if (n.endScrollPosition = c[1], n.endTriggerOffset = i.top + i.height * this.getScrollOffsetPercentage(c[0]), n.animationTriggerStartOffset = Math.round(n.startTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition)), n.animationTriggerEndOffset = Math.round(n.endTriggerOffset - r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition)), n.animationTriggerStartOffset >= n.animationTriggerEndOffset && console.warn(`Trigger start offset of trigger - ${s} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`), n.scrollTrigger.debug) {
        let l = this.markerContainer ?? this.createMarkerContainer();
        n.scrollTrigger.startTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.startTriggerOffsetMarker ?? "#ff4949", n.startTriggerOffset + "px", i.right >= r.clientWidth ? Math.min(r.clientWidth, window.innerWidth) - 20 : i.right + "px"), n.scrollTrigger.endTriggerOffsetMarker = this.createMarker("5px", "20px", n.scrollTrigger.debug.endTriggerOffsetMarker ?? "#49deff", n.endTriggerOffset + "px", i.right >= r.clientWidth ? Math.min(r.clientWidth, window.innerWidth) - 20 : i.right + "px"), l.appendChild(n.scrollTrigger.startTriggerOffsetMarker), l.appendChild(n.scrollTrigger.endTriggerOffsetMarker), n.scrollTrigger.startScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.startScrollerOffsetMarker ?? "#ff4949", r.clientHeight * this.getScrollOffsetPercentage(n.startScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.endScrollerOffsetMarker = this.createMarker("5px", "24px", n.scrollTrigger.debug.endScrollerOffsetMarker ?? "#49deff", r.clientHeight * this.getScrollOffsetPercentage(n.endScrollPosition) + "px", "0px", "absolute"), l.appendChild(n.scrollTrigger.startScrollerOffsetMarker), l.appendChild(n.scrollTrigger.endScrollerOffsetMarker);
      }
    });
    let o = 0, a = !1;
    this.animations = t, r.addEventListener("scroll", (n) => {
      a = r.scrollTop > o, o = r.scrollTop, t.forEach((s) => {
        let u = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.startScrollPosition), i = r.scrollTop + r.clientHeight * this.getScrollOffsetPercentage(s.endScrollPosition);
        if (s.scrollTrigger.debug && (s.scrollTrigger.startScrollerOffsetMarker.style.top = u + "px", s.scrollTrigger.endScrollerOffsetMarker.style.top = i + "px"), r.scrollTop >= s.animationTriggerStartOffset && r.scrollTop <= s.animationTriggerEndOffset) {
          if (s.scrollTrigger.lerp || !s.isActive) {
            let v = this.lerp(s.animationTriggerStartOffset, s.animationTriggerEndOffset, r.scrollTop);
            a ? s._onEnter(s, v) : s._onEnterBack(s, v);
          }
          if (s.scrollTrigger.pin) {
            let v = this.getElement(s.scrollTrigger.pin, s.scrollTrigger.trigger);
            if (s.pinOffset || (s.pinOffset = this.getDistanceBetween(v, r, r.scrollTop + r.getBoundingClientRect().top)), r.scrollTop >= s.pinOffset) {
              s.pinContainer ?? (s.pinContainer = this.createPinContainer(v));
              let c = r.scrollTop - s.pinOffset - parseInt(window.getComputedStyle(v).marginTop);
              s.pinContainer.style.transform = `translate3d(0,${c}px,0)`;
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
