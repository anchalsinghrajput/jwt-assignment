import { useState } from 'react'
import { useRouter } from 'next/router'

const GenerateTokenPage = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleGenerateToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate token')
      }

      const data = await response.json()
      setToken(data.token)
      setError('')

      localStorage.setItem('jwt-token', data.token)
      router.push('/protected')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      setToken('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate JWT Token</h1>
      <form onSubmit={handleGenerateToken} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            style={{ color: 'black' }}
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium">
            Age
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            style={{ color: 'black' }}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Generate Token
        </button>
      </form>
      {token && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Generated Token:</h2>
          <pre
            className="bg-gray-100 p-4 rounded-md"
            style={{ color: 'black' }}
          >
            {token}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  )
}

export default GenerateTokenPage
