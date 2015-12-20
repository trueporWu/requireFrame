/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * 1.引入jquery,artTemplate等基本的函数模块
 * 2.用text.js 用文本的方式引入hostList.html
 */
define(['jquery', 'template', 'text!tpls/test/hostList.html'],
    function ($, template, hostListTpl) {

    //这个是执行的异步方法
    function getInfo() {
        //开始执行函数
        console.log("getInfo");

        //定义模版操作的对象,source为请求的模版内容,render为模版的操作句柄,tpl为页面模版的dom
        var source = hostListTpl;
        var render = template.compile(source);
        var tpl = $('#tpl');

        //ajax 请求写成promise的格式
        $.ajax({
            url: 'json/test.json',
            type: "POST",
            data: {
                json: JSON.stringify({
                    "name": "someValue"
                })
            }
        }).done(function (data) {
            var text = "name:" + data.name;
            text += "<br/>";
            text += "age:" + data.age;
            $('.lala').html(text);
            var html = render({
                list: data.hostList
            });
            tpl.html(html);
        }).fail(function () {
            console.log('请求错误');
        });
    }

    //模块返回可以是静态值,也可以是函数
    var result = {
        color: "black",
        size: "unisize",
        getInfo: getInfo
    };

    return result;

});