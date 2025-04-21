
import { PageHeader } from "@/components/layout/PageHeader";
import { GroupList } from "@/components/home/GroupList";
import { User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#E5DEFF] via-[#F1F0FB] to-[#F8FAFC] pb-6">
      {/* Decorative gradient/hero header */}
      <div className="py-8 text-center">
        <div className="flex justify-center mb-2 animate-fade-in">
          <div className="rounded-full p-4 shadow-lg bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100">
            <User size={44} className="text-[#9b87f5]" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#6E59A5] text-transparent bg-clip-text mb-2 animate-fade-in">
          Effortless Group Expenses
        </h1>
        <p className="max-w-[370px] mx-auto text-base text-gray-500 animate-fade-in">
          Manage and split expenses with friends—create a group and get started!
        </p>
      </div>
      
      {/* Content */}
      <div className="max-w-md mx-auto">
        <GroupList />
      </div>
    </div>
  );
};

export default Index;
