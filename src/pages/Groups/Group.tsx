
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopNav } from '@/components/NavigationMenu';
import { GroupHeader } from '@/components/groups/GroupHeader';
import { MemberManagement } from '@/components/groups/MemberManagement';
import { ChatSystem } from '@/components/groups/ChatSystem';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { GroupSummary } from '@/components/groups/GroupSummary';
import { useGroup } from '@/hooks/useGroup';

const Group = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    group,
    loading,
    expenses,
    setExpenses,
    handleDeleteGroup,
    handleAddMember
  } = useGroup(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container max-w-2xl mx-auto px-4 py-8 flex justify-center">
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <GroupHeader 
          groupName={group.name}
          onBack={() => navigate('/')}
          onDelete={handleDeleteGroup}
        />

        <GroupSummary 
          description={group.description}
          totalSpent={totalSpent}
        />

        <div className="space-y-6">
          <MemberManagement 
            members={group.members} 
            onAddMember={handleAddMember} 
          />

          <ChatSystem 
            groupId={group.id} 
            members={group.members} 
          />

          <ExpensesList
            groupId={group.id}
            expenses={expenses}
            setExpenses={setExpenses}
            members={group.members}
          />
        </div>
      </div>
    </div>
  );
};

export default Group;
