import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Drawer, Button, Card, Typography, Pagination, Modal, Input, notification, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MessageFilter from './MessageFilter';
import "./selectTemplate.scss";
import { useTranslation } from 'react-i18next';
import MessageCustomerMarketingService from 'services/MessageCustomerMarketingService';
import apnsImage from '../../assets/new-icons/sms/apns.jpg';
import gmailImage from '../../assets/new-icons/sms/gmail.jpg';
import zaloImage from '../../assets/new-icons/sms/zalo.jpg';
import smsImage from '../../assets/new-icons/sms/sms.jpg';
import smsCskhImage from '../../assets/new-icons/sms/sms-cskh.jpg';
import { PopupHeaderContainer } from 'components/PopupHeader/PopupHeader';
import { getMessageCustomerMarketingError } from 'constants/errorMessage';
import { getTranslationKeys } from 'constants/sms';
import Handlebars from 'handlebars';
import TabPane from 'antd/lib/tabs/TabPane';
import { useSelector } from 'react-redux';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';

const { Title, Text } = Typography;

const messageTypeToImage = {
	'': 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80',
	'SMS_CSKH': smsCskhImage,
	'ZALO_CSKH': zaloImage,
	'APNS': apnsImage,
	'EMAIL': gmailImage,
	'SMS_PROMOTION': smsImage,
	'ZALO_PROMOTION': zaloImage
};

