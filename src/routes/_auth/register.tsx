import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { LoginDto, RegisterDto } from '@/types'
import { loadToast } from '@/lib/loadToast'
import { login, register } from '@/api/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppContext } from '@/hooks/useAppContext'

const formSchema = z.object({
  lastName: z.string().min(2, 'Last name is required'),
  firstName: z.string().optional(),
  email: z.email('Invalid email address').min(5, 'Email is required'),
  password: z.string().min(4, 'Password is required'),
})

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setUser } = useAppContext()
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: '',
      firstName: '',
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const val: RegisterDto = {
      ...values,
    }
    console.log(val)
    mutate(val);
  }

  const { mutate } = useMutation({
    mutationFn: (val: RegisterDto) => {
      loadToast('Creating account', '', 0, 'blue')
      return register(val)
    },
    onSuccess: (data) => {
      if (data !== null) {
        toast.dismiss()
        setUser(data.user)
        navigate({ to: '/library' })
      } else {
        loadToast('Warning', 'Wrong credentials', 3000, 'red')
      }
    },
    onError: (error) => {
      loadToast('Warning', 'Email already Exists', 3000, 'red')
      console.error('Error logging in:', error)
    },
  })

  const handlePasswordVisibility = () => {
    setOpen(!open)
  }

  const handleComfirmPasswordVisibility = () => {
    setOpen2(!open2)
  }

  // const handlePasswords = (password: string, confirmPassword: string) => {
  //   if (password !== confirmPassword) {
  //     setSamePasswords(false);
  //     return false
  //   }
  //   setSamePasswords(true);
  //   return true
  // }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="flex flex-col text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Start securing your Android apps today
            </p>
            <p className='text-gray-600'><span className="red-star">*</span> indicates required fields</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <div className="space-y-4">
                {/* Last Name Field */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name <span className="red-star">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rossi"
                          {...field}
                          className="py-5"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> 

                {/* First Name Field */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Francesco"
                          {...field}
                          className="py-5"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />        

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address <span className="red-star">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="py-5"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password <span className="red-star">*</span></FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password <span className="red-star">*</span></FormLabel>
                      <FormControl>
                        <div className="relative flex z-0 items-center">
                          <Input
                            placeholder="Confirm password"
                            {...field}
                            className="py-5 z-0 flex w-full"
                            type={open2 ? "text" : "password"}
                          />
                          <div className="absolute right-3 flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900">
                            {open2 ? (
                              <Eye className="float-right" onClick={handleComfirmPasswordVisibility} />
                            ) : (
                              <EyeOff className="float-right" onClick={handleComfirmPasswordVisibility} />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {/* {!samePasswords && <p className='text-red-500 text-sm'>Enter the same password as above</p> } */}
                      
                    </FormItem>
                  )}
                />

              </div>
            
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
              >
                Create account
              </button>
            </form>
          </Form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
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
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-blue-600 items-center justify-center p-12">
        <div className="max-w-md text-center text-white space-y-6">
          <Shield className="w-24 h-24 mx-auto opacity-90" />
          <h2 className="text-4xl font-bold">Join Cesco Security</h2>
          <p className="text-lg text-purple-100">
            Get started with the most trusted Android application security
            platform. Analyze, manage, and secure your apps in minutes.
          </p>
          <div className="pt-8 grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">68+</div>
              <div className="text-sm text-purple-100">Antivirus Engines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-purple-100">Secure Storage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
