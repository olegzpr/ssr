<div class="step-box" style="margin-bottom: 100px;">
    <?php
    foreach ($steps as $s){
        $class = $s['id'] == $step ? 'active' : '';
        if ($id == null) {
            ?>
            <a href="/add/step?step=<?= $s['id'] ?>" class="item <?=$class?>">
                <div class="point">
                    <span></span>
                </div>
                <div class="name"><?= $s['name'] ?></div>
            </a>
            <?php
        } else {
            ?>
            <a href="/add/step?step=<?= $s['id'] ?>&id=<?=$id?>" class="item <?=$class?>">
                <div class="point">
                    <span></span>
                </div>
                <div class="name"><?= $s['name'] ?></div>
            </a>
            <?php
        }
    }
    ?>
</div>