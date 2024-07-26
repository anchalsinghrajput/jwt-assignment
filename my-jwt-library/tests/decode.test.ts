import { encode_jwt } from '../src/encode'
import { decode_jwt, validate_jwt } from '../src/decode'

describe('decode_jwt', () => {
  const secret = 'my-secret'
  const id = '123'
  const ttl = 3600 // 1 hour

  // Define global payloads
  const payloadWithNameAge = { name: 'anchal', age: 22 }
  const payloadWithSpecialChars = { special: '!@#$%^&*()_+[]{}|;:,.<>?/~`' }

  let token: string

  beforeAll(() => {
    token = encode_jwt(secret, id, payloadWithNameAge, ttl)
  })

  test('should decode a valid JWT token with name and age', () => {
    const decoded = decode_jwt(secret, token)

    expect(decoded.id).toBe(id)
    expect(decoded.payload).toEqual(expect.objectContaining(payloadWithNameAge)) // Use objectContaining to ignore 'iat'
    expect(decoded.expires_at).toBeInstanceOf(Date)
  })

  test('should decode a payload with special characters', () => {
    const specialCharsToken = encode_jwt(
      secret,
      id,
      payloadWithSpecialChars,
      ttl,
    )
    const decoded = decode_jwt(secret, specialCharsToken)

    expect(decoded.id).toBe(id)
    expect(decoded.payload.special).toBe(payloadWithSpecialChars.special)
    expect(decoded.expires_at).toBeInstanceOf(Date)
  })

  test('should throw error for invalid signature', () => {
    const invalidToken = `${token.slice(0, -1)}x` // Modify token to create invalid signature

    expect(() => decode_jwt(secret, invalidToken)).toThrow(
      'Invalid JWT signature',
    )
  })

  test('should throw error for expired token', () => {
    const expiredToken = encode_jwt(secret, id, payloadWithNameAge, -3600) // Token expired an hour ago

    expect(() => decode_jwt(secret, expiredToken)).toThrow('JWT has expired')
  })

  test('should validate a valid JWT token', () => {
    expect(validate_jwt(secret, token)).toBe(true)
  })

  test('should invalidate an invalid JWT token', () => {
    const invalidToken = `${token.slice(0, -1)}x`

    expect(validate_jwt(secret, invalidToken)).toBe(false)
  })
})
