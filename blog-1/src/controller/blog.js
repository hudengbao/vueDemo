const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    
    let sql = `select * from blogs where 1=1`;

    if(author){
        sql += ` and author = '${author}' `
    }

    if(keyword){
        sql += ` and title like '%${keyword}%'`
    }

    sql += ` order by createtime desc;`

    return exec(sql)
}

const getDeatil = (id) => {

    let sql = `select * from blogs where id=${id};`

    return exec(sql).then(rows=>{
        return rows[0]
    })
}

const newBlog = (reqData={}) => {

    const { author, title, content } =  reqData;
    const date = new Date().getTime()
    
    let sql = `insert into blogs (author, title, content, createtime) 
        values('${author}', '${title}', '${content}', '${date}');`

    return exec(sql).then(insertResult=>{
        return {
            id: insertResult.insertId
        }
    })
}

const updateBlog = (id, blogData={}) => {
    const { title, content } = blogData;

    let sql = `update blogs set title='${title}', content='${content}' where id=${id};`

    return exec(sql).then(updateResult=>{

        if(updateResult.effectedRows > 0){
            return true
        }else{
            return true
        }
    })
}

const deleteBlog = (id, author) => {

    let sql = `delete from blogs where id=${id} and author='${author}';`

    return exec(sql).then(deleteResult=>{

        if(deleteResult.effectedRows > 0){
            return true
        }else{
            return true
        }
    })
}

module.exports = { getList, getDeatil, newBlog, updateBlog, deleteBlog }