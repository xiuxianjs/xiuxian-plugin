import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { changePasswordAPI } from '@/api/auth';
import { PasswordForm } from '@/types/types';

export const useProfileCode = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token') || '';
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // e.stopPropagation()
    setLoading(true);
    setMessage(null);

    // 验证密码
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '新密码与确认密码不匹配' });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少6位' });
      setLoading(false);
      return;
    }

    try {
      const result = await changePasswordAPI(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: '密码修改失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    message,
    passwordForm,
    setPasswordForm,
    handlePasswordChange,
    handleInputChange,
    user
  };
};
