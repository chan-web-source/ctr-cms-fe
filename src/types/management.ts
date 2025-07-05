interface ListParams {
  all?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
  order_by?: string;
}

interface UserManagementData {
  id: number;
  email: string;
  first_name?: string;
  surname?: string;
  email_validated?: boolean;
  phone?: string;
  phone_validated?: boolean;
  mfa_enabled?: boolean;
  mfa_method?: string;
  account_type?: string;
  account_status?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  role_ids?: number[];
  value?: string;
}

interface LogManagementData {
  id?: number;
  created_at?: string;
  user_id?: number;
  first_name?: string;
  surname?: string;
  email?: string;
  action?: string;
  entity_id?: number;
  entity_type?: string;
}

export type { UserManagementData, ListParams, LogManagementData };
