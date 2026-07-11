import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import type { UploadFile } from 'antd';
import { reqDeletePicture } from '../../../../api';
import { BASE_URL } from '../../../../config';

interface PictureWallProps {
  preimgs: string[];
  setPreImgs: (imgs: string[]) => void;
}

export interface PictureWallHandle {
  setFileList: (files: UploadFile[]) => void;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PictureWall = forwardRef<PictureWallHandle, PictureWallProps>(
  function PictureWall(props, ref) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useImperativeHandle(ref, () => {
      return {
        setFileList,
      };
    }, []);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as File);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
      );
    };

    const handleChange = ({
      file,
      fileList: newFileList,
    }: {
      file: UploadFile;
      fileList: UploadFile[];
    }) => {
      console.log(file.response, newFileList);
      if (file.status === 'done') {
        newFileList[newFileList.length - 1].name = file.response;
      }
      const arr = newFileList.map((item) => {
        return item.name;
      });
      props.setPreImgs(arr);
      console.log(props);
      setFileList(newFileList);
      if (file.status === 'removed') {
        console.log('removed');
        deletePic(file.name);
      }
    };

    async function deletePic(name: string) {
      const result: any = await reqDeletePicture(name);
      if (result.code === 0) {
        message.success('图片删除成功');
      }
    }

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div
          style={{
            marginTop: 8,
          }}
        >
          Upload
        </div>
      </div>
    );

    useEffect(() => {}, []);

    return (
      <>
        <Upload
          action={BASE_URL + '/api1/manage/product/addpic'}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
      </>
    );
  }
);

export default PictureWall;
