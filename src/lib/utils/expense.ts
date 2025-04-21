
import { Balance, Expense, Group, User } from "@/types";

// Get user by ID from a group
export const getUserById = (group: Group, userId: string): User | undefined => {
  return group.members.find((member) => member.id === userId);
};

// Calculate how expenses should be split among participants
export const calculateExpenseSplit = (expense: Expense): number => {
  if (!expense.participants.length) return 0;
  return expense.amount / expense.participants.length;
};

// Calculate balances for a group
export const calculateBalances = (group: Group): Balance[] => {
  const balances: Record<string, Record<string, number>> = {};
  
  // Initialize balances for all group members
  group.members.forEach((member) => {
    balances[member.id] = {};
    group.members.forEach((otherMember) => {
      if (member.id !== otherMember.id) {
        balances[member.id][otherMember.id] = 0;
      }
    });
  });

  // Calculate balances based on expenses
  group.expenses.forEach((expense) => {
    if (expense.settled) return;
    
    const payerId = expense.paidBy;
    const amountPerPerson = calculateExpenseSplit(expense);
    
    expense.participants.forEach((participantId) => {
      if (participantId === payerId) return;
      
      // Participant owes payer
      if (!balances[participantId][payerId]) {
        balances[participantId][payerId] = 0;
      }
      balances[participantId][payerId] += amountPerPerson;
      
      // Reduce reverse balance if it exists
      if (balances[payerId][participantId] > 0) {
        const diff = Math.min(balances[payerId][participantId], amountPerPerson);
        balances[payerId][participantId] -= diff;
        balances[participantId][payerId] -= diff;
      }
    });
  });

  // Flatten balances into array
  const result: Balance[] = [];
  Object.entries(balances).forEach(([fromId, toBalances]) => {
    Object.entries(toBalances).forEach(([toId, amount]) => {
      if (amount > 0) {
        result.push({
          from: fromId,
          to: toId,
          amount
        });
      }
    });
  });

  return result;
};

// Calculate total spent in a group
export const calculateTotalSpent = (group: Group): number => {
  return group.expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate user balance in a group
export const calculateUserBalance = (group: Group, userId: string): number => {
  const balances = calculateBalances(group);
  
  // Amount user owes others
  const owes = balances
    .filter(balance => balance.from === userId)
    .reduce((total, balance) => total + balance.amount, 0);
  
  // Amount others owe user
  const owed = balances
    .filter(balance => balance.to === userId)
    .reduce((total, balance) => total + balance.amount, 0);
  
  return owed - owes;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(0)}`;
};
