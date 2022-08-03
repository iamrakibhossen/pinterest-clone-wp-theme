<?php
if (in_category(lekhook_blog_cats())) {
	get_template_part('single', 'blog');
} else {
	get_template_part('single', 'post');
}
?>