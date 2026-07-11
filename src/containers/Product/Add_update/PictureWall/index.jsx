import React,{ useState,useEffect,forwardRef,useImperativeHandle} from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { reqDeletePicture } from '../../../../api';
import { BASE_URL } from '../../../../config';

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// export default function PictureWall(props) {
//   const [previewOpen, setPreviewOpen] = useState(false);//是否关闭预览窗
//   const [previewImage, setPreviewImage] = useState('');//图片url地址或base64编码
//   const [previewTitle, setPreviewTitle] = useState('');//标题
//   const [fileList, setFileList] = useState([
//     // {
//     //   uid: '-1',
//     //   name: 'image.png',
//     //   status: 'done',
//     //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     // }
//   ]);

//   // 生命周期
//   useEffect(()=>{
//     // 如果父组件传递了props过来，就将图片回显
//     if(props.preimgs.length){
//       let img = props.preimgs.map((item)=>{
//         return {
//           uid:Math.random(),
//           name:item,
//           status:'done',
//           url:`${BASE_URL}/api1/upload/${item}`
//         }
//       })
//       // 将porps里的图片数组放入FileList（因为upload组件）
//       setFileList(img)
//     }
    
//   },[props.preimgs])
//   // 关闭预览窗
//   const handleCancel = () => setPreviewOpen(false);
//   // 展示预览窗
//   const handlePreview = async (file) => {
//     // 如果图片没有url也没有转换过base64，那么调用如下方法把图片转成base64
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//   };
//   // 当图片状态发生改变时候调用
//   const handleChange = async ({ file,fileList: newFileList }) => {
//     // console.log(file)
//     // if(file.status==='done'){
//     //   console.log('wanchengle ');
//     //   // newFileList[newFileList.length-1].name=file.response
//     //   // console.log(newFileList);
//     // }
//     // // 当图片被删除时调用
//     // if(file.status==='removed'){
//     //   // console.log('你删除了某个文件',file.name);
//     //   const result =await reqDeletePicture(file.name)//发起删除图片请求
//     //   if(result.code === 0){
//     //     message.success('删除图片成功')
//     //   }
//     // }
//     setFileList(newFileList);
//     // 将图片数据传递给父组件
//     let arr=newFileList.map((item)=>{
//         return item.name
//     })
//     props.setPreImgs(arr)
//   }
//   // 上传组件的内容
//   const uploadButton = (
//     <div>
//       <PlusOutlined />
//       <div
//         style={{
//           marginTop: 8,
//         }}
//       >
//         Upload
//       </div>
//     </div>
//   );
//   return (
//     <>
//       <Upload
//         action="/api1/manage/product/addpic"    //接收图片的服务器地址
//         // name='image'
//         listType="picture-card" //照片墙的展示方式
//         fileList={fileList}//图片列表，一个数组里面包含着多个图片列表{uid:xxx,name:xxx,atus:xxx,url：xxx}
//         onPreview={handlePreview}//点击预览按钮的回调
//         onChange={handleChange}//图片状态改变的回调（上传中，被删除，上传成功）
//       >
//         {fileList.length >= 8 ? null : uploadButton/*隐藏上传按钮的图片数量的阈值*/}
//       </Upload>
//       <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//         <img
//           alt="example"
//           style={{
//             width: '100%',
//           }}
//           src={previewImage}
//         />
//       </Modal>
//     </>
//   );
// };

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
  export default forwardRef(
  function PictureWall(props,ref){
    const [previewOpen, setPreviewOpen] = useState(false);// 原生的，不要动
    const [previewImage, setPreviewImage] = useState('');// 原生的，不要动
    const [previewTitle, setPreviewTitle] = useState('');// 原生的，不要动
    useImperativeHandle(ref, () => {
      return {
        setFileList,
      };
    }, []);
    const [fileList, setFileList] = useState([]);// 原生的，不要动
    const handleCancel = () => setPreviewOpen(false);// 原生的，不要动
    const handlePreview = async (file) => {// 原生的，不要动
      if (!file.url && !file.preview) {// 原生的，不要动
        file.preview = await getBase64(file.originFileObj);// 原生的，不要动
      }
      setPreviewImage(file.url || file.preview);// 原生的，不要动
      setPreviewOpen(true);// 原生的，不要动
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));// 原生的，不要动
    };
    const handleChange = ({ file,fileList: newFileList }) =>{// 原生的，不要动
      console.log(file.response,newFileList);
      // 当图片上传完毕后
      if(file.status==='done'){
        // 拿到服务器返回的地址，然后修改FileList的name属性，便于后面找服务器删除，
        newFileList[newFileList.length-1].name=file.response
      }
      // 将图片数据传递给父组件
      let arr=newFileList.map((item)=>{
          return item.name
      })
      props.setPreImgs(arr)
      console.log(props);
      setFileList(newFileList)// 原生的，不要动
      // ui组件内部封装了本地删除，只需要手动联系服务器删除即可
      if(file.status==='removed'){
        console.log('removed');
        deletePic(file.name)
      }
      };
      async function deletePic(name){
      let result =  await reqDeletePicture(name)
      if(result.code === 0 ){
        message.success('图片删除成功')
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
    // 生命周期
    useEffect(()=>{
      // 生命周期钩子里面，就是根据状态的改变，来做一些事情，所以，不要在里面既监测状态的改变，又修改状态，否则会进入一个死循环,
      // 如果非动不可，就不要更改监视数组里面的状态
    },[])
    return (
      <>
        <Upload
          action={BASE_URL+"/api1/manage/product/addpic"}
          listType="picture-card"// 原生的，不要动
          fileList={fileList}// 原生的，不要动
          onPreview={handlePreview}// 原生的，不要动
          onChange={handleChange}// 原生的，不要动
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
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
  )