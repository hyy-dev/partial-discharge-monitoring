import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useModel, useRequest, history } from 'umi';
import { getNotices } from '@/services/ant-design-pro/api';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import {getAlarmsUsingGET7 as getAlarms} from "@/services/api/alarmRecordController";
import {AlarmStatusConfig} from "@/pages/AlarmManage";

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

// 处理notice数据
const getNoticeData = (notices: API.AlarmInfo[]): Record<string, API.NoticeIconItem[]> => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.filter((val) => val.status === 0).map((notice) => {
    const newNotice: API.NoticeIconItem = {
      id: '' + notice.alarmId,
      title: notice.deviceName,
      description: notice.reason,
      extra: AlarmStatusConfig[notice.status].label,
      datetime: notice.createTime,
      status: notice.status,
      type: 'event'
    };

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.createTime as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status !== undefined) {
      const color = AlarmStatusConfig[newNotice.status].color;
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      ) as any;
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData: Record<string, API.NoticeIconItem[]>) => {
  const unreadMsg: Record<string, number> = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // const [notices, setNotices] = useState<API.NoticeIconItem[]>([]);
  const [notices, setNotices] = useState<API.AlarmInfo[]>([]);
  // const { data } = useRequest(getNotices);
  const { data } = useRequest(getAlarms, { formatResult: res => res?.alarms });

  useEffect(() => {
    setNotices(data ?? []);
  }, [data]);

  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  const changeReadState = (id: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  const clearReadState = (title: string, key: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.type === key) {
          notice.read = true;
        }
        return notice;
      }),
    );
    message.success(`${'清空了'} ${title}`);
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={noticeData.event?.length ?? 0}
      onItemClick={(item) => {
        // changeReadState(item.id!);
        history.push(`/alarms?target=${item.id}`)
      }}
      // onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      // clearText="清空"
      viewMoreText="查看更多"
      onViewMore={() => history.push('/alarms')}
      clearClose
    >
      {/*<NoticeIcon.Tab*/}
      {/*  tabKey="notification"*/}
      {/*  count={unreadMsg.notification}*/}
      {/*  list={noticeData.notification}*/}
      {/*  title="通知"*/}
      {/*  emptyText="你已查看所有通知"*/}
      {/*  showViewMore*/}
      {/*/>*/}
      {/*<NoticeIcon.Tab*/}
      {/*  tabKey="message"*/}
      {/*  count={unreadMsg.message}*/}
      {/*  list={noticeData.message}*/}
      {/*  title="消息"*/}
      {/*  emptyText="您已读完所有消息"*/}
      {/*  showViewMore*/}
      {/*/>*/}
      <NoticeIcon.Tab
        tabKey="0"
        title="待处理报警"
        emptyText="你已处理所有报警"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
        showClear={false}
      />
      <></>
    </NoticeIcon>
  );
};

export default NoticeIconView;
