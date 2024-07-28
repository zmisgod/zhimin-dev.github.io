import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOffIcon from '@mui/icons-material/EditOff';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import BackspaceIcon from '@mui/icons-material/Backspace';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import InfoIcon from '@mui/icons-material/Info';
import SimpleDialog from './dialog'
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const SELECT_COLOR_OBJECT_TYPE_NONE = 0
const SELECT_COLOR_OBJECT_TYPE_SVG = 1//修改svg
const SELECT_COLOR_OBJECT_TYPE_TEXT = 2//修改字体
const SELECT_COLOR_OBJECT_TYPE_DRAW = 3//画画模式

const DRAW_TYPE_NONE = 0// none
const DRAW_TYPE_PENCIL = 1//画笔
const DRAW_TYPE_ERASE = 2//清除
const DRAW_TYPE_UNDO_ERASE = 3//取消清除

export default function ImaxPoster() {

    const canvasEl = useRef(null);
    const selectedObjTypeEl = useRef(SELECT_COLOR_OBJECT_TYPE_NONE);

    const [canvasCli, setCanvasCli] = useState(null)
    const [selectedObjType, setSelectedObjType] = useState(SELECT_COLOR_OBJECT_TYPE_NONE)
    const [nowSelectObj, setNowSelectObj] = useState(null)
    const [, forceUpdate] = useState(); //强制更新视图

    // 弹框信息
    const [showDialog, setShowDialog] = useState(false)
    const [dialogShowInfo, setDialogShowInfo] = useState({ 'type': 0, 'title': '', value: '' })

    // svg信息
    const svgInfoEl = useRef({
        color: "green",
        shadowColor: "",
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 10,
    });
    const [svgColor, setSvgColor] = useState('')
    const [svgShadowColor, setSvgShadowColor] = useState('')
    const [svgShadowBlur, setSvgShadowBlur] = useState(10)
    const [svgShadowOffsetX, setSvgShadowOffsetX] = useState(2)
    const [svgShadowOffsetY, setSvgShadowOffsetY] = useState(2)

    //  字体相关信息
    const textInfoEl = useRef({
        family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif',
        color: "#000"
    })
    const [textColor, setTextColor] = useState('')
    const [textFamily, setTextFamily] = useState('')

    const drawInfoEl = useRef({ width: 10, color: '#fff', backgroundImageErasable: false });
    const [drawWidth, setDrawWidth] = useState(10)
    const [drawColor, setDrawColor] = useState('#fff')
    const [backgroundImageErasable, setBackgroundImageErasable] = useState(false)

    const drawTypeEl = useRef(DRAW_TYPE_NONE)
    const [drawType, setDrawType] = useState(DRAW_TYPE_NONE)

    const updateCanvasContext = (canvas) => {
        if (canvas !== null) {
            canvas.selection = false; // disable group selection
            canvas.on('mouse:down', function (e) {
                if (selectedObjTypeEl.current !== SELECT_COLOR_OBJECT_TYPE_DRAW) {
                    if (e.target) {
                        if (e.target.svgUid !== undefined) {
                            initSvgInfo()
                            changeSelectedObjType(SELECT_COLOR_OBJECT_TYPE_SVG)
                        }
                        if (e.target.text !== undefined) {
                            initTextInfo()
                            changeSelectedObjType(SELECT_COLOR_OBJECT_TYPE_TEXT)
                        }
                        setNowSelectObj(e.target)
                    } else {
                        setNowSelectObj(null)
                        changeSelectedObjType(SELECT_COLOR_OBJECT_TYPE_NONE)
                    }
                } else {
                    console.log("is on pencil mod")
                }
            })
            setCanvasCli(canvas)
        } else {
            setCanvasCli(null)
        }
    }

    const changeSelectedObjType = (val) => {
        setSelectedObjType(val)
        selectedObjTypeEl.current = val
    }

    const initTextInfo = () => {
        setTextColor(textInfoEl.current.color)
        setTextFamily(textInfoEl.current.family)
    }

    const initSvgInfo = () => {
        setSvgColor(svgInfoEl.current.color)
        setSvgShadowColor(svgInfoEl.current.shadowColor)
        setSvgShadowBlur(svgInfoEl.current.shadowBlur)
        setSvgShadowOffsetX(svgInfoEl.current.shadowOffsetX)
        setSvgShadowOffsetY(svgInfoEl.current.shadowOffsetY)
    }

    const addIMaxLogo = () => {
        let source = getSvgSourceCode(svgInfoEl.current.color)
        fabric.loadSVGFromString(source, function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            canvasCli.add(obj).renderAll();
        });
    }

    const addReverseImage = () => {
        // 创建一个 SVG 图像对象
        fabric.Image.fromURL('https://static.zmis.me/public/user/file/1/local/20230710/1688959545000cnyjr.jpeg', function (img) {
            // 设置原始图像的位置和大小
            img.set({
                left: 50,
                top: 50,
                width: 200,
                height: 200
            });

            var clonedImage = img.cloneAsImage(function (cloneImg) {
                cloneImg.set({
                    top: img.top + img.height + 10,
                    scaleY: -1, // 反转垂直方向
                    opacity: 0.5 // 设置透明度
                });

                // 将克隆后的图片对象添加到画布中
                canvasCli.add(cloneImg).renderAll();
            });

            // 将原始图像和倒影对象添加到画布中
            canvasCli.add(img).renderAll();
            // canvasCli.add(img, reflection).renderAll();
        });
    }

    const getSvgSourceCode = (color) => {
        let source = `<?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE svg
            PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1000px" height="189.449px"
            viewBox="0 0 1000 189.449" enable-background="new 0 0 1000 189.449" xml:space="preserve">
            <g fill="`+ color + `">
                <polygon fill-rule="evenodd" clip-rule="evenodd" points="154.901,189.449 154.974,52.836 165.646,52.836 232.449,189.294 
            277.006,189.294 343.842,52.836 354.708,52.836 354.705,189.449 408.061,189.449 408.061,0.573 311.937,0.573 254.981,113.507 
            197.475,0.723 101.793,1.021 101.647,189.449 154.901,189.449 	" />
                <polygon fill-rule="evenodd" clip-rule="evenodd"
                    points="0,189.441 59.759,189.441 59.759,0.573 0,0.573 0,189.441 	" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M514.564,0.573L418.57,189.449h63.844l16.703-32.123h119.291l16.273,32.123
            h63.998L602.633,0.573H514.564L514.564,0.573z M561.653,43.508h-5.876l-36.339,71.533h78.149L561.653,43.508L561.653,43.508z" />
                <polygon fill-rule="evenodd" clip-rule="evenodd" points="789.628,0.573 715.457,0.573 790.322,89.218 700.926,189.449 
            779.99,189.449 840.145,121.205 899.624,189.449 978.433,189.449 889.55,89.133 963.984,0.573 891.134,0.573 839.636,61.938 
            789.628,0.573" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M1000,14.378c0,7.939-6.439,14.384-14.377,14.384
            c-7.94,0-14.38-6.445-14.38-14.384C971.243,6.45,977.692,0,985.623,0C993.56,0,1000,6.45,1000,14.378L1000,14.378z M997.53,14.378
            c0-6.577-5.33-11.898-11.907-11.898c-6.57,0-11.909,5.326-11.909,11.898c0,6.579,5.339,11.904,11.909,11.904
            C992.2,26.283,997.53,20.958,997.53,14.378L997.53,14.378z M986.715,8.968h-4.202v5.277h4.279c0.525,0,0.93-0.042,1.206-0.128
            c0.283-0.082,0.56-0.228,0.758-0.47c0.31-0.357,0.438-1.059,0.438-2.122c0-0.982-0.111-1.658-0.354-1.998
            c-0.18-0.25-0.465-0.392-0.8-0.458C987.706,9.002,987.257,8.968,986.715,8.968L986.715,8.968z M987.241,6.411
            c2.023,0,3.383,0.395,4.098,1.183c0.638,0.701,0.948,1.856,0.948,3.448c0,1.735-0.242,2.863-0.689,3.41
            c-0.422,0.5-0.957,0.844-1.938,1.021v0.061c0.922,0.09,1.506,0.361,1.938,0.934c0.413,0.561,0.56,1.481,0.56,2.644v2.772h-3.091
            v-2.165c0-0.539-0.026-0.995-0.077-1.348c-0.053-0.353-0.189-0.654-0.397-0.892c-0.215-0.236-0.473-0.395-0.758-0.465
            c-0.293-0.068-0.68-0.102-1.162-0.102h-0.31h-3.849v4.972h-2.996l0.034-15.472H987.241L987.241,6.411z" />
            </g>
        </svg>`
        return source
    }

    const getQueryString = (name, search) => {
        search = search || window.location.search.substr(1) || window.location.hash.split("?")[1];
        if(search !== undefined) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = search.match(reg);
            if (r != null) return unescape(r[2]); return '';
        }
        return "";
    }

    useEffect(() => {
        let query = new URLSearchParams(window.location.hash)
        let url = getQueryString("url")
        setShowDialog(true)
        setDialogShowInfo({ 'type': 5, 'title': '请选择图片URL', value: url })
        const options = {};
        const canvas = new fabric.Canvas(canvasEl.current, options);
        updateCanvasContext(canvas);
        return () => {
            updateCanvasContext(null);
            canvas.dispose();
        }
    }, []);

    const addText = () => {
        var comicSansText = new fabric.IText("请输入文字", {
            fontFamily: 'Comic Sans',
        });
        canvasCli.add(comicSansText)
        setCanvasCli(canvasCli)
    }

    const eraseBrush = () => {
        changeDrawType(DRAW_TYPE_ERASE)
        canvasCli.freeDrawingBrush = new fabric.EraserBrush(canvasCli);
        canvasCli.freeDrawingBrush.width = drawInfoEl.current.width;
        canvasCli.isDrawingMode = true;
        setCanvasCli(canvasCli)
    }

    const changeDrawType = (val) => {
        setDrawType(val)
        drawTypeEl.current = val
    }

    const undoEraseBrush = () => {
        changeDrawType(DRAW_TYPE_UNDO_ERASE)
        canvasCli.freeDrawingBrush = new fabric.EraserBrush(canvasCli);
        canvasCli.freeDrawingBrush.width = drawInfoEl.current.width;
        canvasCli.freeDrawingBrush.inverted = true;
        canvasCli.isDrawingMode = true;
        setCanvasCli(canvasCli)
    }

    const pencilBrush = () => {
        changeDrawType(DRAW_TYPE_PENCIL)
        changeSelectedObjType(SELECT_COLOR_OBJECT_TYPE_DRAW)
        canvasCli.freeDrawingBrush = new fabric.PencilBrush(canvasCli);
        canvasCli.freeDrawingBrush.color = drawInfoEl.current.color
        canvasCli.freeDrawingBrush.width = drawInfoEl.current.width;
        canvasCli.isDrawingMode = true;
        setCanvasCli(canvasCli)
    }

    const cancelDraw = () => {
        changeSelectedObjType(SELECT_COLOR_OBJECT_TYPE_NONE)
        changeDrawType(DRAW_TYPE_NONE)
        canvasCli.isDrawingMode = false;
        setCanvasCli(canvasCli)
    }

    const exportJson = async () => {
        const json = canvasCli.toDatalessJSON(["clipPath", "eraser"]);
        const out = JSON.stringify(json, null, "\t");
        const blob = new Blob([out], { type: "text/plain" });
        const clipboardItemData = { [blob.type]: blob };
        try {
            navigator.clipboard &&
                (await navigator.clipboard.write([
                    new ClipboardItem(clipboardItemData)
                ]));
        } catch (error) {
            console.log(error);
        }
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
        a.download = "eraser_example.json";
        a.click();
        URL.revokeObjectURL(blobURL);
    }

    const exportImg = () => {
        const ext = "png";
        const base64 = canvasCli.toDataURL({
            format: ext,
            enableRetinaScaling: true
        });
        const link = document.createElement("a");
        link.href = base64;
        link.download = `eraser_example.${ext}`;
        link.click();
    }

    const exportSvg = () => {
        const svg = canvasCli.toSVG();
        const a = document.createElement("a");
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const blobURL = URL.createObjectURL(blob);
        a.href = blobURL;
        a.download = "eraser_example.svg";
        a.click();
        URL.revokeObjectURL(blobURL);
    }

    const deleteObject = () => {
        canvasCli.remove(nowSelectObj)
        canvasCli.renderAll();
    }

    const getActiveObject = () => {
        console.log(nowSelectObj)
    }

    const doChangeBackgroundUrl = (url) => {
        if (url === '') {
            return
        }
        fabric.Image.fromURL(url, function (img) {
            console.log("imageWidthInfo", img.width, img.height)
            canvasCli.setHeight(img.height)
            canvasCli.setWidth(img.width)
            img.set({ erasable: false })
            canvasCli.setBackgroundImage(img)
            canvasCli.renderAll();
        }, { crossOrigin: "anonymous" })
        handleClose()
    }

    const dialogCallbackFunction = (type, obj) => {
        if (type === 5) {
            doChangeBackgroundUrl(obj['url'])
        }
    }

    const handleClose = () => {
        setShowDialog(false)
    }

    const changeAlignCenter = (tType) => {
        if (tType === 'h') {
            nowSelectObj.centerH()
        } else if (tType === 'v') {
            nowSelectObj.centerV()
        }
        canvasCli.renderAll();
    }

    const changeSvgInfo = (e) => {
        if (e.target.id === "changeSvgColor") {
            setSvgColor(e.target.value)
        } else if (e.target.id === "changeShadowColor") {
            setSvgShadowColor(e.target.value)
        } else if (e.target.id === "changeShadowOffsetX") {
            setSvgShadowOffsetX(e.target.value)
        } else if (e.target.id === "changeShadowOffsetY") {
            setSvgShadowOffsetY(e.target.value)
        } else if (e.target.id === "changeShadowBlur") {
            setSvgShadowBlur(e.target.value)
        }
    }

    const doChangeSvgInfo = () => {
        let saveData = {
            color: svgColor,
            shadowColor: svgShadowColor,
            shadowOffsetX: svgShadowOffsetX,
            shadowOffsetY: svgShadowOffsetY,
            shadowBlur: svgShadowBlur,
        }
        console.log("doChangeSvgInfo", svgColor, saveData)
        svgInfoEl.current = saveData
        let source = getSvgSourceCode(svgColor)
        fabric.loadSVGFromString(source, function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            const objectB = nowSelectObj.cloneAsImage((cloned) => {
                obj.set({
                    left: nowSelectObj.left,
                    top: nowSelectObj.top,
                    width: nowSelectObj.width,
                    height: nowSelectObj.height,
                    angle: nowSelectObj.angle,
                    scaleX: nowSelectObj.scaleX,
                    scaleY: nowSelectObj.scaleY,
                    flipX: nowSelectObj.flipX,
                    flipY: nowSelectObj.flipY,
                });
                if (svgShadowColor !== '') {
                    obj.set({
                        shadow: {
                            color: svgShadowColor,
                            offsetX: svgShadowOffsetX,
                            offsetY: svgShadowOffsetY,
                            blur: svgShadowBlur
                        }
                    })
                }
                canvasCli.add(obj);
                canvasCli.remove(nowSelectObj)
                setNowSelectObj(obj)
                canvasCli.renderAll();
            });
        });
    }

    const changeTextInfo = (e) => {
        if (e.target.id === "changeTextColor") {
            setTextColor(e.target.value)
        } else if (e.target.id === "changeTextFamily") {
            setTextFamily(e.target.value)
        }
    }

    const doChangeTextInfo = () => {
        let saveData = {
            family: textFamily,
            color: textColor
        }
        textInfoEl.current = saveData
        nowSelectObj.set("fontFamily", textFamily)
        nowSelectObj.set("fill", textColor)
        canvasCli.renderAll();
    }

    const changeDrawInfo = (e) => {
        if (e.target.id === "changeDrawWidth") {
            setDrawWidth(parseInt(e.target.value, 10))
        } else if (e.target.id === "changeDrawColor") {
            setDrawColor(e.target.value)
        } else if (e.target.id === "changeBackgroundImageErasable") {
            setBackgroundImageErasable(e.target.checked)
            canvasCli.get("backgroundImage").set({ erasable: e.target.checked })
        }
    }

    const doChangeDrawInfo = () => {
        let saveData = {
            width: drawWidth,
            color: drawColor,
        }
        console.log(saveData)
        drawInfoEl.current = saveData
        if (drawTypeEl.current === DRAW_TYPE_PENCIL) {
            pencilBrush()
        } else if (drawTypeEl.current === DRAW_TYPE_ERASE) {
            eraseBrush()
        } else if (drawTypeEl.current === DRAW_TYPE_UNDO_ERASE) {
            undoEraseBrush()
        }
    }

    return (
        <div style={{
            display: 'flex'
        }}>
            <SimpleDialog
                showTitle={dialogShowInfo.title}
                showType={dialogShowInfo.type}
                showValue={dialogShowInfo.value}
                open={showDialog}
                onClose={handleClose}
                selectedValue={svgColor}
                callbackFunction={dialogCallbackFunction}
            />
            <div>
                <canvas ref={canvasEl} />
            </div>
            <div>
                <div>

                </div>
                <div>
                    <Button onClick={addIMaxLogo} startIcon={<MovieFilterIcon />} >增加IMAX Logo</Button>
                    <Button onClick={addText} startIcon={<FormatColorTextIcon />} >增加文字输入</Button>
                    {/* <Button onClick={addReverseImage}startIcon={<FormatColorTextIcon />} >增加图片</Button> */}
                    <Button onClick={pencilBrush} startIcon={<ModeEditIcon />} >画笔模式</Button>
                </div>
                <div>
                    {
                        selectedObjType === SELECT_COLOR_OBJECT_TYPE_SVG ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <TextField value={svgColor} id="changeSvgColor" variant="standard" label="svg颜色" onChange={changeSvgInfo} />
                                <TextField value={svgShadowColor} id="changeShadowColor" variant="standard" label="svg阴影" onChange={changeSvgInfo} />
                                <TextField value={svgShadowOffsetX} id="changeShadowOffsetX" variant="standard" label="svg offset x" onChange={changeSvgInfo} />
                                <TextField value={svgShadowOffsetY} id="changeShadowOffsetY" variant="standard" label="svg offset y" onChange={changeSvgInfo} />
                                <TextField value={svgShadowBlur} id="changeShadowBlur" variant="standard" label="svg blur" onChange={changeSvgInfo} />
                                <Button variant="contained" onClick={doChangeSvgInfo}>渲染</Button>
                            </div>
                        ) : ''
                    }
                    {
                        selectedObjType === SELECT_COLOR_OBJECT_TYPE_TEXT ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <TextField value={textColor} id="changeTextColor" variant="standard" label="字体颜色" onChange={changeTextInfo} />
                                <TextField value={textFamily} id="changeTextFamily" variant="standard" label="字体" onChange={changeTextInfo} />
                                <Button variant="contained" onClick={doChangeTextInfo}>渲染</Button>
                            </div>
                        ) : ''
                    }
                    {
                        selectedObjType === SELECT_COLOR_OBJECT_TYPE_DRAW ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Button onClick={eraseBrush} startIcon={<BackspaceIcon />} >擦除</Button>
                                <Button onClick={undoEraseBrush} startIcon={<FormatColorResetIcon />} >取消擦除</Button>
                                <Button onClick={cancelDraw} startIcon={<EditOffIcon />}>取消画笔模式</Button>
                                <FormGroup>
                                    <FormControlLabel control={<Switch
                                        checked={backgroundImageErasable}
                                        id="changeBackgroundImageErasable"
                                        onChange={changeDrawInfo}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />} label={backgroundImageErasable ? '背景可擦除(擦除后无法通过【取消擦除】恢复)' : '背景不可擦除'} />
                                </FormGroup>
                                <TextField value={drawWidth} id="changeDrawWidth" variant="standard" label="修改画笔长度" onChange={changeDrawInfo} />
                                <TextField value={drawColor} id="changeDrawColor" variant="standard" label="修改画笔颜色" onChange={changeDrawInfo} />
                                <Button variant="contained" onClick={doChangeDrawInfo}>保存</Button>
                            </div>
                        ) : ''
                    }
                </div>
                <div>
                    {
                        nowSelectObj !== null ? (
                            <>
                                <Button onClick={() => changeAlignCenter('h')} startIcon={<AlignHorizontalCenterIcon />}>横向居中</Button>
                                <Button onClick={() => changeAlignCenter('v')} startIcon={<AlignVerticalCenterIcon />}>纵向居中</Button>
                                <Button onClick={deleteObject} startIcon={<DeleteIcon />}>删除对象</Button>
                                <Button onClick={getActiveObject} startIcon={<InfoIcon />}>获取对象信息</Button>
                            </>
                        ) : ''
                    }
                </div>
                <div>
                    <Button onClick={exportJson} startIcon={<FileDownloadIcon />}>导出json</Button>
                    <Button onClick={exportImg} startIcon={<GetAppIcon />}>导出图片</Button>
                    {/* <Button onClick={exportSvg}>导出SVG</Button> */}
                </div>
            </div>
        </div>
    )
}