import { useState } from 'react'
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from "../utils/SVGExporter"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const passwordStrength = (password) => {
    const minLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    const strength = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length
    return strength
  }

  const renderPasswordStrength = () => {
    const strength = passwordStrength(password)
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
    return (
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-1/5 ${strength >= level ? colors[strength - 1] : 'bg-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BDD9F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1D2C40]">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#3D5473]">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#3D5473]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#3D5473]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6581A6] hover:text-[#3D5473]"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </button>
            </div>
            {renderPasswordStrength()}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3D5473]">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                className="block w-full px-3 py-2 bg-[#BDD9F2] border border-[#8BADD9] rounded-md text-[#1D2C40] placeholder-[#6581A6] focus:outline-none focus:ring-2 focus:ring-[#3D5473]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password && confirmPassword && (
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {password === confirmPassword ? (
                    <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </span>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3D5473] hover:bg-[#1D2C40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6581A6]"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-[#6581A6]">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[#3D5473] hover:text-[#1D2C40]">
              Log in
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}