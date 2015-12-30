/**
 * Created by Truepor on 15/12/23.
 * 加载目录的js
 * 依赖jquery,template,director
 * aes.js 做加密算法
 */


define(['jquery', 'template', 'director', 'app/aes'],
    function ($, template, director, aes) {


        //模块返回可以是静态值,也可以是函数
        var menu = {
            /**
             * 初始化目录
             */
            menuFlag: 0,
            menuHash: {},
            menuDom: $('menu'),
            upIcon: "icon-chevron-up",
            downIcon: "icon-chevron-down",
            plusIcon: "icon-plus",
            minusIcon: "icon-minus",
            menuIconList: [
                "icon-dashboard",
                "icon-sitemap",
                "icon-headphones",
                "icon-comments",
                "icon-cogs",
                "icon-group",
                "icon-external-link"
            ],
            menuIconDefult: "icon-th-large",
            /**
             * 初始化菜单
             */
            initMenu: function () {
                //menu.createMenuHash();
                //加载菜单
                require(['text!tpls/pub/menu.html'], function (menuTpl) {

                    //ajax 请求写成promise的格式
                    $.ajax({
                        url: 'json/getMenuList.json',
                        type: "GET"
                    }).done(function (data) {
                        var root = data.root;
                        root = menu.handleMenuList(root);
                        var menuRender = template.compile(menuTpl);
                        var menuHtml = menuRender({menuList: root});
                        menu.menuDom.html(menuHtml);

                        //绑定顶层菜单的点击事件
                        var topMenu = $('.top-menu');
                        topMenu.on("click", function () {
                            menu.topMenuClick(this);
                        });

                        //绑定第一层子菜单的点击事件
                        var subItem = $('.sub-item');
                        subItem.on("click", function () {
                            menu.subItemClick(this);
                        })

                    }).fail(function () {
                        console.log('请求菜单错误');
                    });

                });
            },
            /**
             *
             * 处理菜单目录
             * @param menuArr 传入菜单的数组,将菜单处理成匹配模版的数据模式
             * @returns {*}
             */
            handleMenuList: function (menuArr) {

                //修改菜单的状态标记,标记成已经加载
                menu.menuFlag = 1;
                var resultArr = $.extend(true,[],menuArr);
                //判断数组长度
                if (resultArr.length > 0) {

                    //遍历第一层菜单
                    resultArr.forEach(function (child, index) {
                        child.id = "top" + index;
                        if (menu.menuIconList[index]) {
                            child.icon = menu.menuIconList[index];
                        } else {
                            child.icon = menu.menuIconDefult;
                        }
                        var childrenArr = child.children;
                        if (childrenArr.length > 0) {
                            childrenArr.forEach(function (sub, index) {
                                if (sub.hasOwnProperty('url')) {
                                    var id = aes.encrypted(sub.name) + index;
                                    //删除字符串中的特殊字符
                                    id = id.replace(/(\+)|(\=)|(\\)/g, "");
                                    sub.mid = id;
                                    //如果是blank的话,直接赋值当前的URL
                                    if ('iframe' == sub.urlType) {
                                        var tmpUrl = sub.url;
                                        tmpUrl = aes.encrypted(tmpUrl);
                                        tmpUrl = encodeURIComponent(tmpUrl);
                                        tmpUrl = '#/' + sub.urlType + '/' + tmpUrl;
                                        sub.url = tmpUrl;
                                        menu.menuHash[sub.url] = sub.mid;
                                    }else if('blank'==sub.urlType){
                                        //空白链接不做处理
                                    }else{ //本地链接的处理方法
                                        sub.url = '#/' + sub.url ;
                                        menu.menuHash[sub.url] = sub.mid;
                                    }

                                } else {
                                    if (sub.hasOwnProperty('children')) {
                                        var thirdArr = sub.children;
                                        if (thirdArr.length > 0) {
                                            thirdArr.forEach(function (third, index) {
                                                var tId = aes.encrypted(third.name) + index;
                                                tId = tId.replace(/(\+)|(\=)|(\\)/g, "");
                                                third.mid = tId;
                                                if ('blank' == third.urlType) {
                                                    var tUrl = third.url;
                                                    tUrl = aes.encrypted(tUrl);
                                                    tUrl = encodeURIComponent(tUrl);
                                                    tUrl = '#/'+ third.urlType +'/' + tUrl;
                                                    third.url = tUrl;
                                                    menu.menuHash[third.url] = third.mid;
                                                }else if('blank' == third.urlType){
                                                    //空白链接不做处理
                                                }else{ //本地链接的处理方法
                                                    third.url = '#/' + third.url;
                                                    menu.menuHash[third.url] = third.mid;
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
                return resultArr;
            },
            /**
             * 顶层菜单点击事件
             * @param obj 顶层菜单的元素
             */
            topMenuClick: function (obj) {
                //取得当前菜单的id
                var id = $(obj).attr('id');

                //找到下一层的菜单
                var subId = $(obj).attr('data-target');
                var subMenu = $(subId);

                //处理其他的菜单
                menu.handOtherTopMenu(id);

                var objIcon = $(obj).find('.top-icon');
                if (objIcon.hasClass(menu.upIcon)) {
                    objIcon.removeClass(menu.upIcon);
                    objIcon.addClass(menu.downIcon);
                    //显示子菜单
                    menu.toggleSubMenuActive(subMenu, 1);
                } else {
                    objIcon.removeClass(menu.downIcon);
                    objIcon.addClass(menu.upIcon);
                    //隐藏子菜单
                    menu.toggleSubMenuActive(subMenu, 0);
                }

            },
            /**
             * 激活顶层菜单
             */
            activeTopMenu: function (obj) {
                //取得当前菜单的id
                var id = obj.attr('id');
                //判断是否存在
                if ('undefined' != typeof(id)) {
                    //处理其他的菜单
                    //menu.enableAllItem();
                    menu.handOtherTopMenu(id);
                    if ("thirdmenu" == id.split('_')[0]) {
                        var subItem = obj.prev();
                        var itemIcon = subItem.find('.item-icon');
                        var target = subItem.attr('data-target');
                        var thridMenu = $(target);
                        if (itemIcon.hasClass(menu.plusIcon)) {
                            itemIcon.removeClass(menu.plusIcon);
                            itemIcon.addClass(menu.minusIcon);
                            //显示子菜单
                            menu.toggleThirdMenuActive(thridMenu, 1);
                        }
                        //展开上级菜单
                        var subMenu = subItem.parent();
                        var topMenu = subMenu.prev();
                        var objIcon = topMenu.find('.top-icon');
                        if (objIcon.hasClass(menu.upIcon)) {
                            objIcon.removeClass(menu.upIcon);
                            objIcon.addClass(menu.downIcon);
                            //显示子菜单
                            menu.toggleSubMenuActive(subMenu, 1);
                        }

                    } else {//二级菜单展开
                        var topMenu = obj.prev();
                        //找到下一层的菜单
                        var subId = topMenu.attr('data-target');
                        var subMenu = $(subId);

                        var objIcon = topMenu.find('.top-icon');
                        if (objIcon.hasClass(menu.upIcon)) {
                            objIcon.removeClass(menu.upIcon);
                            objIcon.addClass(menu.downIcon);
                            //显示子菜单
                            menu.toggleSubMenuActive(subMenu, 1);
                        }
                    }


                }

            },
            /**
             * 处理非ID所在的其他TopMenu
             * @param id
             */
            handOtherTopMenu: function (id) {
                $(".top-menu").each(function (i, n) {
                    var top = $(n);
                    var topId = top.attr('id');
                    if (topId != id) {
                        var icon = top.find('.top-icon');
                        if (!icon.hasClass(menu.upIcon)) {
                            icon.removeClass(menu.downIcon);
                            icon.addClass(menu.upIcon);
                        }
                        //找到下一层的菜单
                        var subId = top.attr('data-target');
                        var subMenu = $(subId);
                        //隐藏子菜单
                        menu.toggleSubMenuActive(subMenu, 0);
                    }
                });
            },
            /**
             * 处理一级子菜单
             * @param subMenu
             * @param type 1 为显示 ,0 为隐藏
             */
            toggleSubMenuActive: function (subMenu, type) {
                if (1 == type) {
                    if (!subMenu.hasClass('active')) {
                        subMenu.addClass('active');
                    }
                } else {
                    if (subMenu.hasClass('active')) {
                        subMenu.removeClass('active');
                    }
                }
            },
            /**
             * 第一层子菜单的点击事件
             * @param obj
             */
            subItemClick: function (obj) {
                var subItem = $(obj);
                //判断是否有下级菜单
                var target = subItem.attr('data-target');
                if ("#" != target) {
                    var thridMenu = $(target);
                    var itemIcon = subItem.find('.item-icon');
                    if (itemIcon.hasClass(menu.plusIcon)) {
                        itemIcon.removeClass(menu.plusIcon);
                        itemIcon.addClass(menu.minusIcon);
                        //显示子菜单
                        menu.toggleThirdMenuActive(thridMenu, 1);
                    } else {
                        itemIcon.removeClass(menu.minusIcon);
                        itemIcon.addClass(menu.plusIcon);
                        //隐藏子菜单
                        menu.toggleThirdMenuActive(thridMenu, 0);
                    }

                }
            },
            /**
             * 处理二级子菜单
             */
            toggleThirdMenuActive: function (thridMenu, type) {
                if (1 == type) {
                    if (!thridMenu.hasClass('active')) {
                        thridMenu.addClass('active');
                    }
                } else {
                    if (thridMenu.hasClass('active')) {
                        thridMenu.removeClass('active');
                    }
                }
            },
            /**
             * 激活item
             */
            activeItemById: function (id) {
                var item = $('#' + id);
                if (!item.hasClass('active')) {
                    item.addClass('active');
                }
                //console.log(item[0]);
                menu.handleOtherSubMenuItem(id);
            },
            /**
             * 处理其他的subMenuItem
             */
            handleOtherSubMenuItem: function (id) {
                $(".item").each(function (i, n) {
                    var subItem = $(n);
                    var subItemId = subItem.attr('id');
                    if (subItemId != id) {
                        var target = subItem.attr('data-target');
                        if ("#" == target) {
                            subItem.removeClass('active');
                        }
                    }
                });
            },
            /**
             * 路由变化的时候调用的函数
             */
            historyUrl:"",
            onRouterChange: function () {
                var urlHash = window.location.hash;
                if(urlHash!=menu.historyUrl){
                    menu.handleItemByUrlHash(urlHash);
                    menu.historyUrl = urlHash;
                }
                //console.log(urlHash);
            },
            /**
             * 通过urlHash取得目录的ID
             */
            handleItemByUrlHash: function (urlHash) {

                if (0 == menu.menuFlag) {
                    setTimeout(function () {
                        menu.handleItemByUrlHash(urlHash);
                    }, 100);
                } else {
                    var itemId = menu.menuHash[urlHash];
                    menu.activeItemById(itemId);
                    var itemParent = $('#' + itemId).parent().parent();
                    menu.activeTopMenu(itemParent);
                }
            }
        };

        return menu;

    });
