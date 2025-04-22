
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_EMAIL = "rishikkumarchaurasiya@gmail.com";

const Auth = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email === ADMIN_EMAIL) {
        navigate("/");
      }
    });

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email === ADMIN_EMAIL) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged in!",
        description: "Welcome back.",
      });
      // Redirect handled by useEffect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blog-purple-light to-white">
      <form onSubmit={handleLogin} className="bg-white border rounded-xl shadow-lg px-8 py-10 w-full max-w-md">
        <h1 className="font-serif text-2xl font-semibold mb-7 text-center text-blog-purple">Admin Login</h1>
        <div className="mb-5">
          <label className="block mb-2 font-medium" htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            value={email}
            disabled
            className="bg-gray-100"
            readOnly
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 font-medium" htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
