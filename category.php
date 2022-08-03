<?php
if (in_category(lekhook_blog_cats())) {
	get_template_part('category', 'blog');
} else {
	get_template_part('index');
}
?>
