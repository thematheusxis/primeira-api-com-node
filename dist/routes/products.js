"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = productsRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function productsRoutes(app) {
    //verifica se o usuário é administrador
    async function checkAdmin(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.isAdmin) {
            throw new Error("Unauthorized: You do not have the required permissions.");
        }
    }
    // Rota para obter todos os produtos (acessível para qualquer usuário)
    app.get("/products", async () => {
        const products = await prisma_1.prisma.product.findMany({
            orderBy: {
                registerNewProduct: "asc", // Ordena os produtos pela data de registro
            },
        });
        return products.map((product) => ({
            productId: product.productId,
            nameProduct: product.nameProduct,
            descriptionProduct: product.descriptionProduct,
            registerNewProduct: product.registerNewProduct,
        }));
    });
    // Rota para obter um produto específico por ID (acessível para qualquer usuário)
    app.get("/products/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        const product = await prisma_1.prisma.product.findUniqueOrThrow({
            where: {
                productId: id,
            },
        });
        return product;
    });
    // Rota para criar um novo produto (acessível apenas para administradores)
    app.post("/products", async (request) => {
        const bodySchema = zod_1.z.object({
            nameProduct: zod_1.z.string(),
            descriptionProduct: zod_1.z.string(),
            userId: zod_1.z.string().uuid(), // Adiciona o userId como campo obrigatório
        });
        const { nameProduct, descriptionProduct, userId } = bodySchema.parse(request.body);
        await checkAdmin(userId); // Verifica se o usuário é administrador
        const product = await prisma_1.prisma.product.create({
            data: {
                nameProduct,
                descriptionProduct,
                registerNewProduct: new Date(), // Define a data de registro como a data atual
                user: { connect: { id: userId } }, // Conecta o produto ao usuário
            },
        });
        return product;
    });
    // Rota para atualizar um produto existente (acessível apenas para administradores)
    app.put("/products/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            nameProduct: zod_1.z.string(),
            descriptionProduct: zod_1.z.string(),
            userId: zod_1.z.string().uuid(), // Adiciona o userId como campo obrigatório
        });
        const { nameProduct, descriptionProduct, userId } = bodySchema.parse(request.body);
        await checkAdmin(userId); // Verifica se o usuário é administrador
        const product = await prisma_1.prisma.product.update({
            where: {
                productId: id,
            },
            data: {
                nameProduct,
                descriptionProduct,
            },
        });
        return product;
    });
    // Rota para deletar um produto existente (acessível apenas para administradores)
    app.delete("/products/:id", async (request) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(), // Garante que o ID é uma string no formato UUID
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            userId: zod_1.z.string().uuid(), // Adiciona o userId como campo obrigatório
        });
        const { userId } = bodySchema.parse(request.body);
        await checkAdmin(userId); // Verifica se o usuário é administrador
        await prisma_1.prisma.product.delete({
            where: {
                productId: id,
            },
        });
        return { message: "Product deleted successfully" };
    });
}
