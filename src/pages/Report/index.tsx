import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Avatar, Card, Skeleton } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, ColumnsState } from '@ant-design/pro-table';
import { history, useAccess, useModel } from 'umi';
import moment from 'moment';
import { exportExcel } from '@/utils/tools';
import { TableListItem } from './data.d';
import { queryReport, removeRule } from './service';

const { Meta } = Card;

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
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
  }>({
    createAccount: {
      show: access.canAdmin,
    },
  });
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
      dataIndex: 'createAccount',
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '任务描述',
      dataIndex: 'describes',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '工作内容',
      dataIndex: 'content',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '用时',
      dataIndex: 'spendTime',
      width: 200,
      hideInSearch: true,
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
      render: (text: any) => <>{{ 0: '否', 1: '是' }[text]}</>
    },
    {
      title: '是否延期',
      dataIndex: 'delay',
      width: 200,
      hideInSearch: true,
      render: (text: any) => <>{{ 0: '否', 1: '是' }[text]}</>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      valueType: 'dateTimeRange',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss')
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

      const { checked, delay, createTime, updateTime } = item
      return {
        ...item,
        checked: { 0: '否', 1: '是' }[checked],
        delay: { 0: '否', 1: '是' }[delay],
        createTime: moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
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
          <Button type="primary" onClick={() => exportExcel(columns.filter(item => item.dataIndex !== 'index' && item.dataIndex !== 'updateTime'), exportRows, '日报')}>批量下载</Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;