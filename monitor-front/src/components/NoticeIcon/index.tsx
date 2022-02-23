import React from 'react';
import { Tag } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useRequest, history } from 'umi';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { getAlarmsUsingGET7 as getAlarms } from '@/services/api/alarmRecordController';
import { AlarmStatusConfig } from '@/pages/AlarmManage';

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

  const newNotices = notices
    .sort((a, b) => a.status - b.status)
    .map((notice) => {
      const newNotice: API.NoticeIconItem = {
        id: '' + notice.alarmId,
        title: notice.deviceName,
        description: notice.reason,
        extra: AlarmStatusConfig[notice.status].label,
        datetime: notice.createTime,
        status: notice.status,
        read: notice.status !== 0,
        type: 'event',
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
  const { data: notices } = useRequest(getAlarms, {
    formatResult: (res) => {
      const alarms = res?.alarms ?? [];
      const result: API.AlarmInfo[] = [];
      alarms.forEach((alarm) => {
        if (result.findIndex((val) => val.deviceId == alarm.deviceId) === -1) {
          result.push(alarm);
        }
      });
      return result;
    },
    pollingInterval: 60 * 1000,
  });

  const noticeData = getNoticeData(notices ?? []);
  const unreadMsg = getUnreadData(noticeData || {});

  return (
    <NoticeIcon
      className={styles.action}
      count={noticeData.event?.filter((val) => val.status === 0).length ?? 0}
      onItemClick={(item) => {
        // changeReadState(item.id!);
        history.push(`/alarms?target=${item.id}`);
      }}
      // onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      // clearText="清空"
      viewMoreText="查看更多"
      onViewMore={() => history.push('/alarms')}
      clearClose
    >
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
