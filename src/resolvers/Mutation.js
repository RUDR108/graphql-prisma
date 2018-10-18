import uuidv4 from 'uuid/v4';

const Mutation={
    createUser(parent,args,{db},info){
        const emailTaken=db.users.some((user)=>{
         return   user.email===args.data.email
        })
        if(emailTaken){
            throw new Error('Email taken already.');
        }


        const user={
            id:uuidv4(),
           ...args.data
        }
        
        db.users.push(user);
        return user
    
    },
    deleteUser(parent,args,{db},info){
        const userIndex=db.users.findIndex((user)=>{
            return user.id===args.id
        })

        if(userIndex===-1){
            throw new Error('No user exists.');
        }

        const deletedUser= db.users.splice(userIndex,1)

        db.posts=db.posts.filter((post)=>{
            const match=post.author===args.id
            console.log('MA'+match);
            if(match){
                db.comments=db.comments.filter((comment)=>{
                    return comment.post!==post.id
                })
            }
            return !match
        })

        db.comments=db.comments.filter((comment)=>{ return comment.author!==args.id})
        return deletedUser[0]

    },
    updateUser(parent,args,{db},info){
        const {id,data}=args
        

        const user=db.users.find((user)=> user.id===id)

        if(!user){
            throw new Error('User Not Found.')
        }

        

        if(typeof data.email==='string'){
            const emailTaken=db.users.some((user)=>data.email===user.email)

            if(emailTaken){
                throw new Error('Email is already taken.');
            }
            console.log(data)
            user.email=data.email
        }

        if(typeof data.name==='string'){
            user.name=data.name
        }

        if(typeof data.age!='undefined'){
            user.age=data.age
        }

       
    
    return user
    },
   
    createPost(parent,args,{db,pubsub},info){
        const userExists=db.users.some((user)=>{
            return  user.id===args.post.author
        })

        if(!userExists){
            throw new Error('User don,t found.');
        }
        const post={
            id:uuidv4(),
           ...args.post
        }
        db.posts.push(post)

        if(args.post.published===true){
            pubsub.publish(`post`,{
                post:{
                    mutation:"CREATE",
                    data:post
                }
            })
        }
        return post
    },
    deletePost(parent,args,{db,pubsub},info){
        const postIndex=db.posts.findIndex((post)=>{
            return post.id===args.id
        })
        if(postIndex===-1){
            throw new Error('No Post Exists.');
        }

        const [post]=db.posts.splice(postIndex,1)

        db.comments=db.comments.filter((comment)=>comment.post!==args.id)

        if(post.published){
            pubsub.publish('post',{
                post:{
                    mutation:'DELETED',
                    data:post
                }
            })
        }

       return post
    },

    updatePost(parent,args,{db,pubsub},info){
        const {id,data}=args;
        
        const post=db.posts.find((post)=>post.id===id)
        const originalPost={...post}

        if(!post){
            throw new Error('No Such Post Exists.');
        }

        if(typeof data.title=='string'){
            post.title=data.title
        }
        
        if(typeof data.body=='string'){
            post.body=data.body
        }
        
        if(typeof data.published==='boolean'){
            post.published=data.published

            let mutation
            let postData=post

            if(originalPost.published && !post.published){
                mutation='DELETED'
                postData=originalPost
            }else if(!originalPost.published && post.published){
                mutation='CREATED'
            }else{
                mutation='UPDATED'
            }
            pubsub.publish('post',{
                post:{
                    mutation,
                    data:postData
                }
            })
        }  else if(post.published){
            pubsub.publish('post',{
                post:{
                    mutation:'UPDATED',
                    data:post
                }
            })
        } 

        return post;

    },
    
    createComment(parent,args,{db,pubsub},info){
        const userExists=db.users.some((user)=>{
            return user.id===args.comment.author
        })
        const postExists=db.posts.some((post)=>{
            return (post.id===args.comment.post&&post.published===true)
        })

        if(!(userExists)||!(postExists)){
            throw new Error("Either post or User is not Valid.");
        }
            const comment={
            id:uuidv4(),
          ...args.comment   
        }
         db.comments.push(comment)
            
         pubsub.publish(`comment ${args.comment.post}`,{
             comment:{
                 mutation:"CREATED",
                 data:comment
             }})

         return comment
    },
    
    deleteComment(parent,args,{db,pubsub},info){
        const commentIndex=db.comments.findIndex((comment)=>{
            return comment.id===args.id
        })
        if(commentIndex==-1){
            throw new Error('No such comment Exists.')
        }

        const [deletedComment]=db.comments.splice(commentIndex,1)
        
        pubsub.publish(`comment ${deletedComment.post}`,{
            comment:{
                mutation:"DELETED",
                data:deletedComment
            }})

        return deletedComment
    },
    
    updateComment(parent,args,{db,pubsub},info){
        const {id,data}=args
        const comment=db.comments.find((comment)=>comment.id===id)

        if(!comment){
            throw new Error('Comment dont exists')
        }
         if(typeof data.text==='string'){
            comment.text=data.text}
            pubsub.publish(`comment ${comment.post}`,{
                comment:{
                    mutation:"UPDATED",
                    data:comment
                }})
         
         return comment
    }
}

export {Mutation as default};