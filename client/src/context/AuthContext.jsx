import React, { createContext, useContext, useState, useEffect } from 'react';

const TEAM_MEMBERS = [
  {
    id: 'user-nayab',
    name: 'Nayab Farooq',
    role: 'Lead Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'NF',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    initials: 'SC',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    role: 'Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'MV',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'user-aisha',
    name: 'Aisha Patel',
    role: 'DevOps & QA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    initials: 'AP',
    color: 'from-emerald-500 to-teal-600',
  },
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('planpulse_user');
    return saved ? JSON.parse(saved) : TEAM_MEMBERS[0];
  });

  useEffect(() => {
    localStorage.setItem('planpulse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (memberId) => {
    const member = TEAM_MEMBERS.find((m) => m.id === memberId);
    if (member) setCurrentUser(member);
  };

  return (
    <AuthContext.Provider value={{ currentUser, teamMembers: TEAM_MEMBERS, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
