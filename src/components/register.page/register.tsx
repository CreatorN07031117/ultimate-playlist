import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Form, Button } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { registerUser } from '../../store/actions';
import { AppRoute } from '../../const';
import type { AppDispatch } from '../../types/state';
import s from './register.module.css';

const Register = (): JSX.Element => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    dispatch(registerUser(values));
    navigate(`${AppRoute.Root}`);
  };

  return (
    <main>
      <div className={s.registerWrapper}>
        <section className={s.registerSection}>
          <h1 className={s.userFormTitle}>Sign up</h1>
          <Form form={form} onFinish={handleFormSubmit}>
            <label className="visually-hidden">Name</label>
            <Form.Item name="name">
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Your name"
                required
                minLength={1}
                maxLength={30}
              />
            </Form.Item>
            <label className="visually-hidden">E-mail</label>
            <Form.Item name="email">
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Your Email"
                required
              />
            </Form.Item>
            <label className="visually-hidden">Password</label>
            <Form.Item name="password">
              <Input.Password
                size="large"
                placeholder="input password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                required
                minLength={6}
                maxLength={12}
              />
            </Form.Item>
            <div className={s.buttonWrapper}>
              <Button className={s.button} htmlType="submit">
                Sign up
              </Button>
              <Button
                className={s.linkButton}
                htmlType="button"
                onClick={() => {
                  navigate(AppRoute.Login);
                }}
              >
                Sign in
              </Button>
            </div>
          </Form>
        </section>
      </div>
    </main>
  );
};

export default Register;
