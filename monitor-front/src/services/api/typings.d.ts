declare namespace API {
    type LoginParams = {
      userName: string;
      password: string;
    };

  type LoginResult = {
    code: number;
    msg: string;
    user?: {
      userId: number;
      roleId: number;
      userName: string;
    };
    token?: string;
  };

    type RegisterParams = {
      userName: string;
      password: string;
      roleId: number;
    }
}
