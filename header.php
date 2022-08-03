<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: http://ogp.me/ns#">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

	<title><?php wp_title('', true, 'right'); if (!is_home() && !is_front_page()) echo ' | '; bloginfo( 'name' ); $site_description = get_bloginfo('description', 'display'); if ($site_description && (is_home() || is_front_page())) echo ' | ' . $site_description; ?></title>
	<?php 
	global $user_ID, $user_identity, $post;
	if (is_single() && $post->post_content == '' && !function_exists('wpseo_init')) {
		$meta_categories = get_the_category($post->ID);
	
		foreach ($meta_categories as $meta_category) {
			$meta_category_name = $meta_category->name;
		}

		if (lekhook_get_post_board()) {
			$meta_board_name = lekhook_get_post_board()->name;
		} else {
			$meta_board_name = __('Untitled', lekhook);
		}
		?>
		<meta name="<?php echo 'descript' . 'ion'; //bypass yoast seo check ?>" content="<?php _e('Postned onto', 'lekhook'); ?> <?php echo esc_attr($meta_board_name); ?> <?php _e('Board in', 'lekhook') ?> <?php echo esc_attr($meta_category_name); ?> <?php _e('Category', 'lekhook'); ?>" />
		<?php
	}
	?>
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
	<link rel="postgback" href="<?php bloginfo( 'postgback_url' ); ?>" />
	<?php wp_head(); ?>
	<?php eval('?>' . of_get_option('header_scripts')); ?>
	
	<!--[if lt IE 9]>
		<script src="<?php echo get_template_directory_uri(); ?>/js/respond.min.js"></script>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
</head>

