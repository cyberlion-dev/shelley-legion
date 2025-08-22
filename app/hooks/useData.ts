'use client'

import { useEffect, useRef, useState } from 'react'

export function useData<T>(filename: string, initialData: T) {
  const initialRef = useRef(initialData)
  const [data, setData] = useState<T>(initialRef.current)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/data/${filename}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load ${filename}`)
        const json = await res.json()
        if (active) {
          setData(json)
        }
      } catch (err) {
        if (active) {
          setError(err as Error)
          setData(initialRef.current)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [filename])

  return { data, isLoading, error }
}
