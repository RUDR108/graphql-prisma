const Query={
    users(parent,args,{prisma},info){
       
        const opArgs={}

        if(args.query){
            opArgs.where={
                OR:[
                    {
                        name_contains:args.query
                    },{
                        email_contains:args.query
                    }
                ]
            }
        }
            return prisma.query.users(opArgs,info)

        

    //     if(!args.query){
    //        return db.users
    //     }
    //    return db.users.filter((user)=>{
    //        return user.name.toLowerCase().includes(args.query.toLowerCase());
    //    });
    },
    posts(parent,args,{db,prisma},info){

        const opArgs={};

        if(args.query){
            opArgs.where={
              OR:[
                  {title_contains:args.query},
                  {body_contains:args.query}
              ]  
            }
        }
        

    //     if(!args.query){
    //         return db.posts;
    //     }
    //     return db.posts.filter((post)=>{
    //        const titleMatch=post.title.toLowerCase().includes(args.query.toLowerCase());
    //        const bodyMatch=post.body.toLowerCase().includes(args.query.toLowerCase());
    //        return titleMatch || bodyMatch;
    //    })

        return prisma.query.posts(opArgs,info)
    
    },

    comments(parent,args,{db,prisma},info){

    return prisma.query.comments(null,info)
   
    },
   
   me(){
       return{
           id:'1236',
           name:'mike',
           email:'email',
           age:123
       }
   }
}

export{Query as default};