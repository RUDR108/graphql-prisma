import bcrypt from 'bcryptjs';

const hashPassword=(password)=>{
    if(password.length<8){
        throw new Error('Password should be  8 character long.');
    }

    return bcrypt.hash(password,10)
}

export {hashPassword as default};