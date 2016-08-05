//消除300毫秒点击延迟
(function() {
    window.FastClick && FastClick.attach(document.body);
})();

window.Helper = {
    // 格式化股票代码
    formatCode: function(s) {
        return s.replace(/_[_A-Z]+$/, '');
    },
    // 获取url参数
    getQuery: function(key) {
        var reg = new RegExp(key + '=([^&]+)(?=(?:&|$))');
        var result = location.search.match(reg);
        return result ? decodeURIComponent(result[1]) : result;
    },
    // 是否在app中浏览
    isApp: function() {
        return this.getQuery("from") == 'app' || this.getQuery("from") == 'android' || this.getQuery("from") == 'ios' || this.getQuery("from") == 'ishanghai';
    },
    // 是否在微信中浏览
    isWeixin: function() {
        return navigator.userAgent.match(/MicroMessenger/);
    },
    // 是否是苹果设备
    isIOS: function() {
        return navigator.userAgent.match(/Mac OS X/);
    },
    // 是否是安卓系统
    isAndroid: function() {
        return navigator.userAgent.match(/Android/);
    },
    loadBpop: function() {
        return !Helper.isApp() && (typeof load_bpop === "undefined" || load_bpop);
    },
    debug: function(info) {
        if (location.hash === "#debug") alert(JSON.stringify(info));
    },
    //计算不同设备rem根字体大小，比例1rem=10px, org_size=设计稿根字体大小,org_width=设计稿页面宽度
    getRem: function(org_size, org_width) {
        if (!document.addEventListener) return;

        var docEle = document.documentElement;
        docEle.style.display = 'none';
        var recalc = function() {
            var clientWidth = docEle.clientWidth;
            //pc端大于等于1280时屏蔽，防止字体过大
            if (!clientWidth || clientWidth >= 1280) return;
            docEle.style.fontSize = org_size * (clientWidth / org_width) + 'px';
        };
        window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);
        document.addEventListener('DOMContentLoaded', recalc, false);
        docEle.style.display = 'block';
    },
    replaceStockCob: function(doc) {
        doc.each(function(key, ele) {
            ele.innerHTML = ele.innerHTML.replace(/([\$|\#])(.+?)\((.+?)\)[\$|\#]/g, function(match, type, name, id) {
                //console.log(match, type, name, id);
                if (type === "#") {
                    return "<a href='/comb/index?id=" + id + "' style='color:#1a7be7'>" + name + "</a>";
                } else if (type === "$") {
                    return "<a href='/stock/index?secu=" + id + "' style='color:#1a7be7'>" + name + "</a>"; // stock
                }
            });
        });
    },
    download: function(ele) {
        if (Helper.isWeixin() && Helper.isAndroid()) {
            alert("微信浏览器不支持下载");
        } else if (confirm($(ele).data("msg"))) {
            location.href = $(ele).data("url");
        }
    },
    //写cookie
    setCookie: function(name, value, time, path) {
        time = time || 86400000;
        var strsec = 1000 * Number(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        // console.log(exp.toGMTString())
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + path;
    },
    //读取cookie
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //删除cookie
    delCookie: function(name, path) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 10000);
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "=" + ";expires=" + exp.toString() + path;
    }
};


$(function() {
    $("body").css("min-height", ($(window).height()));
});
