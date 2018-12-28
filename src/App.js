import React, {Component} from 'react';
import {Switch, InputItem, Radio, List, Button} from 'antd-mobile';
import {HuePicker } from 'react-color';
import './App.css';
import domtoimage from 'dom-to-image';
import GIF from 'gif.js';

const RadioItem = Radio.RadioItem;

let shotImg = [];

class App extends Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      platform: "android",
      color:"#4dd865",
      name:"",
      imgList:[],
      resultUrl:"",
      btnEnable:true,
      btnText:"开始生成"
    }
  }

  onBtnClick(){
    shotImg = [];
    this.setState({
      checked:false,
      btnEnable:false,
      btnText:"生成中"
    })
    setTimeout(()=>{
      this.setState({
          checked:true,
      },()=>{
          this.startGetImg()
      })
    },400)

  }

  startGetImg(){
    let shotIntel = setInterval(()=>{
      this.getImage()
    },6)
    setTimeout(()=>{
      clearInterval(shotIntel);
      this.setState({imgList:shotImg})
    },500)
    setTimeout(()=>{
      this.setState({imgList:shotImg},()=>{this.getGif()})
    },550)

  }

getImage(){
  domtoimage.toJpeg(document.getElementById('shotDiv'),{quality: 1}).then(function(dataUrl){
    shotImg.push(dataUrl)
  }).catch(function(e){

  })
}

getGif(){
  let gif = new GIF({
    workers: 2,
    quality: 3,
  })
  let resultImg = document.getElementsByClassName('shotImgResult');
  Array.from(resultImg).forEach((v,i)=>{
    let delay = 150;
    if(i === resultImg.length-1) delay = 800;
    gif.addFrame(v,{delay:delay})
  })
  gif.on('finished', (blob)=>{
    let reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = ()=> {
           let base64data = reader.result;
           this.setState({
              resultUrl:base64data,
             btnEnable:true,
             btnText:"开始生成"
           })
        }
  });

  gif.render();

}


  renderImg(imgData,index){
    return(
      <img  src={imgData} className="shotImgResult" key={index} alt="img"></img>
    )
  }

componentWillMount(){
  console.log("沙雕你好\\(@^0^@)/hohoo~~\n不去我的小站玩一下么？👉http://xiamo.lundao.com/");
}

  render() {
    const platformData = [
        { value: "android", label: 'android'},
        { value: "ios", label: 'ios' }
    ];
    let imgs = [];
    this.state.imgList.forEach((v,i)=>{
      imgs.push(this.renderImg(v,i))
    })
    return (
      <div className="App">
      <div className="InputContainer">
        <div  className="titleTv">沙雕“开始XX”表情包生成器</div>
        <InputItem placeholder="例如：“开始自闭”" clear="clear" ref={el => this.labelFocusInst = el}
          onChange={(value)=>this.setState({name:value})}>
          <div onClick={() => this.labelFocusInst.focus()}>开始干什么</div>
        </InputItem>
        <div  className="infoText">选择显示样式</div>
        <List>
        {platformData.map(i => (
               <RadioItem key={i.value} checked={this.state.platform === i.value}
                 onChange={() =>{
                 this.setState({platform:i.value})
               } }>
                 {i.label}
               </RadioItem>
             ))}
           </List>
      </div>
      <div  className="infoText">选择颜色</div>
      <HuePicker
        color={this.state.color}
        onChange={(color)=>{
          this.setState({color:color.hex})
        }}/>
        <div  className="infoText">预览</div>
        <div style={{width:'100%',height:'44px'}}>
        <div id="shotDiv">
            {this.state.name}&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              checked={this.state.checked}
              platform={this.state.platform}
              color={this.state.color}
              onClick={(checked) => this.setState({checked:checked}) }>
            </Switch>
        </div>
      </div>
      <div  className="infoText1">点击按钮开始生成，生成过程中上面的开关会动一下</div>
    <Button type="primary"
      disabled={!this.state.btnEnable}
       onClick={()=>this.onBtnClick()}>{this.state.btnText}</Button>
    {this.state.resultUrl.length>0?
      <div>
      <div  className="infoText">生成结果（长按保存，效果不好可以多试几次）</div>
      <img  src={this.state.resultUrl}  alt="img"></img>
    </div>
      :""}
    {imgs}
    </div>);
  }
}

export default App;
