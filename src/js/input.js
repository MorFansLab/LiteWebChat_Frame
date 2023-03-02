// !参考资料来源：
// !https://blog.csdn.net/weixin_40629244/article/details/104642683
// !https://github.com/jrainlau/chat-input-box
// !https://www.zhihu.com/question/20893119/answer/19452676
// !致谢：感谢@jrainlau提供的思路和代码，我在他的富文本编辑器基础上进行了修改，使其能够在聊天输入框中使用
// ————YubaC 2023.1.23

"use strict";

// --------------------------------
// 上半部分的聊天区域
const upperChild = document.querySelector(".lite-chatbox");
// 分界线
const oLine = document.querySelector(".lite-chatinput hr");
// 下半部分的输入框区域
const downChild = document.querySelector(".lite-chatinput");

var downHeight = downChild.clientHeight;
var upperHeight = upperChild.clientHeight;

// 以下为输入框区域的按钮
const emojiBtn = document.getElementById("emojiBtn"); // 表情按钮
const imageBtn = document.getElementById("imageBtn"); // 图片按钮
const fileBtn = document.getElementById("fileBtn"); // 文件按钮
const editFullScreen = document.getElementById("editFullScreen"); // 全屏按钮
const exitFullScreen = document.getElementById("exitFullScreen"); // 退出全屏按钮
const emojiMart = document.getElementById("emojiMart"); // 表情面板
const toolMusk = document.getElementById("toolMusk"); // 表情面板遮罩
const sendBtn = document.getElementById("sendBtn"); // 发送按钮
const chatInput = document.querySelector(".lite-chatinput>.chatinput"); // 输入框

var maxImageSize; // 图片最大尺寸
var maxImageNumber; // 图片最大数量
// --------------------------------

// Emoji Mart（表情面板）设置及唤起
const pickerOptions = {
  locale: "zh",
  onEmojiSelect: function (e) {
    // console.log(e.native);
    emojiMart.style.display = "none";
    toolMusk.style.display = "none";
    insertAtCursor(chatInput, e.native);
    // insertEmoji(e.native);
  },
};
const picker = new EmojiMart.Picker(pickerOptions);
emojiMart.appendChild(picker);

/**
 * 负责在光标处插入文字的函数
 * @param {object} editor The HTML element to insert text into.
 * @param {*} html The HTML Text to be inserted.
 */
function insertAtCursor(editor, html) {
  editor.focus();

  if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      var range = selection.getRangeAt(0);
      range.deleteContents();
      var element = document.createElement("div");
      element.innerHTML = html;

      var node;
      var lastNode;
      var fragment = document.createDocumentFragment();

      while ((node = element.firstChild)) {
        lastNode = fragment.appendChild(node);
      }

      range.insertNode(fragment);
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    editor.focus();
    var range = document.selection.createRange();
    range.pasteHTML(html);
    editor.focus();
  }
}

// 调整聊天区域和输入框区域比例的函数
oLine.onmousedown = function (ev) {
  // 更改oLine颜色为蓝色，方便查看分界线
  const olineOriBgColor = oLine.style.backgroundColor;
  oLine.style.backgroundColor = "#1E90FF";
  var iEvent = ev || event;
  var dy = iEvent.clientY; //当你第一次单击的时候，存储y轴的坐标。//相对于浏览器窗口
  upperHeight = upperChild.offsetHeight;
  downHeight = downChild.offsetHeight;
  document.onmousemove = function (ev) {
    var iEvent = ev || event;
    var diff = iEvent.clientY - dy; //移动的距离（向上滑时为负数,下滑时为正数）
    if (100 < upperHeight + diff && 100 < downHeight - diff) {
      //两个div的最小高度均为100px
      upperChild.style.height = `calc(100% - ${downHeight - diff}px)`;
      downChild.style.height = downHeight - diff + "px";
    }
  };
  document.onmouseup = function () {
    // 更改oLine颜色为原色
    oLine.style.backgroundColor = olineOriBgColor;
    document.onmousedown = null;
    document.onmousemove = null;
  };
  return false;
};

// 显示表情输入框
emojiBtn.onclick = function () {
  emojiMart.style.display = "block";
  toolMusk.style.display = "block";

  let emojiHeight = emojiMart.offsetHeight;
  downHeight = downChild.clientHeight;
  upperHeight = upperChild.clientHeight;

  if (emojiHeight < upperHeight) {
    emojiMart.style.bottom = `${downHeight + 3}px`;
    emojiMart.style.top = "";
  } else {
    emojiMart.style.bottom = "";
    emojiMart.style.top = "10px";
  }
};

