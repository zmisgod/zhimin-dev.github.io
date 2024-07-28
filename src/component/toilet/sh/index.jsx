import React, { useState, useContext, useEffect, useRef } from "react"
import indexScss from "./index.module.css";
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';

export default function ToiletShangHai() {
    const [list, setList] = useState([])
    const [nowSelectedLine, setNowSelectedLine] = useState(0)
    const [nowYear, setNowYear] = useState(0)
    const [errorMsg, setErrorMsg] = useState('')
    const [hasError, setHasError] = useState(false)
    const [nowVal, setNowVal] = useState(null)
    const [showList, setShowList] = useState([])
    const [sort, setSort] = useState(0)
    const [city, setCity] = useState('上海')


    useEffect(() => {
        getData()
        setNowYear(new Date().getFullYear())
    }, [])

    const getData = () => {
        let url = "https://static.zmis.me/web/metro/api/sh.json"
        axios.get(url).then(res => {
            setList(res.data)
        }).catch(err => {
            handleClose()
        })
    }

    const selectedLine = (key) => {
        let one = list[key]
        setNowVal(one)
        setNowSelectedLine(one.line_no)
        setShowList(one.stations)
        window.scroll({ top: 0 })
    }

    const resetMenu = () => {
        setNowVal(null)
        setNowSelectedLine(0)
        setShowList([])
        window.scroll({ top: 0 })
    }

    const handleClose = () => {
        setErrorMsg('接口请求失败，刷新页面后重试')
        setHasError(true)
    }

    const changeLineHead = () => {
        let one = showList
        let two = one.reverse()
        if (sort == 0) {
            setSort(1)
        }else{
            setSort(0)
        }
        setShowList(two)
    }

    return (
        <div className={indexScss.container}>
            <Snackbar
                open={hasError}
                autoHideDuration={6000}
                message={errorMsg}
            />
            <p className={indexScss.title}>{city}轨道交通厕所查询</p>
            {
                nowSelectedLine === 0 ? (
                    list.length > 0 ? (
                        list.map((value, index) => (
                            <div className={indexScss.oneLine}
                                onClick={() => selectedLine(index)}
                                key={index} style={{
                                    "backgroundColor": value.line_color,
                                }}>
                                <div className={indexScss.lineName}>
                                    {value.line_name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>正在加载数据，请稍后...</div>
                    )
                ) : ''
            }
            {
                nowSelectedLine !== 0 && nowVal !== null ? (
                    <div className={indexScss.menuGuide}>
                        <div className={indexScss.menuOperate}>
                            <div className={indexScss.selectedLine}>
                                已选择：<span style={{ "backgroundColor": nowVal.line_color }}>{nowVal.line_name}</span>
                            </div>
                            <div className={indexScss.resetMenu} onClick={resetMenu}>【重新选择】</div>
                            <div className={indexScss.resetMenu} onClick={changeLineHead}>【调整方向】</div>
                        </div>
                        <div className={indexScss.stationList}>
                            {
                                showList.map((station, k) => (
                                    <div className={indexScss.oneStation} key={k+'-'+sort}>
                                        <div className={indexScss.stationName}>{station.station_name}</div>
                                        <div className={indexScss.toiletInfo}>
                                            {
                                                station.toilet.toilet.map((toilet, tId) => (
                                                    <div className={indexScss.toiletList} key={tId}>
                                                        <div className={indexScss.toiletLine} style={{ "backgroundColor": toilet.line_color }}>{toilet.line_name}</div>
                                                        <div className={indexScss.toiletDesc}>{toilet.description}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : ('')
            }
            <p className={indexScss.footer}><a href="//zmis.me/">知敏studio</a>@{nowYear}</p>
        </div>
    )
}