import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function memoriesRoutes(app: FastifyInstance) {
  // Rota para obter todas as memórias
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc", // Ordena as memórias pela data de criação
      },
    })
    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat("..."),
    }))
  })

  // Rota para obter uma memória específica por ID
  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(), // Garante que o ID é uma string no formato UUID
    })
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  // Rota para criar uma nova memória
  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.boolean().default(false), // Corrigido para z.boolean() em vez de z.coerce.boolean()
      userId: z.string().uuid(), // Adiciona userId como obrigatório
    })
    const { content, coverUrl, isPublic, userId } = bodySchema.parse(
      request.body
    )

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        user: { connect: { id: userId } }, // Relaciona com o usuário
      },
    })

    return memory
  })

  // Rota para atualizar uma memória existente
  app.put("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(), // Garante que o ID é uma string no formato UUID
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.boolean().default(false),
    })
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  // Rota para deletar uma memória existente
  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(), // Garante que o ID é uma string no formato UUID
    })
    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    return { message: "Memory deleted successfully" }
  })
}
