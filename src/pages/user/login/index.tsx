import { UserOutlined, LockOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { message, Card, Form, Input, Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { LoginParamsType, accountLogin } from '@/services/login';
import Footer from '@/components/Footer';
import styles from './style.less';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {

  const { refresh } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: LoginParamsType) => {
    setLoading(true);
    try {
      // 登录
      const { status } = await accountLogin({ ...values });
      if (status === 'ok') {
        message.success('登录成功！');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error(`登陆失败:${error}`);
    }
    setLoading(false);
  };


  const showModal = () =>
    Modal.confirm({
      title: '忘记密码?',
      centered: true,
      icon: <QuestionCircleOutlined />,
      content: '暂不支持在线更改密码,请联系管理员修改密码.'
    });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Card
          style={{ width: 350 }}
          title="ZWSJ Flow"
          bordered={false}
          headStyle={{
            textAlign: 'center',
            height: 40,
            fontSize: 16,
            fontWeight: 'bold',
            borderBottom: 'none'
          }}
        >
          <Form onFinish={(values) => handleSubmit(values as LoginParamsType)} style={{ maxWidth: 350 }}>
            <Form.Item
              name="account"
              rules={[
                {
                  required: true,
                  message: '请输入账户!'
                }
              ]}
            >
              <Input prefix={<UserOutlined />} allowClear placeholder='账户' />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!'
                }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} allowClear placeholder='密码' />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" size="large" htmlType="submit" loading={loading} shape="round" style={{ width: '100%', marginTop: 15 }}>
                登录
                </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <a style={{ float: 'right', color: '#b2b2b2', marginTop: 15 }} onClick={showModal}>
                忘记密码?
                </a>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
