export interface SignupResponse {
  _id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface SigninResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      email: string;
      name: string;
    };
  };
}
