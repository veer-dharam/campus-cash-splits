
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PlusCircle } from "lucide-react";
import { Group } from "@/types";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
    >
      <h3 className="font-medium text-gray-900">{group.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {group.members.length} members • {group.expenses.length} expenses
      </p>
    </button>
  );
}

export function GroupList() {
  const { groups, setCurrentGroup } = useApp();
  const navigate = useNavigate();

  const handleGroupClick = (groupId: string) => {
    setCurrentGroup(groupId);
    navigate(`/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate("/groups/new");
  };

  return (
    <div className="px-4 py-4">
      <div className={cn("grid gap-3", groups.length > 0 ? "grid-cols-1" : "")}>
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onClick={() => handleGroupClick(group.id)}
          />
        ))}
      </div>

      <button
        onClick={handleCreateGroup}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-expense text-white shadow-lg flex items-center justify-center hover:bg-expense-hover transition-colors"
        aria-label="Create new group"
      >
        <PlusCircle size={28} />
      </button>
    </div>
  );
}
