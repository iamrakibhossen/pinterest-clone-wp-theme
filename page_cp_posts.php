<?php
/*
Template Name: _posts_settings
*/
 
if (!is_user_logged_in()) { wp_redirect(wp_login_url($_SERVER['REQUEST_URI'])); exit; }

if (!current_user_can('edit_posts')) { wp_redirect(home_url('/')); exit; }

error_reporting(0);
get_header();

global $user_ID;

if ($_GET['i']) {  //edit post
	$post_id = intval($_GET['i']);
	$post_info = get_post($post_id);
	$imgsrc = wp_get_attachment_image_src(get_post_thumbnail_id($post_info->ID),'medium');
	
	if (($post_info->post_author == $user_ID || current_user_can('edit_others_posts')) && $post_info->post_type == 'post') {
	?>
	<div class="container">
		<div class="row">
			<div class="col-sm-2"></div>
	
			<div class="col-sm-8 usercp-wrapper usercp-posts">
				<h1><?php _e('Edit Post', 'lekhook') ?></h1>
				
				<div class="error-msg hide"></div>
				
				<br />
				
				<div id="post-upload-postdata-wrapper">
					<div class="postdata-box-photo">
						<img id="thumbnail" src="<?php echo $imgsrc[0]; ?>" />
						<?php /* Replace Image
						$original_post_id = get_post_meta($post_info->ID, "_Original Post ID", true);
						if (!$original_post_id) {
						?>
						<form name="lekhook-replace-image-form" id="lekhook-replace-image-form" method="post" enctype="multipart/form-data">
							<div class="upload-wrapper btn btn-success btn-sm">
								<span><?php _e('Replace Image', 'lekhook'); ?></span>
								<input id="lekhook_replace_image" class="upload" type="file" name="lekhook_replace_image" accept="image/*" /> 
							</div>

							<input type="hidden" name="post_id" id="post_id" value="<?php echo$post_info->ID; ?>" />
							<input type="hidden" name="action" id="action" value="lekhook-replace-image" />
							<input type="hidden" name="ajax-nonce" id="ajax-nonce" value="<?php echo wp_create_nonce('replace_image'); ?>" />
							<div class="ajax-loader-replace-image ajax-loader hide"></div>
							<div class="error-msg-replace-image"></div>
						</form>
						<?php } else { ?>
						<form name="lekhook-replace-image-form" id="lekhook-replace-image-form" method="post" enctype="multipart/form-data">
							<button class="upload-wrapper btn btn-default btn-sm" disabled="disabled">
								<span><?php _e('Replace Image Not Available For Reposts', 'lekhook'); ?></span>
							</button>
						</form>
						<?php } */ ?>
					</div>
					<form id="post-edit-form">
						<?php if (of_get_option('form_title_desc') != 'separate') { ?>
							<?php
							if (of_get_option('htmltags') == 'enable') {
								echo lekhook_wp_editor('post-title', $post_info->post_title);
							} else { ?>
								<textarea class="form-control" id="post-title" placeholder="<?php _e('Describe your post...', 'lekhook'); ?>"><?php echo $post_info->post_title; ?></textarea>
							<?php } ?>
						<?php } else { ?>
							<textarea class="form-control" id="post-title" placeholder="<?php _e('Title...', 'lekhook'); ?>"><?php echo $post_info->post_title; ?></textarea>
							<p></p>
							
							<?php
							if (of_get_option('htmltags') == 'enable') {
								echo lekhook_wp_editor('post-content', $post_info->post_content);
							} else { ?>
								<textarea class="form-control" id="post-content" placeholder="<?php _e('Description...', 'lekhook'); ?>"><?php echo $post_info->post_content; ?></textarea>
							<?php } ?>
						<?php } ?>

						<p></p>

						<?php
						if (of_get_option('posttags') == 'enable') {
							$the_tags = get_the_tags($post_info->ID);
							if ($the_tags) {
								foreach($the_tags as $the_tags) {
									$tags .= $the_tags->name . ', ';
								}
							}
						?>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-tags"></i></span>
							<input class="form-control" type="text" name="tags" id="tags" value="<?php echo substr($tags, 0, -2); ?>" placeholder="<?php _e('Tags e.g. comma, separated', 'lekhook'); ?>" />
						</div>
						<?php } ?>
						
						<?php if (of_get_option('price_currency') != '') { ?>
							<?php if (of_get_option('price_currency_position') == 'right') { ?>
							<div class="input-group">
								<input class="form-control text-right" type="text" name="price" id="price" value="<?php echo get_post_meta($post_info->ID, '_Price', true); ?>" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
								<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
							</div>
							<?php } else { ?>
							<div class="input-group">
								<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
								<input class="form-control" type="text" name="price" id="price" value="<?php echo get_post_meta($post_info->ID, '_Price', true); ?>" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
							</div>
							<?php } ?>
						<?php } ?>
						
						<div class="input-group<?php if (of_get_option('source_input') != 'enable') echo ' hide'; ?>">
							<span class="input-group-addon"><i class="fa fa-link"></i></span>
							<input class="form-control" type="text" name="source" id="source" value="<?php echo get_post_meta($post_info->ID, '_Photo Source', true); ?>" placeholder="<?php _e('Source e.g. http://domain.com/link', 'lekhook'); ?>" />
						</div>

						<?php echo lekhook_dropdown_boards($post_info->post_author, lekhook_get_post_board($post_info->ID)->term_id); ?>
						<input class="form-control board-add-new" type="text" id="board-add-new" placeholder="<?php _e('Enter new board title', 'lekhook'); ?>" />
						<?php echo lekhook_dropdown_categories(__('Category for New Board', 'lekhook'), 'board-add-new-category'); ?>
						<a id="post-postdata-add-new-board" class="btn btn-default btn-sm pull-right"><?php _e('Add new board...', 'lekhook'); ?></a>
						<input class="form-control" type="hidden" name="pid" id="pid" value="<?php echo $post_id; ?>" />
						<div class="clearfix"></div>
						
						<input class="btn btn-success btn-block btn-lekhook-custom" type="submit" name="postit" id="postit" value="<?php _e('Save Post', 'lekhook'); ?>" /> 
						<div class="ajax-loader-add-post ajax-loader hide"></div>
					</form>
				</div>
				<br />
				<div class="text-center"><button class="btn btn-grey lekhook-delete-post" type="button"><?php _e('Delete Post', 'lekhook') ?></button></div>
			</div>
	
			<div class="col-sm-2"></div>
		</div>
	</div>
	<?php } else { ?>
	<div class="container">
		<div class="row">
			<div class="bigmsg">
				<h2><?php _e('No posts found.', 'lekhook'); ?></h2>
			</div>
		</div>
	</div>

<?php }
} else if ($_GET['m'] == 'bm') {  //bookmarklet
	$minWidth = 2;
	$minHeight = 2;
	
	$minWidth = apply_filters('lekhook_minwidth', $minWidth);
	$minHeight = apply_filters('lekhook_minheight', $minHeight);
	
	$source = '';
	if ($_GET['source'] != '') {
		$source = esc_url_raw(urldecode('http' . $_GET['source']));
	}
	$imgsrc = 'http'. str_replace('s://','://', $_GET['imgsrc']);
	$title = esc_textarea(html_entity_decode(rawurldecode(stripslashes($_GET['t'])), ENT_QUOTES, 'UTF-8'));
	$description = esc_textarea(html_entity_decode(rawurldecode(stripslashes($_GET['desc'])), ENT_QUOTES, 'UTF-8'));
			
	if (function_exists('curl_init')) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $imgsrc);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$image = curl_exec($ch);
		
		if($image === false) {
		    $curl_error = curl_error($ch);
		}
		
		curl_close($ch);
	} elseif (ini_get('allow_url_fopen')) {
		$image = file_get_contents($imgsrc, false, $context);
	}

	if (!$image) {
		$error = 'error';
	}

	$filename = time() . str_shuffle('gnk48');
	$file_array['tmp_name'] = WP_CONTENT_DIR . "/" . $filename . '.tmp';
	$filetmp = file_put_contents($file_array['tmp_name'], $image);
	
	if (!$filetmp) {
		@unlink($file_array['tmp_name']);
		$error = 'error';
	}
	
	if (!$error) {
		require_once(ABSPATH . 'wp-admin/includes/image.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/media.php');
	
		$imageTypes = array (
			1, //IMAGETYPE_GIF
			2, //IMAGETYPE_JPEG
			3 //IMAGETYPE_PNG
		);
	
		$imageinfo = getimagesize($file_array['tmp_name']);
		$width = @$imageinfo[0];
		$height = @$imageinfo[1];
		$type = @$imageinfo[2];
		$mime = @$imageinfo['mime'];
	
		if (!in_array ($type, $imageTypes)) {
			@unlink($file_array['tmp_name']);
			$error = 'error';
		}

		if ($width < $minWidth || $height < $minHeight) {
			@unlink($file_array['tmp_name']);
			$error_imagesize = 'error';
			$error = 'error';
		}
	
		if($mime != 'image/gif' && $mime != 'image/jpeg' && $mime != 'image/png') {
			@unlink($file_array['tmp_name']);
			$error = 'error';
		}
	
		switch($type) {
			case 1:
				$ext = '.gif';
						
				//check if is animated gif
				$frames = 0;
				if(($fh = @fopen($file_array['tmp_name'], 'rb')) && $error != 'error') {
					while(!feof($fh) && $frames < 2) {
						$chunk = fread($fh, 1024 * 100); //read 100kb at a time
						$frames += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
				   }
				}
				fclose($fh);
	
				break;
			case 2:
				$ext = '.jpg';
				break;
			case 3:
				$ext = '.png';
				break;
		}
		$original_filename = preg_replace('/[^(\x20|\x61-\x7A)]*/', '', strtolower(str_ireplace($ext, '', $title))); //preg_replace('/[^(\x48-\x7A)]*/' strips non-utf character. Ref: http://www.ssec.wisc.edu/~tomw/java/unicode.html#x0000
		$file_array['name'] = strtolower(substr($original_filename, 0, 100)) . '-' . $filename . $ext;
	
		$attach_id = media_handle_sideload($file_array, 'none'); //use none for $post_id so that image is uploaded to current month/year directory. Else $post_id = this posts page id, which will point to older month/year directory
	
		if (is_wp_error($attach_id)) {
			@unlink($file_array['tmp_name']);
			$error = 'error';
		} else {
			if ($frames > 1) {
				update_post_meta($attach_id, 'a_gif', 'yes');
			}	
		}
		
		update_post_meta($attach_id, 'lekhook_unattached', 'yes');
	}
		
	if ($error == 'error') {
	?>
		<div class="container">
			<div class="row">
				<div class="col-sm-2"></div>
				<div class="col-sm-8 usercp-wrapper usercp-posts">
					<div class="error-msg">
						<div class="alert alert-warning">
						<?php if (!$curl_error) { ?>
							<?php if ($error_imagesize) { ?>
							<strong><?php echo sprintf(__('Image is too small (min size: %d x %dpx)', 'lekhook'), $minWidth, $minHeight); ?></strong>
							<?php } else { ?>
							<strong><?php _e('Invalid image file.', 'lekhook'); ?></strong>
							<?php } ?>
						<?php } else { ?>
							<strong>
							<?php _e('Unable to fetch image from remote site', 'lekhook'); ?> 
							(<?php echo $curl_error; ?>)<br /><br />
							<a href="<?php echo home_url('/post/'); ?>"><?php _e('Please save image onto device and upload from device.', 'lekhook'); ?></a>
							</strong>
						<?php } ?>
						</div>
					</div>
				</div>
				<div class="col-sm-2"></div>
			</div>
		</div>
	<?php
	} else {
			$thumbnail = wp_get_attachment_image_src($attach_id, 'medium');
			?>
			<div class="container">
				<div class="row">
					<div class="col-sm-2"></div>
			
					<div class="col-sm-8 usercp-wrapper usercp-posts">
						<h1><?php _e('Add Post', 'lekhook') ?></h1>
						
						<div class="error-msg hide"></div>
						
						<br />
						
						<div id="post-upload-postdata-wrapper">
						<div class="postdata-box-photo"><img id="thumbnail" src="<?php echo $thumbnail[0]; ?>" /></div>
						<form id="post-postdata-form">							
							<?php if (of_get_option('form_title_desc') != 'separate') { ?>
								<?php
								if (of_get_option('htmltags') == 'enable') {
									echo lekhook_wp_editor('post-title', $title);
								} else { ?>
									<textarea class="form-control" id="post-title" placeholder="<?php _e('Describe your post...', 'lekhook'); ?>"><?php echo $title; ?></textarea>
								<?php }?>
							<?php } else { ?>
								<textarea class="form-control" id="post-title" placeholder="<?php _e('Title...', 'lekhook'); ?>"><?php echo $title; ?></textarea>
								<p></p>
								
								<?php
								if (of_get_option('htmltags') == 'enable') {
									echo lekhook_wp_editor('post-content', $description);
								} else { ?>
									<textarea class="form-control" id="post-content" placeholder="<?php _e('Description...', 'lekhook'); ?>"><?php echo $description; ?></textarea>
								<?php }?>
							<?php } ?>

							<p></p>
							
							<?php if (of_get_option('posttags') == 'enable') { 
                                
                               

$tags = '';
                            
                            ?>
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-tags"></i></span>
									<input class="form-control" type="text" name="tags" id="tags" value="<?php echo $tags; ?>" placeholder="<?php _e('Tags e.g. comma, separated', 'lekhook'); ?>" />
								</div>
							<?php } ?>
							
							<?php if (of_get_option('price_currency') != '') { ?>
								<?php if (of_get_option('price_currency_position') == 'right') { ?>
								<div class="input-group">
									<input class="form-control text-right" class="pull-left" type="text" name="price" id="price" value="" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
									<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
								</div>
								<?php } else { ?>
								<div class="input-group">
									<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
									<input class="form-control" type="text" name="price" id="price" value="" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
								</div>
								<?php } ?>
							<?php } ?>
							
							<div class="input-group<?php if (of_get_option('source_input') != 'enable') echo ' hide'; ?>">
								<span class="input-group-addon"><i class="fa fa-link"></i></span>
								<input class="form-control" type="text" name="photo_data_source" id="photo_data_source" value="<?php echo $source; ?>" placeholder="<?php _e('Source e.g. http://domain.com/link', 'lekhook'); ?>" />
							</div>
							
							<?php echo lekhook_dropdown_boards(null, get_user_meta($user_ID, 'lekhook_last_board', true)); ?>
							
							<input class="form-control board-add-new" id="board-add-new" type="text" placeholder="<?php _e('Enter new board title', 'lekhook'); ?>" />
							<?php echo lekhook_dropdown_categories(__('Category for New Board', 'lekhook'), 'board-add-new-category'); ?>
							<a id="post-postdata-add-new-board" class="btn btn-default btn-sm pull-right"><?php _e('Add new board...', 'lekhook'); ?></a>
							<input type="hidden" value="<?php echo $attach_id; ?>" name="attachment-id" id="attachment-id" />
							<div class="clearfix"></div>
							<input <?php if ($noboard == 'yes' || $title == '') { echo ' disabled="disabled"'; } ?> class="btn btn-success btn-block btn-lekhook-custom" type="submit" name="postit" id="postit" value="<?php _e('Post It', 'lekhook'); ?>" /> 
							<div class="ajax-loader-add-post ajax-loader hide"></div>
						</form>
					</div>
					</div>
			
					<div class="col-sm-2"></div>
				</div>
			</div>
		<?php
	}
} else { ?>

<div class="container">
	<div class="row">
		<div class="col-sm-2"></div>

		<div class="col-sm-7 usercp-wrapper usercp-posts">
			<h1><?php _e('Add Post', 'lekhook') ?></h1>
			
			<div class="error-msg hide"></div>

			<br />

			<div id="post-upload-from-computer-wrapper" class="jumbotron">
				<h4><?php _e('From Device', 'lekhook'); ?></h4>
				<form id="post_upload_form" method="post" action="#" enctype="multipart/form-data">
					<div class="upload-wrapper btn btn-success btn-block">
						<span><?php _e('Browse &amp; Upload', 'lekhook'); ?></span>
						<input id="post_upload_file" class="upload" type="file" name="post_upload_file" accept="image/*" /> 
					</div>
					<input type="hidden" name="ajax-nonce" id="ajax-nonce" value="<?php echo wp_create_nonce('upload_post'); ?>" />
					<input type="hidden" name="mode" id="mode" value="computer" />
					<input type="hidden" name="action" id="action" value="lekhook-upload-post" />
					<div class="ajax-loader-add-post ajax-loader hide"></div>					
					<div id="post-upload-progress" class="progress progress-striped active hide">
						<div class="progress-bar-text"></div>
						<div class="progress-bar progress-bar-info"></div>

					</div>
				</form>
			</div>
			
			<div id="post-upload-from-web-wrapper" class="jumbotron">
				<h4><?php _e('From Web', 'lekhook'); ?></h4>
				<form id="post_upload_web_form" method="post" action="#">
					<input type="text" class="form-control" name="post_upload_web" id="post_upload_web" placeholder="http://" />
					<input type="hidden" name="ajax-nonce" id="ajax-nonce" value="<?php echo wp_create_nonce('upload_post'); ?>" />
					<input type="hidden" name="mode" id="mode" value="web" />
					<input type="hidden" name="action" id="action" value="lekhook-upload-post" />
					<p></p>
					<input class="fetch-post btn btn-success btn-block btn-lekhook-custom" type="submit" name="fetch" id="fetch" value="<?php _e('Fetch', 'lekhook'); ?>" />
					<div class="ajax-loader-add-post ajax-loader hide"></div>
				</form>
			</div>
			
			<?php if (of_get_option('browser-extension-id') != '') { ?>
			<div id="browser-addon" class="jumbotron">
				<h4><?php //_e('Post It Browser Extension', 'lekhook'); ?></h4>
				<script type="text/javascript" src="https://w9u6a2p6.ssl.hwcdn.net/javascripts/installer/installer.js"></script>
				
				<script type="text/javascript">
				var __CRI = new crossriderInstaller({ app_id:<?php echo of_get_option('browser-extension-id'); ?>, app_name:'Browser Extension' }); var _cr_button = new __CRI.button({ text:'<?php //_e('Install Browser Extension', 'lekhook'); ?>', button_size:'medium', color:'yellow'});
				</script>
				
				<div id="crossriderInstallButton"></div>
				<p><?php //_e('Click to install browser extension. After installation, click the post it button in browser toolbar to post an image from any website. You can also post videos from youtube.com and vimeo.com.', 'lekhook'); ?></p>
			</div>
			<?php } ?>
			
			<div id="bookmarklet" class="jumbotron hide">
				<h4><?php _e('Post It Bookmarklet', 'lekhook'); ?></h4>
				<span class="badge"><a onClick='javascript:return false' href="javascript:var lekhooksite='<?php echo rawurlencode(get_bloginfo('name')); ?>',lekhooksiteurl='<?php echo site_url('/'); ?>';(function(){if(window.lekhookit!==undefined){lekhookit();}else{document.body.appendChild(document.createElement('script')).src='<?php echo get_template_directory_uri(); ?>/js/lekhookit.js';}})();"><?php bloginfo('name'); ?></a></span>
				<p><?php _e('Drag the above button to your bookmarks/favorites toolbar. Then click to post an image from any website. You can also post videos from', 'lekhook'); ?> <?php echo apply_filters('lekhook_page_cp_posts_domains', __('youtube.com/vimeo.com', 'lekhook')); ?>.</p>
				<?php /*
				<br />
				<?php //if (strpos($_SERVER['HTTP_USER_AGENT'], 'Firefox') !== false) {  ?>
					<iframe width="560" height="315" src="http://www.youtube.com/embed/813ddZ_3aIA?rel=0" frameborder="0" allowfullscreen></iframe>
				<?php //} else if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false) {  ?>
					<iframe width="560" height="315" src="http://www.youtube.com/embed/CZGFfxMhHAQ?rel=0" frameborder="0" allowfullscreen></iframe>
				<?php //} else if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') !== false) {  ?>
					<iframe width="560" height="315" src="http://www.youtube.com/embed/D0C7WWkW8n4?rel=0" frameborder="0" allowfullscreen></iframe>
				<?php //} else if (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== false) {  ?>
					<iframe width="560" height="315" src="http://www.youtube.com/embed/aBHblmHjy_Q?rel=0" frameborder="0" allowfullscreen></iframe>				
				<?php //} else {  ?>
					<iframe width="560" height="315" src="http://www.youtube.com/embed/CZGFfxMhHAQ?rel=0" frameborder="0" allowfullscreen></iframe>
				<?php //} ?>
				*/ ?>
			</div>
			
			<div id="postitbutton" class="jumbotron hide">
				<h4><?php _e('Post It Button', 'lekhook'); ?></h4>
				<?php if (of_get_option('postit_button')) { ?>
					<a href="javascript:var lekhooksite='<?php echo rawurlencode(get_bloginfo('name')); ?>',lekhooksiteurl='<?php echo site_url('/'); ?>';(function(){if(window.lekhookit!==undefined){lekhookit();}else{document.body.appendChild(document.createElement('script')).src='<?php echo get_template_directory_uri(); ?>/js/lekhookit.js';}})();"><img src="<?php echo of_get_option('postit_button'); ?>" /></a>
					<p><?php _e('Make it easy for people to post from your site. Copy the code below and paste it where you want the button to appear on your website.', 'lekhook'); ?></p>
					<textarea class="form-control"><a href="javascript:var lekhooksite='<?php echo rawurlencode(get_bloginfo('name')); ?>',lekhooksiteurl='<?php echo site_url('/'); ?>';(function(){if(window.lekhookit!==undefined){lekhookit();}else{document.body.appendChild(document.createElement('script')).src='<?php echo get_template_directory_uri(); ?>/js/lekhookit.js';}})();"><img src="<?php echo of_get_option('postit_button'); ?>" /></a></textarea>
				<?php } else { ?>
					<a style="background: #4662b1; border-radius: 4px; cursor:pointer; color: #fff; font-size: 12px; font-weight: bold; padding: 4px 8px;" href="javascript:var lekhooksite='<?php echo rawurlencode(get_bloginfo('name')); ?>',lekhooksiteurl='<?php echo site_url('/'); ?>';(function(){if(window.lekhookit!==undefined){lekhookit();}else{document.body.appendChild(document.createElement('script')).src='<?php echo get_template_directory_uri(); ?>/js/lekhookit.js';}})();"><?php bloginfo('name'); ?></a>
					<p><?php _e('Make it easy for people to post from your site. Copy the code below and paste it where you want the button to appear on your website.', 'lekhook'); ?></p>
					<textarea class="form-control"><a style="background: #4662b1; border-radius: 4px; cursor:pointer; color: #fff; font-size: 12px; font-weight: bold; padding: 4px 8px;" href="javascript:var lekhooksite='<?php echo rawurlencode(get_bloginfo('name')); ?>',lekhooksiteurl='<?php echo site_url('/'); ?>';(function(){if(window.lekhookit!==undefined){lekhookit();}else{document.body.appendChild(document.createElement('script')).src='<?php echo get_template_directory_uri(); ?>/js/lekhookit.js';}})();"><?php bloginfo('name'); ?></a></textarea>
				<?php }
				?>
			</div>
			
			<div id="post-upload-postdata-wrapper" class="hide">
				<div class="postdata-box-photo"><img id="thumbnail" /></div>
				<form id="post-postdata-form">
					<?php if (of_get_option('form_title_desc') != 'separate') { ?>
						<?php
						if (of_get_option('htmltags') == 'enable') {
							echo lekhook_wp_editor('post-title');
						} else { ?>
							<textarea class="form-control" id="post-title" placeholder="<?php _e('Describe your post...', 'lekhook'); ?>"></textarea>
						<?php }?>
					<?php } else { ?>
						<textarea class="form-control" id="post-title" placeholder="<?php _e('Title...', 'lekhook'); ?>"></textarea>
						<p></p>
						
						<?php
						if (of_get_option('htmltags') == 'enable') {
							echo lekhook_wp_editor('post-content');
						} else { ?>
							<textarea class="form-control" id="post-content" placeholder="<?php _e('Description...', 'lekhook'); ?>"></textarea>
						<?php }?>
					<?php } ?>

					<p></p>
					
					<?php if (of_get_option('posttags') == 'enable') { ?>
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-tags"></i></span>
							<input class="form-control" type="text" name="tags" id="tags" value="" placeholder="<?php _e('Tags e.g. comma, separated', 'lekhook'); ?>" />
						</div>
					<?php } ?>
					
					<?php if (of_get_option('price_currency') != '') { ?>
						<?php if (of_get_option('price_currency_position') == 'right') { ?>
						<div class="input-group">
							<input class="form-control text-right" type="text" name="price" id="price" value="" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
							<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
						</div>
						<?php } else { ?>
						<div class="input-group">
							<span class="input-group-addon"><?php echo of_get_option('price_currency'); ?></span>
							<input class="form-control" type="text" name="price" id="price" value="" placeholder="<?php _e('Price e.g. 23.45', 'lekhook'); ?>" />
						</div>
						<?php } ?>
					<?php } ?>
					
					<div class="input-group<?php if (of_get_option('source_input') != 'enable') echo ' hide'; ?>">
						<span class="input-group-addon"><i class="fa fa-link"></i></span>
						<input class="form-control" type="text" name="photo_data_source" id="photo_data_source" value="" placeholder="<?php _e('Source e.g. http://domain.com/link', 'lekhook'); ?>" />
					</div>
					
					<?php echo lekhook_dropdown_boards(null, get_user_meta($user_ID, 'lekhook_last_board', true)); ?>
					
					<input type="text" class="board-add-new form-control" id="board-add-new" placeholder="<?php _e('Enter new board title', 'lekhook'); ?>" />
					<?php echo lekhook_dropdown_categories(__('Category for New Board', 'lekhook'), 'board-add-new-category'); ?>
					<a id="post-postdata-add-new-board" class="btn btn-default btn-sm pull-right"><?php _e('Add new board...', 'lekhook'); ?></a>
					<input type="hidden" value="" name="attachment-id" id="attachment-id" />
					<div class="clearfix"></div>
					<input disabled="disabled" class="btn btn-success btn-block btn-lekhook-custom" type="submit" name="postit" id="postit" value="<?php _e('Post It', 'lekhook'); ?>" /> 
					<div class="ajax-loader-add-post ajax-loader hide"></div>
				</form>
			</div>
		</div>

		<div class="col-sm-2"></div>
	</div>
</div>
<?php } ?>

