	var midGrads = [];

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
		var triangles = [];



		//
		// First, create a "supertriangle" that bounds all vertices
		//
		if (vertices.length == 0) {return;}

		vertices.sort(function(a, b) {
			if (a.y > b.y) {
				return 1
			} else {
				return -1
			}
		});
		var miny = vertices[0].y, maxy = vertices[vertices.length-1].y;
		vertices.sort(function(a, b) {
			if (a.x > b.x) {
				return 1
			} else {
				return -1
			}
		});

		var minx = vertices[0].x,  maxx = vertices[vertices.length-1].x;


		var st = createBoundingTriangle(vertices, minx, miny, maxx, maxy);

		triangles.push(st);



		//
		// Next, begin the triangulation one vertex at a time
		//

		for (var i in vertices) {
			// NOTE: This is O(n^2) - can be optimized by sorting vertices
			// along the x-axis and only considering triangles that have
			// potentially overlapping circumcircles


			addVertex(vertices[i], triangles);
			/*triangles.sort(function(a, b) {
				return (a.center.x - b.center.x)
			});*/

		}

		//
		// Remove triangles that shared edges with "supertriangle"
		//
		var tempArray = new Array();
		for (var i in triangles) {
			var triangle = triangles[i];
			
			if (triangles[i]) {
				if(triangle.OnEdge(st)) {
					delete triangles[i];
				} else {
					tempArray.push(triangles[i]);  //Get a clean array of non-null triangles
				}
			}
		}

		triangles = tempArray;
		delete tempArray;
		return triangles;

	}  


	// Internal: create a triangle that bounds the given vertices, with room to spare

	function createBoundingTriangle(vertices, minx, miny, maxx, maxy) {
		// NOTE: There's a bit of a heuristic here. If the bounding triangle
		// is too large and you see overflow/underflow errors. If it is too small
		// you end up with a non-convex hull.

		var dx = (maxx - minx) * 10;
		var dy = (maxy - miny) * 10;


		var stv0 = new vertex(minx - dx, (miny - dy) * 3);
		var stv1 = new vertex(minx - dx, maxy + dy);
		var stv2 = new vertex((maxx + dx) * 3, maxy + dy);

		return new triangle(stv0, stv1, stv2);

	}  


	// Internal: update triangulation with a vertex
	function addVertex(vertex, triangles) {
		var edges = [];
		var edgeHash = {};
		// Remove triangles with circumcircles containing the vertex
		for (var i in triangles) {
			var triangle_ = triangles[i];
			if (triangle_.inCircumcircle(vertex)) {
				var edge1 = new edge(triangle_.v0, triangle_.v1);
				var edge2 = new edge(triangle_.v1, triangle_.v2);
				var edge3 = new edge(triangle_.v2, triangle_.v0);
				edges.push(edge1); 
				edgeHash[edge1.hashCode] = (edgeHash[edge1.hashCode] ? edgeHash[edge1.hashCode] + 1 : 1);
				edges.push(edge2); 
				edgeHash[edge2.hashCode] = (edgeHash[edge2.hashCode] ? edgeHash[edge2.hashCode] + 1 : 1);
				edges.push(edge3); 
				edgeHash[edge3.hashCode] = (edgeHash[edge3.hashCode] ? edgeHash[edge3.hashCode] + 1 : 1);

				delete triangles[i];
			}
		}
		edges = uniqueEdges(edges, edgeHash);

		// Create new triangles from the unique edges and new vertex
		for (var i in edges) {
			triangles.push(new triangle(edges[i].v0, edges[i].v1, vertex));
		}
	}  

	function isUniqueEdge(edges, newEdge) {
		var unique = true;
		for (var i in edges) { 
			if (edges[i].hashCode == newEdge.hashCode) {
				unique = false
				break;
			}
		}
		return unique;
	}

	// Internal: remove duplicate edges from an array
	function uniqueEdges(edges, edgeHash) {
		var uniqueEdgesArr = [];
		
		for (var i in edges) {      
			if (edgeHash[edges[i].hashCode] == 1) {
				uniqueEdgesArr.push(edges[i]);
			}
		}

		return uniqueEdgesArr; 

	}

	function uniqueEdgesOld(edges) { 
		var uniqueEdgesArr = [];
		var prevHash;
		edges.sort(function(a, b) {
			if (a.hashCode > b.hashCode) {
				return 1
			} else {
				return -1
			}
		});
		for (var i in edges) {
			var unique = true;
			if (edges[i].hashCode == prevHash) {
				unique = false
			}
			if (i != (edges.length - 1)) {
				if (edges[i].hashCode == edges[parseInt(i) + 1].hashCode) {
					prevHash = edges[i].hashCode;
					unique = false;
				}
			}
			if (unique) {
				uniqueEdgesArr.push(edges[i]);
			}

		}

		return uniqueEdgesArr;

	}

	function edge(v0, v1) {
		if (v1.x > v0.x) {
			this.v0 = v0;
			this.v1 = v1;
		} else {
			this.v0 = v1;
			this.v1 = v0;
		}
		if (v1.x != v0.x) {
			this.hashCode = this.v0.x + ' ' + this.v0.y + ':' + this.v1.x + ' ' + this.v1.y
		} else {
			this.hashCode = this.v0.x + ' ' + Math.min(this.v0.y,this.v1.y) + ':' + this.v1.x + ' ' + Math.max(this.v0.y,this.v1.y)
		}
	} 


