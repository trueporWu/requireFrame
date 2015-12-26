/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * 1.引入jquery,artTemplate等基本的函数模块
 * 2.用text.js 用文本的方式引入hostList.html
 */
define(['jquery', 'app/aes'],
    function ($, aes) {

        //模块返回可以是静态值,也可以是函数
        var blank = {
            init: function () {
                console.log("iframe");
                var context = $('context');
                context.html(tpl);
                context.append("<br\><span>author</span>");
            },
            handleBlank: function (url) {
                var r_url = decodeURIComponent(url);
                r_url = aes.decrypted(r_url);
                //window.location.href=r_url;
            }
        };
        return blank;
    });