import { request } from 'umi';
import { TableListParams, TableListItem, ReportItem } from './data.d';

export async function addReport(params: ReportItem) {
  return request('/report/create', {
    method: 'POST',
    data: params
  });
}

export async function queryReport(params: TableListParams) {
  return request('/report/list', {
    method: 'POST',
    data: params
  });
}

export async function deleteReport(params: { key: number[] }) {
  return request('/report/remove', {
    method: 'POST',
    data: params
  });
}

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
