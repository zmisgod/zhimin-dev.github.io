import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import Button from '@mui/material/Button';

export default function ImaxPoster() {

    const canvasEl = useRef(null);
    const [canvasCli, setCanvasCli] = useState(null)
    const [bgInfo, setBgInfo] = useState({ width: 1000, height: 1000 })

    const [mapList, setMapList] = useState([{
        "name": "一号线",
        "lineId": 1,
        "color": "red",
        "lineType": "metro",
        "stations": [
            { "name": "丰庄站", "x": 121, "y": 222 },
            { "name": "祁连山南路", "x": 180, "y": 222 },
            { "name": "真北路", "x": 220, "y": 282 }
        ],
        "lines": [
            {
                "startPoint": [121, 222],
                "endPoint": [180, 222],
                "lines": [
                    { "start": [121, 222], "end": [180, 222], "linkedType": "strict" }
                ]
            },
            {
                "startPoint": [180, 222],
                "endPoint": [220, 282],
                "lines": [
                    { "start": [180, 222], "end": [220, 282], "linkedType": "curve" },
                ]
            }
        ]
    }])

    const updateCanvasContext = (canvas) => {
        if (canvas !== null) {
            canvas.selection = false; // disable group selection
            setCanvasCli(canvas)
        } else {
            setCanvasCli(null)
        }
    }

    useEffect(() => {
        const options = {
            width: bgInfo.width,
            height: bgInfo.height
        };
        const canvas = new fabric.Canvas(canvasEl.current, options);
        updateCanvasContext(canvas);
        return () => {
            updateCanvasContext(null);
            canvas.dispose();
        }
    }, []);

    const doDrawLines = () => {
        
        for (let i = 0; i < mapList.length; i++) {
            for (let lines = 0; lines < mapList[i].lines.length; lines++) {
                for (let oneLine = 0 ; oneLine < mapList[i].lines[lines].lines.length;oneLine ++) {
                    if(mapList[i].lines[lines].lines[oneLine].linkedType === 'strict') {
                        let oneStation = makeLine(mapList[i].lines[lines].lines[oneLine].start, mapList[i].lines[lines].lines[oneLine].end)
                        canvasCli.add(oneStation)
                    }else if(mapList[i].lines[lines].lines[oneLine].linkedType === 'curve') {
                        let start = mapList[i].lines[lines].lines[oneLine].start
                        let end = mapList[i].lines[lines].lines[oneLine].end
                        var curve = new fabric.Path('M '+start[0]+' '+start[1]+' Q '+(start[0]+end[0])/2+' '+start[1]+', '+end[0]+' '+end[1], {
                            fill: '',
                            stroke: 'red',
                            strokeWidth: 5,
                            selectable: false,
                            hasBorders: false,
                            hasControls: false
                        });
                        canvasCli.add(curve)
                    }
                }
            }
        }
        for (let i = 0; i < mapList.length; i++) {
            for (let station = 0; station < mapList[i].stations.length; station++) {
                let oneStation = makeStation(mapList[i].stations[station].x, mapList[i].stations[station].y)
                console.log(oneStation)
                canvasCli.add(oneStation)
            }
        }
        console.log('22')
        canvasCli.renderAll();
    }

    const makeStation = (x, y) => {
        var c = new fabric.Circle({
            left: x,
            top: y,
            strokeWidth: 1,
            radius: 3,
            fill: '#fff',
            stroke: '#666',
            selectable: false,
        });
        return c
    }

    const makeLine = (startPoint, endPoint) => {
        return new fabric.Line([startPoint[0], startPoint[1], endPoint[0], endPoint[1]], {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 5,
            selectable: false,
            evented: false,
          });
    }

    return (
        <div>
            <canvas ref={canvasEl} />

            <Button onClick={doDrawLines}>确认</Button>
        </div>
    )
}