<body <?php body_class(); ?>>
	<noscript>
		<style type="text/css" media="all">#masonry { visibility: visible !important; }</style>
	</noscript>

	<?php if (of_get_option('facebook_comments') != 'disable') { ?>
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1<?php if (get_option('wsl_settings_Facebook_app_id')) echo '&appId=' . get_option('wsl_settings_Facebook_app_id'); ?>";
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>
	<?php } ?>
	
	<nav id="topmenu" class="navbar<?php if (of_get_option('color_scheme') == 'dark') echo ' navbar-inverse'; else echo ' navbar-default' ?> navbar-fixed-top">
		<div class="container-fluid">
			<div id="top-menu-right-mobile" class="visible-xs">
			<?php if ($user_ID) { ?>
				<?php
				$notifications_count = get_user_meta($user_ID, 'lekhook_user_notifications_count', true);
				if ($notifications_count == '') $notifications_count = '0';
				?>
				<a id="top-notifications-mobile" class="<?php if ($notifications_count != '0') echo 'top-notifications-mobile-count-nth'; ?>" href="<?php echo home_url('/notifications/'); ?>"><span class="hide"><?php echo $notifications_count; ?></span><i class='bx bxs-bell bx-md '></i></a>
				<?php if (current_user_can('edit_posts')) { ?>
					<a id="top-add-button-mobile" href="<?php echo home_url('/post/'); ?>"><i class='bx bxs-image-add bx-md'></i></a>
				<?php } ?>
			<?php } else { ?>
				<a id="top-add-button-mobile" href="<?php echo home_url('/login/'); ?>"><i class="fa fa-user"></i></a>
			<?php } ?>
            
            <button class="navbar-toggle" data-toggle="collapse" data-target="#nav-main" type="button">
					<i class='bx bx-menu bx-md' ></i>
				</button>
                
			</div>

			<div class="navbar-header">
				

				<?php $logo = of_get_option('logo'); ?>
				<a class="navbar-brand<?php if ($logo != '') { echo ' logo'; } ?>" href="<?php echo home_url('/'); ?>">
				<?php if ($logo != '') { ?>
					<img src="<?php echo $logo ?>" class="avatar" alt="Logo" />
				<?php } else {
	
					echo'<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="fill:rgba(224, 30, 90, 1);transform:;-ms-filter:"><path d="M22.014,11.974C21.996,6.462,17.521,2,12.008,2C6.493,2,2.019,6.462,2.001,11.974C2.001,11.964,2,11.957,2,11.948v0.054 c0,0,0,0.001,0,0.003c0,0,0,0.001,0,0.001v0.054c0-0.007,0-0.015,0.001-0.023c0.017,5.513,4.491,9.977,10.007,9.977 c5.514,0,9.988-4.462,10.006-9.974c0,0.009,0.001,0.017,0.001,0.026v-0.054c0-0.001,0-0.003,0-0.005s0-0.003,0-0.005v-0.054 C22.015,11.958,22.014,11.965,22.014,11.974z M9.281,16.557c-2.509,0-4.548-2.039-4.548-4.549s2.039-4.549,4.548-4.549 c1.23,0,2.258,0.451,3.046,1.188l-1.295,1.255c-0.325-0.309-0.899-0.673-1.751-0.673c-1.505,0-2.733,1.251-2.733,2.785 c0,1.533,1.229,2.784,2.733,2.784c1.742,0,2.384-1.206,2.502-1.92H9.279v-0.004V11.18h4.255c0.066,0.286,0.115,0.554,0.115,0.932 C13.649,14.709,11.907,16.557,9.281,16.557z M19.739,12.462H17.92v1.819h-1.364v-1.819h-1.82v-1.364h1.82v-1.82h1.364v1.82h1.819 V12.462z"></path></svg>';
				}
				?>
				</a>
			</div>

			<div id="nav-main" class="collapse navbar-collapse">
				<form class="navbar-form" method="get" id="searchform" action="<?php echo home_url('/'); ?>"><div class="input-group">
									<input id="s" class="form-control  search-query" type="search" placeholder="<?php _e('Search', 'lekhook'); ?>" name="s" value="<?php the_search_query(); ?>">
									<input type="hidden" name="q" value="<?php if( isset($_GET['q']) ){ echo $_GET['q']; } ?>"/>
									<div class="input-group-btn">
   
									<button class="btn btn-default " type="submit"><i class="fa fa-search"></i></button> </div></div>
								</form>
				<ul id="menu-top-right" class="nav navbar-nav navbar-right">
				<?php if ($user_ID) { ?>
					<?php if (current_user_can('edit_posts')) { ?>
                    <li class="hidden-xs nav-item-home">
						<a rel="tooltip" data-placement="bottom" title="<?php _e('Home', 'lekhook'); ?>" href="<?php echo home_url('/'); ?>">
							<i class='bx bxs-home bx-md'></i>
						</a>
					</li>
					<li class="hidden-xs nav-item-following">
						<a rel="tooltip" data-placement="bottom" title="<?php _e('Following Feed', 'lekhook'); ?>" href="<?php echo home_url('/following/'); ?>">
							<i class='bx bxs-group bx-md' ></i>
						</a>
					</li>
                    <li class="hidden-xs nav-item-popular">
						<a rel="tooltip" data-placement="bottom" title="<?php _e('Popular', 'lekhook'); ?>" href="<?php echo home_url('/popular/'); ?>">
							<i class='bx bxs-compass bx-md'></i>
						</a>
					</li>
                    
					
					<?php } ?>
                    
                    <li id="user-notifications-count" class="hidden-xs"><a<?php if ($notifications_count != '0') echo ' class="user-notifications-count-nth"'; ?> href="<?php echo home_url('/notifications/'); ?>" rel="tooltip" data-placement="bottom" title="<?php _e('Notifications', 'lekhook'); ?>"><span class="hide"><?php echo $notifications_count; ?></span><i class='bx bxs-bell bx-md '></i></a></li>
                    
                    <li class="hidden">
						<a rel="tooltip" data-placement="bottom" title="<?php _e('Add Post', 'lekhook'); ?>" href="<?php echo home_url('/post/'); ?>">
							<i class='bx bxs-message-dots bx-md' ></i>
						</a>
					</li>

					<li id="dropdown-user-settings" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" data-target="" href=""><span class="hidden-xs"><?php echo get_avatar($user_ID, '28'); ?></span><span class="visible-xs pull-left"><?php echo $user_identity; ?>&nbsp;</span> <b class="hide caret"></b></a>
						<ul class="dropdown-menu">
							<?php if (current_user_can('edit_posts')) { ?>
							<li class="visible-xs"><a href="<?php echo home_url('/post/'); ?>"><?php _e('Add Post', 'lekhook'); ?></a></li>
							
							<?php } ?>
							
							<li><a href="<?php echo get_author_posts_url($user_ID); ?>"><i class="fa fa-user fa-fw hidden-xs"></i> <?php _e('Profile &amp; Posts', 'lekhook'); ?></a></li>
							
							<li><a href="<?php echo home_url('/following/'); ?>"><i class="fa fa-list-ul fa-fw hidden-xs"></i> <?php _e('Following Feed', 'lekhook'); ?></a></li>
							
							<li><a href="<?php echo home_url('/settings/'); ?>"><i class="fa fa-cog fa-fw hidden-xs"></i> <?php _e('Settings', 'lekhook'); ?></a></li>
							<?php if (current_user_can('administrator') || current_user_can('editor')) { ?>
							<li><a href="<?php echo home_url('/wp-admin/'); ?>"><i class="fa fa-wordpress fa-fw hidden-xs"></i> <?php _e('WP Admin', 'lekhook'); ?></a></li>
							<?php } ?>
							<li><a href="<?php echo home_url('/login/?action=logout&amp;nonce=' . wp_create_nonce('logout')); ?>"><i class="fa fa-sign-out fa-fw hidden-xs"></i> <?php _e('Log Out', 'lekhook'); ?></a></li>
						</ul>
					</li>
					
                    <li class="hidden-xs">
						<a rel="tooltip" data-placement="bottom" title="<?php _e('Add Post', 'lekhook'); ?>" href="<?php echo home_url('/post/'); ?>">
							<i class='bx bxs-plus-square bx-md bx-flashing-hover'></i>
						</a>
					</li>
                    
                    
				<?php } else { ?>
					<li class="visible-xs"><a href="<?php echo home_url('/signup/'); ?>"><?php _e('Sign Up', 'lekhook'); ?></a></li>
					<li class="visible-xs"><a href="<?php echo wp_login_url($_SERVER['REQUEST_URI']); ?>"><?php _e('Login', 'lekhook'); ?></a></li>
					<li class="hidden-xs" id="loginbox-wrapper"><button id="loginbox" class="btn btn-default navbar-btn" data-wsl='<?php if (function_exists('wsl_activate')) { do_action('wordpress_social_login'); echo '<hr />'; } ?>' aria-hidden="true" type="button"><?php _e('Login', 'lekhook'); ?></button></li>
				<?php } ?>
				</ul>

				
		
				<?php 
				if (has_nav_menu('top_nav')) {
					wp_nav_menu(array('theme_location' => 'top_nav', 'menu_class' => 'nav navbar-nav', 'depth' => '3'));
				} else {
					echo '<ul id="menu-top" class="nav navbar-nav">';
					wp_list_pages('title_li=&depth=0&sort_column=menu_order' );
					echo '</ul>';
				}
				?>

				
			</div>
		</div>
	</nav>

	<?php if (!$user_ID) { ?>	
	<div id="top-message-wrapper" class="">
		<div id="top-message" class="container">
			<div class="pull-right">
				<a class="btn btn-success" href="<?php echo home_url('/signup/'); ?>"><?php _e('Sign Up', 'lekhook'); ?></a>
			</div>
			<div class="top-message-left"><?php eval('?>' . of_get_option('top_message')); ?></div>
		</div>
	</div>
	<?php } ?>

	<?php if (of_get_option('header_ad') != '' && !is_page_template('page_cp_posts.php') && !is_page_template('page_cp_boards.php') && !is_page_template('page_cp_settings.php')) { ?>
	<div id="header-ad" class="container-fluid">
		<div class="row">
			<?php eval('?>' . of_get_option('header_ad')); ?>
		</div>
	</div>
	<?php } ?>

	<?php if (is_search() || is_category() || is_tag()) { ?>
	<div class="container subpage-title">
		<?php if (is_search()) { ?>
			<h1><?php _e('Search results for', 'lekhook'); ?> "<?php the_search_query(); ?>"</h1>
		<?php } else if (is_category()) { ?>
			<h1<?php if (in_category(lekhook_blog_cats())) echo ' style="text-align:left;"'; ?>><?php single_cat_title(); ?></h1>
			<?php if (category_description()) { ?>
				<?php echo category_description(); ?>
			<?php } ?>
			
			<?php
			$current_cat = get_category(get_query_var('cat'));
			if ($current_cat->parent == 0) {
				$is_parent_cat = true;
				$parent_cat_name = $current_cat->name;
				$parent_cat_id = $current_cat->cat_ID;
			} else {
				$is_parent_cat = false;
				$parent_cat = get_category($current_cat->parent);
				$parent_cat_name = $parent_cat->name;
				$parent_cat_id = $parent_cat->cat_ID;
			}
			$categories = get_categories('hide_empty=0&child_of=' . $parent_cat_id);
			
			if ($categories || !$is_parent_cat) {
				echo '<div class="text-center">';
				if (!$is_parent_cat) {
					echo ' <a class="popular-categories" href="' . get_category_link($parent_cat_id) . '">&laquo; ' . $parent_cat_name . '</a>';
				}
				foreach($categories as $category) {
				?>
				<a class="popular-categories<?php if (is_category($category->cat_ID)) echo ' popular-categories-active'; ?>" href="<?php echo get_category_link($category->cat_ID); ?>"><?php echo $category->name; ?></a> 
				<?php }
				echo '</div><br />';
			} ?>
		<?php } else if (is_tag()) { ?>
			<h1>#<?php single_tag_title(); ?></h1>
			<?php if (tag_description()) { ?>
				<?php echo tag_description(); ?>
			<?php } ?>
		<?php } ?>
	</div>
	<?php } ?>