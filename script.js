window.addEventListener("load", () => {
	const canvas = document.querySelector("#canvas");
	const ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	// ctx.canvas.width  = canvas.scrollWidth;
	// ctx.canvas.height = canvas.scrollHeight;
	
	function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

	    if (arguments.length === 2) {
	        x = y = 0;
	        w = ctx.canvas.width;
	        h = ctx.canvas.height;
	    }

	    // default offset is center
	    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
	    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

	    // keep bounds [0.0, 1.0]
	    if (offsetX < 0) offsetX = 0;
	    if (offsetY < 0) offsetY = 0;
	    if (offsetX > 1) offsetX = 1;
	    if (offsetY > 1) offsetY = 1;

	    var iw = img.width,
	        ih = img.height,
	        r = Math.min(w / iw, h / ih),
	        nw = iw * r,   // new prop. width
	        nh = ih * r,   // new prop. height
	        cx, cy, cw, ch, ar = 1;

	    // decide which gap to fill    
	    if (nw < w) ar = w / nw;                             
	    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
	    nw *= ar;
	    nh *= ar;

	    // calc source rectangle
	    cw = iw / (nw / w);
	    ch = ih / (nh / h);

	    cx = (iw - cw) * offsetX;
	    cy = (ih - ch) * offsetY;

	    // make sure source rectangle is valid
	    if (cx < 0) cx = 0;
	    if (cy < 0) cy = 0;
	    if (cw > iw) cw = iw;
	    if (ch > ih) ch = ih;

	    // fill image in dest. rectangle
	    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
	}



	function draw2(ctx,image){
		if (!image.complete) {
			setTimeout(function(){
				draw2(ctx,image);
			},50);
		return;
		}
		drawImageProp(ctx, image, 0, 0, window.innerWidth, window.innerHeight);
	}
	var image = new Image();
	image.src = './formsample.png';
	draw2(ctx,image);


	let painting = false;
	function startPosition(e) {
		painting = true;
		draw(e);
	}
	function finishedPosition() {
		painting = false;
		ctx.beginPath();
	}
	function draw(e) {
		if(!painting) return;
		ctx.lineWidth = 10;
		ctx.lineCap = "round";
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
	canvas.addEventListener("mousedown", startPosition);
	canvas.addEventListener("mouseup", finishedPosition);
	canvas.addEventListener("mousemove", draw);


});