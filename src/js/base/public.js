var uid = Helper.getQuery('uid');
var tok = Helper.getQuery('tok');
var _from;
var userid;
console.log('public')
Helper.getQuery('userid') != 'null' ? userid = Helper.getQuery('userid') : userid = '';
var token_exp = 60 * 60 * 2; // 2小时

//标签色组
var tag_colors = ['#faa226', '#13b5b1', '#00b7ee', '#00b7ee', '#f3737c', '#8978c9', '#94b0bc', '#bb6868'];

//信息提示
var no_data_text = '';
var mess_info = {
    timeout: '请求超时,请稍后再试。',
    follow: '收藏成功',
    unfollow: '取消收藏',
    no_fund: '暂无该基金信息'
};
$("body").append("<div id='star_pop'><div></div></div>");


var fundCore = function(opt) {
    var defaultopt = {
        iScroll: {
            //nodatatext: "数据已经加载完毕",//全局数据的文字
            nodatatext: "",//全局数据的文字
            pulldowntext: "下拉刷新",
            pulluptext: "加载更多",
            leavetext: "释放刷新",
            onloadtext: "加载中"
        }
        //设置一些初始默认属性
    }
    defaultopt = $.extend(defaultopt, opt);
    this.dataLoading = function() { //加载数据载入状态
        $('<div class="fund_loadingmodal"><div class="fund_newloading"></div></div>').appendTo('body');
        $('.fund_loadingmodal').on("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
        })
    }
    this.Timeout = false;
    this.noData = function() {
        $('<div class="fund_nodatamodal"><div class="fund_loading"><div class="fund_loadingnoimg">暂无数据,请选择其他条件</div></div></div>').appendTo('body');
    }
    this.noCust_data = function() {
        $('<div class="fund_nodatamodal"><div class="fund_loading"><div class="fund_loadingnoimg">你还没有收藏任何基金</div></div></div>').appendTo('body');
    }
    this.dataEnd = function() { //关闭载入状态
        $('.fund_loadingmodal').remove();
        $('.fund_nodatamodal').remove();
    }
    this.setAjax = function(_userid, _pkey) { //全局ajax设置
        var _this = this;
        return $.ajaxSetup({
            global: true,
            headers: {
                // source:'JD',
                userid: _userid || null, //_this.getQueryString().userid
                pkey: _pkey || null //_this.getQueryString().pkey
            },
            timeout: 10000, //十秒超时设置
            beforeSend: function(XMLHttpRequest) {
                this.dataLoading();
            }.bind(this),
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus)
                if (textStatus === "timeout" && !this.Timeout) {
                    this.Timeout = true;
                    $("#star_pop div").text(mess_info.timeout);
                    $("#star_pop").fadeIn().delay(3000).fadeOut();
                    this.Timeout = false;
                }
                $("body").fadeIn();
            }.bind(this),
            complete: function(XMLHttpRequest, textStatus) {
                this.dataEnd();
            }.bind(this)
        });
    }
    this.Ajax = function(_url, _type, _data, _callback, _loading, _user, _filter) { //简单封装AJAX调用
            var option = {
                url: '/fund/api' + _url,
                type: _type,
                dataType: 'json',
                data: _data,
                cache: false,
                dataFilter: function(data, type) {
                    if (_filter) {
                        data = data.replaceAll(null, "\"--\"");
                        return data;
                    } else {
                        return data;
                    }
                }
            }
            if (_user) {
                $.extend(option, {
                    url: '/userservice' + _url
                });
            }
            if (_loading) { //是否使用默认加载遮罩
                $.extend(option, {
                    beforeSend: function() {}
                });
            }
            return $.ajax(option)
                .done(function(data) {
                    switch (data.code) {
                        case "200":
                            _callback(data);
                            break
                        case "400":
                            console.log('参数异常');
                            break
                        case "500":
                            console.log('服务异常');
                            break
                        case "10200":
                            $("body").fadeIn();
                            $("#wrapper").css('left', '0');
                            $("#pullDown,#pullUp").hide();
                            $("#thelist").html("<div style='text-align:center;padding:10px;'>当前操作异常，请重新登录</div>");
                            console.log('accessKey值不匹配');
                            break
                        case "10107":
                            console.log('程序异常');
                            break
                        default:
                            break;
                    }
                })
        },
        this.initIscroll = function($wrapper, $pulldown, $pullup, _downData, _upData) {
            var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
            pullDownEl = document.getElementById($pulldown);
            pullDownOffset = pullDownEl.offsetHeight;
            pullUpEl = document.getElementById($pullup);
            pullUpOffset = pullUpEl.offsetHeight;
            myScroll = new iScroll($wrapper, {
                useTransition: true,
                topOffset: pullDownOffset,
                onRefresh: function() {
                    if (pullDownEl.className.match('loading')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = defaultopt.iScroll.pulldowntext;
                    } else if (pullUpEl.className.match('loading')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = defaultopt.iScroll.pulluptext;
                    }
                },
                onScrollMove: function() {
                    if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        $('.pullUpIcon').show()
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = defaultopt.iScroll.leavetext;
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = defaultopt.iScroll.pulldowntext;
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                        if (!pullUpEl.querySelector('.pullUpLabel')) {
                            return;
                        }
                        pullUpEl.className = 'flip';
                        $('.pullUpIcon').show();
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = defaultopt.iScroll.leavetext;
                        this.maxScrollY = this.maxScrollY;
                    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                        if (!pullUpEl.querySelector('.pullUpLabel')) {
                            return;
                        }
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = defaultopt.iScroll.pulluptext;
                        this.maxScrollY = pullUpOffset;
                    }
                },
                onScrollEnd: function() {
                    if (pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'loading';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = defaultopt.iScroll.onloadtext;
                        _downData(myScroll);
                    } else if (pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'loading';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = defaultopt.iScroll.onloadtext;
                        _upData(myScroll);
                    }
                }
            });
            $(myScroll).on('empty', function() {
                myScroll.disable();
                $('#pullUp').empty().append('<div class="isnodata">' + defaultopt.iScroll.nodatatext + '</div>');
            });
            $(myScroll).on('inten', function() {
                $('#pullUp').empty().append('<div class="isnodata">' + defaultopt.iScroll.nodatatext + '</div>')
                $('#pullUp').parent().append('<div style="height:4rem"></div>');
                myScroll.enable();
            });
            $(myScroll).on('normal', function() {
                $('#pullUp').empty().append('<div class="iscontent"><span class="pullUpIcon"></span><span class="pullUpLabel">' + defaultopt.iScroll.pulluptext + '</span></div>');
                myScroll.enable();
            });
            setTimeout(function() {
                document.getElementById($wrapper).style.left = '0';
            }, 50);
            return myScroll
        },
        this.FootTool = function() { // 初始化菜单切换
            var button = $('#footer i');
            $('<script src="http://s4.cnzz.com/z_stat.php?id=1259536245&web_id=1259536245" language="JavaScript"></script>').appendTo('head');
            button.on('click', function() {
                if (!$(this).hasClass('fin')) {
                    jumptopage($(this).data('url'));
                }
                // else {//测评这个版本先不做
                //     if (ckeck_tok()) {
                //         $.ajax({
                //             url: '/userservice/fund/asset/info?uid=' + uid + '&token=' + Helper.getCookie('fund_token'),
                //             type: 'GET',
                //             beforeSend: function(request) {
                //                 request.setRequestHeader("userid", userid);
                //                 request.setRequestHeader("pkey", uid);
                //             },
                //             success: function(data) {
                //                 var _data = data.message;
                //                 if (_data.total != '' && _data.total > 0) {
                //                     location.href = '/static/fin/index.html?uid=' + uid + '&userid=' + userid + '&from=' + _from;
                //                 } else {
                //                     location.href = '/static/fin/ques.html?uid=' + uid + '&userid=' + userid + '&from=' + _from;
                //                 }
                //             }
                //         })
                //     } else {
                //         getApp();
                //     }
                // }
            })
        }
    this.init = function(_getQuery) { //初始化全局设置
        if (_getQuery) {
            this.saveQueryString() //存储APP传来的参数
        }
        if (this.getQueryString()) {
            // document.write(JSON.stringify(this.getQueryString()))
            this.setAjax(this.getQueryString().userid, this.getQueryString().pkey);
            _from = this.getQueryString().from;
        }
        this.FootTool();
    }
    if (opt) {
        this.init(opt.getQuery);
    } else {
        this.init();
    }
}
fundCore.prototype = {
    changIsState: function(is, data) {
        if (data.message.result.length === 0 || data.message.result === '--' || data.message === '--') {
            $(is).trigger('empty');
        } else if (data.message.result.length < 20) {
            $(is).trigger('inten');
        } else if (data.message.result.length === 20 && data.message.total === 20) {
            $(is).trigger('inten');
        } else {
            $(is).trigger('normal');
        }
    },
    saveData: function(name, value) {
        if ('JSON' in window) {
            value = JSON.stringify(value);
        }
        if (Helper.isIOS()) {
            return window.localStorage.setItem(name, value);
        }
        if (Helper.isAndroid()) {
            return Helper.setCookie(name, value);
        }
        return window.localStorage.setItem(name, value);
    },
    getData: function(name) {
        if (Helper.isIOS()) {
            return JSON.parse(window.localStorage.getItem(name));
        }
        if (Helper.isAndroid()) {
            return JSON.parse(Helper.getCookie(name));
        }
        return JSON.parse(window.localStorage.getItem(name));

    },
    delData: function(name) {
        if (Helper.isIOS()) {
            return window.localStorage.removeItem(name);
        }
        if (Helper.isAndroid()) {
            return Helper.delCookie(name);
        }
        return window.localStorage.removeItem(name);
    },
    saveQueryString: function() {
        var _obj = {};
        if (!Helper.getQuery('uid')) {
            return;
        }
        Helper.getQuery('uid') && (_obj.pkey = Helper.getQuery('uid'));
        Helper.getQuery('tok') && (_obj.tok = Helper.getQuery('tok'));
        Helper.getQuery('userid') && (_obj.userid = Helper.getQuery('userid'));
        Helper.getQuery('from') && (_obj.from = Helper.getQuery('from'));
        this.saveData('queryString', _obj);
    },
    getQueryString: function() {
        return this.getData('queryString');
    },
    fundurl: {
        'industry': '/change/industry/ranking', //行业涨幅
        'change': '/change/ranking', //基金涨幅
        'changelist': '/change/industry/list', //行业内基金涨跌幅
        'fundfilter': '/filter', //基金筛选
        'funddetail': '/detail', //基金详情
        'labelindustry': '/label/industry', //行业标签列表
        'invtyp': '/label/csftyp', //基金分类标签列表
        'labeltheme': '/label/theme', //行业主题列表
        'labelstyle': '/label/style', //行业风格列表
        'netvaluelist': '/netvalue/list', //基金净值列表
        'stocklist': '/stock/list', //重仓持股
        'orgdetail': '/org/detail', //基金公司
        'rankings': '/rankings',
        'managerdetail': '/manager/detail', //基金经理
        'orgfunds': '/org/funds',
        'banner': '/index/banner', //banner
        'recoms': '/index/recoms', //基金推荐
        'stockdt': '/recoms/stock/detail', //按股价推荐详情
        'news': '/recoms/news/detail', //按新闻推荐详情
        'index': '/recoms/indicator/detail', //按指标推荐详情
        'weekindustry': '/change/weekly/industry/list', //一周领涨板块
        'weekconsept': '/change/weekly/concept/list', //一周领涨概念
        'realtime': '/index/realtime/quotes', //指数事实数据
        'estimate': '/net/estimate/rankings', //估值排行

        'manager': '/recoms/manager', //推荐基金经理
        'companySearch': '/search/org', //按字母索引基金公司
        'companyProfile': '/org/profile', //公司档案基本情况
        'companyStock': '/org/stock', //公司档案公司持仓
        'companyDetail': '/org/detail', //基金公司详情
        'companyCate': '/org/funds/cate', //基金公司基金类型分类
        'companyFunds': '/org/funds', //基金公司基金
        'managerList': '/manager/list', //基金公司基金经理列表
        'managerDetail': '/manager/detail', //基金公司基金经理详情
        'managerRankings': '/rankings', //基金经理排行榜
        'fundFetch': '/announce/fetch', //基金公告
        'fundtrend': '/change/trend', //基金收益走势
        'funddaily': '/change/daily', //业绩表现 。。基金每日收益对比
        'fundindustry': '/asset/industry', //基金详情 行业分布
        'fundasset': '/asset', //基金详情　　配置类型
        'fundmanager': '/fund/manager', // 基金详情 基金经理
        'estimatedaily': '/net/estimate/daily', //实时估值
        'fundsummary': '/summary', //基金基本详情
        'fundar7d': '/change/trend/ar7d', //七日年化

        'dividend': '/history/dividend',

        'weeklylist': '/index/weekly/list', //领涨概念OR板块列表
        'realtime': '/index/realtime/quotes', //指数事实数据
        'diagnose': '/select/diagnose', //自选测评
        'stocksAndBonds': '/select/diagnose/stocksAndBonds', //自选基金测评的重仓股债查询
        'weekly': '/index/weekly', //一周领涨板块/概念 
        'newsfetch': '/news/fetch', //首页资讯列表
        'spstyle': '/label/spstyle', //风格标签列表
        'laberisk': '/label/risk' //风险标签列表


    },
    infourl: {
        'newslist': '/news/fetch' //资讯列表
    },
    userurl: {
        'usfundlist': '/fund/list',
        'collect': '/fund/collect',
        'check': '/fund/collect/check'
    }
}
$(document).on('click', function() { //关闭涨幅
    $(".sort_span").removeClass('sort_on');
    $(".sort_div").hide().children('i').show();
})

