import React from "react"
import { Link } from "react-router-dom";
import indexScss from "./index.module.css";

class HomeIndex extends React.Component {
    render() {
        return (
            <div id={indexScss.homeIndexMain}>
                <div className={indexScss.homeIndexContainer}>
                    <h1 className={indexScss.title}>欢迎来到知敏Studio工具</h1> 
                    <div className={indexScss.routeList}>
                        <div className={indexScss.routeItem}>
                            <Link to="/toilet/sh">上海轨道交通厕所查询</Link>
                        </div>
                        <div>
                            <Link to="/map">自制轨道地图</Link>
                        </div>
                        <div>
                            <Link to="/map/guide">自制轨道交通名牌</Link>
                        </div>
                        <div>
                            <Link to="/imax/poster">IMAX海报</Link>
                        </div>
                        <div>
                            <Link to="/metro/metro">metro map</Link>
                        </div>
                        <div>
                            <Link to="/epark">e parking tag</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default HomeIndex;