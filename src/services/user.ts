import { request } from 'umi';

export async function queryCurrent() {
  return request<API.CurrentUser>('/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/notices');
}
