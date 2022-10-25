import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient();

export const create = async (ctx) => {
    if (!ctx.headers.authorization) {
        ctx.status = 400
        return
    }

    const [type, token] = ctx.headers.authorization.split(" ")
    
    try{
        const data = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!ctx.request.body.homeTeamScore && !ctx.request.body.awayTeamScore) {
            ctx.status = 400
            return
        }

        const userId = data.sub
        const { gameId } = ctx.request.body
        const homeTeamScore = parseInt(ctx.request.body.homeTeamScore)
        const awayTeamScore = parseInt(ctx.request.body.awayTeamScore)

        
            const [hunch] = await prisma.hunch.findMany({
                where: { userId, gameId }
            })

            if (hunch) {
                console.log('update')
                const res = await prisma.hunch.update({
                    where: { id: hunch.id },
                    data: {
                        homeTeamScore,
                        awayTeamScore
                    }
                })
                ctx.status = 201
                ctx.body = res
            } else {
                console.log('create')
                const res = await prisma.hunch.create({
                    data: {
                        userId,
                        gameId,
                        homeTeamScore,
                        awayTeamScore
                    }
                })
                ctx.status = 201
                ctx.body = res
            }        
    } catch(error) {
        console.log(error)
        ctx.body = error
        ctx.status = 500
    }
}

export const listAll = async (ctx) => {
    try{
        const hunches = await prisma.hunch.findMany();
        ctx.body = hunches
        ctx.status = 200
    } catch( error) {
        ctx.body = error
        ctx.status = 500
    }
}

export const list = async (ctx) => {
    try{
        const username = ctx.request.params.username
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            ctx.status = 404
            return
        }

        const hunches = await prisma.hunch.findMany({
            where: {
                userId: user.id
            }
        });
        ctx.body = hunches
        ctx.status = 200
    } catch( error) {
        ctx.body = error
        ctx.status = 500
    }
}