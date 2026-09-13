import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { signupSchema, type SignupFormData } from '@/schemas/auth'
import { saveUser, getUser } from '@/utils/auth'
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

export const SignupForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = (data: SignupFormData) => {
    const existingUser = getUser(data.email)
    if (existingUser) {
      setError('email', { message: 'Email already exists' })
      return
    }
    saveUser(data)
    navigate('/auth/login')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" type="text" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/auth/login')}
            >
              Sign In
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
