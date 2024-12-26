import React, { useState, useEffect, useRef } from 'react';
import { Input,  Form } from 'antd';
import 'moment/dist/locale/vi';
import moment from 'moment';
import './editTableCell.scss'
import _ from 'lodash'
import { useTranslation } from 'react-i18next';

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  isTime,
  handleSave,
  form,
  componentInput,
  handleChangeRow,
  rules,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const { t: translation } = useTranslation()
  const LIST_KEYS = [
    'customerRecordPlatenumber',
    'customerRecordFullName',
    'customerRecordPhone',
    'customerRecordCheckDuration'
  ]

  useEffect(() => {
    if(record && record.indexKey && record.indexKey === dataIndex && !editing) {
      toggleEdit()
    }
  },[record])

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    const isError = form.getFieldsError().every(item => item.errors.length === 0);

    if (isError) {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    }
  };


  const save = async (isReload) => {
    if(form){
      const values = await form.validateFields();
      const key = Object.keys(values);
      const isSave = values[key] === record[key];

      if(values && !_.isEmpty(values) && !isSave) {
        //validate if user click then blur, not passing params or edit
        let arr = []
        Object.keys(values).map(key => {
          if(values[key])
            arr.push(key)
        })
        if(arr.length === 0) {
          setEditing(!editing);
          return
        }
        else {
          if(values.customerRecordCheckExpiredDate) {
            values.customerRecordCheckExpiredDate = moment(values.customerRecordCheckExpiredDate, "DD/MM/YYYY").format('DD/MM/YYYY')
          }

          if(values.customerRecordPlatenumber)  {
            values.customerRecordPlatenumber = values.customerRecordPlatenumber.toUpperCase()
          }

          if(values.customerRecordCheckDate) {
            values.customerRecordCheckDate = moment(values.customerRecordCheckDate, "DD/MM/YYYY").format('DD/MM/YYYY')
          }

          handleSave({ 
            ...record, 
            ...values
          },isReload);
        }
        
      }else {
        setEditing(!editing);
      }
    }
  };

  let childNode = children;
  
  if(isTime && editing) {
    if(record && record[dataIndex]) {
      form.setFieldsValue({
        customerRecordCheckExpiredDate: moment(record[dataIndex], 'DD/MM/YYYY'),
        customerRecordCheckDate : moment(record[dataIndex], 'DD/MM/YYYY')
      })
    } else {
      form.setFieldsValue({
        customerRecordCheckExpiredDate: '' , 
        customerRecordCheckDate : ""
      })
    }
  }

  if (editable) {
    let classname = ''
    if(dataIndex === 'customerRecordPlatenumber') {
      if(record) {
        if(!record.customerRecordPhone && !record.customerRecordCheckDuration) {
          classname="RED_LP"
        } else {
          classname="GREEN_LP"
        }
      }
    }
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={rules ? rules : []}
      >
        {
          componentInput ?
            componentInput(inputRef, save, form, setEditing, (formValues) => {
              const key = Object.keys(formValues);
              const isSave = formValues[key] === record[key];
              if (!isSave) {
                handleSave({
                  ...record,
                  ...formValues
                }, true)
              } else {
                setEditing(!editing);
              }
            } , record) :
            <Input
              placeholder={translation("new.type")}
              ref={inputRef}
              onBlur={save} 
              onKeyDown={(e) => {
                if(e.keyCode === 13 || e.keyCode === 9) {
                  //find index
                  let currentIndex = LIST_KEYS.findIndex(k => k === dataIndex)
                  if(currentIndex !== -1) {
                    if(currentIndex === LIST_KEYS.length - 1) {
                      save(true)
                    } else {
                      record.indexKey = LIST_KEYS[currentIndex+1]
                      save()
                      record[LIST_KEYS[currentIndex]] = inputRef.current.props.value
                      handleChangeRow(record)
                    }
                  }
                }
              }}
            />
        }
      </Form.Item>
    ) : (
      <div
        className={`editable-cell-value-wrap ${!record[dataIndex] ? 'editable-cell__wrap_null' : 'editable-cell__wrap'} ${classname}` }
        onClick={() => {
          toggleEdit()
        }}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell