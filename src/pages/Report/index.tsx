import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Avatar, Card, Skeleton } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, ColumnsState } from '@ant-design/pro-table';
import { history, useAccess, useModel } from 'umi';
import moment from 'moment';
import { exportExcel } from '@/utils/tools';
import { TableListItem } from './data.d';
import { queryReport, deleteReport } from './service';

const { Meta } = Card;

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteReport({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const access = useAccess();
  const { initialState, loading } = useModel('@@initialState');

  const [columnsStateMap, setColumnsStateMap] = useState<{
    [key: string]: ColumnsState;
  }>({});
  const [exportRows, setExportRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
    },
    {
      title: '提交人',
      width: 150,
      dataIndex: 'username',
      hideInTable: access.canUser,
      hideInSearch: access.canUser,
    },
    {
      title: '日期',
      dataIndex: 'time',
      valueType: 'date',
      width: 200,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '任务描述',
      dataIndex: 'describes',
      copyable: true,
      ellipsis: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '工作内容',
      dataIndex: 'content',
      copyable: true,
      ellipsis: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '用时',
      dataIndex: 'spendTime',
      width: 80,
      hideInSearch: true,
      renderText: (text: number) => `${text.toFixed(1)} h`
    },
    {
      title: '完成度',
      dataIndex: 'percentage',
      valueType: 'progress',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '是否自检',
      dataIndex: 'checked',
      width: 200,
      hideInSearch: true,
      valueEnum: {
        0: '否',
        1: '是',
      },
    },
    {
      title: '是否延期',
      dataIndex: 'delay',
      width: 200,
      hideInSearch: true,
      valueEnum: {
        0: '否',
        1: '是',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      valueType: 'dateTimeRange',
      renderText: (text: Date) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];

  useEffect(() => {
    setExportRows(selectedRowsState.map(item => {

      const { checked, delay, createTime, percentage } = item
      return {
        ...item,
        percentage: `${percentage}%`,
        checked: { 0: '否', 1: '是' }[checked],
        delay: { 0: '否', 1: '是' }[delay],
        time: moment(createTime).format('YYYY/MM/DD')
      }
    }))
  }, [selectedRowsState])

  return (
    <PageContainer
      title="工作台"
      content={<Skeleton avatar paragraph={{ rows: 4 }} loading={loading}>
        <Meta
          avatar={<Avatar src={initialState!.currentUser && initialState!.currentUser!.avatar} size="large" />}
          title={initialState!.currentUser && initialState!.currentUser!.name}
        />
      </Skeleton>}>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
        toolBarRender={() => [
          access.canUser && <Button type="primary" onClick={() => history.push('/report/edit')}>
            <PlusOutlined /> 填写日报
          </Button>,
        ]}
        request={(params, sorter, filter) => queryReport({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
          <Button type="primary" onClick={() => exportExcel(columns.filter(item => item.dataIndex !== 'index' && item.dataIndex !== 'createTime' && item.dataIndex !== 'updateTime'), exportRows, '日报')}>批量下载</Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
