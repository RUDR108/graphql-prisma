import bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword'; 

const Mutation = {
    async createUser(parent, args, { prisma }, info) {

       const password=await hashPassword(args.data.password);

       const user=await prisma.mutation.createUser({ data: {
        ...args.data,
        password
        } })

        return {
            user,
            token:generateToken(user.id)
        }
    },
    async LogIn(parent, args, { prisma }, info){
        const user=await prisma.query.user({where:{
            email:args.data.email
        }})

        if(!user){
            throw new Error('Unable to LogIn.');
        }

       
    
        const isMatch=await bcrypt.compare(args.data.password,user.password)

        if(!isMatch){
            throw new Error('Unable to LogIn.');
        }

        return{
            user,
            token:generateToken(user.id)
        }

      
    },
    async deleteUser(parent, args, { prisma,request }, info) {

        const userID=getUserId(request);
        
        return prisma.mutation.deleteUser({
            where: {
                id: userID
            }
        }, info)
    },
    async updateUser(parent, args, { prisma,request }, info) {
        
        const userId=getUserId(request);

        if(typeof args.data.password==='string'){
            args.data.password=await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },

    createPost(parent, args, { prisma,request }, info) {

        const userId=getUserId(request);
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
   async deletePost(parent, args, { prisma,request }, info) {
       const userId=getUserId(request)

       const postExists=await prisma.exists.Post({
           id:args.id,
           author:{
               id:userId
           }
       })

       if(!postExists){
           throw new Error('You can not delete it.');
       }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    async updatePost(parent, args, { prisma,request }, info) {

        const userId=getUserId(request)

        const postExists=await prisma.exists.Post({
            id:args.id,
            author:{
                id:userId
            }
        })
        
        const isPublished=await prisma.exists.Post({
            id:args.id,
           published:true
        })

        if(!postExists){
            throw new Error('You can not update it.');
        }

        if(isPublished && args.data.published===false){ 
             await prisma.mutation.deleteManyComments({
            where:{
                post:{
                   id:args.id
                }
            }
        })
 
    }
      

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    
    async createComment(parent, args, { prisma,request }, info) {

        const userId=getUserId(request)
        const postExists=await prisma.exists.Post({published:true,id:args.data.post})
        if(!postExists){
            throw new Error('Unable to create comment.');
        }
        // const postExists=await prisma.exists.Post({
        //     id:args.data.post,
        //     author:{
        //         id:userId
        //     }
        // })

        // if(!postExists){
        //     throw new Error('You can not update the post.');
        // }

        return prisma.mutation.createComment({
            
            
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },

    async deleteComment(parent, args, { prisma,request }, info) {
    
        const userId=getUserId(request)

          const commentExists=await prisma.exists.Comment({
            id:args.id,
            author:{
                id:userId
            }
        })

        if(!commentExists){
            throw new Error('You can not delete comment.');
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma,request }, info) {

        const userId=getUserId(request)

        const commentExists=await prisma.exists.Comment({
          id:args.id,
          author:{
              id:userId
          }
      })

      if(!commentExists){
          throw new Error('You can not update the comment.');
      }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }



// import bcrypt from 'bcryptjs'; 
// import jwt from 'jsonwebtoken';
// import getUserId from  '../utils/getUserId'

// //JSON WEB TOKEN(JWT) is used to authorized the user by giving a token. 

// const Mutation={
//     async createUser(parent,args,{db,prisma},info){

//         if(args.data.password.length>8){
//             throw new Error('PassWord must be 8 character long atleast.')
//         }

//         const password=bcrypt.hash(args.data.password,10);
        
//         // const emailTaken=await prisma.exists.user({email:args.data.email})

//         //     if(emailTaken){
//         //     throw new Error('Email taken already.');
//         // }

//         // const emailTaken=db.users.some((user)=>{
//         //  return   user.email===args.data.email
//         // })
//         // if(emailTaken){
//         //     throw new Error('Email taken already.');
//         // }


//         // const user={
//         //     id:uuidv4(),
//         //    ...args.data
//         // }
        
//         // db.users.push(user);
//         // return user

//         const user =prisma.mutation.createUser({data:{
//             ...args.data,
//             password
//         }})

//         return {
//             user,
//             token:jwt.sign({userid:user.id},'thisissecret')
//         }
    
//     },
//     async deleteUser(parent,args,{prisma},info){

//         const user=await prisma.query.user({id:arg.id})

//         if(!user){
//             throw new Error('User dont exists.');
//         }

//         // const userIndex=db.users.findIndex((user)=>{
//         //     return user.id===args.id
//         // })

//         // if(userIndex===-1){
//         //     throw new Error('No user exists.');
//         // }

//         // const deletedUser= db.users.splice(userIndex,1)

//         await prisma.mutation.deleteUser({where:{id:args.id}},info) 

//         // db.posts=db.posts.filter((post)=>{
//         //     const match=post.author===args.id
//         //     console.log('MA'+match);
//         //     if(match){
//         //        db.comments=db.comments.filter((comment)=>{
//         //             return comment.post!==post.id
//         //         })
//         //     }
//         //     return !match
//         // })

//         // db.comments=db.comments.filter((comment)=>{ return comment.author!==args.id})
//         // return deletedUser[0]

//     },
//     async updateUser(parent,args,{prisma},info){

//         const userExist=await prisma.exists.User({id:args.id})

//         if(!userExists){
//             throw new Error('No user Exists');
//         }

//         return prisma.mutation.updateUser({data:args.data,where:{id:args.id}},info)


//     //     const {id,data}=args
        

//     //     const user=db.users.find((user)=> user.id===id)

//     //     if(!user){
//     //         throw new Error('User Not Found.')
//     //     }

        

//     //     if(typeof data.email==='string'){
//     //         const emailTaken=db.users.some((user)=>data.email===user.email)

//     //         if(emailTaken){
//     //             throw new Error('Email is already taken.');
//     //         }
//     //         console.log(data)
//     //         user.email=data.email
//     //     }

//     //     if(typeof data.name==='string'){
//     //         user.name=data.name
//     //     }

//     //     if(typeof data.age!='undefined'){
//     //         user.age=data.age
//     //     }

//     // return user
//     },
//    async logIn(parent,args,{prisma},info){

//     const user=await prisma.query.user({where:{email:args.data.email}});

//     if(!user){
//         throw new Error('Unable to LogIn.')
//     }

//     const isMatch=bcrypt.compare(args.data.password,user.password);

//     if(!isMatch){
//         throw new Error('Unable to logIn.')
//     }
    
//     return {
//         user,
//         token:jwt.sign({userId:user.id},'thisissecret')
//     }
// },
   
//   createPost(parent,args,{prisma,request},info){
// //get the header value,parse out the token,verify

//     const userId=getUserId(request);
//         return prisma.mutation.createPost({data:{
//             title:args.post.title,
//             body:args.post.body,
//             published:args.post.published,
//             author:{
//                 connect:{
//                     id:userId
//                 }
//             }
//         }},info)

//         // const userExists=db.users.some((user)=>{
//         //     return  user.id===args.post.author
//         // })

//         // if(!userExists){
//         //     throw new Error('User don,t found.');
//         // }
//         // const post={
//         //     id:uuidv4(),
//         //    ...args.post
//         // }
//         // db.posts.push(post)

//         // if(args.post.published===true){
//         //     pubsub.publish(`post`,{
//         //         post:{
//         //             mutation:"CREATE",
//         //             data:post
//         //         }
//         //     })
//         // }
//         // return post
//     },
//     deletePost(parent,args,{db,pubsub,prisma},info){

//         return prisma.mutation.deletePost({where:{id:args.id}},info)
//     //     const postIndex=db.posts.findIndex((post)=>{
//     //         return post.id===args.id
//     //     })
//     //     if(postIndex===-1){
//     //         throw new Error('No Post Exists.');
//     //     }

//     //     const [post]=db.posts.splice(postIndex,1)

//     //     db.comments=db.comments.filter((comment)=>comment.post!==args.id)

//     //     if(post.published){
//     //         pubsub.publish('post',{
//     //             post:{
//     //                 mutation:'DELETED',
//     //                 data:post
//     //             }
//     //         })
//     //     }

//     //    return post
//     },

//     updatePost(parent,args,{db,pubsub,prisma},info){

//         return prisma.mutation.updatePost({data:args.data,where:{
//             id:args.id
//         }})

//         // const {id,data}=args;
        
//         // const post=db.posts.find((post)=>post.id===id)
//         // const originalPost={...post}

//         // if(!post){
//         //     throw new Error('No Such Post Exists.');
//         // }

//         // if(typeof data.title=='string'){
//         //     post.title=data.title
//         // }
        
//         // if(typeof data.body=='string'){
//         //     post.body=data.body
//         // }
        
//         // if(typeof data.published==='boolean'){
//         //     post.published=data.published

//         //     let mutation
//         //     let postData=post

//         //     if(originalPost.published && !post.published){
//         //         mutation='DELETED'
//         //         postData=originalPost
//         //     }else if(!originalPost.published && post.published){
//         //         mutation='CREATED'
//         //     }else{
//         //         mutation='UPDATED'
//         //     }
//         //     pubsub.publish('post',{
//         //         post:{
//         //             mutation,
//         //             data:postData
//         //         }
//         //     })
//         // }  else if(post.published){
//         //     pubsub.publish('post',{
//         //         post:{
//         //             mutation:'UPDATED',
//         //             data:post
//         //         }
//         //     })
//         // } 

//         // return post;

//     },
    
//     createComment(parent,args,{db,pubsub,prisma},info){

//         return prisma.mutation.createComment({
//             data:{
//                 text:args.comment.text,
//                 author:{
//                     connect:{
//                         id:args.comment.author
//                     }
//                 },
//                 post:{
//                     connect:{
//                         id:args.comment.post
//                     }
//                 }
//             }
//         },info) 

//         // const userExists=db.users.some((user)=>{
//         //     return user.id===args.comment.author
//         // })
//         // const postExists=db.posts.some((post)=>{
//         //     return (post.id===args.comment.post&&post.published===true)
//         // })

//         // if(!(userExists)||!(postExists)){
//         //     throw new Error("Either post or User is not Valid.");
//         // }
//         //     const comment={
//         //     id:uuidv4(),
//         //   ...args.comment   
//         // }
//         //  db.comments.push(comment)
            
//         //  pubsub.publish(`comment ${args.comment.post}`,{
//         //      comment:{
//         //          mutation:"CREATED",
//         //          data:comment
//         //      }})

//         //  return comment
//     },
    
//     deleteComment(parent,args,{db,pubsubm,prisma},info){

//         return prisma.mutation.deleteComment({where:{
//             id:args.id
//         }},info)

//         // const commentIndex=db.comments.findIndex((comment)=>{
//         //     return comment.id===args.id
//         // })
//         // if(commentIndex==-1){
//         //     throw new Error('No such comment Exists.')
//         // }

//         // const [deletedComment]=db.comments.splice(commentIndex,1)
        
//         // pubsub.publish(`comment ${deletedComment.post}`,{
//         //     comment:{
//         //         mutation:"DELETED",
//         //         data:deletedComment
//         //     }})

//         // return deletedComment
//     },
    
//     updateComment(parent,args,{db,pubsub,prisma},info){

//         return prisma.mutation.updateComment({data:{
//             text:args.data.text
//         },where:{
//             id:args.id
//         }},info)

//         // const {id,data}=args
//         // const comment=db.comments.find((comment)=>comment.id===id)

//         // if(!comment){
//         //     throw new Error('Comment dont exists')
//         // }
//         //  if(typeof data.text==='string'){
//         //     comment.text=data.text}
//         //     pubsub.publish(`comment ${comment.post}`,{
//         //         comment:{
//         //             mutation:"UPDATED",
//         //             data:comment
//         //         }})
         
//         //  return comment
//     }
// }

// export {Mutation as default};