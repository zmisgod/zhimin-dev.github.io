import React, { useEffect, useState, useRef } from 'react';
import { SVG } from '@svgdotjs/svg.js';

const SvgPathsExample = () => {
    const [paths, setPaths] = useState([]); // 存储路径
    const svgContainerRef = useRef(null); // 创建引用
    const drawRef = useRef(null); // 存储 SVG 画布的引用

    useEffect(() => {
        // 创建 SVG 画布，并将其添加到 svgContainerRef.current
        drawRef.current = SVG().addTo(svgContainerRef.current).size(400, 400);
        
        // 设置初始路径
        const initialPaths = [
            { startX: 10, startY: 10, endX: 90, endY: 90 },
            { startX: 30, startY: 30, endX: 70, endY: 70 },
            { startX: 50, startY: 50, endX: 150, endY: 150 },
        ];

        setPaths(initialPaths);
        drawPaths(initialPaths);
        
        // 清理函数
        return () => {
            svgContainerRef.current.innerHTML = ''; // 清空容器
        };
    }, []);

    const drawPaths = (paths) => {
        // 清空画布
        drawRef.current.clear();
        // 绘制所有路径
        paths.forEach(({ startX, startY, endX, endY }) => {
            const d = `M${startX} ${startY} H ${endX} V ${endY} H ${startX} L ${startX} ${startY}`;
            drawRef.current.path(d).fill('none').stroke({ width: 1, color: 'black' });
        });
    };

    const addPath = (startX, startY, endX, endY) => {
        const newPath = { startX, startY, endX, endY };
        setPaths(prevPaths => [...prevPaths, newPath]);
        drawPaths([...paths, newPath]); // 更新绘制
    };

    const updatePath = (startX, startY, endX, endY) => {
        const updatedPaths = paths.map(path => {
            const key = `${path.startX},${path.startY}-${path.endX},${path.endY}`;
            const newKey = `${startX},${startY}-${endX},${endY}`;
            if (key === newKey) {
                // 更新路径的坐标
                return { startX, startY, endX, endY };
            }
            return path;
        });

        setPaths(updatedPaths);
        drawPaths(updatedPaths); // 更新绘制
    };

    return (
        <div>
            <div ref={svgContainerRef}></div> {/* SVG 容器 */}
            <button onClick={() => addPath(100, 100, 200, 200)}>Add Path (100, 100) to (200, 200)</button>
            <button onClick={() => updatePath(10, 10, 90, 90)}>Update Path (10, 10) to (90, 90)</button>
        </div>
    );
};

export default SvgPathsExample;
