import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { LoginDto } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { loadToast } from '@/lib/loadToast'
import { login } from '@/api/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const formSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(4, 'Password is required'),
})

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const val: LoginDto = {
      ...values,
    }
    console.log(val)
    mutate(val);
    // if (compareValues(val, missionData)) mutate(val);
  }

  const { mutate } = useMutation({
    mutationFn: (val: LoginDto) => {
      loadToast('Logging in', '', 0, 'blue')
      return login(val)
    },
    onSuccess: (data) => {
      if (data !== null) {
        redirect({ to: '/library' })
      } else loadToast('Warning', 'Wrong credentials', 3000, 'red')
    },
    onError: (error) => {
      loadToast('Warning', 'Wrong credentials', 3000, 'red')
      console.error('Error logging in:', error)
    },
  })

  const handlePasswordVisibility = () => {
    setOpen(!open)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              {/* Error Message (hidden by default) */}
              <div className="hidden flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">Error message here</p>
              </div>

              <div className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          {...field}
                          className="py-5"
                          type="email"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative flex z-0 items-center">
                          <Input
                            placeholder="Password"
                            {...field}
                            className="py-5 z-0 flex w-full"
                            type={open ? "text" : "password"}
                          />
                          <div className="absolute right-3 flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900">
                            {open ? (
                              <Eye className="float-right" onClick={handlePasswordVisibility} />
                            ) : (
                              <EyeOff className="float-right" onClick={handlePasswordVisibility} />
                            )}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
              >
                Sign in
              </button>
            </form>
          </Form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create an account
            </Link>
          </p>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Gradient */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-12">
        <div className="max-w-md text-center text-white space-y-6">
          <Shield className="w-24 h-24 mx-auto opacity-90" />
          <h2 className="text-4xl font-bold">Secure Your Apps</h2>
          <p className="text-lg text-blue-100">
            Join thousands of developers using Cesco Security to protect their
            Android applications with real-time malware detection.
          </p>
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-blue-100">68+ Antivirus Engines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-blue-100">Real-time Malware Detection</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-blue-100">Secure Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
