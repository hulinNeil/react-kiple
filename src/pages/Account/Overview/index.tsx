import React, { useState, useRef } from 'react';
// import intl from 'react-intl-universal';
import { Dispatch, useSelector, useDispatch } from 'dva';
import { Card, Upload, message, Avatar, Switch } from 'antd';
import { UploadChangeParam, UploadFile, RcFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import Page from '@/components/Page';
import ResetPassword from './Modal/ResetPwd';
import ResetContact from './Modal/ResetContact';
import { ConnectState } from '@/models';
import './index.less';

// get img base64
function getBase64(img: any, callback: (e: any) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// check img type and size
function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const Overview = () => {
  const userInfo = useSelector((state: ConnectState) => state.user.userInfo);
  const dispatch = useDispatch<Dispatch>();
  const accountID = '1438509938719570';
  const time = '2020-05-09 14:54:11';
  const [loading, setLoading] = useState(false);
  const resetPwdRef = useRef<any>();
  const resetContactRef = useRef<any>();

  const onAvatarChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log('change', info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        dispatch({
          type: 'user/change',
          payload: { userInfo: { ...userInfo, avatar: imageUrl } },
        });
        setLoading(false);
      });
    }
  };

  const onDeviceChange = (e: boolean) => {
    console.log('改变设备锁', e);
  };

  return (
    <Page title="基本信息" className="account-overview">
      <ResetPassword cRef={resetPwdRef} />
      <ResetContact cRef={resetContactRef} />
      <Card bordered={true}>
        <div className="base">
          <div className="avatar">
            <div className="avatar-img">
              {userInfo.avatar ? (
                <Avatar shape="square" size={120} src={userInfo.avatar} />
              ) : (
                <Avatar shape="square" size={120} icon={<UserOutlined />} />
              )}
              {loading && <LoadingOutlined className="avatar-uploading" />}
            </div>
            <Upload
              name="avatar"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={onAvatarChange}
            >
              <span className="edit">修改头像</span>
            </Upload>
          </div>
          <div className="summary">
            <p>登录账号 : {userInfo.userName}</p>
            <p>登录ID : {accountID}</p>
            <p>注册时间 : {time}</p>
          </div>
        </div>
        <ul className="set-list">
          <li>
            <div className="set-left">
              <b>手机</b>
            </div>
            <div className="set-desc">133******20</div>
            <div className="set-right">
              <span className="edit" onClick={() => resetContactRef.current.showRestContact({ type: 'tel', operate: 'reset' })}>
                修改
              </span>
            </div>
          </li>
          <li>
            <div className="set-left">
              <b>邮箱</b>
            </div>
            <div className="set-desc">
              <span className="text-primary">未添加邮箱账户名</span>
            </div>
            <div className="set-right">
              <span className="edit" onClick={() => resetContactRef.current.showRestContact({ type: 'email', operate: 'add' })}>
                添加
              </span>
            </div>
          </li>
          <li>
            <div className="set-left">
              <b>登陆密码</b>
            </div>
            <div className="set-desc">登录账户时需要输入的密码</div>
            <div className="set-right">
              <span className="edit" onClick={() => resetPwdRef.current.showRestPassword(1)}>
                重置
              </span>
            </div>
          </li>
          <li>
            <div className="set-left">
              <b>支付密码</b>
            </div>
            <div className="set-desc">在账户资金变动时需要输入的密码</div>
            <div className="set-right">
              <span className="edit" onClick={() => resetPwdRef.current.showRestPassword(2)}>
                重置
              </span>
            </div>
          </li>
          <li>
            <div className="set-left">
              <b>设备锁</b>
            </div>
            <div className="set-desc">开启后，账号在同一时间只能在同一浏览器上登录</div>
            <div className="set-right">
              <Switch onChange={onDeviceChange} />
            </div>
          </li>
        </ul>
      </Card>
    </Page>
  );
};

export default Overview;
