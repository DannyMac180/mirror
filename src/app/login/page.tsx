import { LoginForm } from '@/components/login-form'

export const metadata = {
  title: 'Login | Mirror',
  description: 'Login to your Mirror account',
}

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  )
}
