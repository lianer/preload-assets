# preload-assets.js

预加载静态资源，包括 js 和 css。

原理：使用 HTML5 prefetch 特性预加载资源，如果不支持 prefetch，则会创建一个隐藏的 iframe，在 iframe 中创建 script 标签加载 js，创建 link 标签加载 css。

## 安装
```bash
npm install preload-assets --save
```

## 用法

```js
import preloadAssets from 'preload-assets'

var assets = [
  'https://cdn.bootcss.com/vue/2.5.9/vue.min.js',
  'https://cdn.bootcss.com/Swiper/4.0.6/css/swiper.min.css',
  'https://cdn.bootcss.com/Swiper/4.0.6/js/swiper.min.js'
]

var options = {
  delay: 0,  // 延迟预加载，单位 ms，避免影响到当前页面的加载效率
  ignoreError: false,  // 如果配置为 true，则会隐藏 iframe 方案加载时的 js 异常
  beforePreloadScript: 'window.CONFIG={};'  // iframe 方案加载时，提前定义的全局变量，可以避免业务代码报错
}

preloadAssets(assets, options)
```
