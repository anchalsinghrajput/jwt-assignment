import { encode_jwt } from '../src/encode'
import { decode_jwt } from '../src/decode'

describe('encode_jwt', () => {
  const secret = 'my-secret'
  const id = '123'
  const ttl = 3600 // 1 hour

  const payloadWithNameAge = { name: 'anchal', age: 22 }
  const payloadWithSpecialChars = { special: '!@#$%^&*()_+[]{}|;:,.<>?/~`' }

  test('should create a valid JWT token for a payload with name and age', () => {
    const token = encode_jwt(secret, id, payloadWithNameAge, ttl)
    const decoded = decode_jwt(secret, token)

    expect(decoded.id).toBe(id)
    expect(decoded.payload).toEqual(expect.objectContaining(payloadWithNameAge))
    expect(decoded.expires_at).toBeInstanceOf(Date)
  })

  test('should create a valid JWT token for a payload with special characters', () => {
    const token = encode_jwt(secret, id, payloadWithSpecialChars, ttl)
    const decoded = decode_jwt(secret, token)

    expect(decoded.id).toBe(id)
    expect(decoded.payload.special).toBe(payloadWithSpecialChars.special)
    expect(decoded.expires_at).toBeInstanceOf(Date)
  })

  test('should include the id and exp in the payload', () => {
    const payload = { foo: 'bar' }
    const token = encode_jwt(secret, id, payload, ttl)
    const [, bodyEncoded] = token.split('.')
    const body = JSON.parse(Buffer.from(bodyEncoded, 'base64').toString('utf8'))

    expect(body.id).toBe(id)
    expect(body.exp).toBeGreaterThan(Date.now() / 1000)
  })
})
