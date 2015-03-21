function vertex(x, y, isEdgeVar, isGridVar, isSpiralVar) {
    this.x = x;
    this.y = y;
    this.r = mainController.snapSide / 4;
    this.red = 128;
    this.green = 128;
    this.blue = 128;
    this.isEdge = isEdgeVar;
    this.isGrid = isGridVar;
    this.isSpiral = isSpiralVar;
    this.isColored = false;
    this.isMoving = false;

    this.getClone = function() {
    	var cloneVert = new vertex(~~ (this.x), ~~ (this.y), this.isEdge, this.isGrid, this.isSpiral);
    	cloneVert.red = this.red;
    	cloneVert.blue = this.blue;
    	cloneVert.green = this.green;
    	cloneVert.r = this.r;
    	cloneVert.isColored = this.isColored;
    	return cloneVert;
    }

    this.id = function() {
    	return this.x + "-" + this.y;
    }

    this.colorString = function() {
    	return this.red + '-' + this.green + '-' + this.blue;
    }

    this.toString = function() {
        return '{"x":"' + this.x + '","y": "' + this.y + '","r": "' + this.r + '","red": "' + this.red + '","blue": "' + this.blue + '","green": "' + this.green + '","isEdge": "' + this.isEdge + '","isGrid": "' + this.isGrid + '","isSpiral": "' + this.isSpiral + '"}';
    }

    this.isEqual = function(compVert) {
    	if ((this.x == compVert.x) && (this.y == compVert.y) && (this.r == compVert.r)) {
    		return true;
    	} else {
    		return false;
    	}
    }

    this.isClicked = function(xCoord, yCoord) {
		var minDist = Math.max(mainController.pointDetectionThreshold, mainController.snapSide/4);
		var vertDist = (Math.pow((this.x - xCoord),2) + Math.pow((this.y - yCoord),2));
		if ((Math.abs(this.x - x) < minDist) && (Math.abs(this.y - y) < minDist)) {
			return true

		} else {
			return false;
		}
    }

    this.move = function(newX, newY, ctx) {
    	if (ctx) {
    		this.erase(ctx);
    	}
    	this.x = newX;
    	this.y = newY;
    	this.isSpiral = false;
    	this.isGrid = false;
    	this.isEdge = false;
    	this.isColored = false;
    	if (ctx) {
    		this.DrawNum(ctx);
    	}
    }

    this.erase = function(ctx) {
    	ctx.beginPath();
    	ctx.clearRect(this.x-this.r - mainController.pointStrokeWidth, this.y-this.r - mainController.pointStrokeWidth, this.r * 2 + mainController.pointStrokeWidth * 2, this.r * 2 + mainController.pointStrokeWidth * 2);
    	ctx.closePath();
    }

    this.drawCoord = function(ctx) {
	    ctx.beginPath();
    	ctx.fillStyle = "#fff";
		ctx.font = "7pt Arial";
	    //ctx.fillText(this.red+';'+this.green+';'+this.blue, this.x, this.y);
	    ctx.fillText(this.x+';'+this.y, this.x, this.y);
	    ctx.closePath();
    }

    this.draw = function(ctx) {
    	this.DrawNum(ctx);
    }

	this.DrawNum = function(ctx) {
		ctx.globalCompositeOperation = 'source-over';

		var rgb = hexToRGB(mainController.pointColor);
		var rgbStroke = hexToRGB(mainController.pointStrokeColor);
	    this.avColor();  
	    ctx.beginPath();
	    //ctx.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',1)';
	    ctx.fillStyle = 'rgba(' + rgb.r + "," + rgb.g + "," + rgb.b + ','+ mainController.pointOpacity +')';

	    //ctx.shadowOffsetX = 0;
	    //ctx.shadowOffsetY = 0;
	    //ctx.shadowBlur = 2;
	    //ctx.shadowColor = "rgba(0, 0, 0, 1)";

	    switch (mainController.pointShape) {
	    	case 'circle':
	    		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
	    		break;
	    	case 'triangle':
	    		var cosThirty = Math.cos(30 * Math.PI);
	    		var sinThirty = .5;
		    	ctx.moveTo(this.x,this.y - this.r);
		    	ctx.lineTo(this.x - this.r*cosThirty,this.y + this.r*sinThirty);
		    	ctx.lineTo(this.x + this.r*cosThirty,this.y + this.r*sinThirty);
	    		break;
	    	case 'square':
	    		ctx.rect(this.x - this.r, this.y - this.r, this.r*2, this.r*2)
	    		break
	    }

	    ctx.fill();
	    ctx.strokeStyle = "rgba(" + rgbStroke.r + "," + rgbStroke.g + "," + rgbStroke.b + ','+ mainController.pointStrokeOpacity +')';
	    ctx.lineWidth = mainController.pointStrokeWidth;
		//ctx.strokeStyle = "rgba(255,255,255,0.5)";
		ctx.stroke();    
	    ctx.closePath();
	    //ctx.shadowBlur = 0;

		/*ctx.fillStyle = "#fff";
		ctx.font = "7pt Arial";
	    //ctx.fillText(this.red+';'+this.green+';'+this.blue, this.x, this.y);
	    ctx.fillText(this.x+';'+this.y, this.x, this.y);*/
	}

	this.drawSVG = function(svg, id){
		//<circle id="point1" fill="#FF00FF" fill-opacity="0.65" stroke="#FF00FF" stroke-width="5" stroke-opacity="0.5" enable-background="new    " cx="725" cy="805" r="8.5"/>

		var ns = 'http://www.w3.org/2000/svg';
		var pointShape = 'circle';
		if (mainController.pointShape == 'square') {pointShape = 'rect';}

		var circ = document.createElementNS(ns, pointShape);
		circ.setAttribute('id', 'point' + id);
		if (pointShape == 'rect') {
			//<rect x="716.5" y="823" fill="#0C8040" stroke="#FF00FF" stroke-width="5" width="74" height="59"/>
			circ.setAttribute('x', this.x - this.r);
			circ.setAttribute('y', this.y - this.r);
			circ.setAttribute('width', this.r * 2);
			circ.setAttribute('height', this.r * 2);

		} else {
			circ.setAttribute('cx', this.x);
			circ.setAttribute('cy', this.y);
			circ.setAttribute('r', this.r);
		}

		circ.setAttribute('fill', mainController.pointColor);
		circ.setAttribute('fill-opacity', mainController.pointOpacity);
		circ.setAttribute('stroke', mainController.pointStrokeColor);
		circ.setAttribute('stroke-width', mainController.pointStrokeWidth);
		circ.setAttribute('stroke-opacity', mainController.pointStrokeOpacity);

		svg.appendChild(circ);
	}

	this.avColor = function() {
		if (!this.isColored) {
		    var result = [0, 0, 0];
		    var startX = 0,
		        startY = 0;
		    var snapHalf = mainController.snapSide/2;
		    if (this.x < mainController.snapSide/2)  {    
		        startX = 0;
		    } else {
		    	if (this.x + snapHalf > mainController.sourceImg.width)  {
		        	startX = mainController.sourceImg.width - mainController.snapSide
		    	} else {
		        	startX = this.x - snapHalf
		    	}
		    }

		    if (this.y < snapHalf)  {    
		        startY = 0;                
		    } else {
			    if (this.y + snapHalf > mainController.sourceImg.height)  {
			        startY = mainController.sourceImg.height - mainController.snapSide
			    } else {
			        startY = this.y - snapHalf
			    }
		    }

		    startX = ~~startX;
		    startY = ~~startY;

		    var tempColor = mainController.getImageData(startX, startY);

		    for (var i = 0; i < mainController.snapSide * mainController.snapSide; i++) {
		    	var fourI = 4*i;
		        result[0] += tempColor[fourI];
		        result[1] += tempColor[fourI + 1];
		        result[2] += tempColor[fourI + 2];
		    }
		    this.red = ~~ (result[0] / i);
		    this.green = ~~ (result[1] / i);
		    this.blue = ~~ (result[2] / i);

		    this.isColored = true;
		}

	    return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';

	}

}

