import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Stethoscope, ArrowRight, HeartPulse, Activity, ShieldCheck, Clock } from 'lucide-react'

const LoginRegister = () => {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, register: registerUser, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === 'doctor' || user.role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/user'
      navigate(path)
    }
  }, [isAuthenticated, user, navigate])

  const switchMode = (newMode) => {
    setMode(newMode)
    reset()
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    if (mode === 'login') {
      await login(data)
    } else {
      await registerUser(data)
    }
    setIsLoading(false)
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/10 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-violet-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute text-white" style={{
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            fontSize: `${3 + i}rem`,
            transform: `rotate(${i * 45}deg)`,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`
          }}>
            {i % 3 === 0 ? <Stethoscope /> : i % 3 === 1 ? <HeartPulse /> : <Activity />}
          </div>
        ))}
      </div>

      <div className="relative flex w-full min-h-screen z-10">
        {/* Left Panel - Brand Showcase */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10"></div>
          
          <div className="relative max-w-lg text-center">
            {/* Animated Logo */}
            <div className="inline-flex mb-10 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-3xl group-hover:bg-emerald-400/40 transition-all duration-500"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight">
              {isLogin ? (
                <>Welcome Back to <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">DocCare</span>!</>
              ) : (
                <>Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">Health Journey</span><br />Starts Here</>
              )}
            </h1>
            
            <p className="text-lg text-gray-300/80 mb-12 leading-relaxed">
              {isLogin 
                ? 'Access your health records, manage appointments, and connect with top healthcare professionals.'
                : 'Join thousands of patients who trust us for their healthcare. Book appointments, consult doctors, and stay healthy.'}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="group flex items-center gap-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-4 hover:bg-white/[0.06] hover:border-emerald-400/20 transition-all duration-500 hover:translate-x-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Trusted Platform</p>
                  <p className="text-xs text-gray-400">50,000+ verified patients</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-4 hover:bg-white/[0.06] hover:border-emerald-400/20 transition-all duration-500 hover:translate-x-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">24/7 Support</p>
                  <p className="text-xs text-gray-400">Round-the-clock healthcare</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl px-6 py-4 hover:bg-white/[0.06] hover:border-emerald-400/20 transition-all duration-500 hover:translate-x-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400/20 to-violet-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Activity className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Advanced Care</p>
                  <p className="text-xs text-gray-400">500+ specialists available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent lg:hidden"></div>
          
          <div className="w-full max-w-md relative">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">DocCare</span>
              </Link>
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="mt-2 text-gray-400">
                {isLogin ? (
                  <>
                    New here?{' '}
                    <button type="button" onClick={() => switchMode('register')} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form Container */}
            <div className="relative">
              {/* Glass Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl"></div>
              
              {/* Shine Effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="relative p-8 sm:p-10">
                {/* Desktop Toggle */}
                <div className="hidden lg:block text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/[0.05] rounded-2xl p-1.5 border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isLogin
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        !isLogin
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {isLogin ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                            <input
                              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                              type="email"
                              autoComplete="email"
                              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>
                        {errors.email && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                            <input
                              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300"
                              placeholder="Enter your password"
                            />
                            <button type="button" className="absolute right-4 text-gray-400 hover:text-emerald-400 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        {errors.password && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.password.message}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" defaultChecked className="peer sr-only" />
                            <div className="w-10 h-5 bg-white/[0.08] rounded-full peer-checked:bg-emerald-500 transition-colors duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300 shadow-md"></div>
                          </div>
                          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                              <input {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} type="text" autoComplete="name" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="John Doe" />
                            </div>
                          </div>
                          {errors.name && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.name.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                            <div className="relative flex items-center">
                              <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} type="email" autoComplete="email" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="john@example.com" />
                            </div>
                          </div>
                          {errors.email && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Phone Number</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                            <input {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' } })} type="tel" autoComplete="tel" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="9876543210" />
                          </div>
                        </div>
                        {errors.phone && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.phone.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Age</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                            <div className="relative flex items-center">
                              <Calendar className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                              <input {...register('age', { required: 'Age is required', min: { value: 1, message: 'Min 1' }, max: { value: 120, message: 'Max 120' } })} type="number" autoComplete="off" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="25" />
                            </div>
                          </div>
                          {errors.age && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.age.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Gender</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                            <select {...register('gender', { required: 'Gender is required' })} className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300 appearance-none cursor-pointer">
                              <option value="" className="bg-slate-900 text-gray-400">Select Gender</option>
                              <option value="male" className="bg-slate-900 text-white">Male</option>
                              <option value="female" className="bg-slate-900 text-white">Female</option>
                              <option value="other" className="bg-slate-900 text-white">Other</option>
                            </select>
                          </div>
                          {errors.gender && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.gender.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                            <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="Create a password" />
                            <button type="button" className="absolute right-4 text-gray-400 hover:text-emerald-400 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        {errors.password && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.password.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Confirm Password</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                            <input {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} type="password" autoComplete="new-password" className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.08] transition-all duration-300" placeholder="Confirm your password" />
                          </div>
                        </div>
                        {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.confirmPassword.message}</p>}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <input id="agree-terms" type="checkbox" className="peer sr-only" {...register('agreeTerms', { required: 'You must agree to the terms' })} />
                          <div className="w-5 h-5 bg-white/[0.06] border border-white/[0.08] rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-300 flex items-center justify-center cursor-pointer">
                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                        <label htmlFor="agree-terms" className="text-sm text-gray-400 cursor-pointer select-none -mt-0.5">
                          I agree to the{' '}
                          <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 font-medium">Terms of Service</Link>
                          {' '}and{' '}
                          <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 font-medium">Privacy Policy</Link>
                        </label>
                      </div>
                      {errors.agreeTerms && <p className="text-sm text-red-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{errors.agreeTerms.message}</p>}
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Mobile Toggle */}
                <div className="lg:hidden mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {isLogin ? (
                      <>
                        Don't have an account?{' '}
                        <button type="button" onClick={() => switchMode('register')} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline">
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button type="button" onClick={() => switchMode('login')} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister
