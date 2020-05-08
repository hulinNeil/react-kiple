import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';
import intl from 'react-intl-universal';
import { useDispatch, Dispatch, useSelector } from 'dva';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import { validateMailAddressee } from '@/utils/validateForm';
import { openNewWindow } from '@/utils/tools';
import { MailCronjobState } from '@/models/mail/cronjob';

const CreateCronjob = () => {
  const dialogVisible = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.dialogVisible);
  const confirmLoading = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.confirmLoading);
  const tempListData = useSelector((state: { mailCronjob: MailCronjobState }) => state.mailCronjob.tempListData);
  const { curIndex, tempList, tempLoading, current, total } = tempListData;
  const dispatch = useDispatch<Dispatch>();

  // hide current component
  const hideModal = () => {
    dispatch({
      type: 'mailCronjob/change',
      payload: {
        dialogVisible: false,
        confirmLoading: false,
        tempListData: { ...tempListData, curIndex: -1 },
      },
    });
  };

  // get email template list
  const getTplList = () => {
    dispatch({
      type: 'mailCronjob/getTemplateList',
    });
  };
  // crete email cronjob
  const createCronjob = (item: { to: string; replaceWord: string; sendTime: Moment }) => {
    const payload = {
      channelId: 1,
      templateId: tempList[curIndex].id,
      to: item.to.split(' '),
      replaceWord: item.replaceWord ? item.replaceWord.split(' ') : [],
      sendTime: Number(item.sendTime.format('x')),
    };
    dispatch({
      type: 'mailCronjob/createCronjob',
      payload,
    });
  };

  useEffect(() => {
    if (dialogVisible && tempList.length === 0) {
      getTplList();
    }
  }, [dialogVisible]);

  // change templateId
  const onSelectChange = (e: number) => {
    dispatch({
      type: 'mailCronjob/change',
      payload: { tempListData: { ...tempListData, curIndex: e } },
    });
  };

  // get template list on select scroll
  const onPopupScroll = () => {
    const view = document.querySelector('.mail-tpl-select>div:last-child');
    if (view) {
      const contentH = view.clientHeight;
      const viewH = view.scrollHeight;
      const scrollTop = view.scrollTop;
      if (contentH - viewH - scrollTop <= 100 && !tempLoading && (current - 1) * 10 < total) {
        getTplList();
      }
    }
  };
  // Check template variable
  const validateVariable = (rule: any, value: string) => {
    let msg = '';
    const curTpl = curIndex === -1 ? null : tempList[curIndex];
    if (!value && curTpl && curTpl.placeholderCount > 0) {
      msg = intl.get('sms.send.no.replae');
    } else {
      if (curTpl && curTpl.placeholderCount > 0) {
        const placeholderList = value.split(' ').filter((item) => /\S/gi.test(item));
        if (placeholderList.length < curTpl.placeholderCount) {
          msg = intl.get('sms.send.no.full.replae', { count: curTpl.placeholderCount, length: placeholderList.length });
        }
      }
    }
    return msg ? Promise.reject(msg) : Promise.reject();
  };
  return (
    <ModalForm title={intl.get('sms.send.create')} visible={dialogVisible} confirmLoading={confirmLoading} onCancel={hideModal} onOk={createCronjob}>
      <Form.Item label={intl.get('sms.tpl.name')} className="mail-tpl-name" required={true}>
        <Form.Item name="title" rules={[{ required: true, message: intl.get('sms.tpl.no.name') }]} className="mail-tpl-select-view">
          <Select
            dropdownRender={(menu) => <div className="mail-tpl-select">{menu}</div>}
            notFoundContent={intl.get('sms.send.no.tpl')}
            loading={tempLoading}
            onPopupScroll={onPopupScroll}
            onChange={onSelectChange}
          >
            {tempList.map((value, index) => (
              <Select.Option key={`tpl-${index}`} value={index}>
                {value.templateName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {curIndex !== -1 && <Button onClick={() => openNewWindow(tempList[curIndex].content)}>{intl.get('preview')}</Button>}
      </Form.Item>
      {curIndex !== -1 && tempList[curIndex].placeholderCount > 0 && (
        <Form.Item label={intl.get('sms.send.replae')} required={true} name="replaceWord" rules={[{ validator: validateVariable }]}>
          <Input
            type="text"
            placeholder={
              tempList[curIndex].placeholderCount === 1
                ? intl.get('sms.send.one.replae')
                : intl.get('sms.send.edit.replae', { count: tempList[curIndex].placeholderCount })
            }
          />
        </Form.Item>
      )}
      <Form.Item label={intl.get('sms.send.to')} name="to" required={true} rules={[{ validator: validateMailAddressee }]}>
        <Input.TextArea placeholder={intl.get('mail.send.to.placeholder')} autoSize={{ minRows: 2 }} />
      </Form.Item>
      <Form.Item label={intl.get('sms.send.time')} name="sendTime" rules={[{ required: true, message: intl.get('sms.send.no.time') }]}>
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={(current) => current && current < moment()}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        />
      </Form.Item>
    </ModalForm>
  );
};

export default CreateCronjob;