function jumptopage(url) { //
    location.href = url;
}

/**
 * @param {String} str 模版字符串
 * @param {Object} o json data
 * @param {RegExp} [regexp] 匹配字符串正则
 */
function substitute(str, o, regexp) {
    return str.replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
        return (o[name] === undefined) ? '' : o[name];
    });
}

//num百分比，hcolor高亮色,bcolor未填满处颜色
function drawSpie(num, hcolor, bcolor) {
    if (num > 50) {
        return "linear-gradient(-90deg, " + hcolor + " 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(" + (num / 100 * 360 - 270) + "deg, " + hcolor + " 50%, " + bcolor + " 50%, " + bcolor + ")";
    } else {
        return "linear-gradient(90deg, " + bcolor + " 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(" + (num / 100 * 360 + 90) + "deg, " + hcolor + " 50%, " + bcolor + " 50%, " + bcolor + ")";
    }
}
String.prototype.replaceAll = function(s1, s2) {　　
    return this.replace(new RegExp(s1, "gm"), s2);　　
}

//格式代码
function mark_code(code) {
    var mcode = code.split('_');
    return mcode[0];
}

//替换所有null为--
function ck_null(data) {
    if (data == null) {
        return '--'
    } else {
        return data
    }
}

function getNow(time) {
    var _now = new Date();
    return _now.setTime(_now.getTime() + time * 1000);
}

