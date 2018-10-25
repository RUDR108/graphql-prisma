import getUserId from "../utils/getUserId";

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first:args.first,
            skip:args.skip,
            after:args.after,
            orderBy:args.orderBy
        }
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    
    async myPosts(parent,args,{prisma,request},info){
        
        const userId=getUserId(request,true)

        const opArgs={
            first:args.first,
            skip:args.skip,
            after:args.after,
            orderBy:args.orderBy,
            where:{
                author:{
                    id:userId
                }
            }
        }
        
        if (args.query) {
            opArgs.where.OR =  [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }] 
    }

    return prisma.query.posts(opArgs,info)
  
        
},
    
async posts(parent, args, { prisma }, info) {
        const opArgs = {
            first:args.first,
            skip:args.skip,
            after:args.after,
            orderBy:args.orderBy,
            where:{
                published:true
            }
        }
    

        if (args.query) {
            opArgs.where.OR =  [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }] 
              
        }

        return prisma.query.posts(opArgs, info)
    },
    
    comments(parent, args, { prisma }, info) {
        const opArgs={
            first:args.first,
            skip:args.skip,
            after:args.after,
            orderBy:args.orderBy
        }
        return prisma.query.comments(opArgs, info)
    },
    
    async me(parent,args,{prisma,request},info) {
     const userId=getUserId(request)

     return prisma.query.user({where:{
         id:userId
     }})

    },
    
    async post(parent,args,{prisma,request},info) {
     const userId=getUserId(request,false);

     const posts=await prisma.query.posts({where:{id:args.id,
    OR:[{
        published:true
    },{
        author:{
            id:userId
        }
    }]}},info)

    if(posts.length===0){
        throw new Error('Post not found.');
    }

    return posts[0]
    }

    
}

export { Query as default }



// const Query={
//     users(parent,args,{prisma},info){
       
//         const opArgs={}

//         if(args.query){
//             opArgs.where={
//                 OR:[
//                     {
//                         name_contains:args.query
//                     },{
//                         email_contains:args.query
//                     }
//                 ]
//             }
//         }
//             return prisma.query.users(opArgs,info)

        

//     //     if(!args.query){
//     //        return db.users
//     //     }
//     //    return db.users.filter((user)=>{
//     //        return user.name.toLowerCase().includes(args.query.toLowerCase());
//     //    });
//     },
//     posts(parent,args,{db,prisma},info){

//         const opArgs={};

//         if(args.query){
//             opArgs.where={
//               OR:[
//                   {title_contains:args.query},
//                   {body_contains:args.query}
//               ]  
//             }
//         }
        

//     //     if(!args.query){
//     //         return db.posts;
//     //     }
//     //     return db.posts.filter((post)=>{
//     //        const titleMatch=post.title.toLowerCase().includes(args.query.toLowerCase());
//     //        const bodyMatch=post.body.toLowerCase().includes(args.query.toLowerCase());
//     //        return titleMatch || bodyMatch;
//     //    })

//         return prisma.query.posts(opArgs,info)
    
//     },

//     comments(parent,args,{db,prisma},info){

//     return prisma.query.comments(null,info)
   
//     },
   
//    me(){
//        return{
//            id:'1236',
//            name:'mike',
//            email:'email',
//            age:123
//        }
//    }
// }

// export{Query as default};