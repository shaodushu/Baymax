import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Checkbox, Button, Slider, InputNumber, message, DatePicker } from 'antd';
import moment from 'moment';
import { ReportItem } from './data';
import { addReport } from './service';
// import styles from './index.less';


const { TextArea } = Input

export default (): React.ReactNode => {
    const initialValues = { title: '', desc: '', content: '', spendTime: 0, percentage: 0, checked: false, delay: false }
    const onFinish = async (values: ReportItem) => {
        const hide = message.loading('正在添加');
        try {
            await addReport({ ...values, time: moment(values.time).format('YYYY-MM-DD HH:mm:ss') })
            hide();
            message.success('添加成功');
            return true;
        } catch (error) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const layout = {
        labelCol: { xs: 24, sm: 7 },
        wrapperCol: { xs: 24, sm: 12, md: 10 },
    };
    const tailLayout = {
        wrapperCol: { xs: { offset: 0, span: 24 }, sm: { offset: 7, span: 10 } },
    };
    return <PageContainer>
        <Card>
            <Form
                {...layout}
                name="basic"
                initialValues={initialValues}
                onFinish={(values) => onFinish(values as ReportItem)}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="日期"
                    name="time"
                    rules={[{ required: true, message: '日期' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="任务名称"
                    name="title"
                    rules={[{ required: true, message: '任务名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="任务描述"
                    name="describes"
                    rules={[{ required: true, message: '任务描述' }]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    label="工作内容"
                    name="content"
                    rules={[{ required: true, message: '工作内容' }]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    label="工作用时"
                    name="spendTime"
                >
                    <InputNumber
                        min={0}
                        max={8}
                        step={0.1}
                    />
                    {/* <span className="ant-form-text"> 小时</span> */}
                </Form.Item>
                <Form.Item
                    label="完成度"
                    name="percentage"
                >
                    <Slider
                        marks={{
                            0: 'F',
                            20: 'E',
                            40: 'D',
                            60: 'C',
                            80: 'B',
                            100: 'A',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="是否自检"
                    name="checked"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
                <Form.Item
                    label="是否延期"
                    name="delay"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        提交
      </Button>
                </Form.Item>
            </Form>
        </Card>
    </PageContainer>
}
