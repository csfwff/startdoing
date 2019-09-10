import React, {Component} from 'react';
import {Switch, InputItem, Radio, List, Button} from 'antd-mobile';
import {HuePicker} from 'react-color';
import './App.css';
import domtoimage from 'dom-to-image-more';
import GIF from 'gif.js';
//import html2canvas from 'html2canvas';

const RadioItem = Radio.RadioItem;

let shotImg = [];

class App extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      platform: "android",
      color: "#4dd865",
      name: "",
      imgList: [],
      resultUrl: "",
      btnEnable: true,
      btnText: "开始生成"
    }
  }

  onBtnClick() {
    shotImg = [];
    this.setState({checked: false, btnEnable: false, btnText: "生成中"})
    setTimeout(() => {
      this.setState({
        checked: true
      }, () => {
        this.startGetImg()
      })
    }, 400)

  }

  startGetImg() {
    let shotIntel = setInterval(() => {
      this.getImage()
    }, 6)
    setTimeout(() => {
      clearInterval(shotIntel);
      this.setState({imgList: shotImg})
    }, 500)
    setTimeout(() => {
      this.setState({
        imgList: shotImg
      }, () => {
        this.getGif()
      })
    }, 550)

  }

  getImage() {
    domtoimage.toPng(document.getElementById('shotDiv'), {
      quality: 1,
      useCredentials: true
    }).then(function(dataUrl) {
      shotImg.push(dataUrl)
    }).catch(function(e) {
      alert(JSON.stringify(e))
    })
    // let copyDom = document.getElementById('shotDiv')
    // let width = copyDom.offsetWidth;
    // let height = copyDom.offsetHeight
    // let scale = 1
    // let canvas = document.createElement('canvas')
    //
    // canvas.width = width * scale; //canvas宽度
    // canvas.height = height * scale; //canvas高度
    // var content = canvas.getContext("2d");
    // content.scale(scale, scale);
    // var rect = copyDom.getBoundingClientRect(); //获取元素相对于视察的偏移量
    // content.translate(-rect.left, -rect.top)
    //
    // html2canvas(copyDom, {
    //   dpi: window.devicePixelRatio * 2,
    //   scale: scale,
    //   canvas: canvas,
    //   width: width,
    //   heigth: height,
    //   useCORS: true
    // }).then(canvas => {
    //   let dataurl = canvas.toDataURL();
    //   shotImg.push(dataurl)
    // }).catch(function(e) {
    //   alert(JSON.stringify(e))
    // })

  }

  getGif() {

    let resultImg = document.getElementsByClassName('shotImgResult');
    //console.log(resultImg);
    let gif = new GIF({workers: 2, quality: 3})
    Array.from(resultImg).forEach((v, i) => {
      let delay = 150;
      if (i === resultImg.length - 1)
        delay = 800;
      gif.addFrame(v, {delay: delay})
    })
    gif.on('finished', (blob) => {
      let reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        let base64data = reader.result;
        this.setState({resultUrl: base64data, btnEnable: true, btnText: "开始生成"})
      }
    });

    gif.render();

  }

  renderImg(imgData, index) {
    return (<img src={imgData} className="shotImgResult" key={index} alt="img" crossOrigin="Anonymous"></img>)
  }

  componentWillMount() {
    console.log("沙雕你好\\(@^0^@)/hohoo~~\n不去我的小站玩一下么？👉https://sszsj.cc:444");
  }

  render() {
    const platformData = [
      {
        value: "android",
        label: 'android'
      }, {
        value: "ios",
        label: 'ios'
      }
    ];
    let imgs = [];
    this.state.imgList.forEach((v, i) => {
      imgs.push(this.renderImg(v, i))
    })
    return (<div className="App">
      <div className="InputContainer">
        <div className="titleTv">沙雕“开始XX”表情包生成器</div>
        <InputItem placeholder="例如：“开始自闭”" clear="clear" ref={el => this.labelFocusInst = el} onChange={(value) => this.setState({name: value})}>
          <div onClick={() => this.labelFocusInst.focus()}>开始干什么</div>
        </InputItem>
        <div className="infoText">选择显示样式</div>
        <List>
          {
            platformData.map(i => (<RadioItem key={i.value} checked={this.state.platform === i.value} onChange={() => {
                this.setState({platform: i.value})
              }}>
              {i.label}
            </RadioItem>))
          }
        </List>
      </div>
      <div className="infoText">选择颜色</div>
      <HuePicker color={this.state.color} onChange={(color) => {
          this.setState({color: color.hex})
        }}/>
      <div className="infoText">预览</div>
      <div style={{
          width: '100%',
          height: '44px'
        }}>
        <div id="shotDiv">
          {this.state.name}&nbsp;&nbsp;&nbsp;&nbsp;
          <Switch checked={this.state.checked} platform={this.state.platform} color={this.state.color} onClick={(checked) => this.setState({checked: checked})}></Switch>
        </div>
      </div>
      <div className="infoText1">点击按钮开始生成，生成过程中上面的开关会动一下</div>
      <Button type="primary" disabled={!this.state.btnEnable} onClick={() => this.onBtnClick()}>{this.state.btnText}</Button>
      {
        this.state.resultUrl.length > 0
          ? <div>
              <div className="infoText">生成结果（长按保存，效果不好可以多试几次）</div>
              <img src={this.state.resultUrl} alt="img" crossOrigin="Anonymous"></img>
            </div>
          : ""
      }
      {imgs}
    </div>);
  }
}

export default App;
