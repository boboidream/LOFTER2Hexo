/*
 * Author: boboidream
 * Version: 0.3.0
 * Update: 20170415
 */

var fs = require('fs'),
    xml2js = require('./node_modules/xml2js'),
    toMarkdown = require('./node_modules/to-markdown'),
    parser = new xml2js.Parser(),
    image_downloader = require('image-downloader')

var argv = require('yargs').boolean(['notag', 'jekll']),
    file = process.argv[2],
    author = argv.author || ''


var lofter2hexo = {
    run: function() {
        var lib = this.lib,
            postArray = []

        lib.initDir()
        postArray = lib.getPostArray(file)
        parsePost(postArray, lib.parseArticle, lib.createMD)
    },
    lib: {
        initDir: function() {
            if (!fs.existsSync('./LOFTER')) {
                fs.mkdirSync('./LOFTER', 0755)
            }
            if (!fs.existsSync('./LOFTER/img')) {
                fs.mkdirSync('./LOFTER/img', 0755)
            }
        },
        getPostArray: function(file) {
            fs.readFile(file, function(err, data) {
                parser.parseString(data, function(error, result) {
                    return result.lofterBlogExport.PostItem
                })
            })
        },
        parsePost: function(postArray, parseArticle, createMD) {
            postArray.forEach(function(article, index) {
                var newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss"),
                    fileName = newDate.substring(0, 10) + '-' + article.title + '-' + ++index + '.md',
                    allWord = parseArticle(article)
                
                if (fileName.indexOf('/') != null) {
                    var fileName = fileName.replace(/\//, ' ');
                }

                createMD(fileName, allWord, index);
            })
        },
        createMD: function(fileName, allWord, i) {
            fs.open('LOFTER/' + fileName, 'w', function(err) {
                if (err) throw err;
                    
                fs.writeFile('LOFTER/' + fileName, allWord, function(err) {
                    if (err) throw err;
                    console.log(i + '. Create ' + fileName + ' successfully!');
                })
            })
        },
        parseArticle: parseArticle
    }
}

// parse one artical
function parseArtical(artical) {
    var _parparseHeader,
        _parseContent,
        _parseComment,
        _downloadImg,
        headline = '',
        content = '',
        comment = '',
        newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss")
    
    _parseHeader = function() {
        var tags = argv.noimg ? '' : artical.tag,
            newDate = newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss")
            
            if (argv.jekll) {
                if (tags) {
                    tagArray = tags.split(','),
                    tags = ''

                for (var i in tags){
                    res += '    - ' + tags[i] + '\n';
                }
                }

                headline =  '---\n' +
                            'layout: post\n' +
                            'title: "' + article.title + '"\n' +
                            'date: ' + newDate + '\n' +
                            'author: "' + author + '"\n' +
                            'catalog: 随笔' + '\n' +
                            'tags: \n' + tags + '\n---\n'
            } else {

                headline = '---\n' + 'title: ' + article.title + '\n' +
                        'date: ' + newDate + '\n' +
                        'categories: 随笔' + '\n' + 
                        'tags: [' + tags + ']\n---\n'
            }

            return headline
    }

    _parseContent = function() {
        if (article.content) {
            var imgArray = []

            content = toMarkdown(article.content.toString())
            imgArray = content.match(/!\[.*?\]\((.*?)\)/g)

            if (imgArray && imgArray.length) {
                imgArray.forEach(function(imgURL) {
                    imgURL = imgURL.match(/http.*\.jpg|http.*\.jpeg|http.*\.png/)[0]
                    console.log(imgURL)
                    content = content.replace(/!\[(.*?)\]\((.*?)\)/, function(whole, imgName, url) {
                        console.log(url)
                        return `![${imgName}](./${url.split('/').pop()})`
                    })
                
                    _downloadImg(imgURL, imgName)
                })
            }
        } else if (article.photoLinks != null) {

            var text = article.photoLinks[0],
                json = JSON.parse(text)

            content = '![图片]' + '(' + json[0].small + ')'

        } else if (article.caption != null) {

            content = toMarkdown(article.caption.toString());

        } else {
            console.log(article);
        }

        return content
    }

    _parseComment = function(comment) {
            var res = '';

            for (var i = 0; i < comment.length; ++i) {
                var newDate = new Date(parseInt(comment[i].publishTime)).Format('yyyy-MM-dd hh:mm:ss'),
                    item = '**' + comment[i].publisherNick + '：** ' + comment[i].content + '  *[' + newDate + ']*\n>\n';

                res += item;
            }

            return '\n---\n' + '>评论区：\n>' + res;
        }

    _downloadImg = function(imgURL, imgName) {
             image_downloader({
                url: imgURL,
                dest: './LOFTER/img',
                done: function(err, imgName, image) {
                    if (err) {
                        throw err
                    }
                    console.log('Image saved to ./LOFTER/img/', filename)
                }
            })
        }
        
    return _parseHeader() + _parseContent() + _parseComment()
}


// Date format
Date.prototype.Format = function(fmt) { //author: meizz
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