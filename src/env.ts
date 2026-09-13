import { z } from 'zod'

const envSchema = z.object({
  VITE_TMDB_API_KEY: z.string().min(1, 'VITE_TMDB_API_KEY is required'),
})

function validateEnv() {
  const parsed = envSchema.safeParse(import.meta.env)

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

export const env = import.meta.env.MODE === 'test'
  ? (import.meta.env as unknown as z.infer<typeof envSchema>)
  : validateEnv()
