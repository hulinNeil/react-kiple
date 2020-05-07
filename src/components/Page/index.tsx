import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './index.less';

export interface HeaderSearchProps {
  showArrow?: boolean;
  className?: string;
  title: string;
}

const Page: React.FC<HeaderSearchProps> = (props) => {
  const { showArrow, children, title, className = '' } = props;
  return (
    <div className={`app-content ${className}`}>
      <div className="app-content_header">
        <div className="app-content_header--left">
          {showArrow && (
            <div className="app-content_header--back" onClick={() => history.back()}>
              <ArrowLeftOutlined />
            </div>
          )}
          <h2 className="title">{title}</h2>
        </div>
      </div>
      <div className="app-content_body">{React.Children.map(children, (item) => item)}</div>
    </div>
  );
};

export default Page;
