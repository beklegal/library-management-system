import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {description}
          </p>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Go Back
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
