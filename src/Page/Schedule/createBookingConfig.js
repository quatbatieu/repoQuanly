import React from 'react'
import {
  Form,
  Button,
  Input,
  Modal,
  notification,
  Switch,
  InputNumber
} from "antd";
import InspectionProcessService from 'services/inspectionProcessService';

function CreateBookingConfig(props) {
  const {translation,isModalVisible,onCancel,handleCreateNew} = props

  const [form] = Form.useForm()
  const handleChange = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/[^\w-]/g, ''); // Loại bỏ tất cả các ký tự đặc biệt trừ dấu "-"
    form.setFieldsValue({ time: filteredValue });
  };
  return (
    <>
      <div>
        hiện thân
      </div>
      <Modal
        visible={isModalVisible}
        title={translation('addHour')}
        onCancel={onCancel}
        width={800}
        footer={
          <>
            <Button
              onClick={onCancel}
            >
              {translation("category.no")}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                form.submit()
              }}
            >
              {translation('listSchedules.save')}
            </Button>
          </>
        }
      >
        <Form
          form={form}
          onFinish={handleCreateNew}
          layout="vertical"
          onValuesChange={(values) => {
            if (values.customerRecordPlatenumber) {
              form.setFieldsValue({
                customerRecordPlatenumber: values.customerRecordPlatenumber.toUpperCase()
              })
            }
          }}
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Item
                name="time"
                label={translation('bookingConfig.time')}
                rules={[
                  {
                    required: true,
                    message: translation("bookingConfig.timeRequired")
                  }
                ]}
              >
                <Input onChange={handleChange} placeholder={translation('bookingConfig.time')} autoFocus />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
              <Form.Item
                name="limitSmallCar"
                label={translation('bookingConfig.limitSmallCar')}
                rules={[
                  {
                    required: true,
                    message: translation('accreditation.isRequire')
                  }
                ]}
              >
                <InputNumber min={1} placeholder={translation('bookingConfig.limitSmallCar')} />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
              <Form.Item
                name="limitRoMooc"
                label={translation('bookingConfig.limitRoMooc')}
                rules={[
                  {
                    required: true,
                    message: translation('accreditation.isRequire')
                  }
                ]}
              >
                <InputNumber min={1} placeholder={translation('bookingConfig.limitRoMooc')} />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
              <Form.Item
                name="limitOtherVehicle"
                label={translation('bookingConfig.limitOtherVehicle')}
                rules={[
                  {
                    required: true,
                    message: translation('accreditation.isRequire')
                  }
                ]}
              >
                <InputNumber min={1} placeholder={translation('bookingConfig.limitOtherVehicle')} />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
            <Form.Item 
              label={translation('bookingConfig.enableBooking')} 
              name='enableBooking'
            >
              <Switch />
            </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default CreateBookingConfig