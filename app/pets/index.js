// import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient ()

export const create = async ctx => {
    /*if (!ctx.headers.authorization) {
        ctx.status = 401
        return 
    }
    const [type, token] = ctx.headers.authorization.split(" ")
    console.log({ type, token })
    */
    try {
    //const data = jwt.verify(token, process.env.JWT_SECRET)
        console.log(ctx.request.body)
        if(!ctx.request.body.name && !ctx.request.body.idade) {
            ctx.status = 400
            return
        }

        const idade = parseInt (ctx.request.body.idade)

        try {
            let pet = null;
            if (ctx.request.body.id) {
                [pet] = await prisma.pet.findMany ({
                    where: { id: ctx.request.body.id }
                })
            }


            console.log(pet)

            ctx.body = pet
                ? await prisma.pet.update({
                    where: {
                        id: pet.id
                    },
                    data: {
                        name: ctx.request.body.name,
                        idade: idade
                    }
                })
                : await prisma.pet.create({
                    data: {
                        name: ctx.request.body.name,
                        idade: idade
                    }
                })
        } catch (error) {
            console.log(error)
            ctx.body = error
            ctx.status = 500
        }
    } catch (error) {
        ctx.status = 401
        return
    }
}

export const list = async ctx => {
    try {
        const pets = await prisma.pet.findMany()
        ctx.body = pets
        ctx.status = 200
    } catch(error) {
        console.log (error)
        ctx.body = error
        ctx.status = 500
    }
}

