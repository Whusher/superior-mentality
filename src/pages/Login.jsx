import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '../utils/SVGExporter'
import { Link } from 'react-router-dom'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BDD9F2]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1D2C40]">Login</h1>
        <form className="space-y-4">
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
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3D5473] hover:bg-[#1D2C40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6581A6]"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-[#6581A6] hover:text-[#3D5473]">
            Forgot your password?
          </a>
        </div>
        <div className="mt-4 text-center space-y-3">
          <p className='text-opac'>You need an account?</p>
          <Link to={'/signup'} className='w-1/2 mt-0 mx-auto flex justify-center py-2 px-4 border border-dark rounded-md shadow-sm text-sm font-medium text-darker-light hover:text-white bg-white hover:bg-[#1D2C40] focus:outline-none focus:ring-2 ring-offset-2 ring-[#6581A6]' >Sing Up now!</Link>
        </div>
      </div>
    </div>
  )
}