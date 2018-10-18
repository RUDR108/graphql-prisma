const Query={
    users(parent,args,{db},info){
        if(!args.query){
           return db.users
        }
       return db.users.filter((user)=>{
           return user.name.toLowerCase().includes(args.query.toLowerCase());
       });
    },
    posts(parent,args,{db},info){
        if(!args.query){
            return db.posts;
        }
        return db.posts.filter((post)=>{
           const titleMatch=post.title.toLowerCase().includes(args.query.toLowerCase());
           const bodyMatch=post.body.toLowerCase().includes(args.query.toLowerCase());
           return titleMatch || bodyMatch;
       })
      },
    comments(parent,args,{db},info){
        return db.comments
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