const { exec }  = require('../db/mysql')

const login = (username, password)=>{

    let sql = `select * from users where username = '${username}' and password = '${password}';`

    return exec(sql).then(result=>{

        if(result.length >0){
            return result[0]
        }else{
            return false
        }
    })
}

module.exports = login