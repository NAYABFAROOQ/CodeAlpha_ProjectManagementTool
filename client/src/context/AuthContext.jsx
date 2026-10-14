import React, { createContext, useContext, useState, useEffect } from 'react';

const TEAM_MEMBERS = [
  {
    id: 'user-nayab',
    name: 'Nayab Farooq',
    role: 'Principal Architect',
    email: 'nayab@pulsepm.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'NF',
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    role: 'Staff Product Designer',
    email: 'sarah.chen@pulsepm.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    initials: 'SC',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    role: 'Senior Staff Engineer',
    email: 'marcus@pulsepm.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'MV',
  },
  {
    id: 'user-aisha',
    name: 'Aisha Patel',
    role: 'SRE & Platform Lead',
    email: 'aisha@pulsepm.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    initials: 'AP',
  },
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pulsepm_user');
    return saved ? JSON.parse(saved) : TEAM_MEMBERS[0];
  });

  useEffect(() => {
    localStorage.setItem('pulsepm_user', JSON.stringify(currentUser));
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
