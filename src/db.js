//Demo user data
let users=[{
    id:'1',
    name:'you',
    age:34,
    email:'andr@ex.com'
    
},{
    id:'2',
    name:'Mike',
    age:56,
    email:'you@g.com'
},{
    id:'3',
    name:'dsfd',
    email:'r@m.com'
}]

//Demo post
let posts=[{
    id:'4',
    title:'Book',
    body:'Good book',
    published:true,
    author:'1'
},{
    id:'5',
    title:'Book2',
    body:'Good book',
    published:true,
    author:'1'
},{
    id:'6',
    title:'Book3',
    body:'Good book3',
    published:true,
    author:'2'
}]

//Demo Comments
let comments=[{
    id:'7',
    text:'this is a comment',
    author:'1',
    post:'4'
},{
    id:'8',
    text:'this is also a comment',
    author:'1',
    post:'5'
},   {
 id:'9',
text:'this is a comment 3',
author:'2',
post:'5'
},{
id:'10',
text:'this is also comment 4',
author:'3',
post:'6'
}]

const db={
users,
posts,
comments
}

export{db as default};