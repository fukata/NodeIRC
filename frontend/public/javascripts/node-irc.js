$(function(){
	var $window = $(window);
	var $ui_container = $('#ui-container');
	var $header_navi_container = $('#header-navi-container');
	var $settings_sidebar_container = $('#settings-sidebar-container');
	var $contents_container = $('#contents-container');
	var $channel_container = $('#channel-container');
	var $channel_tabs = $('#channel-tabs');
	var $cha_dialog = $('#channel-add-dialog').dialog({
		autoOpen: false,
		draggable: false,
		width: '500',
		height: '400',
		maxWidth: '500',
		maxHeight: '400',
		modal: true,
		resizable: false,
		stack: false
	});

	$channel_tabs.tabs({
		select: function(event, ui) {
			var $tab = $(ui.tab);
			if ($tab.attr('id') != 'channel-add') {
				return true;
			}

			console.log('channel-add');
			$cha_dialog.dialog('open');
			return false;
		}
	});
	var $say_container = $('#say-container');
	var $say = $('#say').focus();

	var resize_ui = function() {
		$("button, div.users > ul > li > a").button();

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
			var $sidebar = $('div.sidebar', $contents);
			var $menu = $('div.menu', $sidebar);
			var $users = $('div.users', $sidebar);
			var uw = $users.outerWidth();
			//console.log("width: %s, outerWidth: %s, innerWidth: %s", $contents.width(), $contents.outerWidth(), $contents.innerWidth());
			$messages.width(~~($contents.width() - uw));

			var $tabs = $('ul.ui-tabs-nav', $channel_tabs);
			var contents_offset = $contents.outerHeight() - $contents.height();
			var cth = $channel_tabs.height();
			console.log("tabs.height: %s, contents_offset: %s, cth: %s", $tabs.height(), contents_offset, cth);
			var ch = ~~(cth - $tabs.outerHeight() - contents_offset);
			$contents.height(ch);
			$messages.height(ch);
			$sidebar.height(ch);
			$users.height(ch - $menu.outerHeight());
		});
	};

	resize_ui();
	$window.bind("resize", function(){
		resize_ui();
	});

	$('#channel-add-btn').click(function(){
		console.log('channel-add-btn');
		var $self = $(this);
		var field_enable = function(enabled) {
			enabled = !enabled || false;
			$('input, checkbox, select', $cha_dialog).attr('disabled', enabled);
			$self.attr('disabled', enabled);
			if (enabled) {
				$('.progress', $cha_dialog).show();
			} else {
				$('.progress', $cha_dialog).hide();
			}
		}
		field_enable(false);

		$.ajax({
			cache: false,
			url: "/channel",
			type: "POST",
			dataType: "json",
			timeout: 20000,
			success: function(data, dataType) {
				console.log('channel-add success');
				console.log(data);
				$('.errors', $cha_dialog).hide();
				// add channel tab
				var channel = data.channel;
				var contents = $('<div></div>').html(data.contents).text();
				var select = $channel_tabs.tabs('length') - 1;
				$channel_tabs.tabs('add', 'javascript:void(0)', channel, select);
				var $tab_link = $('ul.ui-tabs-nav > li', $channel_tabs).eq(select).find('a').eq(0);
				var tab_id = $tab_link.attr('href');
				console.log("tab_id: %s", tab_id);
				var $tab_content = $(tab_id).addClass("tabs-contents").addClass("clearfix");
				$tab_content.html(contents);
				$channel_tabs.tabs('select', select);

				// bind channel close
				$('div.channel-close-btn', $tab_content).click(function(){
					console.log("channel-close: tab_id=%s", tab_id);
					if (!confirm('退出しますか？')) return false;
				});

				// ui initialize
				$('div.sidebar > div.menu > div', $tab_content).hover(
					function() { $(this).addClass('ui-state-hover'); },
					function() { $(this).removeClass('ui-state-hover'); }
				);

				resize_ui();
				$cha_dialog.dialog('close');
			},
			error: function(request, textStatus, errorThrown) {
				console.log('channel-add error');
				error = request.responseText || errorThrown;
				$('.errors', $cha_dialog).show();
				$('.errors > .error', $cha_dialog).eq(0).text(error);
			},
			complete: function(request, textStatus) {
				console.log('channel-add complete');
				field_enable(true);
			}
		});
	});
});
