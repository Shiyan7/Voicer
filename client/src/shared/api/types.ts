export type MinimalUserOutput = {
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  email: string;
  password: string;
};
