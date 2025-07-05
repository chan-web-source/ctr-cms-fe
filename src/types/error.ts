export type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
      code?: number;
    };
    status?: number;
  };
};
