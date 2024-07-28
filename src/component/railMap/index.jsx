import React from "react"
import indexScss from "./index.module.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import canvasToSvg from "canvas-to-svg";
import { SVG } from '@svgdotjs/svg.js'
import exportJson from './export.json';

class Index extends React.Component {
    LinkToDirect = 0
    LinkToLeftD = 1
    LinkToRightD = 2

    circleStroke = 2
    lineStroke = 6
    cirlceWidth = 1

    lineWidth = 18

    dialogModShowLine = 0//显示编辑站点
    dialogModShowStation = 1//显示编辑车站
    dialogModShowDefault = 2//import json
    dialogModBatchUpdateStationInfo = 3 //批量编辑站点信息

    constructor(props) {
        super(props);
        this.state = {
            footerPositionStyle: {
                top: "",
                bottom: "0",
                left: "",
                right: "0"
            },
            footerUpOrDown: 'bottom',
            stations: [],

            importJsonStr: '',
            showDialog: true,//是否新增线路
            dialogMod: this.dialogModShowDefault,//默认模式
            stationIndex: -1,//车站索引
            drawLineIndex: -1,
            lineObj: {
                name: "",
                lineColor: ""
            },
            stationObj: {
                name: '',
                geo: {
                    x: 0,
                    y: 0,
                }
            },
            nowMode: 0,// -1暂无，0画图模式 1草稿模式 2站点模式
            selectePointColor: "black",
            bgCanvas: null,
            canvasInfo: {
                rowNum: 150,//一行几个
                colNum: 100,//一列几个
                sideLength: 20,//每个方块的边长
            },
            lineIndex: -1,//当前选择的线路索引
            listLines: exportJson,
        };
    }

    componentDidMount() {
        this.createBgCanvas()
    }

