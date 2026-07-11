
import React,{Component} from 'react'
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.scss'

export default class RichTextEditor extends Component {
    state = {
      editorState: EditorState.createEmpty(),
      richvalue:''
    }
    setHtml=(html)=>{
      // console.log(html,123);
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState
        })
      }
    }
    
    onEditorStateChange = (editorState) => {
      this.setState({
        editorState,
        richvalue:draftToHtml(convertToRaw(editorState.getCurrentContent()))
      });
      this.props.setrichtext(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };
  
    render() {
      const { editorState } = this.state;
      return (
        <div>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"//最外测的样式
            editorClassName="demo-editor"//编辑区域的样式
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
      );
    }
  }