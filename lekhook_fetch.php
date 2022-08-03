<?php
error_reporting(0);
require_once(dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php');
if (!is_user_logged_in() || !wp_verify_nonce($_GET['nonce'], 'ajax-nonce')) { die(); }

$url = esc_url_raw('http' . $_GET['url']);

if ($url != 'http://http') {
	$args = array(
		'user-agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'timeout' => 30,
        'limit_response_size' => 500 * 1024,
        'blocking' => true
	);
	$response = wp_remote_get($url, $args);

	if(is_wp_error($response)) {
	   echo 'error' . $response->get_error_message();
	} else {
		preg_match("/content=\"text\/(.*)>/i", $response['body'], $content_type);

		if (strpos($response['headers']['content-type'], 'text/') !== false && ($response['response']['code'] >= 200 && $response['response']['code'] <= 299)) {
			preg_match("/<title>(.*?)<\/title>/is", $response['body'], $title);

			//for multiple languages in title ref: http://php.net/manual/en/function.htmlentities.php
			if (strpos($content_type[0], '8859-1') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'ISO-8859-1') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '8859-5') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'ISO-8859-5') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '8859-15') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'ISO-8859-15') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '866') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'cp866') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '1251') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'cp1251') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '1252') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'cp1252') . '</lekhooktitle>';
			} else if (stripos($content_type[0], 'koi8') !== false) {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'KOI8-R') . '</lekhooktitle>';
			} else if (stripos($content_type[0], 'hkscs') !== false) {
				$lekhooktitle = '<lekhooktitle>' . mb_convert_encoding($title[1], 'UTF-8', 'BIG5-HKSCS') . '</lekhooktitle>';
			} else if (stripos($content_type[0], 'big5') !== false || strpos($content_type[0], '950') !== false ) {
				$lekhooktitle = '<lekhooktitle>' . mb_convert_encoding($title[1], 'UTF-8', 'BIG5') . '</lekhooktitle>';
			} else if (strpos($content_type[0], '2312') !== false || strpos($content_type[0], '936') !== false ) {
				$lekhooktitle = '<lekhooktitle>' . mb_convert_encoding($title[1], 'UTF-8', 'GB2312') . '</lekhooktitle>';
			} else if (stripos($content_type[0], 'jis') !== false || strpos($content_type[0], '932') !== false ) {
				$lekhooktitle = '<lekhooktitle>' . mb_convert_encoding($title[1], 'UTF-8', 'Shift_JIS') . '</lekhooktitle>';
			} else if (stripos($content_type[0], 'jp') !== false) {
				$lekhooktitle = '<lekhooktitle>' . mb_convert_encoding($title[1], 'UTF-8', 'EUC-JP') . '</lekhooktitle>';
			} else {
				$lekhooktitle = '<lekhooktitle>' . htmlentities($title[1], ENT_QUOTES, 'UTF-8') . '</lekhooktitle>';
			}
			
			if (of_get_option('form_title_desc') != 'separate') {
				$lekhookdescription = '';
			} else {
				preg_match('/<meta.*?name=("|\')description("|\').*?content=("|\')(.*?)("|\')/i', $response['body'], $description);
							
				//for multiple languages in description ref: http://php.net/manual/en/function.htmlentities.php
				if (strpos($content_type[0], '8859-1') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'ISO-8859-1') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '8859-5') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'ISO-8859-5') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '8859-15') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'ISO-8859-15') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '866') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'cp866') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '1251') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'cp1251') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '1252') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'cp1252') . '</lekhookdescription>';
				} else if (stripos($content_type[0], 'koi8') !== false) {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'KOI8-R') . '</lekhookdescription>';
				} else if (stripos($content_type[0], 'hkscs') !== false) {
					$lekhookdescription = '<lekhookdescription>' . mb_convert_encoding($description[4], 'UTF-8', 'BIG5-HKSCS') . '</lekhookdescription>';
				} else if (stripos($content_type[0], 'big5') !== false || strpos($content_type[0], '950') !== false ) {
					$lekhookdescription = '<lekhookdescription>' . mb_convert_encoding($description[4], 'UTF-8', 'BIG5') . '</lekhookdescription>';
				} else if (strpos($content_type[0], '2312') !== false || strpos($content_type[0], '936') !== false ) {
					$lekhookdescription = '<lekhookdescription>' . mb_convert_encoding($description[4], 'UTF-8', 'GB2312') . '</lekhookdescription>';
				} else if (stripos($content_type[0], 'jis') !== false || strpos($content_type[0], '932') !== false ) {
					$lekhookdescription = '<lekhookdescription>' . mb_convert_encoding($description[4], 'UTF-8', 'Shift_JIS') . '</lekhookdescription>';
				} else if (stripos($content_type[0], 'jp') !== false) {
					$lekhookdescription = '<lekhookdescription>' . mb_convert_encoding($description[4], 'UTF-8', 'EUC-JP') . '</lekhookdescription>';
				} else {
					$lekhookdescription = '<lekhookdescription>' . htmlentities($description[4], ENT_QUOTES, 'UTF-8') . '</lekhookdescription>';
				}
			}
            
            preg_match('/<meta.*?property=("|\')og:image("|\').*?content=("|\')(.*?)("|\')/i', $response['body'], $ogimage);
            $og_image = '';
            if( !empty($ogimage[4]) && esc_url($ogimage[4]) ){
                $og_image = '<a href="#"><img src="'.$ogimage[4].'"></a>';
            }
            
            preg_match('/<meta.*?property=("|\')og:title("|\').*?content=("|\')(.*?)("|\')/i', $response['body'], $ogtitle);
            $og_title = '';
            if( !empty($ogtitle[4]) && sanitize_text_field($ogtitle[4]) ){
                $og_title = sanitize_text_field($ogtitle[4]);
            }
            
            preg_match('/<meta.*?property=("|\')og:description("|\').*?content=("|\')(.*?)("|\')/i', $response['body'], $ogdescription);
            $og_description = '';
            if( !empty($ogdescription[4]) && sanitize_text_field($ogdescription[4]) ){
                $og_description = sanitize_text_field($ogdescription[4]);
            }
            
            if( mb_strlen($og_title) >= 5 ){
                $lekhooktitle = '<lekhooktitle>' . $og_title . '</lekhooktitle>';
            }
            
            if( mb_strlen($og_description) >= 15 ){
                $lekhookdescription = '<lekhookdescription>' . $og_description . '</lekhookdescription>';
            }
            
								
			$body = '<!DOCTYPE html><html><head><title>&nbsp;</title><meta charset="UTF-8" /></head><body>';
			$body .= $lekhooktitle . $lekhookdescription . $og_image;

			$dom = new domDocument;
			libxml_use_internal_errors(true);
			$dom->loadHTML($response['body']);
			$dom->preserveWhiteSpace = false;
			$images = $dom->getElementsByTagName('img');
            $i = 0;
			foreach ($images as $image) {
				$prepend = '';
				if (substr($image->getAttribute('src'), 0, 2) == '//') {
					$prepend = 'http:';
				}
				$body .= '<a href="#"><img src="' . $prepend . $image->getAttribute('src') .'" /></a>';
                
                if( $i >= 5 ){
                    break;
                }
                
                $i++;
			}

			$body .= '</body></html>';
			$body = absolute_url($body, parse_url($url, PHP_URL_SCHEME) . '://' . parse_url($url, PHP_URL_HOST));
			
			echo $body;
		} else {
			echo 'error' . __('Invalid content', 'lekhook');
		}
	}
} else {
	echo 'error' . __('Invalid content', 'lekhook');
}

//convert relative to absolute path for images
//ref: http://www.howtoforge.com/forums/showthread.php?t=4
function absolute_url($txt, $base_url){
  $needles = array('src="');
  $new_txt = '';
  if(substr($base_url,-1) != '/') $base_url .= '/';
  $new_base_url = $base_url;
  $base_url_parts = parse_url($base_url);

  foreach($needles as $needle){
    while($pos = strpos($txt, $needle)){
      $pos += strlen($needle);
      if(substr($txt,$pos,7) != 'http://' && substr($txt,$pos,8) != 'https://' && substr($txt,$pos,6) != 'ftp://' && substr($txt,$pos,9) != 'mailto://'){
        if(substr($txt,$pos,1) == '/') $new_base_url = $base_url_parts['scheme'].'://'.$base_url_parts['host'];
        $new_txt .= substr($txt,0,$pos).$new_base_url;
      } else {
        $new_txt .= substr($txt,0,$pos);
      }
      $txt = substr($txt,$pos);
    }
    $txt = $new_txt.$txt;
    $new_txt = '';
  }
  return $txt;
}
?>