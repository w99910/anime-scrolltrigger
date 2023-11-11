var pe = {
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
}, Fe = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"], _ = {
  CSS: {},
  springs: {}
};
function P(e, r, t) {
  return Math.min(Math.max(e, r), t);
}
function z(e, r) {
  return e.indexOf(r) > -1;
}
function Q(e, r) {
  return e.apply(null, r);
}
var l = {
  arr: function(e) {
    return Array.isArray(e);
  },
  obj: function(e) {
    return z(Object.prototype.toString.call(e), "Object");
  },
  pth: function(e) {
    return l.obj(e) && e.hasOwnProperty("totalLength");
  },
  svg: function(e) {
    return e instanceof SVGElement;
  },
  inp: function(e) {
    return e instanceof HTMLInputElement;
  },
  dom: function(e) {
    return e.nodeType || l.svg(e);
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
    return l.und(e) || e === null;
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
    return l.hex(e) || l.rgb(e) || l.hsl(e);
  },
  key: function(e) {
    return !pe.hasOwnProperty(e) && !Y.hasOwnProperty(e) && e !== "targets" && e !== "keyframes";
  }
};
function me(e) {
  var r = /\(([^)]+)\)/.exec(e);
  return r ? r[1].split(",").map(function(t) {
    return parseFloat(t);
  }) : [];
}
function ye(e, r) {
  var t = me(e), o = P(l.und(t[0]) ? 1 : t[0], 0.1, 100), a = P(l.und(t[1]) ? 100 : t[1], 0.1, 100), n = P(l.und(t[2]) ? 10 : t[2], 0.1, 100), s = P(l.und(t[3]) ? 0 : t[3], 0.1, 100), u = Math.sqrt(a / o), i = n / (2 * Math.sqrt(a * o)), d = i < 1 ? u * Math.sqrt(1 - i * i) : 0, c = 1, v = i < 1 ? (i * u + -s) / d : -s + u;
  function f(m) {
    var h = r ? r * m / 1e3 : m;
    return i < 1 ? h = Math.exp(-h * i * u) * (c * Math.cos(d * h) + v * Math.sin(d * h)) : h = (c + v * h) * Math.exp(-h * u), m === 0 || m === 1 ? m : 1 - h;
  }
  function y() {
    var m = _.springs[e];
    if (m)
      return m;
    for (var h = 1 / 6, b = 0, M = 0; ; )
      if (b += h, f(b) === 1) {
        if (M++, M >= 16)
          break;
      } else
        M = 0;
    var p = b * h * 1e3;
    return _.springs[e] = p, p;
  }
  return r ? f : y;
}
function Ve(e) {
  return e === void 0 && (e = 10), function(r) {
    return Math.ceil(P(r, 1e-6, 1) * e) * (1 / e);
  };
}
var je = function() {
  var e = 11, r = 1 / (e - 1);
  function t(c, v) {
    return 1 - 3 * v + 3 * c;
  }
  function o(c, v) {
    return 3 * v - 6 * c;
  }
  function a(c) {
    return 3 * c;
  }
  function n(c, v, f) {
    return ((t(v, f) * c + o(v, f)) * c + a(v)) * c;
  }
  function s(c, v, f) {
    return 3 * t(v, f) * c * c + 2 * o(v, f) * c + a(v);
  }
  function u(c, v, f, y, m) {
    var h, b, M = 0;
    do
      b = v + (f - v) / 2, h = n(b, y, m) - c, h > 0 ? f = b : v = b;
    while (Math.abs(h) > 1e-7 && ++M < 10);
    return b;
  }
  function i(c, v, f, y) {
    for (var m = 0; m < 4; ++m) {
      var h = s(v, f, y);
      if (h === 0)
        return v;
      var b = n(v, f, y) - c;
      v -= b / h;
    }
    return v;
  }
  function d(c, v, f, y) {
    if (!(0 <= c && c <= 1 && 0 <= f && f <= 1))
      return;
    var m = new Float32Array(e);
    if (c !== v || f !== y)
      for (var h = 0; h < e; ++h)
        m[h] = n(h * r, c, f);
    function b(M) {
      for (var p = 0, g = 1, S = e - 1; g !== S && m[g] <= M; ++g)
        p += r;
      --g;
      var I = (M - m[g]) / (m[g + 1] - m[g]), x = p + I * r, A = s(x, c, f);
      return A >= 1e-3 ? i(M, x, c, f) : A === 0 ? x : u(M, p, p + r, c, f);
    }
    return function(M) {
      return c === v && f === y || M === 0 || M === 1 ? M : n(b(M), v, y);
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
  if (l.fnc(e))
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
function U(e, r) {
  for (var t = e.length, o = arguments.length >= 2 ? arguments[1] : void 0, a = [], n = 0; n < t; n++)
    if (n in e) {
      var s = e[n];
      r.call(o, s, n, e) && a.push(s);
    }
  return a;
}
function W(e) {
  return e.reduce(function(r, t) {
    return r.concat(l.arr(t) ? W(t) : t);
  }, []);
}
function le(e) {
  return l.arr(e) ? e : (l.str(e) && (e = be(e) || e), e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e]);
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
function q(e, r) {
  var t = ee(e);
  for (var o in r)
    t[o] = l.und(e[o]) ? r[o] : e[o];
  return t;
}
function He(e) {
  var r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);
  return r ? "rgba(" + r[1] + ",1)" : e;
}
function ze(e) {
  var r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, t = e.replace(r, function(u, i, d, c) {
    return i + i + d + d + c + c;
  }), o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), a = parseInt(o[1], 16), n = parseInt(o[2], 16), s = parseInt(o[3], 16);
  return "rgba(" + a + "," + n + "," + s + ",1)";
}
function Re(e) {
  var r = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), t = parseInt(r[1], 10) / 360, o = parseInt(r[2], 10) / 100, a = parseInt(r[3], 10) / 100, n = r[4] || 1;
  function s(f, y, m) {
    return m < 0 && (m += 1), m > 1 && (m -= 1), m < 1 / 6 ? f + (y - f) * 6 * m : m < 1 / 2 ? y : m < 2 / 3 ? f + (y - f) * (2 / 3 - m) * 6 : f;
  }
  var u, i, d;
  if (o == 0)
    u = i = d = a;
  else {
    var c = a < 0.5 ? a * (1 + o) : a + o - a * o, v = 2 * a - c;
    u = s(v, c, t + 1 / 3), i = s(v, c, t), d = s(v, c, t - 1 / 3);
  }
  return "rgba(" + u * 255 + "," + i * 255 + "," + d * 255 + "," + n + ")";
}
function _e(e) {
  if (l.rgb(e))
    return He(e);
  if (l.hex(e))
    return ze(e);
  if (l.hsl(e))
    return Re(e);
}
function C(e) {
  var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
  if (r)
    return r[1];
}
function Ue(e) {
  if (z(e, "translate") || e === "perspective")
    return "px";
  if (z(e, "rotate") || z(e, "skew"))
    return "deg";
}
function J(e, r) {
  return l.fnc(e) ? e(r.target, r.id, r.total) : e;
}
function E(e, r) {
  return e.getAttribute(r);
}
function re(e, r, t) {
  var o = C(r);
  if (X([t, "deg", "rad", "turn"], o))
    return r;
  var a = _.CSS[r + t];
  if (!l.und(a))
    return a;
  var n = 100, s = document.createElement(e.tagName), u = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
  u.appendChild(s), s.style.position = "absolute", s.style.width = n + t;
  var i = n / s.offsetWidth;
  u.removeChild(s);
  var d = i * parseFloat(r);
  return _.CSS[r + t] = d, d;
}
function xe(e, r, t) {
  if (r in e.style) {
    var o = r.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), a = e.style[r] || getComputedStyle(e).getPropertyValue(o) || "0";
    return t ? re(e, a, t) : a;
  }
}
function ne(e, r) {
  if (l.dom(e) && !l.inp(e) && (!l.nil(E(e, r)) || l.svg(e) && e[r]))
    return "attribute";
  if (l.dom(e) && X(Fe, r))
    return "transform";
  if (l.dom(e) && r !== "transform" && xe(e, r))
    return "css";
  if (e[r] != null)
    return "object";
}
function Me(e) {
  if (l.dom(e)) {
    for (var r = e.style.transform || "", t = /(\w+)\(([^)]*)\)/g, o = /* @__PURE__ */ new Map(), a; a = t.exec(r); )
      o.set(a[1], a[2]);
    return o;
  }
}
function We(e, r, t, o) {
  var a = z(r, "scale") ? 1 : 0 + Ue(r), n = Me(e).get(r) || a;
  return t && (t.transforms.list.set(r, n), t.transforms.last = r), o ? re(e, n, o) : n;
}
function te(e, r, t, o) {
  switch (ne(e, r)) {
    case "transform":
      return We(e, r, o, t);
    case "css":
      return xe(e, r, t);
    case "attribute":
      return E(e, r);
    default:
      return e[r] || 0;
  }
}
function ae(e, r) {
  var t = /^(\*=|\+=|-=)/.exec(e);
  if (!t)
    return e;
  var o = C(e) || 0, a = parseFloat(r), n = parseFloat(e.replace(t[0], ""));
  switch (t[0][0]) {
    case "+":
      return a + n + o;
    case "-":
      return a - n + o;
    case "*":
      return a * n + o;
  }
}
function Oe(e, r) {
  if (l.col(e))
    return _e(e);
  if (/\s/g.test(e))
    return e;
  var t = C(e), o = t ? e.substr(0, e.length - t.length) : e;
  return r ? o + r : o;
}
function ie(e, r) {
  return Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
}
function qe(e) {
  return Math.PI * 2 * E(e, "r");
}
function Ne(e) {
  return E(e, "width") * 2 + E(e, "height") * 2;
}
function Ze(e) {
  return ie(
    { x: E(e, "x1"), y: E(e, "y1") },
    { x: E(e, "x2"), y: E(e, "y2") }
  );
}
function Se(e) {
  for (var r = e.points, t = 0, o, a = 0; a < r.numberOfItems; a++) {
    var n = r.getItem(a);
    a > 0 && (t += ie(o, n)), o = n;
  }
  return t;
}
function $e(e) {
  var r = e.points;
  return Se(e) + ie(r.getItem(r.numberOfItems - 1), r.getItem(0));
}
function ke(e) {
  if (e.getTotalLength)
    return e.getTotalLength();
  switch (e.tagName.toLowerCase()) {
    case "circle":
      return qe(e);
    case "rect":
      return Ne(e);
    case "line":
      return Ze(e);
    case "polyline":
      return Se(e);
    case "polygon":
      return $e(e);
  }
}
function Qe(e) {
  var r = ke(e);
  return e.setAttribute("stroke-dasharray", r), r;
}
function Ke(e) {
  for (var r = e.parentNode; l.svg(r) && l.svg(r.parentNode); )
    r = r.parentNode;
  return r;
}
function we(e, r) {
  var t = r || {}, o = t.el || Ke(e), a = o.getBoundingClientRect(), n = E(o, "viewBox"), s = a.width, u = a.height, i = t.viewBox || (n ? n.split(" ") : [0, 0, s, u]);
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
  var t = l.str(e) ? be(e)[0] : e, o = r || 100;
  return function(a) {
    return {
      property: a,
      el: t,
      svg: we(t),
      totalLength: ke(t) * (o / 100)
    };
  };
}
function Ye(e, r, t) {
  function o(c) {
    c === void 0 && (c = 0);
    var v = r + c >= 1 ? r + c : 0;
    return e.el.getPointAtLength(v);
  }
  var a = we(e.el, e.svg), n = o(), s = o(-1), u = o(1), i = t ? 1 : a.w / a.vW, d = t ? 1 : a.h / a.vH;
  switch (e.property) {
    case "x":
      return (n.x - a.x) * i;
    case "y":
      return (n.y - a.y) * d;
    case "angle":
      return Math.atan2(u.y - s.y, u.x - s.x) * 180 / Math.PI;
  }
}
function ve(e, r) {
  var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, o = Oe(l.pth(e) ? e.totalLength : e, r) + "";
  return {
    original: o,
    numbers: o.match(t) ? o.match(t).map(Number) : [0],
    strings: l.str(e) || r ? o.split(t) : []
  };
}
function oe(e) {
  var r = e ? W(l.arr(e) ? e.map(le) : le(e)) : [];
  return U(r, function(t, o, a) {
    return a.indexOf(t) === o;
  });
}
function Pe(e) {
  var r = oe(e);
  return r.map(function(t, o) {
    return { target: t, id: o, total: r.length, transforms: { list: Me(t) } };
  });
}
function Ge(e, r) {
  var t = ee(r);
  if (/^spring/.test(t.easing) && (t.duration = ye(t.easing)), l.arr(e)) {
    var o = e.length, a = o === 2 && !l.obj(e[0]);
    a ? e = { value: e } : l.fnc(r.duration) || (t.duration = r.duration / o);
  }
  var n = l.arr(e) ? e : [e];
  return n.map(function(s, u) {
    var i = l.obj(s) && !l.pth(s) ? s : { value: s };
    return l.und(i.delay) && (i.delay = u ? 0 : r.delay), l.und(i.endDelay) && (i.endDelay = u === n.length - 1 ? r.endDelay : 0), i;
  }).map(function(s) {
    return q(s, t);
  });
}
function Xe(e) {
  for (var r = U(W(e.map(function(n) {
    return Object.keys(n);
  })), function(n) {
    return l.key(n);
  }).reduce(function(n, s) {
    return n.indexOf(s) < 0 && n.push(s), n;
  }, []), t = {}, o = function(n) {
    var s = r[n];
    t[s] = e.map(function(u) {
      var i = {};
      for (var d in u)
        l.key(d) ? d == s && (i.value = u[d]) : i[d] = u[d];
      return i;
    });
  }, a = 0; a < r.length; a++)
    o(a);
  return t;
}
function er(e, r) {
  var t = [], o = r.keyframes;
  o && (r = q(Xe(o), r));
  for (var a in r)
    l.key(a) && t.push({
      name: a,
      tweens: Ge(r[a], e)
    });
  return t;
}
function rr(e, r) {
  var t = {};
  for (var o in e) {
    var a = J(e[o], r);
    l.arr(a) && (a = a.map(function(n) {
      return J(n, r);
    }), a.length === 1 && (a = a[0])), t[o] = a;
  }
  return t.duration = parseFloat(t.duration), t.delay = parseFloat(t.delay), t;
}
function nr(e, r) {
  var t;
  return e.tweens.map(function(o) {
    var a = rr(o, r), n = a.value, s = l.arr(n) ? n[1] : n, u = C(s), i = te(r.target, e.name, u, r), d = t ? t.to.original : i, c = l.arr(n) ? n[0] : d, v = C(c) || C(i), f = u || v;
    return l.und(s) && (s = d), a.from = ve(c, f), a.to = ve(ae(s, c), f), a.start = t ? t.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = G(a.easing, a.duration), a.isPath = l.pth(n), a.isPathTargetInsideSVG = a.isPath && l.svg(r.target), a.isColor = l.col(a.from.original), a.isColor && (a.round = 1), t = a, a;
  });
}
var Ee = {
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
function Ce(e, r) {
  var t = Pe(e);
  t.forEach(function(o) {
    for (var a in r) {
      var n = J(r[a], o), s = o.target, u = C(n), i = te(s, a, u, o), d = u || C(i), c = ae(Oe(n, d), i), v = ne(s, a);
      Ee[v](s, a, c, o.transforms, !0);
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
  return U(W(e.map(function(t) {
    return r.map(function(o) {
      return tr(t, o);
    });
  })), function(t) {
    return !l.und(t);
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
  var r = K(pe, e), t = K(Y, e), o = er(t, e), a = Pe(e.targets), n = ar(a, o), s = Ie(n, t), u = de;
  return de++, q(r, {
    id: u,
    children: [],
    animatables: a,
    animations: n,
    duration: s.duration,
    delay: s.delay,
    endDelay: s.endDelay
  });
}
var w = [], Ae = function() {
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
  function o() {
    T.suspendWhenDocumentHidden && (he() ? e = cancelAnimationFrame(e) : (w.forEach(
      function(a) {
        return a._onDocumentVisibility();
      }
    ), Ae()));
  }
  return typeof document < "u" && document.addEventListener("visibilitychange", o), r;
}();
function he() {
  return !!document && document.hidden;
}
function T(e) {
  e === void 0 && (e = {});
  var r = 0, t = 0, o = 0, a, n = 0, s = null;
  function u(p) {
    var g = window.Promise && new Promise(function(S) {
      return s = S;
    });
    return p.finished = g, g;
  }
  var i = ir(e);
  u(i);
  function d() {
    var p = i.direction;
    p !== "alternate" && (i.direction = p !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, a.forEach(function(g) {
      return g.reversed = i.reversed;
    });
  }
  function c(p) {
    return i.reversed ? i.duration - p : p;
  }
  function v() {
    r = 0, t = c(i.currentTime) * (1 / T.speed);
  }
  function f(p, g) {
    g && g.seek(p - g.timelineOffset);
  }
  function y(p) {
    if (i.reversePlayback)
      for (var S = n; S--; )
        f(p, a[S]);
    else
      for (var g = 0; g < n; g++)
        f(p, a[g]);
  }
  function m(p) {
    for (var g = 0, S = i.animations, I = S.length; g < I; ) {
      var x = S[g], A = x.animatable, F = x.tweens, L = F.length - 1, O = F[L];
      L && (O = U(F, function(De) {
        return p < De.end;
      })[0] || O);
      for (var B = P(p - O.start - O.delay, 0, O.duration) / O.duration, R = isNaN(B) ? 1 : O.easing(B), k = O.to.strings, N = O.round, Z = [], Be = O.to.numbers.length, D = void 0, V = 0; V < Be; V++) {
        var j = void 0, se = O.to.numbers[V], ue = O.from.numbers[V] || 0;
        O.isPath ? j = Ye(O.value, R * se, O.isPathTargetInsideSVG) : j = ue + R * (se - ue), N && (O.isColor && V > 2 || (j = Math.round(j * N) / N)), Z.push(j);
      }
      var fe = k.length;
      if (!fe)
        D = Z[0];
      else {
        D = k[0];
        for (var H = 0; H < fe; H++) {
          k[H];
          var ce = k[H + 1], $ = Z[H];
          isNaN($) || (ce ? D += $ + ce : D += $ + " ");
        }
      }
      Ee[x.type](A.target, x.property, D, A.transforms), x.currentValue = D, g++;
    }
  }
  function h(p) {
    i[p] && !i.passThrough && i[p](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function M(p) {
    var g = i.duration, S = i.delay, I = g - i.endDelay, x = c(p);
    i.progress = P(x / g * 100, 0, 100), i.reversePlayback = x < i.currentTime, a && y(x), !i.began && i.currentTime > 0 && (i.began = !0, h("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, h("loopBegin")), x <= S && i.currentTime !== 0 && m(0), (x >= I && i.currentTime !== g || !g) && m(g), x > S && x < I ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, h("changeBegin")), h("change"), m(x)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, h("changeComplete")), i.currentTime = P(x, 0, g), i.began && h("update"), p >= g && (t = 0, b(), i.remaining ? (r = o, h("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && d()) : (i.paused = !0, i.completed || (i.completed = !0, h("loopComplete"), h("complete"), !i.passThrough && "Promise" in window && (s(), u(i)))));
  }
  return i.reset = function() {
    var p = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = p === "reverse", i.remaining = i.loop, a = i.children, n = a.length;
    for (var g = n; g--; )
      i.children[g].reset();
    (i.reversed && i.loop !== !0 || p === "alternate" && i.loop === 1) && i.remaining++, m(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = v, i.set = function(p, g) {
    return Ce(p, g), i;
  }, i.tick = function(p) {
    o = p, r || (r = o), M((o + (t - r)) * T.speed);
  }, i.seek = function(p) {
    M(c(p));
  }, i.pause = function() {
    i.paused = !0, v();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, w.push(i), v(), Ae());
  }, i.reverse = function() {
    d(), i.completed = !i.reversed, v();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(p) {
    var g = oe(p);
    Le(g, i);
  }, i.reset(), i.autoplay && i.play(), i;
}
function ge(e, r) {
  for (var t = r.length; t--; )
    X(e, r[t].animatable.target) && r.splice(t, 1);
}
function Le(e, r) {
  var t = r.animations, o = r.children;
  ge(e, t);
  for (var a = o.length; a--; ) {
    var n = o[a], s = n.animations;
    ge(e, s), !s.length && !n.children.length && o.splice(a, 1);
  }
  !t.length && !o.length && r.pause();
}
function or(e) {
  for (var r = oe(e), t = w.length; t--; ) {
    var o = w[t];
    Le(r, o);
  }
}
function sr(e, r) {
  r === void 0 && (r = {});
  var t = r.direction || "normal", o = r.easing ? G(r.easing) : null, a = r.grid, n = r.axis, s = r.from || 0, u = s === "first", i = s === "center", d = s === "last", c = l.arr(e), v = parseFloat(c ? e[0] : e), f = c ? parseFloat(e[1]) : 0, y = C(c ? e[1] : e) || 0, m = r.start || 0 + (c ? v : 0), h = [], b = 0;
  return function(M, p, g) {
    if (u && (s = 0), i && (s = (g - 1) / 2), d && (s = g - 1), !h.length) {
      for (var S = 0; S < g; S++) {
        if (!a)
          h.push(Math.abs(s - S));
        else {
          var I = i ? (a[0] - 1) / 2 : s % a[0], x = i ? (a[1] - 1) / 2 : Math.floor(s / a[0]), A = S % a[0], F = Math.floor(S / a[0]), L = I - A, O = x - F, B = Math.sqrt(L * L + O * O);
          n === "x" && (B = -L), n === "y" && (B = -O), h.push(B);
        }
        b = Math.max.apply(Math, h);
      }
      o && (h = h.map(function(k) {
        return o(k / b) * b;
      })), t === "reverse" && (h = h.map(function(k) {
        return n ? k < 0 ? k * -1 : -k : Math.abs(b - k);
      }));
    }
    var R = c ? (f - v) / b : v;
    return m + R * (Math.round(h[p] * 100) / 100) + y;
  };
}
function ur(e) {
  e === void 0 && (e = {});
  var r = T(e);
  return r.duration = 0, r.add = function(t, o) {
    var a = w.indexOf(r), n = r.children;
    a > -1 && w.splice(a, 1);
    function s(f) {
      f.passThrough = !0;
    }
    for (var u = 0; u < n.length; u++)
      s(n[u]);
    var i = q(t, K(Y, e));
    i.targets = i.targets || e.targets;
    var d = r.duration;
    i.autoplay = !1, i.direction = r.direction, i.timelineOffset = l.und(o) ? d : ae(o, d), s(r), r.seek(i.timelineOffset);
    var c = T(i);
    s(c), n.push(c);
    var v = Ie(n, e);
    return r.delay = v.delay, r.endDelay = v.endDelay, r.duration = v.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
  }, r;
}
T.version = "3.2.1";
T.speed = 1;
T.suspendWhenDocumentHidden = !0;
T.running = w;
T.remove = or;
T.get = te;
T.set = Ce;
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
class fr {
  getScrollOffset(r) {
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
  lerp(r, t, o) {
    let a = Math.abs(t - r), n = Math.max(t - o, 0);
    return 1 - Math.min(n / a, 1);
  }
  constructor(r, t) {
    t.forEach((n) => {
      var v;
      if (n.animations = {}, n.hasTriggered = !1, n.isActive = !1, (v = n.scrollTrigger).actions ?? (v.actions = "play none none reverse"), n.scrollTrigger.actions = n.scrollTrigger.actions.split(" "), n.scrollTrigger.actions.length < 4)
        throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
      Object.keys(n).forEach((f) => {
        ["targets", "scrollTrigger", "animations"].includes(f) || (n.animations[f] = n[f]);
      }), n.scrollTrigger.lerp && (n.animations.easing = "linear");
      let s = {
        targets: n.targets,
        ...n.animations,
        autoplay: !1
      };
      n.scrollTrigger.onUpdate && (s.update = n.scrollTrigger.onUpdate), n.anime = T(s);
      const u = (f) => {
        switch (f) {
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
      n._onEnter = (f, y) => {
        f.scrollTrigger.onEnter && f.scrollTrigger.onEnter(f, y), f.scrollTrigger.lerp ? f.anime.seek(f.anime.duration * y) : u(f.scrollTrigger.actions[0]);
      }, n._onLeave = (f, y) => {
        f.scrollTrigger.onLeave && f.scrollTrigger.onLeave(f, y), u(f.scrollTrigger.actions[1]);
      }, n._onEnterBack = (f, y) => {
        f.scrollTrigger.onEnterBack && f.scrollTrigger.onEnterBack(f, y), f.scrollTrigger.lerp ? f.anime.seek(f.anime.duration * y) : u(f.scrollTrigger.actions[2]);
      }, n._onLeaveBack = (f, y) => {
        f.scrollTrigger.onLeaveBack && f.scrollTrigger.onLeaveBack(f, y), u(f.scrollTrigger.actions[3]);
      };
      let i = n.scrollTrigger.trigger.getBoundingClientRect(), d = n.scrollTrigger.start ?? "top center";
      if (d = d.split(" "), d.length < 2)
        throw new Error('Start must be in the format of "triggerOffset scrollOffset"');
      n.startTriggerOffset = i.top + i.height * this.getScrollOffset(d[0]), n.startScrollPosition = d[1];
      let c = n.scrollTrigger.end ?? "bottom center";
      if (c = c.split(" "), c.length < 2)
        throw new Error('end must be in the format of "triggerOffset scrollOffset"');
      n.endScrollPosition = c[1], n.endTriggerOffset = i.top + i.height * this.getScrollOffset(c[0]), n.animationTriggerStartOffset = n.startTriggerOffset - r.clientHeight * this.getScrollOffset(n.startScrollPosition), n.animationTriggerEndOffset = n.endTriggerOffset - r.clientHeight * this.getScrollOffset(n.endScrollPosition), n.scrollTrigger.debug && (r.style.position = "relative", n.scrollTrigger.startTriggerOffsetMarker = this.createMarker("5px", "20px", "#ff4949", n.startTriggerOffset + "px"), n.scrollTrigger.endTriggerOffsetMarker = this.createMarker("5px", "20px", "#49deff", n.endTriggerOffset + "px"), n.scrollTrigger.trigger.appendChild(n.scrollTrigger.startTriggerOffsetMarker), n.scrollTrigger.trigger.appendChild(n.scrollTrigger.endTriggerOffsetMarker), n.scrollTrigger.startScrollerOffsetMarker = this.createMarker("5px", "24px", "#ff4949", r.clientHeight * this.getScrollOffset(n.startScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.endScrollerOffsetMarker = this.createMarker("5px", "24px", "#49deff", r.clientHeight * this.getScrollOffset(n.endScrollPosition) + "px", "0px", "absolute"), n.scrollTrigger.trigger.appendChild(n.scrollTrigger.startScrollerOffsetMarker), n.scrollTrigger.trigger.appendChild(n.scrollTrigger.endScrollerOffsetMarker));
    });
    let o = 0, a = !1;
    r.addEventListener("scroll", (n) => {
      a = r.scrollTop > o, o = r.scrollTop, t.forEach((s) => {
        let u = r.scrollTop + r.clientHeight * this.getScrollOffset(s.startScrollPosition), i = r.scrollTop + r.clientHeight * this.getScrollOffset(s.endScrollPosition);
        if (s.scrollTrigger.debug && (s.scrollTrigger.startScrollerOffsetMarker.style.top = u + "px", s.scrollTrigger.endScrollerOffsetMarker.style.top = i + "px"), u >= s.startTriggerOffset && (s.scrollTrigger.lerp || !s.isActive) && i <= s.endTriggerOffset) {
          let d = this.lerp(s.animationTriggerStartOffset, s.animationTriggerEndOffset, r.scrollTop);
          (d > 0.99 || d < 0.09) && (d = Math.round(d)), a ? s._onEnter(s, d) : s._onEnterBack(s, d), s.isActive = !0;
          return;
        }
        if (i >= s.endTriggerOffset && s.isActive) {
          s._onLeave(s), s.isActive = !1;
          return;
        }
        u < s.startTriggerOffset && s.isActive && (s.isActive = !1, s._onLeaveBack(s));
      });
    });
  }
}
window.ScrollAnime = fr;
export {
  fr as default
};
