import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLoginCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(values.username, values.password);

      if (result.success) {
        void navigate('/');
      } else {
        setError(result.message ?? '登录失败');
      }
    } catch (_err) {
      setError('错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError('请输入用户名和密码');

      return;
    }

    void onFinish({ username, password });
  };

  return {
    loading,
    error,
    handleSubmit,
    onFinish
  };
};
