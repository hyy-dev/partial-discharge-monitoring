declare namespace API {
    type LoginParams = {
      userName: string;
      password: string;
    };

  type LoginResult = {
    code: number;
    msg: string;
    user?: {
      userId: number;
      roleId: number;
      userName: string;
    };
    token?: string;
  };

    type RegisterParams = {
      userName: string;
      password: string;
      roleId: number;
    }

    type MonitorRecord = {
      deviceId: number;
      qpda: number;
      qpdp: number;
      qsda: number;
      qsdp: number;
      collectedTime: string;
    }

    type DeviceInfo = {
      deviceId: number;
      name: string;
      sortWeight: number;
      type: 0 | 1;
    }

    type getRecordUsingGET7Params = {
      deviceId: number;
      startTime: string;
      endTime: string;
    }

    type getRecordUsingGET7Result = {
        code: number;
        msg: string;
        data: MonitorRecord[];
    }

    type getDevicesResult = {
      code: number;
      msg: string;
      data?: DeviceInfo[];
    }

    type AlarmInfo = {
      alarmId: number;
      content: string;
      createTime: string;
      deviceId: number;
      deviceName: string;
      reason: string;
      results: string;
      status: number; // 0:待处理,1:已解决,2:已忽略,3:未解决
    }

    type LogInfo = {
      alarmId: number;
      userName: string;
      status: number;
      results: string;
      operateTime: string;
      logId: number;
    }
}
