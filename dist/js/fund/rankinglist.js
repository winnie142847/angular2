Helper.getRem("30","750");var Core=new fundCore;$(function(){var t=function(){this.$info=$(".js-tip_info"),this.type=Helper.getQuery("type"),this.typeUrl=function(){if("rankings"===this.type)return Core.fundurl.rankings;if("estimate"===this.type)return Core.fundurl.estimate;throw"错误类型"},this.initDom=function(){var t=this;"estimate"===this.type&&($(".custfund_head").css({top:"5.4rem"}),$("#wrapper").css({top:"8rem"}),$(".js-tip_info i").on("click",function(){$(this).parent().fadeOut("normal",function(){$(".custfund_head").css({top:"3rem"}),$("#wrapper").css({top:"6rem"})})}),Helper.getCookie("info")?(this.$info.hide(),$(".custfund_head").css({top:"3rem"}),$("#wrapper").css({top:"6rem"})):(Helper.setCookie("info","true",86400),setTimeout(function(){t.$info.fadeOut("normal",function(){$(".custfund_head").css({top:"3rem"}),$("#wrapper").css({top:"6rem"})})},6e3)))},this.initdata=function(){function t(t,e){d.offset=0,"sortkey"==e?d.sortkey=t:("指数型"===t?(d.nature=t,d.invtyp=null,d.typ=null):"QDII型"===t?(d.typ=t,d.invtyp=null,d.nature=null):(d.invtyp="all"===t?null:t,d.nature=null,d.typ=null),"rankings"===o.type&&(d.invtyp=null,d.csftyp=t)),Core.Ajax(r,"GET",d,function(e){e.getType="refresh",e.sortkey=t,n=e.message.total,l.trigger("addData",e),a.refresh();var s="translate(0px,"+a.minScrollY+"px) scale(1) translateZ(0px)";document.getElementById("scroller").style.cssText="transition-duration: 200ms;-webkit-transform:"+s,Core.changIsState(a,e)},!0,!1,!0)}function e(t){t.disable(),d.offset=0,Core.Ajax(r,"GET",d,function(e){e.getType="refresh",d.offset=e.message.offset,n=e.message.total,l.trigger("addData",e),t.refresh(),t.enable(),$(".pullUpLabel").text("上拉刷新"),$(".pullUpIcon").show(),Core.changIsState(t,e)},!0,!1,!0)}function s(t){return t.disable(),d.offset+=20,d.offset>n?($(".pullUpLabel").text(no_data_text),$(".pullUpIcon").hide(),void t.enable()):void Core.Ajax(r,"GET",d,function(e){e.getType="add",offset=e.message.offset,n=e.message.total,l.trigger("addData",e),t.refresh(),t.enable(),Core.changIsState(t,e)},!0,!1,!0)}var n,a,i,o=this,r=this.typeUrl(),l=$("#thelist"),d=($(".js-fd_icon"),{sort:"1",offset:0,limit:20,sortkey:"d",invtyp:"股票型",nature:null,typ:null,csftyp:"GPX"}),c="estimate"===o.type?"fund_blocks":"fund_block",u="estimate"===o.type?6:5,p="estimate"===o.type?"fund_headactives":"fund_headactive";Core.Ajax(Core.fundurl.invtyp,"GET",d,function(t){var e=[];"estimate"===o.type?Datas=[{label:"股票型",value:"股票型"},{label:"混合型",value:"混合型"},{label:"联接基金",value:"基金型"},{label:"ETF",value:"ETF"},{label:"分级基金A",value:"分级基金A"},{label:"分级基金B",value:"分级基金B"}]:Datas=t.message.result,$(Datas).each(function(t,s){e[t]=$('<div class="'+c+" "+("股票型"===s.label?p:"")+'"  data-index='+(t+1)+' data-code="'+s.value+'">'+s.label+"</div>")}),$(".fund_head").append(e).css({width:Datas.length*u+"rem"}),i=new iScroll("type",{hScrollbar:!0,vScrollbar:!1,checkDOMChanges:!0}),setTimeout(function(){$(".type_ctn").css({position:"fixed"})},2e3)},!0,!1,!0),$(".fund_head").delegate(" div","click",function(e){var s=$(this).data("index")-1,n=$(this).data("code"),a=$(this).text(),o=$(".js-custfund_value"),r=$(".js-sort_span"),l=$(".js-sort"),d=$(".js-sort_span");i.scrollToElement(document.querySelector(".fund_head div:nth-child("+(s<=1?1:s-1)+")"),null,null,!0),$(this).addClass(p).siblings().removeClass(p),"货币型"===a||"理财型"===a?(o.text("万份收益"),r.text("七日年化"),l.hide(),d.show().on("click",function(t){t.stopPropagation()})):(o.text("单位净值"),l.show(),d.hide()),t(n)}),l.on("addData",function(t,e){l.children().length>0&&"add"!==e.getType&&l.empty();var s=new Array;$(e.message.result).each(function(t,e){var n,a,i="estimate"===o.type?e.vchg:e.chg;if("--"===i?(n=i,a=""):i>0?(n="+"+i.toFixed(2)+"%",a="_up"):0==i.toFixed(2)?(n="0.00%",a="_none"):(n=i.toFixed(2)+"%",a="_down"),e.dt){var r=e.dt.split("-");e.dt=[r[1],r[2]].join("-")}s[t]=$("<li class='fund_data'>                                 <div class='fund_fi'><span class='fund_fname'>"+(e.name||e.fname)+"</span>                                 <span class = 'fund_fcode'> "+(e.code||e.fcode).split("_")[0]+"</span>                                 </div>                                 <div class = 'fund_se'> <span class = 'fund_net'> "+(e.vnet||e.net).toFixed(4)+"</span>                                 <span class='fund_dt'>"+e.dt+"</span > </div>                                 <div class = 'fund_chg "+a+" js-present'>                                 "+n+" </div> </li>"),s[t].on("click",{code:e.code||e.fcode},function(t){"货币型"===e.invtyp||"理财型"===e.invtyp?jumptopage("/static/fund/fund_details.html?fcode="+t.data.code):jumptopage("/static/fund/funddetail.html?fcode="+t.data.code)})}),l.append(s)}),Core.Ajax(r,"GET",d,function(t){t.getType="refresh",d.offset=t.message.offset,n=t.message.total,d.sortkey="d",l.trigger("addData",t),setTimeout(function(){a=Core.initIscroll("wrapper","pullDown","pullUp",e,s),Core.changIsState(a,t),o.initDom()},10),document.addEventListener("touchmove",function(t){t.preventDefault()},!1),$("body").fadeIn()},!0,!1,!0),$(".custfund_up").click(function(t){$(".sort_span").hasClass("sort_on")?($(".sort_span").removeClass("sort_on"),$(".sort_div").hide().children("i").show()):($(".sort_span").addClass("sort_on"),$(".sort_div").show().children("i[type='"+$(".sort_span").attr("type")+"']").hide()),t.stopPropagation()}),$(".sort_div i").click(function(){$(".sort_span").attr("type",$(this).attr("type")).text($(this).text()),$(".sort_span").append('<i class="arrow"></i>'),"cy"===$(this).attr("type")?$(".sort_span").css({"background-position":"6.2rem"}):$(".sort_span").css({"background-position":"5.8rem"}),t($(this).attr("type"),"sortkey")})},this.init=function(){this.initdata()},this.init()};new t,xx});
//# sourceMappingURL=rankinglist.js.map