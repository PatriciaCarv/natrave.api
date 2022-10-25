import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient ()


/*export const create = async ctx => {
    const password = await bcrypt.hash(ctx.request.body.password, 10)
    const data = {
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password: password,
    }

    try{
        const  user = await prisma.user.create({ data })
        const { password, ...result } = user

        const accessToken = jwt.sign({
            sub: user.id,
            name: user.name
        }, process.env.JWT_SECRET)
        ctx.body = {
            user: result,
            accessToken
        }
        ctx.status = 201
    } catch( error) {
        console.log(error)
        ctx.body = error
        ctx.status = 500
    }
}

const atob = function(b64Encoded) {return Buffer.from(b64Encoded, 'base64').toString('utf8');}

export const login = async ctx => {
    const [type, token] = ctx.headers.authorization.split(" ")
    
    const [ email, plainTextPassword ] = atob(token).split(":")
    
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        ctx.status = 404
        return
    }

    const passwordMatch = await bcrypt.compare(plainTextPassword, user.password)

    if (!passwordMatch) {
        ctx.status = 404
        return
    }

    const { password, ...result } = user

    const accessToken = jwt.sign({
        sub: user.id,
        name: user.name
    }, process.env.JWT_SECRET)
    ctx.body = {
        user: result,
        accessToken
    }
}*/

export const list = async (ctx) => {
    try{
        const users = await prisma.user.findMany();
        ctx.status = 200
        ctx.body = users
        console.log(users)
        console.log('deu certo')
    } catch( error) {
        console.log('deu erro')
        console.log(error)
        ctx.status = 500
        ctx.body = error
    }
}