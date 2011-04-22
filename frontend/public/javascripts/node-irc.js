$(function(){
	$("button").button();

	var $window = $(window);
	var $ui_container = $('#ui-container');
	var $header_navi_container = $('#header-navi-container');
	var $settings_sidebar_container = $('#settings-sidebar-container');
	var $contents_container = $('#contents-container');
	var $channel_container = $('#channel-container');
	var $say_container = $('#say-container');
	var $say = $('#say');

	var resize_ui = function() {
		var w = $window.width();
		var h = $window.height();
		var hnh = $header_navi_container.outerHeight();
		//console.log("width: %s", w);
		//console.log("height: %s", h);
		$ui_container.width(w);
		$ui_container.height(h);

		$settings_sidebar_container.height(h - hnh);

		var sscw = $settings_sidebar_container.outerWidth();
		$contents_container.width(w - sscw);
		$contents_container.height(h - hnh);

		var sch = $say_container.outerHeight();
		$channel_container.height(h - sch - hnh);

		var scw = $say_container.outerWidth();
		$say.width(scw - 100);
	};
	resize_ui();
	$window.bind("resize", function(){
		resize_ui();
	});
});
