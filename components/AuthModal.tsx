import React, { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/app/firebase/config'
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useRouter } from "next/navigation"
import { MultiStepLoader } from "@/components/ui/MultiStepLoader"

const loginLoadingStates = [
  { text: "Validating credentials..." },
  { text: "Authenticating with Firebase..." },
  { text: "Verifying account status..." },
  { text: "Loading user profile..." },
  { text: "Welcome back!" },
]

const signupLoadingStates = [
  { text: "Validating form data..." },
  { text: "Creating Firebase account..." },
  { text: "Setting up user profile..." },
  { text: "Finalizing account setup..." },
  { text: "Account created successfully!" },
]

const AuthModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('') 
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password || !displayName.trim()) {
      setError('Please fill in all fields')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError('')
    setCurrentLoadingStep(0)
    
    try {
      setCurrentLoadingStep(0)

      setCurrentLoadingStep(1)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      setCurrentLoadingStep(2)
      await updateProfile(user, {
        displayName: displayName.trim()
      })

      setCurrentLoadingStep(3)

      setCurrentLoadingStep(4)
      
      console.log('User created successfully:', user)

      setEmail('')
      setPassword('')
      setDisplayName('')

      // Wait a moment for the loader to complete its cycle
      setTimeout(() => {
        onOpenChange(false)
        router.push('/dashboard')
      }, 1000)
      
    } catch (error: any) {
      console.error('Sign up error:', error)
      setIsLoading(false)
      setCurrentLoadingStep(0)
 
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email is already registered')
          break
        case 'auth/invalid-email':
          setError('Invalid email address')
          break
        case 'auth/weak-password':
          setError('Password is too weak')
          break
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection')
          break
        default:
          setError('Failed to create account. Please try again')
      }
    }
  }

  const handleLogIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')
    setCurrentLoadingStep(0)
    
    try {
      // Step 1: Validating credentials
      setCurrentLoadingStep(0)
      
      // Step 2: Authenticating with Firebase
      setCurrentLoadingStep(1)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Step 3: Verifying account status
      setCurrentLoadingStep(2)
      
      // Step 4: Loading user profile
      setCurrentLoadingStep(3)
      
      // Step 5: Welcome back
      setCurrentLoadingStep(4)
      
      console.log('User logged in successfully:', user)

      setEmail('')
      setPassword('')

      setTimeout(() => {
        onOpenChange(false)
        router.push('/dashboard')
      }, 1000)
      
    } catch (error: any) {
      console.error('Login error:', error)
      setIsLoading(false)
      setCurrentLoadingStep(0)
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email')
          break
        case 'auth/wrong-password':
          setError('Incorrect password')
          break
        case 'auth/invalid-email':
          setError('Invalid email address')
          break
        case 'auth/user-disabled':
          setError('Account has been disabled')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later')
          break
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection')
          break
        default:
          setError('Failed to log in. Please try again')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "login") {
      handleLogIn()
    } else {
      handleSignUp()
    }
  }

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login")
    setError('')
    setCurrentLoadingStep(0)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full lg:max-w-[35rem] md:max-w-[30rem] sm:max-w-[25rem]">
          <DialogHeader>
            <DialogTitle>
              {mode === "login" ? "Login to your account" : "Create your account"}
            </DialogTitle>
            <DialogDescription>
              {mode === "login"
                ? "Enter your credentials to log in."
                : "Enter your info to create an account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4">
              {mode === "signup" && (
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name" 
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com" 
                  required 
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required 
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={switchMode}
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={switchMode}
                      disabled={isLoading}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (mode === "login" ? "Logging in..." : "Creating account...") 
                    : (mode === "login" ? "Login" : "Sign up")
                  }
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Multi-step loader overlay with controlled step progression */}
      <MultiStepLoader
        loadingStates={mode === "login" ? loginLoadingStates : signupLoadingStates}
        loading={isLoading}
        currentStep={currentLoadingStep}
        duration={800} // This won't control the timing anymore since we're manually controlling steps
        loop={false}
      />
    </>
  )
}

export default AuthModal