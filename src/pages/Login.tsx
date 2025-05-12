
import { AuthForms } from "@/components/auth/AuthForms";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">StudyPrep</h1>
          <p className="text-muted-foreground">Your personal study assistant</p>
        </div>
        <AuthForms />
      </div>
    </div>
  );
};

export default Login;
