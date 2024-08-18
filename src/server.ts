import fastify from "fastify"
import path from "path"
import fastifyStatic from "@fastify/static"
import { memoriesRoutes } from "./routes/memories"
import { productsRoutes } from "./routes/products"

const app = fastify()

// Configurar o diretório para arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/", // Prefixo removido para acesso direto
})

// Registrar rotas
app.register(memoriesRoutes)
app.register(productsRoutes)

// Rota para servir o arquivo HTML principal
app.get("/", async (request, reply) => {
  return reply.sendFile("index.html") // Envia o arquivo "index.html" do diretório "public"
})

// Iniciar o servidor
app.listen({ port: 3333 }).then(() => {
  console.log("🚀 HTTP server running on http://localhost:3333")
})
