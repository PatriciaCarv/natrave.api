import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient ()


export const create = async ctx => {
    const password = await bcrypt.hash(ctx.request.body.password, 10)
    const data = {
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password,
    }
    
    try {
        const { password, ...user} = await prisma.user.create({ data })

        const accessToken = jwt.sign({
            sub: user.id,
            name: user.name,
            expiresIn: "7d"
        }, process.env.JWT_SECRET)
    
        ctx.body = {
            user: user,
            accessToken
        }

        ctx.status = 201
    } catch(error) {
        console.log (error)
        ctx.body = error
        ctx.status = 500
    }
}

export const login = async ctx => {
    const [type, token] = ctx.headers.authorization.split(" ")
    const [email, plainTextpassword] = atob(token).split(":")

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        ctx.status = 404
        return
    }

    const passwordMatch = await bcrypt.compare(plainTextpassword, user.password)

    if (!passwordMatch) {
        ctx.status = 404
        return
    }

    const {password, ...result } = user

    const accessToken = jwt.sign({
        sub: user.id,
        name: user.name,
        expiresIn: "7d"
    }, process.env.JWT_SECRET)

    ctx.status = 201
    ctx.body = {
        user: result,
        accessToken
    }
}

export const list = async (ctx) => {
    try{
        const users = await prisma.user.findMany();
        ctx.body = users
        ctx.status = 200
    } catch( error) {
        ctx.body = error
        ctx.status = 500
    }
}