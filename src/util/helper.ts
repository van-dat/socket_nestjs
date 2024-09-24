
const bcrypt = require('bcrypt');
const saltRounds = 10 


export const hassPasswordHelper  = async(password:string) => { 
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
       return await bcrypt.hashSync(password, salt);
    } catch (error) {
        console.log(error)
    }
 }
