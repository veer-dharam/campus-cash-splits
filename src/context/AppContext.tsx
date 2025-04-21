
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Group, User, Expense, Settlement } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  groups: Group[];
  currentUser: User;
  currentGroupId: string | null;
  
  // Group actions
  createGroup: (name: string, initialMembers: User[]) => Group;
  updateGroup: (groupId: string, data: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  setCurrentGroup: (groupId: string | null) => void;
  
  // Expense actions
  addExpense: (groupId: string, expense: Omit<Expense, "id" | "groupId" | "settled">) => void;
  updateExpense: (groupId: string, expenseId: string, data: Partial<Expense>) => void;
  deleteExpense: (groupId: string, expenseId: string) => void;
  settleExpense: (groupId: string, expenseId: string) => void;
  
  // User actions
  addUserToGroup: (groupId: string, user: User) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
  
  // Settlement actions
  createSettlement: (groupId: string, from: string, to: string, amount: number) => void;
}

// Create a default initial user
const initialUser: User = {
  id: "user-1",
  name: "You"
};

// Sample users for demo
const sampleUsers: User[] = [
  { id: "user-2", name: "Rahul" },
  { id: "user-3", name: "Aarav" },
  { id: "user-4", name: "Priya" }
];

// Sample groups for demo
const initialGroups: Group[] = [
  {
    id: "group-1",
    name: "Goa Trip",
    members: [initialUser, sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    expenses: [
      {
        id: "expense-1",
        groupId: "group-1",
        amount: 1200,
        description: "Dinner",
        paidBy: "user-1",
        participants: ["user-1", "user-2", "user-3", "user-4"],
        date: new Date().toISOString(),
        settled: false
      },
      {
        id: "expense-2",
        groupId: "group-1",
        amount: 800,
        description: "Cab",
        paidBy: "user-2",
        participants: ["user-1", "user-2", "user-3"],
        date: new Date().toISOString(),
        settled: false
      },
      {
        id: "expense-3",
        groupId: "group-1",
        amount: 600,
        description: "Groceries",
        paidBy: "user-3",
        participants: ["user-1", "user-3", "user-4"],
        date: new Date().toISOString(),
        settled: false
      },
      {
        id: "expense-4",
        groupId: "group-1",
        amount: 900,
        description: "Tickets",
        paidBy: "user-4",
        participants: ["user-1", "user-2", "user-4"],
        date: new Date().toISOString(),
        settled: false
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "group-2",
    name: "College Project",
    members: [initialUser, sampleUsers[0], sampleUsers[1]],
    expenses: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "group-3",
    name: "Family Vacation",
    members: [initialUser, sampleUsers[2]],
    expenses: [],
    createdAt: new Date().toISOString()
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [currentUser] = useState<User>(initialUser);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    const savedGroups = localStorage.getItem("campus-cash-groups");
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("campus-cash-groups", JSON.stringify(groups));
  }, [groups]);

  // Group actions
  const createGroup = (name: string, initialMembers: User[]): Group => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      members: [currentUser, ...initialMembers],
      expenses: [],
      createdAt: new Date().toISOString()
    };
    
    setGroups([...groups, newGroup]);
    return newGroup;
  };

  const updateGroup = (groupId: string, data: Partial<Group>) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, ...data } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    if (currentGroupId === groupId) {
      setCurrentGroupId(null);
    }
  };

  const setCurrentGroup = (groupId: string | null) => {
    setCurrentGroupId(groupId);
  };

  // Expense actions
  const addExpense = (groupId: string, expense: Omit<Expense, "id" | "groupId" | "settled">) => {
    const newExpense: Expense = {
      id: uuidv4(),
      groupId,
      ...expense,
      settled: false
    };
    
    setGroups(groups.map(group => 
      group.id === groupId
        ? { ...group, expenses: [...group.expenses, newExpense] }
        : group
    ));
  };

  const updateExpense = (groupId: string, expenseId: string, data: Partial<Expense>) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            expenses: group.expenses.map(expense => 
              expense.id === expenseId
                ? { ...expense, ...data }
                : expense
            )
          }
        : group
    ));
  };

  const deleteExpense = (groupId: string, expenseId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            expenses: group.expenses.filter(expense => expense.id !== expenseId)
          }
        : group
    ));
  };

  const settleExpense = (groupId: string, expenseId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            expenses: group.expenses.map(expense => 
              expense.id === expenseId
                ? { ...expense, settled: true }
                : expense
            )
          }
        : group
    ));
  };

  // User actions
  const addUserToGroup = (groupId: string, user: User) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            members: [...group.members, user]
          }
        : group
    ));
  };

  const removeUserFromGroup = (groupId: string, userId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId
        ? {
            ...group,
            members: group.members.filter(member => member.id !== userId)
          }
        : group
    ));
  };

  // Settlement actions
  const createSettlement = (groupId: string, from: string, to: string, amount: number) => {
    const settlement: Settlement = {
      id: uuidv4(),
      groupId,
      from,
      to,
      amount,
      date: new Date().toISOString(),
      expenseIds: []
    };
    
    // Mark expenses as settled
    const group = groups.find(g => g.id === groupId);
    if (group) {
      // For simplicity, we're just marking the person's expenses as settled
      // In a real app, you'd want to be more selective about which expenses are settled
      setGroups(groups.map(g => 
        g.id === groupId
          ? {
              ...g,
              expenses: g.expenses.map(expense => 
                expense.paidBy === to && expense.participants.includes(from)
                  ? { ...expense, settled: true }
                  : expense
              )
            }
          : g
      ));
    }
  };

  const contextValue: AppContextType = {
    groups,
    currentUser,
    currentGroupId,
    createGroup,
    updateGroup,
    deleteGroup,
    setCurrentGroup,
    addExpense,
    updateExpense,
    deleteExpense,
    settleExpense,
    addUserToGroup,
    removeUserFromGroup,
    createSettlement
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
