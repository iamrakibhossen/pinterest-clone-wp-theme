<?php global $wp_taxonomies; ?>
<div id="post-<?php the_ID(); ?>" <?php post_class('thumb'); ?>>
	<div class="thumb-holder">		
		<a class="featured-thumb-link" href="<?php the_permalink(); ?>" <?php $bgcolor = get_post_meta($post->ID, '_Bg Color', true); if ($bgcolor) echo 'style="background-color: rgba(' . $bgcolor . ',0.5)"'; ?>>
			<?php if (of_get_option('price_currency') != '' && lekhook_get_post_price() != '') { ?>
				<div class="pricewrapper"><div class="pricewrapper-inner"><?php echo lekhook_get_post_price(); ?></div></div>
			<?php }	?>

			<?php
			//if is video
			$photo_source = get_post_meta($post->ID, "_Photo Source", true);
			$post_video = lekhook_get_post_video($photo_source);
			if ($post_video) {
			?>
			<div class="featured-thumb-video"></div>
			<?php } ?>
			
			<?php
			$imgsrc = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'medium');
			if ($imgsrc[0] == '') {
				$imgsrc[0] = get_template_directory_uri() . '/img/blank.gif';
				$imgsrc[1] = get_option('medium_size_w');
				$imgsrc[2] = get_option('medium_size_w');
			}
			
			//if is animated gif
			$animated_gif = false;
			if (substr($imgsrc[0], -4) == '.gif' && get_post_meta(get_post_thumbnail_id($post->ID), 'a_gif', true) == 'yes') {
					$animated_gif = true;
					$animated_gif_imgsrc_full = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full');
					echo '<div class="featured-thumb-gif"></div>';

			}
			
			//if need resize
			if ($post_video && strpos($post_video, 'data-resize') !== false) {
				$imgsrc[1] = get_option('medium_size_w');
				$imgsrc[2] = round(get_option('medium_size_w')/1.77);
			}
			?>
			<img class="featured-thumb<?php if ($animated_gif) echo ' featured-thumb-gif-class" data-animated-gif-src-medium="' . $imgsrc[0] . '" data-animated-gif-src-full="' . $animated_gif_imgsrc_full[0]; ?>" src="<?php echo $imgsrc[0]; ?>" alt="<?php echo mb_strimwidth(the_title_attribute('echo=0'), 0, 100, ' ...'); ?>" style="width:<?php echo $imgsrc[1]; ?>px;height:<?php echo $imgsrc[2]; ?>px" />
		</a>
		
		<?php if ($post->post_status != 'pending') { ?>
			<div class="masonry-actionbar">
				<?php if (current_user_can('administrator') || current_user_can('editor') || current_user_can('author') || !is_user_logged_in()) { ?>
					<button id="lekhook-repost-<?php echo $post->ID; ?>" class="lekhook-repost btn btn-default btn-sm" data-post_id="<?php echo $post->ID ?>" type="button"><i class="fa fa-retweet fa-lg"></i></button>
				<?php } ?>
		
				<?php if ($post->post_author != $user_ID) { ?> 
					<span class="undisable_buttons">
						<button id="lekhook-like-<?php echo $post->ID; ?>" class="lekhook-like btn btn-default btn-sm<?php if(lekhook_liked($post->ID)) { echo ' disabled'; } ?>" data-post_id="<?php echo $post->ID ?>" data-post_author="<?php echo $post->post_author; ?>" type="button"><i class="fa fa-heart fa-lg"></i></button>
					</span>
				<?php } else { ?>
					<a id="lekhook-edit-<?php echo $post->ID; ?>" class="lekhook-edit-actionbar btn btn-default btn-sm" href="<?php echo home_url('/post/'); ?>?i=<?php the_ID(); ?>"><i class="fa fa-pencil fa-lg"></i></a>
				<?php } ?>
				
				<span class="undisable_buttons">
					<button id="lekhook-comment-<?php echo $post->ID; ?>" class="lekhook-comment btn btn-default btn-sm" data-post_id="<?php echo $post->ID ?>" type="button"><i class="fa fa-comment fa-lg"></i></button>
				</span>
			</div>
		<?php } ?>

		<?php
		$tags = '';
		if (of_get_option('posttags') == 'enable') {
			$the_tags = get_the_tags();
			if ($the_tags) {
				foreach($the_tags as $the_tag) {
					$tags .= $the_tag->name . ', ';
				}
				$tags = substr($tags, 0, -2);
			}
		}
		?>



		<div class="post-title" data-title="<?php echo esc_attr($post->post_title); ?>" data-tags="<?php echo esc_attr($tags); ?>" data-price="<?php echo esc_attr(lekhook_get_post_price(false)); ?>" data-content="<?php echo esc_attr($post->post_content); ?>">
        
			<?php
			if ($post->post_status == 'pending') {
				echo '<p><span class="label label-warning">' . __('Pending Review', 'lekhook') . '</span></p>';
			}

			echo mb_strimwidth(the_title_attribute('echo=0'), 0, 70, ' ...');

			/* uncomment to display tags
			if ($the_tags) {
				echo '<div class="thetags">';
				
				foreach($the_tags as $the_tag) {
					echo '<a href="' . get_tag_link($the_tag->term_id). '">' . $the_tag->name . '</a> '; 
				}
				
				echo '</div>';
			}
			*/
			?>
		</div>
	</div>
	
	<?php 
	$likes_number = get_post_meta($post->ID, '_Likes Count', true);
	$reposts_number = get_post_meta($post->ID, '_Repost Count', true);
	$comments_number = get_comments_number();
	?>
	<div class="masonry-meta masonry-meta-comment-likes">
	<?php
		if ($reposts_number == '' || $reposts_number == '0') {
			echo '<span id="reposts-count-' . $post->ID . '" class="reposts-count hide"></span>';'</span>';
		} else {
			echo '<span id="reposts-count-' . $post->ID . '" class="reposts-count"><i class="fa fa-retweet"></i> ' . $reposts_number . '</span>';	
		}
		
		if ($likes_number == '' || $likes_number == '0') {
			echo '<span id="likes-count-' . $post->ID . '" class="likes-count hide"></span>';
		} else {
			echo '<span id="likes-count-' . $post->ID . '" class="likes-count"><i class="fa fa-heart"></i> ' . $likes_number . '</span>';
		}

		if ($comments_number == '0') {
			echo '<span id="comments-count-' . $post->ID . '" class="comments-count hide"></span>';
		} else {
			echo '<span id="comments-count-' . $post->ID . '" class="comments-count"><i class="fa fa-comment"></i> ' . $comments_number . '</span>';
		}
	?>
	</div>

	<div class="masonry-meta">
		<div class="masonry-meta-avatar"><a href="<?php echo home_url('/' . $wp_rewrite->author_base . '/') . get_the_author_meta('user_nicename'); ?>/"><?php echo get_avatar(get_the_author_meta('ID') , '30'); ?></a></div>
		<div class="masonry-meta-comment">
			<div class="masonry-meta-author"><a href="<?php echo home_url('/' . $wp_rewrite->author_base . '/') . get_the_author_meta('user_nicename'); ?>/"><?php echo get_the_author_meta('display_name'); ?></a></div>
			<?php if (lekhook_get_post_board()) { ?> 
				<div class="masonry-meta-content"><a href="<?php echo home_url('/' . $wp_taxonomies["board"]->rewrite['slug'] . '/' . sanitize_title(lekhook_get_post_board()->name, '_') . '/' . lekhook_get_post_board()->term_id . '/'); ?>"><?php echo lekhook_get_post_board()->name; ?></a></div>
			<?php }	?>
		</div>
	</div>
    
    
		
	<?php
		
	if (is_user_logged_in()) {
	?>
	<div id="masonry-meta-commentform-<?php echo $post->ID ?>" class="masonry-meta hide">
		<div class="masonry-meta-avatar"><?php echo get_avatar($user_ID, '30'); ?></div>
		<div class="masonry-meta-comment">
		<?php 
		$id_form = 'commentform-' . $post->ID;
		$id_submit = 'submit-' . $post->ID;
		
		comment_form(array(
			'id_form' => $id_form,
			'id_submit' => $id_submit,
			'title_reply' => '',
			'cancel_reply_link' => __('X Cancel reply', 'lekhook'),
			'comment_notes_before' => '',
			'comment_notes_after' => '',
			'logged_in_as' => '',
			'label_submit' => __('Post Comment', 'lekhook'),
			'comment_field' => '<textarea class="form-control" placeholder="' . __('Add a comment...', 'lekhook') . '" name="comment" aria-required="true"></textarea>'
		));
		?>
		</div>
	</div>
	<?php } ?>
</div>