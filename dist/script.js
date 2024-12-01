/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


// Stan aplikacji
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var appState = {
  currentStyle: 'style/styl1.css',
  // Ścieżka domyślnego stylu
  styles: {
    'Styl 1': 'style/styl1.css',
    'Styl 2': 'style/styl2.css',
    'Styl 3': 'style/styl3.css'
  }
};
// Funkcja do ustawiania stylu
function setStyle(style) {
  var head = document.head;
  // Usuń stary link
  var oldLink = document.querySelector("link[rel=\"stylesheet\"]");
  if (oldLink) {
    head.removeChild(oldLink);
  }
  // Dodaj nowy link
  var newLink = document.createElement('link');
  newLink.rel = 'stylesheet';
  newLink.href = style;
  head.appendChild(newLink);
  // Aktualizuj stan aplikacji
  appState.currentStyle = style;
}
// Funkcja do generowania linków
function generateStyleLinks() {
  var mainElement = document.querySelector('main');
  if (!mainElement) return;
  // Usuń istniejące linki
  var existingLinks = document.querySelectorAll('.style-link');
  existingLinks.forEach(function (link) {
    return link.remove();
  });
  // Dodaj nowe linki do zmiany stylów
  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      styleName = _Object$entries$_i[0],
      styleFile = _Object$entries$_i[1];
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = styleName;
    link.className = 'style-link';
    link.onclick = function (event) {
      event.preventDefault();
      setStyle(styleFile);
    };
    var paragraph = document.createElement('p');
    paragraph.appendChild(link);
    mainElement.appendChild(paragraph);
  };
  for (var _i = 0, _Object$entries = Object.entries(appState.styles); _i < _Object$entries.length; _i++) {
    _loop();
  }
}
// Po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {
  // Ustaw domyślny styl
  setStyle(appState.currentStyle);
  // Generuj linki
  generateStyleLinks();
});
/******/ })()
;