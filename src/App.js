import React, { Component } from 'react';
import marked from 'marked';
import './App.css';


const MarkdownForm = (props) =>{
  return (
    <div className="MarkdownFormWrapper">
      <h2 className="title">Markdown Editor</h2>
      <textarea 
        name="markdowneditor" 
        id="markdowneditor"
        onChange={props.onChange}
      />
    </div>

  )
};

const MarkdownPreview = (props) =>{
  return (
    <div className="MarkdownPreviewWrapper">
      <h2 className="title">Markdown Preview</h2>
      <div 
        className="MarkdownPreview"
        dangerouslySetInnerHTML={{__html:props.editorPreview}}
      >
      </div>
    </div>
  )
};

class App extends Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
      outputValue:"",
    };
  }

  onEditorChange = (event) => {
    let inputValue = event.target.value;
    let inputValueEdited = marked(inputValue);
    this.setState({
      outputValue: inputValueEdited,
    });
  }

  render() {
    return (
      <div className="App">
        <MarkdownForm 
          onChange={this.onEditorChange}  
        />
        <MarkdownPreview
          editorPreview={this.state.outputValue}
        />
      </div>
    );
  }
}

export default App;