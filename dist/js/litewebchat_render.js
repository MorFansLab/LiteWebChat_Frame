/*!
 * LiteWebChat_Frame 2.2.1 (https://lab.morfans.cn/LiteWebChat_Frame)
 * MorFans Lab(c) 2017-2023
 * Licensed under LGPL
 */"use strict";

var TipsType = {
  tipsNormal: 'tips',
  tipsPrimary: 'tips-primary',
  tipsSuccess: 'tips-success',
  tipsInfo: 'tips-info',
  tipsWarning: 'tips-warning',
  tipsDanger: 'tips-danger'
};
var TitleType = {
  admin: 'admin',
  owner: 'owner'
};
function beforeRenderingHTML(data, chatboxClass) {
  var htmlStr = '';
  var chatBox = document.querySelector(chatboxClass);
  for (var i = 0; i < data.length; i++) {
    if (data[i].isRender) {
      continue;
    }
    if (data[i].messageType.indexOf('tips') !== -1) {
      htmlStr += renderTipHtml(data[i].html, TipsType[data[i].messageType] || 'tips');
    } else {
      htmlStr += renderMessageHtml(data[i]);
    }
    data[i].isRender = true;
  }
  chatBox.insertAdjacentHTML('beforeend', htmlStr);
  setTimeout(function () {
    if (chatBox.scrollHeight > chatBox.clientHeight) {
      chatBox.scrollTop = chatBox.scrollHeight;
      chatBox = '';
      htmlStr = '';
    }
  }, 300);
}
function renderMessageHtml(data) {
  return "<div class=\"c".concat(data.position, " cmsg\">\n        <img class=\"headIcon ").concat(data.diamond ? '' : 'radius', "\" src=\"").concat(data.headIcon, "\" ondragstart=\"return false;\" oncontextmenu=\"return false;\"/>\n        <span class=\"name\">\n            ").concat(renderTitleHtml(data.htitle, TitleType[data.htitleType] || ''), "\n            <span>").concat(escapeHtml(data.name) || '&nbsp;', "</span>\n        </span>\n        <span class=\"content\">").concat(data.messageType === 'raw' ? data.html : escapeHtml(data.html), "</span>\n    </div>");
}
function renderTitleHtml(content, css) {
  if (!content) return '';
  return "<span class=\"htitle ".concat(css, "\" style=\"margin: 0 4px 0 0;\">").concat(content, "</span>");
}
function renderTipHtml(content, css) {
  if (!content) return '';
  return "<div class=\"tips\"><span class=\"".concat(css, "\" style=\"margin-bottom: 20px;\">").concat(escapeHtml(content), "</span></div>");
}

// 转义 C0 Controls and Basic Latin 中非数字和字母，C1 Controls and Latin-1 Supplement 全部
// https://www.w3schools.com/charsets/ref_html_utf8.asp
function escapeHtml(unsafe) {
  return unsafe === null || unsafe === void 0 ? void 0 : unsafe.replace(/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g, function (c) {
    return '&#' + ('000' + c.charCodeAt(0)).slice(-4) + ';';
  });
}
//# sourceMappingURL=map/litewebchat_render.js.map