const MessageCard = ({ template, isActive, onTemplateClick }) => {
	const { t: translation } = useTranslation();
	const [visible, setVisible] = React.useState(false);
	const [phone, setPhone] = useState('')
	const MESSAGE_CUMTOMER_MARKETING_ERROR = getMessageCustomerMarketingError(translation);

	const handleButtonClick = () => {
		setVisible(true);
	};

	const handleSendTestTemplateSMS = (phone) => {
		MessageCustomerMarketingService.sendTestSMS({
			customerMessageTemplateId: template.messageTemplateId,
			customerMessagePhone: phone
		}).then(async (result) => {
			;
			if (result.isSuccess) {
				notification["success"]({
					message: "",
					description: translation("sms.messageSuccess"),
				});
				setVisible(false);
				return;
			}

			if (Object.keys(MESSAGE_CUMTOMER_MARKETING_ERROR).includes(result.error)) {
				notification["error"]({
					description: MESSAGE_CUMTOMER_MARKETING_ERROR[result.error],
				});
				return;
			}

			notification["error"]({
				description: translation('listCustomers.customerMarketingError.errorExists'),
			});
			return;
		})
	};

	const handleSendTestTemplateZalo = (phone) => {
		MessageCustomerMarketingService.sendTestZNS({
			customerMessageTemplateId: template.messageTemplateId,
			customerMessagePhone: phone
		}).then(async (result) => {
			if (result.isSuccess) {
				notification["success"]({
					message: "",
					description: translation("sms.messageSuccess"),
				});
				setVisible(false);
				return;
			}

			if (Object.keys(MESSAGE_CUMTOMER_MARKETING_ERROR).includes(result.error)) {
				notification["error"]({
					message: "",
					description: MESSAGE_CUMTOMER_MARKETING_ERROR[result.error],
				});
				return;
			}

			notification["error"]({
				message: "",
				description: translation('listCustomers.customerMarketingError.errorExists'),
			});
			return;
		})
	}

	const handleDataSubmit = () => {
		setVisible(false)
		if (template.messageTemplateType.includes("SMS")) {
			handleSendTestTemplateSMS(phone);
			return
		}

		if (template.messageTemplateType.includes("ZALO") || template.messageTemplateType.includes("ZNS")) {
			handleSendTestTemplateZalo(phone);
			return;
		}
	};

	function decodeHtmlEntities(encodedString) {
		const textArea = document.createElement('textarea');
		textArea.innerHTML = encodedString;
		return textArea.value;
	}

	const templateContentHTML = useMemo(() => {
		const translationKeys = getTranslationKeys(translation);
		const translations = {
			"vehiclePlateNumber": `<b>{{${translationKeys.vehiclePlateNumber}}}</b>`,
			"customerRecordCheckExpiredDate": `<b>{{${translationKeys.customerRecordCheckExpiredDate}}}</b>`,
			"stationCode": `<b>{{${translationKeys.stationCode}}}</b>`,
			"stationsAddress": `<b>{{${translationKeys.stationsAddress}}}</b>`,
			"stationsHotline": `<b>{{${translationKeys.stationsHotline}}}</b>`,
			"customerRecordPlatenumber": `<b>{{${translationKeys.customerRecordPlatenumber}}}</b>`,
			"stationsName": `<b>{{${translationKeys.stationsName}}}</b>`
		};

		const templateConvert = Handlebars.compile(
			template.messageTemplateContent
		);

		let messageTemplateContent = template.messageTemplateContent
		const content = templateConvert(translations);
		const decodedContent = decodeHtmlEntities(content);
		return decodedContent;

	}, [template])

	return (
		<Card className={`message-card ${isActive ? 'active' : ''}`} bordered={true} hoverable bodyStyle={{ padding: 16 }}>
			<div className="message-card__boxImage">
				<img
					src={messageTypeToImage[template.messageTemplateType || ""] || 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80'}
					alt={template.messageTemplateName}
					className="message-card__image"
				/>
			</div>
			<div className="message-card__content">
				<Title level={4} className="message-card__title" ellipsis={{ rows: 2, expandable: false }}>{template.messageTemplateName}</Title>
				<Text strong className="message-card__price">{template.messageTemplatePrice || 0} {translation('listCustomers.sendMessageModal.costPerMessage')}</Text>
			</div>
			<div className="message-actions">
				<Button disabled={!template.messageTemplateEnabled} onClick={handleButtonClick}>{translation('listCustomers.sendMessageModal.trySending')}</Button>
				<Button type={"primary"} disabled={!template.messageTemplateEnabled} onClick={() => onTemplateClick(template)}>{translation('listCustomers.sendMessageModal.chooseTemplate')}</Button>
			</div>
			{visible && (
				<Modal
					title={translation('listCustomers.sendMessageModal.title')}
					visible={visible}
					onOk={handleDataSubmit}
					onCancel={() => setVisible(false)}
					okText={translation('listCustomers.sendMessageModal.send')}
					cancelText={translation('listCustomers.sendMessageModal.cancel')}
				>
					<div className="template-message-section mb-2">
						<Title level={5} className='title-small'>{translation('listCustomers.importListModal.templateMessageTitle')}</Title>
						<Text className='text-small'>{translation('listCustomers.importListModal.descriptionText')}</Text>
						<Card className="template-content mt-2" bordered={true} bodyStyle={{ padding: '16px' }}>
						  {template.messageDemo}
						</Card>
					</div>
					<p>{translation('listCustomers.sendMessageModal.enterPhoneNumber')}</p>
					<Input onChange={(e) => { setPhone(e.target.value) }}/>
				</Modal>
			)}
		</Card>
	);
};

const PhoneMockup = ({ selectedTemplate }) => {
	return (
		<div className="phone-mockup">
			<img src="/assets/images/templatePhone.jpg" alt="Phone" className="phone-image" />
		</div>
	);
};
const POPULAR = "#popular"
const ALL = "#all"
const SendMessageDrawer = ({ isSendMessageDrawer, setIsSendMessageDrawer, onTemplateClick }) => {
	const { t: translation } = useTranslation();
  const [activeKey, setActiveKey] = useState(POPULAR)
  const {stationsId} = useSelector(
    (state) => state.member
  );
	const [data, setData] = useState({
		total: 0,
		data: []
	});

	const [filter, setFilter] = useState({
		filter: {
			messageTemplateType: undefined,
			stationsId: [ stationsId ]
		},
		limit: 8,
		skip: 0
	});

	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const handleTemplateClick = (template) => {
		setSelectedTemplate(template);
	};

	const handleFilter = (value) => {
		if(activeKey == POPULAR){
			if (value) {
				const newFilter = {
					...filter,
					filter: {
						messageTemplateType: value,
						stationsId: [ stationsId ]
					}
				}
				newFilter.skip = 0;
				setFilter(newFilter);
				fetchData(newFilter);
			} else {
				const newFilter = {
					...filter,
					filter: {
						messageTemplateType: undefined,
						stationsId: [ stationsId ]
					}
				}
				newFilter.skip = 0;
				setFilter(newFilter);
				fetchData(newFilter);
			}
		}else{
			if (value) {
				const newFilter = {
					...filter,
					filter: {
						messageTemplateType: value,
						stationsId: [ null ]
					}
				}
				newFilter.skip = 0;
				setFilter(newFilter);
				fetchData(newFilter);
			} else {
				const newFilter = {
					...filter,
					filter: {
						messageTemplateType: undefined,
						stationsId: [ null ]
					}
				}
				newFilter.skip = 0;
				setFilter(newFilter);
				fetchData(newFilter);
			}
		}
	}

	const fetchData = (filter) => {
		MessageCustomerMarketingService.findTemplates(filter).then((result) => {
			if (result) {
				setData({
					data: result.templates,
					total: result.total
				});
			}
		});
	}

	// const handlePageChange = (page, pageSize) => {
	// 	const newSkip = (page - 1) * pageSize;
	// 	const newFilter = {
	// 		...filter,
	// 		skip: newSkip,
	// 		limit: pageSize
	// 	}
	// 	setFilter(newFilter);
	// 	fetchData(newFilter);
	// };

	const handleChangePage = (pageNum) => {
		const newFilter = {
		  ...filter,
		  skip : (pageNum -1) * filter.limit
		}
		setFilter(newFilter)
		fetchData(newFilter)
	}

	useEffect(() => {
		fetchData(filter);
	}, []);
	useEffect(() => {
		if(activeKey == POPULAR){
			let newFilter = {
				...filter,
				filter: {
					stationsId: [ stationsId ]
				},
				skip:0
			}
			filter.skip=0
			setFilter(newFilter);
			fetchData(newFilter);
		}else{
			let newFilter={
				filter: {
					messageTemplateType: undefined,
					stationsId: [ null ]
				},
				limit: 8,
				skip: 0
			}
			setFilter(newFilter);
			fetchData(newFilter);
		}
	}, [activeKey]);
	const Templete=(data)=>{
		return(
			<>
				<div className="message-content">
					<Typography.Title level={2}>{translation('listCustomers.sendMessageModal.selectTemplateHeader')}</Typography.Title>
					<Typography.Paragraph>
						{translation('listCustomers.sendMessageModal.selectTemplateDescription')}
					</Typography.Paragraph>
					<MessageFilter selectedItem={filter.filter.messageTemplateType} onFilter={handleFilter} />
					<Row gutter={24}>
						<Col xs={{ span: 24 }} lg={{ span: 24 }}>
							<Row gutter={[16, 16]} className="message-list">
								{data.data?.map(template => (
									<Col xs={24} sm={24} md={12} lg={12} xl={6} key={template.id} onClick={() => handleTemplateClick(template)}>
										<MessageCard template={template} isActive={selectedTemplate && template.messageTemplateId === selectedTemplate.messageTemplateId} onTemplateClick={onTemplateClick} />
									</Col>
								))}
							</Row>
							<div className="d-flex mt-3 justify-content-center">
								<BasicTablePaging 
								handlePaginations={handleChangePage} 
								count={data?.data?.length < filter.limit}
								skip={filter.skip}
								 />
							</div>
						</Col>
					</Row>
				</div>
			</>
		)
	}

	return (
		<Drawer
			title={
			<PopupHeaderContainer
				screenHeaderTitle={translation('listCustomers.sendMessageModal.messageType')}
				onCloseButtonClick={() => setIsSendMessageDrawer(false)}
			/>
		}
			width="100vw"
			height="100vh"
			visible={isSendMessageDrawer}
			closable={false}
			onClose={() => setIsSendMessageDrawer(false)}
			className='send-message-modal'
		>
			<Tabs
				activeKey={activeKey}
				onChange={(key) => {
					setActiveKey(key)
					// window.location.hash = key
				}}
			>
				<TabPane tab={translation("popular")} key={POPULAR}>
					{Templete(data)}
				</TabPane>
				<TabPane tab={translation("all")} key={ALL}>
					{Templete(data)}
				</TabPane>
			</Tabs>
		</Drawer>
	);
};

export default SendMessageDrawer;