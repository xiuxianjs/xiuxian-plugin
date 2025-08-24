import React from 'react'
import { Modal, ModalProps } from 'antd'
import classNames from 'classnames'

interface XiuxianModalProps extends ModalProps {
  className?: string
}

const XiuxianModal: React.FC<XiuxianModalProps> = ({ className, ...props }) => {
  return (
    <Modal
      className={classNames(
        '[&_.ant-modal-header]:bg-slate-800 [&_.ant-modal-header]:border-slate-700',
        '[&_.ant-modal-title]:text-white',
        '[&_.ant-modal-content]:bg-slate-800 [&_.ant-modal-content]:border-slate-700',
        '[&_.ant-modal-body]:bg-slate-800 [&_.ant-modal-body]:text-white',
        '[&_.ant-modal-footer]:bg-slate-800 [&_.ant-modal-footer]:border-slate-700',
        '[&_.ant-modal-close]:text-slate-400 [&_.ant-modal-close:hover]:text-white',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  )
}

export default XiuxianModal
