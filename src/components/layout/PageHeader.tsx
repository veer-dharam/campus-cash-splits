
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, backTo, actions }: PageHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="px-4 h-14 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-2">
        {backTo && (
          <button 
            onClick={() => navigate(backTo)} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
