import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ModalEditNameFile = ({ open, setOpen, file , onChangeName }) => {
	const [value , setValue] = useState(file.name);
	const handleSave = () => {
		onChangeName(value);
	};
  const { t: translation } = useTranslation();


	return (
		<div>
			<Modal
				title={translation('vehicleRecords.changeName')}
				className="modalClose"
				bodyStyle={{ padding : 30 }}
				visible={open}
				onOk={handleSave}
				onCancel={() => setOpen(false)}
			>
				<Input value={value} autoFocus onChange={(e) => setValue(e.target.value)} />
			</Modal>
		</div>
	);
};

export default ModalEditNameFile;
