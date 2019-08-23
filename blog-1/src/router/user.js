const login = require("../controller/user")
const { SuccessModel, ErrorModel } = require(".././model/resModel")

const getCookieExpiress = ()=>{
    const d = new Date()
    d.setTime(d.getTime()+24*60*60*1000)

    return d.toGMTString()
}

const handleUserRouter = (req,res)=>{

    const method = req.method
    const url =  req.url
    const path = url.split("?")[0]

    if(method === 'POST' && path === "/api/user/login"){

        const {username, password} = req.body;

        return login(username, password).then(result=>{
            if(result){

                req.session.username = result.username
                req.session.password = result.realname

                return new SuccessModel(result)
            }else{
                return new ErrorModel("登录失败")
            }
        })
    }
}

module.exports = handleUserRouter