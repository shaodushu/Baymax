export interface ReportItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
  time: Date | string;
}

export interface TableListItem {
  key: number;
  createAccount: string;
  title: string;
  describes: string;
  content: string;
  spendTime: number;
  percentage: number | string;
  checked: number;
  delay: number;
  time: Date | string;
  createTime: Date | string;
  updateTime: Date | string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
