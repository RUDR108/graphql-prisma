import { Prisma } from 'prisma-binding'
import {fragmentReplacements} from './resolvers/index';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466',
    secret:'thisismysupersecret',
    fragmentReplacements
})


export { prisma as default }



// import {Prisma} from 'prisma-binding';

// const prisma = new Prisma({
//     typeDefs:'src/generated/prisma.graphql',
//     endpoint:'http://192.168.99.100:4466',
//     secret:'somethingsecret'
// })

// export {prisma as default};

//    prisma.query.users(null,'{id name email post {id title}}').then((data)=>{
//    console.log(JSON.stringify(data,undefined,2))
//    }).catch((e)=>{
//    })

//    prisma.query.comments(null,'{ id text post { title } author { name }}').then((data)=>{
//     console.log(JSON.stringify(data,undefined,2))
//    }).catch((e)=>{
//        console.log('error',e)
//    })

// prisma.mutation.createPost({
//     data:{
//       title:"Post Another",
//       body:"Posting is always a soltion.",
//       published:true,
//       author:{
//           connect:{
//             id:"cjndeczyb001t0836iw4yobdq"
//           }
//       }
//     }
// },'{id title author{ name }}').then((data)=>{
//     console.log(data)
//     return prisma.query.users(null,'{id name email post {id title}}');
// }).then((data)=>{
//     console.log(JSON.stringify(data,undefined,2))
// })

// prisma.mutation.updatePost({
//     data:{
//         title:"title 3",
//         body:"body 3",
//         published:true,
//      },
//      where:{
//          id:"cjne7fgcb000w0836es1eqgjd"
//      }
// },'{id}').then((data)=>{
//     return prisma.query.posts(null,'{id title published author {id name}}');
// }).then((data)=>{
//     console.log(data);
// }).catch((e)=>{
//     console.log('error',e)
// })

// const createPostForUser=async (authorId,data)=>{
//     const userExists=await prisma.exists.User({id:authorId})

//     if(!userExists){
//         throw new Error('User do not  exists.')
//     }

//     const post=await prisma.mutation.createPost({
//         data:{
//             ...data,
//             author:{
//                 connect:{
//                     id:authorId
//                 }
//             }
//         }
//         },'{author{ id name email post{ id title published }}}')

//     // const user=await prisma.query.user({
//     //     where:{
//     //         id:"cjne94cwq00260836wfdhbvsl"
//     //     }
//     // },'{id name email post {id title}}')
    
//     return post.author;
// };

// createPostForUser('cjndeczyb001t0836iw4yobdq',{
//     title:"title is this",
//     body:"body is here",
//     published:true,
// }).then((data)=>{
//     console.log(JSON.stringify(data,undefined,2))
// }).catch((e)=>{
//     console.log('Error',e.message)
// }) 

// const updatePostForUser=async (postId,data)=>{
// const postExists=await prisma.exists.Post({id:postId})

//     if(!postExists){
//         throw new Error('Post is not found.')
//     }

//     const post= await prisma.mutation.updatePost({
//         data:{
//             ...data,
//         },
//         where:{
//             id:postId
//         }
//     },'{author {id name email post{ id title published }}}')

    

//     return post.author;
// }

// updatePostForUser("cjneqwlhd004z0836istv2hwt",{
//     title:"title34",
//     body:"some body is here",
//     published:true
// }).then((data)=>{
//     console.log(JSON.stringify(data,undefined,2));
// }).catch((e)=>{
//     console.log(e.message)
// })

