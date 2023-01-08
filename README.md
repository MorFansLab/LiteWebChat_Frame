# 轻网页聊天框架

![演示](https://i.loli.net/2018/12/08/5c0bba10d25da.png)

在线演示：

- [~~性感聊天在线观看~~](https://lab.morfans.cn/LiteWebChat_Frame/chat_example.html)
- [带输入框表情选取](https://lab.morfans.cn/LiteWebChat_Frame/chat_with_inputarea_example.html)
- [带输入框表情选取简单JS渲染](https://lab.morfans.cn/LiteWebChat_Frame/chat_with_inputarea_module_example.html)

[本框架](https://github.com/MorFansLab/LiteWebChat_Frame) 大部分聊天对话所要求的样式特性已完成，能够助你快速开发聊天类对话界面

## 使用~~指南~~ (指北)

### 安装

我们仅提供了两种方式来获取 LiteWebChat_Frame， ~~但你可以通过各种奇淫技巧获取使用。~~

#### 下载文件

你可以直接从 GayHub 项目 [官网](https://github.com/MorFansLab/LiteWebChat_Frame) 直接克隆下载，其中包含了压缩过的和未压缩过的 CSS、JS 和 两个例子文件，以及图片文件。

#### 直接引用

##### 对话框

```html
<!-- 两个任选一个 github pages -->
<link type="text/css" href="https://lab.morfans.cn/LiteWebChat_Frame/litewebchat.min.css" rel="stylesheet" />

<!-- 两个任选一个 jsdelivr -->
<link type="text/css" href="https://cdn.jsdelivr.net/gh/MorFansLab/LiteWebChat_Frame/litewebchat.min.css" rel="stylesheet" />
```

##### 输入框

> **注意：对话框可以单独被使用，输入框必须和对话框配合使用。**

```html
<link type="text/css" href="https://cdn.jsdelivr.net/gh/MorFansLab/LiteWebChat_Frame/litewebchatinput.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js"></script>
<script src="https://cdn.jsdelivr.net/gh/MorFansLab/LiteWebChat_Frame/litewebchatinput.min.js"></script>
```

#### 创建容器

##### 仅对话框

```html
<div class="lite-chatbox">
...
</div>
```

##### 对话框和输入框

```html
<!-- 父容器 -->
<div class="lite-chatmaster">
    <!-- 聊天栏 -->
    <div class="lite-chatbox">
        ...
    </div>

    <!-- 输入框使用的工具栏，包含emoji输入框等组件 -->
    <div class="lite-chattools">
        ...
    </div>

    <!-- 输入框 -->
    <div class="lite-chatinput">
        ...
    </div>
</div>
```

**注意：使用输入框时需要手动指定其父容器大小。**

Example:

```css
/* 全局，当整个HTML页面都是聊天窗口的时候取消body的margin 和 padding，这样比较好看 */

html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

/* 手动指定其父容器大小 */
.lite-chatmaster {
    height: 100%;
    width: 100%;
}
```

可以参考配合一下简易的 JS 消息渲染：

- 效果和使用参考：[带输入框表情选取简单JS渲染](https://lab.morfans.cn/LiteWebChat_Frame/chat_with_inputarea_module_example.html)

字段：

- messageType：消息类型
  - 可选值：
    - 系统提示
      - tipsNormal
      - tipsPrimary
      - tipsSuccess
      - tipsInfo
      - tipsWarning
      - tipsDanger
    - 消息
      - text：普通消息类型
      - raw：不会转义消息类型
- html：object 内容
- headIcon：头像图片地址
- diamond：是否使用方块头像样式
  - bool
- name：用户名
- position：消息位置
  - left
  - right
- htitleType: 头衔类型
  - admin
  - owner
  - 不写则是默认
- htitle：头衔标题

```html
<!-- 抽离的聊天信息组件 -->
<script src="https://cdn.jsdelivr.net/gh/MorFansLab/LiteWebChat_Frame/lite-chatbox.min.js"></script>
<script>
  const htmls = [
      {
          messageType: 'tipsDanger',
          html: '从我做过的类聊天需求来看，聊天消息要么是纯文本，要么是富文本。所以我抽离出来的消息渲染组件默认了消息是富文本。如果想发送HTML请自行魔改。'
      },
      {
          messageType: 'raw',
          headIcon: './img/A.jpg',
          name: '图片消息2',
          position: 'left',
          html: `<img src="./img/img.png"><br>图片带文字是可以的 <del>（废话）</del>`,
      },
      {
          messageType: 'text',
          headIcon: './img/A.jpg',
          name: '全符号测试',
          position: 'left',
          html: '。，；？：！‘’“”@ˆ.,;?:!\'"〝〞﹫ˇ'
      },
  ];
  beforeRenderingHTML(htmls, '.lite-chatbox');
</script>
<script>
  document.querySelector('.send').onclick = function () {
      htmls.push({
          messageType: 'text',
          headIcon: './img/B.jpg',
          name: 'SuperPaxxs',
          position: 'right',
          html: document.querySelector('.chatinput').value
      })
      document.querySelector('.chatinput').value = '';
      beforeRenderingHTML(htmls, '.lite-chatbox');
  };
</script>
```

### 兼容性

兼容 Edge和其他主流浏览器的最新版本。

对于IE浏览器请微修改右对话气泡背景即可使用

[参考](http://browsershots.org/https://lab.morfans.cn/LiteWebChat_Frame/chat_example.html)

## 组件

### 聊天气泡

![气泡](https://i.loli.net/2018/12/08/5c0bc50bd0674.png)

| 组件（类名）         | Class 附加类名 / 备注                                |
| -------------------- | ---------------------------------------------------- |
| 聊天气泡组件（cmsg） | cleft（左边） / cright（右边）                       |
| 头像 (headIcon)      | 默认方形 / radius（圆形头像）                        |
| 头衔 （htitle）      | 默认成员头衔 / admin（管理头衔） / owner（群主头衔） |
| 名称（name）         | 为空使用 ‘&amp;nbsp;’                                |
| 聊天内容（content）  | -                                                    |

Example:

```html
    <div class="cright cmsg">
        <img class="headIcon radius" ondragstart="return false;"  oncontextmenu="return false;"  src="./img/B.jpg" />
        <span class="name">SuperPaxxs</span>
        <span class="content">LiteChat_Frame（轻聊天气泡框架），一个贼简洁 <del>(简单)</del> 、美观、易用的 HTML 聊天界面框架</span>
    </div>
```

### 系统提示

![提示](https://i.loli.net/2018/12/08/5c0bcfbbbce7b.png)

| 类名         | 效果          |
| ------------ | ------------- |
| tips         | 正常          |
| tips-primary | 首要的提示    |
| tips-success | 成功提示      |
| tips-info    | 信息提示      |
| tips-warning | 警告提示      |
| tips-danger  | 错误/危险提示 |

Example:

```html
    <div class="tips">
        <span class="tips-danger">系统消息：左/右边长消息被管理员批判一番……</span>
    </div>

    <div class="tips">
        <span>系统消息：normal</span>
    </div>
```

### 输入框

![输入框](https://i.postimg.cc/t4G1Crj6/input.png)

| 组件（HTML标签）            | 是否必备 | 类名                                                  | 备注                                                                                              |
| --------------------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 文字输入框（&lt;textarea>） | 是       | chatinput                                             | Class：lite-chatinput内只能存在一个textarea标签                                                   |
| 发送按钮（&lt;button>）     | 是       | send                                                  | Class：lite-chatinput内只能存在一个发送按钮                                                       |
| 分界线（&lt;hr>）           | 是       | boundary                                              | 充当输入框和对话框之间的分界线                                                                    |
| 工具栏按钮（&lt;button>）   | 否       | tool-button（必选）、float-right/float-left（二选一） | 用于充当表情按钮等工具栏控件，类名float-left 和 类名float-right 决定其对齐方式（左对齐/右对齐）。 |

Example:

```html
<!-- 输入框 -->
<div class="lite-chatinput">
    <!-- 分界线 -->
    <hr class="boundary">
    <!-- 按钮内部的为svg图片 -->
    <!-- 表情输入框按钮 -->
    <button title="表情" type="button" class="tool-button float-left" id="emojiBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"></path><path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"></path></svg></button>
    <!-- 全屏编辑按钮 -->
    <button title="全屏编辑" type="button" class="tool-button float-right" id="editFullScreen"><svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M17.066667 2.844444C11.377778 2.844444 8.533333 5.688889 5.688889 8.533333 2.844444 11.377778 0 14.222222 0 19.911111v364.088889c0 2.844444 0 5.688889 2.844444 5.688889h5.688889l122.311111-122.311111 164.977778 164.977778c2.844444 2.844444 8.533333 5.688889 11.377778 5.688888 5.688889 0 8.533333-2.844444 11.377778-5.688888l110.933333-110.933334c2.844444-2.844444 5.688889-8.533333 5.688889-11.377778 0-5.688889-2.844444-8.533333-5.688889-11.377777l-159.288889-170.666667L389.688889 8.533333c2.844444-2.844444 2.844444-2.844444 0-5.688889 0-2.844444-2.844444-2.844444-2.844445-2.844444L17.066667 2.844444zM17.066667 1024c-5.688889 0-8.533333-2.844444-11.377778-5.688889-2.844444-2.844444-5.688889-8.533333-5.688889-11.377778V640c0-2.844444 0-5.688889 2.844444-5.688889h5.688889l122.311111 122.311111 164.977778-164.977778c2.844444-2.844444 8.533333-5.688889 11.377778-5.688888 5.688889 0 8.533333 2.844444 11.377778 5.688888l110.933333 110.933334c2.844444 2.844444 5.688889 8.533333 5.688889 11.377778s-2.844444 8.533333-5.688889 11.377777l-164.977778 164.977778 119.466667 119.466667c2.844444 2.844444 2.844444 2.844444 0 5.688889 0 2.844444-2.844444 2.844444-5.688889 2.844444L17.066667 1024zM1006.933333 2.844444c5.688889 0 8.533333 2.844444 11.377778 5.688889 2.844444 2.844444 5.688889 5.688889 5.688889 11.377778v364.088889c0 2.844444 0 5.688889-2.844444 5.688889h-5.688889l-122.311111-122.311111-164.977778 164.977778c-2.844444 2.844444-8.533333 5.688889-11.377778 5.688888-5.688889 0-8.533333-2.844444-11.377778-5.688888l-110.933333-110.933334c-2.844444-2.844444-5.688889-8.533333-5.688889-11.377778 0-5.688889 2.844444-8.533333 5.688889-11.377777l164.977778-164.977778L640 14.222222c-2.844444-2.844444-2.844444-2.844444 0-5.688889-5.688889-8.533333-2.844444-8.533333-2.844444-8.533333l369.777777 2.844444z m0 1021.155556c5.688889 0 8.533333-2.844444 11.377778-5.688889 2.844444-2.844444 5.688889-8.533333 5.688889-11.377778V640c0-2.844444 0-5.688889-2.844444-5.688889h-5.688889l-122.311111 122.311111-164.977778-164.977778c-2.844444-2.844444-8.533333-5.688889-11.377778-5.688888-5.688889 0-8.533333 2.844444-11.377778 5.688888l-110.933333 110.933334c-2.844444 2.844444-5.688889 8.533333-5.688889 11.377778s2.844444 8.533333 5.688889 11.377777l164.977778 164.977778-119.466667 119.466667c-2.844444 2.844444-2.844444 2.844444 0 5.688889 0 2.844444 2.844444 2.844444 5.688889 2.844444l361.244444 5.688889z"></path></svg></button>
    <!-- 退出全屏编辑 -->
    <button style="display:none" title="退出" type="button" class="tool-button float-right" id="exitFullScreen"><svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M422.648199 431.157895c5.67313 0 8.509695-2.836565 11.346261-5.67313 2.836565-2.836565 5.67313-8.509695 5.67313-11.346261V51.058172c0-2.836565 0-5.67313-2.836565-5.67313h-5.67313L306.34903 170.193906 141.828255 5.67313C138.99169 2.836565 133.31856 0 130.481994 0c-5.67313 0-11.34626 2.836565-14.182825 5.67313L5.67313 116.299169c-2.836565 2.836565-5.67313 8.509695-5.67313 11.34626 0 5.67313 2.836565 11.34626 5.67313 14.182826L170.193906 303.512465l-119.135734 119.135734c-2.836565 2.836565-2.836565 2.836565 0 5.673131 0 2.836565 2.836565 2.836565 5.67313 2.836565h365.916897z m0 156.01108c5.67313 0 8.509695 2.836565 11.346261 5.67313 2.836565 2.836565 5.67313 8.509695 5.67313 11.346261v365.916897c0 2.836565 0 5.67313-2.836565 5.67313h-5.67313L306.34903 850.969529 141.828255 1015.490305c-2.836565 2.836565-8.509695 5.67313-11.346261 5.67313-5.67313 0-8.509695-2.836565-11.34626-5.67313L8.509695 904.864266c-5.67313-2.836565-8.509695-8.509695-8.509695-11.34626s2.836565-8.509695 5.67313-11.346261L170.193906 717.65097l-119.135734-119.135735c-2.836565-2.836565-2.836565-2.836565 0-5.67313 0-2.836565 2.836565-2.836565 5.67313-2.836565l365.916897-2.836565z m175.867036-156.01108c-5.67313 0-8.509695-2.836565-11.34626-5.67313-2.836565-2.836565-5.67313-8.509695-5.67313-11.346261V51.058172c0-2.836565 0-5.67313 2.836565-5.67313h5.67313L714.814404 170.193906 879.33518 5.67313c2.836565-2.836565 8.509695-5.67313 11.34626-5.67313 5.67313 0 8.509695 2.836565 11.346261 5.67313l110.626039 110.626039c5.67313 2.836565 8.509695 8.509695 8.509695 11.34626 0 5.67313-2.836565 8.509695-5.67313 11.346261L850.969529 303.512465l119.135734 119.135734c2.836565 2.836565 2.836565 2.836565 0 5.673131 0 2.836565-2.836565 2.836565-5.67313 2.836565H598.515235z m0 156.01108c-5.67313 0-8.509695 2.836565-11.34626 5.67313-2.836565 2.836565-5.67313 8.509695-5.67313 11.346261v365.916897c0 2.836565 0 5.67313 2.836565 5.67313h5.67313l121.972299-121.972299 164.520776 164.520776c2.836565 2.836565 8.509695 5.67313 11.34626 5.67313 5.67313 0 8.509695-2.836565 11.346261-5.67313l110.626039-110.626039c2.836565-2.836565 5.67313-8.509695 5.67313-11.34626s-2.836565-8.509695-5.67313-11.346261L850.969529 717.65097l119.135734-119.135735c2.836565-2.836565 2.836565-2.836565 0-5.67313 0-2.836565-2.836565-2.836565-5.67313-2.836565l-365.916898-2.836565z"></path></svg></button>
    <!-- 文字输入框 -->
    <textarea class="chatinput" aria-label="List description"></textarea>
    <!-- 发送按钮 -->
    <button class="send">发送</button>
</div>
```

### 输入框使用的工具栏

输入框使用的工具栏会在点击工具栏按钮后弹出。

Example（最简）：

```html
<div class="lite-chattools">
    <div style="display:none" id="emojiMart" class="lite-chatbox-tool"></div>
    <div style="display:none" id="toolMusk"></div>
</div>
```
