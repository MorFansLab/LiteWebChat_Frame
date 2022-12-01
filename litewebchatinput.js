var upperChild = document.querySelector('.lite-chatbox');
var oLine = document.querySelector('.lite-chatinput hr');
var downChild = document.querySelector('.lite-chatinput');

var emojiBtn = document.getElementById("emojiBtn");
var editFullScreen = document.getElementById("editFullScreen");
var exitFullScreen = document.getElementById("exitFullScreen");
var emojiMart = document.getElementById("emojiMart");
var toolMusk = document.getElementById("toolMusk");

// Emoji Mart 设置及唤起
var pickerOptions = {
    "locale": "zh",
    onEmojiSelect: function(e) {
        // console.log(e.native);            
        emojiMart.style.display = "none";
        toolMusk.style.display = "none";
        insertAtCursor(document.querySelector('.lite-chatinput textarea'), e.native)
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
    var iEvent = ev || event;
    var dy = iEvent.clientY; //当你第一次单击的时候，存储y轴的坐标。//相对于浏览器窗口        
    var upperHeight = upperChild.offsetHeight;
    var downHeight = downChild.offsetHeight;
    document.onmousemove = function(ev) {
        var iEvent = ev || event;
        var diff = iEvent.clientY - dy; //移动的距离（向上滑时为负数,下滑时为正数）
        if (100 < (upperHeight + diff) && 100 < (downHeight - diff)) {
            //两个div的最小高度均为100px
            upperChild.style.height = (upperHeight + diff) + 'px';
            downChild.style.height = (downHeight - diff) + 'px';
        }
    };
    document.onmouseup = function() {
        document.onmousedown = null;
        document.onmousemove = null;
    };
    return false;
}

// 显示表情输入框
emojiBtn.onclick = function() {
    emojiMart.style.display = "block";
    toolMusk.style.display = "block";
}

// 全屏编辑文字
editFullScreen.onclick = function() {
    nowHeight = downChild.clientHeight;
    downChild.style.height = "100%";
    editFullScreen.style.display = "none";
    exitFullScreen.style.display = "block";
    oLine.style.display = "none";
}

// 退出全屏编辑文字
exitFullScreen.onclick = function() {
    downChild.style.height = `${nowHeight}px`;
    exitFullScreen.style.display = "none";
    editFullScreen.style.display = "block";
    oLine.style.display = "block";
}

// 隐藏musk和表情输入框
toolMusk.onclick = function() {
    emojiMart.style.display = "none";
    toolMusk.style.display = "none";
}