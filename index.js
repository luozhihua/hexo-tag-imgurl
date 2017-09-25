'use strict';
console.log(hexo.config.imgurls)
var hexoUtil = require('hexo-util');
var cdns = hexo.config.cdns || [];
var rImgAttr = /[\:]+/;
var rImgUrl = /(.png|.jpg|.gif|.bmp|.webp){1}/;
var rScriptUrl = /(.js){1}/;
var rStyleUrl = /(.css){1}/;
var point = 0;


/**
 * Imgurl tag
 *
 * Syntax:
 * ```
 * {% imgurl imagePath [class1,class2,classN] imgAttr %}
 * ```
 */

hexo.extend.tag.register('cdnres', function(args){
  point = point < cdns.length ? point : 0

  var attrs = {};
  var cdnHost = cdns[point]
  var tag
  var tagType

  point += 1

  for (var i = 0; i < args.length; i++) {
    var item = args[i];

    if (rImgAttr.test(item)) {

      if (item[0] === '\'' || item[0] === '"') {
        item = item.substring(1, item.length - 1);
      }

      var parseAttr = item.split(':');

      attrs[parseAttr[0]] = parseAttr[1];
    } else if (rImgUrl.test(item)) {
      tagType = 'IMG'
      attrs.src = "//" + cdnHost + "/" + item;
    } else if (rScriptUrl.test(item)) {
      tagType = 'SCRIPT'
      attrs.src = "//" + cdnHost + "/" + item;
    } else if (rStyleUrl.test(item)) {
      tagType = 'STYLE'
      attrs.rel = 'stylesheet'
      attrs.href = "//" + cdnHost + "/" + item;
    } else {
      attrs.class = item.split(',').join(' ');
    }
  }

  switch (tagType) {
    case 'IMG':
      tag = hexoUtil.htmlTag('img', attrs);
      break;

    case 'SCRIPT':
      tag = hexoUtil.htmlTag('script', attrs);
      break;

    case 'STYLE':
      tag = hexoUtil.htmlTag('link', attrs);
      break;
  }

  return tag;
});