//获取app参数
var _sendUrl;

function getApp() {
    _sendUrl = window.location.href;
    if (Helper.isIOS() == 'Mac OS X' && Helper.isApp() == 'ios') {
        window.webkit.messageHandlers.getFundPosts.postMessage(_sendUrl);
    } else if (Helper.isAndroid() == 'Android' && Helper.isApp() == 'android') {
        window.webkit.getFundPosts(_sendUrl);
    } else {
        $("body").fadeIn();
        $("#wrapper").css('left', '0');
        $("#pullDown,#pullUp").hide();
        $("#thelist").html("<div style='text-align:center;padding:10px;'>当前操作异常，请重新登录</div>");
    }
}



//检查token是否有效
// function ckeck_tok() {
//     if (!Helper.getCookie('fund_exp') || Helper.getCookie('fund_exp') < getNow(0)) {
//         getApp();
//         return false;
//     } else {
//         return true;
//     }
// }

//判断url是否带tok
// if (tok != '' && tok != null) {
//     if (!Helper.getCookie('fund_exp') || Helper.getCookie('fund_exp') < getNow(0)) {
//         Helper.setCookie('fund_token', tok, token_exp, '/');
//         Helper.setCookie('fund_exp', getNow(token_exp), token_exp, '/');
//     }
// }
// if (uid != '' && uid != null) {
//     if (!Helper.getCookie('fund_uid') || Helper.getCookie('fund_uid') != uid) {
//         Helper.setCookie('fund_uid', uid, token_exp, '/');
//         Helper.setCookie('fund_token', tok, token_exp, '/');
//     }
// }


//h5toAPP
function h5toApp(code, name) {
    if (_from == 'ios') {
        webkit.messageHandlers.callbackHandler.postMessage('{\"code\":\"' + code + '\"}')
    } else {
        window.webkit.callbackHandler('{\"code\":\"' + code + '\",\"name\":\"' + name + '\"}')
    }
}
