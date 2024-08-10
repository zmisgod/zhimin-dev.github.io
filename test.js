import metroData from './src/component/metro/metro/metrodata.js'
import fs from 'fs';

// let a = new metroData({x:100, y:50},{x:50,y:100},2);
// let b = new metroData({x:100, y:50},{x:150,y:100},2);
// let c = new metroData({x:50, y:100},{x:100,y:150},2);
// let d = new metroData({x:150,y:100}, {x:100, y:150},2);
// let e = new metroData({x:50,y:100},{x:100, y:50},2);
// let f = new metroData({x:150,y:100},{x:100, y:50},2);
// let g = new metroData({x:100,y:150},{x:50, y:100},2);
// let h = new metroData({x:100, y:150},{x:150,y:100},2);

// let a = new metroData({x:50, y:50},{x:150,y:100},3);
// let b = new metroData({x:150, y:50},{x:100,y:150},3);
// let c = new metroData({x:50, y:50},{x:100,y:150},3);
// let d = new metroData({x:150, y:50},{x:50,y:100},3);

// ----cur-2---
// let a = new metroData({ x: 50, y: 50 },{ x: 150, y: 100 },  2);
// let b = new metroData({ x: 150, y: 100 }, { x: 50, y: 50 }, 2);
// let c = new metroData({ x: 50, y: 50 },{ x: 100, y: 150 },  2);
// let d = new metroData({ x: 100, y: 150 }, { x: 50, y: 50 }, 2);
// ----cur-2---

// ----cur-3---
let a = new metroData({ x: 50, y: 50 },{ x: 200, y: 100 },  3);
let b = new metroData({ x: 200, y: 100 }, { x: 50, y: 50 }, 3);
let c = new metroData({ x: 50, y: 50 },{ x: 100, y: 200 },  3);
let d = new metroData({ x: 100, y: 200 }, { x: 50, y: 50 }, 3);
let e = new metroData({ x: 50, y: 50 },{ x: 150, y: 150 },  3);

// ----cur-3---

// ----cur-6---
// let a = new metroData({ x: 50, y: 50 },{ x: 100, y: 100 },  6);
// let b = new metroData( { x: 50, y: 100 },{ x: 100, y: 50 }, 6);
// let c = new metroData({ x: 100, y: 100 },{ x: 50, y: 50 },  6);
// let d = new metroData( { x: 100, y: 50 },{ x: 50, y: 100 }, 6);
// ----cur-6---


{/* <path class="st1" d="${f.getPath()}"></path>
	<path class="st1" d="${h.getPath()}"></path>
	<path class="st1" d="${e.getPath()}"></path>
	<path class="st1" d="${g.getPath()}"></path>  */}
let data = `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1248.5 1375.7">
	<style>
		.st0{
			fill:none;stroke:#000;stroke-width:2;stroke-miterlimit:10;
		}
		.st1{
			fill:none;stroke:red;stroke-width:4;stroke-miterlimit:10;
		}
	</style>
	<g>
	<circle cx="50" cy="50" r="2"></circle>
	<circle cx="100" cy="50" r="2"></circle>
	<circle cx="150" cy="50" r="2"></circle>
	<circle cx="200" cy="50" r="2"></circle>
	<circle cx="50" cy="100" r="2"></circle>
	<circle cx="100" cy="100" r="2"></circle>
	<circle cx="150" cy="100" r="2"></circle>
	<circle cx="200" cy="100" r="2"></circle>
	<circle cx="50" cy="150" r="2"></circle>
	<circle cx="100" cy="150" r="2"></circle>
	<circle cx="150" cy="150" r="2"></circle>
	<circle cx="200" cy="150" r="2"></circle>
	<circle cx="50" cy="200" r="2"></circle>
	<circle cx="100" cy="200" r="2"></circle>
	<circle cx="150" cy="200" r="2"></circle>
	<circle cx="200" cy="200" r="2"></circle>
	
	<path class="st1" d="${a.getPath()}"></path>
	<path class="st1" d="${b.getPath()}"></path>
	<path class="st1" d="${c.getPath()}"></path>
	<path class="st1" d="${d.getPath()}"></path>
	<path class="st1" d="${e.getPath()}"></path>
	<!--

	-->
	</g>
</svg>`
fs.writeFile('111.svg', data, (e) => {
	console.log(e)
})