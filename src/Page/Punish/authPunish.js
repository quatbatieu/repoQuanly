import { Button, Input, Table, List, Typography, Row, Col } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoginService from 'services/loginService'
import './punish.scss'
import { convertDateToDisplayFormat } from 'helper/date'


const InformationFined = (props) => {
  const { t: translation } = useTranslation()

  const { customerRecordPlatenumber, crimeRecordTime, crimeRecordLocation,
    crimeRecordStatus, crimeRecordPIC,
    } = props;
  return (
    <div className='informationFined'>
      <div className='row gy-4'>
        <div className='col-3'>
          <Typography.Paragraph strong>{translation('BKS')} :</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{customerRecordPlatenumber}</Typography.Paragraph>
        </div>
        {/* <div className='col-3'>
          <Typography.Paragraph strong >Màu biển:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{specs}</Typography.Paragraph>
        </div> */}
        {/* <div className='col-3'>
          <Typography.Paragraph strong >Loại phương tiện:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{vehicleType}</Typography.Paragraph>
        </div> */}
        <div className='col-3'>
          <Typography.Paragraph strong >{translation('landing.violationTime')}:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{convertDateToDisplayFormat(crimeRecordTime)}</Typography.Paragraph>
        </div>
        <div className='col-3'>
          <Typography.Paragraph strong >{translation('landing.violationLocation')}:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{crimeRecordLocation}</Typography.Paragraph>
        </div>
        <div className='col-3'>
          <Typography.Paragraph strong >{translation('landing.status')}:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{crimeRecordStatus}</Typography.Paragraph>
        </div>
        <div className='col-3'>
          <Typography.Paragraph strong >{translation('landing.violationDetectionUnit')}:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{crimeRecordPIC}</Typography.Paragraph>
        </div>
        {/* <div className='col-3'>
          <Typography.Paragraph strong >Nơi giải quyết vụ việc:</Typography.Paragraph>
        </div>
        <div className='col-9'>
          <Typography.Paragraph>{contactAddress}</Typography.Paragraph>
        </div> */}
      </div>
    </div>
  )
}

function AuthPunish({
  plateNumber
}) {
  const { t: translation } = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [licensePlates, setLicensePlates] = useState(plateNumber || "")

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: translation('punish.plateId'),
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
    },
    {
      title: translation('punish.plateType'),
      dataIndex: 'specs',
      key: 'specs',
    },
    {
      title: translation('punish.plateType'),
      dataIndex: 'specs',
      key: 'specs',
    },
    {
      title: translation('punish.time'),
      dataIndex: 'violationTime',
      key: 'violationTime',
    },
    {
      title: translation('punish.address'),
      dataIndex: 'violationAddress',
      key: 'violationAddress',
    },
    {
      title: translation('punish.phone'),
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    }
  ];


  useEffect(() => {
    if (plateNumber) {
      handleFind()
    }
  }, [])

  function handleFind() {
    setLoading(true)
    error && setError('')
    LoginService.getDetailPunish({
      filter:{
        customerRecordPlatenumber: licensePlates
      }
    }).then(result => {
      if (result?.data && result?.data?.length > 0) {
        setData(result?.data)
      } else {
        data.length > 0 && setData([])
        setError(translation('noneResult'))
      }
      setLoading(false)
    })
  }

  return (
    <main className='row'>
      <div className='punish_container__center_block_title'>{translation('header.punish')}</div>

      <div className='d-flex justify-content-center mb-3'>
        <div className='row w-100'>
          <div className='col-2' />
          <div className='col-12 col-sm-8'>
            <div className='punish_container_box'>
              <div className='punish_container_input'>
                <Input
                  placeholder={`${translation('landing.license-plates')} (${translation("example")}: 30A38573)`}
                  value={licensePlates}
                  onChange={(e) => setLicensePlates(e.target.value)}
                  onPressEnter={!loading && handleFind}
                />
              </div>
              <div className=''>
                <Button disabled={loading} onClick={handleFind} type='primary'>{translation('landing.search')}</Button>
              </div>
            </div>
          </div>
          <div className='col-2' />
        </div>
      </div>

      <div>
        <div className='row'>
          {
            loading && <div className='d-flex justify-content-center'>
              <div className="loader" />
            </div>
          }
          {
            data && data.length > 0 ? (
              <>
                <div className='punish_container_test_results' >{translation("resultPunish")}</div>
                {data.map((item) => (
                  <InformationFined {...item} />
                ))}
              </>
            ) : (
              <div className='text-center'>{error}</div>
            )

          }
        </div>
      </div>
    </main>
  )
}

export default AuthPunish