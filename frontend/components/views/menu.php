<ul class="main-navigate">
    <?php
    foreach ($menus as $key=>$value){
    ?>
    <li class="<?=$active==$key?'active':'';?>">
        <a href="<?=$key?>">
            <i class="fa <?=$value['icon']?>"></i>
            <?=$value['name']?>
        </a>
    </li>
    <?php } ?>
</ul>