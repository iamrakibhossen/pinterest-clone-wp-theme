<?php get_header(); ?>

<div class="container">
	<div class="row">
		<div class="bigmsg">
			<h2><?php _e('404 Error: Page Not Found', 'lekhook'); ?></h2>
		</div>

		<div class="post-content text-center">
			<?php _e('Oops... the page you requested could not be found.', 'lekhook') ?>
			<?php _e('Perhaps searching will help.', 'lekhook'); ?></p>
			<?php get_search_form(); ?>
		</div>
	</div>
</div>

<?php get_footer(); ?>