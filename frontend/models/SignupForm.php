<?php
namespace frontend\models;

use yii\base\Model;
use common\models\User;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $username;
    public $code;


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required'],
            ['username', 'unique', 'targetClass' => '\common\models\User', 'message' => 'Этот номер телефона уже используется'],
            ['username', 'string', 'min' => 10, 'max' => 14],
            ['code', 'required'],
            ['code', 'string', 'min' => 6, 'max' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return User|null the saved model or null if saving fails
     */
    public function signup()
    {
        if (!$this->validate()) {
            return null;
        }
        
        $user = new User();
        $user->username = $this->username;
        $user->code = $this->code;
        $user->status=10;

        if ($user->save()){
            return $user;
        } else {
            return null;
        }
    }
}
