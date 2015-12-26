/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * 1.引入jquery,artTemplate等基本的函数模块
 * 2.用text.js 用文本的方式引入hostList.html
 * 测试本地链接的模块
 */
define(['jquery'],
    function ($) {

        //模块返回可以是静态值,也可以是函数
        var author = {
            color: "black",
            size: "unisize",
            init: function () {
                //console.log("author");
                var context = $('context');
                require(['text!tpls/pub/context.html'], function (tpl) {
                    // some code
                    context.html(tpl);
                    context.append("<br\><span>author</span>");
                });

            }
        };
        return author;
    });