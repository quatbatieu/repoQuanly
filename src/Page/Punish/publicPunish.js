import { Button, Form, Input, notification } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoginService from 'services/loginService'
import './punish.scss'

function PublicPunish() {
  const { t: translation } = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  function handleFind(values) {
    setLoading(true)
    error && setError('')
    LoginService.getDetailPunish(values).then(result => {
      if(result) {
        setData(result)
      } else {
        data.length > 0 && setData([])
        notification.error({
          message: "",
          description: translation('landing.error')
        })
        setError(translation('management.none'))
      }
      setLoading(false)
    })
  }

  return (
    <>
    {
      loading && <div className='d-flex justify-content-center'>
        <div className="loader"/>
      </div> 
    }
    <main className='punish_container row'>
      <div className='punish_container__center_block col-12 col-md-12 col-lg-8 col-xl-8'>
        <div className='punish_container__center_block_title'>{translation('header.punish')}</div>
        <Form onFinish={handleFind}>
          <Form.Item
            name="plateNumber"
            rules={[{
              required: true,
              message: translation('listCustomers.invalidContent')
            }]}
          >
            <Input className='custom-width' placeholder={translation('accreditation.licensePlates')}/>
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary'>{translation('landing.search')}</Button>
          </Form.Item>
        </Form>
        <div className='punish_container__center_block_result'>
          <div className='row'>
          {
            data && data.length > 0 ? data.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <div className='col-5'>{item.label}:</div>
                  <div className='col-7'>{item.value}</div>
                  {(index !== 0 && index % 8) === 0 && <hr />}
                </React.Fragment>
              )
            }) : (
              <div className='error'>{error}</div>
            )
          }
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

export default PublicPunish