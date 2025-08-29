import React from 'react';
import { Form, FormItemProps } from 'antd';
import classNames from 'classnames';

interface XiuxianFormFieldProps extends FormItemProps {
  children: React.ReactNode;
  className?: string;
}

const XiuxianFormField: React.FC<XiuxianFormFieldProps> = ({ children, className, ...props }) => {
  return (
    <Form.Item className={classNames('[&_.ant-form-item-label>label]:text-slate-300', '[&_.ant-form-item-explain-error]:text-red-400', className)} {...props}>
      {children}
    </Form.Item>
  );
};

export default XiuxianFormField;
