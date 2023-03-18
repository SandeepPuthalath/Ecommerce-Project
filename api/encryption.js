import { hash, compare } from "bcrypt";


export const encryptPassword = async (user) => {
    if (user) {
        console.log('encrypt')
        user.password = await hash(user.password, 10);
        return user;
    }
}

export const comparePassword = async (password, userPassword) => {
    if (userPassword && password) {
        return compare(password, userPassword);
    }
}