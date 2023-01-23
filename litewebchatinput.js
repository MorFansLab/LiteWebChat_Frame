var upperChild = document.querySelector('.lite-chatbox');
var oLine = document.querySelector('.lite-chatinput hr');
var downChild = document.querySelector('.lite-chatinput');

var emojiBtn = document.getElementById("emojiBtn");
var fileBtn = document.getElementById("fileBtn");
var editFullScreen = document.getElementById("editFullScreen");
var exitFullScreen = document.getElementById("exitFullScreen");
var emojiMart = document.getElementById("emojiMart");
var toolMusk = document.getElementById("toolMusk");
var sendBtn = document.getElementById("sendBtn");
var chatInput = document.querySelector('.lite-chatinput>.chatinput');

// Emoji Mart 设置及唤起
var pickerOptions = {
    "locale": "zh",
    onEmojiSelect: function(e) {
        // console.log(e.native);            
        emojiMart.style.display = "none";
        toolMusk.style.display = "none";
        insertAtCursor(document.querySelector('.lite-chatinput>.chatinput'), e.native)
    }
}
var picker = new EmojiMart.Picker(pickerOptions);
emojiMart.appendChild(picker);

// 负责在光标处插入文字的函数
function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        // console.log('ie');
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        // console.log('modern');
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos) +
            myValue +
            myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}

// 调整聊天区域和输入框区域比例的函数
oLine.onmousedown = function(ev) {
    // 更改oLine颜色为蓝色，方便查看分界线
    oLine.style.backgroundColor = "#1E90FF";
    var iEvent = ev || event;
    var dy = iEvent.clientY; //当你第一次单击的时候，存储y轴的坐标。//相对于浏览器窗口        
    var upperHeight = upperChild.offsetHeight;
    var downHeight = downChild.offsetHeight;
    document.onmousemove = function(ev) {
        var iEvent = ev || event;
        var diff = iEvent.clientY - dy; //移动的距离（向上滑时为负数,下滑时为正数）
        if (100 < (upperHeight + diff) && 100 < (downHeight - diff)) {
            //两个div的最小高度均为100px
            upperChild.style.height = `calc(100% - ${downHeight - diff}px)`;
            downChild.style.height = (downHeight - diff) + 'px';
        }
    };
    document.onmouseup = function() {
        // 更改oLine颜色为白色
        oLine.style.backgroundColor = "#fff";
        document.onmousedown = null;
        document.onmousemove = null;
    };
    return false;
}

// 显示表情输入框
emojiBtn.onclick = function() {
    emojiMart.style.display = "block";
    toolMusk.style.display = "block";

    let emojiHeight = emojiMart.offsetHeight;
    var downHeight = downChild.clientHeight;
    var upperHeight = upperChild.clientHeight;

    if (emojiHeight < upperHeight) {
        emojiMart.style.bottom = `${downHeight + 3}px`
        emojiMart.style.top = '';
    } else {
        emojiMart.style.bottom = ''
        emojiMart.style.top = '10px';
    }

}

// 全屏编辑文字
editFullScreen.onclick = function() {
    downHeight = downChild.clientHeight;
    upperHeight = upperChild.clientHeight;
    downChild.style.height = `100%`;
    upperChild.style.height = "0px";
    editFullScreen.style.display = "none";
    exitFullScreen.style.display = "block";
    oLine.style.display = "none";
}

// 退出全屏编辑文字
exitFullScreen.onclick = function() {
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
}

// 隐藏musk和表情输入框
toolMusk.onclick = function() {
    emojiMart.style.display = "none";
    toolMusk.style.display = "none";
}

