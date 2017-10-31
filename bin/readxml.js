#! /usr/bin/env node

/*
 * Author: boboidream
 * Version: 2.0.3
 * Update: 20170415
 */

var fs = require('fs'),
    xml2js = require('/usr/local/lib/node_modules/xml2js'),
    toMarkdown = require('/usr/local/lib/node_modules/to-markdown'),
    parser = new xml2js.Parser(),
    image_downloader = require('/usr/local/lib/node_modules/image-downloader'),
    argv = require('/usr/local/lib/node_modules/commander')

// init commander
argv.version('2.0.3')
    .usage('[options]')
    .option('-i, --input <lang>', 'lofter xml file')
    .option('-n, --notag', 'Without tags')
    .option('-j, --jekyll', 'jekyll type')
    .option('-a, --author <lang>', 'set author in header in jekyll type')
    .parse(process.argv)

// init path
var path = require('path'),
    cwd = process.cwd(),
    outputFilePath = path.resolve(cwd, 'LOFTER'),
    file = argv.input || path.resolve(cwd, 'noname.xml'),
    author = argv.author || ''

if (!fs.existsSync(outputFilePath)) {
    fs.mkdirSync(outputFilePath, 0755)
}
// main object
var lofter2hexo = {
    run: function() {
        var lib = this.lib

        lib.getPostArray(file, function(postArray) {
            lib.parsePost(postArray , lib.parseArticle, lib.createMD)
        })
    },
    lib: {
        getPostArray: function(file, callback) {
            fs.readFile(file, function(err, data) {

                if(err) {
                    console.error(`读取文件 ${file} 出错：`, err)
                    return
                }

                parser.parseString(data, function(error, result) {
                    callback(result.lofterBlogExport.PostItem)
                })
            })
        },
        parsePost: function(postArray, parseArticle, createMD) {
            postArray.forEach(function(article, index) {
                var newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss"),
                    fileName = newDate.substring(0, 10) + '-' + (article.title || '无题') + '.md',
                    allWord = parseArticle(article)

                if (fileName.indexOf('/') != null) {
                    var fileName = fileName.replace(/\//, ' ');
                }

                createMD(fileName, allWord, index);
            })
        },
        createMD: function(fileName, allWord, i) {
            fs.open(path.resolve(outputFilePath, fileName), 'w', function(err) {
                if (err) throw err;

                fs.writeFile(path.resolve(outputFilePath, fileName), allWord, function(err) {
                    if (err) throw err;
                    console.log(i + '. Create ' + fileName + ' successfully!');
                })
            })
        },
        parseArticle: parsearticle
    }
}


// parse one article
function parsearticle(article) {
    var _parparseHeader,
        _parseContent,
        _parseComment,
        _downloadImg,
        headline = '',
        content = '',
        comments = '',
        newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss")

    _parseHeader = function() {
        var tags = argv.notag ? '' : article.tag,
            newDate = newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss")

            if (argv.jekyll) {
                var res = ''
                if (tags) {
                    tags.forEach(function(tag) {
                        res += '    - ' + tag + '\n';
                    })
                }

                headline =  '---\n' +
                            'layout: post\n' +
                            'title: "' + (article.title || '无题') + '"\n' +
                            'date: ' + newDate + '\n' +
                            'author: "' + author + '"\n' +
                            'catalog: 随笔' + '\n' +
                            'tags: \n' + res + '\n---\n'
            } else {

                headline = '---\n' + 'title: ' + (article.title || '无题') + '\n' +
                        'date: ' + newDate + '\n' +
                        'categories: 随笔' + '\n' +
                        'tags: [' + tags + ']\n\n---\n'
            }

            return headline
    }

    _parseContent = function() {
        if (article.content) {
            var imgArray = []

            content = toMarkdown(article.content.toString(), {converters: [{
                filter: 'br',
                replacement: function(innerHTML, code) {
                  return '<br /><br />'
                }
              }]
            })
            imgArray = content.match(/!\[.*?\]\((.*?)\)/g)

            if (imgArray && imgArray.length) {
                imgArray.forEach(function(imgURL) {
                    imgURL = imgURL.match(/http.*\.jpg|http.*\.jpeg|http.*\.gif|http.*\.png/)
                    if (imgURL) {
                      content = content.replace(/!\[(.*?)\]\((.*?)\)/g, function(whole, imgName, url) {
                          _downloadImg(imgURL[0], imgName, (article.title || '无题'))
                          return `![${imgName}](${imgURL[0].split('/').pop()})`
                      })
                    }
                })
            }
        } else if (article.photoLinks != null) {
            var text = article.photoLinks[0],
                imgArray = JSON.parse(text)

            imgArray.forEach(function(img) {
                var imgName = img.small.split('/').pop(),
                    imgURL = img.small

                content += '![图片]' + '(' + imgName + ')\n'
                _downloadImg(imgURL, imgName, (article.title || '无题'))
            })

        } else if (article.caption != null) {

            content = toMarkdown(article.caption.toString());

        } else {
            console.log(article);
        }

        return content
    }

    _parseComment = function() {
        if (article.commentList == null) {
            return comments
        }
        var comment = article.commentList[0].comment

        for (var i = 0; i < comment.length; ++i) {
            var newDate = new Date(parseInt(comment[i].publishTime)).Format('yyyy-MM-dd hh:mm:ss'),
                item = '**' + comment[i].publisherNick + '：** ' + comment[i].content + '  *[' + newDate + ']*\n>\n';

            comments += item;
        }

        return '\n---\n' + '>评论区：\n>' + comments;
    }

    _downloadImg = function(imgURL, imgName, title) {
              var imagePath = path.resolve(cwd, 'LOFTER/' + newDate.substring(0, 10) + '-' + title)
              if (!fs.existsSync(imagePath)) {
                  fs.mkdirSync(imagePath, 0755)
              }
             image_downloader({
                url: imgURL,
                dest: imagePath,
                done: function(err, imgName, image) {
                    if (err) {
                        console.log(err)
                    }
                    console.log('Image saved to ', imgName)
                }
            })
        }

    return _parseHeader() + _parseContent() + _parseComment()
}


// Date format author: meizz
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


lofter2hexo.run()
