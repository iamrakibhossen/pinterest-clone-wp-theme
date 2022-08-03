<form class="form-inline" method="get" action="<?php echo home_url(); ?>/">
	<div class="form-group">
		<input class="form-control" type="search" name="s" value="<?php the_search_query(); ?>" placeholder="<?php _e('Search', 'lekhook'); ?>" />
	</div>
	<button class="btn btn-success" type="submit"><strong><?php _e('Search', 'lekhook'); ?></strong></button>
</form>