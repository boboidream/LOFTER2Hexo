# LOFTER2Hexo
一个将 LOFTER 导出的 XML 文件转换为适合 Hexo 解析的 Markdown 文件工具。

![效果图](https://github.com/boboidream/LOFTER2Hexo/blob/master/img/2016-02-26.gif)

项目地址: https://github.com/boboidream/LOFTER2Hexo

## 使用说明
### 环境配置
1. node.js : 如需安装请查看 [Node.js 下载](https://nodejs.org/en/download/)

2. 克隆本项目
  ```
  git clone git@github.com:boboidream/LOFTER2Hexo.git
  npm install
  ```

### 使用程序

1. 将 LOFTER 导出的 XML 文件命名为:`LOFTER.xml`，

2. 替换项目文件夹（LOFTER2Hexo）中 `LOFTER.xml` 测试文件 (备注：可用测试文件跑一次，看是否成功)

3. 打开终端，`cd` 至项目文件夹（LOFTER2Hexo），运行 `node readxml` (备注：如不需要生成标签，运行：`node readxml_no_tags`)

### 运行结果

1. 在 `Terminal` 中会打印日志

2. 生成 `LOFTER` 文件夹，包含所有 Markdown 文件

## 其他说明

1. `node readxml_no_tags`

  此程序将 LOFTER 中的 `Tags` ，解析为Markdown文件里 `description` 内容，以避免生成太多 `Tags` 造成的不美观。

2. 【已修复】有些朋友留言说，导出 Markdown 文件为空的问题，本人未测试出问题。希望有问题的朋友能提供下运行环境和终端日志，以便尽快修复问题，感谢！

3. 使用 `node to_jekll` 时，可以在 to_jekll 文件顶部修改 author 名称


```
版本说明:
2017.03.20 支持下载图片到本地 `./LOFTER/img` 文件夹，更改生成 md 中图片路径。
2016.07.31 感谢 「屠夫9441」反馈bug，修复名称相同文件覆盖问题。
2016.06.28 感谢 「Teng」反馈 bug，修复 音乐文件引起的 Okb 问题，并支持导出 Jekll 所用md格式
2016.06.26 配置了 package.json文件，并将依赖文件直接放置于项目中，简化使用步骤
2016.02.26 发布
```
