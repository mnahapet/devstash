'use client'

import { useState } from 'react'

export function useForm(onSubmit: (setError: (msg: string) => void) => Promise<void>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(setError)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, handleSubmit }
}
