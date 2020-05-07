import React from 'react';
import intl from 'react-intl-universal';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';

interface ModalType {
  title: string;
  content: string;
  onCancel?: (close: any) => void;
  onOk?: (close: any) => void;
}

const warning = ({ title, content, onCancel, onOk }: ModalType): void => {
  Modal.confirm({
    title,
    content: (
      <div className="custom-modal-warning">
        <ExclamationCircleOutlined className="custom-modal-warning-icon" />
        <div className="custom-modal-warning-body">{content}</div>
      </div>
    ),
    className: 'custom-modal',
    okText: intl.get('ok'),
    cancelText: intl.get('cancel'),
    onCancel: (close) => {
      if (onCancel) {
        return onCancel(close);
      } else {
        return Promise.resolve();
      }
    },
    onOk: (close) => {
      if (onOk) {
        return onOk(close);
      } else {
        return Promise.resolve();
      }
    },
  });
};

export default { warning };
