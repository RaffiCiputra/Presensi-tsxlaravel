import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-2" />
          Go Back
        </Button>
        <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
          <Home className="size-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
