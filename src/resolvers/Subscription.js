const Subscription={
    comment:{
        subscribe(parent,{postId},{db,pubsub},info){
            const post=db.posts.find((post)=>postId===post.id&&post.published)
            if(!post){
                throw new Error('Post not Found');
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post:{
        subscribe(parent,args,{db,pubsub},info){
            return pubsub.asyncIterator(`post`)
        }
    }
}

export {Subscription as default};