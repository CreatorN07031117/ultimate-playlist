import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Form, Button } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from '@ant-design/icons';
import { signIn } from '../../store/actions';
import s from './login.module.css';

import { AppDispatch } from '../../types/state';
import { AppRoute } from '../../const';

const Login = (): JSX.Element => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function handleFormSubmit (values: { email: string; password: string }) {
    await dispatch(signIn(values)).then(() => navigate('/'))
  };

  return (
    <main>
      <div className={s.loginWrapper}>
        <section className={s.loginSection}>
          <h1 className={s.userFormTitle}>Sign in</h1>
          <Form form={form} onFinish={handleFormSubmit}>
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
                Sign in
              </Button>
              <Button
                className={s.linkButton}
                htmlType="button"
                onClick={() => {
                  navigate(AppRoute.Register);
                }}
              >
                Sign up
              </Button>
            </div>
          </Form>
        </section>
      </div>
    </main>
  );
};

export default Login;
