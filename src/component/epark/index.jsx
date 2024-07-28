import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import QRCode from 'qrcode'
import CryptoJS from 'crypto-js';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

function eParkTag() {
  const [nowMode, setNowMode] = useState(0)// 0解析数据模式，1新建模式
  // 新建模式
  const [imgData, setImageData] = useState('')
  const [resultLink, setResultLink] = useState('')
  const [saveData, setSaveData] = useState({
    "type":"mobile",
    "contactInfo":"",// 联系信息
    "tag":"",//标签
  })

  // 解析模式
  const [errorMsg, setErrorMsg] = useState('')
  const [resultData, setResultData] = useState(null)
  const [passData, setPassData] = useState('')
  const [decodeAesKey, setDecodeAesKey] = useState('')

  useEffect(() => {
    let data = new URLSearchParams(window.location.search?window.location.search:window.location.hash)
    let passData = data.get("data");
    if (passData !== null) {
      setNowMode(0)
      setPassData(passData)
    } else {
      setNowMode(1)
    }
  }, [])

  const userInputChange = (e) => {
    if (e.target.id === 'carTag') {
      setSaveData({
        ...saveData,
        tag: e.target.value
      });
    } else if (e.target.id === 'userConnect') {
      setSaveData({
        ...saveData,
        contactInfo: e.target.value
      });
    }
  }

  const userInputDecodeKey = (e) => {
    let value = e.target.value
    if (e.target.id === 'carTag') {
      setDecodeAesKey(formateKey(value))
    }
  }

  const AES_ECB_ENCRYPT = (data, key) => {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  const AES_ECB_DECRYPT = (textBase64, secretKey) => {
    var bytes = CryptoJS.AES.decrypt(textBase64, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const base64Decode = (encodedStr) => {
    return atob(encodedStr);
  }

  const base64Encode = (str) => {
    return btoa(str);
  }

  const formateKey = (key) => {
    return key.toLowerCase()
  }

  const getOriData = () => {
    return {
      "e":saveData.type,
      "o":saveData.contactInfo,
    }
  }

  const parseData = (str) => {
    try{
      return JSON.parse(str)
    }catch(e){
      return null
    }
  }

  const onGen = async () => {
    let enData = AES_ECB_ENCRYPT(JSON.stringify(getOriData()), saveData.tag)
    let gemData = base64Encode(enData)
    let url = window.location.href + "?&data=" + gemData
    setResultLink(url)
    let data = await QRCode.toDataURL(url)
    setImageData(data)
  }

  const onDecode = async () => {
    if (decodeAesKey === '') {
      setErrorMsg('输入为空')
      return
    }
    let deStr = AES_ECB_DECRYPT(base64Decode(passData), decodeAesKey)
    let decodeData = parseData(deStr.toString())
    if (decodeData !== null) {
      setResultData(decodeData)
    } else {
      setErrorMsg('解析失败，请重试')
      setDecodeAesKey('')
    }
  }

  const handleCloseError = () => {
    setErrorMsg("")
  }

  return (
    <Box style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box style={{
         width: '300px',
         height: '400px',
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center'
      }}>
        <h1>e-parking-tag</h1>
        <Snackbar
          open={errorMsg !== ''}
          autoHideDuration={1000}
          message={errorMsg}
          onClose={handleCloseError}
        />
        {
          nowMode === 1 ? (
            <Box style={{
              display: 'flex',
              flexDirection: "column",
              justifyContent: 'center'
            }}>
              <TextField id="carTag"
                onChange={userInputChange}
                value={saveData.tag}
                label="输入车牌"
                variant="standard"
              />
              <TextField
                id="userConnect"
                onChange={userInputChange}
                value={saveData.contactInfo}
                label="输入联系方式"
                variant="standard" />
              <Button onClick={onGen}>点击生成</Button>
              {
                imgData !== '' ? (
                  <>
                    <img src={imgData}></img>
                    <a>{resultLink}</a>
                  </>
                ) : ''
              }
            </Box>
          ) : (
            <Box style={{
              display: 'flex',
              flexDirection: 'column'
            }}>

              {
                resultData === null ? (
                  <>
                    <TextField id="carTag"
                      onChange={userInputDecodeKey}
                      value={decodeAesKey}
                      label="输入车牌"
                      variant="standard"
                    />
                    <Button onClick={onDecode}>获取联系方式</Button>
                  </>
                ) : (
                  <a href={'tel:' + resultData.o}>拨打电话</a>
                )
              }
            </Box>
          )
        }
      </Box>
    </Box>
  )
}

export default eParkTag
