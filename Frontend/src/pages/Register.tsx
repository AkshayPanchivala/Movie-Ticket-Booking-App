import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register as registerAction } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Sparkles, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ButtonSpinner } from '@/components/LoadingSpinner';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(
      registerAction({
        email,
        password,
        full_name: fullName,
      })
    );

    if (registerAction.fulfilled.match(result)) {
      toast.success('Account created successfully! Welcome to CineHub.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-background/95 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Logo with animation */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative p-4 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 backdrop-blur-sm border border-primary/30">
                  <Film className="w-12 h-12 text-primary" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Join CineHub and start your movie journey
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 h-11 bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 h-11 bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="pl-11 h-11 bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 6 characters
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ButtonSpinner />
                        <span>Creating account...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="signup"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Create Account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
