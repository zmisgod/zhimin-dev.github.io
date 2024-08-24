import React, { useEffect, useRef, useState, useMemo } from 'react';
import { fabric } from 'fabric';
import Button from '@mui/material/Button';
import { SVG } from "@svgdotjs/svg.js";
import '@svgdotjs/svg.draggable.js'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import shJson from './sh.json'
import { Svg } from '@svgdotjs/svg.js';
import MathetroData from './metrodata'

export default function Metro() {
    const SVGWrapperRefElement = useRef(null);
    const drawRef = useRef(null); // 存储 SVG 画布的引用
    const mouseHold = useRef(null); // 当前是否鼠标按压
    
    // const SVGContainer = useMemo(() => SVG(), []);
    const [open, setOpen] = useState(false);
    const [nowRouter, setNowRouter] = useState('draw_map');// 0空 1车站列表 2 地铁图
    const [startPoint, setStartPoint] = useState({x:350,y:285})
    const [changePoint, setChangePoint] = useState({x:350,y:385})
    const [paths, setPaths] = useState([{ startX: 350, startY: 285, endX: 350, endY: 385 }])
    const [menuList, setMenuList] = useState([{
        "name": "车站",
        "key": 'statiom_list',
        "icon": '',
    }, {
        "name": "画图",
        "key": 'draw_map',
        "icon": '',
    }]);// 菜单列表
    const [lineList, setLineList] = useState(shJson);
    const [nowSelectedLine, setNowSelectedLine] = useState(null);
    const [svgStyle, setSvgStyle] = useState({
        width: 1000,
        height: 1000,
        circleColor: '#000',
        circleWidth: 10,
    })

    const selectedStationNodeRef = useRef(null);

    const updatePath = (startX, startY, endX, endY) => {
        const updatedPaths = paths.map(path => {
            // const key = `${path.startX},${path.startY}-${path.endX},${path.endY}`;
            // const newKey = `${startX},${startY}-${endX},${endY}`;
            // if (key === newKey) {
                // 更新路径的坐标
            return { startX, startY, endX, endY };
            // }
            // return path;
        });
        console.log('----', endX, endY, updatedPaths)

        setPaths(updatedPaths);
        drawPaths(drawRef.current, updatedPaths);
    };

    const addPath = (startX, startY, endX, endY) => {
        const newPath = { startX, startY, endX, endY };
        setPaths(prevPaths => [...prevPaths, newPath]);
        drawPaths(drawRef.current, [...paths, newPath]);
    };

    const drawStations = (draw) => {
        // 清空画布
        draw.clear();
        shJson.map((val,index) => {
            val.stations.map((s, sIndex) => {
                let id = s.x+ "-"+s.y
                let group;
                if ((s.x > 0 && s.y > 0) || s.station_name_position !== undefined) {
                     group = draw.group().translate(s.x, s.y).attr("id", id)
                }
                if (s.x > 0 && s.y > 0) {
                    group.circle(svgStyle.circleWidth).
                    stroke({ color: svgStyle.circleColor }).
                    fill("#fff").
                    move(-svgStyle.circleWidth / 2, -svgStyle.circleWidth / 2);
                }
                if (s.station_name_position !== undefined) {
                    group.text(s.station_name).
                    move(0, 5).
                    font({ fontWeight: 'bold', family: 'Inconsolata' });
                }
            })
        })
    }

    const drawPaths = (draw, paths) => {
        // 清空画布
        // draw.clear();
        // 绘制所有路径
        paths.forEach(({ startX, startY, endX, endY }) => {
            let d = new MathetroData({x:startX, y:startY}, {x:endX, y:endY}, 3).getPath()
            draw.path(d).fill('none').stroke({ width: 1, color: 'black' }).attr('id', `${startX},${startY}-${endX},${endY}`);
        });
    };


    useEffect(() => {
        if (nowRouter === 'draw_map') {
            drawRef.current = SVG().addTo(SVGWrapperRefElement.current).size(svgStyle.width, svgStyle.height);
            drawRef.current.on('click', (e) => {
                e.preventDefault()
                console.log('click')
                // mouseHold.current  = true
            //     if(e.target && e.target.localName === 'text') {
            //         let parent = e.target.instance.parent()
            //         parent.node.instance.css({ cursor: 'pointer', fill: '#f03' })
            //         selectedStationNodeRef.current = parent
            //         selectedStationNodeRef.current.draggable()
            //     }
            })
            drawRef.current.on('mouseup', (e) => {
                e.preventDefault()
                if(mouseHold.current) {
                    console.log("当前按住，准备解除")
                }
                mouseHold.current = false
                if(selectedStationNodeRef.current !== null) {
                    
                }
            })
            drawRef.current.on('mousemove', (e) => {
                e.preventDefault()
                if(mouseHold.current) {
                    console.log("当前按压移动")
                }else{
                    console.log("当前非按压移动")
                }
                if (mouseHold.current) {
                    console.log('mouse down and move')
                    if(e.target.nodeName.toLowerCase() !== 'svg') {
                        if(selectedStationNodeRef.current !== null 
                        ) {
                            console.log("mouse move", e)
                            let x = e.clientX - 64
                            let y=  e.clientY - 64
                            // let p = new MathetroData(startPoint, {x:e.clientX, y:e.clientY}, 3).getPath()
                            if(paths.length === 0) {
                                addPath(startPoint.x, startPoint.y, x,y)
                            }else{
                                updatePath(startPoint.x, startPoint.y, x,y)
                            }
                        }
                    }
                }
            })
            drawRef.current.on('touchstart', (e) => {
                console.log('touchstart----',e)
            })
            drawRef.current.on('mousedown', (e) => {
                if(!mouseHold.current) {
                    console.log("当前非按住，准备按压")
                }
                mouseHold.current  = true
                console.log('mousedown----',e)
                e.preventDefault()
                console.log('mousedown',e)
                if(selectedStationNodeRef.current !== null) {
                    console.log("down clear")
                    selectedStationNodeRef.current.node.instance.css({ cursor: 'pointer', fill: '#000' })
                    selectedStationNodeRef.current.draggable(false)
                    selectedStationNodeRef.current = null
                }else{
                    if(e.target && e.target.localName === 'tspan') {
                        let parent = e.target.instance.parent().parent()
                        parent.node.instance.css({ cursor: 'pointer', fill: '#f03' })
                        selectedStationNodeRef.current = parent
                        selectedStationNodeRef.current.draggable()
                    }
                }
            })
            // draw.group().addClass('1-200-100-400-600').path("M200 100 L 400 600").fill("none").stroke({ color: '#000', width: 6, linecap: 'round', linejoin: 'round' });
            // for (let line = 0; line < lineList.length; line++) {
            //     if(lineList[line].line_no !== 1) {
            //         continue;
            //     }

            //     for (let i = 0; i < lineList[line].stations.length; i++) {
            //         let pointList = lineList[line].stations[i];
            //         if (pointList.x === undefined || pointList.x === 0) {
            //             continue;
            //         }
            //         var group = drawRef.current.group();
            //         if (pointList.nextPoint !== undefined && pointList.nextPoint.length > 0) {
            //             for (let next = 0; next < pointList.nextPoint.length; next++) {
            //                 let onePoint = pointList.nextPoint[next]
            //                 let angle_width = onePoint.angle_width;
            //                 let y_max_len = onePoint.y - pointList.y;
            //                 let max_len = y_max_len;
            //                 let x_max_len = onePoint.x - pointList.x;
            //                 if (x_max_len > y_max_len) {
            //                     max_len = x_max_len
            //                 }
            //                 if (onePoint.angle_percent > 0) {
            //                     if (max_len > 0) {
            //                         angle_width = max_len * onePoint.angle_percent / 3
            //                     }
            //                 }
            //                 if (max_len < angle_width) {
            //                     angle_width = max_len
            //                 }
            //                 let pathStr = ""
            //                 if (onePoint.angle == 90) {
            //                     pathStr = cal90(pointList.x, pointList.y, onePoint.x, onePoint.y, angle_width, svgStyle.circleWidth);
            //                 } else if (onePoint.angle == 270) {
            //                     pathStr = cal270(pointList.x, pointList.y, onePoint.x, onePoint.y, angle_width, svgStyle.circleWidth);
            //                 } else if (onePoint.angle == 135) {
            //                     pathStr = cal135(pointList.x, pointList.y, onePoint.x, onePoint.y, angle_width, svgStyle.circleWidth);
            //                 } else if (onePoint.angle == 225) {
            //                     pathStr = cal225(pointList.x, pointList.y, onePoint.x, onePoint.y, angle_width, svgStyle.circleWidth);
            //                 } else {
            //                     pathStr = calDirect(pointList.x, pointList.y, onePoint.x, onePoint.y, angle_width, svgStyle.circleWidth);
            //                 }
            //                 if (pathStr !== '') {
            //                     let path = group.path(pathStr);
            //                     path.fill("none").move(pointList.x, pointList.y);
            //                     path.stroke({ color: lineList[line].line_color, width: lineList[line].strokeWidth??6, linecap: 'round', linejoin: 'round' });
            //                 }
            //             }
            //         }
            //         let x = `1-${pointList.x}-${pointList.y}`
            //         let stationGroup = group.group().translate(pointList.x, pointList.y)
            //         // 首站
            //         stationGroup.circle(svgStyle.circleWidth).
            //         stroke({ color: svgStyle.circleColor }).
            //         fill("#fff").
            //         move(-svgStyle.circleWidth / 2, -svgStyle.circleWidth / 2);

            //         if (pointList.station_name_position !== undefined) {
            //             stationGroup.text(pointList.station_name).
            //             move(0, 5).
            //             font({ fontWeight: 'bold', family: 'Inconsolata' });
            //         }
            //     }
            // }
            drawStations(drawRef.current)
            return () => {
                drawRef.current.clear(); // 清空画布
                SVGWrapperRefElement.current.innerHTML = ''
            };
        }
    }, [nowRouter])

    const calDirect = (x1, y1, x2, y2, angle_width, circleWidth) => {
        let mPoint = [x1, y1]
        let lEnd = [x2, y2]
        return `M${mPoint[0]},${mPoint[1]} L${lEnd[0]},${lEnd[1]}`
    }

    const cal270 = (x1, y1, x2, y2, angle_width, circleWidth) => {
        let left = 20;
        let mPoint = [x1, y1]
        let lStart = [x1, y2 - left]
        let cPoint = [[x1, y2], [x1 + left, y2], [x1 + left, y2]]
        let lEnd = [x2, y2]
        return `M${mPoint[0]},${mPoint[1]} L${lStart[0]},${lStart[1]} C${cPoint[0][0]},${cPoint[0][1]} ${cPoint[1][0]},${cPoint[1][1]}  ${cPoint[2][0]},${cPoint[2][1]} L${lEnd[0]},${lEnd[1]}`
    }

    const cal90 = (x1, y1, x2, y2, angle_width, circleWidth) => {
        let left = 20;
        let mPoint = [x1, y1]
        let lStart = [x1, y2 - left]
        let cPoint = [[x1, y2], [x1 + left, y2], [x1 + left, y2]]
        let lEnd = [x2, y2]
        return `M${mPoint[0]},${mPoint[1]} L${lStart[0]},${lStart[1]} C${cPoint[0][0]},${cPoint[0][1]} ${cPoint[1][0]},${cPoint[1][1]}  ${cPoint[2][0]},${cPoint[2][1]} L${lEnd[0]},${lEnd[1]}`
    }

    const cal225 = (x1, y1, x2, y2, angle_width, circleWidth) => {
        let mPoint = [x1, y1]
        let nextPoint = [x1 + angle_width, y1];
        let lEnd = [x2, y2]
        return `M${mPoint[0]},${mPoint[1]} L${nextPoint[0]},${nextPoint[1]} L${lEnd[0]},${lEnd[1]}`
    }

    const cal135 = (x1, y1, x2, y2, angle_width, circleWidth) => {
        let mPoint = [x1, y1]
        let lEnd = [x2, y2]
        let nextPoint = [x2 - angle_width, y2];
        return `M${mPoint[0]},${mPoint[1]} L${nextPoint[0]},${nextPoint[1]} L${lEnd[0]},${lEnd[1]}`
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const changeRouter = (val) => {
        setNowRouter(val);
    }

    const chooseLine = (val) => {
        setNowSelectedLine(val)
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {menuList.map((value, index) => (
                    <ListItem key={value.key} disablePadding onClick={() => changeRouter(value.key)}>
                        <ListItemButton>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={value.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Metro Map地铁地图
                        </Typography>
                        {/* <Button color="inherit">Login</Button> */}
                    </Toolbar>
                </AppBar>
            </Box>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            {
                nowRouter === 'draw_map' ? (
                    <div ref={SVGWrapperRefElement} />
                ) : ''
            }
            {
                nowRouter === 'statiom_list' ? (
                    <Box style={{ padding: '10px 40px' }}>
                        {/* <Button variant="contained">新增车站</Button> */}

                        <div style={{ display: 'flex' }}>
                            <div>
                                {
                                    lineList.map((value, index) => (
                                        <div key={index}
                                            onClick={() => chooseLine(value)}
                                            style={{
                                                width: '200px',
                                                border: '1px solid #fff',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                backgroundColor: value.line_color,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {value.line_name}
                                        </div>
                                    ))
                                }
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                {
                                    nowSelectedLine !== null ? (
                                        <div>
                                            <div>当前已选择：<b style={{ fontSize: '16px' }}>{nowSelectedLine.line_name}</b></div>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                textDecoration: 'underline',
                                            }}>
                                                {
                                                    nowSelectedLine.stations.map((value, index) => (
                                                        <div key={index} style={{ padding: '5px 10px' }}>
                                                            {value.station_name}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ) : ''
                                }
                            </div>
                        </div>
                    </Box>
                ) : ''
            }
        </div>
    )
}