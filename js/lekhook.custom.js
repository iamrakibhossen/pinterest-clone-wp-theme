jQuery(document).ready(function($) {
	var ios = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	var ie9below = false;
	if (document.all && !window.atob) { //http://tanalin.com/en/articles/ie-version-js/
		ie9below = true;
	}

	//masonry
	var $masonry = $('#masonry');
	var user_profile_follow = $('#user-profile-follow');
	var user_profile_boards = $('#user-profile-boards');
	var user_notifications = $('#user-notifications');

	if (obj_lekhook.infinitescroll != 'disable' && ($masonry.length || user_profile_follow.length || user_profile_boards.length ||  user_notifications.length)) {
		$('#navigation').css({'visibility':'hidden', 'height':'1px'});
	}
		
	if ($masonry.length) {
		if ($('.check-480px').css('float') == 'left') {
			$masonry.imagesLoaded(function() {
				$masonry.masonry({
					itemSelector : '.thumb',
					isFitWidth: true,
					transitionDuration: 0
				}).css('visibility', 'visible');
				
				if ($('#masonry .thumb').length == 1) {
					$('#masonry .thumb').css('width', '95%');
				}
				
				$('#ajax-loader-masonry').hide();
			});
		} else {
			$masonry.masonry({
				itemSelector : '.thumb',
				isFitWidth: true,
				transitionDuration: 0
			}).css('visibility', 'visible');
			$('#ajax-loader-masonry').hide();
		}
	}
	
	$(window).resize(function() {
		if ($masonry.length || user_profile_follow.length) {
			$masonry.width($(window).width()-28).masonry('reloadItems').masonry('layout');
		}
	});
	
	$(window).on('load resize', function() {
		//Adjust top menu
		if ($('.check-767px').css('float') == 'left') {
			$('body').css('padding-top', 0);
		} else {
			if (obj_lekhook.u == '0') {
				if ($('#topmenu').length && $('#top-message-wrapper').length) {
					$('body').css('padding-top', $('#topmenu').height() + $('#top-message-wrapper').height() + 24 + 'px');
				}
			} else {
				if ($('#topmenu').length) {
					$('body').css('padding-top', $('#topmenu').height() + 16 + 'px');
				}
			}
		}
		
		//top menu dropdown in mobile
		if ($('.check-767px').css('float') == 'left') {
			$(document).off('click', '#topmenu .dropdown-toggle').on('click', '#topmenu .dropdown-toggle', function() {
				$(this).next().toggle();
			});
		} else {
			$('#nav-main .dropdown-menu').removeAttr('style');
			$('#nav-main ul li').removeClass('open');
			$('#nav-main .dropdown-toggle').blur();
		}
		
		//tooltip
		if (!ios && $('.check-767px').css('float') == 'none') {
			$(document).tooltip({
				selector: '[rel=tooltip]'
			});
		}
		
		//Resize follow-wrapper
		if ($('.check-480px').css('float') == 'left' && $('#user-profile-follow').length) {
			$('.follow-wrapper .follow-user-posts-thumb').each(function(index, element) {
				$('.follow-user-posts').width($('.follow-user-name').width()-$('.follow-user-avatar').width()-6);
				$('.follow-user-posts-thumb').width($('.follow-user-posts').width()/2-4).height($('.follow-user-avatar').width()/2-2);
			});
		}
		
		if ($('.post-top-meta').length) {
			postTopMetaScroll();
		}
		
	});

	//close modal when click outside popup-overlay
	$(document).on('click', function(e) {
		if(!$(e.target).closest('.modal-dialog').length && !$(e.target).closest('#wp-link-wrap').length && !$(e.target).closest('#wp-link-backdrop').length) {
			if ($('#scrolltotop').next().attr('id') == 'popup-lightbox') {
				$('#popup-overlay').hide();
			} else {
				$('#popup-overlay').detach().insertAfter('#scrolltotop').hide();
			}
			$('.lekhook-modal').modal('hide');
			if ($('#post-lightbox').css('display') == 'block') {
				$('body').addClass('modal-open');
			}
		}
	});
	
	//close modal when click close
	$(document).on('click', '.modal .popup-close', function() {
		if ($('#scrolltotop').next().attr('id') == 'popup-lightbox') {
			$('#popup-overlay').hide();
		} else {
			$('#popup-overlay').detach().insertAfter('#scrolltotop').hide();
		}
		$('.lekhook-modal').modal('hide');
		if ($('#post-lightbox').css('display') == 'block') {
			$('body').addClass('modal-open');
		}
	});
	
	//login box popup
	//append form to loginbox such that wsl also works
	if (obj_lekhook.u == '0') {
		$('#loginbox').popover({
			content: function() {
				return $('#loginbox').data('wsl') + 
				'<div class="error-msg-loginbox"></div>\
				<form name="loginform_header" id="loginform_header" method="post">\
					<div class="form-group">\
						<label>' + obj_lekhook.__Username + '<br />\
						<input class="form-control" type="text" name="log" id="log" value="" tabindex="0" /></label>\
					</div>\
					<div class="form-group">\
						<label>' + obj_lekhook.__Password + '\
						(<a href="' + obj_lekhook.home_url + '/login-lpw/" tabindex="-1">' + obj_lekhook.__Forgot + '</a>)\
						<input class="form-control"type="password" name="pwd" id="pwd" value="" tabindex="0" /></label>\
					</div>\
					<input type="submit" class="btn btn-success" name="wp-submit" id="wp-submit" value="' + obj_lekhook.__Login + '" tabindex="0" />\
					<div class="ajax-loader-loginbox ajax-loader hide"></div>\
					<span id="loginbox-register">' + obj_lekhook.__or + ' <a href="' + obj_lekhook.home_url + '/signup/" tabindex="0">' + obj_lekhook.__SignUp + '</a></span>\
					<br />\
				</form>'
			},
			html: 'true',
			placement: 'bottom',
			title: obj_lekhook.__Welcome + '<button class="close" id="loginbox-close" type="button">&times;</button>'
		});
		
		$('#loginbox').on('shown.bs.popover', function () {
			$('.wp-social-login-widget a').each(function() {
				$(this).attr('onclick', 'window.location = "' + $(this).attr('href') + '"').removeAttr('href').css('cursor', 'pointer');
			});
		})
		
		$('#loginbox').on('click', function() {
			return false;
		});
		
		$(document).on('click', '#loginbox-close', function() {
			$('#loginbox').popover('hide');
		});
		
		//login box hide when click outside
		$(document).on('click', function(e) {
			if(!$(e.target).closest('.popover').length) {
				$('#loginbox').popover('hide');
			}
		});
		
		//login box process
		$(document).on('submit', '#loginform_header, #popup-login-form', function() {
			$('#loginform_header .ajax-loader-loginbox').css('display', 'inline-block');
			
			$('.error-msg-loginbox').hide();
			if ($('#log').val() == '' || $('#pwd').val() == '') {
				$('.error-msg-loginbox').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__pleaseenterbothusernameandpassword  + '</strong></div>').fadeIn();
				$('#loginform_header .ajax-loader-loginbox').hide();
				return false;
			}
			
			var data = {
				action: 'lekhook-ajax-login',
				nonce: obj_lekhook.nonce,
				log: $('#loginform_header #log').val(),
				pwd: $('#loginform_header #pwd').val()
			};
		
			$.ajax({
				type: 'post',
				url: obj_lekhook.ajaxurl,
				data: data,
				success: function(data) {
					if (data == 'error') {
						$('.error-msg-loginbox').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__incorrectusernamepassword  + '</strong></div>').fadeIn();
						$('#loginform_header .ajax-loader-loginbox').hide();
						return false;			
					} else {
						window.location.reload();
					}
				}
			});
		
			return false;
		});
	}
	
	//hide links in wsl
	if ($('.wp-social-login-widget').length) {
		$('.wp-social-login-widget a').each(function() {
			$(this).attr('onclick', 'window.location = "' + $(this).attr('href') + '"').removeAttr('href').css('cursor', 'pointer');
		});
	}

	//notification popup	
	$('#user-notifications-count').on('click', function() {
		if (!$(this).next('div.popover').length) {
			$('#user-notifications-count .tooltip').hide();
			$('#user-notifications-count')
			.popover({
				content: '<div class="ajax-loader"></div>',
				html: 'true',
				placement: 'bottom',
				trigger: 'manual',
				title: '<strong>' + obj_lekhook.__NotificationsLatest30 + ' (<a href="' + obj_lekhook.home_url + '/notifications/"><span>' + obj_lekhook.__SeeAll + '</span></a>)</strong> <button class="close" id="user-notifications-count-close" type="button">&times;</button>'
			})
			.popover('show');
			
			$('<div>').load(obj_lekhook.home_url + '/notifications/ #user-notifications-table', function() {
				$('#user-notifications-count').next('.popover').children('.popover-content').html($(this).html());
			});
		} else {
			$('#user-notifications-count').popover('hide');
			$('#user-notifications-count a span').text('0').parent().removeClass('user-notifications-count-nth');
		}
		return false;
	});
	
	$(document).on('click', '#user-notifications-count-close', function() {
		$('#user-notifications-count').popover('hide');
		$('#user-notifications-count a span').text('0').parent().removeClass('user-notifications-count-nth');
	});
	
	//notification hide when click outside
	$(document).on('click', function(e) {
		if(!$(e.target).closest('.popover').length && $('#user-notifications-count + div.popover').length) {
			$('#user-notifications-count').popover('hide');
			$('#user-notifications-count a span').text('0').parent().removeClass('user-notifications-count-nth');
		}
	});
	
	//scroll to top	
	$(window).scroll(function() {
		var $scrolltotop = $('#scrolltotop');
		
		if ($(this).scrollTop() > 100) {
			$scrolltotop.slideDown('fast');
		} else {
			$scrolltotop.slideUp('fast');
		}
		
		if ($('.post-top-meta').length) {
			postTopMetaScroll();
		}
	});

	$('#scrolltotop').click(function() {
		$('body,html').animate({
			scrollTop: 0
		}, 'fast');
		return false;
	});
	
	//post action bar scroll
	if ($('.post-top-meta').length) {
		var post_top_meta = $('.post-top-meta');
		var post_top_meta_top = post_top_meta.offset().top;
		var post_top_meta_bottom = post_top_meta_top + post_top_meta.outerHeight()-1;
	}
	
	function postTopMetaScroll() {
		if ($('.check-767px').css('float') == 'none') {
			var topmenu_bottom, topmenu_top;
			if ($('#top-message-wrapper').length) {
				topmenu_bottom = $('#top-message-wrapper').offset().top+$('#top-message-wrapper').height();
				topmenu_top = $('#top-message-wrapper').outerHeight() + $('#topmenu').height();
			} else {
				topmenu_bottom = $('#topmenu').offset().top+$('#topmenu').height();
				topmenu_top = $('#topmenu').height();
			}
	
			var post_top_meta_left = $('#post-featured-photo').offset().left;
			if (post_top_meta_top <= topmenu_bottom && $(this).scrollTop() <= ($('#post-featured-photo').offset().top + $('#post-featured-photo').outerHeight()-post_top_meta_bottom+10)) {
				$('.post-top-meta').css({'opacity': '0.95', 'position': 'fixed', 'top': topmenu_top, 'left': post_top_meta_left, 'width': $('#post-featured-photo').outerWidth()});
				$('.post-top-meta-placeholder').css('height', post_top_meta.outerHeight()-1).show();
			} else if ($(this).scrollTop() > ($('#post-featured-photo').offset().top + $('#post-featured-photo').outerHeight()-post_top_meta_bottom+10)) {
				$('.post-top-meta').css({'position': 'absolute', 'top': ($('#post-featured-photo').offset().top + $('#post-featured-photo').outerHeight() - post_top_meta_bottom), 'left': 16});
			} else {
				$('.post-top-meta').css({'opacity': '1', 'position': 'relative', 'top': 0, 'left': 0, 'width': 'auto'});
				$('.post-top-meta-placeholder').hide();
			}
		} else {
			$('.post-top-meta').css({'opacity': '1', 'position': 'relative', 'top': 0, 'left': 0, 'width': 'auto'});
			$('.post-top-meta-placeholder').hide();
		}
	}

	//likes for frontpage, lightbox, posts
	$(document).on('click', '.lekhook-like', function() {
		if (obj_lekhook.u != '0') {
			var like = $(this);
			var	post_id = like.data('post_id');

			like.attr('disabled', 'disabled').css('pointer-events', 'none');

			if (!like.hasClass('disabled')) {
				var data = {
					action: 'lekhook-like',
					nonce: obj_lekhook.nonce,
					post_id: post_id,
					post_author: like.data('post_author'),
					lekhook_like: 'like'
				};

				$.ajax({
					type: 'post',
					url: obj_lekhook.ajaxurl,
					data: data,
					success: function(count) {
						$('[id=lekhook-like-'+post_id+']').addClass('disabled').removeAttr('disabled').css('pointer-events', 'auto');
						$('[id=likes-count-'+post_id+']').addClass('disabled');
						
						if (count == 1) {
							if ($('#post-reposts').length) {
								$('#post-reposts').before('<div class="post-likes"><div class="post-likes-wrapper"><h4>' + obj_lekhook.__Likes + '</h4><div class="post-likes-avatar"><a href="' + obj_lekhook.home_url + '/' + obj_lekhook.user_rewrite + '/' + obj_lekhook.ul + '/" rel="tooltip" title="' + obj_lekhook.ui + '">' + obj_lekhook.avatar48 + '</a></div></div></div>');
							} else {
								$('#post-embed-box').before('<div class="post-likes"><div class="post-likes-wrapper"><h4>' + obj_lekhook.__Likes + '</h4><div class="post-likes-avatar"><a href="' + obj_lekhook.home_url + '/' + obj_lekhook.user_rewrite + '/' + obj_lekhook.ul + '/" rel="tooltip" title="' + obj_lekhook.ui + '">' + obj_lekhook.avatar48 + '</a></div></div></div>');
							}
							$('[id=likes-count-'+post_id+']').removeClass('hide').html('<i class="fa fa-heart"></i> 1');
							$('#button-likes-count').html('&nbsp; 1');
							if($('#masonry').length) {
								$('#masonry').masonry('reloadItems').masonry('layout');
							}
						} else {
							$('.post-likes-avatar').append('<a id=likes-' + obj_lekhook.u +  ' href="' + obj_lekhook.home_url + '/' + obj_lekhook.user_rewrite + '/' + obj_lekhook.ul + '/" rel="tooltip" title="' + obj_lekhook.ui + '">' + obj_lekhook.avatar48 + '</a>');
							$('[id=likes-count-'+post_id+']').html('<i class="fa fa-heart"></i> ' + count);
							$('#button-likes-count').html('&nbsp; ' + count);
						}
					}
				});
			} else {
				var data = {
					action: 'lekhook-like',
					nonce: obj_lekhook.nonce,
					post_id: post_id,
					lekhook_like: 'unlike'
				};

				$.ajax({
					type: 'post',
					url: obj_lekhook.ajaxurl,
					data: data,
					success: function(count) {
						$('[id=lekhook-like-'+post_id+']').removeClass('disabled').removeAttr('disabled').css('pointer-events', 'auto');
						$('#post-' + post_id + ' .lekhook-like').removeClass('disabled');

						if (count == 0) {
							$('.post-likes').remove();
							$('[id=likes-count-'+post_id+']').addClass('hide').text('');
							$('#button-likes-count').text('');
							if($('#masonry').length) {
								$('#masonry').masonry('reloadItems').masonry('layout');
							}
						} else {
							$('#likes-' + obj_lekhook.u).remove();
							$('[id=likes-count-'+post_id+']').html('<i class="fa fa-heart"></i> ' + count);
							$('#button-likes-count').html('&nbsp; ' + count);
						}
					}
				});
			}
			return false;
		} else {
			loginPopup();
			return false;
		}
	});

	//repost show form for frontpage, lightbox, posts
	$(document).on('click', '.lekhook-repost', function() {
		if (obj_lekhook.u != '0') {
			var repost = $(this);
			var post_id = repost.data('post_id');
			var post_description = $('#masonry #post-' + post_id + ' .post-title').data('title');
			var post_content = $('#masonry #post-' + post_id + ' .post-title').data('content');
			var post_tags = $('#post-' + post_id + ' .post-title').data('tags');
			var post_price = $('#post-' + post_id + ' .post-title').data('price');
			
			if ($('#post-lightbox').css('display') == 'block') {
				if (!ie9below) {
					window.history.back();
				}
			}
			
			//use ajax fetch boards if user created a new board
			if ($('#newboard').length) {
				//populate board field
				var data = {
					action: 'lekhook-repost-board-populate',
					nonce: obj_lekhook.nonce
				};
				
				$.ajax({
					type: 'post',
					url: obj_lekhook.ajaxurl,
					data: data,
					success: function(data) {
						$('#board').remove();
						$('#repostform-add-new-board').after(data);

						//when in single-post.php
						if (!post_description) {
							post_description = $('#post-' + post_id + ' .post-title').data('title');
							post_content = $('#post-' + post_id + ' .post-title').data('content');
						}
						
						$('#post-lightbox').modal('hide');
						$('#post-repost-box .post-repost-box-photo').html('<img src="' + $('#post-' + post_id + ' .featured-thumb').attr('src') + '" />');
						tmce_setContent(post_description, 'post-title');
						tmce_setContent(post_content, 'post-content');
						$('#post-repost-box #tags').val(post_tags);
						$('#post-repost-box #price').val(post_price);
						$('#repostform-add-new-board').text(obj_lekhook.__addnewboard);
						$('#repostform #board-add-new').val('').hide();
						$('#repostform #board-add-new-category').val('-1').hide();
						$('#repostform #board').show();
						$('#repostform #repost-post-id').val(post_id);
						$('#repostnedmsg, .repostnedmsg-share').hide();
						$('#repostform').show();

						$('#popup-overlay').show();
						$('#post-repost-box').modal();

						setTimeout(function() {
							tmce_focus('post-title');

							if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
								$('#postit').removeAttr('disabled');
							} else {
								$('#postit').attr('disabled', 'disabled');
							}
							
							if ($('#post-title_ifr').length) {
								$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
									if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
										$('#postit').removeAttr('disabled');
									} else {
										$('#postit').attr('disabled', 'disabled');
									}
								});
							}
						}, 500);
					}
				});
				
				$('#newboard').remove();
			} else {
				//when in single-post.php
				if (!post_description) {
					post_description = $('#post-' + post_id + ' .post-title').data('title');
					post_content = $('#post-' + post_id + ' .post-title').data('content');
				} else {
					$('#video-embed').remove(); //hide youtube player if not in single-post.php
				}

				$('#post-lightbox').modal('hide');
				
				//ajax fetch boards for first time
				if ($('#post-repost-box').length == 0){
					//populate board field
					var data = {
						action: 'lekhook-repost-board-populate',
						nonce: obj_lekhook.nonce
					};
					
					$.ajax({
						type: 'post',
						url: obj_lekhook.ajaxurl,
						data: data,
						success: function(data) {
							$('body').append('\
								<div class="modal lekhook-modal" id="post-repost-box" data-backdrop="false" data-keyboard="false" aria-hidden="true" role="dialog">\
									<div class="modal-dialog">\
										<div class="modal-content">\
											<button class="close popup-close" data-dismiss="modal" aria-hidden="true" type="button">&times;</button>\
											<div class="clearfix"></div>\
											<div class="post-repost-box-photo"></div>\
											<form id="repostform">\
												' + obj_lekhook.description_fields + '\
												<p></p>\
												' + obj_lekhook.tags_html + '\
												' + obj_lekhook.price_html + '\
												<a id="repostform-add-new-board" class="btn btn-default pull-right" href="#" tabindex="-1">' + obj_lekhook.__addnewboard + '</a>\
												' + data + '\
												<input id="board-add-new" class="form-control board-add-new" type="text" placeholder="' + obj_lekhook.__enternewboardtitle + '" />\
												' + obj_lekhook.categories + '\
												<input id="repost-post-id" type="hidden" name="repost-post-id" value="" />\
												<div class="clearfix"></div>\
												<input class="btn btn-success btn-block btn-lekhook-custom" type="submit" name="postit" id="postit" value="' + obj_lekhook.__Repost + '" /> \
												<span id="repost-status"></span>\
											</form>\
										</div>\
									</div>\
								</div>\
							');

							if (typeof tinymce !== 'undefined') {
								if ($('textarea#post-content').length) {
									tinymce.init(tinyMCEPreInit.mceInit['post-content']);
								} else {
									tinymce.init(tinyMCEPreInit.mceInit['post-title']);
								}
							}
							
							$('#post-repost-box .post-repost-box-photo').html('<img src="' + $('#post-' + post_id + ' .featured-thumb').attr('src') + '" />');
							tmce_setContent(post_description, 'post-title');
							tmce_setContent(post_content, 'post-content');
							$('#post-repost-box #tags').val(post_tags);
							$('#post-repost-box #price').val(post_price);
							$('#repostform-add-new-board').text(obj_lekhook.__addnewboard);
							$('#repostform #board-add-new').val('').hide();
							$('#repostform #board-add-new-category').val('-1').hide();
							$('#repostform #board').show();
							$('#repostform #repost-post-id').val(post_id);
							$('#repostnedmsg, .repostnedmsg-share').hide();
							$('#repostform').show();

							$('#popup-overlay').show();
							$('#post-repost-box').modal();
							
							setTimeout(function() {
								tmce_focus('post-title');

								if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
									$('#postit').removeAttr('disabled');
								} else {
									$('#postit').attr('disabled', 'disabled');
								}
								
								if ($('#post-title_ifr').length) {
									$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
										if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
											$('#postit').removeAttr('disabled');
										} else {
											$('#postit').attr('disabled', 'disabled');
										}
									});
								}
							}, 500);
							
							//autocomplete tags
							$.getScript(obj_lekhook.site_url + '/wp-includes/js/jquery/suggest.min.js', function() {
								$('input#tags').suggest(obj_lekhook.ajaxurl + '?action=ajax-tag-search&tax=post_tag', {minchars: 3, multiple: true});
							});
						}
					});
				} else {
					$('#post-repost-box .post-repost-box-photo').html('<img src="' + $('#post-' + post_id + ' .featured-thumb').attr('src') + '" />');
					tmce_setContent(post_description, 'post-title');
					tmce_setContent(post_content, 'post-content');
					$('#post-repost-box #tags').val(post_tags);
					$('#post-repost-box #price').val(post_price);
					$('#repostform-add-new-board').text(obj_lekhook.__addnewboard);
					$('#repostform #board-add-new').val('').hide();
					$('#repostform #board-add-new-category').val('-1').hide();
					$('#repostform #board').show();
					$('#repostform #repost-post-id').val(post_id);
					$('#repostnedmsg, .repostnedmsg-share').hide();
					$('#repostform').show();

					$('#popup-overlay').show();
					$('#post-repost-box').modal();

					setTimeout(function() {
						tmce_focus('post-title');

						if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
							$('#postit').removeAttr('disabled');
						} else {
							$('#postit').attr('disabled', 'disabled');
						}
						
						if ($('#post-title_ifr').length) {
							$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
								if (tmce_getContent('post-title') != ''&& ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
									$('#postit').removeAttr('disabled');
								} else {
									$('#postit').attr('disabled', 'disabled');
								}
							});
						}
					}, 500);
				}
			}
			return false;
		} else {
			loginPopup();
			return false;
		}
	});
	
	//disable submit button if empty textarea and no board
	$(document).on('focus', '#post-repost-box textarea#post-title', function() {
		if ($.trim($('#repostform textarea#post-title').val()) && ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
			$('#postit').removeAttr('disabled');
		} else {
			$('#postit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#repostform textarea#post-title').val()) && ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	});
	
	$(document).on('focus', '#post-repost-box #board-add-new', function() {
		var content = '';
		if ($('#post-title_ifr').length) {
			content = tmce_getContent('post-title');
		} else {
			content = $.trim($('#repostform textarea#post-title').val());
		}
		
		$(this).keyup(function() {
			if ($('#post-title_ifr').length) {
				content = tmce_getContent('post-title');
			} else {
				content = $.trim($('#repostform textarea#post-title').val());
			}
			
			if (content && ($('#repostform #board').val() != '-1' || $.trim($('#repostform #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	});
	
	//prevent form submit on enter key
	$(document).on('keypress', '#board-add-new', function(e) {
		return e.keyCode != 13;
	});
	
	//repost form add new board toggle
	$(document).on('click', '#repostform-add-new-board', function() {
		if ($(this).text() == obj_lekhook.__cancel) {
			if($('#noboard').length) {
				$('#postit').attr('disabled', 'disabled');
			}
			$(this).text(obj_lekhook.__addnewboard);
			$('#repostform #board-add-new').val('').hide();
			$('#repostform #board-add-new-category').val('-1').hide();
			$('#repostform #board').show().focus();
		} else {
			$(this).text(obj_lekhook.__cancel);
			$('#repostform #board-add-new').show().focus();
			$('#repostform #board-add-new-category').show();
			$('#repostform #board').hide();
		}
		return false;
	});
	
	//repost for frontpage, lightbox, posts
	$(document).on('submit', '#repostform', function() {
		var repost_status = $('#repost-status');
		repost_status.html('');
		repost_status.html(' <div class="ajax-loader"></div>');
		
		//empty title
		if (!$.trim($('#repostform textarea#post-title').val())) {
			repost_status.html('<div class="alert alert-warning text-center"><strong>' + obj_lekhook.__Pleaseentertitle  + '</strong></div>').fadeIn();
			return false;
		}
		
		//empty board
		if ($('#repostform #board').val() == '-1' && $.trim($('#repostform #board-add-new').val()) == '') {
			repost_status.html('<div class="alert alert-warning text-center"><strong>' + obj_lekhook.__Pleasecreateanewboard  + '</strong></div>').fadeIn();
			return false;
		}

		$(this).find('input[type="submit"]').attr('disabled', 'disabled');
		
		var post_id = $('#repostform #repost-post-id').val();
		var price = '';
		if ($('#repostform #price').length)
			price = $('#repostform #price').val().replace(/[^0-9.]/g, '');
		var data = {
			action: 'lekhook-repost',
			nonce: obj_lekhook.nonce,
			repost_title: tmce_getContent('post-title'),
			repost_content: tmce_getContent('post-content'),
			repost_tags: $('#repostform #tags').val(),
			repost_price: price,
			repost_post_id: post_id,
			repost_board: $('#repostform #board').val(),
			repost_board_add_new: $('#repostform #board-add-new').val(),
			repost_board_add_new_category: $('#repostform #board-add-new-category').val()
		};
		
		//if user create a new board, inject a span to indicate to ajax fetch board next round
		if ($('#repostform #board-add-new').val() != '') {
			repost_status.after('<span id="newboard"></span>');
		}
		
		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			error: function() {
				repost_status.html('<div class="alert alert-warning text-center"><strong><small>' + obj_lekhook.__errorpleasetryagain  + '</small></strong></div>');
			},
			success: function(data) {
				repost_status.html('');
				$('#repostform').hide();
				if ($('#repostform #board-add-new').val() == '') {
					board_name = $('#repostform #board option:selected').text();
				} else {
					board_name = $('#repostform #board-add-new').val();
				}
				$('#post-repost-box .post-repost-box-photo').after('<h3 id="repostnedmsg" class="text-center">' + obj_lekhook.__repostnedto + ' ' + board_name + '<p></p><a class="btn btn-success" href="' + data + '" aria-hidden="true"><strong>' + obj_lekhook.__seethispost + '</strong></a> <a class="btn btn-success popup-close" data-dismiss="modal" aria-hidden="true"><strong>' + obj_lekhook.__close + '</strong></a></h3><h5 class="repostnedmsg-share text-center"><strong>' + obj_lekhook.__shareitwithyourfriends + '</strong></h5><p class="repostnedmsg-share text-center"><a class="btn btn-primary btn-sm" href="" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(data) + '\', \'facebook-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-facebook fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'https://twitter.com/share?url=' + data + '&amp;text=' + encodeURIComponent($('#repostform textarea#post-title').val()) + '\', \'twitter-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-twitter fa-fw"></i></a> <a class="btn btn-danger btn-sm" href="" onclick="window.open(\'https://plus.google.com/share?url=' + data + '\', \'gplus-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-google-plus fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'http://www.reddit.com/submit?url=' + encodeURIComponent(data) + '&amp;title=' + encodeURIComponent($('#repostform textarea#post-title').val()) + '\', \'reddit-share-dialog\', \'width=880,height=500,scrollbars=1\'); return false;"><i class="fa fa-reddit fa-fw"></i></a></p>');
					
				var newrepost = '<li><a class="post-reposts-avatar">' + obj_lekhook.avatar48 + '</a> <a href="' + obj_lekhook.home_url + '/' + obj_lekhook.user_rewrite + '/' + obj_lekhook.ul + '/">' + obj_lekhook.ui + '</a> ' + obj_lekhook.__onto + ' <strong>' + $('#repostform #board option:selected').text() + '</strong></li>';

				if (!$('#post-reposts').length) {
					$('.post-wrapper').append('<div id="post-reposts"><div class="post-reposts-wrapper"><h4>' + obj_lekhook.__Reposts + '</h4><ul></ul></div></div>');
				}
				$('#post-reposts ul').append(newrepost);

				var reposts_countmsg = $('#reposts-count-'+post_id);
				var reposts_count = reposts_countmsg.text();
				reposts_count = reposts_count.substring(reposts_count.lastIndexOf(' '));
				
				if (reposts_count == '') {
					$('#reposts-count-'+post_id).removeClass('hide').html('<i class="fa fa-retweet"></i> 1');
					if($('#masonry').length) {
						$('#masonry').masonry('reloadItems').masonry('layout');
					}
				} else {
					$('#reposts-count-'+post_id).html('<i class="fa fa-retweet"></i> ' + (parseInt(reposts_count,10)+1));
				}
				
				//for single post count increment
				var button_reposts_count = $('#button-reposts-count');
				if (button_reposts_count.text() == '') {
					button_reposts_count.html('&nbsp; 1');
				} else {
					button_reposts_count.html('&nbsp; ' + parseInt(button_reposts_count.text(),10)+1);
				}
				
			}
		});
		return false;
	});
	
	//comments for lightbox and posts
	$(document).on('submit', '#commentform', function() {
		if (obj_lekhook.u != '0') {
			var commentform = $(this);
			
			if ($.trim($(this).find('#comment').val()) == '') {
				$('#comment-status').remove();
				$('.comment-status-ajax-loader').remove();
				$('.textarea-wrapper').prepend('<div id="comment-status"></div>');
				$('#comment-status').html('<div class="alert alert-warning"><strong><small>' + obj_lekhook.__Pleasetypeacomment + '</small></strong></div>');
				$('#commentform textarea').focus();
				return false;
			}
			
			commentform.find('input[type="submit"]').attr('disabled', 'disabled');
	
			var post_id = $('#commentform #comment_post_ID').val();
			var formdata = $(this).serialize();
			var formurl = $(this).attr('action');
			var comment_parent = $('#commentform #comment_parent').val();
			
			$('#comment-status').remove();
			$('.form-submit').prepend('<div class="comment-status-ajax-loader ajax-loader ajax-loader-inline pull-right" style="margin: 15px 0 0 5px;"></div>');
			
			$.ajax({
				type: 'post',
				url: formurl,
				data: formdata,
				error: function(XMLHttpRequest) {
					var errormsg = XMLHttpRequest.responseText.substr(XMLHttpRequest.responseText.indexOf('<p>')+3);
					errormsg = errormsg.substr(0, errormsg.indexOf('</p>'));
					
					if (errormsg == '') {
						errormsg = obj_lekhook.__errorpleasetryagain;
					}
					
					$('.textarea-wrapper').prepend('<div id="comment-status"></div>');
					$('.comment-status-ajax-loader').remove();
					$('#comment-status').html('<div class="alert alert-warning"><strong><small>' + errormsg + '</small></strong></div>');
					$('#commentform textarea').focus();
					commentform.find('input[type="submit"]').removeAttr('disabled');
				},
				success: function() {
					var commenttext =  $('#commentform #comment').val();
					var newcomment = '<li><div class="comment-avatar">' + obj_lekhook.avatar48 + '</div><div class="comment-content"><strong><span class="comment"><a href="' + obj_lekhook.home_url + '/' + obj_lekhook.user_rewrite + '/' + obj_lekhook.ul + '/">' + obj_lekhook.ui + '</a></span></strong> <span class="text-muted">&#8226; ' + obj_lekhook.current_date + '</span><p>' + commenttext.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</p></div></li>';
	
					$('.comment-status-ajax-loader').remove();
					$('#commentform #comment').val('');
					$('#commentform #comment_parent').val('');
					
					if (comment_parent == '0' || comment_parent == '' ) {
						if ($('#comments').find('.commentlist').size() == 0) {
							$('#comments').prepend('<ol class="commentlist"></ol>');
						}
						$('.commentlist').append(newcomment);
					} else {
						if ($('#comment-' + comment_parent).find('>ul.children').size() == 0) {
							$('#comment-' + comment_parent).append('<ul class="children"></ul>');
						}
						$('#comment-' + comment_parent + ' >ul.children').append(newcomment);
					}
					
					var comments_countmsg = $('#comments-count-'+post_id);
					var comments_count = comments_countmsg.text();
					comments_count = comments_count.substring(comments_count.lastIndexOf(' '));
	
					if (comments_count == '') {
						$('#comments-count-'+post_id).removeClass('hide').html('<i class="fa fa-comment"></i> 1');
					} else {
						$('#comments-count-'+post_id).html('<i class="fa fa-comment"></i> ' + (parseInt(comments_count,10)+1));
					}
					
					var newcomment_masonry = '<div id="masonry-meta-comment-wrapper-' + post_id + '" class="masonry-meta"><div class="masonry-meta-avatar">' + obj_lekhook.avatar30 + '</div><div class="masonry-meta-comment"><span class="masonry-meta-author">' + obj_lekhook.ui + '</span><span class="masonry-meta-comment-content"> ' + commenttext + '</span></div></div>';
					$('[id=masonry-meta-commentform-' + post_id + ']').prev().append(newcomment_masonry);
					
					if ($('#post-masonry #masonry').length) {
						$('#post-masonry #masonry').masonry('reloadItems').masonry('layout');
					}
					
					if ($('#masonry').length) {
						$('#masonry').masonry('reloadItems').masonry('layout');
					}
					
					commentform.find('input[type="submit"]').removeAttr('disabled');
				}
			});
		} else {
			loginPopup();
		}
		return false;
	});
	
	//Zoom full size photo
	$(document).on('click', '.lekhook-zoom', function() {
		$('#post-zoom-overlay').show();
		$('.lightbox-content img').attr('src', $('.lightbox-content img').data('src'));
		$('#post-fullsize').lightbox({backdrop:false, keyboard:false});
		return false;
	});
	
	$(document).on('click', '#post-fullsize-close', function() {
		$('#post-zoom-overlay').fadeOut();
		$('#post-fullsize').lightbox('hide');
		return false;
	});
	
	$(document).on('click', '#post-zoom-overlay', function() {
		$('#post-zoom-overlay').fadeOut();
		$('#post-fullsize').lightbox('hide');
	});

	//Embed for lightbox & posts
	$(document).on('click', '.post-embed', function() {
		$('#popup-overlay').detach().insertAfter('#post-report-box').show();
		$('#post-embed-box').modal();
		$('#post-embed-box textarea').focus().select();
		if (ios) {
			$('body').scrollTop(0);
		}
		return false;
	});

	$(document).on('keydown', '#embed-width', function() {
		old_height = $('#embed-height').val();
		old_width_str = "width=\'" + $(this).val() + "'";
		old_height_str = "height=\'" + $('#embed-height').val() + "'";
		ratio = $('.post-featured-photo img').width() / $('.post-featured-photo img').height();
	}).on('keyup', '#embed-width', function() {
		var embed_code = $('#post-embed-box textarea').val();
		var new_height = Math.ceil($(this).val()/ratio);
		var new_height_str = "height='" + new_height + "'";
		var new_width_str = "width='" + $(this).val() + "'";
		
		$('#embed-height').val(new_height);
		embed_code = embed_code.replace(old_height_str, new_height_str);
		embed_code = embed_code.replace(old_width_str, new_width_str);
		$('#post-embed-box textarea').val(embed_code);
	});
	
	$(document).on('keydown', '#embed-height', function() {
		old_width = $('#embed-width').val();
		old_width_str = "width=\'" + $('#embed-width').val() + "'";
		old_height_str = "height=\'" + $(this).val() + "'";
		ratio = $('.post-featured-photo img').width() / $('.post-featured-photo img').height();
	}).on('keyup', '#embed-height', function() {
		var embed_code = $('#post-embed-box textarea').val();
		var new_width = Math.ceil($(this).val()*ratio);
		var new_width_str = "width='" + new_width + "'";
		var new_height_str = "height='" + $(this).val() + "'";
		
		$('#embed-width').val(new_width);
		embed_code = embed_code.replace(old_height_str, new_height_str);
		embed_code = embed_code.replace(old_width_str, new_width_str);
		$('#post-embed-box textarea').val(embed_code);
	});
	
	//Email friend for lightbox & posts
	$(document).on('click', '.post-email', function() {
		if (obj_lekhook.u != '0') {
			if ($('#post-lightbox').css('display') != 'block') {
			$('#popup-overlay').detach().insertAfter('#post-report-box').show();
			}
			$('#post-email-box').modal();
			$('#post-email-box #recipient-name').focus();
			if (ios) {
				$('body').scrollTop(0);
			}
			return false;
		} else {
			loginPopup();
			return false;
		}
	});
	
	$(document).on('click', '#post-email-submit', function() {
		$('#post-email-box .ajax-loader-email-post').show();
		var data = {
			action: 'lekhook-post-email',
			nonce: obj_lekhook.nonce,
			email_post_id: $('#post-email-box #email-post-id').val(),
			recipient_name: $('#post-email-box #recipient-name').val(),
			recipient_email: $('#post-email-box #recipient-email').val(),
			recipient_message: $('#post-email-box textarea').val()
		};
	
		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function() {
				$('#post-email-box .ajax-loader-email-post').hide();
				$('#popup-overlay').hide();
				$('#post-email-box').modal('hide');
			}
		});
		return false;
	});
	
	//Email friend - disable submit button if empty recipient name and email
	$(document).on('focus', '#post-email-box #recipient-name', function() {
		if ($.trim($('#post-email-box #recipient-name').val()) && $.trim($('#post-email-box #recipient-email').val())) {
			$('#post-email-box #post-email-submit').removeAttr('disabled');
		} else {
			$('#post-email-box #post-email-submit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#post-email-box #recipient-name').val()) && $.trim($('#post-email-box #recipient-email').val())) {
				$('#post-email-box #post-email-submit').removeAttr('disabled');
			} else {
				$('#post-email-box #post-email-submit').attr('disabled', 'disabled');
			}
		});
	});
	
	$(document).on('focus', '#post-email-box #recipient-email', function() {
		if ($.trim($('#post-email-box #recipient-name').val()) && $.trim($('#post-email-box #recipient-email').val())) {
			$('#post-email-box #post-email-submit').removeAttr('disabled');
		} else {
			$('#post-email-box #post-email-submit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#post-email-box #recipient-name').val()) && $.trim($('#post-email-box #recipient-email').val())) {
				$('#post-email-box #post-email-submit').removeAttr('disabled');
			} else {
				$('#post-email-box #post-email-submit').attr('disabled', 'disabled');
			}
		});
	});
	
	//Report post for lightbox & posts
	$(document).on('click', '.post-report', function() {
		$('#popup-overlay').detach().insertAfter('#post-report-box').show();
		$('#post-report-box').modal();
		$('#post-report-box .alert, #post-report-box #post-report-close').hide();
		$('#post-report-box textarea, #post-report-box #post-report-submit').show();
		$('#post-report-box textarea').val('').focus();
		if (ios) {
			$('body').scrollTop(0);
		}
		return false;
	});
	
	$(document).on('click', '#post-report-submit', function() {
		$('#post-report-box .ajax-loader-report-post').show();
		$('#post-report-box #post-report-submit').attr('disabled', 'disabled');
		
		var data = {
			action: 'lekhook-post-report',
			nonce: obj_lekhook.nonce,
			report_post_id: $('#post-report-box #report-post-id').val(),
			report_message: $('#post-report-box textarea').val()
		};
	
		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function() {
				$('#post-report-box .ajax-loader-report-post, #post-report-box textarea, #post-report-box #post-report-submit').hide();
				$('#post-report-box .alert, #post-report-box #post-report-close').show();
			}
		});
		return false;
	});
	
	$(document).on('click', '#post-report-box #post-report-close', function() {
		$('#popup-overlay').hide();
		$('#post-report-box').modal('hide');
	});
	
	//Report post - disable submit button if empty message
	$(document).on('focus', '#post-report-box textarea', function() {
		if ($.trim($('#post-report-box textarea').val())) {
			$('#post-report-box #post-report-submit').removeAttr('disabled');
		} else {
			$('#post-report-box #post-report-submit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#post-report-box textarea').val())) {
				$('#post-report-box #post-report-submit').removeAttr('disabled');
			} else {
				$('#post-report-box #post-report-submit').attr('disabled', 'disabled');
			}
		});
	});
	
	//follow for lightbox, posts, author
	$(document).on('click', '.lekhook-follow', function() {
		if (obj_lekhook.u != '0') {
			var follow = $(this);
			var	board_parent_id = follow.data('board_parent_id');
			var	board_id = follow.data('board_id');
			var	author_id = follow.data('author_id');
			var	disable_others = follow.data('disable_others');
			follow.attr('disabled', 'disabled');
								
			if (!follow.hasClass('disabled')) {
				var data = {
					action: 'lekhook-follow',
					nonce: obj_lekhook.nonce,
					lekhook_follow: 'follow',
					board_parent_id: board_parent_id,
					board_id: board_id,
					author_id: author_id,
					disable_others: disable_others
				};

				$.ajax({
					type: 'post',
					url: obj_lekhook.ajaxurl,
					data: data,
					success: function() {
						if (follow.data('board_parent_id') != 0) {
							follow.addClass('disabled').text(obj_lekhook.__UnfollowBoard).removeAttr('disabled');
						} else {
							follow.addClass('disabled').text(obj_lekhook.__Unfollow).removeAttr('disabled');
						}
						
						//increase followers count in author.php
						if ($('#ajax-follower-count') && follow.parent().parent().parent().parent().attr('id') == 'userbar') {
							$('#ajax-follower-count').html(parseInt($('#ajax-follower-count').html(), 10)+1);
						}
						
						//disable other follow button
						if (board_parent_id == '0' && (disable_others != 'no' || $('#userbar .nav li:first').hasClass('active'))) {
							$('.lekhook-follow').each(function() {
								if ($(this).data('board_parent_id') != 0) {
									$(this).addClass('disabled').text(obj_lekhook.__UnfollowBoard);
								}
							});
						}
					}
				});
			} else {						
				var data = {
					action: 'lekhook-follow',
					nonce: obj_lekhook.nonce,
					lekhook_follow: 'unfollow',
					board_parent_id: board_parent_id,
					board_id: board_id,
					author_id: author_id
				};

				$.ajax({
					type: 'post',
					url: obj_lekhook.ajaxurl,
					data: data,
					success: function(data) {
						if (follow.data('board_parent_id') != 0) {		
							follow.removeClass('disabled').text(obj_lekhook.__FollowBoard).removeAttr('disabled');
						} else {
							follow.removeClass('disabled').text(obj_lekhook.__Follow).removeAttr('disabled');
						}
						
						//decrease followers count in author.php
						if ($('#ajax-follower-count') && follow.parent().parent().parent().parent().attr('id') == 'userbar') {
							$('#ajax-follower-count').html(parseInt($('#ajax-follower-count').html(), 10)-1);
						}
						
						//enable other follow button
						if (data == 'unfollow_all' && (disable_others != 'no' || $('#userbar .nav li:first').hasClass('active'))) {
							$('.lekhook-follow').each(function() {
								if ($(this).data('board_parent_id') != 0) {
									$(this).removeClass('disabled').text(obj_lekhook.__FollowBoard);
								}
							});
						}
					}
				});
			}
			return false;
		} else {
			loginPopup();
			return false;
		}
	});
	
	//infinite scroll
	if ($masonry.length && obj_lekhook.infinitescroll != 'disable') {
		nextSelector = obj_lekhook.nextselector;
		if (document.URL.indexOf('/source/') != -1) {
			nextSelector = '#navigation #navigation-next a';
		}
		
		$masonry.infinitescroll({
			navSelector : '#navigation',
			nextSelector : nextSelector,
			itemSelector : '.thumb',
			prefill: true,
			bufferPx : 500,
			loading: {
				msgText: '',
				finishedMsg: obj_lekhook.__allitemsloaded,
				img: obj_lekhook.stylesheet_directory_uri + '/img/ajax-loader.gif',
				finished: function() {}
			}
		}, function(newElements) {
			if ($('.check-480px').css('float') == 'left') {
				var $newElems = $(newElements).hide();
	
				$newElems.imagesLoaded(function() {
					$('#infscr-loading').fadeOut('normal');
					$newElems.show();
					$masonry.masonry('appended', $newElems, true);
				});
			} else {
				var $newElems = $(newElements);
				$('#infscr-loading').fadeOut('normal');
				$masonry.masonry('appended', $newElems, true);
			}
		});
	}
	
	//infinite scroll for user profile - boards
	if (user_profile_boards.length && obj_lekhook.infinitescroll != 'disable') {
		user_profile_boards.infinitescroll({
			navSelector : '#navigation',
			nextSelector : '#navigation #navigation-next a',
			itemSelector : '.board-mini',
			prefill: true,
			bufferPx : 500,
			loading: {
				msgText: '',
				finishedMsg: obj_lekhook.__allitemsloaded,
				img: obj_lekhook.stylesheet_directory_uri + '/img/ajax-loader.gif'
			}
		});
	}
	
	//infinite scroll for user profile - followers & following
	if (user_profile_follow.length && obj_lekhook.infinitescroll != 'disable') {
		user_profile_follow.infinitescroll({
			navSelector : '#navigation',
			nextSelector : '#navigation #navigation-next a',
			itemSelector : '.follow-wrapper',
			prefill: true,
			bufferPx : 500,
			loading: {
				msgText: '',
				finishedMsg: obj_lekhook.__allitemsloaded,
				img: obj_lekhook.stylesheet_directory_uri + '/img/ajax-loader.gif',
				finished: function() {}
			}
		}, function(newElements) {
			var $newElems = $(newElements).hide();

			$newElems.imagesLoaded(function() {
				$('#infscr-loading').fadeOut('normal');
				$newElems.show();
				user_profile_follow.masonry('appended', $newElems, true);
			});
		});
	}
	
	//infinite scroll for notifications
	if (user_notifications.length && obj_lekhook.infinitescroll != 'disable') {
		user_notifications.infinitescroll({
			navSelector : '#navigation',
			nextSelector : '#navigation #navigation-next a',
			itemSelector : '.notifications-wrapper',
			prefill: true,
			bufferPx : 500,
			loading: {
				msgText: '',
				finishedMsg: obj_lekhook.__allitemsloaded,
				img: obj_lekhook.stylesheet_directory_uri + '/img/ajax-loader.gif',
				finished: function() {}
			}
		}, function(newElements) {
			var $newElems = $(newElements).hide();
			$newElems.appendTo($('.table'));
			$('#infscr-loading').fadeOut('normal');
			$newElems.show();
		});
	}
	
	//actionbar
	$(document).on('mouseenter', '.thumb-holder', function() {
		if ($('.check-480px').css('float') == 'none' && !ios) {
			$(this).children('.masonry-actionbar').fadeIn(100);
		}
	});
	
	$(document).on('mouseleave', '.thumb-holder', function() {
		if ($('.check-480px').css('float') == 'none' && !ios) {
			$(this).children('.masonry-actionbar').fadeOut(100);
		}
	});
	
	//comments for frontpage
	$(document).on('submit', '.masonry-meta form', function() {
		var commentform = $(this);
		var formdata = $(this).serialize();
		var formurl = $(this).attr('action');
		var post_id = $(this).attr('id').substr(12);
		
		if ($.trim($(this).find('textarea').val()) == '') {
			commentform.find('#comment-status').remove();
			commentform.find('.form-submit .comment-status-ajax-loader').remove();
			commentform.prepend('<div id="comment-status"></div>');
			commentform.find('#comment-status').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__Pleasetypeacomment + '</strong></div>');
			commentform.find('textarea').focus();
			return false;
		}
		
		commentform.find('input[type="submit"]').attr('disabled', 'disabled');
		commentform.find('#comment-status').remove();
		commentform.find('.comment-status-ajax-loader').remove();
		commentform.find('.form-submit').append(' <div class="comment-status-ajax-loader ajax-loader ajax-loader-inline"></div>');

		$.ajax({
			type: 'post',
			url: formurl,
			data: formdata,
			error: function(XMLHttpRequest) {
				var errormsg = XMLHttpRequest.responseText.substr(XMLHttpRequest.responseText.indexOf('<p>')+3);
				errormsg = errormsg.substr(0, errormsg.indexOf('</p>'));
				
				if (errormsg == '') {
					errormsg = obj_lekhook.__errorpleasetryagain;
				}
				
				commentform.prepend('<div id="comment-status"></div>');
				commentform.find('#comment-status').html('<div class="alert alert-warning"><strong>' + errormsg + '</strong></div>');
				commentform.find('textarea').focus();
				commentform.find('.form-submit .comment-status-ajax-loader').remove();
				if ($('#post-masonry #masonry').length) {
					$('#post-masonry #masonry').masonry('reloadItems').masonry('layout');
				}
				
				if ($('#masonry').length) {
					$('#masonry').masonry('reloadItems').masonry('layout');
				}
		
				commentform.find('input[type="submit"]').removeAttr('disabled');
			},
			success: function() {
				commentform.find('.form-submit .comment-status-ajax-loader').remove();
				var commenttext =  commentform.find('textarea').val();
				var newcomment = '<div id="masonry-meta-comment-wrapper-' + post_id + '" class="masonry-meta"><div class="masonry-meta-avatar">' + obj_lekhook.avatar30 + '</div><div class="masonry-meta-comment"><span class="masonry-meta-author">' + obj_lekhook.ui + '</span><span class="masonry-meta-comment-content"> ' + commenttext + '</span></div></div>';
				
				$('[id=masonry-meta-commentform-' + post_id + ']').prev().append(newcomment);
				commentform.find('#comment').val('');
				commentform.closest('#masonry-meta-commentform-' + post_id).hide();
				commentform.closest('#post-' + post_id).find('.lekhook-comment').removeClass('disabled');
				
				var comments_countmsg = commentform.closest('#post-' + post_id).find('#comments-count-'+post_id);
				var comments_count = comments_countmsg.html();
				comments_count = comments_count.substring(comments_count.lastIndexOf(' '));

				if (comments_count == '') {						
					$('[id=comments-count-'+post_id+']').removeClass('hide').html('<i class="fa fa-comment"></i> 1');
				} else {
					$('[id=comments-count-'+post_id+']').html('<i class="fa fa-comment"></i> ' + (parseInt(comments_count,10)+1));
				}
				
				if ($('#post-masonry #masonry').length) {
					$('#post-masonry #masonry').masonry('reloadItems').masonry('layout');
				}
				
				if ($('#masonry').length) {
					$('#masonry').masonry('reloadItems').masonry('layout');
				}
				
				commentform.find('textarea').val('');
				commentform.find('input[type="submit"]').removeAttr('disabled');
			}
		});
		return false;
	});
	
	//comments toggle frontpage comments form
	$(document).on('click', '.lekhook-comment', function() {
		if (obj_lekhook.u != '0') {
			var commentsform = $(this);
			if (!commentsform.hasClass('disabled')) {
				commentsform.addClass('disabled');
			} else {
				commentsform.removeClass('disabled');
			}
			
			$(this).closest('#post-' + $(this).data('post_id')).find('#masonry-meta-commentform-' + $(this).data('post_id')).slideToggle('fast', function() {
				if ($('#post-masonry #masonry').length) {
					$('#post-masonry #masonry').masonry('reloadItems').masonry('layout');
				} else if ($('#masonry').length) {
					$('#masonry').masonry('reloadItems').masonry('layout');
				}
			}).find('textarea').focus();
			return false;
		} else {
			loginPopup();
			return false;
		}
	});
	
	//lightbox
	$(document).on('click', '#masonry .featured-thumb, .post-wrapper .post-nav-next a, .post-wrapper .post-nav-prev a', function() {
		if ($masonry.length && !$('body').hasClass('single-post') && obj_lekhook.lightbox != 'disable' && $('.check-767px').css('float') == 'none' && !ios) {
			var lightbox = $('#post-lightbox');
			var href = $(this).closest('a').attr('href');
			
			if (!$('#single-post').length || $('#single-post').height() <= 0) {				
				if (!ie9below) {
					window.history.pushState('', '', href);
				}
			} else {				
				if (!ie9below) {
					window.history.replaceState('', '', href);
				}
			}

			lightbox.html('<div id="ajax-loader-masonry"></div>')
				.modal().load(href + ' #single-post-wrapper', function() {
					var post_masonry = $('#post-masonry #masonry');
					if (post_masonry.length) {
						post_masonry.masonry({
							itemSelector : '.thumb',
							isFitWidth: true,
							transitionDuration: 0
						}).css('visibility', 'visible');
						$('#post-masonry #ajax-loader-masonry, #post-masonry #navigation').hide();
					}
					
					$('.post-wrapper .post-nav-next a, .post-wrapper .post-nav-prev a').addClass('post-nav-link-lightbox');
					lightbox_postid = $('#single-post').data('postid');
					lightbox_prevlink = $('.container-fluid > #masonry > #post-' + lightbox_postid).prevAll('.post').first().find('.featured-thumb-link').attr('href');
					lightbox_nextlink = $('.container-fluid > #masonry > #post-' + lightbox_postid).nextAll('.post').first().find('.featured-thumb-link').attr('href');
					if (!lightbox_prevlink) {
						$('.post-wrapper .post-nav-prev a').hide();
					} else {
						$('.post-wrapper .post-nav-prev a').attr('href', lightbox_prevlink);						
					}
					if (!lightbox_nextlink) {
						$('.post-wrapper .post-nav-next a').hide();
					} else {
						$('.post-wrapper .post-nav-next a').attr('href', lightbox_nextlink);
					}
					
					$('#post-close').show();

					lightbox.scrollTop(0).focus();
					$('#post-featured-photo').imagesLoaded(function() {
						lightbox.scrollTop(0);
						var post_top_meta = $('.post-top-meta');
						var post_top_meta_top = post_top_meta.position().top;
						var post_top_meta_height = post_top_meta.outerHeight();
	
						var post_featured_photo_top = $('#post-featured-photo').offset().top;
						var post_featured_photo_bottom = post_featured_photo_top + $('#post-featured-photo').outerHeight();
						
						lightbox.scroll(function() {
							var post_top_meta_left = $('#post-featured-photo').offset().left;
							if (lightbox.scrollTop() > post_top_meta_top && lightbox.scrollTop() <= (post_featured_photo_bottom - post_top_meta_height - $(document).scrollTop())) {
								$('.post-top-meta').css({'opacity': '0.95', 'position': 'fixed', 'top': 0, 'left': post_top_meta_left, 'width': $('#post-featured-photo').outerWidth()});
								$('.post-top-meta-placeholder').css('height', post_top_meta_height-1).show();
							} else if (lightbox.scrollTop() > (post_featured_photo_bottom - post_top_meta_height - $(document).scrollTop())) {
								$('.post-top-meta').css({'position': 'absolute', 'top': (post_featured_photo_bottom - post_top_meta_height -$(document).scrollTop() - 2), 'left': 16});
							} else {
								$('.post-top-meta').css({'opacity': '1', 'position': 'relative', 'top': 0, 'left': 0, 'width': 'auto'});
								$('.post-top-meta-placeholder').hide();
							}
						});
					});
					
					if ($('.adsbygoogle').length) {
						$.getScript('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
						(adsbygoogle = window.adsbygoogle || []).push({});
					}
					
					if ($('.fb-comments').length) {
						FB.XFBML.parse();
					}
				});
				
			if (typeof ga == 'function') {
				ga('send', 'pageview', {'page': href.replace(obj_lekhook.home_url, '')});
			}

			if (typeof _gaq !== 'undefined') {
				_gaq.push(['_trackPageview', href.replace(obj_lekhook.home_url, '')]);
			}

			return false;
		}
	});

	//hide lightbox when click outside
	$('#post-lightbox').click(function(e) {
		var lightbox = $('#post-lightbox');

		if ((lightbox.has(e.target).length === 0 || $('.row').has(e.target).length === 0) && e.pageX < ($(window).width() - 22)) { //second condition for firefox-scrollbar-onclick-close-lightbox fix
			lightbox.scrollTop(0);
			$('#video-embed').remove();
			$('.navbar-brand').focus().blur();
			lightbox.modal('hide');
			
			if (!ie9below) {
				window.history.back();
			}			
		}
	});
	
    //hide lightbox when esc key is pressed. must use keydown not keyup.
	$(document).keydown(function(e) {
		if ($('#post-lightbox').css('display') == 'block' && e.keyCode == 27) {
			$('#post-lightbox').scrollTop(0);
			if (!ie9below) {
				window.history.back();
			}
		}
	});
	
    //hide lightbox when back button is pressed
	$(window).on('popstate', function(e){
		var lightbox = $('#post-lightbox');

		if (lightbox.length) {
			lightbox.scrollTop(0);
			$('#video-embed').remove();
			$('.navbar-brand').focus().blur();
			lightbox.modal('hide');
		}
    });
	
    //hide lightbox when sidebar close button is clicked
	$(document).on('click', '#post-close', function(e) {
		if (ie9below) {
			var lightbox = $('#post-lightbox');
	
			if (lightbox.length) {
				lightbox.scrollTop(0);
				$('#video-embed').remove();
				$('.navbar-brand').focus().blur();
				lightbox.modal('hide');
			}
		} else {
			window.history.back();	
		}
	});
	
	//Manipulate history for links in lightbox
	$(document).on('click', '#post-lightbox a', function(e) {
		href = $(this).attr('href');

		if ($(this).hasClass('lekhook-edit') || $(this).hasClass('edit-board') || (!$(this).hasClass('post-nav-link-lightbox') && !$(this).hasClass('btn') && href != '' && $(this).attr('target') != '_blank')) {
			if (!ie9below) {
				window.location.replace(href);
				return false;
			} else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
				setTimeout(function() { //have to use setTimeout for chrome?
					window.location.replace(href);
					return false;
				}, 0);
			} else {
				window.location.replace(href);
				return false;
			}
		}
	});
	
	//Add board
	$('#add_board_form').submit(function() {
		var addboardform = $(this);
		var errormsg = $('.error-msg');
		var ajaxloader = $('.ajax-loader');

		addboardform.find('input[type="submit"]').attr('disabled', 'disabled');
		errormsg.hide();
		ajaxloader.show();
		
		if ($('#board-title').val() == '') {
			errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__Pleaseentertitle  + '</strong></div>').fadeIn();
			$('#board-title').focus();
			$('.ajax-loader').hide();
			addboardform.find('input[type="submit"]').removeAttr('disabled');
		} else {
			var data = {
				action: 'lekhook-add-board',
				nonce: obj_lekhook.nonce,
				board_title: $('#board-title').val(),
				category_id: $('#category-id').val(),
				term_id: $('#term-id').val(),
				mode: $('#mode').val()
			};
			
			$.ajax({
				type: 'post',
				url: obj_lekhook.ajaxurl,
				data: data,
				error: function() {
					ajaxloader.hide();
					errormsg.html(obj_lekhook.__errorpleasetryagain).fadeIn();
					addboardform.find('input[type="submit"]').removeAttr('disabled');
				},
				success: function(data) {
					ajaxloader.hide();
					if ($('#add_board_form #mode').val() == 'add' || $('#add_board_form #mode').val() == 'edit' ) {
						if (data == 'error') {
							errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__boardalreadyexists  + '</strong></div>').fadeIn();
							$('#board-title').focus();
							addboardform.find('input[type="submit"]').removeAttr('disabled');
						} else {
							window.location = data;
						}
					}
				}
			});
		}
		return false;
	});

	//delete board confirmation
	$(document).on('click', '.lekhook-delete-board', function() {
		$('#delete-board-modal').modal();
		return false;
	});
	
	//delete board
	$(document).on('click', '#lekhook-delete-board-confirmed', function() {
		var ajaxloader = $('.ajax-loader-delete-board');
		var delete_btn = $(this);
		var	board_id = delete_btn.data('board_id');

		delete_btn.attr('disabled', 'disabled').prev().attr('disabled', 'disabled');
		ajaxloader.css('display', 'inline-block');
									
		var data = {
			target: '.ajax-loader-add-post',
			action: 'lekhook-delete-board',
			nonce: obj_lekhook.nonce,
			board_id: board_id
		};

		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function(data) {
				window.location = data;
			}
		});
	});

	//add post from computer
	$('#post_upload_file').change(function() { 
		$('.error-msg').hide();
		$('#post_upload_form').submit();
	});
	
	if ($('#post_upload_form').length) {
		var options = {
			beforeSubmit: showRequest,
			uploadProgress: function(event, position, total, percentComplete) {
				if (window.FormData !== undefined) {
					$('#post-upload-progress').show();
					$('#post-upload-progress .progress-bar-text').text(percentComplete + '%');
					$('#post-upload-progress .progress-bar').css('width', percentComplete + '%');
				}
			},
			success: showResponse,
			url: obj_lekhook.ajaxurl
		}; 
		$('#post_upload_form').ajaxForm(options);
	}
	
	function showRequest(formData, jqForm, options) {
		$('#post-upload-from-web-wrapper, #browser-addon, #bookmarklet, #postitbutton').slideUp();
		if (window.FormData === undefined) {
			$('#post-upload-from-computer-wrapper .ajax-loader-add-post').show();
		}

		var ext = $('#post_upload_file').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$('#post-upload-from-computer-wrapper .ajax-loader-add-post, #post-upload-progress').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
			return false;
		}
	}
	
	function showResponse(responseText, statusText, xhr, $form) {
		if (responseText == 'error') {
			$('.ajax-loader-add-post, #post-upload-progress').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
		} else if (responseText == 'errorsize') {
			$('.ajax-loader-add-post, #post-upload-progress').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__imagetoosmall  + '</strong></div>').fadeIn();
		} else {
			var data = $.parseJSON(responseText);
			$('#thumbnail').attr('src', data.thumbnail);
			$('#attachment-id').val(data.id);
			$('.ajax-loader-add-post, .error-msg, #post-upload-progress').hide();
			$('#post-upload-from-computer-wrapper').slideUp(function() {
				$('#post-upload-postdata-wrapper').slideDown();
				setTimeout(function() {
					tmce_focus('post-title');
					
					if (tmce_getContent('post-title') != ''&& ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
						$('#postit').removeAttr('disabled');
					} else {
						$('#postit').attr('disabled', 'disabled');
					}
					
					if ($('#post-title_ifr').length) {
						$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
							if (tmce_getContent('post-title') != ''&& ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
								$('#postit').removeAttr('disabled');
							} else {
								$('#postit').attr('disabled', 'disabled');
							}
						});
					}
				}, 500);
			});
		}
	}
	
	//add post from web
	if ($('#post_upload_web_form').length) {
		var options_web = {
			beforeSubmit: showRequest_web,
			success: showResponse_web,
			url: obj_lekhook.ajaxurl
		};
		$('#post_upload_web_form').ajaxForm(options_web);
	}
	
	function showRequest_web(formData, jqForm, options) {
		$('#fetch').attr('disabled', 'disabled');
		$('#post-upload-from-computer-wrapper, #browser-addon, #bookmarklet, #postitbutton').slideUp();
		$('#photo_data_source').val($('#post_upload_web').val());
		$('#post-upload-from-web-wrapper .ajax-loader-add-post').show();
		$('.error-msg').hide();
		
		var input_url = $('#post_upload_web').val();

		if (input_url == '') {
			$('.ajax-loader-add-post').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__pleaseenterurl  + '</strong></div>').fadeIn();
			$('#fetch').removeAttr('disabled');
			return false();
		}
		
		//append http:// if missing
		if (input_url.indexOf('http://') == -1 && input_url.indexOf('https://') == -1) {
			input_url = 'http://' + input_url;
		}
		
		//strip https for youtube & vimeo
		if (input_url.indexOf('youtube.com/watch') != -1 || input_url.match(/vimeo.com\/(\d+)($|\/)/)) {
			input_url = input_url.replace('https://', 'http://');
		}
		
		var ext = input_url.split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			if (input_url.indexOf('youtu.be/') != -1) {
				input_url = input_url.replace(/youtu.be\//, 'www.youtube.com/watch?v=');
			}
			
			$.get(obj_lekhook.stylesheet_directory_uri + '/lekhook_fetch.php?url=' + encodeURIComponent(input_url.replace('http','')) + '&nonce=' + obj_lekhook.nonce, function(data){
				if (data.substr(0, 5) == 'error') {
					$('.ajax-loader-add-post').hide();
					$('#fetch').removeAttr('disabled');
					$('.error-msg').html('<div class="alert alert-warning"><strong>' + data.substr(5)  + '</strong></div>').fadeIn();
				} else {
					$('.ajax-loader-add-post').hide();
					$('#fetch').removeAttr('disabled');
					$('body').css('overflow', 'hidden')
					.append("\
					<div id='lekhookframe'>\
						<div id='lekhookframebg'><p>" + obj_lekhook.__loading + "</p></div>\
						<div id='lekhookheader'><p id='lekhookclose'>X</p><p id='lekhooklogo'>" + obj_lekhook.blogname + "</p></div>\
						<div id='lekhookimages'></div>\
						<style type='text/css'>\
							#lekhookframe {color: #333;}\
							#lekhookframebg {background: #f2f2f2; display: none; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 2147483646;}\
							#lekhookframebg p {background: #999; border-radius: 8px; color: white; font: normal normal bold 16px\/22px Helvetica, Arial, sans-serif; margin: -2em auto 0 -9.5em; padding: 12px; position: absolute; top: 50%; left: 50%; text-align: center; width: 15em;}\
							#lekhookframe #lekhookheader {background: white; border-bottom: 1px solid #e7e7e7; color: white; height: 50px; margin: 0; overflow: hidden; padding: 0; position: fixed; top: 0; left: 0; text-align: center; width: 100%; z-index: 2147483647;}\
							#lekhookframe #lekhookheader #lekhooklogo {color: black; font: normal normal bold 20px\/20px Helvetica, Arial, sans-serif; margin: 0; padding: 12px 15px 13px 20px;}\
							#lekhookframe #lekhookheader #lekhookclose {background: #f33; color: white; cursor: pointer; float: right; font: normal normal bold 16px\/16px Helvetica, Arial, sans-serif; line-height: 50px; margin: 0; padding: 0 20px;}\
							#lekhookimages {position: fixed; top: 60px; left: 0; width: 100%; height: 94%; overflow-x: auto; overflow-y: scroll; text-align: center; z-index: 2147483647;}\
							#lekhookimages .lekhookimgwrapper {background: #fcfcfc; border: 1px solid #ddd; cursor: pointer; display: inline-block; height: 200px; margin: 15px; overflow: hidden; position: relative; width: 200px;}\
							#lekhookimages .lekhookbutton {background: rgba(0, 0, 0, 0.5); border-radius: 8px; color: white; font: normal normal bold 36px/36px Helvetica, Arial, sans-serif; padding: 8px 16px; display: none; margin-left: -24px; margin-top: -36px; position: absolute; top: 50%; left:50%;}\
							#lekhookimages .lekhookdimension {background: white; font: normal normal normal 12px/12px Helvetica, Arial, sans-serif; padding: 3px 0; position: absolute; right: 0; bottom: 0; left: 0;}\
							#lekhookimages img {width: 100%; height: auto;}\
						</style>\
					</div>");
					
					$('#lekhookframebg').fadeIn(200);

					function display_thumbnails(imgarr, videoflag) {
						if (!imgarr.length) {
							$('#lekhookframebg').html('<p>' + obj_lekhook.__sorryunbaletofindanypostnableitems + '</p>');
						} else {
							if ($(data).filter('lekhooktitle').text()) {
								page_title = encodeURIComponent($(data).filter('lekhooktitle').text().trim());
							} else {
								page_title = '';
							}
							
							if ($(data).filter('lekhookdescription').text()) {
								page_description = encodeURIComponent($(data).filter('lekhookdescription').text().trim());
								if (page_description.length > 255) {
									page_description = page_description.substr(0, 255) + '...';
								}
							} else {
								page_description = '';
							}
							
							var imgstr = '';
							for (var i = 0; i < imgarr.length; i++) {								
								if (videoflag == '0') {
									imgstr += '<div class="lekhookimgwrapper" data-href="' + obj_lekhook.home_url + '/post/?m=bm&imgsrc=' + encodeURIComponent(imgarr[i][0].replace('http','')) + '&source=' + encodeURIComponent(input_url.replace('http','')) + '&t=' + page_title + '&desc=' + page_description + '&video=' + videoflag + '"><div class="lekhookbutton">+</div><img src="' + imgarr[i][0] + '" /></div>';
								} else {
									imgstr += '<div class="lekhookimgwrapper" data-href="' + obj_lekhook.home_url + '/post/?m=bm&imgsrc=' + encodeURIComponent(imgarr[i][0].replace('http','')) + '&source=' + encodeURIComponent(input_url.replace('http','')) + '&t=' + page_title + '&desc=' + page_description + '&video=' + videoflag + '"><div class="lekhookbutton">+</div><div class="lekhookdimension">' + obj_lekhook.__Video + '</div><img src="' + imgarr[i][0] + '" /></div>';
								}
							}

							$('#lekhookimages').css('height',$(window).height()-$('#lekhookheader').height()-20).html(imgstr + "<div style='height:40px;clear:both;'><br /></div>");
							
							if ((navigator.appVersion.indexOf('Chrome/') != -1 || navigator.appVersion.indexOf('Safari/')) && videoflag != '1') {
								$('#lekhookimages .lekhookimgwrapper').css('float','left');
							}
							
							if (videoflag == '0') { 
								$('#lekhookimages').hide().imagesLoaded(function() {
									var images_hidden_count = 0;
									
									$('#lekhookimages img').each(function() {
										var imgwidth = this.naturalWidth;
										if (!imgwidth) {
											imgwidth = jQuery(this).width();
										}
										
										var imgheight = this.naturalHeight;
										if (!imgheight) {
											imgheight = jQuery(this).height();
										}
										
										if (imgwidth < 125) {
											$(this).parent().hide();
											images_hidden_count++;
										} else {
											$(this).before('<div class="lekhookdimension">' + parseInt(imgwidth,10) + ' x ' + parseInt(imgheight,10) + '</div>');	
										}
									});
									
									if (images_hidden_count == imgarr.length) {
										$('#lekhookframebg').html('<p>' + obj_lekhook.__sorryunbaletofindanypostnableitems + '</p>');
									} else {
										$('#lekhookframebg p').fadeOut(200);
										$('#lekhookimages').show();
									}
								});
							} else {
								$('#lekhookframebg p').fadeOut(200);	
							}
						}	
					}
					
					var imgarr = [];
					var videoflag = '0';
					
					if (input_url.indexOf('youtube.com/watch') != -1) {
						video_id = input_url.match('[\\?&]v=([^&#]*)');
						imgsrc = 'http://img.youtube.com/vi/' + video_id[1] + '/0.jpg';
						imgarr.unshift([imgsrc,480,360]);
						videoflag = '1';
						display_thumbnails(imgarr, videoflag);
					} else if (input_url.match(/vimeo.com\/(\d+)($|\/)/)) {
						video_id = input_url.split('/')[3];
						
						$.getJSON('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=?', {format: "json"}, function(data) {
							imgsrc = data[0].thumbnail_large;
							imgarr.unshift([imgsrc,640,360]);
							videoflag = '1';
							display_thumbnails(imgarr, videoflag);
						});
					} else {
						$('img', data).each(function() {
							var imgsrc = $(this).prop('src');
							imgarr.push([imgsrc,0,0]);
						});
						
						display_thumbnails(imgarr, videoflag);
					}
					
					$('#lekhookheader').on('click', '#lekhookclose', function() {
						$('body').css('overflow', 'visible');
						$('#lekhookframe').fadeOut(200, function() {
							$(this).remove();
							$('#post_upload_web').focus().select();
						});
					});
					
					$('#lekhookimages').on('click', '.lekhookimgwrapper', function() {
						var winw = (($(window).width() + 200) / 2);
						window.open($(this).data('href'), "lekhookwindow", 'width='+ winw +',height='+$(window).height()+',left='+(winw -200) / 2 +', top=0, resizable=1,scrollbars=1');
						$('body').css('overflow', 'visible');
						$('#lekhookframe').remove();
						$('#post_upload_web').focus().select();
					});
					
					$('#lekhookimages').on('mouseover', '.lekhookimgwrapper', function() {
						$(this).find('.lekhookbutton').show();
					}).on('mouseout', '.lekhookimgwrapper', function() {
						$(this).find('.lekhookbutton').hide();
					});
					
					$(document).keyup(function(e) {
						if (e.keyCode == 27) {
						$('body').css('overflow', 'visible');
						$('#lekhookframe').fadeOut(200, function() {
							$(this).remove();
							$('#post_upload_web').focus().select();
						});
						}
					});
				}
			});
	
			return false;
		}
	}
	
	function showResponse_web(responseText, statusText, xhr, $form) {
		if (responseText == 'error') {
			$('.ajax-loader-add-post').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
			$('#fetch').removeAttr('disabled');
		} else if (responseText == 'errorsize') {
			$('.ajax-loader-add-post').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__imagetoosmall  + '</strong></div>').fadeIn();
			$('#fetch').removeAttr('disabled');
		} else if (responseText.indexOf('Error Fetching Image') != -1) {
			$('#post-upload-from-web-wrapper .ajax-loader-add-post').hide();
			$('.error-msg').html('<div class="alert alert-warning"><strong>' + responseText  + '</strong></div>').fadeIn();
			$('#post_upload_web').focus();
			$('#fetch').removeAttr('disabled');
		} else {
			var data = $.parseJSON(responseText);
			$('#thumbnail').attr('src', data.thumbnail);
			$('#attachment-id').val(data.id);
			$('.ajax-loader-add-post, .error-msg').hide();
			$('#post-upload-from-web-wrapper').slideUp(function() { 
				$('#post-upload-postdata-wrapper').slideDown();
			});
		}
	}
	
	//add new board toggle
	$(document).on('click', '#post-postdata-form #post-postdata-add-new-board', function() {
		if ($(this).text() == obj_lekhook.__cancel) {
			if($('#noboard').length) {
				$('#postit').attr('disabled', 'disabled');
			}
			$(this).text(obj_lekhook.__addnewboard);
			$('.usercp-posts #board-add-new').val('').hide();
			$('.usercp-posts #board-add-new-category').val('-1').hide();
			$('.usercp-posts #board').show().focus();
		} else {
			$(this).text(obj_lekhook.__cancel);
			$('.usercp-posts #board-add-new').show().focus();
			$('.usercp-posts #board-add-new-category').show();
			$('.usercp-posts #board').hide();
		}
		return false;
	});
	
	//disable submit button if empty textarea (from web and computer)
	$('#post-postdata-form textarea#post-title').focus(function() {
		if ($.trim($('#post-postdata-form textarea#post-title').val()) && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
			$('#postit').removeAttr('disabled');
		} else {
			$('#postit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#post-postdata-form textarea#post-title').val()) && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	});

	//disable submit button if empty textarea (bookmarklet mode)
	if ($('#post-postdata-form textarea#post-title').is(':focus')) {
		if ($.trim($('#post-postdata-form textarea#post-title').val()) && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
			$('#postit').removeAttr('disabled');
		} else {
			$('#postit').attr('disabled', 'disabled');
		}

		$(this).keyup(function() {
			if ($.trim($('#post-postdata-form textarea#post-title').val()) && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	}
		
	$('#post-postdata-form #board-add-new').focus(function() {
		var content = '';
		if ($('#post-title_ifr').length) {
			content = tmce_getContent('post-title');
		} else {
			content = $.trim($('#post-postdata-form textarea#post-title').val());
		}
		
		$(this).keyup(function() {
			if ($('#post-title_ifr').length) {
				content = tmce_getContent('post-title');
			} else {
				content = $.trim($('#post-postdata-form textarea#post-title').val());
			}
			
			if (content && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	});
	
	//autocomplete tags
	if ('function' == typeof $.suggest) {
		$('input#tags').suggest(obj_lekhook.ajaxurl + '?action=ajax-tag-search&tax=post_tag', {minchars: 3, multiple: true});
	}
	
	//insert new post
	$('#post-postdata-form').submit(function() {
		var postdataform = $(this);
		var errormsg = $('.error-msg');
		var ajaxloader = $('.ajax-loader-add-post');	
		
		//empty title
		if (!$.trim($('#post-postdata-form textarea#post-title').val())) {
			ajaxloader.hide();
			errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__Pleaseentertitle  + '</strong></div>').fadeIn();
			return false;
		}
		
		//empty board
		if ($('#post-postdata-form #board').val() == '-1' && $.trim($('#post-postdata-form #board-add-new').val()) == '') {
			ajaxloader.hide();
			errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__Pleasecreateanewboard  + '</strong></div>').fadeIn();
			return false;
		}
		
		var postdata_photo_source;
		
		if ($('#photo_data_source').val()) {
			postdata_photo_source = $('#photo_data_source').val();
		}
		
		var price = '';
		if ($('#post-postdata-form #price').length)
			price = $('#post-postdata-form #price').val().replace(/[^0-9.]/g, '');
			
		var colorThief = new ColorThief();
		var postdata_bgcolor = colorThief.getColor($('#thumbnail')[0]).join(',');

		var data = {
			action: 'lekhook-postdata',
			nonce: obj_lekhook.nonce,
			postdata_title: tmce_getContent('post-title'),
			postdata_content: tmce_getContent('post-content'),
			postdata_attachment_id: $('#attachment-id').val(),
			postdata_board: $('#post-postdata-form #board').val(),
			postdata_board_add_new: $('#post-postdata-form #board-add-new').val(),
			postdata_board_add_new_category: $('#post-postdata-form #board-add-new-category').val(),
			postdata_tags: $('#post-postdata-form #tags').val(),
			postdata_price: price,
			postdata_photo_source: postdata_photo_source,
			postdata_bgcolor: postdata_bgcolor
		};

		postdataform.find('input[type="submit"]').attr('disabled', 'disabled');
		ajaxloader.show();
		errormsg.hide();
		
		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			error: function() {
				ajaxloader.hide();
				errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__errorpleasetryagain  + '</strong></div>').fadeIn();
				postdataform.find('input[type="submit"]').removeAttr('disabled');
			},
			success: function(data) {
				ajaxloader.hide();
				errormsg.hide();
				$('#post-postdata-form').hide();
				
				var board_name;
				if ($('#post-postdata-form #board-add-new').val() == '') {
					board_name = $('#post-postdata-form #board option:selected').text();
				} else {
					board_name = $('#post-postdata-form #board-add-new').val();
				}
								
				var post_status ='<br />';
				if (data.indexOf('/?p=') != -1) {
					post_status = '<small style="display:block;clear:both"><span class="label label-warning">' + obj_lekhook.__yourpostispendingreview + '</span></small>';
				}
				
				if (window.location.search.indexOf('m=bm') != -1) //via bookmarklet
					$('.postdata-box-photo').after('<h3 id="repostnedmsg" class="text-center">' + obj_lekhook.__postnedto + ' ' + board_name + post_status + '<p></p><a class="btn btn-success" href="javascript:window.open(\'' + data + '\');window.close();"><strong>' + obj_lekhook.__seethispost + '</strong></a> <a href="javascript:window.close()" class="btn btn-success" aria-hidden="true"><strong>' + obj_lekhook.__close + '</strong></a></h3><h5 class="repostnedmsg-share text-center"><strong>' + obj_lekhook.__shareitwithyourfriends + '</strong></h5><p class="repostnedmsg-share text-center"><a class="btn btn-primary btn-sm" href="" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(data) + '\', \'facebook-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-facebook fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'https://twitter.com/share?url=' + data + '&amp;text=' + encodeURIComponent($('#post-postdata-form textarea#post-title').val()) + '\', \'twitter-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-twitter fa-fw"></i></a> <a class="btn btn-danger btn-sm" href="" onclick="window.open(\'https://plus.google.com/share?url=' + data + '\', \'gplus-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-google-plus fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'http://www.reddit.com/submit?url=' + encodeURIComponent(data) + '&amp;title=' + encodeURIComponent($('#repostform textarea#post-title').val()) + '\', \'reddit-share-dialog\', \'width=880,height=500,scrollbars=1\'); return false;"><i class="fa fa-reddit fa-fw"></i></a></p>');
				else {
					$('.postdata-box-photo').after('<h3 id="repostnedmsg" class="text-center">' + obj_lekhook.__postnedto + ' ' + board_name + post_status + '<p></p><a class="btn btn-success" href="' + data + '"><strong>' + obj_lekhook.__seethispost + '</strong></a> <a href="" class="btn btn-success" aria-hidden="true"><strong>' + obj_lekhook.__addanotherpost + '</strong></a></h3><h5 class="repostnedmsg-share text-center"><strong>' + obj_lekhook.__shareitwithyourfriends + '</strong></h5><p class="repostnedmsg-share text-center"><a class="btn btn-primary btn-sm" href="" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(data) + '\', \'facebook-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-facebook fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'https://twitter.com/share?url=' + data + '&amp;text=' + encodeURIComponent($('#post-postdata-form textarea#post-title').val()) + '\', \'twitter-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-twitter fa-fw"></i></a> <a class="btn btn-danger btn-sm" href="" onclick="window.open(\'https://plus.google.com/share?url=' + data + '\', \'gplus-share-dialog\', \'width=626,height=500\'); return false;"><i class="fa fa-google-plus fa-fw"></i></a> <a class="btn btn-info btn-sm" href="" onclick="window.open(\'http://www.reddit.com/submit?url=' + encodeURIComponent(data) + '&amp;title=' + encodeURIComponent($('#post-postdata-form textarea#post-title').val()) + '\', \'reddit-share-dialog\', \'width=880,height=500,scrollbars=1\'); return false;"><i class="fa fa-reddit fa-fw"></i></a></p>');
				}
			}
		});
		return false;
	});
	
	//edit post
	//add new board toggle
	$(document).on('click', '#post-edit-form #post-postdata-add-new-board', function() {
		if ($(this).text() == obj_lekhook.__cancel) {
			$(this).text(obj_lekhook.__addnewboard);
			$('.usercp-posts #board-add-new').val('').hide();
			$('.usercp-posts #board-add-new-category').val('-1').hide();
			$('.usercp-posts #board').show().focus();
		} else {
			$(this).text(obj_lekhook.__cancel);
			$('.usercp-posts #board-add-new').show().focus();
			$('.usercp-posts #board-add-new-category').show();
			$('.usercp-posts #board').hide();
		}
		return false;
	});
	
	//disable submit button if empty textarea
	if ($('#post-edit-form textarea#post-title').is(":focus")) {
		$(this).keyup(function() {
			if ($.trim($('#post-edit-form textarea#post-title').val())) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	}
	
	$('#post-edit-form textarea#post-title').focus(function() {
		$(this).keyup(function() {
			if ($.trim($('#post-edit-form textarea#post-title').val())) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
		});
	});

	$('#post-edit-form').submit(function() {
		var editform = $(this);
		var errormsg = $('.error-msg');
		var ajaxloader = $('.ajax-loader-add-post');
		
		var price = '';
		if ($('#post-edit-form #price').length)
			price = $('#post-edit-form #price').val().replace(/[^0-9.]/g, '');
		
		var data = {
			action: 'lekhook-post-edit',
			nonce: obj_lekhook.nonce,
			postdata_pid: $('#post-edit-form #pid').val(),
			postdata_title: tmce_getContent('post-title'),
			postdata_content: tmce_getContent('post-content'),
			postdata_board: $('#post-edit-form #board').val(),
			postdata_board_add_new: $('#post-edit-form #board-add-new').val(),
			postdata_board_add_new_category: $('#post-edit-form #board-add-new-category').val(),
			postdata_tags: $('#post-edit-form #tags').val(),
			postdata_price: price,
			postdata_source: $('#post-edit-form #source').val()
		};

		editform.find('input[type="submit"]').attr('disabled', 'disabled');
		ajaxloader.show();
		errormsg.hide();
		
		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			error: function() {
				ajaxloader.hide();
				errormsg.html('<div class="alert alert-warning"><strong>' + obj_lekhook.__errorpleasetryagain  + '</strong></div>').fadeIn();
				editform.find('input[type="submit"]').removeAttr('disabled');
			},
			success: function(data) {
				window.location = data;
			}
		});
		return false;
	});	
	
	//delete post confirmation
	$(document).on('click', '.lekhook-delete-post', function() {
		$('#delete-post-modal').modal();
		return false;
	});
	
	//delete post
	$(document).on('click', '#lekhook-delete-post-confirmed', function() {
		var ajaxloader = $('.ajax-loader-delete-post');
		var delete_btn = $(this);
		var	post_id = delete_btn.data('post_id');
		var	post_author = delete_btn.data('post_author');

		delete_btn.attr('disabled', 'disabled').prev().attr('disabled', 'disabled');
		ajaxloader.css('display', 'inline-block');

		var data = {
			action: 'lekhook-delete-post',
			nonce: obj_lekhook.nonce,
			post_id: post_id,
			post_author: post_author
		};

		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function(data) {
				window.location = data;
			}
		});
	});
	
	//replace image in edit form
	$('#lekhook_replace_image').change(function() {
		$('.error-msg-replace-image').hide();
		$('#lekhook-replace-image-form').submit();
	});
	
	if ($('#lekhook-replace-image-form').length) {
		var options = {
			beforeSubmit: showRequest_replace_image,
			success: showResponse_replace_image,
			url: obj_lekhook.ajaxurl
		};
		$('#lekhook-replace-image-form').ajaxForm(options);
	}

	function showRequest_replace_image(formData, jqForm, options) {
		$('#lekhook-replace-image-form .ajax-loader-replace-image').show();

		var ext = $('#lekhook_replace_image').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$('#lekhook-replace-image-form .ajax-loader-replace-image').hide();
			$('.error-msg-replace-image').html('<div class="alert"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
			return false;
		}
	}

	function showResponse_replace_image(responseText, statusText, xhr, $form) {
		if (responseText == 'error') {
			$('#lekhook-replace-image-form .ajax-loader-replace-image').hide();
			$('.error-msg-replace-image').html('<div class="alert"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
		} else {
			$('#thumbnail').attr('src', responseText);
			$('#lekhook-replace-image-form .ajax-loader-replace-image').hide();
		}
	}
	
	//delete account confirmation
	$(document).on('click', '#lekhook-delete-account', function() {
		$('#delete-account-modal').modal();
		return false;
	});
	
	//delete account
	$(document).on('click', '#lekhook-delete-account-confirmed', function() {
		var ajaxloader = $('.ajax-loader-delete-account');
		var delete_btn = $(this);
		var	user_id = delete_btn.data('user_id');

		delete_btn.attr('disabled', 'disabled').prev().attr('disabled', 'disabled');
		ajaxloader.css('display', 'inline-block');

		var data = {
			action: 'lekhook-delete-account',
			nonce: obj_lekhook.nonce,
			user_id: user_id
		};

		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function(data) {
				window.location = data;
			}
		});
	});	
	
	//login form check
	$(document).on('submit', '#loginform', function() {
		$('.error-msg-incorrect').hide();
		if ($('#log').val() == '' || $('#pwd').val() == '') {
			$('.error-msg-blank').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__pleaseenterbothusernameandpassword  + '</strong></div>').fadeIn();
			return false;
		}
	});
	
	//ajax upload avatar
	$('#lekhook_user_avatar').change(function() {
		$('.error-msg-avatar').hide();
		$('#avatarform').submit();
	});
	
	if ($('#avatarform').length) {
		var options = {
			beforeSubmit: showRequest_avatar,
			success: showResponse_avatar,
			url: obj_lekhook.ajaxurl
		};
		$('#avatarform').ajaxForm(options);
	}

	function showRequest_avatar(formData, jqForm, options) {
		$('#avatarform .ajax-loader-avatar').show();

		var ext = $('#lekhook_user_avatar').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$('#avatarform .ajax-loader-avatar').hide();
			$('.error-msg-avatar').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
			return false;
		}
	}

	function showResponse_avatar(responseText, statusText, xhr, $form) {
		if (responseText == 'error') {
			$('#avatarform .ajax-loader-avatar').hide();
			$('.error-msg-avatar').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
		} else {
			var data = $.parseJSON(responseText);
			$('#avatar-wrapper').fadeOut(function() {
				$('#avatar-wrapper .img-polaroid').attr('src', data.thumbnail);
				$('#avatar-delete').removeAttr('disabled');
				$('#avatarform .ajax-loader-avatar').hide();
				$('#coverform').css('top', $('#avatarform').offset().top+$('#avatarform').height()+54);
				$('#avatar-anchor').css('margin-bottom', $('#avatarform').height()+$('#coverform').height()+153);
				$('#avatar-wrapper').slideDown();
			});
		}
	}

	//delete avatar
	$('#avatar-delete').on('mouseup', function() { 
		var ajaxloader = $('.ajax-loader-avatar');
		var delete_btn = $(this);
		var id = delete_btn.data('id');
		delete_btn.attr('disabled', 'disabled');
		ajaxloader.show();
	
		var data = {
			action: 'lekhook-delete-avatar',
			nonce: obj_lekhook.nonce,
			id: id
		};

		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function() {
				ajaxloader.hide();
				$('#avatar-wrapper').fadeOut(function() {
					$('#coverform').css('top', $('#avatarform').offset().top+$('#avatarform').height()-69);
					$('#avatar-anchor').css('margin-bottom', $('#avatarform').height()+$('#coverform').height()+80);
				});
			}
		});
		return false;
	});
	
	//ajax upload cover
	$('#lekhook_user_cover').change(function() {
		$('.error-msg-cover').hide();
		$('#coverform').submit();
	});
	
	if ($('#coverform').length) {
		var options = {
			beforeSubmit: showRequest_cover,
			success: showResponse_cover,
			url: obj_lekhook.ajaxurl
		};
		$('#coverform').ajaxForm(options);
	}

	function showRequest_cover(formData, jqForm, options) {
		$('#coverform .ajax-loader-cover').show();

		var ext = $('#lekhook_user_cover').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$('#coverform .ajax-loader-cover').hide();
			$('.error-msg-cover').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
			return false;
		}
	}

	function showResponse_cover(responseText, statusText, xhr, $form) {
		if (responseText == 'error') {
			$('#coverform .ajax-loader-cover').hide();
			$('.error-msg-cover').html('<div class="alert alert-warning"><strong>' + obj_lekhook.__invalidimagefile  + '</strong></div>').fadeIn();
		} else {
			var data = $.parseJSON(responseText);
			$('#cover-wrapper').fadeOut(function() {
				$('#cover-wrapper .img-polaroid').attr('src', data.thumbnail);
				$('#cover-delete').removeAttr('disabled');
				$('#coverform .ajax-loader-cover').hide();
				$('#avatar-anchor').css('margin-bottom', $('#avatarform').height()+$('#coverform').height()+153);
				$('#cover-wrapper').slideDown();
			});
		}
	}

	//delete cover
	$('#cover-delete').on('mouseup', function() { 
		var ajaxloader = $('.ajax-loader-cover');
		var delete_btn = $(this);
		var id = delete_btn.data('id');
		delete_btn.attr('disabled', 'disabled');
		ajaxloader.show();
	
		var data = {
			action: 'lekhook-delete-cover',
			nonce: obj_lekhook.nonce,
			id: id
		};

		$.ajax({
			type: 'post',
			url: obj_lekhook.ajaxurl,
			data: data,
			success: function() {
				ajaxloader.hide();
				$('#cover-wrapper').fadeOut(function() {
					$('#avatar-anchor').css('margin-bottom', $('#avatarform').height()+$('#coverform').height()+30);
				});
			}
		});
		return false;
	});
	
	//kiv: animated gif mouseover
	//slow to load if animated gif filesize is large
	/* $(document).on('mouseover', '.featured-thumb-gif-class', function() {
		var preload = new Image();
		preload.src = $(this).data('animated-gif-src-full');
		$(this).attr('src', preload.src)
			.prev('.featured-thumb-gif').hide();
	});
	
	$(document).on('mouseout', '.featured-thumb-gif-class', function() {
		$(this).attr('src', $(this).data('animated-gif-src-medium'))
			.prev('.featured-thumb-gif').show();
	});
	*/
	
	function topAlertMsg(message) {
	    if ($('#top-alert-msg').length) {
			$('#top-alert-msg').hide();
		}

		$("<div />", { 
				id: 'top-alert-msg',
				html: message + '<div id="top-alert-msg-close">&times;</div>'
			})
			.hide()
			.prependTo("body")
			.slideDown('fast')
			.delay(5000)
			.slideUp(function() { 
				$(this).remove(); 
		});

		$(document).on('click', '#top-alert-msg-close', function() {
			$('#top-alert-msg').remove();
		});
	}
	
	function loginPopup() {
		if ($('.check-480px').css('float') == 'left') {
			topAlertMsg('<a href="' + obj_lekhook.login_url + '">' + obj_lekhook.__Pleaseloginorregisterhere + '</a>');
		} else {
			if ($('#loginbox-wrapper .popover').length) {
				$('#loginbox').popover('hide');
			}
			
			$('#video-embed').remove();
			$('.brand').focus().blur();

			if ($('#post-lightbox').css('display') == 'block') {
				if (!ie9below) {
					window.history.back();
				}
			}
			
			$('#post-lightbox').modal('hide');
			$('#popup-overlay').show();
			$('#popup-login-box').modal();
		}	
	}
	
	//facebook like with comment
	$(document).on('mouseenter', '.fb-like', function() {
		$(this).css('overflow', 'visible');
	});
	
	$(document).on('mouseleave', '.fb-like', function() {
		$(this).css('overflow', 'hidden');
	});
    
     $(window).bind("scroll", function () {
         
            var header = $(".navbar-default");
            $(window).scroll(function () {
                var windowpos = $(window).scrollTop();
                if (windowpos > 0) {
                    header.addClass("navbar-shadow");
                } else {
                    header.removeClass("navbar-shadow");
                }
            });
        });
    
});