    importJson = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].canvas === undefined) {
                arr[i].canvas = null
            }
            if (arr[i].canvasCtx === undefined) {
                arr[i].canvasCtx = null
            }
            if (arr[i].svgCanvas === undefined) {
                arr[i].svgCanvas = null
            }
        }
        this.setState({ listLines: arr })
    }

    getPointIndex(x, y) {
        const { canvasInfo } = this.state
        return [
            parseInt(x / canvasInfo.sideLength, 10),
            parseInt(y / canvasInfo.sideLength, 10),
        ]
    }

    getCenterPositionByPointIndex(pointIndexX, pointIndexY) {
        const { canvasInfo } = this.state
        return [
            pointIndexX * canvasInfo.sideLength + canvasInfo.sideLength / 2,
            pointIndexY * canvasInfo.sideLength + canvasInfo.sideLength / 2
        ]
    }

    showHoverLine(x, y) {
        console.log(x, y)
    }

    download = () => {
        const { listLines } = this.state
        let row = []
        for (let i = 0; i < listLines.length; i++) {
            row.push({
                "name": listLines[i].name,
                "lineNumber": listLines[i].lineNumber,
                "draftPoint": listLines[i].draftPoint,
                "saveLines": listLines[i].saveLines,
                "lineColor": listLines[i].lineColor,
                "lineWidth": listLines[i].lineWidth,
                "lastClick": listLines[i].lastClick,
                'stations': listLines[i].stations,
            })
        }
        let a = document.createElement('a')
        let str = JSON.stringify(row)
        let blob = new Blob([str])
        let url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = 'metro-map-' + (new Date()).getTime() + ".json"
        a.click()
    }

    //检查2点是否可以连成线
    checkTwoLineCanLink(lastPoint, nowPoint) {
        if (lastPoint === null) {
            return true
        }
        if (lastPoint[1] === nowPoint[1]) {
            return true
        } else if (lastPoint[0] === nowPoint[0]) {
            return true
        } else {
            return this._doFillSlope(lastPoint, nowPoint)
        }
    }

    _doFillSlope = (one, two) => {
        return true
    }

    clickHandler = (e) => {
        const { lineIndex, listLines, nowMode } = this.state
        console.log("handle click handler")
        if (lineIndex === -1) {
            return
        }
        if (nowMode === 1) {
            console.log("-----clickDraftHandler")
            this.clickDraftPointHandler(e)
            return
        } else if (nowMode === 2) {
            return
        }
        console.log("-----clickHandler")
        let positionColInfo = this.getPointIndex(e.pageX, e.pageY)
        let clickPointerCenterPoint = this.getCenterPositionByPointIndex(positionColInfo[0], positionColInfo[1])
        let oneDrawInfo = listLines[lineIndex]
        let _tempLastClick = oneDrawInfo.lastClick
        let canLink = false
        if (this.checkTwoLineCanLink(_tempLastClick, clickPointerCenterPoint)) {
            canLink = true
        }
        if (_tempLastClick !== null && _tempLastClick[0] === clickPointerCenterPoint[0] && _tempLastClick[1] === clickPointerCenterPoint[1]) {
            oneDrawInfo.lastClick = null;
        } else {
            oneDrawInfo.lastClick = clickPointerCenterPoint
            if (canLink && _tempLastClick !== null) {
                oneDrawInfo.saveLines.push({
                    "last": _tempLastClick,
                    "now": clickPointerCenterPoint
                })
            }
        }
        listLines[lineIndex] = oneDrawInfo
        this.setState({
            listLines,
        }, () => {
            this.createDrawCanvas(lineIndex)
        })
    }

    clickDraftPointHandler = (e) => {
        const { lineIndex, listLines } = this.state
        console.log("handle click draft handler")
        if (lineIndex === -1) {
            return
        }
        let positionColInfo = this.getPointIndex(e.pageX, e.pageY)
        let clickPointerCenterPoint = this.getCenterPositionByPointIndex(positionColInfo[0], positionColInfo[1])
        let oneDrawInfo = listLines[lineIndex]
        let _pointArr = oneDrawInfo.draftPoint
        let rows = []
        let isHitSame = false
        for (let i = 0; i < _pointArr.length; i += 1) {
            if (_pointArr[i][0] === clickPointerCenterPoint[0] && _pointArr[i][1] === clickPointerCenterPoint[1]) {
                isHitSame = true
            } else {
                rows.push(_pointArr[i])
            }
        }
        if (!isHitSame) {
            rows.push(clickPointerCenterPoint)
        }
        oneDrawInfo.draftPoint = rows
        listLines[lineIndex] = oneDrawInfo
        this.setState({
            listLines,
        }, () => {
            this.createDrawCanvas(lineIndex)
        })
    }

    createDrawCanvas(lineIndex) {
        const { canvasInfo, listLines, selectePointColor } = this.state
        console.log("start createDrawCanvas lineIndex", lineIndex)
        if (lineIndex === -1) {
            return
        }
        let _canvasCtx = null
        let _canvas = null
        let _svgCanvas = null
        let selectedInfo = listLines[lineIndex]
        if (selectedInfo.canvas === null) {
            _canvas = document.getElementById("draw-canvas-" + lineIndex)
            if (_canvas !== null) {
                _canvas.addEventListener("click", e => {
                    let positionColInfo = this.getPointIndex(e.pageX, e.pageY)
                    let clickPointerCenterPoint = this.getCenterPositionByPointIndex(positionColInfo[0], positionColInfo[1])
                    console.log("construct click ", clickPointerCenterPoint)
                    if (lineIndex !== -1) {
                        const { nowMode, stationObj, listLines, stationIndex, lineIndex } = this.state
                        if (nowMode === 2) {
                            let obj = this.deepCopy(stationObj)
                            obj.geo = {
                                x: clickPointerCenterPoint[0],
                                y: clickPointerCenterPoint[1]
                            }
                            console.log("click stationIndex---", stationIndex, obj)
                            this.setState({ stationObj: obj })
                            if (stationIndex !== -1) {
                                listLines[lineIndex].stations[stationIndex] = obj
                                this.setState({ listLines })
                            } else {
                                obj.name = "第" + (listLines[lineIndex].stations.length + 1) + "站"
                                listLines[lineIndex].stations.push(obj)
                                this.setState({ listLines })
                            }
                            this.createDrawCanvas(lineIndex)
                            return
                        }
                        console.log("handle click listen")
                        this.clickHandler(e)
                    }
                })
                _canvas.width = canvasInfo.rowNum * canvasInfo.sideLength
                _canvas.height = canvasInfo.colNum * canvasInfo.sideLength
                _svgCanvas = new canvasToSvg(_canvas.width, _canvas.height);
                _canvasCtx = _canvas.getContext("2d")
                listLines[lineIndex].canvas = _canvas
                listLines[lineIndex].canvasCtx = _canvasCtx
                listLines[lineIndex].svgCanvas = _svgCanvas
            } else {
                alert("初始化画布失败")
                return
            }
        } else {
            _canvas = selectedInfo.canvas
            _svgCanvas = selectedInfo.svgCanvas
            _canvasCtx = _canvas.getContext("2d")
        }
        _canvas.addEventListener("mousemove", e => {
            console.log(e)
            this.showHoverLine(e.x, e.y)
        })
        //清空画布
        _canvasCtx.clearRect(0, 0, _canvas.width, _canvas.height)
        //svg canvas
        _svgCanvas.clearRect(0, 0, _canvas.width, _canvas.height)

        _canvasCtx.beginPath()
        _svgCanvas.beginPath()
        for (let i = 0; i < selectedInfo.draftPoint.length; i += 1) {
            console.log(selectedInfo.draftPoint[i])
            _canvasCtx.beginPath()
            _canvasCtx.strokeStyle = "red"
            _canvasCtx.arc(selectedInfo.draftPoint[i][0], selectedInfo.draftPoint[i][1], 3, 0, 2 * Math.PI);
            _canvasCtx.stroke()

            _svgCanvas.beginPath()
            _svgCanvas.strokeStyle = "red"
            _svgCanvas.arc(selectedInfo.draftPoint[i][0], selectedInfo.draftPoint[i][1], 3, 0, 2 * Math.PI);
            _svgCanvas.stroke()
        }

        //开始循环画线
        _canvasCtx.lineWidth = selectedInfo.lineWidth;
        _canvasCtx.lineCap = "round";
        _canvasCtx.strokeStyle = selectedInfo.lineColor


        //svg
        _svgCanvas.lineWidth = selectedInfo.lineWidth;
        _svgCanvas.lineCap = "round";
        _svgCanvas.strokeStyle = selectedInfo.lineColor
        let selectedPoint = listLines[lineIndex].saveLines
        console.log("start draw lines")
        console.log(selectedPoint)
        _canvasCtx.beginPath()
        //svg
        _svgCanvas.beginPath()
        for (let i = 0; i < selectedPoint.length; i += 1) {
            console.log(i, selectedPoint[i])
            _canvasCtx.moveTo(selectedPoint[i].last[0], selectedPoint[i].last[1]);
            _canvasCtx.lineTo(selectedPoint[i].now[0], selectedPoint[i].now[1]);

            //svg
            _svgCanvas.moveTo(selectedPoint[i].last[0], selectedPoint[i].last[1]);
            _svgCanvas.lineTo(selectedPoint[i].now[0], selectedPoint[i].now[1]);
        }
        _canvasCtx.stroke()
        //svg
        _svgCanvas.stroke()

        //画车站
        _canvasCtx.beginPath()
        //svg
        _svgCanvas.beginPath()
        for (let i = 0; i < selectedInfo.stations.length; i += 1) {
            if (selectedInfo.stations[i].geo !== undefined && selectedInfo.stations[i].geo.x > 0) {
                _canvasCtx.beginPath()
                _canvasCtx.strokeStyle = "#717171"
                _canvasCtx.arc(selectedInfo.stations[i].geo.x, selectedInfo.stations[i].geo.y, 3, 1, 2 * Math.PI);
                _canvasCtx.stroke()

                _canvasCtx.beginPath()
                _canvasCtx.strokeStyle = "#fff"
                _canvasCtx.arc(selectedInfo.stations[i].geo.x, selectedInfo.stations[i].geo.y, 1, 1, 2 * Math.PI);
                _canvasCtx.stroke()

                //svg

                _svgCanvas.beginPath()
                _svgCanvas.strokeStyle = "#717171"
                _svgCanvas.arc(selectedInfo.stations[i].geo.x, selectedInfo.stations[i].geo.y, 3, 1, 2 * Math.PI);
                _svgCanvas.stroke()

                _svgCanvas.beginPath()
                _svgCanvas.strokeStyle = "#fff"
                _svgCanvas.arc(selectedInfo.stations[i].geo.x, selectedInfo.stations[i].geo.y, 1, 1, 2 * Math.PI);
                _svgCanvas.stroke()
            }
        }

        //画选中的点
        if (selectedInfo.lastClick !== null) {
            _canvasCtx.beginPath()
            _canvasCtx.strokeStyle = selectePointColor
            _canvasCtx.arc(selectedInfo.lastClick[0], selectedInfo.lastClick[1], 1, 0, 2 * Math.PI);
            _canvasCtx.stroke()

            //svg
            _svgCanvas.beginPath()
            _svgCanvas.strokeStyle = selectePointColor
            _svgCanvas.arc(selectedInfo.lastClick[0], selectedInfo.lastClick[1], 1, 0, 2 * Math.PI);
            _svgCanvas.stroke()
        }
    }

    selectOneStation = (value, index) => {
        this.setState({
            nowMode: 2,
            stationIndex: index,
            stationObj: value
        })
    }

    delEditStation = (index) => {
        const { listLines, lineIndex } = this.state
        let row = []
        for (let i = 0; i < listLines[lineIndex].stations.length; i++) {
            if (i !== index) {
                row.push(listLines[lineIndex].stations[i])
            }
        }
        listLines[lineIndex].stations = row
        this.setState({ listLines }, () => {
            this.createDrawCanvas(lineIndex)
        })
    }

    createBgCanvas() {
        const { canvasInfo, listLines, lineIndex } = this.state
        let _canvas = document.getElementById("bg-canvas")
        let width = canvasInfo.rowNum
        let height = canvasInfo.colNum
        let col = canvasInfo.sideLength
        _canvas.width = width * col
        _canvas.height = height * col
        _canvas.style.backgroundColor = "rgba(255,255,255,0.3)"
        _canvas.addEventListener("click", e => {
            if (lineIndex === -1) {
                return
            }
            let positionColInfo = this.getPointIndex(e.pageX, e.pageY)
            let clickPointerCenterPoint = this.getCenterPositionByPointIndex(positionColInfo[0], positionColInfo[1])
            let oneDrawInfo = listLines[lineIndex]
            oneDrawInfo.saveLines.push([clickPointerCenterPoint[0], clickPointerCenterPoint[1]])
            listLines[lineIndex] = oneDrawInfo
            this.setState({
                listLines
            })
            this.createDrawCanvas(lineIndex)
        })
        let _canvasCtx = _canvas.getContext("2d")
        _canvasCtx.strokeStyle = "#eee"
        _canvasCtx.beginPath()
        for (let i = 1; i <= width; i += 1) {
            _canvasCtx.moveTo(col * i, 0);
            _canvasCtx.lineTo(col * i, col * height);
        }
        for (let i = 1; i <= height; i += 1) {
            _canvasCtx.moveTo(0, col * i);
            _canvasCtx.lineTo(col * width, col * i);
        }
        _canvasCtx.stroke();
        this.setState({
            bgCanvas: _canvas,
            canvasCtx: _canvasCtx
        })
    }

    addNewLine = () => {
        this.setState({ lineIndex: -1, showDialog: true, dialogMod: this.dialogModShowLine })
    }

    updateThisLine = () => {
        const { lineObj, lineIndex, listLines } = this.state
        lineObj.name = listLines[lineIndex].name
        lineObj.lineColor = listLines[lineIndex].lineColor
        this.setState({ showDialog: true, dialogMod: this.dialogModShowLine, lineObj })
    }

    closeAddLine = () => {
        this.setState({ showDialog: false, dialogMod: this.dialogModShowLine })
    }

    footerToTop = () => {
        this.setState({ footerUpOrDown: "top" }, () => {
            this.footerTo()
        })
    }

    footerToBotoom = () => {
        this.setState({ footerUpOrDown: "bottom" }, () => {
            this.footerTo()
        })
    }

    draftMode = () => {
        const { nowMode } = this.state
        if (nowMode === 1) {
            this.setState({ nowMode: 2 })
        } else {
            if (nowMode === 2) {
                this.setState({ nowMode: 0 })
            } else {
                this.setState({ nowMode: 1 })
            }
        }
    }

    selectLine = (index) => {
        console.log("select line", index)
        //清空最后的点
        const { listLines, lineIndex } = this.state
        this.setState({ stationIndex: -1 })
        if (lineIndex === -1) {
            //选择新的线路
            this.setState({ lineIndex: index }, () => {
                this.createDrawCanvas(index)
            })
        } else {
            listLines[lineIndex].lastClick = null
            this.setState({ listLines }, () => {
                this.createDrawCanvas(lineIndex)
                //选择新的线路
                this.setState({ lineIndex: index }, () => {
                    this.createDrawCanvas(index)
                })
            })
        }
    }

    footerTo = () => {
        const { footerUpOrDown, footerPositionStyle } = this.state
        let row = this.deepCopy(footerPositionStyle)
        if (footerUpOrDown === 'top') {
            row.top = "0"
            row.bottom = ""
        } else {
            row.top = ""
            row.bottom = "0"
        }
        this.setState({
            footerPositionStyle: row
        })
    }

    deleteThisPoint = () => {
        const { lineIndex, listLines } = this.state
        listLines[lineIndex].lastClick = null
        this.setState({ listLines }, () => {
            this.createDrawCanvas(lineIndex)
        })
    }

    changeLineInfo = (e) => {
        const { lineObj } = this.state
        if (e.target.id === "line_name") {
            lineObj.name = e.target.value
        } else if (e.target.id === "line_color") {
            lineObj.lineColor = e.target.value
        }
        this.setState({ lineObj })
    }

    changeStationInfo = (e) => {
        const { stationObj } = this.state
        console.log(e)
        if (e.target.id === "station_name") {
            stationObj.name = e.target.value
        }
        this.setState({
            stationObj
        })
    }

    exportSvg = () => {
        const { listLines, bgCanvas } = this.state
        var ratio = window.devicePixelRatio || 1;
        var _svg = SVG().size(bgCanvas.width * ratio, bgCanvas.height * ratio)
        for (let i = 0; i < listLines.length; i++) {
            if (listLines[i].svgCanvas !== null) {
                const mySerializedSVG = listLines[i].svgCanvas.getSerializedSvg(); //true here, if you need to convert named to numbered entities.
                _svg.nested().svg(mySerializedSVG)
            }
        }
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, _svg.svg()], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);
        var save_link = document.createElement("a");
        save_link.href = svgUrl;
        save_link.download = Date.parse(new Date()) + '.svg';
        var clickevent = document.createEvent('MouseEvents');
        clickevent.initEvent('click', true, false);
        save_link.dispatchEvent(clickevent);
    }

    saveLine = () => {
        const { lineObj, listLines, lineIndex } = this.state
        if (lineIndex === -1) {
            listLines.push({
                "canvas": null,
                "canvasCtx": null,
                "name": lineObj.name,
                "lineNumber": listLines.length + 1,
                "saveLines": [],
                "lineColor": lineObj.lineColor,
                "lineWidth": this.lineWidth,
                "show": true,
                "lastClick": null,
                "stations": [],
                "draftPoint": []
            })
            this.setState({ listLines: listLines })
        } else {
            listLines[lineIndex].name = lineObj.name
            listLines[lineIndex].lineColor = lineObj.lineColor
            this.setState({ listLines: listLines })
        }
        this.setState({ showDialog: false })
    }

    printData = () => {
        const { listLines, lineIndex, stationIndex, nowMode } = this.state
        console.log(listLines)
        console.log("lineIndex ", lineIndex, " stationIndex ", stationIndex, " nowMode ", nowMode)
    }

    deepCopy = (val) => {
        return JSON.parse(JSON.stringify(val))
    }

    goBack = () => {
        this.setState({ lineIndex: -1 })
    }

    cancelEditStation = (index) => {
        console.log("-- cancelEditStation")
        this.setState({ stationIndex: -1, stationObj: { name: '', 'geo': { x: 0, y: 0 } } })
    }

    editStationName = (value, index) => {
        this.setState({ dialogMod: this.dialogModShowStation, showDialog: true })
    }

    saveStation = () => {
        const { lineIndex, stationIndex, listLines, stationObj } = this.state
        listLines[lineIndex].stations[stationIndex].name = stationObj.name
        this.setState({ lineIndex, showDialog: false })
    }

    selectThisDrawLine = (index) => {
        this.setState({ drawLineIndex: index })
    }

    cancelThisDrawLine = () => {
        this.setState({ drawLineIndex: -1 })
    }

    delThisDrawLine = () => {
        const { lineIndex, listLines, drawLineIndex } = this.state
        console.log("delThisDrawLine--", drawLineIndex)
        let row = []
        for (let i = 0; i < listLines[lineIndex].saveLines.length; i++) {
            if (i !== drawLineIndex) {
                row.push(listLines[lineIndex].saveLines[i])
            }
        }
        listLines[lineIndex].saveLines = row
        this.setState({ listLines, drawLineIndex: -1 }, () => {
            this.createDrawCanvas(lineIndex)
        })
    }

    exportImage = () => {
        const { listLines, bgCanvas } = this.state
        var canvas = document.createElement("canvas");
        var ratio = window.devicePixelRatio || 1;
        canvas.height = bgCanvas.width * ratio
        canvas.width = bgCanvas.height * ratio
        const ctx = canvas.getContext("2d")
        ctx.scale(ratio, ratio)
        for (let i = 0; i < listLines.length; i++) {
            if (listLines[i].canvas !== null) {
                ctx.drawImage(listLines[i].canvas, 0, 0)
            }
        }
        var save_link = document.createElement('a');
        save_link.href = canvas.toDataURL("image/png")
        save_link.download = Date.parse(new Date()) + '.png';
        var clickevent = document.createEvent('MouseEvents');
        clickevent.initEvent('click', true, false);
        save_link.dispatchEvent(clickevent);
    }

    changeImportStr = (e) => {
        if (e.target.id === "json_str") {
            this.setState({ importJsonStr: e.target.value })
        }
    }

    batchUpdateStationInfo = () => {
        const { listLines, lineIndex } = this.state
        let stations = listLines[lineIndex].stations
        this.setState({ stations, showDialog: true,dialogMod: this.dialogModBatchUpdateStationInfo })
    }

    saveImportStr = () => {
        const { importJsonStr } = this.state
        try {
            this.importJson(JSON.parse(importJsonStr))
            this.setState({ showDialog: false })
        } catch (e) {
            alert('解析失败')
        }
    }


    changeStation =(value,index, e) => {
        console.log(e)
        console.log(value)
        console.log(index)
        const {stations} = this.state
        if(e.target.id == "name") {
            stations[index].name= e.target.value
        }else if (e.target.id == "en_name") {
            stations[index].en_name= e.target.value
        }
        this.setState({stations})
    }

    addNewStation = () => {
        const {stations} = this.props
        let row = stations
        if(row === undefined||row === null) {
            row = []
        }
        row.push({"name":"", "en_name":"","geo":{x:0,y:0}})
        this.setState({stations:row})
    }

    saveBatchUpdateStation = () => {
        const {stations, lineIndex, listLines} = this.state
        listLines[lineIndex].stations = stations
        this.setState({listLines})
    }

    deleteThisHeader = (index) => {
        const {stations} = this.state
        let row = [];
        for(let i = 0;i<stations;i++) {
            row.push(stations[i])
        }
        this.setState({stations:row})
     }

    render() {
        const { stations, importJsonStr, drawLineIndex, stationObj, stationIndex, nowMode, footerUpOrDown, listLines, showDialog, lineObj, footerPositionStyle, lineIndex, dialogMod } = this.state
        return (
            <div className={indexScss.main}>
                <Dialog
                    open={showDialog}
                    onClose={this.closeAddLine}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        新增线路
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" component={'div'}>
                            {
                                dialogMod === this.dialogModShowLine ? (
                                    <div>
                                        <div>
                                            <TextField id="line_name" value={lineObj.name} onChange={this.changeLineInfo} label="名称" variant="standard" />
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: "8px"
                                        }}>
                                            <TextField id="line_color" value={lineObj.lineColor} onChange={this.changeLineInfo} label="颜色" variant="standard" />
                                            <div style={{
                                                width: "40px",
                                                height: "20px",
                                                backgroundColor: lineObj.lineColor === '' ? '#fff' : lineObj.lineColor,
                                            }}></div>
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={this.saveLine}>保存</Button>
                                        </div>
                                    </div>
                                ) : ''
                            }
                            {
                                dialogMod === this.dialogModShowStation ? (
                                    <div>
                                        <div>
                                            <TextField id="station_name" value={stationObj.name} onChange={this.changeStationInfo} label="车站名称" variant="standard" />
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={this.saveStation}>保存</Button>
                                        </div>
                                    </div>
                                ) : ''
                            }
                            {
                                dialogMod === this.dialogModShowDefault ? (
                                    <div>
                                        <div>
                                            <TextField id="json_str" value={importJsonStr} multiline rows={4} onChange={this.changeImportStr} label="json" variant="standard" />
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={this.saveImportStr}>保存</Button>
                                        </div>
                                    </div>
                                ) : ''
                            }
                            {
                                dialogMod === this.dialogModBatchUpdateStationInfo ? (
                                    <div>
                                        <div onClick={this.addNewStation}>增加车站</div>
                                        {
                                            stations.map((value, index) => (
                                                <div key={index}>
                                                    <div style={{display: 'flex'}}>
                                                        <div>
                                                            <TextField id="name" value={value.name} onChange={this.changeStation.bind(this, value, index)} label="中文名" variant="standard" />
                                                        </div>
                                                        <div>
                                                            <TextField id="en_name" value={value.en_name} onChange={this.changeStation.bind(this, value, index)} label="英文名" variant="standard" />
                                                        </div>
                                                        <div onClick={() => this.deleteThisHeader(index)} >
                                                            删除
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div>
                                            <Button variant="contained" onClick={this.saveBatchUpdateStation}>保存</Button>
                                        </div>
                                    </div>
                                ) : ''
                            }
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                <div className={indexScss.canvasContainer}>
                    <canvas id="bg-canvas"></canvas>
                    {
                        listLines.map((value, index) => (
                            <canvas id={"draw-canvas-" + index} key={index}></canvas>
                        ))
                    }
                </div>
                <div className={indexScss.footer} style={footerPositionStyle}>
                    <div className={indexScss.footerInner}>
                        {
                            listLines.map((value, index) => (
                                <div className={indexScss.oneExample} key={index} onClick={() => this.selectLine(index)}>
                                    <div className={indexScss.exampleName}>{value.name}</div>
                                    <div style={{ backgroundColor: value.lineColor }} className={indexScss.examplePic}></div>
                                </div>
                            ))
                        }
                        <div onClick={this.addNewLine} style={{
                            'display': 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>增加线路+</div>
                    </div>
                    <div className={indexScss.btnList}>
                        <div>
                            {
                                lineIndex >= 0 ? (
                                    <div className={indexScss.footerHeader}>
                                        <div className={indexScss.footerGoBack} onClick={this.goBack}>🔙返回</div>
                                        <div>当前已选择: {listLines[lineIndex].name}</div>
                                        <div style={{
                                            "overflowX": "scroll",
                                            "maxHeight": "150px",
                                        }}>
                                            {
                                                listLines[lineIndex].stations.map((value, sIndex) => (
                                                    <div key={sIndex}>
                                                        <span onClick={() => this.selectOneStation(value, sIndex)}>{value.name}:({value.geo.x},{value.geo.y})</span>
                                                        {
                                                            stationIndex === sIndex ? (
                                                                <span onClick={() => this.editStationName(value, sIndex)}>[编辑名称] </span>
                                                            ) : ''
                                                        }
                                                        {
                                                            stationIndex === sIndex ? (
                                                                <span onClick={() => this.cancelEditStation(sIndex)}>[取消] </span>
                                                            ) : ''
                                                        }
                                                        {
                                                            stationIndex === sIndex ? (
                                                                <span onClick={() => this.delEditStation(sIndex)}>[删除此站点] </span>
                                                            ) : ''
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div style={{
                                            "overflowX": "scroll",
                                            "maxHeight": "150px",
                                        }}>
                                            {
                                                listLines[lineIndex].saveLines.map((value, lIndex) => (
                                                    <div key={lIndex}>
                                                        <span onClick={() => this.selectThisDrawLine(lIndex)}>第{lIndex + 1}条线段 </span>
                                                        {
                                                            drawLineIndex === lIndex ? (
                                                                <span onClick={() => this.delThisDrawLine(lIndex)}>[删除此线路] </span>
                                                            ) : ''
                                                        }
                                                        {
                                                            drawLineIndex === lIndex ? (
                                                                <span onClick={() => this.cancelThisDrawLine(lIndex)}>[取消] </span>
                                                            ) : ''
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ) : ''
                            }
                        </div>
                        <div>
                            {
                                lineIndex !== -1 ? (
                                    <div>
                                        <Button size="small" variant="contained" onClick={this.updateThisLine}>编辑</Button>
                                        <Button size="small" variant="contained" onClick={this.batchUpdateStationInfo}>批量编辑站点信息</Button>
                                    </div>
                                ) : ''
                            }
                            <Button size="small" variant="contained" onClick={this.printData}>打印当前data</Button>
                            <Button size="small" variant="contained" onClick={this.draftMode}>{nowMode === 1 ? '草稿模式（仅画点）' : (nowMode === 2 ? '新增/编辑车站' : '画图模式')}</Button>
                            <Button size="small" variant="contained" onClick={this.download}>导出数据</Button>
                            <Button size="small" variant="contained" onClick={this.exportImage}>导出图片</Button>
                            <Button size="small" variant="contained" onClick={this.exportSvg}>导出svg图片</Button>
                            {
                                footerUpOrDown !== 'top' ? (
                                    <Button size="small" variant="contained" onClick={this.footerToTop}>⬆️</Button>
                                ) : ''
                            }
                            {
                                footerUpOrDown === 'top' ? (
                                    <Button size="small" variant="contained" onClick={this.footerToBotoom}>⬇️</Button>
                                ) : ''
                            }
                            {
                                lineIndex !== -1 && listLines[lineIndex].lastClick != null ? (
                                    <div onClick={this.deleteThisPoint}>
                                        当前选择<span>{listLines[lineIndex].lastClick[0]}, {listLines[lineIndex].lastClick[1]}X</span>
                                    </div>
                                ) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index;