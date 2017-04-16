# LOFTER2Hexo
一个将 LOFTER 导出的 XML 文件转换为适合 Hexo 解析的 Markdown 文件工具。

![效果图](https://github.com/boboidream/LOFTER2Hexo/blob/master/img/2016-02-26.gif)

项目地址: https://github.com/boboidream/LOFTER2Hexo

## 使用说明

### 环境配置
1. node.js : 如需安装请查看 [Node.js 下载](https://nodejs.org/en/download/)

2. 安装项目
  ```
  sudo npm install lofter2hexo -g
  ```

### 使用程序

1. 将 LOFTER 导出的 XML 文件命名为: `LOFTER.xml`

2. 打开终端，`cd` 至 `LOFTER.xml` 所在文件夹，运行 `readxml`

### 运行结果

1. 在 `Terminal` 中会打印日志

2. 生成 `LOFTER` 文件夹，包含所有 Markdown 文件

### 参数说明
```
  Usage: readxml [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -i, --input <lang>   xml 文件路径，例如：`/Volumes/私人/Github/test.xml`
    -n, --notag          头部不生成 tags 标签（以避免生成太多 `Tags` 造成的不美观）
    -j, --jekyll         导出 jekyll 格式 Markdown 文件
    -a, --author <lang>  设置 jekyll 格式 Markdown 头部 author
```

- 命令举例
```bash
readxml -i ./Github/test.xml -n # 解析路径为 `./Github/test.xml` 文件，生成 Markdown 文件不带 Tags 标签
readxml -n -j -a boboidream # 解析当前目录下 LOFTER.xml 文件，生成不带 Tags 标签的 Jekyll 格式 Markdown 文件，头部 author: boboidream
```

## 其他说明
【已修复】有些朋友留言说，导出 Markdown 文件为空的问题，本人未测试出问题。希望有问题的朋友能提供下运行环境和终端日志，以便尽快修复问题，感谢！


```
版本说明:
2017.04.16 做成 node 命令行工具，发布到 npm
2017.03.20 支持下载图片到本地 `./LOFTER/img` 文件夹，更改生成 md 中图片路径。
2016.07.31 感谢 「屠夫9441」反馈bug，修复名称相同文件覆盖问题。
2016.06.28 感谢 「Teng」反馈 bug，修复 音乐文件引起的 Okb 问题，并支持导出 jekyll 所用md格式
2016.06.26 配置了 package.json文件，并将依赖文件直接放置于项目中，简化使用步骤
2016.02.26 发布
```
