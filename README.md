## 轻网页聊天框架

![演示](https://i.loli.net/2018/12/08/5c0bba10d25da.png)


[~~性感聊天在线观看~~（在线演示）](https://lab.morfans.cn/LiteWebChat_Frame/chat_example.html)

[本框架](https://github.com/MorFansLab/LiteWebChat_Frame) 大部分聊天对话所要求的特性已完成，能够助你快速开发聊天类对话界面

## 使用 ~~指南~~ (指北)

### 安装

我们仅提供了两种方式来获取 LiteWebChat_Frame， ~~但你可以通过各种奇淫技巧获取使用。~~

#### 下载文件

你可以直接从 GayHub 项目 [官网](https://github.com/MorFansLab/LiteWebChat_Frame) 直接克隆下载，其中包含了压缩过的和未压缩过的 CSS 和 一个例子文件，以及图片文件。

#### 直接引用

```html
<link type="text/css" href="https://lab.morfans.cn/LiteWebChat_Frame/litewebchat.min.css" rel="stylesheet" />
```

或

```html
<link type="text/css" href="https://lab.morfans.cn/LiteWebChat_Frame/litewebchat.css" rel="stylesheet" />
```

#### 创建容器

```html
<div class="lite-chatbox">
...
</div>
```

### 兼容性

兼容 Edge和其他主流浏览器的最新版本。

对于IE浏览器请微修改右对话气泡背景即可使用

[参考](http://browsershots.org/https://lab.morfans.cn/LiteWebChat_Frame/chat_example.html) 

## 组件

### 聊天气泡

![气泡](https://i.loli.net/2018/12/08/5c0bc50bd0674.png)

组件（类名） | Class 附加类名 / 备注
--- |---
聊天气泡组件（cmsg）|cleft（左边） / cright（右边）
头像 (headIcon)| 默认方形 / radius（圆形头像）
头衔 （htitle）| 默认成员头衔 / admin（管理头衔） / owner（群主头衔）
名称（name）| 为空使用 ‘&amp;nbsp;’ 
聊天内容（content）| -

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

类名 | 效果
--- |---
tips|正常
tips-primary|首要的提示
tips-success|成功提示
tips-info|信息提示
tips-warning|警告提示
tips-danger|错误/危险提示

Example:

```html
    <div class="tips">
        <span class="tips-danger">系统消息：左/右边长消息被管理员批判一番……</span>
    </div>

    <div class="tips">
        <span>系统消息：normal</span>
    </div>
```

