export interface User {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isMember?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  teamId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
