const TipsType = {
  tipsNormal: 'tips',
  tipsPrimary: 'tips-primary',
  tipsSuccess: 'tips-success',
  tipsInfo: 'tips-info',
  tipsWarning: 'tips-warning',
  tipsDanger: 'tips-danger',
};
const TitleType = {
  admin: 'admin',
  owner: 'owner',
};

function beforeRenderingHTML(data, chatboxClass) {
  let htmlStr = '';
  let chatBox = document.querySelector(chatboxClass);
  for (let i = 0; i < data.length; i++) {
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

  chatBox.insertAdjacentHTML('beforeend',htmlStr);
  setTimeout(() => {
    if (chatBox.scrollHeight > chatBox.clientHeight) {
      chatBox.scrollTop = chatBox.scrollHeight;
      chatBox = '';
      htmlStr = '';
    }
  }, 300);
}

function renderMessageHtml(data) {
  return `<div class="c${data.position} cmsg">
        <img class="headIcon ${data.diamond ? '' : 'radius'}" src="${data.headIcon}" ondragstart="return false;" oncontextmenu="return false;"/>
        <span class="name">
            ${renderTitleHtml(data.htitle, TitleType[data.htitleType] || '')}
            <span>${escapeHtml(data.name) || '&nbsp;'}</span>
        </span>
        <span class="content">${data.messageType === 'raw' ? data.html : escapeHtml(data.html)}</span>
    </div>`;
}

function renderTitleHtml(content, css) {
  if (!content) return '';
  return `<span class="htitle ${css}" style="margin: 0 4px 0 0;">${content}</span>`;
}

function renderTipHtml(content, css) {
  if (!content) return '';
  return `<div class="tips"><span class="${css}" style="margin-bottom: 20px;">${escapeHtml(content)}</span></div>`;
}

// 转义 C0 Controls and Basic Latin 中非数字和字母，C1 Controls and Latin-1 Supplement 全部
// https://www.w3schools.com/charsets/ref_html_utf8.asp
function escapeHtml(unsafe) {
  return unsafe?.replace(
    /[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g,
    c => '&#' + ('000' + c.charCodeAt(0)).slice(-4) + ';'
  )
}
