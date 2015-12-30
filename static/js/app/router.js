/**
 * Created by Truepor on 15/12/23.
 * 基于directorjs,做路由
 * 依赖jquery,directorjs,arttemplatejs
 * 依赖menu.js,当路由有变化的时候,更新item的选中状态
 */

define(['jquery', 'director', 'template', 'app/menu'], function ($, director, template, menu) {

    /**
     * 路由配置
     * 1.path: 为路由的路径
     * 2.name: 为处理js模块的名称,这个模块的js要放在js/app的下面
     * 3.handle: 如果没有,则URl点击的时候默认调用对应js模块的init方法,如果写了,则使用handle指定的方法.
     * 4.例子:
     * {
            path: '/books',
            name: 'books'  -----------------> url'/books' 调用js/app/books.js的init()方法
        }, {
            path: '/books/view/:bookId',
            name: 'books',
            handle: 'viewBook' -----------------> url'/books/view/:bookId' 调用js/app/books.js的viewBook方法
        }
     *
     */
    var urlConfig = [
        {
            path: '/author',
            name: 'author'
        }, {
            path: '/books',
            name: 'books'
        }, {
            path: '/serverMenu',
            name: 'serverMenu'
        }, {
            path: '/books/view/:bookId',
            name: 'books',
            handle: 'viewBook'
        }, {
            path: '/iframe/:url',
            name: 'iframe',
            handle: 'handleIframe'
        }, {
            path: '/blank/:url',
            name: 'blank',
            handle: 'handleBlank'
        }, {
            path: '/handleFormPage/:params',
            name: 'handleFormPage',
            handle: 'handleForm'
        }
    ];

    /**
     * 路由处理,基于directorJS
     */

    var router = {
        routes: {},//路由变量
        rt: null,
        /**
         * 根据路由配置注册路由
         */
        routerHandle: function () {
            console.log("router handler");
            if (urlConfig.length > 0) {
                //遍历注册每个url
                urlConfig.forEach(function (app) {
                    var path = app.path;
                    var name = app.name;
                    //如果配了handle参数,则直接使用handle方法
                    if (app.handle) {
                        //require(['app/' + name], function (obj) {
                        //    //回写处理这个路由的处理函数
                        //    router.updateRouter(router.routes, path, obj[app.handle]);
                        //    console.log(router.rt);
                        //});
                        //由动态注册改成静态生成.避免初始化加载的时候没有这个目录
                        router.routes[path] = function (params) {
                            require(['app/' + name], function (obj) {
                                obj[app.handle](params);
                            });
                        };

                    } else {//如果不配handle参数,则直接使用init方法
                        router.routes[path] = function () {
                            require(['app/' + name], function (obj) {
                                obj.init();
                            });
                        };

                    }
                });
                router.routeInit();
            }
        },
        /**
         * 更新路由变量
         * @param routes
         * @param key
         * @param fn
         */
        updateRouter: function (routes, key, fn) {
            //即时注册路由
            router.rt.on(key, fn);

        },
        /**
         * 初始化路由
         */
        historyUrlHash: "",
        routeInit: function () {
            var option = {
                //每次命中路由的时候,执行的函数
                on: function () {
                    var urlHash = window.location.hash;
                    if (router.historyUrlHash != urlHash) {
                        menu.onRouterChange();
                        router.historyUrlHash = urlHash;
                    }
                }
            };
            router.rt = Router(router.routes).configure(option);
            router.rt.init();
        }
    };

    return router;
});
