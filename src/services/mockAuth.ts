// Temporary mock authentication service
// This will be replaced once Cognito client secret issue is resolved

interface MockUser {
  username: string;
  email: string;
  password: string;
}

const mockUsers: MockUser[] = [
  {
    username: 'admin',
    email: 'admin@uw.edu',
    password: 'adminisnotadmin'
  }
];

export const mockSignIn = async (identifier: string, password: string): Promise<MockUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => 
    (u.username === identifier || u.email === identifier) && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

export const mockGetCurrentUser = async (): Promise<MockUser | null> => {
  // Check if user is stored in localStorage
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

export const mockSignOut = async (): Promise<void> => {
  localStorage.removeItem('mockUser');
};
