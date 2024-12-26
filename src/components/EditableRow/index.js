import React from 'react';
import { Form } from "antd"

const EditableRow = ({ index, form, ...props }) => {
  return ( 
    <Form form={form} component={false}>
      <tr {...props} form={form}></tr>
    </Form>
  );
};

export default EditableRow