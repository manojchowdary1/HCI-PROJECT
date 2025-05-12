
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson"
  },
  {
    text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    author: "Pelé"
  }
];

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote>();
  
  useEffect(() => {
    // Use a number-based index to avoid type errors with arithmetic operations
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Motivation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <blockquote className="italic border-l-4 pl-4 border-muted">
            {quote?.text}
          </blockquote>
          <div className="text-sm text-muted-foreground text-right">
            — {quote?.author}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
