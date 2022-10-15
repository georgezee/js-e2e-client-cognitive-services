// ./src/App.js

import React, { useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';
import { WebcamCapture} from './components/Webcam/Webcam'

function App() {

  const [fileSelected, setFileSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setFileSelected(e.target.value)
  }
  const onFileUrlEntered = (e) => {

    // hold UI
    setProcessing(true);
    setAnalysis(null);

    computerVision(fileSelected || null).then((item) => {
      // reset state/form
      setAnalysis(item);
      setFileSelected("");
      setProcessing(false);
    });

  };

  // Display JSON data in readable format
  const PrettyPrintJson = (data) => {
    return (<div><pre>{JSON.stringify(data, null, 2)}</pre></div>);
  }

  const DisplayResults = () => {
    //console.log(analysis);

    var pinyin = require("pinyin");
    var chineseLines = analysis.text.readResults[0].lines;

    var allChinese = "";
    var allText = [];

    var displayText = "";
    for (const [key, line] of Object.entries(chineseLines)) {
      console.log(key, line);
      var chineseCharacters = line.text;
      var pinyinResult = pinyin(chineseCharacters);
      displayText = pinyinResult.join(" ");

      var resultLine = {'chars': chineseCharacters, 'pinyin': displayText};
      // Skip the line if no Chinese characters are present (the pinyin version is the same as the input).
      if (chineseCharacters !== displayText) {
        allText.push(resultLine);
      }
    }
    console.log(allText);
    console.log(displayText);

    return (
      <div>
        <div><img src={analysis.URL} height="200" border="1" alt={(analysis.description && analysis.description.captions && analysis.description.captions[0].text ? analysis.description.captions[0].text : "can't find caption")} /></div>
        <div  id="result">
          {allText.map((el,index)=> {<p key={index}>aaaa{el}</p>})}
          {
            allText.map((line)=>{
              console.log(line);
              return (
                <div className='word_result'>
                  <div className='chars'>{line.chars}</div>
                  <div className='pinyin'>{line.pinyin}</div>
                </div>
              )
            })
          }
        </div>
        <div class="Json-result">{PrettyPrintJson(analysis)}</div>
      </div>
    )
  };

  const Analyze = () => {
    return (
    <div>
      <h1>CCBot Pinyiner</h1>
      {!processing &&
        <div>
          <div>
            <label>URL</label>
            <input type="text" placeholder="Enter URL or leave empty for random image from collection" size="50" onChange={handleChange}></input>
            <div>Example:<br/>https://i.imgur.com/oKPiIW6.jpeg</div>
            <br/>
          </div>
          <button onClick={onFileUrlEntered}>Analyze</button>
          <div>
            <WebcamCapture/>
          </div>
        </div>
      }
      {processing && <div>Processing</div>}
      <hr />
      {analysis && DisplayResults()}
      </div>
    )
  }

  const CantAnalyze = () => {
    return (
      <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
    )
  }

  function Render() {
    const ready = ComputerVisionIsConfigured();
    if (ready) {
      return <Analyze />;
    }
    return <CantAnalyze />;
  }

  return (
    <div>
      {Render()}
    </div>

  );
}

export default App;
