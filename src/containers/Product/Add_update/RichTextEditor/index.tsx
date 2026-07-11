import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.scss';

interface RichTextEditorProps {
  setrichtext: (html: string) => void;
}

interface RichTextEditorState {
  editorState: EditorState;
  richvalue: string;
}

export default class RichTextEditor extends Component<
  RichTextEditorProps,
  RichTextEditorState
> {
  state: RichTextEditorState = {
    editorState: EditorState.createEmpty(),
    richvalue: '',
  };

  setHtml = (html: string) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  };

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
      richvalue: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
    this.props.setrichtext(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
