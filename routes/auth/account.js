const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const queryExec = require('../../query_exec');
const crypto = require('crypto');


///user_idに使用する文字セット
const user_id_char_set = "abcdefghijklmnopqrstuvwxyz0123456789";
//user_idの文字サイズ
const USER_ID_LEN = 4;
//暗号化キー
const ENCRYPTION_KEY = "densankey"


router.get('/', function(req, res){
    res.render("account.ejs");
});

/**
 * アカウント登録
 */
router.post('/signup', async function(req, res){
    try{
        let login_id = req.body.userid;
        let password = req.body.password;
        const search_login_id  = await queryExec("select login_id from user where login_id='"+login_id+"';");
        if (search_login_id.length == 0){
            let user_id = "";
            let search_user_id;
            do {
                user_id = "";
                for (let i=0;i < USER_ID_LEN;i++)
                    user_id += user_id_char_set[Math.floor(Math.random()*user_id_char_set.length)];
                search_user_id = await queryExec("select user_id from user where user_id='"+user_id+"';");
            } while (search_user_id.length != 0); //既存のログインIDと重複したらIDを再生成する

            const cipher = crypto.createCipher('aes192', ENCRYPTION_KEY);
            cipher.update(password, 'utf8', 'hex');

            await queryExec("insert into user (user_id, login_id, password) values ('"+user_id+"','"+login_id+"','"+cipher.final('hex')+"');");

            res.send("new created account");
        } else{
            res.send('already userid');
        }
    } catch(error){
        console.log(error);
        res.send("error");
    }
});

/**
 * ログイン
 */
router.post('/signin', async function(req, res){
    try{
        let login_id = req.body.userid;
        let password = req.body.password;
        const search_login_id  = await queryExec("select login_id, password from user where login_id='"+login_id+"';");
        const decipher = crypto.createDecipher('aes192', ENCRYPTION_KEY);
        decipher.update(search_login_id[0].password, 'hex', 'utf8');
        if (password == decipher.final('utf8')){
            req.session.login_id = login_id;
            res.redirect('../');
        } else{
            res.redirect('/');
        }
    } catch(error){
        console.log(error);
        res.send(error);
    }
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;