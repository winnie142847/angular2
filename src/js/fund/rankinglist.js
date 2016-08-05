Helper.getRem('30', '750');
var Core = new fundCore(); //基金核心库
$(function() {
    var rank = function() {
        this.$info = $('.js-tip_info');
        this.type = Helper.getQuery('type'); //类型/估值 净值
        this.typeUrl = function() {
            if (this.type === 'rankings') {
                return Core.fundurl.rankings;
            } else if (this.type === 'estimate') {
                return Core.fundurl.estimate;
            } else {
                throw ('错误类型')
            }
        };
        this.initDom = function() {
            var _this = this;
            if (this.type === 'estimate') {
                $('.custfund_head').css({ 'top': '5.4rem' });
                $("#wrapper").css({ 'top': '8rem' });
                $('.js-tip_info i').on('click', function() {
                    $(this).parent().fadeOut('normal', function() {
                        $('.custfund_head').css({ 'top': '3rem' });
                        $("#wrapper").css({ 'top': '6rem' });
                    });
                })
                if (Helper.getCookie('info')) {
                    this.$info.hide();
                    $('.custfund_head').css({ 'top': '3rem' });
                    $("#wrapper").css({ 'top': '6rem' });
                } else {
                    Helper.setCookie('info', 'true', 60 * 60 * 24);
                    setTimeout(function() {
                        _this.$info.fadeOut('normal', function() {
                            $('.custfund_head').css({ 'top': '3rem' });
                            $("#wrapper").css({ 'top': '6rem' });
                        });
                    }, 6000);
                }
            }
        }
        this.initdata = function() {
            var _this = this;
            var urls = this.typeUrl();
            var contain = $('#thelist'); //父层容器
            var icon = $('.js-fd_icon'); //
            var Data = {
                sort: '1',
                offset: 0,
                limit: 20,
                sortkey:'d',
                invtyp: '股票型',
                nature: null,
                typ: null,
                csftyp: 'GPX'
            };
            var total;
            var isroll, isroll2;
            var blockClass = (_this.type === 'estimate' ? 'fund_blocks' : 'fund_block'),
                _num = (_this.type === 'estimate' ? 6 : 5),
                _active = (_this.type === 'estimate' ? 'fund_headactives' : 'fund_headactive');
            Core.Ajax(Core.fundurl.invtyp, "GET", Data, function(data) {
                var arr = [];
                if (_this.type === 'estimate') {
                    Datas = [{ label: '股票型', value: '股票型' }, { label: '混合型', value: '混合型' }, { label: '联接基金', value: '基金型' }, { label: 'ETF', value: 'ETF' }, { label: '分级基金A', value: '分级基金A' }, { label: '分级基金B', value: '分级基金B' }]
                } else {
                    Datas = data.message.result;
                }
                $(Datas).each(function(index, el) {
                    arr[index] = $('<div class="' + blockClass + ' ' + (el.label === '股票型' ? _active : '') + '"  data-index=' + (index + 1) + ' data-code="' + el.value + '">' + el.label + '</div>');
                });
                $('.fund_head').append(arr).css({
                    "width": ((Datas.length) * _num) + 'rem'
                });
                isroll2 = new iScroll('type', {
                    hScrollbar: true,
                    vScrollbar: false,
                    checkDOMChanges: true,
                });
                setTimeout(function() {
                        $('.type_ctn').css({ position: 'fixed' });
                    }, 2000)
                    // ;
            }, true, false, true);
            $('.fund_head').delegate(' div', 'click', function(e) {
                var index = ($(this).data('index') - 1),
                    code = $(this).data('code'),
                    text = $(this).text(),
                    $custfund = $('.js-custfund_value'),
                    $sortspan = $('.js-sort_span'),
                    $sort = $('.js-sort'),
                    $custfundup = $('.js-sort_span');
                isroll2.scrollToElement(document.querySelector('.fund_head div:nth-child(' + (index <= 1 ? 1 : index - 1) + ')'), null, null, true);
                $(this).addClass(_active).siblings().removeClass(_active);
                if (text === "货币型" || text === "理财型") {
                    $custfund.text('万份收益');
                    $sortspan.text('七日年化');
                    $sort.hide();
                    $custfundup.show().on('click', function(e) {
                        e.stopPropagation();
                    });
                } else {
                    $custfund.text('单位净值')
                    $sort.show();
                    $custfundup.hide();
                }
                changSortkey(code);
            });
            contain.on("addData", function(e, data) {
                if (contain.children().length > 0 && data.getType !== "add") {
                    contain.empty();
                }
                var templte = new Array();
                //debug
                if(false){
                    data.message.result[0].chg = 0;
                    data.message.result[0].vchg = 0;
                    //console.log(data.message.result[0].vchg)
                }
                $(data.message.result).each(function(index, el) {
                    var present = (_this.type === 'estimate' ? el.vchg : el.chg);
                    var val, classs;
                    if (present === "--") {
                        val = present;
                        classs = "";
                    } else if (present > 0) {
                        val = "+" + present.toFixed(2) + "%";
                        classs = "_up";
                    } else if (present.toFixed(2) == 0) {
                        //val = present + "%";
                        val = "0.00%";
                        classs = "_none";
                    } else {
                        val = present.toFixed(2) + "%";
                        classs = "_down";
                    }
                    if (el.dt) {
                        var arr = el.dt.split('-');
                        el.dt = [arr[1], arr[2]].join('-');
                    }
                    templte[index] = $("<li class='fund_data'> \
                                <div class='fund_fi'><span class='fund_fname'>" + (el.name || el.fname) + "</span> \
                                <span class = 'fund_fcode'> " + (el.code || el.fcode).split('_')[0] + "</span> \
                                </div> \
                                <div class = 'fund_se'> <span class = 'fund_net'> " + (el.vnet || el.net).toFixed(4) + "</span> \
                                <span class='fund_dt'>" + el.dt + "</span > </div> \
                                <div class = 'fund_chg " + classs + " js-present'> \
                                " + val + " </div> </li>");
                    templte[index].on('click', {
                        code: (el.code || el.fcode)
                    }, function(e) {
                        if (el.invtyp === "货币型" || el.invtyp === "理财型") {
                            jumptopage("/static/fund/fund_details.html?fcode=" + e.data.code);
                        } else {
                            jumptopage("/static/fund/funddetail.html?fcode=" + e.data.code);
                        }
                    })
                });
                contain.append(templte);
            })
            Core.Ajax(urls, "GET", Data, function(data) {
                data.getType = "refresh";
                Data.offset = data.message.offset;
                total = data.message.total;
                Data.sortkey = "d";
                contain.trigger('addData', data);
                setTimeout(function() {
                    isroll = Core.initIscroll('wrapper', 'pullDown', 'pullUp', pullDownAction, pullUpAction);
                    Core.changIsState(isroll, data);
                    _this.initDom()
                }, 10);
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
                $("body").fadeIn();
            }, true, false, true)
            $(".custfund_up").click(function(e) {
                if ($(".sort_span").hasClass('sort_on')) {
                    $(".sort_span").removeClass('sort_on');
                    $(".sort_div").hide().children('i').show();
                } else {
                    $(".sort_span").addClass('sort_on');
                    $(".sort_div").show().children("i[type='" + $(".sort_span").attr('type') + "']").hide();
                }
                e.stopPropagation();
            })
            $(".sort_div i").click(function() {
                $(".sort_span").attr('type', $(this).attr('type')).text($(this).text());
                $(".sort_span").append('<i class="arrow"></i>');
                if ($(this).attr('type') === "cy") {
                    $('.sort_span').css({
                        "background-position": "6.2rem"
                    })
                } else {
                    $('.sort_span').css({
                        "background-position": "5.8rem"
                    })
                }
                changSortkey($(this).attr('type'), 'sortkey');
            })



            function changSortkey(_key, _type) {
                Data.offset = 0;
                if (_type == "sortkey") {
                    Data.sortkey = _key;
                } else {
                    if (_key === "指数型") {
                        Data.nature = _key;
                        Data.invtyp = null;
                        Data.typ = null;
                    } else if (_key === "QDII型") {
                        Data.typ = _key;
                        Data.invtyp = null;
                        Data.nature = null;
                    } else {
                        Data.invtyp = (_key === "all" ? null : _key);
                        Data.nature = null;
                        Data.typ = null;
                    }
                    if (_this.type === "rankings") {
                        Data.invtyp = null;
                        Data.csftyp = _key;
                    }
                }
                Core.Ajax(urls, "GET", Data, function(data) {
                    data.getType = "refresh";
                    data.sortkey = _key;
                    total = data.message.total;
                    contain.trigger('addData', data);
                    isroll.refresh();

                    //修复净值排行基金类型tab 切换时 isScroll 组件bug（5s以上使用-webkit-transform）;
                    var transformOption = 'translate(0px,'+isroll.minScrollY+'px) scale(1) translateZ(0px)';
                    document.getElementById('scroller').style.cssText="transition-duration: 200ms;-webkit-transform:"+transformOption;
                    //
                    Core.changIsState(isroll, data);
                }, true, false, true)
            }

            function pullDownAction(_myScroll) {
                _myScroll.disable();
                Data.offset = 0;
                Core.Ajax(urls, "GET", Data, function(data) {
                    data.getType = "refresh";
                    Data.offset = data.message.offset;
                    total = data.message.total;
                    contain.trigger('addData', data);
                    _myScroll.refresh();
                    _myScroll.enable();
                    $('.pullUpLabel').text('上拉刷新');
                    $('.pullUpIcon').show();
                    Core.changIsState(_myScroll, data);
                }, true, false, true)
            }

            function pullUpAction(_myScroll) {
                _myScroll.disable();
                Data.offset += 20;
                if (Data.offset > total) {
                    $('.pullUpLabel').text(no_data_text);
                    $('.pullUpIcon').hide();
                    _myScroll.enable();
                    return;
                }
                Core.Ajax(urls, "GET", Data, function(data) {
                    data.getType = "add";
                    offset = data.message.offset;
                    total = data.message.total;
                    contain.trigger('addData', data);
                    _myScroll.refresh();
                    _myScroll.enable();
                    Core.changIsState(_myScroll, data);
                }, true, false, true)
            }
        }
        this.init = function() {
            this.initdata();
        }
        this.init();
    }
    new rank();
    xx
    // $('body').fadeIn('slow');
})
