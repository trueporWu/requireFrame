/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * 1.引入jquery,artTemplate等基本的函数模块
 * 2.主要用来处理iframe引入页面的情况
 */
define(['jquery', 'text!tpls/pub/iframeTpl.html', 'template', 'app/aes'],
    function ($, tpl, template, aes) {

        //取得高度
        window.getHeight= function(){
            if(window.innerHeight!= undefined){
                return window.innerHeight;
            }
            else{
                var B= document.body, D= document.documentElement;
                return Math.min(D.clientHeight, B.clientHeight);
            }
        };

        //当页面大小改变的时候,重新布局iframe的高度
        $(window).resize(function(){
            iframe.autoheight();
        });

        //定时器,改变页面的高度
        var timer1 = setInterval(function(){
            iframe.autoheight();
        },500);

        //模块返回可以是静态值,也可以是函数
        var iframe = {
            init: function () {
                console.log("iframe");
            },
            timer: "",
            /**
             * 处理iframe的链接
             * @param url
             */
            handleIframe: function (url) {
                var r_url = decodeURIComponent(url);
                r_url = aes.decrypted(r_url);
                var context = $('context');
                var iframeRender = template.compile(tpl);
                var iframeHtml = iframeRender({url: r_url});
                context.html(iframeHtml);
                var main = $(window.parent.document).find("#main");
                main.load(function () {
                    //调整高度
                    iframe.autoheight();
                });
            },
            /**
             * 自动调整高度
             */
            autoheight: function () {
                var k = $(window).height();
                var p = $(window).width();
                var m = k+100;
                var l = p - 180;
                if (k < 800) {

                    if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
                        $('body').css({height: m + "px"});
                        $("#contentIframe").css({height: m + "px"});

                    } else {
                        $('body').css({height: m + "px"});
                        $("#contentIframe").css({height: m + "px"});
                    }
                } else {
                    $('body').css({height: m + "px"});
                    $("#contentIframe").css({height: m + "px"});
                    $("#contentIframe").css({height: m + "px"});
                }
            }
        };
        return iframe;
    });