/**
 * Created by Truepor on 15/12/17.
 * 模块函数
 */

/**
 * base64 加密解密模块
 *
 */

define(['base64'],
    function (sha256,base64) {
        //模块返回可以是静态值,也可以是函数
        var sub = {
            encrypted: function (input) {
                var str = CryptoJS.enc.Utf8.parse(input);
                result = CryptoJS.enc.Base64.stringify(str);
                return result;
            },
            decrypted: function (input) {
                var words = CryptoJS.enc.Base64.parse(input);
                var result = words.toString(CryptoJS.enc.Utf8);
                return result;
            }
        };
        return sub;
    });

