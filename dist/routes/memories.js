"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoriesRoutes = memoriesRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function memoriesRoutes(app) {
    // Rota para obter todas as memórias
    app.get("/memories", async () => {
        const memories = await prisma_1.prisma.memory.findMany({
            orderBy: {
                createdAt: "asc", // Ordena as memórias pela data de criação
            },
        });
        return memories.map((memory) => ({
            id: memory.id,
            coverUrl: memory.coverUrl,
            excerpt: memory.content.substring(0, 115).concat("..."),
        }));
    });
    // Rota para obter uma memória específica por ID
    app.get("/memories/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        const memory = await prisma_1.prisma.memory.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return memory;
    });
    // Rota para criar uma nova memória
    app.post("/memories", async (request) => {
        const bodySchema = zod_1.z.object({
            content: zod_1.z.string(),
            coverUrl: zod_1.z.string(),
            isPublic: zod_1.z.boolean().default(false), // Corrigido para z.boolean() em vez de z.coerce.boolean()
            userId: zod_1.z.string().uuid(), // Adiciona userId como obrigatório
        });
        const { content, coverUrl, isPublic, userId } = bodySchema.parse(request.body);
        const memory = await prisma_1.prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                user: { connect: { id: userId } }, // Relaciona com o usuário
            },
        });
        return memory;
    });
    // Rota para atualizar uma memória existente
    app.put("/memories/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            content: zod_1.z.string(),
            coverUrl: zod_1.z.string(),
            isPublic: zod_1.z.boolean().default(false),
        });
        const { content, coverUrl, isPublic } = bodySchema.parse(request.body);
        const memory = await prisma_1.prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                isPublic,
            },
        });
        return memory;
    });
    // Rota para deletar uma memória existente
    app.delete("/memories/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.memory.delete({
            where: {
                id,
            },
        });
        return { message: "Memory deleted successfully" };
    });
}
