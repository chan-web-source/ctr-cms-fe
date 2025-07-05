type UserProfileToken = {
  userName: string;
  email: string;
  jwt: string;
  token: string;
  mfa?: boolean;
};

type UserProfile = {
  token: string;
};

export type { UserProfileToken, UserProfile };
