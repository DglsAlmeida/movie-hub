import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '@/schemas/auth'
import { getUser, saveSession } from '@/utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const LoginForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    const user = getUser(data.email)
    if (!user || user.password !== data.password) {
      setError('root', { message: 'Invalid email or password' })
      return
    }
    saveSession({ name: user.name, email: user.email })
    navigate('/auth/dashboard')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/auth/signup')}
            >
              Sign Up
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
