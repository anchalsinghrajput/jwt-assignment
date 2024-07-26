import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ProtectedPage = () => {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('jwt-token')

      if (!token) {
        router.push('/generate-token')
        return
      }

      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Unauthorized or token expired')
        }

        const data = await response.json()
        setData(data.message)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      }
    }

    fetchProtectedData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('jwt-token')
    router.push('/generate-token')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      {data && <p>{data}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default ProtectedPage
