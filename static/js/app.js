/**
 * Created by Truepor on 15/12/17.
 * 配置入口
 */
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        jquery: 'jquery/1.9.1/jquery-1.9.1.min',
        template: 'artTemplate/template-native',
        tpls: '../../tpls',
        director:'director.min',
    }
});


/**
 * 入口函数
 */
require(['app/router','app/menu'], function (router, menu) {
    // some code
    //sub.getInfo();
    menu.initMenu();
    router.routerHandle();

});