<?php
namespace backend\models;

use Symfony\Component\Finder\SplFileInfo;
use Yii;
use yii\base\Model;

/**
 * Login form
 */
class Files extends Model
{
    static $ext=['doc'=>'fa-file', 'mp3'=>'fa-music', 'mp4'=>'fa-film', 'xls'=>'fa-bar-chart-o', 'xlsx'=>'fa-bar-chart-o', 'pdf'=>'fa-file-pdf-o', 'docx'=>'fa-file', 'txt'=>'fa-file'];

    static $image=['jpg', 'png', 'gif', 'jpeg', 'bmp', 'JPG'];

    public function listFolder(){
        $folder=scandir($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source');
        $path=[];
        for ($i=2;$i<count($folder);$i++){
            if (is_dir($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/'.$folder[$i])) {
                array_push($path, $folder[$i]);
            }
        }

        return $path;
    }

    public function scanFile(){
        $folder=scandir($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source');

        $file=[];
        for ($i=2;$i<count($folder);$i++){
            if (!is_dir($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/'.$folder[$i])) {
                $info=new \SplFileInfo($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/'.$folder[$i]);
                $ex=$info->getExtension();
                if (in_array($ex, self::$image)){
                    $file[]=[
                        'name'=>$folder[$i],
                        'size'=>round((filesize($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/'.$folder[$i])/1024)/1024, 2),
                        'type'=>'image'
                    ];
                } else {
                    $file[]=[
                        'name'=>$folder[$i],
                        'size'=>round((filesize($_SERVER['DOCUMENT_ROOT'].'/frontend/web/source/'.$folder[$i])/1024)/1024, 2),
                        'type'=>'doc',
                        'icon'=>self::$ext[$ex]
                    ];
                }
            }
        }

        return $file;
    }
}
