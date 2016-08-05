Helper.getRem('30', '750');
$(function() {
    Helper.setCookie('ques', 'off', token_exp, '/');
    var Core = new fundCore({ getQuery: true });
    var fundIndex = function() {
        this.$upbord = $('.js-bord_ctn'); //领涨板块
        this.$upconcept = $('.js-index_ctn'); //领涨概念
        this.$dc = $(document);
        this.getBanner = function() {
            // result[i].url
            Core.Ajax(Core.fundurl.banner, "GET", null, function(data) {
                var result = data.message.result;
                $('.fundindex_bannerbd ul').empty();
                for (var i = 0; i < result.length; i++) {
                    $('<li><a href="' + result[i].href + '"> \
                            <img _src="' + result[i].url + '" src="static/fund/images/blank.png" /> \
                            </a></li>').appendTo('.fundindex_bannerbd ul')
                }
                var opt = {
                    slideCell: "#focus",
                    titCell: ".fundindex_bannerhd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell: ".fundindex_bannerbd ul",
                    effect: "leftLoop",
                    autoPlay: true, //自动播放
                    autoPage: true, //自动分页
                    switchLoad: "_src" //切换加载，真实图片路径为"_src" 
                }
                $.extend(opt, {
                    autoPlay: (result.length > 1 ? true : false)
                });
                TouchSlide(opt);
            }, false);
        }
        this.weekly = function() {
            var _this = this;
            Core.Ajax(Core.fundurl.weekly, "GET", { type: 1, offset: 0, limit: 3 }, function(data) {
                _this.$dc.trigger('addData', { data: data.message.result, el: _this.$upconcept, tp: 1 });
            }, false);
            Core.Ajax(Core.fundurl.weekly, "GET", { type: 0, offset: 0, limit: 3 }, function(data) {
                _this.$dc.trigger('addData', { data: data.message.result, el: _this.$upbord, tp: 0 });
            }, false);
        };
        this.getNews = function() {
            var _this = this;
            Core.Ajax(Core.fundurl.newsfetch, "GET", { offset: 0, limit: 4 }, function(data) {
                _this.$dc.trigger('addNews', { data: data.message });
            }, false);
        };
        this.getChg = function(data) {
            try {
                data = parseFloat(data)
                if (data >= 0) {
                    return [data + "%", "_up"];
                } else if (data < 0) {
                    return [data + "%", "_down"];
                } else {
                    return ['--', null];
                }
            } catch (e) {
                console.log(e);
                return ['--', null];
            }
        }
        this.filterChg = function(data) {
            var obj = {
                value: '',
                percent: '',
                color: '',
                class: ''
            };
            data = parseFloat(data).toFixed(2);
            if (data > 0) {
                obj.value = "+" + data + "%";
                obj.color = '#f24957';
                obj.class = '_up';
                if (data >= 10) {
                    obj.percent = 100;
                } else {
                    obj.percent = parseFloat(data / 10 * 100).toFixed(2) * 1;
                }
            } else if (data < 0) {
                obj.value = data + "%";
                obj.color = '#1fbf62';
                obj.class = '_down';
                if (data <= -10) {
                    obj.percent = 100;
                } else {
                    obj.percent = -parseFloat(data / 10 * 100).toFixed(2) * 1;
                }
            } else {
                obj.percent = data * 1;
                obj.class = '_none';
                obj.value = data + "%";
                obj.color = '#b2b2c5';
            }
            return obj;
        }
        this.getRealindex = function(argument) {
            var $ctn = $('.js-fundindex_indexdata');
            Core.Ajax(Core.fundurl.realtime, "GET", null, function(data) {
                data.message.map(function(el, index) {
                    var inc = (el.inc > 0 ? '+' : '') + el.inc + '&nbsp' + (el.inc > 0 ? '+' : '') + el.chg + "%";
                    $ctn.find('.js-index_num').eq(index).text(el.index).addClass(el.inc > 0 ? '_up' : '_down');
                    $ctn.find('.js-index_state').eq(index).html(inc).addClass(el.inc > 0 ? '_up' : '_down');
                })
            }, false,false,false);
        }
        this.getRecommend = function() {
            var _this = this;
            Core.Ajax(Core.fundurl.recoms, "GET", null, function(data) {
                var result = data.message.result.recoms;
                $('.fundindex_list').empty();
                var hid = $('<div class="fnlist_hidden"></div>');
                var _data_txt;
                var arr = [],
                    brr = [];
                moment(new Date()).diff(moment(result[0].dt), 'days') == 0 ? _data_txt = '今日推荐' : _data_txt = '';
                if(_data_txt){
                    $('<div class="fundindex_listtitle">' +'<span>'+ _data_txt +'</span>'+ '&nbsp;&nbsp;' + moment(result[0].dt).format("M月D日") + '</div>').appendTo('.fundindex_tag');
                }else{
                    $('<div class="fundindex_listtitle">' + _data_txt + '&nbsp;&nbsp;' + moment(result[0].dt).format("M月D日") + '</div>').appendTo('.fundindex_tag');
                }
                result.map(function(el, i) {
                    // #1fbf62 绿色
                    // #b2b2c5 灰色
                    // #f24957 红色
                    var chgObj = _this.filterChg(el.chg);
                    // console.log(chgObj)
                    el.Fcode = el.fcode.split('_')[0];
                    if (el.cat === "股价") {
                        el.type = 'price';
                    } else if (el.cat === "新闻") {
                        el.type = 'news';
                    } else if (el.cat === "指标") {
                        el.type = 'index';
                    }
                    if (i >= 4) {
                        brr[i] = $('<div class="fundindex_data" > \
                            <div class="data_forward"><div class="data_forward_up"><span class="data_fname">' + el.fname + '</span> \
                            <span class="data_invtyp">' + el.invtyp + '</span><span class="data_fcode">' + el.Fcode + '</span></div><div class="data_forward_down"> \
                            <span class="data_cat">' + el.cat + '</span>' + (el.posi != null ? '<span class="' + (el.posi == "利好" ? 'data_situp' : 'data_sitdown') + '">' + el.posi + '</span>' : '') + '<span class="data_t">' + el.t + '</span></div></div> \
                            <div class="data_backward"><div class="overlay"><div class="data_up">日涨幅</div><div class="data_num ' + chgObj.class + ' num_en">' + chgObj.value + '</div></div></div> \
                        </div>');
                        brr[i].find('.data_backward').css('background-image', drawSpie(chgObj.percent, chgObj.color, '#dddde6'));
                        brr[i].on("click", {
                            type: el.type,
                            code: el.fcode,
                            dt: el.dt
                        }, function(e) {
                            jumptopage("static/fund/fundsuportdetail.html?type=" + e.data.type + "&from=" + _from + "&fcode=" + e.data.code + "&dt=" + e.data.dt);
                        })
                    } else {
                        arr[i] = $('<div class="fundindex_data" > \
                            <div class="data_forward"><div class="data_forward_up"><span class="data_fname">' + el.fname + '</span> \
                            <span class="data_invtyp">' + el.invtyp + '</span><span class="data_fcode">' + el.Fcode + '</span></div><div class="data_forward_down"> \
                            <span class="data_cat">' + el.cat + '</span>' + (el.posi != null ? '<span class="' + (el.posi == "利好" ? 'data_situp' : 'data_sitdown') + '">' + el.posi + '</span>' : '') + '<span class="data_t">' + el.t + '</span></div></div> \
                            <div class="data_backward"><div class="overlay"><div class="data_up">日涨幅</div><div class="data_num ' + chgObj.class + ' num_en">' + chgObj.value + '</div></div></div> \
                        </div>');
                        arr[i].find('.data_backward').css('background-image', drawSpie(chgObj.percent, chgObj.color, '#dddde6'));
                        arr[i].on('click', {
                            type: el.type,
                            code: el.fcode,
                            dt: el.dt
                        }, function(e) {
                            jumptopage("static/fund/fundsuportdetail.html?type=" + e.data.type + "&from=" + _from + "&fcode=" + e.data.code + "&dt=" + e.data.dt);
                        })
                    }
                })
                hid.append(brr);
                arr.push(hid);
                if (result.length > 4) {
                    var more = $('<div class="fundindex_more">查看更多</div>');
                    more.on('click', function() {
                        var _this = this;
                        hid.slideToggle('400', function() {
                            $(_this).html() === '查看更多' ? $(_this).html('收起') : $(_this).html('查看更多');
                        })
                    });
                    arr.push(more);
                }
                $('.fundindex_list').append(arr);
            }.bind(this), false);
        }
        this.bindEvent = function() {
            var _this = this;
            this.$dc.on('addData', function(e, dt) { //概念涨幅
                var data = dt.data,
                    arr = [],
                    ctn = dt.el,
                    lg = data.fund.length - 1,
                    tp = dt.tp;
                if (tp) {
                    ctn.siblings('.bordtitle_y').find('.js-bordname').text(data.name)
                    ctn.siblings('.bordtitle_y').find('.js-bord_num').text(data.chg == null ? '--' : _this.filterChg(data.chg).value);
                    ctn.siblings('.bordtitle_y').on('click', function(e) {
                        jumptopage('/static/fund/fundtype.html?mdcode=' + data.code + '&md=concept');
                    });
                    ctn.siblings('.fundindex_title').on('click', function(e) {
                        jumptopage("static/fund/fundledcapte.html?type=" + $(this).data('type') + "&from=" + _from);
                    });
                } else {
                    ctn.siblings('.bordtitle').find('.js-bordname').text(data.name);
                    ctn.siblings('.bordtitle').find('.js-bord_num').text(data.chg == null ? '--' :_this.filterChg(data.chg).value);
                    ctn.siblings('.bordtitle').on('click', function(e) {
                        jumptopage('/static/fund/fundtype.html?mdcode=' + data.code + '&md=module');
                    });
                    ctn.siblings('.fundindex_title').on('click', function(e) {
                        jumptopage("static/fund/fundledmodule.html?type=" + $(this).data('type') + "&from=" + _from);
                    });
                }
                data.fund.map(function(el, i) {
                    chg = _this.filterChg(el.chg),
                        el.code = el.fcode.split("_")[0],
                        iblock = (i === lg ? '<i class="bdicon_last"></i>' : '');
                    arr[i] = $('<li class="bord_data"><i class="' + (!tp ? "bord_icon" : "index_icon") + '">' + iblock + '</i><div class="bord_dt"><div><span class="bd_dtname">' + el.name + '</span></br><span class="bd_dtcode">' + el.code + '</span></div><span class="bd_dtpercent ' + chg.class + '">' + chg.value + '</span></div></li>');
                    arr[i].on('click', { code: el.fcode }, function(e) {
                        if (el.invtyp === "货币型" || el.invtyp === "理财型") {
                            jumptopage("/static/fund/fund_details.html?fcode=" + e.data.code);
                        } else {
                            jumptopage("/static/fund/funddetail.html?fcode=" + e.data.code);
                        }
                    })
                });
                ctn.empty().append(arr);
            });
            this.$dc.on('addNews', function(e, dt) {
                //debug
                if(false){
                   dt.data.result =[
                    {"id":"57833282e4b075ae680997c6","title":"定增项目频“夭折” 公募参与热情不减","dt":"2016-07-11 13:36","source":"","type":null}
                    ]
                }
                var data = dt.data.result,
                    arr = [],
                    ctn = $('.js-info_ctn');
                ctn.siblings('.fundindex_title').on('click', function() {
                    jumptopage("static/info/index.html?from=" + _from);
                })
                data.map(function(el, i) {
                    var datetime = moment(el.dt).format('MM-DD HH:mm');
                    arr[i] = $('<li class="info_data"><span class="info_title">' + el.title + '</span><span class="info_dt">' + datetime + '</span></li>');
                    arr[i].on('click', { id: el.id }, function(e) {
                        jumptopage("/static/info/infodetail.html?id=" + e.data.id + "&from=" + _from);
                    })
                });
                ctn.empty().append(arr);
            });
            this.$dc.delegate('.js-lead', 'click', function(e) {
                jumptopage("static/fund/fundledmodule.html?type=" + $(this).data('type') + "&from=" + _from);
            }).delegate('.js-concept', 'click', function(event) {
                jumptopage("static/fund/fundledcapte.html?type=" + $(this).data('type') + "&from=" + _from);
            });
            $('.fund_fund').on('click', function() {
                jumptopage("static/fund/chosefund.html?from=" + _from)
            })
            $('.fund_devers').on('click', function() {
                jumptopage("view/fund/fundvaluation.html?from=" + _from + "&type=estimate")
            })
            $('.fund_rank').on('click', function() {
                jumptopage("../view/fund/rankinglist.html?from=" + _from + "&type=rankings")
            })
            $('.fund_company').on('click', function() {
                jumptopage("../view/company/index.html?from=" + _from + "&type=rankings")
            })
            $('.js-manager_more').on('click', function() {
                jumptopage("../view/company/manager_ranking.html?from=" + _from)
            })
            $('.fundidnex_search').on('click', function() {
                jumptopage("../view/search/index.html?uid=" + uid + "&userid=" + userid + "&from=" + _from);
            })
        }
        this.slider = function(argument) {
            var _this = this;
            Core.Ajax(Core.fundurl.manager, "GET", null, function(data) {
                var list = [];
                data.message.result.map(function(el, i) {
                    var _obj = _this.filterChg(el.chg);
                    list.push({
                        content: (function(num) {
                            var frag = document.createDocumentFragment();
                            var dom = $('<div class="fundmanager_card"><div class="mag_head"></div><span class="mag_name">' + el.name + '</span> \
                            <span class="mag_cmp">' + el.org + '</span> \
                            <div class="mag_star js-mag_star"></div> \
                            <span class="mag_fullcmp">' + el.fname + '</span> \
                            <span class="mag_back">任期回报</span> \
                            <span class="mag_percent ' + _obj.class + '">' + _obj.value + '</span> \
                            </div>');
                            el.grade = parseInt(el.grade);
                            var brr = [];
                            for (var i = 0; i < el.grade; i++) {
                                brr[i] = '<i class="stars"></i>';
                            }
                            dom.find('.js-mag_star').append(brr);
                            dom.on('click', { pid: el.pid },
                                function(e) {
                                    e.stopPropagation();
                                    jumptopage("/static/company/man_details.html?pid=" + e.data.pid + "&from=" + _from)
                                })
                            return dom[0];
                        })(i)
                    })
                })
                var S = new iSlider(document.getElementById('slider'), list, {
                    isLooping: 1,
                    isOverspread: 1,
                    isAutoplay: 1,
                    duration: 2000,
                    isTouchable: true,
                    animateTime: 500,
                    fillSeam: 1,
                    fixPage: 0,
                    animateType: 'depth'
                })
            }, false);
        }
        this.init = function() {
            this.bindEvent();
            this.getBanner();
            this.getRecommend();
            this.getRealindex();
            this.weekly();
            this.getNews();
            $("body").fadeIn();
            this.slider();
        }
        this.init();
    }
    new fundIndex();

    // Core.Ajax(Core.fundurl.dividend, "GET", { fcode: 519011 }, function(data) {
    //     console.log(data);
    // }, false);
})
