import { Alert, Button, message, Tabs } from 'antd';
import React, { useState } from 'react';
import {ProFormText, LoginForm, ProFormSelect, ProFormCheckbox} from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { loginUsingPOST7 as login } from '@/services/api/userController';
import { registerUsingPOST7 as register } from "@/services/api/userController";

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>();
  const [type, setType] = useState<string>('login');
  const { setInitialState } = useModel('@@initialState');

  const handleLogin = async (values: API.LoginFormParams) => {
    try {
      // 登录
      const { userName, password, isAutoLogin } = values;
      const res = await login({ userName, password});
      if (res.code === 0) {
        const defaultLoginSuccessMessage = "登录成功";
        message.success(defaultLoginSuccessMessage);
        // await fetchUserInfo();
        await setInitialState((s) => ({
          ...s,
          currentUser: {...res.user, token: res.token},
        }));
        // 保存登录状态
        if(isAutoLogin) {
          localStorage.setItem('monitor_userName', res.user?.userName ?? '');
          localStorage.setItem('monitor_password', res?.user?.passWord ?? '');
        }
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      console.log(res);
      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      const defaultLoginFailureMessage = "登录失败，请重试！"
      message.error(defaultLoginFailureMessage);
    }
  };

  const handleRegister = async (values: API.RegisterParams) => {
    try {
      const res = await register({ ...values});
      if (res.code === 0) {
        const defaultLoginSuccessMessage = "注册成功，请登录";
        message.success(defaultLoginSuccessMessage);
        setType('login')
        return;
      }
      message.error(res.msg);
      console.log(res);
    } catch (error) {
      const defaultLoginFailureMessage = "注册失败，请重试！"
      message.error(defaultLoginFailureMessage);
    }
  };
  // const { status, type: loginType } = userLoginState;
  const { code, msg } = userLoginState ? userLoginState : { code: -1, msg: ""};

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="局部放电监测系统"
          subTitle="电缆与开关柜局部放电实时监测与报警系统"
          initialValues={{
            autoLogin: true,
          }}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={async (values) => {
            if(type === 'login') {
              await handleLogin(values as API.LoginParams);
            } else if(type === 'register') {
              await handleRegister(values as API.RegisterParams);
            }
          }}
          submitter={{
            render: (props) => {
              return [
                null,
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  {type === 'login' ? '登录' : '注册'}
                </Button>,
              ];
            },
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="login"
              tab="登录"
            />
            <Tabs.TabPane
              key="register"
              tab="注册"
            />
          </Tabs>

          {code > 0 && (
            <LoginMessage
              content={msg}
            />
          )}
          {type === 'login' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large'
                }}
                label="用户名"
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                label="密码"
                fieldProps={{
                  size: 'large'
                }}
                placeholder="密码：123"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                ]}
              />
              <div style={{paddingLeft: '25%'}}>
                <ProFormCheckbox
                  name="isAutoLogin"
                >自动登录</ProFormCheckbox>
              </div>
            </>
          )}

          {type === 'register' && (
            <>
              <ProFormSelect
                name="roleId"
                label="用户类型"
                valueEnum={{
                  0: '普通用户',
                  1: '管理员',
                }}
                placeholder="请选择用户类型"
                rules={[{ required: true, message: '请选择用户类型!' }]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large'
                }}
                name="userName"
                label="用户名"
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: "请输入用户名！",
                  }
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                }}
                label="密码"
                placeholder="请输入密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                }}
                label="确认密码"
                placeholder="请再次输入密码"
                dependencies={['password']}
                name="checkPwd"
                rules={[
                  {
                    required: true,
                    message: "请再次输入密码！",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致，请重新输入'));
                    },
                  }),
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            {/*<ProFormCheckbox noStyle name="autoLogin">*/}
            {/*  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />*/}
            {/*</ProFormCheckbox>*/}
            {/*<a*/}
            {/*  style={{*/}
            {/*    float: 'right',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />*/}
            {/*</a>*/}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
