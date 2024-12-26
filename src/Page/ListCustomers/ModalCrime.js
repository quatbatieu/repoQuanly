import React, { useEffect, useState } from 'react'
import { Button, Descriptions, Modal, Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import LoginService from 'services/loginService'
import moment from 'moment'
import { convertDateToDisplayFormat } from 'helper/date'

const DATE_TIME_FORMAT = 'HH:mm, DD/MM/YYYY'

const getTableColumns = (translation) => [
  {
    title: translation('punish.time'),
    dataIndex: 'crimeRecordTime',
    key: 'crimeRecordTime',
    width: 135,
    sorter: (a, b) =>
      moment(a.crimeRecordTime).isAfter(
        moment(b.crimeRecordTime)
      ),
    render: (time) => convertDateToDisplayFormat(time)
  },
  {
    title: translation('punish.address'),
    dataIndex: 'crimeRecordLocation',
    key: 'crimeRecordLocation',
    width: 135,
  },
  {
    title: translation('punish.behavior'),
    dataIndex: 'crimeRecordContent',
    key: 'crimeRecordContent',
  },
  {
    title: translation('punish.status'),
    dataIndex: 'crimeRecordStatus',
    key: 'crimeRecordStatus',
    width: 120,
  },
  {
    title: translation('punish.provider'),
    dataIndex: 'crimeRecordPIC',
    key: 'crimeRecordPIC',
    width: 200,
  },
  {
    title: translation('punish.phone'),
    dataIndex: 'crimeRecordContact',
    key: 'crimeRecordContact',
    width: 110,
  },
]

export const ModalCrime = (props) => {
  const { plateNumber, onClose } = props
  const { t: translation } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState([])

  function handleFind() {
    setLoading(true)
    error && setError('')
    LoginService.getDetailPunish({
      filter:{
        customerRecordPlatenumber: plateNumber
      }
    }).then((result) => {
      if (result?.data && result?.data.length > 0) {
        setData(result?.data)
      } else {
        data.length > 0 && setData([])
        setError(translation('management.none'))
      }
      setLoading(false)
    })
  }
  useEffect(() => {
    handleFind()
  }, [])

  return (
    <Modal
      visible
      title={translation('punish.title')}
      onCancel={onClose}
      width='100vw'
      footer={null}
      wrapClassName='punish_modal--root'
    >
      <Descriptions>
        <Descriptions.Item label={translation('punish.plateId')}>
          <Typography.Text strong>{plateNumber}</Typography.Text>
        </Descriptions.Item>
        {/* {data.length && (
          <Descriptions.Item label={translation('punish.plateType')}>
            <Typography.Text strong>{data[0].specs}</Typography.Text>
          </Descriptions.Item>
        )} */}
      </Descriptions>
      <Table
        columns={getTableColumns(translation)}
        dataSource={data}
        loading={loading}
        size='small'
        scroll={{ x: 1200 }}
        pagination={{ hideOnSinglePage: true, defaultPageSize: 10,simple:true, }}
        locale={{
          emptyText: loading
            ? translation('punish.loading')
            : translation('management.none'),
          filterEmptyText: translation('management.none'),
        }}
        bordered
      />
    </Modal>
  )
}
