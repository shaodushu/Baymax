import { request } from 'umi';
import { TableListParams, ReportItem } from './data.d';

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

export async function updateReport(params: ReportItem) {
  return request('/report/update', {
    method: 'POST',
    data: params,
  });
}