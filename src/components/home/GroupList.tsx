
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PlusCircle, User } from "lucide-react";
import { Group } from "@/types";
import { cn } from "@/lib/utils";

// A colored group card with subtle animation and modern look
interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group transition-transform duration-200 hover:scale-105 outline-none focus-visible:ring-2",
        "p-4 rounded-2xl w-full flex flex-col gap-2",
        "bg-gradient-to-br from-[#D6BCFA] via-[#E5DEFF] to-white shadow-md border border-gray-100"
      )}
    >
      <h3 className="font-semibold text-[#6E59A5] group-hover:text-[#9b87f5] text-lg tracking-tight">{group.name}</h3>
      <p className="text-sm text-gray-500">
        {group.members.length} member{group.members.length !== 1 && "s"} &bull; {group.expenses.length} expense{group.expenses.length !== 1 && "s"}
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

  const noGroups = groups.length === 0;

  return (
    <div className="relative px-2 md:px-6 py-2">
      <div className={cn("grid gap-4", !noGroups && "grid-cols-1")}>
        {/* Show group cards or empty state */}
        {noGroups ? (
          <div className="flex flex-col items-center mt-8 bg-gradient-to-b from-[#faf9ff] via-[#e5deff]/60 to-[#F8FAFC] rounded-xl p-6 shadow animate-fade-in">
            <div className="mb-3">
              <img
                src="/public/placeholder.svg"
                alt="Empty state"
                className="w-16 h-16 opacity-80"
                draggable={false}
              />
            </div>
            <div className="mb-2 font-semibold text-[#7E69AB] text-lg">
              No groups yet
            </div>
            <p className="text-gray-500 text-sm mb-1">Create your first group to manage expenses.</p>
            <button
              onClick={handleCreateGroup}
              className="mt-3 flex items-center gap-2 text-white px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] shadow hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#8B5CF6] transition-all text-base"
              aria-label="Create your first group"
            >
              <PlusCircle size={20} /> Create Group
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => handleGroupClick(group.id)}
            />
          ))
        )}
      </div>

      {/* Floating action button */}
      {!noGroups && (
        <button
          onClick={handleCreateGroup}
          className="fixed bottom-24 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#6E59A5] shadow-lg flex items-center justify-center hover:scale-110 transition-all ring-2 ring-white"
          aria-label="Create new group"
        >
          <PlusCircle size={32} className="text-white" />
        </button>
      )}
    </div>
  );
}
