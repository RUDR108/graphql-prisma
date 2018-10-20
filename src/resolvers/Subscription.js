const Subscription={

    // prisma --> Node --> client

    comment:{
        subscribe(parent,{postId},{db,pubsub,prisma},info){
        return prisma.subscription.comment({
            where:{
                node:{
                    post:{
                    id:postId
                   } 
                  }
            }
        },info)
    }
    },
    post:{
        subscribe(parent,args,{db,pubsub,prisma},info){
            return prisma.subscription.post({
                where:{
                    node:{
                        published:true
                    }
                }
            },info)
            // return pubsub.asyncIterator(`post`)
        }
    }
}

export {Subscription as default};