import { PrismaClient } from "@prisma/client"
import { addDays, formatISO } from 'date-fns'
const prisma = new PrismaClient();

export const create = async (ctx) => {
    
    const { id = 0 , homeTeam, awayTeam, gameTime } = ctx.request.body

    try{
        const [game] = await prisma.game.findMany({
            where: { id }
        })

        const data = {
            homeTeam,
            awayTeam,
            gameTime
        }

        if (game) {
            ctx.body = await prisma.game.update({
                where: { id: game.id },
                data
            })
        } else {
            ctx.body = await prisma.game.create({
                data
            })
        }
    } catch( error) {
        ctx.body = error
        ctx.status = 500
    }
}

export const list = async (ctx) => {
    let currentDate = null
    if (ctx.request.query?.gameTime) {
        currentDate = new Date(ctx.request.query.gameTime)
    }

    const where = currentDate ? {
        gameTime: {
            gte: formatISO(currentDate),
            lt: formatISO(addDays(currentDate, 1))
        }
    } : {}

    try{
        const games = await prisma.game.findMany({
            where
        });
        ctx.body = games
        ctx.status = 200
    } catch( error) {
        ctx.body = error
        ctx.status = 500
    }
}