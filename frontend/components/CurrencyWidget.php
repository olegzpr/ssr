<?php

namespace frontend\components;

use backend\models\Settings;
use yii\base\Widget;
/**
 * Description of CurrencyWidget
 *
 * @author Олег
 */
class CurrencyWidget extends Widget
{
    private $currencies;
	private $CurrencyNames= [
	'usd'=>['Доллары','usd'],
	'eur'=>['Евро','eur'],
	'uah'=>['Гривны','грн'],
	];
	public $currency = '';
	public $price = 0;
	public $select = 'no';

    public function init()
    {
        parent::init();
        $this->currencies = Settings::find()->all();
    }

    public function run()
    {	
		$this->currency =(isset($_SESSION['currencySite']))?$_SESSION['currencySite']:'uah';
		if($this->select === 'yes')
		{				
			foreach($this->currencies as $val)
			{
				$selected =($this->currency==$val['name'])?'selected':'';
				printf('<option value="%s" %s>%s</option>',$val['name'],$selected, $this->CurrencyNames[$val['name']][0]);
			}
		}
		else
		{		 
			foreach($this->currencies as $val)
			{
				if($val['name'] === $this->currency)
				{
					echo round($this->price / $val['value'],2).' '.$this->CurrencyNames[$val['name']][1];
				}
			}
		}
    }
}
