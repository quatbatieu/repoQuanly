import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { Form, Typography, InputNumber, notification, Modal, Button, Row, Col, Card , Grid } from 'antd';
import ScheduleSettingService from 'services/scheduleSettingService';
import "./sheduleConfigStyle.scss";
const { useBreakpoint } = Grid;

function SheduleConfig({
	totalOtherVehicle, totalSmallCar, totalRoMooc, loading, fetchData, SCHEDULE_SETTING_ERROR
}) {
	const { t: translation } = useTranslation()
  const screens = useBreakpoint();
	const [form] = Form.useForm();
	const user = useSelector((state) => state.member)
	const [values, setValues] = useState({
		totalOtherVehicle, totalSmallCar, totalRoMooc
	});
	const [isVisible, setIsVisible] = useState(false);

	const handleFinish = (values) => {
		setIsVisible(true)
		setValues(values);
	};

	const handleOk = () => {
		ScheduleSettingService.saveScheduleSetting({
			id: user.stationsId,
			data: values
		}).then(result => {
			if (result && result.issSuccess) {
				fetchData()
				notification['success']({
					message: '',
					description: translation('scheduleSetting.saveSuccess')
				});
			} else {
				if (Object.keys(SCHEDULE_SETTING_ERROR).includes(result.message)) {
					notification.error({
						message: "",
						description: SCHEDULE_SETTING_ERROR[result.message]
					})
					return;
				}

				notification.error({
					message: "",
					description: translation("scheduleSetting.saveError")
				})

			}
		})
		setIsVisible(false)
	}
	useEffect(() => {
		if (!loading) {
			const newData = { totalSmallCar, totalOtherVehicle, totalRoMooc };
			form.setFieldsValue({ ...newData })
			setValues(newData)
		}
	}, [loading])

	return (
		<Card bodyStyle={{ padding: '16px', height: screens.md ? '200px' : "auto" }}>
			<div className='sheduleConfig'>
				<Form
					labelAlign="left"
					initialValues={values}
					onFinish={handleFinish}
					layout="vertical"
					autoComplete="off"
					form={form}
				>
					<Row gutter={[20, 0]}>
						<Col md={24} xs={24}>
							<Form.Item noStyle>
								<Typography.Paragraph strong>
									{translation("sheduleConfig.total_hour")}
								</Typography.Paragraph>
							</Form.Item>
						</Col>
						<Col md={8} xs={24}>
							<Form.Item
								label={translation("accreditation.car")}
								name="totalSmallCar"
								colon={false}
								rules={[
									{
										required: true,
										message: translation("isReq")
									},
									{
										pattern: /^[0-9]*$/,
										message: translation("scheduleSetting.onlyPositiveIntegersAllowed")
									}
								]}
							>
								<InputNumber placeholder={translation("enterQuantity")} autoFocus />
							</Form.Item>
						</Col>
						<Col md={8} xs={24}>
							<Form.Item
								label={translation("accreditation.Trailers")}
								name="totalRoMooc"
								colon={false}
								rules={[
									{
										required: true,
										message: translation("isReq")
									},
									{
										pattern: /^[0-9]*$/,
										message: translation("scheduleSetting.onlyPositiveIntegersAllowed")
									}
								]}
							>
								<InputNumber placeholder={translation("enterQuantity")} />
							</Form.Item>
						</Col>
						<Col md={8} xs={24}>
							<Form.Item
								label={translation("accreditation.otherVehicles")}
								name="totalOtherVehicle"
								colon={false}
								rules={[
									{
										required: true,
										message: translation("isReq")
									},
									{
										pattern: /^[0-9]*$/,
										message: translation("scheduleSetting.onlyPositiveIntegersAllowed")
									}
								]}
							>
								<InputNumber placeholder={translation("enterQuantity")} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						className='mb-0'
					>
						<Button type="primary" htmlType="submit" className='sheduleConfig_submit'>
							{translation("update")}
						</Button>
					</Form.Item>
				</Form>
				<Modal
					title={translation("sheduleConfig.titleModal")}
					visible={isVisible}
					okText={translation("confirm")}
					cancelText={translation("cancel")}
					onOk={handleOk}
					onCancel={() => setIsVisible(false)}
					bodyStyle={{
						maxWidth: 443,
						borderRadius: 2
					}}
					centered
				>
					<p>
						{translation("sheduleConfig.descModal")}
					</p>
				</Modal>
			</div>
		</Card>
	)
}

export default SheduleConfig;