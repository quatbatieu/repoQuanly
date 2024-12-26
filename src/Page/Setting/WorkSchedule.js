import React, { useState, useEffect } from 'react';
import { Table, Switch, Select, Button, notification, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import './workSchedule.scss';
import StationWorkingHoursService from 'services/StationWorkingHoursService';

const hours = [];
for (let i = 0; i < 24; i++) {
  const hourString = i < 10 ? `0${i}` : `${i}`;
  hours.push(`${hourString}:00`, `${hourString}:30`);
}

const WorkSchedule = () => {
  const { t: translation } = useTranslation();
  const [Loading, setLoading] = useState(false);

  const daysOfWeek = ['2', '3', '4', '5', '6', '7', '8'];
  const [result, setResult] = useState([]);
  const [initialEnabledDays, setInitialEnabledDays] = useState(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: false }), {}));
  const [initialTimes, setInitialTimes] = useState(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: { from: '0:00', to: '0:00' } }), {}));
  const [enabledDays, setEnabledDays] = useState(initialEnabledDays);

  const handleTimeChange = (day, type, value) => {
    if (type === "from") {
      updateTimeWork(day, {
        startTime: value
      })
      return;
    }

    updateTimeWork(day, {
      endTime: value
    })
    return;

  };

  const updateTimeWork = (day, data) => {
    const objectTime = result.find((item) => item.dateOfWeek == day);
    StationWorkingHoursService.updateById({
      id: objectTime.stationWorkingHoursId,
      data
    }).then(result => {
      if (result.issSuccess) {
        fetchData(false);
        notification['success']({
          message: '',
          description: translation('scheduleSetting.saveSuccess')
        });
      } else {
        notification.error({
          message: "",
          description: translation("scheduleSetting.saveError")
        });
      }
    });

  }

  const toggleDay = (day, checked) => {
    updateTimeWork(day, {
      enableWorkDay: checked ? 1 : 0
    });
  };

  const columns = daysOfWeek.map(day => ({
    title: translation(`setting.general.${day.charAt(0) + day.slice(1)}`),
    dataIndex: day,
    key: day,
    render: (_, record) => {
      if (record.key === 'summary') {
        const isWorking = enabledDays[day];
        return (
          <span className={isWorking ? 'summary-green' : 'summary-red'}>
            {isWorking ? `${initialTimes[day].from} - ${initialTimes[day].to}` : translation('setting.general.off')}
          </span>
        );
      }
      if (record.key === 'toggle') return <Switch checked={enabledDays[day]} onChange={(checked) => toggleDay(day, checked)} />;
      return (
        <Select
          className={`customSelect ${enabledDays[day] ? '' : 'invisibleDropdown'}`}
          defaultValue="0:00"
          value={record.key === 'from' ? initialTimes[day].from : initialTimes[day].to}
          options={hours.map(hour => ({ value: hour.padStart(2, '0') }))}
          onChange={(value) => handleTimeChange(day, record.key, value)}
        />
      );
    }
  }));

  columns.unshift({
    title: translation('setting.general.workSchedule'),
    dataIndex: 'day',
    key: 'day'
  });

  const fetchData = (allowLoading = true) => {
    if (allowLoading) {
      setLoading(true)
    }

    StationWorkingHoursService.find({}).then(result => {
      setResult(result);
      const newResult = [...result];
      const initialTimesMap = newResult.reduce((acc, item) => {
        const { dateOfWeek, startTime, endTime } = item;
        acc[dateOfWeek] = { from: startTime || '0:00', to: endTime || '0:00' };
        return acc;
      }, {});

      const initialEnabledDaysMap = newResult.reduce((acc, item) => {
        const { dateOfWeek, startTime, endTime } = item;
        acc[dateOfWeek] = item.enableWorkDay;
        return acc;
      }, {});

      setInitialEnabledDays(initialEnabledDaysMap);
      setEnabledDays(initialEnabledDaysMap);
      setInitialTimes(initialTimesMap)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  const dataSource = [
    { key: 'toggle', day: '' },
    { key: 'from', day: translation('setting.general.from') },
    { key: 'to', day: translation('setting.general.to') },
    {
      key: 'summary',
      day: translation('setting.general.workingHours'),
      ...daysOfWeek.reduce((acc, day) => {
        acc[day] = enabledDays[day] ? `${initialTimes[day].from} - ${initialTimes[day].to}` : translation('setting.general.off');
        return acc;
      }, {}),
    }
  ];

  if (Loading) {
    return <Spin />
  }

  return (
    <div className='schedule_setting__table'>
      <Table dataSource={dataSource} columns={columns} pagination={false} rowKey="key" scroll={{ x: 1200 }} />
    </div>
  );
};

export default WorkSchedule;
