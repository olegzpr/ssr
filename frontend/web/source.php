<?
$name='place_'.md5(date("YmdHis"));
$img = explode(',', str_replace(' ', '+', $_POST['tmp']));
$img= base64_decode($img[1]);
$ext=explode('.', $_POST['name']);
$ext=$ext[count($ext)-1];

if (!file_exists($_SERVER['DOCUMENT_ROOT'].$_POST['folder'])){
    mkdir($_SERVER['DOCUMENT_ROOT'].$_POST['folder']);
}
$fpng = fopen($_SERVER['DOCUMENT_ROOT'].$_POST['folder'].$name.".".$ext, "w");

fwrite($fpng,$img);
fclose($fpng);
$fname.=$name.'.'.$ext;

echo $fname;
?>