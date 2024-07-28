import { useState, useContext, useEffect, useRef } from 'react'
import { SVG, Ellipse } from '@svgdotjs/svg.js'
import { setRef } from '@mui/material'

export default function GuideIndex() {
    const svgRef = useRef(null);
    const [config, setConfig] = useState({
        oneWidth: 180,
        oneHeight: 240,
        textPadding: 30,
        lineHeightPadding: 10,
        crossLineThick: 40,
        moveDown: 100,
        maxWidth: 1920,

        circleR: 20,
        circleFill: '#fff',
        circleStrokeWidth: 10,

        hlineNext: 15,
        hlineNextText: 20,
        nameToEnName: 15,
        circleY: 100,
        downText: {
            hLineText: 125,
        },
        upText: {

        }
    })
    const [station, setStation] = useState({
        "lineColor": "#eee",
        "name": "7号线",
        "prefixName": "上海轨道交通",
        "width": 1440,
        "height": 900,
        "stations": [{
            "station_name": "花木路",
            "station_en_name": ["Site of the first CPC", "National Congress xintiandi"],
            "changeLine": true,
        }, {
            "station_name": "一大会址 淮海中路",
            "station_en_name": ["Site of the first CPC", "National Congress xintiandi"],
            "changeLine": true,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Site of the first CPC", "National Congress xintiandi"], 
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }, {
            "station_name": "上海西站",
            "station_en_name": ["Shanghaixi Station"],
            "changeLine": false,
        }]
    })

    useEffect(() => {
        genSvg()
    }, []);

    const genSvg = () => {
        const svg = SVG().addTo(svgRef.current).size(station.width, station.height);
        svg.text(station.prefixName + station.name + "运行线路示意图").attr("x", "50%").attr("y", 50)
        svg.line(config.oneWidth / 2, 2 * config.moveDown, station.stations.length * config.oneWidth - config.oneWidth / 2, 2 * config.moveDown).stroke({ color: station.lineColor, width: 10 })
        for (let i = 0; i < station.stations.length; i++) {
            if (i % 2 === 0) {
                let group = svg.group()
                group.transform({
                    translateX: i * config.oneWidth,
                    translateY: config.moveDown,
                })
                let item = SVG().addTo(svg).size(config.oneWidth, config.oneHeight);
                item.circle(config.circleR).radius(config.circleR).stroke({ color: station.lineColor, width: config.circleStrokeWidth }).attr("cx", "50%").attr("cy", config.circleY).fill(config.circleFill)
                item.line((config.oneWidth) / 2, config.downText.hLineText, (config.oneWidth) / 2, config.downText.hLineText + config.hlineNext).stroke({ color: station.lineColor, width: 2 })
                item.line((config.oneWidth - (config.oneWidth / 2)) / 2, config.downText.hLineText + config.hlineNext, (config.oneWidth - (config.oneWidth / 2)) / 2 + config.oneWidth / 2, config.downText.hLineText + config.hlineNext).stroke({ color: station.lineColor, width: 2 })
                let innerGroup = item.group()
                innerGroup.attr("alignment-baseline", "middle").attr("text-anchor", "middle")
                innerGroup.text(station.stations[i].station_name).attr("x","50%").attr("y", config.downText.hLineText + config.hlineNext + config.hlineNextText)
                for (let j = 0; j < station.stations[i].station_en_name.length; j++) {
                    innerGroup.text(station.stations[i].station_en_name[j]).attr("x","50%").attr("y", config.downText.hLineText + config.hlineNext + config.hlineNextText + config.nameToEnName + j * 15)
                }
                group.add(item)
                if(station.stations[i].changeLine) {
                    let groupChange = svg.group()
                    groupChange.transform({
                        translateX: i * config.oneWidth,
                        translateY: config.moveDown,
                    })
                    let itemChange = SVG().addTo(svg).size(config.oneWidth, config.oneHeight);
                    itemChange.ellipse(20, 32).radius(20, 25).stroke({ color: "#000", width: config.circleStrokeWidth }).attr("cx", "50%").attr("cy", config.circleY).fill( "#fff")
                    //itemChange.polygon([[0,0], [100,50], [50,100], [150,50], [200,50]]).fill('#f06').stroke({ width: 1 })
                    let innnerG = itemChange.group()
                    innnerG.transform({
                        translateX: 0,
                        translateY: 80,
                        scaleX:0.01,
                        scaleY:-0.01,
                    })
                    innnerG.path('M9079 6154 l-24 -26 -3 -694 -2 -694 -4481 0 c-4886 0 -4536 4 -4559 -55 -13 -35 -14 -2934 0 -2969 5 -14 23 -32 39 -41 27 -13 486 -15 4515 -15 l4486 0 2 -694 3 -694 24 -26 c29 -31 84 -35 121 -9 14 10 747 609 1630 1332 883 723 1680 1376 1772 1450 91 75 174 150 183 167 19 32 16 65 -8 95 -11 15 -3526 2846 -3577 2882 -37 26 -92 22 -121 -9z').fill("#000000").stroke({ color:"red",width:10 })
                    groupChange.add(itemChange)
                }
            } else {
                let group = svg.group()
                group.transform({
                    translateX: i * config.oneWidth,
                    translateY: config.moveDown,
                })
                let item = SVG().addTo(svg).size(config.oneWidth, config.oneHeight);
                item.circle(config.circleR).radius(config.circleR).stroke({ color: station.lineColor, width: config.circleStrokeWidth }).attr("cx", "50%").attr("cy", config.circleY).fill(config.circleFill)
                item.line((config.oneWidth) / 2, config.circleY - config.circleR - config.hlineNextText, (config.oneWidth) / 2, config.circleY - config.circleR).stroke({ color: station.lineColor, width: 2 })
                item.line((config.oneWidth - (config.oneWidth / 2)) / 2, config.circleY - config.circleR - config.hlineNextText, (config.oneWidth - (config.oneWidth / 2)) / 2 + config.oneWidth / 2, config.circleY - config.circleR - config.hlineNextText).stroke({ color: station.lineColor, width: 2 })
                let innerGroup = item.group()
                innerGroup.attr("alignment-baseline", "middle").attr("text-anchor", "middle")
                innerGroup.text(station.stations[i].station_name).attr("x","50%").attr("y", config.circleY - config.circleR - config.hlineNextText - config.hlineNext - config.nameToEnName)
                for (let j = 0; j < station.stations[i].station_en_name.length; j++) {
                    innerGroup.text(station.stations[i].station_en_name[j]).attr("x","50%").attr("y", config.circleY - config.circleR - config.hlineNextText - config.hlineNext + j * 10)
                }
                group.add(item)
            }
        }
        return () => {
            svg.remove();
        }
    }

    return (
        <div>
            <div ref={svgRef} />
            {/* <svg width={station.width}
            height={station.height}>
            <text x="45%" y="50"></text>
            <line
                x1=
                y1={}
                x2={}
                y2={}
                stroke={}
                strokeWidth="10"
            />
            {
                station.stations.map((value, index) => (
                    (
                        index % 2 === 0 ? (
                            <g
                                key={index}
                                transform={'translate(' + index * config.oneWidth + ', ' + config.moveDown + ')'}
                            >
                                <svg
                                    width={config.oneWidth}
                                    height={config.oneHeight}
                                >
                                    <circle
                                        cx="50%"
                                        cy={config.circleY}
                                        r={config.circleR}
                                        fill={config.circleFill}
                                        strokeWidth={config.circleStrokeWidth}
                                        stroke={station.lineColor}
                                    />
                                    <line
                                        x1={(config.oneWidth) / 2}
                                        y1={config.downText.hLineText}
                                        x2={(config.oneWidth) / 2}
                                        y2={config.downText.hLineText + config.hlineNext}
                                        stroke={station.lineColor}
                                        strokeWidth="2"
                                        fontSize={14}
                                    />
                                    <g
                                        alignmentBaseline="middle"
                                        textAnchor="middle"
                                    >
                                        <line
                                            x1={(config.oneWidth - (config.oneWidth / 2)) / 2}
                                            y1={config.downText.hLineText + config.hlineNext}
                                            x2={(config.oneWidth - (config.oneWidth / 2)) / 2 + config.oneWidth / 2}
                                            y2={config.downText.hLineText + config.hlineNext}
                                            stroke={station.lineColor}
                                            strokeWidth="2"
                                        />
                                        <text
                                            x="50%"
                                            y={config.downText.hLineText + config.hlineNext + config.hlineNextText}
                                            fontWeight="bold"
                                        ><tspan>{value.station_name}</tspan></text>
                                        <text
                                            x="50%"
                                            fontSize={10}
                                        >
                                            {
                                                value.station_en_name.map((tV, tI) => (
                                                    <tspan x="50%" y={config.downText.hLineText + config.hlineNext + config.hlineNextText + config.nameToEnName + tI * 10} key={tI}>{tV}</tspan>
                                                ))
                                            }
                                        </text>
                                    </g>
                                </svg>
                            </g>
                        ) : (
                            <g key={"2222"+index}>
                                <g
                                    key={index}
                                    transform={'translate(' + index * config.oneWidth + ', ' + config.moveDown + ')'}
                                >
                                    <svg
                                        width={config.oneWidth}
                                        height={config.oneHeight}
                                    >
                                        <circle
                                            cx="50%"
                                            cy={config.circleY}
                                            r={config.circleR}
                                            fill={config.circleFill}
                                            strokeWidth={config.circleStrokeWidth}
                                            stroke={station.lineColor}
                                        />
                                        <line
                                            x1={}
                                            y1={}
                                            x2={}
                                            y2={}
                                            stroke={station.lineColor}
                                            strokeWidth="2"
                                            fontSize={14}
                                        />
                                        <g
                                            alignmentBaseline="middle"
                                            textAnchor="middle"
                                        >
                                            <line
                                                x1={}
                                                y1={}
                                                x2={}
                                                y2={}
                                                stroke={station.lineColor}
                                                strokeWidth="2"
                                            />
                                            <text
                                                x="50%"
                                                y={}
                                                fontWeight="bold"
                                            ><tspan>{value.station_name}</tspan></text>
                                            <text
                                                x="50%"
                                                fontSize={10}
                                            >
                                                {
                                                    value.station_en_name.map((tV, tI) => (
                                                        <tspan x="50%" y={} key={tI}>{tV}</tspan>
                                                    ))
                                                }
                                            </text>
                                        </g>
                                    </svg>
                                    {
                                        getDownRec()
                                    }
                                </g>
                            </g>
                        )
                    )
                ))
            }
        </svg> */}
        </div>
    )
}