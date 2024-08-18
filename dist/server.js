"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const static_1 = __importDefault(require("@fastify/static"));
const memories_1 = require("./routes/memories");
const products_1 = require("./routes/products");
const app = (0, fastify_1.default)();
// Configurar o diretório para arquivos estáticos
app.register(static_1.default, {
    root: path_1.default.join(__dirname, "..", "public"),
    prefix: "/", // Prefixo removido para acesso direto
});
// Registrar rotas
app.register(memories_1.memoriesRoutes);
app.register(products_1.productsRoutes);
// Rota para servir o arquivo HTML principal
app.get("/", async (request, reply) => {
    return reply.sendFile("index.html"); // Envia o arquivo "index.html" do diretório "public"
});
// Iniciar o servidor
app.listen({ port: 3333 }).then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
});
