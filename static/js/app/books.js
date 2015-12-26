/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * 1.引入jquery,artTemplate等基本的函数模块
 * 2.用text.js 用文本的方式引入hostList.html
 */
define(['jquery', 'text!tpls/pub/context.html'],
    function ($, tpl) {

        //模块返回可以是静态值,也可以是函数
        var books = {
            init: function (handle) {
                if ("undefined" == typeof(handle)) {
                    //console.log("books");
                    // some code
                    var context = $('context');
                    context.html(tpl);
                    context.append("<br\><span><a href='#/books/view/1'>books</a></span>");
                } else {
                    //console.log(handle);
                }
            },
            viewBook: function (bookId) {
                //console.log("viewBook: bookId is populated: " + bookId);
                // some code
                var context = $('context');
                context.html(tpl);
                context.append("<br\><span>New viewBook: bookId is populated: " + bookId + "</span>");
            }
        };
        return books;
    });