/**
 * preloadAssets
 * version: 1.0.0
 * author: lianer
 */

'use strict'

var isIOS = /(iPad|iPhone|iPod)/.test(navigator.userAgent)
var usePrefetch = !isIOS

var JS_REG = /\.js($|\?)/

var getObjectType = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

var isString = function (obj) {
  return getObjectType(obj) === 'String'
}

var createDocument = function (ignoreError = false /* 屏蔽异常 */, beforePreloadScript /* 加载前执行的函数 */) {
  var iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none;'
  document.body.appendChild(iframe)
  var doc = iframe.contentDocument
  doc.open()
  doc.write('<html><head>')
  if (ignoreError) {
    doc.write('<script>window.onerror = function () {return true}</script>')
  }
  if (beforePreloadScript) {
    doc.write(`<script>${beforePreloadScript}</script>`)
  }
  setTimeout(() => {
    doc.write('</head><body></body></html>')
    doc.close()
  }, 0)
  iframe.onload = () => {
    document.body.removeChild(iframe)
  }
  return doc
}

var generatePrefetchTag = function (src) {
  var link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = src
  document.head.appendChild(link)
}

var generateHTML = function (src) {
  if (JS_REG.test(src)) {
    return `<script src="${src}"></script>`
  } else if (src.indexOf('.css')) {
    return `<link rel="stylesheet" href="${src}" />`
  }
  return ''
}

/**
 * 预加载静态资源
 * @param  {Mixin} assets 静态资源地址或数组
 * @param  {Object} options 选项
 *                          - delay 延迟加载，单位 ms，默认 0
 *                          - ignoreError 忽略加载的 js 异常，默认 false
 *                          - beforePreloadScript 加载前执行的函数，用于定义依赖的全局变量，默认 undefined
 */
export default function preloadAssets (assets, {delay = 0, ignoreError = false, beforePreloadScript} = {}) {
  if (isString(assets)) {
    assets = [assets]
  }
  setTimeout(() => {
    if (usePrefetch) {
      assets.forEach(src => {
        generatePrefetchTag(src)
      })
    } else {
      let doc = createDocument(ignoreError, beforePreloadScript)
      assets.forEach(src => {
        doc.write(generateHTML(src))
      })
    }
  }, delay)
}