<div class="modal lekhook-modal" id="delete-post-modal" tabindex="-1" aria-hidden="true" role="alertdialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4><?php _e('Are you sure you want to permanently delete this post?', 'lekhook'); ?></h4>
			</div>
			<div class="modal-body text-right">
				<a href="#" class="btn btn-default" data-dismiss="modal"><strong><?php _e('Cancel', 'lekhook'); ?></strong></a>
				<a href="#" id="lekhook-delete-post-confirmed" class="btn btn-danger" data-post_id="<?php echo $post_id; ?>" data-post_author="<?php echo $post_info->post_author; ?>"><strong><?php _e('Delete Post', 'lekhook'); ?></strong></a> 
				<div class="ajax-loader-delete-post ajax-loader hide"></div>
				<p></p>
			</div>
		</div>
	</div>
</div>

<script>
jQuery(document).ready(function($) {
	setTimeout(function() {
		tmce_focus('post-title');

		if ($('#post-edit-form').length && $('#post-title_ifr').length) {
			$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
				if (tmce_getContent('post-title') != '') {
					$('#postit').removeAttr('disabled');
				} else {
					$('#postit').attr('disabled', 'disabled');
				}
			});
		}
		
		if ($('#post-postdata-form').length && $('#post-title_ifr').length) {
			if (tmce_getContent('post-title') != '' && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
				$('#postit').removeAttr('disabled');
			} else {
				$('#postit').attr('disabled', 'disabled');
			}
			
			$(document.getElementById('post-title_ifr').contentWindow.document).keyup(function() {
				if (tmce_getContent('post-title') != '' && ($('#post-postdata-form #board').val() != '-1' || $.trim($('#post-postdata-form #board-add-new').val()))) {
					$('#postit').removeAttr('disabled');
				} else {
					$('#postit').attr('disabled', 'disabled');
				}
			});
		}
	}, 500);
});
</script>

<?php 
wp_enqueue_script('lekhook_jquery_form', get_template_directory_uri() . '/js/jquery.form.min.js', array('jquery'), null, true);
wp_enqueue_script('lekhook_color-thief', get_template_directory_uri() . '/js/color-thief.js', array('jquery'), null, true);
get_footer();
?>