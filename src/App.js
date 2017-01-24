import React, { Component } from 'react';
import marked from 'marked';
import './App.css';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

const MarkdownForm = (props) =>{
  return (
    <div className="MarkdownFormWrapper">
      <h2 className="title">Markdown Editor</h2>
      <div className="MarkdownForm">
        <div className="formButtons">
          <button value="bold"
            onClick={props.onButtonClick}>Bold</button>
          <button value="italic"
            onClick={props.onButtonClick}>Italic</button>
          <button value="olist"
            onClick={props.onButtonClick}>Ordered List</button>
          <button value="nlist"
            onClick={props.onButtonClick}>Numbered List</button>
        </div>
        <textarea 
          name="markdowneditor" 
          id="markdowneditor"
          onChange={props.onChange}
          onMouseUp={props.onMouseUp}
          value={props.inputValue}
        />
      </div>
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
      inputValue: "",
      outputValue:"",
      startPos: "",
      stopPos: "",
    };
  }

  onEditorChange = (event) => {
    let inputValue = event.target.value;
    let eventType = event.type;
    if(eventType === "change"){
      this.saveEditor(inputValue);
    }
    if(eventType === "mouseup"){
      let target = event.target;
      let startPos = target.selectionStart;
      let stopPos = target.selectionEnd;
      if(startPos !== stopPos){
        this.setState({
          startPos,
          stopPos,
        });
        //let selectedText = textValue.substring(startPos, stopPos);
        //let editedValue = textValue.slice(0, startPos) + "*" + selectedText + "*" + textValue.slice(stopPos, textValue.length);
        //this.saveEditor(editedValue);
      }
    }
  }

  saveEditor = (value) => {
    let inputValueEdited = marked(value);
    this.setState({
      inputValue: value,
      outputValue: inputValueEdited,
    });
  }

  onButtonClick = (event) => {
    let buttonValue = event.target.value;
    let textValue = this.state.inputValue;
    let startPos = this.state.startPos;
    let stopPos = this.state.stopPos;
    if(startPos !== "" && stopPos !== ""){
      let selectedText = textValue.substring(startPos, stopPos);
      if(buttonValue === "bold"){
        // Check siblings
        let boldStart = textValue.slice(startPos - 2, startPos);
        let boldStop = textValue.slice(stopPos, stopPos + 2);
        let editedValue;
        if(boldStart === "**" && boldStop === "**"){
          editedValue = textValue.slice(0, startPos - 2) 
          + textValue.slice(startPos, stopPos) 
          + textValue.slice(stopPos + 2, textValue.length);
          this.saveEditor(editedValue);
        }
        else{
          editedValue = textValue.slice(0, startPos) 
          + "**" 
          + selectedText 
          + "**" 
          + textValue.slice(stopPos, textValue.length);
          this.saveEditor(editedValue);
        }
        this.setState({
          startPos: "",
          stopPos: "",
        });
      }
      if(buttonValue === "italic"){
        // Check siblings
        let italicStart = textValue.slice(startPos - 1, startPos);
        let italicStop = textValue.slice(stopPos, stopPos + 1);
        let italicBoldStart = textValue.slice(startPos - 3, startPos);
        let italicBoldStop = textValue.slice(stopPos, stopPos + 3);
        let editedValue;
        if(((italicStart === "*" && italicStop === "*") && (textValue[startPos-2] != "*" && textValue[stopPos-2] != "*"))
          || (italicBoldStart === "***" && italicBoldStop === "***")){
          editedValue = textValue.slice(0, startPos - 1) 
          + textValue.slice(startPos, stopPos) 
          + textValue.slice(stopPos + 1, textValue.length);
          this.saveEditor(editedValue);
        }
        else{
          editedValue = textValue.slice(0, startPos) 
          + "*" 
          + selectedText 
          + "*" 
          + textValue.slice(stopPos, textValue.length);
          this.saveEditor(editedValue);
        }
        this.setState({
          startPos: "",
          stopPos: "",
        });
      }
      if(buttonValue === "olist"){
        // Check olist
        let olistStart = textValue.slice(startPos - 3, startPos);
        let numStart = textValue.slice(startPos - 4, startPos);
        let editedValue;
        if(olistStart === "\n- "){
            editedValue = textValue.slice(0, startPos - 3) 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);        
        }
        else if(numStart === "\n0. "){
            editedValue = textValue.slice(0, startPos - 4) 
          + "\n- " 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);        
        }
        else{
            editedValue = textValue.slice(0, startPos) 
          + "\n- " 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);
        }
        this.saveEditor(editedValue);
        this.setState({
          startPos: "",
          stopPos: "",
        });
      }
      if(buttonValue === "nlist"){
        // Check olist
        let numStart = textValue.slice(startPos - 4, startPos);
        let olistStart = textValue.slice(startPos - 3, startPos);
        let editedValue;
        if(numStart === "\n0. "){
            editedValue = textValue.slice(0, startPos - 4) 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);        
        }
        else if(olistStart === "\n- "){
            editedValue = textValue.slice(0, startPos - 3) 
          + "\n0. " 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);        
        }
        else{
            editedValue = textValue.slice(0, startPos) 
          + "\n0. " 
          + selectedText 
          + textValue.slice(stopPos, textValue.length);
        }
        this.saveEditor(editedValue);
        this.setState({
          startPos: "",
          stopPos: "",
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <MarkdownForm 
          onChange={this.onEditorChange}
          onMouseUp={this.onEditorChange}
          onButtonClick={this.onButtonClick} 
          inputValue={this.state.inputValue} 
        />
        <MarkdownPreview
          editorPreview={this.state.outputValue}
        />
      </div>
    );
  }
}

export default App;