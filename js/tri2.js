	var midGrads = [];
	var transparentMids = {};
	var cachedTriangles = {};
	var leftTri = [];
	var midTri = [];
	var rightTri = [];

	//------------------------------------------------------------
	// Triangulate
	//
	// Perform the Delaunay Triangulation of a set of vertices.
	//
	// vertices: Array of Vertex objects
	//
	// returns: Array of Triangles
	//------------------------------------------------------------
	function triangulate(vertices) {
		var n = vertices.length
		var epsilon = 1.0 / 1048576.0;
		//Can't triangulate less than 3 points :)
		if (n < 3) {return;}
		console.log ("triangulate")


		var tmpVerts = vertices.slice(0);  //Make a duplicate of the verts

		var minx = Number.POSITIVE_INFINITY
		var miny = Number.POSITIVE_INFINITY
		var maxx = Number.NEGATIVE_INFINITY
		var maxy = Number.NEGATIVE_INFINITY
		for (var i = 0; i < tmpVerts.length; i++) {
			minx = Math.min(tmpVerts[i].x, minx);
			miny = Math.min(tmpVerts[i].y, miny);
			maxx = Math.max(tmpVerts[i].x, maxx);
			maxy = Math.max(tmpVerts[i].y, maxy);
		};


		//
		// First, create a "supertriangle" that bounds all vertices
		//
		var indices = new Array(n);

		for(var i = n; i--; ){
			indices[i] = i;
		}

		indices.sort(function(i, j) {
		  return vertices[j].x - vertices[i].x;
		});

		var st = boundingTriangle(minx, miny, maxx, maxy); 
		tmpVerts.push(st[0], st[1], st[2]);

		for (var i = 0; i < tmpVerts.length; i++) {
			tmpVerts[i].myindex = i;
		};

		/* Initialize the open list (containing the supertriangle and nothing
		 * else) and the closed list (which is empty since we havn't processed
		 * any triangles yet). */
		var open   = [new triangle(tmpVerts[n + 0], tmpVerts[n + 1], tmpVerts[n + 2])];
		var closed = [];
		var edges  = [];


		/* Incrementally add each vertex to the mesh. */
		for (var i = indices.length; i--;) {
			edges = [];
			var c = indices[i];
			var currentVert = tmpVerts[c];
			/* For each open triangle, check to see if the current point is
			* inside it's circumcircle. If it is, remove the triangle and add
			* it's edges to an edge list. */
			for (var j = open.length-1; j>=0; j--) {
				var currentTriangle = open[j];
				var currentRad = currentTriangle.radius_squared;
				/* If this point is to the right of this triangle's circumcircle,
				* then this triangle should never get checked again. Remove it
				* from the open list, add it to the closed list, and skip. */
				var dx = currentVert.x - currentTriangle.center.x;
				var dx2 = dx * dx;
				if(dx > 0.0 && dx2 > currentRad) {
					closed.push(currentTriangle);
					open.splice(j, 1);
					continue;
				}

				/* If we're outside the circumcircle, skip this triangle. */
				var dy = currentVert.y - currentTriangle.center.y;
				var dy2 = dy * dy;
				if (((dx2 + dy2) - currentRad) > epsilon) {
					continue;
				}

				edges.push(currentTriangle.v0.myindex, currentTriangle.v1.myindex, currentTriangle.v1.myindex, currentTriangle.v2.myindex, currentTriangle.v2.myindex, currentTriangle.v0.myindex)
				open.splice(j, 1);
			}

			/* Get unique edges */
			uniqueEdges(edges);
			for (var j = 0; j < edges.length; j += 2) {
				open.push(new triangle(tmpVerts[edges[j]], tmpVerts[edges[j+1]], currentVert));
			}
		}

		/* Copy any remaining open triangles to the closed list, and then
		* remove any triangles that share a vertex with the supertriangle,
		* building a list of triplets that represent triangles. */
		for (var i = 0; i< open.length; i++) {
			closed.push(open[i]);
		}
		open.length = 0;

		for(var i = 0; i< closed.length; i++ ) {
			if (closed[i].v0.myindex < n && closed[i].v1.myindex < n && closed[i].v2.myindex < n) {
				open.push(new triangle(closed[i].v0, closed[i].v1, closed[i].v2));
			}
		}

		return open;

	}  


	// Internal: remove duplicate edges from an array
	function uniqueEdges(edges) {
		var i, j, a, b, m, n;

		for(var j = edges.length; j; ) {
			b = edges[--j];
			a = edges[--j];

			for(var i = j; i; ) {
				n = edges[--i];
				m = edges[--i];

				if((a === m && b === n) || (a === n && b === m)) {
					edges.splice(j, 2);
					edges.splice(i, 2);
					break;
				}
			}
		}
	}

	// Define a triangle that bounds the curent vertices
	function boundingTriangle(minx, miny, maxx, maxy) {
		// NOTE: There's a bit of a heuristic here. If the bounding triangle
		// is too large and you see overflow/underflow errors. If it is too small
		// you end up with a non-convex hull.

		var dx = (maxx - minx) ;//* 10;
		var dy = (maxy - miny) ; //* 10;
		var dmax = Math.max(dx, dy);
		var xmid = minx + dx * 0.5;
		var ymid = miny + dy * 0.5;

		[xmid - 20 * dmax, ymid -      dmax],
		[xmid            , ymid + 20 * dmax],
		[xmid + 20 * dmax, ymid -      dmax]


		var stv0 = new vertex(xmid - 20 * dmax, ymid - dmax);
		var stv1 = new vertex(xmid, ymid + 20 * dmax);
		var stv2 = new vertex(xmid + 20 * dmax, ymid - dmax);

		return [stv0, stv1, stv2];
	} 



