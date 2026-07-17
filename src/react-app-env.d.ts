/// <reference types="react-scripts" />

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss';

declare module '*.png';
declare module '*.jpg';
declare module '*.gif';

// Ant Design Icons 宽松类型声明，解决 React 18 新增 DOM 属性的类型兼容问题
declare module '@ant-design/icons' {
  import React from 'react';
  export const HomeOutlined: React.ComponentType<any>;
  export const AppstoreOutlined: React.ComponentType<any>;
  export const UnorderedListOutlined: React.ComponentType<any>;
  export const ToolOutlined: React.ComponentType<any>;
  export const UserOutlined: React.ComponentType<any>;
  export const AreaChartOutlined: React.ComponentType<any>;
  export const SafetyOutlined: React.ComponentType<any>;
  export const PieChartOutlined: React.ComponentType<any>;
  export const LineChartOutlined: React.ComponentType<any>;
  export const BarChartOutlined: React.ComponentType<any>;
  export const PlusOutlined: React.ComponentType<any>;
  export const SearchOutlined: React.ComponentType<any>;
  export const ArrowLeftOutlined: React.ComponentType<any>;
  export const LockOutlined: React.ComponentType<any>;
  export const FullscreenOutlined: React.ComponentType<any>;
  export const FullscreenExitOutlined: React.ComponentType<any>;
  export const ReloadOutlined: React.ComponentType<any>;
  export const DownOutlined: React.ComponentType<any>;
  export const UpOutlined: React.ComponentType<any>;
  export const EyeOutlined: React.ComponentType<any>;
  export const EditOutlined: React.ComponentType<any>;
}

declare module 'react-draft-wysiwyg' {
  import { ComponentType } from 'react';
  const Editor: ComponentType<any>;
  export { Editor };
  export default Editor;
}

declare module 'draftjs-to-html' {
  const draftjsToHtml: (content: any) => string;
  export default draftjsToHtml;
}

declare module 'html-to-draftjs' {
  const htmlToDraft: (html: string) => any;
  export default htmlToDraft;
}
