import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import QRCode from 'qrcode'
import CryptoJS from 'crypto-js';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import configJson from './../../assets/config.json';

function eParkTag() {
  const [carTag, setCarTag] = useState('')
  const [userConnect, setUserConnect] = useState('')
  const [imgData, setImageData] = useState('')
  const [nowMode, setNowMode] = useState(0)// 0解析数据模式，1新建模式
  const [resultData, setResultData] = useState('')
  const [resultLink, setResultLink] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [passData, setPassData] = useState('')
  const [decodeAesKey, setDecodeAesKey] = useState('')

  useEffect(() => {
    let data = new URLSearchParams(window.location.search)
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
      setCarTag(formateKey(e.target.value))
    } else if (e.target.id === 'userConnect') {
      setUserConnect(e.target.value)
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

  const onGen = async () => {
    let enData = AES_ECB_ENCRYPT(userConnect, carTag)
    let gemData = base64Encode(enData)
    console.log(gemData)
    let url = configJson.epark.fullUrl + "?&data=" + gemData
    setResultLink(url)
    let data = await QRCode.toDataURL(url)
    setImageData(data)
  }

  const onDecode = async () => {
    if (decodeAesKey === '') {
      setErrorMsg('输入为空')
      return
    }
    let getData = base64Decode(passData)
    let deStr = AES_ECB_DECRYPT(getData, decodeAesKey)
    let decodeData = deStr.toString()
    if (decodeData !== '') {
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
                value={carTag}
                label="输入车牌"
                variant="standard"
              />
              <TextField
                id="userConnect"
                onChange={userInputChange}
                value={userConnect}
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
                resultData === '' ? (
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
                  <a href={'tel:' + resultData}>拨打电话</a>
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