function triangle(v0, v1, v2) {
	var epsilon = 1.0 / 1048576.0;

	this.transparent = false;
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.minx = Math.min(this.v0.x, this.v1.x, this.v2.x);
	this.miny = Math.min(this.v0.y, this.v1.y, this.v2.y);
	this.maxx = Math.max(this.v0.x, this.v1.x, this.v2.x);
	this.maxy = Math.max(this.v0.y, this.v1.y, this.v2.y);

	this.width = this.maxX - this.minX;
	this.height = this.maxY - this.minY;

	this.midPoint = {x: ~~ ((this.v0.x + this.v1.x + this.v2.x) / 3), y: ~~ ((this.v0.y + this.v1.y + this.v2.y) / 3)};
	this.pointsString = this.v0.x + ',' + this.v0.y + ' ' + this.v1.x + ',' + this.v1.y + ' ' + this.v2.x + ',' + this.v2.y;
	this.midVertex = false;

	this.OnEdge = function(otherTriangle) {
		if (this.v0 == otherTriangle.v0 || this.v0 == otherTriangle.v1 || this.v0 == otherTriangle.v2 || this.v1 == otherTriangle.v0 || this.v1 == otherTriangle.v1 || this.v1 == otherTriangle.v2 || this.v2 == otherTriangle.v0 || this.v2 == otherTriangle.v1 || this.v2 == otherTriangle.v2) {
			return true
		} else {
			return false;
		}
	}

	this.isSolidColored = function() {
		return (((this.v0.colorString()) == (this.v1.colorString())) && ((this.v0.colorString()) == (this.v2.colorString())));
	}

	this.toggleGradient = function(gradFlag) {
		if (gradFlag === undefined) {gradFlag = !this.transparent;}
		/*if (transparentMids[this.midPoint.x + '-' + this.midPoint.y]) {
			this.transparent = false;
		} else {
			this.transparent = true;
		}*/
		this.transparent = gradFlag;
		transparentMids[this.midPoint.x + '-' + this.midPoint.y] = this.transparent;
	}

	this.getSolidGradientColor = function(midVert, refPoint) {
		var midGrad = false;
		for (var i = 0; i < midGrads.length; i++) {
			if ((midGrads[i].x == midVert.x) && (midGrads[i].y == midVert.y)) {
				midGrad = midGrads[i].gradColor;
				break;
			}
		}
		this.transparent = this.midVertex.transparent;
		if (!midGrad) {
			if (this.transparent) {
				midGrad = this.clearGradient();
			} else {
				var adjustLvl = Math.random() * 45 + 5;	//light
				if (((refPoint.red + refPoint.green + refPoint.blue)/3) < 200) {
					adjustLvl = Math.random() * -75 - 5;  //dark
				}
				midGrad = LightenDarkenColor(refPoint.red , refPoint.green , refPoint.blue, adjustLvl); 
				midGrads.push({'x': midVert.x, 'y': midVert.y, 'gradColor': midGrad});
			}
		}
		return midGrad;
	}

	this.getMidVertex = function() {
		if (!this.midVertex) {
			this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
			this.midVertex.avColor();	//Need to get the true color either way, because we need the transparency state.
			this.transparent = this.isTransparent();			
		}
	}

	this.isTransparent = function() {
		if (this.midVertex.alpha == 0 || mainController.isInMask(this.midVertex.x ,this.midVertex.y))	{
			return true;
		}
		if (transparentMids[this.midPoint.x + '-' + this.midPoint.y]) {
			return true;
		}

		if (this.transparent !== undefined) {return this.transparent;}
		return false;
	}

	this.getGradient = function(ctx) {
		if (transparentMids[this.midPoint.x + '-' + this.midPoint.y]) {
			this.transparent = true;
			return false;
		}
		this.transparent = false;
		this.getMidVertex();
		
		if (this.isSolidColored()) {
			var tmpColor = this.v0;

			this.midVertex.gradientColor = this.getSolidGradientColor(this.midVertex, this.v0);			

			if (mainController.useSolidGradient) {
				tmpColor = this.midVertex.gradientColor;
			} 

			this.midVertex.red = tmpColor.red;			
			this.midVertex.green = tmpColor.green;			
			this.midVertex.blue = tmpColor.blue;			

		} 

		if (this.midVertex.alpha == 0 || mainController.isInMask(this.midVertex.x ,this.midVertex.y))	{
			this.transparent = true;
			return false;
		}

		var startColors = {'red': ~~ ((this.midVertex.red + this.v0.red) / 2), 'green': ~~ ((this.midVertex.green + this.v0.green) / 2), 'blue': ~~ ((this.midVertex.blue + this.v0.blue) / 2)};
		var stopColors = {'red': ~~ ((this.midVertex.red + this.v1.red + this.v2.red) / 3), 'green': ~~ ((this.midVertex.green + this.v1.green + this.v2.green) / 3), 'blue': ~~ ((this.midVertex.blue + this.v1.blue + this.v2.blue) / 3)};
		var rgbStart = 'rgb(' + startColors.red + ',' + startColors.green + ',' + startColors.blue + ')';
		var rgbStop = 'rgb(' + stopColors.red + ',' + stopColors.green + ',' + stopColors.blue + ')';
		var rgbPts = {'start': rgbStart, 'stop': rgbStop};			


		var lingrad 
		if (ctx) {
			lingrad = ctx.createLinearGradient(this.v0.x, this.v0.y, Math.max(this.v1.x, this.v2.x), Math.max(this.v1.y, this.v2.y));
			lingrad.addColorStop(0, rgbPts.start);
			lingrad.addColorStop(1, rgbPts.stop);
		}
		if (!ctx) {
			return {'start': rgbStart, 'stop': rgbStop, 'startColors': startColors, 'stopColors': stopColors};
		} else {
			return lingrad;
		}
	}

	this.setCustomColor = function(hexColor) {
		mainController.customPalette.setCustomColor(this.midVertex.x, this.midVertex.y, hexColor);
	}

	this.getColor = function () {
		if (transparentMids[this.midPoint.x + '-' + this.midPoint.y]) {
			this.transparent = true;
			return false;
		}
		this.transparent = false;

		if (!this.midVertex) {
			this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
			this.midVertex.avColor();	
			if (((this.v0.colorString()) == (this.v1.colorString())) && ((this.v0.colorString()) == (this.v2.colorString()))) {
				this.midVertex.gradientColor = this.getSolidGradientColor(this.midVertex, this.v0);
				if (mainController.useSolidGradient) {
					this.midVertex.red = this.midVertex.gradientColor.red;			
					this.midVertex.green = this.midVertex.gradientColor.green;			
					this.midVertex.blue = this.midVertex.gradientColor.blue; 
				}
			}	
		}
		if (mainController.togglingSolidGradient) {
			if (mainController.useSolidGradient && this.isSolidColored()) {
				if(!this.midVertex.gradientColor) {this.midVertex.gradientColor = this.getSolidGradientColor(this.midVertex, this.v0);}
				this.midVertex.red = this.midVertex.gradientColor.red;			
				this.midVertex.green = this.midVertex.gradientColor.green;			
				this.midVertex.blue = this.midVertex.gradientColor.blue; 
			} else {
				this.midVertex.isColored = false;
				this.midVertex.avColor();
			}
		}
		if (this.midVertex.alpha == 0 || mainController.isInMask(this.midVertex.x ,this.midVertex.y))	{
			this.transparent = true;
			return false;
		}
		return 'rgb(' + ~~ (this.midVertex.red) + ',' + ~~ (this.midVertex.green) + ',' + ~~ (this.midVertex.blue) + ')';
	}


	this.drawStroke = function(ptA, ptB, ctx) {

		ctx.beginPath();
		ctx.lineWidth = mainController.strokeWidth;

		ctx.moveTo(ptA.x, ptA.y);
		ctx.lineTo(ptB.x, ptB.y);
		var rgb = hexToRGB(mainController.strokeColor);
		ctx.strokeStyle = "rgba("+rgb.red+","+rgb.green+","+rgb.blue+"," + mainController.strokeOpacity + ")";
		ctx.stroke();    
		ctx.closePath();
	}

	this.drawStrokeSVG = function(ptA, ptB, svg) {

		//<line id="line725-8051093-245" fill="#E11E26" stroke="#B72625" stroke-width="5" stroke-miterlimit="10" x1="725" y1="805" x2="1093" y2="245"/>

		var id= ptA.id() + "" + ptB.id();
		var ns = 'http://www.w3.org/2000/svg';

		var line = document.createElementNS(ns, 'line');
		line.setAttribute('id', 'line' + id);
		line.setAttribute('x1', ptA.x);
		line.setAttribute('y1', ptA.y);
		line.setAttribute('x2', ptB.x);
		line.setAttribute('y2', ptB.y);
		line.setAttribute('fill', mainController.strokeColor);
		line.setAttribute('stroke', mainController.strokeColor);
		line.setAttribute('stroke-width', mainController.strokeWidth);
		line.setAttribute('stroke-opacity', mainController.strokeOpacity);
		line.setAttribute('opacity', mainController.globalOpacity);
 
		svg.appendChild(line);

	}

	this.drawStrokes = function(ctx, createSVGs) {
		if (this.transparent && !mainController.showAllStrokes) {return;}
		if (createSVGs) {
			this.drawStrokeSVG(this.v0, this.v1, ctx);
			this.drawStrokeSVG(this.v1, this.v2, ctx);
			this.drawStrokeSVG(this.v2, this.v0, ctx);	
		} else {
			this.drawStroke(this.v0, this.v1, ctx);
			this.drawStroke(this.v1, this.v2, ctx);
			this.drawStroke(this.v2, this.v0, ctx);	
		}
	}


	this.getAdjustedColor = function(rbgColor) {
		var thisColor = {'red': ~~ mainController.getContrastedColor(rbgColor.red + mainController.adjustedColor.red + mainController.brightness) ,
					     'green': ~~ mainController.getContrastedColor(rbgColor.green + mainController.adjustedColor.green + mainController.brightness) ,
					     'blue': ~~ mainController.getContrastedColor(rbgColor.blue + mainController.adjustedColor.blue + mainController.brightness) };
	    return thisColor;
	}


	this.drawSVG = function(svg, id){
		/*
			<linearGradient id="triangle0_1_" gradientUnits="userSpaceOnUse" x1="334.2407" y1="908.8262" x2="335.2407" y2="907.8262" gradientTransform="matrix(860 0 0 -592 -287102.5 538161.5)">
				<stop  offset="0" style="stop-color:#0F0F0F"/>
				<stop  offset="1" style="stop-color:#0A0A0A"/>
			</linearGradient>

			<polygon id="triangle5540" opacity="0.58" fill="url(#triangle5540_1_)" points="825,0 906,1 1100,0 	"/>

		*/

		var ns = 'http://www.w3.org/2000/svg';
		var defs = document.createElementNS(ns, 'defs');

		if(!this.transparent) {
			var fillStyle;

			if (mainController.fillStyle == 'Gradient' && !this.transparent) {
				var rgbPts = this.getGradient();
				var grad = document.createElementNS(ns, 'linearGradient');
				grad.setAttributeNS(null, 'id', 'gr' + id);
				grad.setAttributeNS(null, 'x1', '0%');
				grad.setAttributeNS(null, 'x2', '100%');
				grad.setAttributeNS(null, 'y1', '0%');
				grad.setAttributeNS(null, 'y2', '100%');
				var stopTop = document.createElementNS(ns, 'stop');
				stopTop.setAttributeNS(null, 'offset', '0%');


				var rgbStart = rgbPts.start;
				var rgbStop = rgbPts.stop;
				if (mainController.includeColorAdjust) {
					var thisStart = this.getAdjustedColor(rgbPts.startColors);
					var thisStop = this.getAdjustedColor(rgbPts.stopColors);
					rgbStart = 'rgb(' + thisStart.red + ',' + thisStart.green + ',' + thisStart.blue  + ')';
					rgbStop = 'rgb(' + thisStop.red + ',' + thisStop.green + ',' + thisStop.blue  + ')';
				}

				stopTop.setAttributeNS(null, 'stop-color', rgbStart);
				grad.appendChild(stopTop);
				var stopBottom = document.createElementNS(ns, 'stop');
				stopBottom.setAttributeNS(null, 'offset', '100%');
				stopBottom.setAttributeNS(null, 'stop-color', rgbStop);
				grad.appendChild(stopBottom);

				defs.appendChild(grad);
				fillStyle = 'url(#gr' + id + ')';
			} else if (mainController.fillStyle == 'CustomRandom') {
				fillRGB = hexToRGB(mainController.customPalette.getCustomColor(this.midVertex.x, this.midVertex.y));
				if (mainController.includeColorAdjust) {
					var adjColor = this.getAdjustedColor(fillRGB);
					fillStyle = 'rgb(' + adjColor.red + ',' + adjColor.green + ',' + adjColor.blue  + ')';
				} else {
					fillStyle = 'rgb(' + ~~ fillRGB.red + ',' + ~~ fillRGB.green + ',' + ~~ fillRGB.blue + ')';
				}

			} else if (mainController.fillStyle == 'CustomMatched') {
				var matchedColor = mainController.customPalette.getMatchColor({'red': this.midVertex.red, 'green': this.midVertex.green, 'blue': this.midVertex.blue});
				fillRGB = hexToRGB(matchedColor);	
				if (mainController.includeColorAdjust) {
					var adjColor = this.getAdjustedColor(fillRGB);
					fillStyle = 'rgb(' + adjColor.red + ',' + adjColor.green + ',' + adjColor.blue  + ')';
				} else {
					fillStyle = 'rgb(' + ~~ fillRGB.red + ',' + ~~ fillRGB.green + ',' + ~~ fillRGB.blue + ')';
				}

			} else { 

				fillStyle = this.getColor(); 
				if (mainController.includeColorAdjust) {
					var adjColor = this.getAdjustedColor(this.midVertex);
					fillStyle = 'rgb(' + adjColor.red + ',' + adjColor.green + ',' + adjColor.blue  + ')';
				}
			}

			svg.appendChild(defs);

			var newPoly = document.createElementNS(ns, 'polygon');
			newPoly.setAttribute('id', 'triangle' + id);
			newPoly.setAttribute('points', this.pointsString);
			//newPoly.setAttribute('style', 'fill: ' + fillStyle + '; stroke: rgb(0, 0, 0); stroke-width: 0;');
			newPoly.setAttribute('style', 'fill: ' + fillStyle + ';');
			newPoly.setAttribute('opacity', mainController.globalOpacity);

			svg.appendChild(newPoly);
		}
		if (mainController.showStroke) {
			this.drawStrokes(svg, true);
		}
	}


	this.init = function() {		
		var x1 = this.v0.x,
		y1 = this.v0.y,
		x2 = this.v1.x,
		y2 = this.v1.y,
		x3 = this.v2.x,
		y3 = this.v2.y,
		dely1y2 = Math.abs(y1 - y2),
		dely2y3 = Math.abs(y2 - y3),
		xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

		/* Check for coincident points */
		if (dely1y2 < epsilon && dely2y3 < epsilon) {
			throw new Error("Not a triangle");
		}

		if (dely1y2 < epsilon) {
			m2  = ((x2 - x3) / (y3 - y2));
			mx2 = (x2 + x3) / 2.0;
			my2 = (y2 + y3) / 2.0;
			xc  = (x2 + x1) / 2.0;
			yc  = m2 * (xc - mx2) + my2;
		} else if(dely2y3 < epsilon) {
			m1  = ((x1 - x2) / (y2 - y1));
			mx1 = (x1 + x2) / 2.0;
			my1 = (y1 + y2) / 2.0;
			xc  = (x3 + x2) / 2.0;
			yc  = m1 * (xc - mx1) + my1;
		} else {
			m1  = ((x1 - x2) / (y2 - y1));
			m2  = ((x2 - x3) / (y3 - y2));
			mx1 = (x1 + x2) / 2.0;
			mx2 = (x2 + x3) / 2.0;
			my1 = (y1 + y2) / 2.0;
			my2 = (y2 + y3) / 2.0;
			xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
			yc  = (dely1y2 > dely2y3) ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
		}

		dx = x2 - xc;
		dy = y2 - yc;

		this.center = new vertex(xc, yc);
		this.radius_squared = dx * dx + dy * dy;
		this.radius = Math.sqrt(this.radius_squared);
	}

	this.Circumcircle = function() {
		this.init();
	}

	this.signTri = function (p1, p2, p3) {
	    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
	}

	this.isPointInTriangle = function(xPos, yPos) {
	    var b1;
	    var b2;
	    var b3;
	    var pt = {"x": xPos, "y": yPos};
	    b1 = this.signTri(pt, this.v0, this.v1) < 0;
	    b2 = this.signTri(pt, this.v1, this.v2) < 0;
	    b3 = this.signTri(pt, this.v2, this.v0) < 0;

	    return ((b1 == b2) && (b2 == b3));
	}

	this.inCircle = function(v) {

	}


	this.inCircumcircle = function(v) {
		var delX = (this.center.x - v.x);
		var dx = delX * delX;
		if (dx <= this.radius_squared) {
			var delY = (this.center.y - v.y);
			var dy = delY * delY;
			if (dy < this.radius_squared) {
				var dist_squared = dx + dy;
				return (dist_squared <= this.radius_squared);
			} else {
				return false
			}
		} else {
			return false
		}
	}; 

	// InCircumcircle
	/*this.inCircumcircle1 = function(v) {
		var dx = this.center.x - v.x;
		var dy = this.center.y - v.y;
		var dist_squared = dx * dx + dy * dy;

		return (dist_squared <= this.radius_squared);

	}; */

	this.Draw = function(ctx, num, excludeFill) {
		// Draw edges
		ctx.beginPath();

		if (!excludeFill) {
			this.getMidVertex();

			if (mainController.fillStyle == 'Gradient') {
				ctx.fillStyle = this.getGradient(mainController.fillCtx); 
			} else if (mainController.fillStyle == 'CustomRandom') {
				ctx.fillStyle = hexToRGBString(mainController.customPalette.getCustomColor(this.midVertex.x, this.midVertex.y));	
			} else if (mainController.fillStyle == 'CustomMatched') {
				var matchedColor = mainController.customPalette.getMatchColor({'red': this.midVertex.red, 'green': this.midVertex.green, 'blue': this.midVertex.blue});
				ctx.fillStyle = hexToRGBString(matchedColor);	
			} else { 
				ctx.fillStyle = this.getColor(); 
			}
		}
		
		ctx.moveTo(this.v0.x, this.v0.y);
		ctx.lineTo(this.v1.x, this.v1.y);
		ctx.lineTo(this.v2.x, this.v2.y);
		ctx.lineTo(this.v0.x, this.v0.y);
		if (!excludeFill && !this.transparent) {ctx.fill();}
		ctx.closePath();

		/* circumcircle*/
		if (mainController.showCircles) {
			ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, 2, 0, 2 * Math.PI, true);
			ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, true);
			ctx.strokeStyle = "rgba(0,0,0,0.2)";
			ctx.stroke();
			ctx.fillText(num, this.center.x, this.center.y);

			ctx.closePath();
			//ctx.fillText(num, tmpVertex.x, tmpVertex.y);			
		}

		
		/* metering point
		ctx.beginPath();
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.arc(tmpVertex.x, tmpVertex.y, 4, 0, 2 * Math.PI, true);
		ctx.stroke();
		ctx.closePath();
		*/

		/*delete tmpVertex;
		delete lingrad;*/

	} 


	this.init();


}


 
 



 
 