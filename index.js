'use strict';

let context = document.getElementsByTagName('canvas')[0].getContext('2d');
let $image = document.getElementsByTagName('img')[0];

let image = context.drawImage($image, 0, 0, $image.width, $image.height);

let data = context.getImageData(0, 0, $image.width, $image.height).data;

const MATCHING_COLOR = [0,0,0,255];
const TOLERANCE = 1;

// create 2 layer array with rgba colors per pixel;
let currentPixel = [];
let row = [];
let result = data
	.reduce((result, value, index) => {
		currentPixel.push(value);
		if (currentPixel.length === 4) {
			result.push(currentPixel);
			currentPixel = [];
		}

		return result;
	}, [])
	// now break into rows:
	.reduce((result, pixelColor, index) => {
		row.push(pixelColor);
		if (row.length === $image.width) {
			result.push(row);
			row = [];
		}

		return result;
	}, [])
	.reduce((result, rowContent, rowIndex) => {
		
		let coordinatesPerRow = rowContent.reduce((all, pixelColor, pixelIndex) => {
			if (pixelColor.toString() === MATCHING_COLOR.toString()) {

				if (all.length > 0) {
					let lastX = all[all.length - 1][0];
					let lastY = all[all.length - 1][1];

					// on the same row
					if (rowIndex != lastY && pixelIndex != lastX) {
							all.push([pixelIndex + 1, rowIndex + 1]);
					}
				} else {
					all.push([pixelIndex + 1, rowIndex + 1]);
				}
			}
			return all;
		}, []);

		if (coordinatesPerRow.length > 0) {
			result = result.concat(coordinatesPerRow);
		}

		return result;
	}, [])

// try to get the coordinates:
// result.forEach((row, rowIndex) => {
// 	row.
// })



console.log(JSON.stringify(result));
