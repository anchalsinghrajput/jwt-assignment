import type { NextApiRequest, NextApiResponse } from 'next'
import { encode_jwt } from 'my-jwt-library'

const secret = 'thisIsMyToken'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, age } = req.body

    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' })
    }

    const id = '12345'
    const payload = { name, age: parseInt(age) }
    const ttl = 3600

    try {
      const token = encode_jwt(secret, id, payload, ttl)
      return res.status(200).json({ token })
    } catch (error) {
      return res.status(500).json({ error: 'Error generating token' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
