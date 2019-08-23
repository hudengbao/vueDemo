const { SuccessModel, ErrorModel } = require(".././model/resModel")
const { getList, getDeatil, newBlog, updateBlog, deleteBlog } = require(".././controller/blog")
const querystring = require("querystring")

const handleBlogRouter = (req, res) => {

    const method = req.method
    const url = req.url
    const path = url.split("?")[0]
    const query = querystring.parse(url.split("?")[1])

    const id = query.id || '';

    console.log(url)

    //blog列表
    if(method === "GET" && path === "/api/blog/list"){

        const author = query.author || ''

        const keyword = query.keyword || ''

        return getList(author, keyword).then(res=>{
            return new SuccessModel(res)
        });
    }

    //详情
    if(method === "GET" && path === "/api/blog/detail"){

        return getDeatil(id).then(data=>{
            return new SuccessModel(data)
        })
    }

    //新建
    if(method === "POST" && path === "/api/blog/add"){

        req.body.author = "hu"

        return newBlog(req.body).then(data=>{
            return new SuccessModel(data)
        })
    }

    //更新
    if(method === "POST" && path === "/api/blog/update"){

        return updateBlog(id, req.body).then(val=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('更新失败')
            }
        })
    }

    //删除
    if(method === "POST" && path === "/api/blog/delete"){

        const author = 'hu';

        return deleteBlog(req.body.id, author).then(val=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('删除失败')
            }
        })
    }
}

module.exports = handleBlogRouter