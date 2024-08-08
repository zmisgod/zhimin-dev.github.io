class MathetroData {
    constructor(startPoint, endPoint, lineType) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.lineType = lineType;
    }

    // 1 直线
    // 2 90
    // 3 135
    // 4 -90
    // 5 -135
    // 6 曲线
    getPath() {
        if (this.lineType === 1) {
            return 'M' + this.startPoint.x + "," + this.startPoint.y + 'L' + this.endPoint.x + "," + this.endPoint.y
        } else if (this.lineType === 2) {
            let curLine = 0
            let midPointX = 0
            let midPointY = 0
            let startPoint = this.startPoint
            let endPoint = this.endPoint
            if (endPoint.y > startPoint.y) {
                console.log('------end.y > start.y')
                if (endPoint.x - startPoint.x > 0) {
                    curLine = endPoint.x - startPoint.x
                    midPointX = startPoint.x
                    midPointY = endPoint.y
                    console.log('end.x > start.x')
                    console.log("midPoint", midPointX, midPointY)
                    let curPoint = parseInt(curLine / 10)
                    console.log(curPoint)
                    let startCurPointX = midPointX
                    let startCurPointY = midPointY - curPoint
                    let endCurPointX = startPoint.x + curPoint
                    let endCurPointY = endPoint.y
                    console.log("startCurPoint", startCurPointX, startCurPointY)
                    console.log("endCurPoint", endCurPointX, endCurPointY)
                    return 'M' + startPoint.x + "," + startPoint.y + "L" + startCurPointX + "," + startCurPointY
                        + "C" + startCurPointX + "," + startCurPointY + "," + midPointX + "," + midPointY + "," + endCurPointX + "," + endCurPointY
                        + "L" + endPoint.x + "," + endPoint.y
                } else {
                    console.log('end.x <= start.x')
                    curLine = startPoint.x - endPoint.x
                    midPointX = startPoint.x
                    midPointY = endPoint.y
                    console.log('=-=====2222----')
                    console.log("midPoint", midPointX, midPointY)
                    let curPoint = parseInt(curLine / 10)
                    console.log("curPoint", curPoint)
                    let startCurPointX = midPointX
                    let startCurPointY = midPointY - curPoint
                    let endCurPointX = midPointX - curPoint
                    let endCurPointY = endPoint.y
                    console.log("startCurPoint", startCurPointX, startCurPointY)
                    console.log("endCurPoint", endCurPointX, endCurPointY)
                    return 'M' + startPoint.x + "," + startPoint.y + "L" + startCurPointX + "," + startCurPointY
                        + "C" + startCurPointX + "," + startCurPointY + "," + midPointX + "," + midPointY + "," + endCurPointX + "," + endCurPointY
                        + "L" + endPoint.x + "," + endPoint.y
                }
            } else {
                console.log('------end.y <= start.y')
                if (endPoint.x - startPoint.x > 0) {
                    console.log('------end.x > start.x')
                    curLine = endPoint.x - startPoint.x
                    midPointX = startPoint.x
                    midPointY = endPoint.y
                    console.log("midPoint", midPointX, midPointY)
                    let curPoint = parseInt(curLine / 10)
                    console.log(curPoint)
                    let startCurPointX = midPointX
                    let startCurPointY = midPointY + curPoint
                    let endCurPointX = midPointX + curPoint
                    let endCurPointY = endPoint.y
                    console.log("startCurPoint", startCurPointX, startCurPointY)
                    console.log("endCurPoint", endCurPointX, endCurPointY)
                    return 'M' + startPoint.x + "," + startPoint.y + "L" + startCurPointX + "," + startCurPointY
                        + "C" + startCurPointX + "," + startCurPointY + "," + midPointX + "," + midPointY + "," + endCurPointX + "," + endCurPointY
                        + "L" + endPoint.x + "," + endPoint.y
                } else {
                    console.log('------end.x <= start.x')
                    curLine = startPoint.x - endPoint.x
                    midPointX = startPoint.x
                    midPointY = endPoint.y
                    console.log("midPoint", midPointX, midPointY)
                    let curPoint = parseInt(curLine / 10)
                    console.log("curPoint", curPoint)
                    let startCurPointX = midPointX
                    let startCurPointY = midPointY + curPoint
                    let endCurPointX = startPoint.x - curPoint
                    let endCurPointY = endPoint.y
                    console.log("startCurPoint", startCurPointX, startCurPointY)
                    console.log("endCurPoint", endCurPointX, endCurPointY)
                    return 'M' + startPoint.x + "," + startPoint.y + "L" + startCurPointX + "," + startCurPointY
                        + "C" + startCurPointX + "," + startCurPointY + "," + midPointX + "," + midPointY + "," + endCurPointX + "," + endCurPointY
                        + "L" + endPoint.x + "," + endPoint.y
                }
            }
        } else if (this.lineType === 3) {
            let calMinHeight = 0
            let longType = 'x'
            let yLen = Math.abs(this.endPoint.y - this.startPoint.y)
            let xLen = Math.abs(this.endPoint.x - this.startPoint.x)
            if (yLen > xLen) {
                longType = 'y'
            }
            console.log(xLen, yLen, longType)
            let w;
            let miPointX;
            let miPointY;
            if(longType === 'x') {
                w = yLen
            }else{
                w = xLen
            }
            if (this.endPoint.y - this.startPoint.y > 0) {
                calMinHeight = this.endPoint.y - this.startPoint.y
                if(this.endPoint.x - this.startPoint.x > 0) {
                    miPointX = this.startPoint.x + w
                    miPointY = this.startPoint.y + w
                    console.log('---eeeee-11111', miPointX, miPointY)
                    let curLine = calMinHeight / 10
                    console.log("curLine", curLine)
                    let curPoint1X = miPointX - curLine
                    let curPoint1Y = miPointY- curLine
                    console.log("curPoint1", curPoint1X, curPoint1Y)
                    let curPoint2X;
                    let curPoint2Y;
                    if(longType === 'x') {
                         curPoint2X = miPointX + curLine
                         curPoint2Y = miPointY 
                    }else{
                         curPoint2X = miPointX 
                         curPoint2Y = miPointY +curLine
                    }
                    console.log("curPoint2", curPoint2X, curPoint2Y)
                    return 'M' + this.startPoint.x + "," + this.startPoint.y + "," + curPoint1X + "," + curPoint1Y
                        + "C" + curPoint1X + "," + curPoint1Y + "," + miPointX + "," + miPointY + "," + curPoint2X + "," + curPoint2Y
                        + "L" + this.endPoint.x + "," + this.endPoint.y
                }else{
                    miPointX = this.startPoint.x - w
                    miPointY = this.startPoint.y + w
                    console.log('---eeeee-2222')
                    let curLine = calMinHeight / 10
                    console.log("curLine", curLine)
                    let curPoint1X = miPointX + curLine
                    let curPoint1Y = miPointY- curLine
                    console.log("curPoint1", curPoint1X, curPoint1Y)
                    let curPoint2X;
                    let curPoint2Y;
                    if(longType === 'x') {
                        curPoint2X = miPointX - curLine
                        curPoint2Y = miPointY
                    }else{
                         curPoint2X = miPointX 
                         curPoint2Y = miPointY +curLine
                    }
                    console.log("curPoint2", curPoint2X, curPoint2Y)
                    return 'M' + this.startPoint.x + "," + this.startPoint.y + "," + curPoint1X + "," + curPoint1Y
                        + "C" + curPoint1X + "," + curPoint1Y + "," + miPointX + "," + miPointY + "," + curPoint2X + "," + curPoint2Y
                        + "L" + this.endPoint.x + "," + this.endPoint.y
                }
            } else {
                calMinHeight = this.startPoint.y - this.endPoint.y
                if(this.endPoint.x - this.startPoint.x > 0) {
                    console.log('---eeeee-3333')
                }else{
                    console.log('---eeeee-4444')
                }
            }
        } else if (this.lineType === 4) {
            let curLine = 0
            let midPointX = 0
            let midPointY = 0
            if (this.endPoint.x - this.startPoint.x > 0) {
                curLine = this.endPoint.x - this.startPoint.x
                midPointX = this.endPoint.x
                midPointY = this.startPoint.y
            } else {
                curLine = this.startPoint.x - this.endPoint.x
                midPointX = this.startPoint.x
                midPointY = this.endPoint.y
            }
            console.log(midPointX, midPointY)
            let curPoint = parseInt(curLine / 10)
            console.log(curPoint)
            let startCurPointX = this.endPoint.x - curPoint
            let startCurPointY = this.startPoint.y
            let endCurPointX = this.endPoint.x
            let endCurPointY = this.startPoint.y + curPoint
            console.log(startCurPointX, startCurPointY)
            console.log(endCurPointX, endCurPointY)
            return 'M' + this.startPoint.x + "," + this.startPoint.y + "L" + startCurPointX + "," + startCurPointY
                + "C" + startCurPointX + "," + startCurPointY + "," + midPointX + "," + midPointY + "," + endCurPointX + "," + endCurPointY
                + "L" + this.endPoint.x + "," + this.endPoint.y
        } else if (this.lineType === 5) {
            let startPoint = this.startPoint
            let endPoint = this.endPoint

            let calMinHeight = 0
            if (endPoint.y - startPoint.y > 0) {
                calMinHeight = endPoint.y - startPoint.y
            } else {
                calMinHeight = startPoint.y - endPoint.y
            }
            console.log(calMinHeight)
            let minPointX = endPoint.x - calMinHeight
            let minPointY = endPoint.y - calMinHeight
            console.log("miPoint", minPointX, minPointY)
            let curLine = calMinHeight / 10
            console.log("curLine", curLine)
            let curPoint1X = minPointX + curLine
            let curPoint1Y = minPointY + curLine
            console.log("curPoint1", curPoint1X, curPoint1Y)
            let curPoint2X = minPointX - curLine
            let curPoint2Y = minPointY
            console.log("curPoint2", curPoint2X, curPoint2Y)
            return 'M' + startPoint.x + "," + startPoint.y + "," + curPoint2X + "," + curPoint2Y
                + "C" + curPoint2X + "," + curPoint2Y + "," + minPointX + "," + minPointY + "," + curPoint1X + "," + curPoint1Y
                + "L" + endPoint.x + "," + endPoint.y
        } else if (this.lineType === 6) {
            let startPoint = this.startPoint
            let endPoint = this.endPoint
            let middlePoint = { x: 0, y: 0 }
            middlePoint.x = (endPoint.x - startPoint.x) / 2
            middlePoint.y = (endPoint.y - startPoint.y) / 2
            console.log("middle", middlePoint)
            let leftPoint = { x: startPoint.x, y: middlePoint.y }
            console.log("leftPoint", leftPoint)
            let rightPoint = { x: endPoint.x, y: middlePoint.y }
            console.log("rightPoint", rightPoint)
            return 'M' + startPoint.x + "," + startPoint.y +
                "C" + startPoint.x + "," + startPoint.y + "," + leftPoint.x + "," + leftPoint.y + "," + middlePoint.x + "," + middlePoint.y +
                "C" + middlePoint.x + "," + middlePoint.y + "," + rightPoint.x + "," + rightPoint.y + "," + endPoint.x + "," + endPoint.y
        }
    }
}


export default MathetroData;