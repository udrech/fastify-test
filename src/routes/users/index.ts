import { FastifyPluginAsync } from 'fastify'
import { readFile } from 'fs/promises'
import { join } from 'path'

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    try {
      const filePath = join(__dirname, 'users.json')
      const data = await readFile(filePath, 'utf-8')
      const obj = JSON.parse(data)
      return obj.users
    } catch (error) {
      reply.status(500).send({ error: 'Failed to load users' })
    }
  })

  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params as { id: string }
    const userId = parseInt(id, 10)
    try {
      const filePath = join(__dirname, 'users.json')
      const data = await readFile(filePath, 'utf-8')
      const obj = JSON.parse(data);
      const user = obj.users.find((user: { id: number }) => user.id === userId)
      if (!user) {
        return reply.status(404).send({ error: 'User not found' })
      }
      return user
    } catch (error) {
      reply.status(500).send({ error: 'Failed to load user' })
    }
  })
}

export default users
