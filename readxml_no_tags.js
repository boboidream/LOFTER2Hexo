/*
 * Author: boboidream
 * Version: 0.2.2
 * 此版本导出不包含Tags的 md 文件，解决分类太多问题。
 */

var fs = require('fs'),
    xml2js = require('./node_modules/xml2js'),
    toMarkdown = require('./node_modules/to-markdown'),
    parser = new xml2js.Parser();

fs.readFile('LOFTER.xml', function(e, v) {

	if (! fs.existsSync('LOFTER')) {
		fs.mkdir('LOFTER');
	}

    parser.parseString(v, function(err, result) {
        for (var i = 0; i < result.lofterBlogExport.PostItem.length; i++) {
            var article = result.lofterBlogExport.PostItem[i],
            	newDate = new Date(parseInt(article.publishTime)).Format("yyyy-MM-dd hh:mm:ss"),
              index = i + 1,
              fileName = newDate.substring(0, 10) + '-' + article.title + '-' + index + '.md',
            	allWord = parseArticle(article, newDate);

            if (fileName.indexOf('/') != null) {
            	var fileName = fileName.replace(/\//, ' ');
            }

            createMD(fileName, allWord, i);
        }

    })
});

function createMD(fileName, allWord, i) {
    var fileName = fileName,
        allWord = allWord,
        i = i;

    fs.open('LOFTER/' + fileName, 'w', function(err) {
        if (err) {
            throw err;
        } else {
            fs.writeFile('LOFTER/' + fileName, allWord, function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log(i + '. Create ' + fileName + ' successfully!');
                }
            })
        }
    })
}


//parse one article
function parseArticle(article, newDate) {
    var article = article,
        newDate = newDate,
        headline = '---\n' + 'title: ' + article.title + '\n' + 'date: ' + newDate + '\n' + 'categories: 随笔' + '\n' + 'description: ' + article.tag + '\n---\n';

    if (article.content != null) {
        var content = toMarkdown(article.content.toString());
    } else if (article.photoLinks != null) {
        var text = article.photoLinks[0],
            json = JSON.parse(text),
        content = '![图片]' + '(' + json[0].small + ')';
    } else if (article.caption != null) {
        var content = toMarkdown(article.caption.toString());
    } else {
        console.log(article);
    }

    if (article.commentList == null) {
        var comments = '';
    } else {
        var comment = article.commentList[0].comment,
            comments = parseComment(comment);
    }

    var allWord = headline + content + comments;

    return allWord;
}

//parse comments
function parseComment(comment) {
    var res = '';

    for (var i = 0; i < comment.length; ++i) {
        var newDate = new Date(parseInt(comment[i].publishTime)).Format('yyyy-MM-dd hh:mm:ss'),
            item = '**' + comment[i].publisherNick + '：** ' + comment[i].content + '  *[' + newDate + ']*\n>\n';

        res += item;
    }

    return '\n\n---\n' + '>评论区：\n>' + res;
}

// 时间戳转换
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
