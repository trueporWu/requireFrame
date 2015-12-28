# requireFrame
## 基本插件
### requireJS： 用来做代码AMD的框架
### artTemplate：静态页面模版，语法和jsp很像
### Bootstrap：前端布局框架
### jquery 
### directorJS: 路由控制
### textjs：requireJS的插件，用文本的模式加载文件


# itsm-web

标签(itms-web):拆分itms的前端

---

### 基本框架

#### requireJS
- 说明： 作为前端模块化的骨架
- DocURI: http://requirejs.cn

#### jquery
- 作为dom操作类库

#### directorJS
- 作为项目的路由框架

#### artTemplateJS
- 作为项目的模版框架,类似于与JSP的书写语法

#### text.js
- requireJS的插件,用来加载静态文件到JS中


### 快速开始

#### 目录结构说明
- static: 静态文件的跟目录
    * css: 用来存放CSS文件
    * frame: 外部引用的框架目录
    * img: 图片目录
    * js: javascript 文件主目录
        - app: 模块存放目录
            * router.js :路由模块
            * menu.js : 目录模块
        - lib: 公共引用的js存放的目录
    * json: 调试json存放的路径----注意,本目录里面的内容一般不上传到git 上面
    * tpls: 存放模版的页面
    
#### 测试demo

- 1.在router.js中声明路由和处理函数
    * 路由配置
    * path: 为路由的路径
    * name: 为处理js模块的名称,这个模块的js要放在js/app的下面
    * handle: 如果没有,则URl点击的时候默认调用对应js模块的init方法,如果写了,则使用handle指定的方法.

```javaScript
var urlConfig = [
        {
            path: '/author',
            name: 'author'
        }, {
            path: '/books',
            name: 'books' //-----------------> url'/books' 调用js/app/books.js的init()方法
        }, {
            path: '/books/view/:bookId',
            name: 'books',
            handle: 'viewBook' //-----------------> url'/books/view/:bookId' 调用js/app/books.js的viewBook方法
        }, {
            path: '/iframe/:url',
            name: 'iframe',
            handle: 'handleIframe'
        }, {
            path: '/blank/:url',
            name: 'blank',
            handle: 'handleBlank'
        }, {
            path: '/innerHtml/:url',
            name: 'innerHtml',
            handle: 'handleInner'
        }
    ];
    
```

- 2.在/app目录中写对应模块的处理函数
  * books.js
  
```javascript
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
```
  
- 3.在/tpls目录中增加对应的模版
    * test/context.html
    * context.html为公共的容器模版,用来显示网站的内容区域.
  
- 4.配置目录
    * menu.js
    * name: 目录名称
    * type: 目录类型
        - blank 从新窗口打开链接
        - iframe 用iframe的方式加载链接
        - local 本地页面常规加载
        
    * url: 页面地址,例如:'books'
  
- 5.之后就可以访问页面了
    
   
   