function triangle(v0, v1, v2) {
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

	this.clearGradient = function() {
		this.transparent = true;
		if (!this.midVertex) {
			this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
			this.midVertex.avColor();
		}
		this.midVertex.transparent = true;
		//		var midGrad = this.midVertex.avColor();

		var midGrad = {'red': this.midVertex.red, 'blue': this.midVertex.blue, 'green': this.midVertex.green};
		for (var i = 0; i < midGrads.length; i++) {
			if ((midGrads[i].x == this.midVertex.x) && (midGrads[i].y == this.midVertex.y)) {
				midGrads[i].gradColor = midGrad;
				break;
			}
		}
		if (!midGrad) {
			midGrads.push({'x': this.midVertex.x, 'y': this.midVertex.y, 'gradColor': midGrad});
		}

		this.midVertex.gradientColor = midGrad;
		this.midVertex.red = midGrad.red;			
		this.midVertex.green = midGrad.green;			
		this.midVertex.blue = midGrad.blue;
		return midGrad;
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

	this.getGradient = function(ctx) {
		if (((this.v0.colorString()) == (this.v1.colorString())) && ((this.v0.colorString()) == (this.v2.colorString()))) {
			var tmpColor = this.v0;
			if (!this.midVertex) {
				this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
			}

			this.midVertex.gradientColor = this.getSolidGradientColor(this.midVertex, this.v0);			

			if (mainController.useSolidGradient) {
				tmpColor = this.midVertex.gradientColor;
			} 

			this.midVertex.red = tmpColor.red;			
			this.midVertex.green = tmpColor.green;			
			this.midVertex.blue = tmpColor.blue;			

		} else {
			if (!this.midVertex) {
				this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
				this.midVertex.avColor();			
			}
		}

		var rgbStart = 'rgb(' + ~~ ((this.midVertex.red + this.v0.red) / 2) + ',' + ~~ ((this.midVertex.green + this.v0.green) / 2) + ',' + ~~ ((this.midVertex.blue + this.v0.blue) / 2) + ')';
		var rgbStop = 'rgb(' + ~~ ((this.midVertex.red + this.v1.red + this.v2.red) / 3) + ',' + ~~ ((this.midVertex.green + this.v1.green + this.v2.green) / 3) + ',' + ~~ ((this.midVertex.blue + this.v1.blue + this.v2.blue) / 3) + ')';
		var rgbPts = {'start': rgbStart, 'stop': rgbStop};			


		var lingrad 
		if (ctx) {
			lingrad = ctx.createLinearGradient(this.v0.x, this.v0.y, Math.max(this.v1.x, this.v2.x), Math.max(this.v1.y, this.v2.y));
			lingrad.addColorStop(0, rgbPts.start);
			lingrad.addColorStop(1, rgbPts.stop);
		}
		if (!ctx) {
			return {'start': rgbStart, 'stop': rgbStop};
		} else {
			return lingrad;
		}
	}

	this.getColor = function () {
		if (!this.midVertex) {
			this.midVertex = new vertex(this.midPoint.x, this.midPoint.y);
			this.midVertex.avColor();			
		}

		return 'rgb(' + ~~ (this.midVertex.red) + ',' + ~~ (this.midVertex.green) + ',' + ~~ (this.midVertex.blue) + ')';
	}


	this.drawStroke = function(ptA, ptB, ctx) {
		ctx.beginPath();
		ctx.lineWidth = mainController.strokeWidth;

		ctx.moveTo(ptA.x, ptA.y);
		ctx.lineTo(ptB.x, ptB.y);
		var rgb = hexToRGB(mainController.strokeColor);
		ctx.strokeStyle = "rgba("+rgb.r+","+rgb.g+","+rgb.b+"," + mainController.strokeOpacity + ")";
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
 
		svg.appendChild(line);

	}

	this.drawStrokes = function(ctx, createSVGs) {
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



	this.drawSVG = function(svg, id){
		/*
			<linearGradient id="triangle0_1_" gradientUnits="userSpaceOnUse" x1="334.2407" y1="908.8262" x2="335.2407" y2="907.8262" gradientTransform="matrix(860 0 0 -592 -287102.5 538161.5)">
				<stop  offset="0" style="stop-color:#0F0F0F"/>
				<stop  offset="1" style="stop-color:#0A0A0A"/>
			</linearGradient>
		*/

		var ns = 'http://www.w3.org/2000/svg';
		var defs = document.createElementNS(ns, 'defs');

		var fillStyle;

		if (mainController.useGradient && !this.transparent) {
			var rgbPts = this.getGradient();
			var grad = document.createElementNS(ns, 'linearGradient');
			grad.setAttributeNS(null, 'id', 'gr' + id);
			grad.setAttributeNS(null, 'x1', '0%');
			grad.setAttributeNS(null, 'x2', '100%');
			grad.setAttributeNS(null, 'y1', '0%');
			grad.setAttributeNS(null, 'y2', '100%');
			var stopTop = document.createElementNS(ns, 'stop');
			stopTop.setAttributeNS(null, 'offset', '0%');
			stopTop.setAttributeNS(null, 'stop-color', rgbPts.start);
			grad.appendChild(stopTop);
			var stopBottom = document.createElementNS(ns, 'stop');
			stopBottom.setAttributeNS(null, 'offset', '100%');
			stopBottom.setAttributeNS(null, 'stop-color', rgbPts.stop);
			grad.appendChild(stopBottom);

			defs.appendChild(grad);
			fillStyle = 'url(#gr' + id + ')';
		} else {
			fillStyle = this.getColor(); 
		}



		svg.appendChild(defs);


		var newPoly = document.createElementNS(ns, 'polygon');
		newPoly.setAttribute('id', 'triangle' + id);
		newPoly.setAttribute('points', this.pointsString);
		newPoly.setAttribute('style', 'fill: ' + fillStyle + '; stroke: rgb(0, 0, 0); stroke-width: 0;');
		svg.appendChild(newPoly);

		if (mainController.showStroke) {
			this.drawStrokes(svg, true);
		}
	}

	this.Circumcircle = function() {
		var A = this.v1.x - this.v0.x;
		var B = this.v1.y - this.v0.y;
		var G = 2.0 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));

		var dx, dy;
		var dx2, dy2;

		if (Math.abs(G) < mainController.DELTA) {
			// Collinear - find extremes and use the midpoint
			this.center = new vertex((this.minx + this.maxx) / 2, (this.miny + this.maxy) / 2);

			dx = this.center.x - this.minx;
			dy = this.center.y - this.miny;
			//dx2 = this.center.x + this.minx;
			//dy2 = this.center.y + this.miny;
		}
		else {
			var C = this.v2.x - this.v0.x;
			var D = this.v2.y - this.v0.y;
			var E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
			var F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y);
			var cx = (D * E - B * F) / G;
			var cy = (A * F - C * E) / G;

			this.center = new vertex(cx, cy);

			dx = this.center.x - this.v0.x;
			dy = this.center.y - this.v0.y;
			//dx2 = this.center.x + this.v0.x;
			//dy2 = this.center.y + this.v0.y;

		}

		//this.leftEdge = dx;
		//this.topEdge = dy;

		//this.rightEdge = dx2;
		//this.bottomEdge = dy2;


		this.radius_squared = dx * dx + dy * dy;
		this.radius = Math.sqrt(this.radius_squared);
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
			if (mainController.useGradient && !this.transparent) {
				ctx.fillStyle = this.getGradient(mainController.fillCtx); 
			} else {
				ctx.fillStyle = this.getColor(); 
			}
		}
		
		ctx.moveTo(this.v0.x, this.v0.y);
		ctx.lineTo(this.v1.x, this.v1.y);
		ctx.lineTo(this.v2.x, this.v2.y);
		ctx.lineTo(this.v0.x, this.v0.y);
		if (!excludeFill) {ctx.fill();}
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







	
	

	this.Circumcircle();


}


 
 



 
 