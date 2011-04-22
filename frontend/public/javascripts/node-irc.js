$(function(){
	$("button, div.users > ul > li > a").button();

	var $window = $(window);
	var $ui_container = $('#ui-container');
	var $header_navi_container = $('#header-navi-container');
	var $settings_sidebar_container = $('#settings-sidebar-container');
	var $contents_container = $('#contents-container');
	var $channel_container = $('#channel-container');
	var $channel_tabs = $('#channel-tabs');
	$channel_tabs.tabs({
		select: function(event, ui) {
			var $tab = $(ui.tab);
			if ($tab.attr('id') != 'channel-add') {
				return true;
			}

			console.log('channel-add');
			return false;
		}
	});
	var $say_container = $('#say-container');
	var $say = $('#say').focus();

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

		$channel_tabs.height($channel_container.innerHeight() - 8);

		$('div.tabs-contents').each(function(){
			var $contents = $(this);
			var $messages = $('div.messages', $contents);
			var $users = $('div.users', $contents);
			var uw = $users.outerWidth();
			//console.log("width: %s, outerWidth: %s, innerWidth: %s", $contents.width(), $contents.outerWidth(), $contents.innerWidth());
			$messages.width(~~($contents.width() - uw));

			var $tabs = $('ul.ui-tabs-nav', $channel_tabs);
			var contents_offset = $contents.outerHeight() - $contents.height();
			var cth = $channel_tabs.height();
			console.log("tabs.height: %s, contents_offset: %s, cth: %s", $tabs.height(), contents_offset, cth);
			var ch = cth - $tabs.outerHeight() - contents_offset;
			$contents.height(ch);
			$messages.height(ch);
			$users.height(ch);
		});
	};

	resize_ui();
	$window.bind("resize", function(){
		resize_ui();
	});
});
