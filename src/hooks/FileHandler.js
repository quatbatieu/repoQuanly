import React, { useState } from 'react';
import * as XLSX from 'xlsx'
import moment from "moment";
import { sendFileDataToReactNative } from 'helper/mobile';
import { isWebview } from 'helper/mobile';

export const ExportFile = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onExportExcel = async ({
    fieldApi,
    fieldExport,
    timeWait = 2000,
    data = [],
    informationColumn,
    nameFile = "phatnguoi.xlsx",
    setUrlForModalDirectLink
  }) => {
    setIsLoading(true)
    setTimeout(async () => {
      // Lọc Nhưng field cần lấy api . 
      const filteredData = data.map(item => {
        return Object.keys(item)
          .filter(key => fieldApi.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
      });
      // Đổi tên field cần lấy api 
      const renameData = filteredData.map((item) => {
        const renamedObj = {};

        fieldApi.forEach((_, index) => {
          renamedObj[fieldExport[index]] = item[fieldApi[index]];
        })
        return renamedObj;
      })

      const dataInformation = [
        ...informationColumn,
        fieldExport
      ];

      const workSheet = XLSX.utils.aoa_to_sheet(dataInformation);
      XLSX.utils.sheet_add_json(workSheet, renameData, { skipHeader: true, origin: -1 });

      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, workSheet, 'Sheet1');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // Chuyển workbook thành dạng mảng byte

      const blob = new Blob([wbout],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' }); // Tạo blob từ mảng byte
      const url = URL.createObjectURL(blob); // Tạo URL từ blob
      
      //Nếu ở chế độ webview thì chỉ gửi data cho mobile xử lý
      if(isWebview()){
        sendFileDataToReactNative(blob,nameFile)
        return
      }
      
      // thêm setUrlForModalDirectLink để có thể mở ra popup ModalDirectLink, nếu quên thêm setUrlForModalDirectLink thì vẫn sẽ tải được nhưng ở app sẽ không tải được và chỉ có thể dùng web
      if (setUrlForModalDirectLink){
        setUrlForModalDirectLink(url)
      } else{
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nameFile); // Đặt tên tệp tin khi tải xuống
        link.setAttribute('target', '_blank')
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      setIsLoading(false)
    }, timeWait);
  }

  return { isLoading, onExportExcel };
}

export const handleParse = async (file,raw = true) => {
  var name = file.name;
  const reader = new FileReader();

  return await new Promise((resolve, reject) => {
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      //raw:true sẽ giữ nguyên kiểu giu liệu file excel
      //raw:false tất cả sẽ chuyển thành chuỗi để tránh trường hợp nhập sai ngày
      const data = XLSX.utils.sheet_to_json(ws, { header: 1,raw });
      resolve(data);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsBinaryString(file);
  });
};

export const convertFileToArray = ({ FIELD_IMPORT_API, FIELD_IMPORT_FULL, data, removeLine = 3 }) => {
  const result = {
    isError: false,
    data: []
  };

  const arrNew = data.map(item => item.map(j => j || ''));

  try {
    const arraySlice = arrNew.slice(removeLine);
    const arrayFilter = arraySlice.filter(item => item.length !== 0);
    const arrayLabel = arrayFilter[0];

    const isUploadFile = JSON.stringify(FIELD_IMPORT_FULL.map((item) => item.trim())) === JSON.stringify(arrayLabel.map((item) => item.trim()));

    const newArray = arrayFilter.slice(1).map(item => {
      const resultItem = {};
      arrayLabel.forEach((label, index) => {
        resultItem[FIELD_IMPORT_API[index]] = item[index];
      });
      return resultItem;
    });

    if (!isUploadFile) {
      result.isError = true;
    } else {
      result.data = newArray;
    }
  } catch {
    result.isError = true;
  }

  return result;
};

