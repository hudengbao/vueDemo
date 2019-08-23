const handleUserRouter = require("./src/router/user")
const handleBlogRouter = require("./src/router/blog")

const SESSION_DATA = {}

const getCookieExpires = ()=>{
    const d = new Date()
    d.setTime(d.getTime()+24*60*60*1000)

    return d.toGMTString()
}

const getPostData = (req)=>{
    return new Promise((resolve,reject)=>{

        if(req.method !== "POST"){
            resolve({})
            return
        }

        if(req.headers["content-type"] !== "application/json"){
            resolve({})
            return
        }

        let postData = ''
        req.on("data",(chunk)=>{
            postData += chunk
        })

        req.on("end",()=>{
            if(!postData){
                resolve({})
                return
            }else{
                resolve(JSON.parse(postData))
            }
        })
    })
}

handleServer = (req,res)=>{

    //设置返回格式
    res.setHeader("Content-type", "application/json")

    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';

    cookieStr.split(";").forEach(item=>{
        if(!item){
            return
        }
        const arr = item.split("=");
        const key  = arr[0].trim();
        req.cookie[key] = arr[1]
    })

    //解析session
    let needSetCookie = false;
    let sessionId = req.cookie.sessionId
    if(sessionId){
        if(!SESSION_DATA[sessionId]){
            SESSION_DATA[sessionId] = {}
        }
    }else{
        needSetCookie = true
        sessionId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[sessionId] = {}
    }

    req.session = SESSION_DATA[sessionId]

    getPostData(req).then((postData)=>{

        req.body = postData;

        const userResult = handleUserRouter(req, res);

        if(userResult){
            userResult.then(blogData=>{
                if(needSetCookie){
                    res.setHeader("Set-cookie",`sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        const blogResult = handleBlogRouter(req, res);

        if(blogResult){
            blogResult.then(blogData=>{
                if(needSetCookie){
                    res.setHeader("Set-cookie",`sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found")
        res.end()
    })
}

module.exports = handleServer