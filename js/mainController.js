function mainCtrl(srcImg) {
	var ctx;
	var currentIndex= 0;
	var nearestV = new Array();
	var lastUndo = false;

	this.projectID = '';
	this.projectData = false;
	this.toolMode = 'Add Points';
	this.clickLayer = false;
	this.selectLayer = false;
	this.canvasContainer = false;
	this.selectedVertex = false;
	this.dataStack = [];
	this.DELTA = 1.0e-5;
	this.imgCtx = false;
	this.canvas = false;
	this.vertCanvas = false;
	this.strokeCanvas = false;
	this.tempCanvas = false;
	this.selectCanvas = false;
	this.sourceImg = srcImg;
	this.snapSide = 6;
	this.pointDetectionThreshold = 4;
	this.vertices = new Array();
	this.lastVertices = new Array();
	this.triangles = new Array();
	this.showVertices = true;
	this.useGradient = true;
	this.showFill = true;
	this.showCircles = false; 
	this.showStroke = false;
	this.useSolidGradient = true;
	this.maxUndos = 25;
	this.vertsPerSide = 5;
	this.vertsGrid = {hor:25, vert: 25};
	this.randomCount = 25;
	this.redrawDelayFactor = .25;
	this.needToDrawTriangles = true;
	this.strokeColor = "#ffffff";
	this.strokeOpacity = 1;
	this.strokeWidth = 1;
	this.pointColor = "#ffffff";
	this.pointStrokeColor = "#ffffff";
	this.pointOpacity = 1;
	this.pointStrokeOpacity = 1;
	this.pointStrokeWidth = 1;
	this.pointShape = 'circle';
	this.syncPointStrokeSizes = false;
	this.globalOpacity = 1;

	this.canvasWidth = 300;
	this.canvasHeight = 300;
	this.spiralSettings = {repeat: 1, xshift: 0, yshift: 0, scale: 1, direction: 1, degIncrements: 5}

	this.imageData = new Array();
	this.drawTimer = 0;

	this.fillCtx = false;
	this.vertCtx = false;
	this.strokeCtx = false;
	this.tempCtx = false;
	this.selectCtx = false;
	this.canvasTransparency = 1;
	this.largeVertexThreshold = 100;
	this.gradients = [];
	this.solidColors = [];
	this.offsetX = 0;
	this.offsetY = 0;
	this.allowMultidrop = true;
	this.multidropDistance = Math.pow(25, 2);
	this.selectionBox = false;
	this.includeOriginalImageInPNG = true;

	this.init = function() {
		var mCtrl = this;

		this.clickLayer = document.getElementById('clickLayer');
		this.selectLayer = document.getElementById('selectLayer');

		this.canvasContainer = document.getElementById('canvasContainer');
		canvas = document.getElementById('canvas');
		this.canvas = document.getElementById('canvas');
		this.vertCanvas = document.getElementById('vertCanvas');
		this.strokeCanvas = document.getElementById('strokeCanvas');
		this.tempCanvas = document.getElementById('tempCanvas');
		this.selectCanvas = document.getElementById('selectCanvas');
		this.sourceImg = document.getElementById('sourceImg');

		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			this.fillCtx = canvas.getContext('2d');
			this.imgCtx = this.sourceImg.getContext('2d');
			this.vertCtx = this.vertCanvas.getContext('2d');
			this.strokeCtx = this.strokeCanvas.getContext('2d');
			this.tempCtx = this.tempCanvas.getContext('2d');
			this.selectCtx = this.selectCanvas.getContext('2d');
		}

		//initInterface();

		window.onkeyup = function(e){
		 // Ensure event is not null
			e = e || window.event;
			if ((e.which == 90 || e.keyCode == 90) && e.ctrlKey) {
				// Ctrl + Z
				// Undo last change
				//remove the last vertex
				if (mCtrl.dataStack.length > 0) {
					mCtrl.lastUndo = mCtrl.cloneVertices();
					mCtrl.vertices = mCtrl.dataStack.pop();
					mCtrl.needToDrawTriangles = true;
					mCtrl.redrawTriangles = true;
					mCtrl.draw();
				} 
				mCtrl.needToDrawTriangles = true;
				mCtrl.reDraw();
			} else if ((e.which == 89 || e.keyCode == 89) && e.ctrlKey) {
				// Ctrl + Y
				// Redo last undo
				if (mCtrl.lastUndo) {
					mCtrl.dataStack.push(mCtrl.lastUndo)
					mCtrl.vertices = mCtrl.lastUndo;
					mCtrl.lastUndo = false;
					mCtrl.needToDrawTriangles = true;
					mCtrl.redrawTriangles = true;
					mCtrl.draw();
				}
				mCtrl.needToDrawTriangles = true;
				 mCtrl.reDraw();
			}
		}

		mCtrl.selectLayer.onmousedown = function(e) {
			if (e.which !== 3 && isContextMenuOpen()) {
				//Left mouse was clicked, but there is a context menu open, so just close the menu
				hideContentMenu();
				return false;
			} else if (e.which === 3) {
				//Right mouse was clicked, don't do anything else.
				return false;
			}

			var startMousePos = mCtrl.getRelativeMousePosition(e);
			var mousePos = false;
			mCtrl.selectLayer.onmousemove = function(e) {
				mousePos = mCtrl.getRelativeMousePosition(e);
				mCtrl.selectCtx.clearRect(0, 0, mCtrl.canvas.width, mCtrl.canvas.height)
				mCtrl.selectCtx.beginPath();

				mCtrl.selectCtx.rect(startMousePos.x, startMousePos.y, mousePos.x - startMousePos.x, mousePos.y - startMousePos.y)
				mCtrl.selectCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
				mCtrl.selectCtx.stroke();

				ctx.closePath();
			}
			mCtrl.selectLayer.onmouseup = function(e) {
				mousePos = mCtrl.getRelativeMousePosition(e);
				if ((mousePos.x != startMousePos.x) && (mousePos.y != startMousePos.y)) {
					//console.log(mousePos.x + " " + startMousePos.x + " " + (mousePos.x - startMousePos.x) + " : "  + (mousePos.y - startMousePos.y))
					mCtrl.selectCtx.clearRect(0, 0, mCtrl.canvas.width, mCtrl.canvas.height)
					mCtrl.selectCtx.beginPath();
					mCtrl.selectCtx.fillStyle = 'rgba(0, 0, 0,.3)';
					mCtrl.selectCtx.rect(0, 0, mCtrl.canvas.width, mCtrl.canvas.height);
					mCtrl.selectCtx.strokeStyle = 'rgba(0, 0, 0, 0)';
					mCtrl.selectCtx.fill();
					mCtrl.selectCtx.stroke();

					mCtrl.selectCtx.rect(startMousePos.x, startMousePos.y, mousePos.x - startMousePos.x, mousePos.y - startMousePos.y)
					mCtrl.selectCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
					mCtrl.selectCtx.stroke();

					mCtrl.selectCtx.clearRect(startMousePos.x, startMousePos.y, mousePos.x - startMousePos.x, mousePos.y - startMousePos.y)
					ctx.closePath();
					var xOffset = 0; //mCtrl.canvasOffset();
					mCtrl.selectionBox = {
							xstart: Math.min(startMousePos.x, mousePos.x) + xOffset, 
							ystart: Math.min(startMousePos.y, mousePos.y), 
							xend: Math.max(startMousePos.x, mousePos.x) + xOffset, 
							yend: Math.max(startMousePos.y, mousePos.y)
						};					
				} else {
					mCtrl.clearSelection();
				}



				mCtrl.selectLayer.onmouseup = function(e) {void(0);}
				mCtrl.selectLayer.onmousemove = function(e) {
					void(0)
				}
			}
		}


		mCtrl.clickLayer.onmousedown = function(e) {
			mCtrl.selectionBox = false;
			if (e.which !== 3 && isContextMenuOpen()) {
				//Left mouse was clicked, but there is a context menu open, so don't add a vertex, close the menu
				hideContentMenu();
				return false;
			}

			mCtrl.recordVertices();
			mCtrl.selectedVertex = false;
			
			var mousePos = mCtrl.getRelativeMousePosition(e);
			var tempX = ~~ (mousePos.x);
			var tempY = ~~ (mousePos.y);

			var selectedPoint = mCtrl.verticesDetect(tempX, tempY, true);

			if (selectedPoint.length == 0) {
				if (e.which === 3) {
					//Right mouse was clicked, don't add a vertex
					return;
				}

				mCtrl.addVertex(tempX, tempY);
				mCtrl.raiseEvent("verticesChanged", "Vertices Changed");

				if (mCtrl.allowMultidrop) {
					var lastMousePos = mousePos;
					mCtrl.clickLayer.onmouseleave = function(e) {
						mCtrl.initiateDraw();
						mCtrl.clickLayer.onmousemove = function(e) {void(0);}
						mCtrl.clickLayer.onmouseup = function(e) {void(0);}
						mCtrl.clickLayer.onmouseleave = function(e) {void(0);}
					}
					mCtrl.clickLayer.onmousemove = function(e) {
						e.preventDefault();
						  e.stopPropagation();
						var movingMousePos = mCtrl.getRelativeMousePosition(e);
						moveDist = Math.pow((movingMousePos.x - lastMousePos.x),2) + Math.pow((movingMousePos.y - lastMousePos.y),2);
						if (moveDist > mCtrl.multidropDistance) {
							mCtrl.addVertex(~~ (movingMousePos.x), ~~ (movingMousePos.y));
							mCtrl.raiseEvent("verticesChanged", "Vertices Changed");
							lastMousePos = movingMousePos;
						}

					}
				}

				mCtrl.clickLayer.onmouseup = function(e) {
					mCtrl.initiateDraw();
					mCtrl.clickLayer.onmousemove = function(e) {void(0);}
					mCtrl.clickLayer.onmouseup = function(e) {void(0);}
					mCtrl.clickLayer.onmouseleave = function(e) {void(0);}
				}

			} else {
				tempVertex = selectedPoint[0];
				var theVertexToMove = mCtrl.vertices[tempVertex];
				mCtrl.highlightVertex(theVertexToMove);
				mCtrl.selectedVertex = tempVertex;
				if (e.which === 3) {
					//Right mouse was clicked, don't add a vertex
					return false;
				}
				if (e.ctrlKey) {
					window.console && console.log('Im holding ctrl!!!')
					mCtrl.vertices.splice(tempVertex, 1);
					mCtrl.draw();
				} else {
					mCtrl.needToDrawTriangles = true;
					theVertexToMove.isMoving = true;
					//theVertexToMove.erase(mCtrl.vertCtx);
					mCtrl.drawVertices(true);
					theVertexToMove.move(theVertexToMove.x, theVertexToMove.y, mCtrl.tempCtx );
 
					mCtrl.clickLayer.onmousemove = function(e) {
						var mousePos = mCtrl.getRelativeMousePosition(e);
						var tempX = ~~ (mousePos.x);
						var tempY = ~~ (mousePos.y);

						theVertexToMove.move(tempX, tempY, mCtrl.tempCtx );

						if (mCtrl.vertices.length < mCtrl.largeVertexThreshold) {
							mCtrl.draw();
						}
					}
					mCtrl.clickLayer.onmouseup = function(e) {
						mCtrl.completeVertMove(theVertexToMove);
					}
					mCtrl.clickLayer.onmouseleave = function(e) {
						mCtrl.completeVertMove(theVertexToMove);
					}
				}
			}
		}
		//this.draw();
	}

	this.clearSelection = function() {
		this.selectCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.selectionBox = false;
	}

	this.completeVertMove = function(theVertexToMove) {
		var mCtrl = this;
		mCtrl.unhighlightVertex(theVertexToMove);
		theVertexToMove.isMoving = false;

		theVertexToMove.draw(mCtrl.vertCtx);
		mCtrl.needToDrawTriangles = true;
		mCtrl.initiateDraw();
		mCtrl.clickLayer.onmouseup = function(e) {void(0);}
		mCtrl.clickLayer.onmousemove = function(e) {void(0)}
		mCtrl.clickLayer.onmouseleave = function(e) {void(0)}
	}

	this.scaleCanvas = function(theSourceImage, currentZoom) {
		var newWidth = theSourceImage.width * currentZoom;
		var newHeight = theSourceImage.height * currentZoom;

		this.resizeElement(this.sourceImg, newWidth, newHeight);
		this.resizeElement(this.canvas, newWidth, newHeight);
		this.resizeElement(this.vertCanvas, newWidth, newHeight);
		this.resizeElement(this.strokeCanvas, newWidth, newHeight);
		this.resizeElement(this.tempCanvas, newWidth, newHeight);
		this.resizeElement($(this.clickLayer), newWidth, newHeight);
		this.resizeElement($(this.selectLayer), newWidth, newHeight);
		this.resizeElement(this.selectCanvas, newWidth, newHeight)

		this.canvasWidth = newWidth;
		this.canvasHeight = newHeight;

		this.offsetX = this.canvasContainer.offsetLeft + (this.canvas ? this.canvas.offsetLeft : 0);
		this.offsetY = this.canvasContainer.offsetTop + (this.canvas ? this.canvas.offsetTop : 0);



		this.imgCtx.clearRect(0, 0, newWidth, newHeight);
		this.imgCtx.drawImage(theSourceImage, 0, 0, newWidth, newHeight);
		this.draw();
	}

	this.resizeElement = function(element, width, height){
		element.width = width;
		element.height = height;
		$(element).width(width);
		$(element).height(height);

	}

	this.updateVertexSize = function(vertexSize, stopRecursion) {
		this.snapSide = vertexSize * 4;
		for (var i = this.vertices.length-1; i>=0; i--) {
			this.vertices[i].r = vertexSize;
	    } 

		if (this.syncPointStrokeSizes && !stopRecursion) {
			this.updateStrokeSize(vertexSize, !stopRecursion);
		}
	    this.reDraw(true);
	}


	this.updateStrokeSize = function(strokeWidth, stopRecursion) {
		this.strokeWidth = strokeWidth;
		this.drawStrokes();

		if (this.syncPointStrokeSizes && !stopRecursion) {
			this.updateVertexSize(strokeWidth, !stopRecursion);
		}
	}

	this.setTransparency = function(transparency) {
		this.globalOpacity = transparency;
		this.canvasTransparency = transparency;
		$(this.canvas).css('opacity', transparency);
		$(this.vertCanvas).css('opacity', transparency);
		$(this.strokeCanvas).css('opacity', transparency);
		$(this.tempCanvas).css('opacity', transparency);
	}

	this.setStrokeTransparency = function(transparency) {
		this.strokeOpacity = transparency;
		this.drawStrokes();
	}

	this.setPointTransparency = function(transparency) {
		this.pointOpacity = transparency;
		this.reDraw(true);
	}

	this.setPointStrokeTransparency = function(transparency) {
		this.pointStrokeOpacity = transparency;
		this.reDraw(true);
	}

	this.setPointStrokeWidth = function(ptStrokeWidth) {
		this.pointStrokeWidth = ptStrokeWidth;
		this.reDraw(true);
	}


	this.setPointShape = function(shape) {
		this.pointShape = shape;
		this.reDraw(true);
	}

	this.highlightVertex = function(selectedVertex) {
		selectedVertex.r = Math.min(this.snapSide, 15);
	}

	this.unhighlightVertex = function(selectedVertex) {
		var defaultPointSize = this.snapSide / 4;
		if (selectedVertex) {
			selectedVertex.r = defaultPointSize;
		} else {
			for (var i = 0; i<this.vertices.length; i++) {
				this.vertices[i].r = defaultPointSize;
		    }  
		}
	}

	this.canvasOffset = function() {
		var posx = 0;
		var trans = $(this.canvasContainer).css('-webkit-transform');
		if (!trans) {trans = $(this.canvasContainer).css('transform');}

		if (trans) {
			var currTrans = trans.split(/[()]/)
			if (currTrans && currTrans.length > 1 && currTrans[1].length > 3) {
				posx = currTrans[1].split(',')[4];
			}			
		}

		return posx * 1;
	}

	this.scrollPosition = function() {
		return {'x': $(this.canvasContainer)[0].scrollLeft, 'y': $(this.canvasContainer)[0].scrollTop}
	}

	this.getRelativeMousePosition = function(e) {
		var relPos = {};
		relPos.x = (e.pageX - this.offsetX - this.canvasOffset()) + this.scrollPosition().x;
		relPos.y = (e.pageY - this.offsetY) + this.scrollPosition().y;
		return relPos;
	}


	this.addVertex = function(Vx,Vy, supressDraw) {
		this.needToDrawTriangles = true;

		var v = false;
		if (!this.isVertex(Vx,Vy)) {
			v = new vertex(Vx, Vy);
			v.avColor();
			v.draw(this.vertCtx);
			this.vertices.push(v);	
		} else {
			v = this.verticesDetect(Vx,Vy);
		}

		return v;
	}


	this.setShowVertices = function(vertFlag) {
		this.showVertices = vertFlag;
		if (this.showVertices) {
			$(this.vertCanvas).show();
			this.reDraw();
		} else {
			$(this.vertCanvas).hide();
		}
	}	

	this.toggleVertices = function() {
		this.setShowVertices(!this.showVertices);
	}

	this.toggleGradientDisplay = function() {
		this.useGradient = !this.useGradient;
		this.reDraw();
	}

	this.toggleFillDisplay = function() {
		this.showFill = !this.showFill;
		
		if (this.showFill) {
			$(this.canvas).show();
			this.draw();
		} else {
			$(this.canvas).hide();
		}
	}

	this.setShowStroke = function(strokeFlag) {
		this.showStroke = strokeFlag;
		if (this.showStroke) {
			$(this.strokeCanvas).show();
			this.reDraw();
		} else {
			$(this.strokeCanvas).hide();
		}	
	}

	this.toggleStrokeDisplay = function() {
		this.setShowStroke(!this.showStroke);
	}

	this.toggleSolidGradientDisplay = function() {
		this.togglingSolidGradient = true;
		this.useSolidGradient = !this.useSolidGradient;
		this.redrawTriangles = true;
		this.reDraw();			
		this.togglingSolidGradient = false;
	}

	this.resetSolidGradient = function() {
		midGrads = [];
		this.redrawTriangles = true;
		this.reDraw();			
	}

	this.setSyncPointStrokeSizes = function(syncSetting, newSize ) {
		this.syncPointStrokeSizes = syncSetting;
		if (this.syncPointStrokeSizes && newSize) {
			this.updateStrokeSize(newSize);
			this.updateVertexSize(newSize);
		}
	}

	this.addRandomVertices = function(randCnt) {
		var totCnt = randCnt ? randCnt : this.randomCount;
		this.recordVertices();

		for (var i = 0; i < totCnt; i++) {
			var randX = this.canvasWidth * Math.random();
			var randY = this.canvasHeight * Math.random();

			this.addVertex(~~ (randX), ~~ (randY), true);
		}
		this.raiseEvent("verticesChanged", "Vertices Changed");
		
		this.initiateDraw();
	}

	this.addEdgeVertices = function(edgeCnt) {
		if (edgeCnt) {this.vertsPerSide = edgeCnt;}


		var xtmp = 0;
		var ytmp = 0;
		var ytmp2 = this.canvasHeight;
		//horizontal
		for (var i=0; i < this.vertsPerSide; i++) {
			xtmp = i * this.canvasWidth / (this.vertsPerSide-1);
			var v = this.addVertex(~~ (xtmp), ~~ (ytmp), true);
			v.isEdge = true;

			var v2 = this.addVertex(~~ (xtmp), ~~ (ytmp2), true);
			v2.isEdge = true;
		}

		//vertical
		xtmp = 0;
		var xtmp2 = this.canvasWidth;
		for (var i=1; i < this.vertsPerSide - 1; i++) {
			ytmp = i * this.canvasHeight / (this.vertsPerSide-1);

			var v = this.addVertex(~~ (xtmp), ~~ (ytmp), true);
			v.isEdge = true;

			var v2 = this.addVertex(~~ (xtmp2), ~~ (ytmp), true);
			v2.isEdge = true;
		}
		
		this.raiseEvent("verticesChanged", "Vertices Changed");
        this.initiateDraw();
	}

	this.addGridVertices = function(edgeCnt) {
		if (edgeCnt) {
			this.vertsGrid.hor = edgeCnt; 
			this.vertsGrid.vert = edgeCnt;
		}

		var xtmp = 0;
		var ytmp = 0;

		var horFactor = this.canvasWidth / (this.vertsGrid.hor-1);
		var vertFactor = this.canvasHeight / (this.vertsGrid.vert-1);
		for (var i=0; i < this.vertsGrid.hor; i++) {
			xtmp = i * horFactor;
			for(var j=0; j < this.vertsGrid.vert; j++) {
				ytmp = j * vertFactor;
				var v = this.addVertex(~~ (xtmp), ~~ (ytmp), true);
				v.isGrid = true;
			}
		}
		
		this.raiseEvent("verticesChanged", "Vertices Changed");
        this.initiateDraw();
	}

	this.addSpiralVertices = function(repeat, scale, direction, xshift, yshift, degIncrements) {
		this.spiralSettings.repeat = repeat ? repeat : this.spiralSettings.repeat;
		this.spiralSettings.scale = scale ? scale : this.spiralSettings.scale;
		this.spiralSettings.direction = direction ? direction : this.spiralSettings.direction;
		this.spiralSettings.degIncrements = degIncrements ? degIncrements : this.spiralSettings.degIncrements;

		var goldenRat = (Math.sqrt(5) + 1)/2;
		var growth = Math.log(goldenRat)/(Math.PI/2);

		this.clearSpiralVertices(true);

 
		var baseRad = Math.exp(growth * 2 * Math.PI) - Math.exp(growth * 197 * Math.PI/180);
		var baseRadY = Math.exp(growth * 270 * Math.PI / 180);

		var scaleX = this.canvasWidth * .85 /  baseRad ;
		var scaleY = this.canvasHeight * .85 /  baseRadY ;

		this.spiralSettings.scale =   this.canvasWidth * .85 / Math.max(baseRad, baseRadY)/2;
		this.spiralSettings.xshift =  this.spiralSettings.scale * -1 * (Math.exp(growth * 197 * Math.PI/180) * Math.cos(197 * Math.PI/180)); //xshift ? xshift : baseRad;
		this.spiralSettings.yshift = 100 +  this.spiralSettings.scale *  -1 * (Math.exp(growth * 270 * Math.PI/180) * Math.sin(270 * Math.PI/180));  //yshift ? yshift : baseRadY;

		for (var i = 0; i<= 360/this.spiralSettings.degIncrements; i++) {
			var angle = (this.spiralSettings.degIncrements) * i * Math.PI/180;  
			var rad = this.spiralSettings.scale * Math.exp(growth * angle) ;
			for (var j = 0; j < this.spiralSettings.repeat; j++) {
				var radLoop = rad * (j+1)/this.spiralSettings.repeat;
				var v = this.addVertex(~~ (radLoop * Math.cos(angle) + this.spiralSettings.xshift), ~~ (radLoop * Math.sin(angle) + this.spiralSettings.yshift), true);
				v.isSpiral = true;
			}
		}		

		this.raiseEvent("verticesChanged", "Vertices Changed");
        this.initiateDraw();
	}

	this.reset = function() {
		//reset everything
		this.clearVertices();
		this.lastUndo = false;
		this.dataStack = [];
		this.raiseEvent("verticesChanged", "Vertices Changed");
	}

	this.isInSelectionArea = function(vert) {
		var isSelected = false;
		
		if (this.selectionBox) {
			if ((vert.x > this.selectionBox.xstart) && 
				(vert.x < this.selectionBox.xend) && 
				(vert.y > this.selectionBox.ystart) && 
				(vert.y < this.selectionBox.yend)) {
					isSelected = true;
			}
		}
		return isSelected;
	}

	this.clearSelectTriangles = function() {
		if (this.selectionBox) {
			var selCnt = 0;

			for (var i = this.triangles.length-1; i>=0; i--) {
				//Step backward or the splicing gets evil.
				var topLeft = {'x': this.triangles[i].minx, 'y': this.triangles[i].miny};
				var topRight = {'x': this.triangles[i].maxx, 'y': this.triangles[i].miny};
				var bottomLeft = {'x': this.triangles[i].minx, 'y': this.triangles[i].maxy};
				var bottomRight = {'x': this.triangles[i].maxx, 'y': this.triangles[i].maxy};
				if (this.isInSelectionArea(topLeft) && this.isInSelectionArea(topRight) && this.isInSelectionArea(bottomLeft) &&this.isInSelectionArea(bottomRight)) {
					selCnt++;
					this.triangles[i].toggleGradient(true);
				}
			}
			if (selCnt > 0) {
				//this.raiseEvent("verticesChanged", "Vertices Changed");
				this.initiateDraw();
			} else {
				this.clearSelection();
			}
		} else {
			alert("nothing selected")
		}
	}

	this.deleteSelectedVertices = function() {
		if (this.selectionBox) {
			var delCnt = 0;

			for (var i = this.vertices.length-1; i>=0; i--) {
				//Step backward or the splicing gets evil.
				if (this.isInSelectionArea(this.vertices[i])) {
					delCnt++;
					this.deleteVertex(i, true);
				}
			}
			if (delCnt > 0) {
				this.raiseEvent("verticesChanged", "Vertices Changed");
				this.initiateDraw();
			}
			this.clearSelection();
		} else {
			alert("nothing selected")
		}
	}

	this.deleteSelectedVertex = function() {
		if (this.selectedVertex) {
			this.deleteVertex(this.selectedVertex);
		}
	}

	this.deleteVertex = function(vertexIndex, suppressDraw) {
		if (vertexIndex !== false) {
			this.vertices.splice(vertexIndex, 1);
			this.needToDrawTriangles = true;
			if (!suppressDraw) {
				this.raiseEvent("verticesChanged", "Vertices Changed");
				this.initiateDraw();
			}
		}
	}

	this.clearVertices = function() {
		this.recordVertices();
		this.vertices = [];
		this.needToDrawTriangles = true;
		this.raiseEvent("verticesChanged", "Vertices Changed");
		this.initiateDraw();
	}

	this.loadProject = function(project) {
		if (project) {
			this.projectID = project.ProjectID;
			this.projectData = project;
			if (project.activeVersion) {
				this.globalOpacity = 1;
				this.showVertices = project.activeVersion.showVertices;
				this.useGradient = project.activeVersion.useGradient;
				this.showFill = project.activeVersion.showFill;
				this.showCircles = project.activeVersion.showCircles;
				this.showStroke = project.activeVersion.showStroke;
				this.useSolidGradient = project.activeVersion.useSolidGradient;
				if (project.activeVersion.solidGradients) {midGrads = project.activeVersion.solidGradients;}
					
				if (project.activeVersion.strokeWidth !== undefined) {this.strokeWidth = project.activeVersion.strokeWidth; }
				if (project.activeVersion.strokeOpacity !== undefined) {this.strokeOpacity = project.activeVersion.strokeOpacity; }
				if (project.activeVersion.strokeColor !== undefined) {this.strokeColor = project.activeVersion.strokeColor; }
				if (project.activeVersion.syncPointStrokeSizes !== undefined) {this.syncPointStrokeSizes = project.activeVersion.syncPointStrokeSizes; }
				if (project.activeVersion.snapSide !== undefined) {this.snapSide = project.activeVersion.snapSide; }
				if (project.activeVersion.pointOpacity !== undefined) {this.pointOpacity = project.activeVersion.pointOpacity; }
				if (project.activeVersion.pointStrokeOpacity !== undefined) {this.pointStrokeOpacity = project.activeVersion.pointStrokeOpacity; }
				if (project.activeVersion.pointStrokeWidth !== undefined) {this.pointStrokeWidth = project.activeVersion.pointStrokeWidth; }
				if (project.activeVersion.pointShape !== undefined) {this.pointShape = project.activeVersion.pointShape; }
				if (project.activeVersion.pointColor !== undefined) {this.pointColor = project.activeVersion.pointColor; }
				if (project.activeVersion.pointStrokeColor !== undefined) {this.pointStrokeColor = project.activeVersion.pointStrokeColor; }
				if (project.activeVersion.globalOpacity !== undefined) {this.globalOpacity = project.activeVersion.globalOpacity; }

				this.setTransparency(this.globalOpacity);
			}
			this.raiseEvent("projectLoaded", "Project Loaded");

			loadImage(project.ImagePath, project.VertJson);
		}
	}

	this.restoreFromJson = function(dataJSON) {
		var vertsObj = $.parseJSON(dataJSON);
		
		this.reset();
		for (var i = 0; i < vertsObj.length; i++) { 
			var tVertex = this.addVertex(~~ (vertsObj[i].x), ~~ (vertsObj[i].y), true);

			tVertex.isEdge = (vertsObj[i].isEdge != "true") ? false : true;
			tVertex.isGrid = (vertsObj[i].isGrid != "true") ? false : true;
		}
		
		this.raiseEvent("verticesChanged", "Vertices Changed");
		this.raiseEvent("jsonRestored", "JSON Restored");
		this.draw();
	}

	this.clearEdgeVertices = function(){
		this.recordVertices();

		for (var i = this.vertices.length-1; i>=0; i--) {
			if (this.vertices[i].isEdge) {
				this.vertices.splice(i,1);
			}
	    }    
	    this.needToDrawTriangles = true;
		this.raiseEvent("verticesChanged", "Vertices Changed");
		this.draw();
	}

	this.clearGridVertices = function(){
		this.recordVertices();
		for (var i = this.vertices.length-1; i>=0; i--) {
			if (this.vertices[i].isGrid) {
				this.vertices.splice(i,1);
			}
	    }    
	    this.needToDrawTriangles = true;
		this.raiseEvent("verticesChanged", "Vertices Changed");
		this.draw();
	}

	this.clearSpiralVertices = function(suppressDraw) {
		this.recordVertices();
		for (var i = this.vertices.length-1; i>=0; i--) {
			if (this.vertices[i].isSpiral) {
				this.vertices.splice(i,1);
			}
	    }  
	    this.needToDrawTriangles = true;  
		this.raiseEvent("verticesChanged", "Vertices Changed");
		if (!suppressDraw) this.draw();		
	}

	this.recordVertices = function() {
		this.dataStack.push(this.cloneVertices());
		if (this.dataStack.length > this.maxUndos){
			this.dataStack.splice(0,1)
		}
	}

	this.cloneVertices = function() {
		var tempVerts = [];
		for (var i = 0; i < this.vertices.length; i++){
			//tempVerts.push(new vertex(~~ (this.vertices[i].x), ~~ (this.vertices[i].y), this.vertices[i].isEdge, this.vertices[i].isGrid, this.vertices[i].isSpiral))
			tempVerts.push(this.vertices[i].getClone());
		}
		return tempVerts;
	}

	this.getImageData = function(xVal, yVal) {
		if (this.imageData[xVal+'-'+yVal] == undefined ) {
			this.imageData[xVal+'-'+yVal] = this.imgCtx.getImageData(xVal, yVal, this.snapSide, this.snapSide).data;
		}

		return this.imageData[xVal+'-'+yVal];
	}

	this.getColor = function(triangle) {

		var xVal = ~~ ((triangle.v0.x + triangle.v1.x + triangle.v2.x) / 3);
		var yVal = ~~ ((triangle.v0.y + triangle.v1.y + triangle.v2.y) / 3);

		if (this.solidColors[xVal] == undefined) {
			this.solidColors[xVal] = [];
		} 
		//if (this.solidColors[xVal][yVal] == undefined ) {
			var tmpVertex = new vertex(xVal, yVal);
			tmpVertex.avColor();
			this.solidColors[xVal][yVal] = 'rgb(' + ~~ (tmpVertex.red) + ',' + ~~ (tmpVertex.green) + ',' + ~~ (tmpVertex.blue) + ')';
		//}

		return this.solidColors[xVal][yVal];
	}

	this.initiateDraw = function() {
		var mCtrl = this;
		mCtrl.cancelDraw();
		//mCtrl.draw(true);
		var timedelay = Math.min(mCtrl.redrawDelayFactor * mCtrl.vertices.length, 500);
		mCtrl.drawTimer = setTimeout(function() {		
			//mCtrl.raiseEvent("drawing", "Draw");
			mCtrl.showProcessing();
			var timedelay2 = Math.min(mCtrl.redrawDelayFactor * mCtrl.vertices.length, 250);
			//console.log('time delay ' + timedelay2);
			setTimeout(function() {mCtrl.draw();}, timedelay2);
		}, timedelay);
	}

	this.cancelDraw = function() {
		clearTimeout(this.drawTimer);
	}

	this.clearTriangles = function() {
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	this.drawTriangles = function() {

		//create a temporary canvas and then copy it.
		var m_canvas = document.createElement('canvas');
		m_canvas.width = this.canvas.width;
		m_canvas.height = this.canvas.height;
		var m_context = m_canvas.getContext('2d');

		for (var i in this.triangles) {
			this.triangles[i].Draw(m_context, i);
		}
		this.clearTriangles();
		ctx.drawImage(m_canvas, 0, 0);
		delete m_canvas;
		this.needToDrawTriangles = false;
	}

	this.drawVertices = function(excludeMoving) {
		if(!excludeMoving) this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
		this.vertCtx.clearRect(0, 0, this.vertCanvas.width, this.vertCanvas.height);


		if (this.showVertices) {
			for (var i in this.vertices) {
				if (!excludeMoving || !this.vertices[i].isMoving) {
					this.vertices[i].DrawNum(this.vertCtx);	
				}
			}    	
		} 
	}

	this.drawStrokes = function() {
		this.strokeCtx.clearRect(0, 0, this.strokeCanvas.width, this.strokeCanvas.height);
		if (this.showStroke) {
			if (this.needToDrawTriangles) {
				this.triangles = triangulate(this.vertices);
				this.drawTriangles();	
			}

			for (var i in this.triangles) {
				var thisTriangle = this.triangles[i];
				thisTriangle.drawStrokes(this.strokeCtx);
			}
		}
	}

	this.drawStroke = function(ptA, ptB, ctx) {
		ctx.beginPath();
		ctx.lineWidth = this.strokeWidth;
		ctx.moveTo(ptA.x, ptA.y);
		ctx.lineTo(ptB.x, ptB.y);
		var rgb = hexToRGB(this.strokeColor);
		ctx.strokeStyle = "rgba("+rgb.r+","+rgb.g+","+rgb.b+"," + this.strokeOpacity + ")";
		ctx.stroke();    
		ctx.closePath();
	}

	this.updateStrokeColor = function(strokeColor) {
		this.strokeColor = strokeColor;
		this.drawStrokes();
	}

	this.updatePointColor = function(pointColor) {
		this.pointColor = pointColor;
		this.pointStrokeColor = pointColor;
		this.reDraw(true);
	}

	this.getPointSize = function() {
		return Math.ceil(this.snapSide * 10 /4)/10;
	}

	this.draw = function(vertsOnly, suppressRedrawTriangles) {

		if (!this.showFill || this.redrawTriangles) {this.clearTriangles(); }
		if (!vertsOnly && (this.showFill || this.redrawTriangles)) {
			if (!suppressRedrawTriangles && this.needToDrawTriangles) this.triangles = triangulate(this.vertices);

			this.drawTriangles();	
		}

		this.drawVertices();
		this.drawStrokes();
		this.lastVertices = this.cloneVertices();

		this.stopProcessing();
		this.raiseEvent("drawn", "Draw");
		this.redrawTriangles = false; 
	}

	this.reDraw = function(vertsOnly) {
		this.draw(vertsOnly, true);
	}


	this.showProcessing = function() {
		$('body').addClass('processing');
	}

	this.stopProcessing = function() {
		$('body').removeClass('processing');
	}


	this.SVGData = function() {
		var ns = 'http://www.w3.org/2000/svg';
		var svg = document.createElementNS(ns, 'svg');
		svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', ns);
		svg.setAttribute('width', this.canvasWidth);
		svg.setAttribute('height', this.canvasHeight);
		svg.setAttribute('version', '1.1');

		for (var i = 0; i <this.triangles.length; i++) {
			var thisTriangle = this.triangles[i];
			thisTriangle.drawSVG(svg, i);
		}
		if (this.showVertices) {
			for (var i = 0; i <this.vertices.length; i++) {
				var thisVert = this.vertices[i];
				thisVert.drawSVG(svg, i);
			}			
		}

		
		return (new XMLSerializer()).serializeToString(svg);
	}

	this.generateSVG = function() {
		return Base64.encode(this.SVGData());
	}

	this.generatePNG = function() {
		var tempCanvas = document.createElement('canvas');
		tempCanvas.width  = this.canvasWidth;
		tempCanvas.height = this.canvasHeight;

		tmpCtx = tempCanvas.getContext('2d');
		if (this.includeOriginalImageInPNG) tmpCtx.drawImage(this.sourceImg,0,0);
		tmpCtx.drawImage(this.canvas,0,0);
		this.addOverlays(tmpCtx);

		return tempCanvas.toDataURL('image/png');
	}

	this.addOverlays = function(tempCtx){
		tempCtx.save();
		tempCtx.globalAlpha = this.strokeOpacity;
		tempCtx.drawImage(this.strokeCanvas, 0, 0);
		tempCtx.globalAlpha = this.pointOpacity;
		tempCtx.drawImage(this.vertCanvas, 0, 0);
		tempCtx.restore()
	}



	this.toggleTriangleFill = function(x, y) {
		for (var i in this.triangles) {
			if (this.triangles[i].isPointInTriangle(x,y)) {
				this.triangles[i].toggleGradient();
				this.needToDrawTriangles = true;
				this.redrawTriangles = true;
				this.reDraw();
				return true;
			}
		}

		return false;
	}



	this.isInTriangle = function(x, y) {
		for (var i in this.triangles) {
			if (this.triangles[i].isPointInTriangle(x,y)) {return this.triangles[i];}
		}

		return false;
	}


	this.isVertex = function(x, y) {
		var minDist = Math.max(this.pointDetectionThreshold, this.snapSide/4);
		for (i in this.vertices) {
			if ((Math.abs(this.vertices[i].x - x) < minDist) && (Math.abs(this.vertices[i].y - y) < minDist)) {
				return true
			} 
		}
		return false;
	}

	this.verticesDetect = function(x, y, highlight) {
		var foundVerts = [];
		nearestV.length = 0;
		var minDist = Math.max(this.pointDetectionThreshold, this.snapSide/4);
		for (i in this.vertices) {
			var vertDist = (Math.pow((this.vertices[i].x - x),2) + Math.pow((this.vertices[i].y - y),2));
			if ((Math.abs(this.vertices[i].x - x) < minDist) && (Math.abs(this.vertices[i].y - y) < minDist)) {
				foundVerts.push({i: i, dist: vertDist})
				//this.vertices[i].drawCoord(this.tempCtx);

			} else {
				this.vertices[i].r = this.snapSide / 4;
			}
		}

		if (foundVerts.length > 0){
				foundVerts.sort(function(a, b) {
				    if (a.vertDist > b.vertDist) {
				        return 1
				    } else {
				        return -1
				    }
				});
				if (highlight) {
					this.vertices[foundVerts[0].i].r = Math.min(this.snapSide, 15);
				}
				nearestV.push(foundVerts[0].i);
		} 
		return nearestV;
	}

	this.getVertexJSON = function(){
		var vertString = '';
		for (var i =0; i< this.vertices.length; i++) {
			if (vertString != '') vertString += ",";
			vertString += this.vertices[i].toString();
		}
		responseString = '{';
		responseString += '"showVertices":' + this.showVertices + ",";
		responseString += '"useGradient":' + this.useGradient + ",";
		responseString += '"showFill":' + this.showFill + ",";
		responseString += '"showCircles":' + this.showCircles + ",";
		responseString += '"showStroke":' + this.showStroke + ",";
		responseString += '"useSolidGradient":' + this.useSolidGradient + ",";


		responseString += '"strokeWidth":' + this.strokeWidth + ",";
		responseString += '"strokeOpacity":' + this.strokeOpacity + ",";
		responseString += '"strokeColor":"' + this.strokeColor + '",';

		responseString += '"syncPointStrokeSizes":' + this.syncPointStrokeSizes + ",";

		responseString += '"snapSide":' + this.snapSide + ",";
		responseString += '"pointOpacity":' + this.pointOpacity + ",";
		responseString += '"pointStrokeOpacity":' + this.pointStrokeOpacity + ",";
		responseString += '"pointStrokeWidth":' + this.pointStrokeWidth + ",";
		responseString += '"pointShape":"' + this.pointShape + '",';
		responseString += '"pointColor":"' + this.pointColor + '",';
		responseString += '"pointStrokeColor":"' + this.pointStrokeColor + '",';
		responseString += '"globalOpacity":"' + this.globalOpacity + '",';


		if (midGrads.length > 0) {
			responseString += '"solidGradients":' + JSON.stringify(midGrads) + ",";
		}

		responseString += '"vertices": [' + vertString + ']';
		responseString += "}";
		return responseString;
	}

	this.raiseEvent = function(eventName, eventDescription, eventElement) {
		var event = new CustomEvent(
			eventName, 
			{
				detail: {
					message: eventDescription,
					time: new Date(),
				},
				bubbles: true,
				cancelable: true
			}
		);
		if (!eventElement) {
			eventElement = $('body')[0];
		}
		eventElement.dispatchEvent(event);
	}

	this.init();

}


 
