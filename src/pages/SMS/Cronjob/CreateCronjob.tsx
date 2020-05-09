import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';
import intl from 'react-intl-universal';
import { useDispatch, Dispatch, useSelector } from 'dva';
import { Form, DatePicker, Select, Input } from 'antd';
import ModalForm from '@/components/Form/ModalForm';
import { validateSmsTel } from '@/utils/validateForm';
import { SmsCronjobState } from '@/models/sms/cronjob';

const CreateCronjob = () => {
  const dialogVisible = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.dialogVisible);
  const confirmLoading = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.confirmLoading);
  const tempListData = useSelector((state: { smsCronjob: SmsCronjobState }) => state.smsCronjob.tempListData);
  const { curIndex, tempList, tempLoading, current, total } = tempListData;
  const dispatch = useDispatch<Dispatch>();

  // hide current component
  const hideModal = () => {
    dispatch({
      type: 'smsCronjob/change',
      payload: {
        dialogVisible: false,
        confirmLoading: false,
        tempListData: { ...tempListData, curIndex: -1 },
      },
    });
  };

  // get sms template list
  const getTempList = () => {
    dispatch({
      type: 'smsCronjob/getTemplateList',
    });
  };

  // crete sms cronjob
  const createCronjob = async (item: { to: string; replaceWord: string; sendTime: Moment }) => {
    const payload = {
      channelId: 1,
      templateId: tempList[curIndex].id,
      to: item.to.split(' '),
      replaceWord: item.replaceWord ? item.replaceWord.split(' ') : [],
      sendTime: Number(item.sendTime.format('x')),
    };
    dispatch({
      type: 'smsCronjob/createCronjob',
      payload,
    });
  };

  useEffect(() => {
    if (dialogVisible && tempList.length === 0) {
      getTempList();
    }
  }, [dialogVisible]);

  // change templateId
  const onSelectChange = (e: number) => {
    dispatch({
      type: 'smsCronjob/change',
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
        getTempList();
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
      <Form.Item label={intl.get('sms.tpl.name')} name="title" rules={[{ required: true, message: intl.get('sms.tpl.no.name') }]}>
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
      {curIndex !== -1 && (
        <>
          {tempList[curIndex].placeholderCount > 0 && (
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
          <Form.Item label={intl.get('sms.tpl.content')}>
            <Input.TextArea disabled value={tempList[curIndex].content} />
          </Form.Item>
        </>
      )}
      <Form.Item label={intl.get('sms.send.to')} name="to" required={true} rules={[{ validator: validateSmsTel }]}>
        <Input.TextArea placeholder={intl.get('sms.send.to.placeholder')} autoSize={{ minRows: 2 }} />
      </Form.Item>
      <Form.Item label={intl.get('sms.send.time')} name="sendTime" rules={[{ required: true, message: intl.get('sms.send.no.time') }]}>
        <DatePicker
          placeholder={intl.get('sms.send.select.time')}
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={(current) => current && current < moment()}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        />
      </Form.Item>
    </ModalForm>
  );
};

export default CreateCronjob;
