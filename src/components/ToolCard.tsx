import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
}

export default function ToolCard({
  title,
  description,
  link,
  icon,
}: ToolCardProps) {
  return (
    <Link to={link} className="group">
      <Card className="h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl transition transform hover:scale-[1.02] hover:shadow-lg">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="mb-1 text-blue-800">{icon}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm mt-1 text-center">{description}</p>

          {/* Action */}
          <div className="mt-4 flex items-center text-blue-800 dark:text-blue-400 font-medium text-sm group-hover:underline">
            Open Tool
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
