import React from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Drawer, Form, Input, InputNumber, Modal, Radio, Select, Spin, Upload } from 'antd';
import { optionVehicleType } from "constants/vehicleType";
import { validatorPlateNumber } from "helper/licensePlateValidator";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconCar } from "../../assets/icons";
import uploadService from '../../services/uploadService';
import { optionVehicleFuelType } from "constants/vehicleType";
import ModalEditNameFile from "./ModalEditNameFile";
import { VEHICLE_FILE_TYPE } from "constants/vehicleType";
import "./modalAddVehicleRecords.scss";
import { getVehicleProfile } from "constants/errorMessage";
import { PopupHeaderContainer } from "components/PopupHeader/PopupHeader";
import { CloseOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

const ModalAddVehicleRecords = (props) => {
	const { isAdd, toggleAddModal, onCrateNew, form, inputRef } = props
	const [ckeditor, setCkeditor] = useState()
	const [isLoading, setIsLoading] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [indexEditModalName, setIndexEditModalName] = useState(null);
	const [openEditModalName, setOpenEditModalName] = useState(false);
	const [ckeditorWordCount, setWordcount] = useState(0)
	const { t: translation } = useTranslation();
	const [fileList, setFileList] = useState([]);
	const listVehicleType = optionVehicleType(translation);

	const optionsColor = [
		{
			value: "WHITE",
			lable: <div className="accreditation__parent">
				{translation("accreditation.white")}
				<IconCar className=" accreditation__circle-white" />
			</div>
		},
		{
			value: "BLUE",
			lable: <div className="accreditation__parent">
				{translation("accreditation.blue")}
				<IconCar className=" accreditation__circle-blue" />
			</div>
		},
		{
			value: "YELLOW",
			lable: <div className="accreditation__parent">
				{translation("accreditation.yellow")}
				<IconCar className=" accreditation__circle-yellow" />
			</div>
		}
	]

	const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = async function () {
			let baseString = reader.result

			const params = {
				imageData: baseString.replace('data:' + file.type + ';base64,', ''),
				imageFormat: file.name.split('.').pop().toLowerCase()
			}
			const res = await uploadService.uploadImage(params);

			if (res.issSuccess) {
				onSuccess(res.data); // Gọi hàm onSuccess với đường dẫn URL của hình ảnh từ phản hồi của server
			} else {
				onError({
					message: "Status : " + res.statusCode
				}); // Thông điệp lỗi cụ thể
			}
		}
	};
	
	function isImageFile(fileName) {
		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Danh sách đuôi tập tin hình ảnh phổ biến

		const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
		return imageExtensions.includes(fileExtension);
	}

	async function handleCreateNew(values) {
		setIsLoading(true);
		const newData = {
			...values,
			fileList: values.fileList?.fileList?.map(item => ({
				vehicleFileUrl: item.response,
				vehicleFileName: item.name,
				vehicleFileType: isImageFile(item.name) ? VEHICLE_FILE_TYPE.IMAGE : VEHICLE_FILE_TYPE.DOCUMENT
			})) || null,
			vehicleForBusiness: values.vehicleForBusiness ? 1 : 0, // boolean
			equipCruiseControlDevice: values.equipCruiseControlDevice ? 1 : 0, // boolean
			equipDashCam: values.equipDashCam ? 1 : 0, // boolean
			vehicleForRenovation: values.vehicleForRenovation ? 1 : 0, // boolean
			vehicleForNoStamp: values.vehicleForNoStamp ? 1 : 0 // boolean
		}
		Object.keys(newData).forEach(k => {
			if (!newData[k] && newData[k] !== 0) {
				delete newData[k]
			}
		})

		onCrateNew(newData, () => {
			setIsLoading(false);
		});
	}

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		// setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};

	const handleCancel = () => setPreviewOpen(false);

	useEffect(() => {
		form.resetFields();
	}, []);

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8,
				}}
			>
				{translation('vehicleRecords.file')}
			</div>
		</div>
	);

	const handleChangeName = (value, index) => {
		setFileList(prev => {
			prev[index].name = value;
			return prev;
		})
		setOpenEditModalName(false);
	}

	return (
		<Drawer
			visible={isAdd}
			className="drawerManagement"
			title={
				<PopupHeaderContainer
					screenHeaderTitle={translation('vehicleRecords.titleAdd')}
					onCloseButtonClick={toggleAddModal}
				/>
			}
			closable={false}
			onClose={toggleAddModal}
			width="100vw"
			footer={
				<div className="d-flex w-100 justify-content-end">
					<Button
						onClick={toggleAddModal}
						className="mx-1"
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
				</div>
			}
		>
			<Form
				form={form}
				onFinish={handleCreateNew}
				layout="vertical"
				onValuesChange={(changedValue) => {
					// Nếu có fields trong Array này . thì nó sẽ In Hoa khi Onchange
					const FieldsUpperCase = [
						"vehicleRegistrationCode", "vehiclePlateNumber", "vehicleBrandModel",
						"chassisNumber", "vehicleTires", "engineNumber"
					];
					const key = Object.keys(changedValue)[0];
					if (FieldsUpperCase.some(item => key === item)) {
						form.setFieldsValue({
							[key]: changedValue[key].toUpperCase()
						})
					}
				}}
			>
				{isLoading ? (
					<Spin />
				) : (
					<div className="row">
						<div className="col-12 col-md-12 col-lg-4">
							<h3 className="management-title">{translation('vehicleRecords.vehicle')}</h3>
							<div className="row">
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehiclePlateNumber"
										label={translation('vehicleRecords.license-plates')}
										rules={[
											{
												required: true,
												validator(_, value) {
													return validatorPlateNumber(value, translation);
												}
											}
										]}
									>
										<Input placeholder={translation('vehicleRecords.license-plates')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehiclePlateColor"
										label={translation('vehicleRecords.licensePlateColorLabel')}
										rules={[{ required: true, message: translation('isReq') }]}
									>
										<Radio.Group className="licensePlateColor">
											{optionsColor.map((color, _) => {
												return (
													<Radio key={color.value} value={color.value}>{color.lable}</Radio>
												)
											})}
										</Radio.Group>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleType"
										label={translation('vehicleRecords.vehicleType')}
									>
										<Select
											size='middle'
											placeholder={translation('landing.select-vehicleType')}
											options={listVehicleType}
										/>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleRegistrationCode"
										label={translation('vehicleRecords.managementNumber')}
									>
										<Input placeholder={translation('vehicleRecords.managementNumber')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleBrandModel"
										label={translation('vehicleRecords.typeNumber')}
									>
										<Input placeholder={translation('vehicleRecords.typeNumber')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="chassisNumber"
										label={translation('vehicleRecords.chassisNumber')}
										rules={[
											{
												min: 10,
												max: 20,
												message: translation('validate.stringLength', {
													min: 10,
													max: 20
												}),
											},
										]}
									>
										<Input placeholder={translation('vehicleRecords.chassisNumber')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="engineNumber"
										label={translation('vehicleRecords.engineNumber')}
										rules={[
											{
												min: 10,
												max: 20,
												message: translation('validate.stringLength', {
													min: 10,
													max: 20
												}),
											},
										]}
									>
										<Input placeholder={translation('vehicleRecords.engineNumber')} />
									</Form.Item>
								</div>

								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleForBusiness"
										valuePropName="checked"
									>
										<Checkbox>{translation('vehicleRecords.transportationBusiness')}</Checkbox>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleForRenovation"
										valuePropName="checked"
									>
										<Checkbox>{translation('vehicleRecords.renovation')}</Checkbox>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="equipCruiseControlDevice"
										valuePropName="checked"
									>
										<Checkbox>{translation('vehicleRecords.monitoringDevice')}</Checkbox>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="equipDashCam"
										valuePropName="checked"
									>
										<Checkbox>{translation('vehicleRecords.cameraEquipped')}</Checkbox>
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleForNoStamp"
										valuePropName="checked"
									>
										<Checkbox>{translation('vehicleRecords.noInspectionSticker')}</Checkbox>
									</Form.Item>
								</div>

								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleNote"
										label={translation('vehicleRecords.note')}
									>
										<Input.TextArea
											placeholder={translation('vehicleRecords.note')}
											autoSize={{
												minRows: 3,
												maxRows: 10,
											}}
											onBlur={(e) => {
												e.target.value = e.target.value.trim();
												form.setFieldsValue({ vehicleNote: e.target.value.trim() })
											}}
										/>
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-12 col-lg-4">
							<h3 className="management-title">{translation('vehicleRecords.specifications')}</h3>
							<div className="row">
								{/* Bánh xe */}
								<div className="col-12 col-md-12">
									<Form.Item
										name="wheelFormula"
										label={translation('vehicleRecords.wheelFormula')}
									>
										<Input placeholder={translation('vehicleRecords.wheelFormula')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="wheelTreat"
										label={translation('vehicleRecords.wheelTrack')}
									>
										<Input placeholder={translation('vehicleRecords.wheelTrack')} />
									</Form.Item>
								</div>
								{/* Kích thước */}
								<div className="col-12 col-md-12">
									<Form.Item
										name="overallDimension"
										label={translation('vehicleRecords.overallDimensions')}
									>
										<Input placeholder={translation('vehicleRecords.overallDimensions')} />
									</Form.Item>
								</div>

								<div className="col-12 col-md-12">
									<Form.Item
										name="truckDimension"
										label={translation('vehicleRecords.cargoDimensions')}
									>
										<Input placeholder={translation('vehicleRecords.cargoDimensions')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="wheelBase"
										label={translation('vehicleRecords.wheelbase')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 9999999999,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "9.999.999.999",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.wheelbase')} />
									</Form.Item>
								</div>
								{/* Khối lượng */}
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleWeight"
										label={translation('vehicleRecords.unladenWeight')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 1000000,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "1.000.000",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.unladenWeight')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleGoodsWeight"
										label={translation('vehicleRecords.authorizedPayload')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 1000000,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "1.000.000",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.authorizedPayload')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleTotalWeight"
										label={translation('vehicleRecords.authorizedTotalWeight')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 1000000,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "1.000.000",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.authorizedTotalWeight')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleTotalMass"
										label={translation('vehicleRecords.authorizedTowedMass')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 1000000,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "1.000.000",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.authorizedTowedMass')} />
									</Form.Item>
								</div>
								{/* Mô tả */}
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleSeatsLimit"
										label={translation('vehicleRecords.seatingCapacity')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 100,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "100",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.seatingCapacity')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleFootholdLimit"
										label={translation('vehicleRecords.vehicleFootholdLimit')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 100,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "100",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.vehicleFootholdLimit')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleBerthLimit"
										label={translation('vehicleRecords.vehicleBerthLimit')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 100,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "100",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.vehicleBerthLimit')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleFuelType"
										label={translation('vehicleRecords.fuelType')}
									>
										<Select
											size='middle'
											placeholder={translation('vehicleRecords.select-vehicleFuelType')}
											options={optionVehicleFuelType(translation)}
										/>
									</Form.Item>
								</div>
								{/* Động cơ */}
								<div className="col-12 col-md-12">
									<Form.Item
										name="engineDisplacement"
										label={translation('vehicleRecords.engineDisplacement')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 9999999999,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "9.999.999.999",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.engineDisplacement')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="revolutionsPerMinute"
										label={translation('vehicleRecords.maxOutput')}
										rules={[
											{
												type: 'number',
												min: 0,
												max: 9999999999,
												transform: (value) => (value ? Number(value) : undefined),
												message: translation('validate.numberLength' , {
													min: "0",
													max: "9.999.999.999",
												}),
											},
										]}
									>
										<InputNumber placeholder={translation('vehicleRecords.maxOutput')} />
									</Form.Item>
								</div>
								<div className="col-12 col-md-12">
									<Form.Item
										name="vehicleTires"
										label={translation('vehicleRecords.tireSize')}
									>
										<Input.TextArea
											placeholder={translation('vehicleRecords.tireSize')}
											autoSize={{ minRows: 2, maxRows: 10 }}
										/>
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-12 col-lg-4">
							<h3 className="management-title">{translation('vehicleRecords.image')}</h3>
							<div className="row">
								{!openEditModalName && (
									<div className="col-12 col-md-12 vehicleRecords-upload">
										<Form.Item
											name="fileList"
											rules={[]}
										>
											<Upload
												accept="image/png, image/jpeg"
												showUploadList={true}
												customRequest={customRequest}
												multiple={true}
												onChange={(info) => setFileList(info.fileList)}
												onPreview={handlePreview}
												defaultFileList={fileList}
												listType="picture-card"
												itemRender={(originNode, UploadFile, fileList) => {
													const index = fileList.findIndex((item) => item.uid === UploadFile.uid);
													return (
														<>
															{originNode}
															{/* <div className="mt-2">
																<Button onClick={() => {
																	setIndexEditModalName(index);
																	setOpenEditModalName(true);
																}}
																	type="primary"
																	icon={<EditOutlined />}
																	className="align-items-center d-flex"
																>
																	{translation('vehicleRecords.changeName')}
																</Button>
															</div> */}
														</>
													)
												}}
											>
												{fileList.length >= 8 ? null : uploadButton}
											</Upload>
										</Form.Item>
									</div>
								)}
								<Modal visible={previewOpen} className="modalClose" title={previewTitle} bodyStyle={{ padding : 30 }} footer={null} onCancel={handleCancel}>
									<img
										alt="example"
										style={{
											width: '100%',
										}}
										src={previewImage}
									/>
								</Modal>
							</div>
						</div>
						{openEditModalName && (
							<ModalEditNameFile
								open={openEditModalName}
								setOpen={setOpenEditModalName}
								file={fileList[indexEditModalName]}
								onChangeName={(value) => handleChangeName(value, indexEditModalName)}
							/>
						)}
					</div>
				)}
			</Form>
		</Drawer >
	)
}

export default ModalAddVehicleRecords;