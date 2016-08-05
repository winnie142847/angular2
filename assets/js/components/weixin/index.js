(function () {
	/* get and set weixin share config */
	var config = window.wxConfig || {title: '', desc: '', link:'', imgUrl:''};
	if ( ! config.title) config.title = $("title").text();
	if ( ! config.desc) config.desc = $("meta[name=description]").attr("content");
	if ( ! config.link) config.link = location.href;
	if ( ! config.imgUrl) config.imgUrl = __uri("../../../img/zhitou1.png");

	/* set weixin error event */
	wx.error(function (res) {
		Helper.debug("wx origin error : ");
		Helper.debug(res);
	});

	/* set weixin ready event */
	wx.ready(function () {
		// 分享到朋友圈
		wx.onMenuShareTimeline({
			title: config.title,
			link: config.link,
			imgUrl: config.imgUrl,
			success: function () {},
			cancel: function () {}
		});
		// 分享给朋友
		wx.onMenuShareAppMessage({
			title: config.title,
			desc: config.desc,
			link: config.link,
			imgUrl: config.imgUrl,
			success: function () {},
			cancel: function () {}
		});
		if (window.wxHideAllNonBaseMenuItem) {
			wx.hideAllNonBaseMenuItem();
		};
	});

	/* try to get weixin sign and set success event */
	(function (callback) {
		$.ajax({
			url: location.origin + '/weixin/sign',
			type: "GET",
			dataType: 'json',
			data: {url: location.href.replace(location.hash, '')},
			success: callback
		});
	})(function (res) {
		Helper.debug("get sign success from server : ");
		Helper.debug(res);

		wx.config({
			debug: location.hash === "#debug" ? true : false,
			appId: res.appid,
			timestamp: res.timestamp,
			nonceStr: res.noncestr,
			signature: res.signature,
			jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem']
		});
	});
})();
