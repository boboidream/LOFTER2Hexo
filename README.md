# LOFTER2Hexo
一个将 LOFTER 导出的 XML 文件转换为适合 Hexo 解析的 Markdown 文件工具。

![效果图](https://github.com/boboidream/LOFTER2Hexo/blob/master/img/2016-02-26.gif)

项目地址: https://github.com/boboidream/LOFTER2Hexo

## 使用说明
### 环境配置
1. node.js : 如需安装请查看 [Node.js 下载](https://nodejs.org/en/download/)
2. [xml2js](https://www.npmjs.com/package/xml2js) : 请在终端中输入以下命令完成安装。

```
sudo npm install xml2js -g
```

3. [to-markdown](https://www.npmjs.com/package/to-markdown) : 请在终端中输入以下命令完成安装。

```
sudo npm install to-markdown -g
```

### 执行程序
1. 将 LOFTER 导出的 XML 文件命名为:`LOFTER.xml`
2. 将 readxml.js 与 `LOFTER.xml` 放于同一文件夹
3. 打开终端，`cd` 至当前目录，运行 `node readxml.js`

### 成功
1. 在 `Terminal` 中打印出生成日志
2. 在当前文件夹新建 `LOFTER` 文件夹，并将生成 Markdown 文件放置其中

## 可能出现的问题
1. `Cannot find module '/usr/local/lib/node_modules/xml2js'`

 请将 `readxml.js` 程序中 `/usr/local/lib/node_modules/xml2js` 改为自己的 `xml2js` 的安装目录。

```
    xml2js = require('/usr/local/lib/node_modules/xml2js'),
    toMarkdown = require('/usr/local/lib/node_modules/to-markdown'),
```

2. `Cannot find module '/usr/local/lib/node_modules/to-markdown'`

  请将 `readxml.js` 程序中 `/usr/local/lib/node_modules/to-markdown` 改为自己的 `to-markdown` 的安装目录。

```
版本说明:
2016.02.26 发布
```