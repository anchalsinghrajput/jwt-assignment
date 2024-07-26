// pages/api/users.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { decode_jwt, validate_jwt } from 'my-jwt-library'

const secret = 'thisIsMyToken'

function isAuthenticated(req: NextApiRequest): boolean {
  // Access the 'authorization' header
  const authHeader = (req.headers['authorization'] as string) || ''
  console.log('Authorization Header:', authHeader) // Log header to debug

  // Extract the token from the 'Authorization' header
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7) // Get the part after 'Bearer '
    : authHeader.split(' ')[1] // Fallback for cases where 'Bearer ' is not present

  console.log('Token provided:', token) // Log token to debug

  if (!token) {
    console.log('No token provided')
    return false
  }

  if (!validate_jwt(secret, token)) {
    console.log('Token validation failed')
    return false
  }

  try {
    const decoded = decode_jwt(secret, token)
    console.log('Decoded JWT:', decoded)
    return true
  } catch (error) {
    console.log('Error decoding JWT:', error)
    return false
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    res
      .status(200)
      .json({ message: 'This is a demo project for testing my-jwt-library' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
