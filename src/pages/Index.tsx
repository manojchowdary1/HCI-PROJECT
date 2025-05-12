
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Book, Calendar, Clock, BarChart, FileText, CheckCircle } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      title: "Study Dashboard",
      description: "Get a complete overview of your exam preparation at a glance.",
      icon: <Book className="h-10 w-10 text-primary" />
    },
    {
      title: "Study Planner",
      description: "Create personalized study schedules based on your exam dates.",
      icon: <Calendar className="h-10 w-10 text-primary" />
    },
    {
      title: "Resource Library",
      description: "Access and organize all your study materials in one place.",
      icon: <FileText className="h-10 w-10 text-primary" />
    },
    {
      title: "Pomodoro Timer",
      description: "Use the proven Pomodoro technique to boost your productivity.",
      icon: <Clock className="h-10 w-10 text-primary" />
    },
    {
      title: "Progress Tracking",
      description: "Monitor your improvement and identify areas that need attention.",
      icon: <BarChart className="h-10 w-10 text-primary" />
    },
    {
      title: "Daily Motivation",
      description: "Stay motivated with daily quotes and study tips.",
      icon: <CheckCircle className="h-10 w-10 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">StudyPrep</h1>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/login">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
                  Ace Your Exams with Personalized Study Guidance
                </h1>
                <p className="text-muted-foreground md:text-xl animate-fade-in">
                  StudyPrep helps students prepare effectively for exams with personalized study plans, 
                  resource organization, and progress tracking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                  <Link to="/login">
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mahindrauniversity.edu.in%2Fprograms%2Fbachelors-in-design-program%2F&psig=AOvVaw1zCqCIydC60tO03s0lc4rd&ust=1747159527167000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjm4NPCno0DFQAAAAAdAAAAABA8" 
                  alt="Student studying with laptop"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Features That Help You Succeed</h2>
              <p className="text-muted-foreground md:text-xl mx-auto max-w-3xl">
                Everything you need to organize your study materials, track your progress, and prepare effectively for exams.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-6 transition-all hover:shadow-md">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/20">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Exams?</h2>
            <p className="text-muted-foreground md:text-xl mx-auto max-w-3xl mb-8">
              Join thousands of students who are already using StudyPrep to improve their study habits and exam results.
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container py-8 px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">StudyPrep</h3>
              <p className="text-sm text-muted-foreground">
                Your personal study assistant for better exam preparation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Study Dashboard</li>
                <li>Study Planner</li>
                <li>Resource Library</li>
                <li>Progress Tracking</li>
                <li>Pomodoro Timer</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Blog</li>
                <li>Study Tips</li>
                <li>FAQ</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-sm text-muted-foreground text-center">
            <p>© 2023 StudyPrep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