function inputFile(settings) {
    if (settings.enable) {
        sendFile = settings.sendFileFunc;
        // 上传文件
        fileBtn.onclick = function() {
            // 创建一个隐藏的上传文件的input，再借助点击这个input来上传文件
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.onchange = function() {
                // 获取文件
                var file = this.files[0];
                sendFile(file);
            }

            // 触发点击事件
            fileInput.click();
        }

        if (settings.enableDropFile) {
            // 当downChild有文件被拖入时，也调用上传文件的函数
            downChild.ondrop = function(e) {
                e.preventDefault();
                downChild.style.border = "none";
                // 获取被拖拽的文件并上传
                var file = e.dataTransfer.files[0];
                sendFile(file);
            }

            // 当downChild有文件被拖入时，改变downChild的边框颜色
            downChild.ondragover = function(e) {
                e.preventDefault();
                downChild.style.border = "3px solid #1E90FF";
            }

            // 当downChild有文件被拖入后离开时，改回downChild的边框颜色
            downChild.ondragleave = function(e) {
                e.preventDefault();
                downChild.style.border = "none";
            }
        }
    }
}

const onPaste = (e) => {
        // 如果剪贴板没有数据则直接返回
        if (!(e.clipboardData && e.clipboardData.items)) {
            return
        }
        // 用Promise封装便于将来使用
        return new Promise((resolve, reject) => {
            // 复制的内容在剪贴板里位置不确定，所以通过遍历来保证数据准确
            for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
                const item = e.clipboardData.items[i]
                    // 文本格式内容处理
                if (item.kind === 'string') {
                    item.getAsString((str) => {
                            resolve(str)
                        })
                        // 图片格式内容处理
                } else if (item.kind === 'file') {
                    const pasteFile = item.getAsFile()
                        // 处理pasteFile
                    const imgEvent = {
                        target: {
                            files: [pasteFile]
                        }
                    }
                    chooseImg(imgEvent, (url) => {
                        resolve(url)
                    })
                } else {
                    reject(new Error('Not allow to paste this type!'))
                }
            }
        })
    }
    // async function pasteImage(e) {
    //     console.log(e.clipboardData.items);
    //     result = await onPaste(e);
    //     console.log(result);
    // }
chatInput.addEventListener('paste', async(e) => {
    // pasteImage(e);
    // 读取剪贴板的内容
    // 阻止直接粘贴
    e.preventDefault();
    const result = await onPaste(e);
    const imgRegx = /^data:image\/png;base64,/;
    // 如果是图片格式（base64），则通过构造range的办法把<img>标签插入正确的位置
    // 如果是文本格式，则通过document.execCommand('insertText')方法把文本插入
    if (imgRegx.test(result)) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
            const range = sel.getRangeAt(0);
            const img = new Image();
            img.src = result;
            range.insertNode(img);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else {
        document.execCommand('insertText', false, result);
    }
})

/**
 * 预览函数
 *
 * @param {*} dataUrl base64字符串
 * @param {*} cb 回调函数
 */
function toPreviewer(dataUrl, cb) {
    cb && cb(dataUrl)
}

/**
 * 图片压缩函数
 *
 * @param {*} img 图片对象
 * @param {*} fileType  图片类型
 * @param {*} maxWidth 图片最大宽度
 * @returns base64字符串
 */
function compress(img, fileType, maxWidth) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    const proportion = img.width / img.height
    const width = maxWidth
    const height = maxWidth / proportion

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, width, height)

    const base64data = canvas.toDataURL(fileType, 0.75)
    canvas = ctx = null

    return base64data
}

/**
 * 选择图片函数
 *
 * @param {*} e input.onchange事件对象
 * @param {*} cb 回调函数
 * @param {number} [maxsize=200 * 1024] 图片最大体积
 */
function chooseImg(e, cb, maxsize = 200 * 1024) {
    const file = e.target.files[0]

    if (!file || !/\/(?:jpeg|jpg|png)/i.test(file.type)) {
        return
    }

    const reader = new FileReader()
    reader.onload = function() {
        const result = this.result
        let img = new Image()

        if (result.length <= maxsize) {
            toPreviewer(result, cb)
            return
        }

        img.onload = function() {
            const compressedDataUrl = compress(img, file.type, maxsize / 1024)
            toPreviewer(compressedDataUrl, cb)
            img = null
        }

        img.src = result
    }

    reader.readAsDataURL(file)
}