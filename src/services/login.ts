import { request } from 'umi';

export interface LoginParamsType {
  account: string;
  password: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function outLogin() {
  return request('/login/outLogin');
}