// 全屏编辑文字
editFullScreen.onclick = function () {
  downHeight = downChild.clientHeight;
  upperHeight = upperChild.clientHeight;
  downChild.style.height = `100%`;
  upperChild.style.height = "0px";
  editFullScreen.style.display = "none";
  exitFullScreen.style.display = "block";
  oLine.style.display = "none";
};

// 退出全屏编辑文字
exitFullScreen.onclick = function () {
  // 防呆不防傻，用于避免上部聊天窗口被压到没有高度后出现异常
  if (upperHeight != 0) {
    downChild.style.height = `${downHeight}px`;
    upperChild.style.height = `calc(100% - ${downHeight}px)`;
  } else {
    upperChild.style.height = "calc(100% - 150px)";
    downChild.style.height = "150px";
  }

  exitFullScreen.style.display = "none";
  editFullScreen.style.display = "block";
  oLine.style.display = "block";
};

// 隐藏musk和表情输入框
toolMusk.onclick = function () {
  emojiMart.style.display = "none";
  toolMusk.style.display = "none";
};

// ----------------图片和文件的输入----------------

/**
 * 将图片插入到输入框中
 * @param {object} file The image to be inserted, which is a File object, directly from the input element.
 */
function addImage(file) {
  new Promise((resolve, reject) => {
    // console.log(file);
    // 获取file的src
    var reader = new FileReader();
    reader.onload = function (e) {
      var src = e.target.result;
      var img = new Image();
      img.src = src;

      // *这里的方法已经转移到了css里，暂时弃用
      // // 为了防止图片在输入框内显示过大不好编辑
      // img.style.width = "100px";
      // 将img从HEMLElement转化为字符串
      // 例如，转化结束后为'<img src="">'
      var imgStr = img.outerHTML;
      // 将img字符串插入到输入框中
      insertAtCursor(chatInput, imgStr);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 点击插入图片按钮后的操作
 * @param {object} config The configuration object.
 * @param {object} config.input The input element to get the file from.
 * @param {function} config.addImage The function to add image to the input, uaually addImage(file).
 * @param {function} config.sendFile The function to send file, usually sendFile(file).
 * @param {number} config.maxImageNumber The maximum number of images allowed in the input. -1 means no limit.
 * @param {number} config.maxImageSize The maximum size of images allowed in the input. -1 means no limit.
 * @returns {void}
 */
function getImageInputFromButton(config) {
  // 解构赋值获取参数
  const { input, addImage, sendFile, maxImageNumber, maxImageSize } = config;

  // 获取输入框内图片数量
  var imgNum = chatInput.getElementsByTagName("img").length;

  // 循环处理每个文件
  for (let i = 0; i < input.files.length; i++) {
    // 如果图片数量未超过限制
    if (maxImageNumber === -1 || imgNum < maxImageNumber) {
      // 如果图片大小未超过限制
      if (maxImageSize === -1 || input.files[i].size <= maxImageSize) {
        // 添加图片
        addImage(input.files[i]);
        // 更新图片数量
        imgNum++;
      } else {
        // 如果大小超过限制，改用文件上传
        sendFile(input.files[i]);
      }
    }
  }
}

/**
 * 点击插入文件按钮后的操作
 * @param {object} config The configuration object.
 * @param {object} config.input The input element to get the file from.
 * @param {function} config.sendFile The function to send file, usually sendFile(file).
 * @returns {void}
 */
function getFileInputFromButton(config) {
  var input = config.input;
  var sendFile = config.sendFile;
  // 获取文件
  for (var i = 0; i < input.files.length; i++) {
    var file = input.files[i];
    sendFile(file);
  }
}
/**
 * 拖拽图片到输入框后的操作
 * @param {object} param0 The configuration object.
 * @param {object} param0.event The event object.
 * @param {function} param0.addImage The function to add image to the input, uaually addImage(file).
 * @param {function} param0.sendFile The function to send file, usually sendFile(file).
 * @param {number} param0.maxImageNumber The maximum number of images allowed in the input. -1 means no limit.
 * @param {number} param0.maxImageSize The maximum size of images allowed in the input. -1 means no limit.
 * @returns {void}
 */
function getInputFromDrag({
  event: e,
  addImage,
  sendFile,
  maxImageNumber,
  maxImageSize,
}) {
  e.preventDefault();
  // 阻止火狐浏览器默认打开文件的行为
  e.stopPropagation();

  // 获取被拖拽的文件并上传
  var imgNum = chatInput.getElementsByTagName("img").length;
  const isImageType = (file) => file.type.indexOf("image") === 0;

  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    const file = e.dataTransfer.files[i];
    const isBelowMaxImageNumber =
      maxImageNumber === -1 || imgNum < maxImageNumber;
    const isBelowMaxImageSize =
      maxImageSize === -1 || file.size <= maxImageSize;

    // 如果是图片，直接插入到输入框中
    if (isImageType(file)) {
      if (isBelowMaxImageNumber) {
        if (isBelowMaxImageSize) {
          addImage(file);
          imgNum++;
          continue;
        }
        // 如果大小超过限制，改用文件上传
        sendFile(file);
      }
      continue;
    }
    // 如果不是图片，直接上传
    sendFile(file);
  }
}

/**
 * 设置上传图片、文件的功能
 * @param {object} settings The configuration object.
 * @param {boolean} settings.enable Whether to enable the input file feature.
 * @param {number} settings.maxImageSize The maximum size of images allowed in the input. -1 means no limit.
 * @param {number} settings.maxImageNumber The maximum number of images allowed in the input. -1 means no limit.
 * @param {function} settings.sendFileFunc The function to send file, which will become sendFile(file).
 * @returns {void}
 */
// 上传图片、文件
function inputFile(settings) {
  const {
    enable,
    maxImageSize: inputMaxImageSize,
    maxImageNumber: inputMaxImageNumber,
    sendFileFunc,
  } = settings;

  if (!enable) {
    return;
  }

  // -----------------设置最大图片大小及数量-----------------
  const maxImageSize = inputMaxImageSize !== undefined ? inputMaxImageSize : -1;
  const maxImageNumber =
    inputMaxImageNumber !== undefined ? inputMaxImageNumber : -1;

  // -----------------上传图片的按钮-----------------
  imageBtn.onclick = () => {
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";
    imageInput.multiple = true;
    imageInput.style.display = "none";
    imageInput.onchange = () => {
      getImageInputFromButton({
        input: imageInput,
        addImage,
        sendFile: sendFileFunc,
        maxImageNumber,
        maxImageSize,
      });
    };
    // 触发点击事件
    imageInput.click();
  };

  // -----------------上传文件的按钮-----------------
  // 上传文件按钮
  fileBtn.onclick = () => {
    // 创建一个隐藏的上传文件的input，再借助点击这个input来上传文件
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.style.display = "none";
    fileInput.onchange = () => {
      getFileInputFromButton({
        input: fileInput,
        sendFile: sendFileFunc,
      });
    };
    // 触发点击事件
    fileInput.click();
  };

  // -----------------拖拽上传-----------------
  if (!settings.enableDrop) {
    // 如果不允许上传，那么删除事件
    imageBtn.onclick = null;
    fileBtn.onclick = null;
    // 删除拖拽事件
    downChild.ondrop = null;
    downChild.ondragover = null;
    downChild.ondragleave = null;
    return;
  }

  // 当downChild有文件被拖入时，也调用上传文件的函数
  downChild.ondrop = (e) => {
    downChild.style.outline = "none";
    downChild.style.outlineOffset = "0px";
    getInputFromDrag({
      event: e,
      addImage,
      sendFile: sendFileFunc,
      maxImageNumber,
      maxImageSize,
    });
  };

  // 当downChild有文件被拖入时，改变downChild的边框颜色
  downChild.ondragover = function (e) {
    e.preventDefault();
    downChild.style.outline = "3px solid #1E90FF";
    downChild.style.outlineOffset = "-6px";
  };

  // 当downChild有文件被拖入后离开时，改回downChild的边框颜色
  downChild.ondragleave = function (e) {
    e.preventDefault();
    downChild.style.outline = "none";
    downChild.style.outlineOffset = "0px";
  };
}

// TODO:可能富文本输入框的粘贴部分需要对Chrome浏览器做部分额外适配，以优化体验
// 无格式粘贴
chatInput.addEventListener("paste", function (e) {
  onPaste(e);
});

//格式化粘贴文本方法
function onPaste(event) {
  // 如果粘贴的是文本，就清除格式后粘贴
  if (event.clipboardData && event.clipboardData.getData) {
    var text = event.clipboardData.getData("text/plain");
    if (text) {
      event.preventDefault();
      document.execCommand("insertText", false, text);
    }
  }
}

window.addEventListener("DOMContentLoaded", function () {
  chatInput.focus();
});
