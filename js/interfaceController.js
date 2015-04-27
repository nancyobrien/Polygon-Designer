/*window.onerror = function(e) {
	alert(e);
}*/

var previousImage = false;
var mainController = false;
var fileManager = false;
var uploadedImage = false;
var theSourceImage = false;
var currentZoom = 1;
var selectedProject = false;
var delayedPopupTimer = false;
var delayedPopupShown = false;
var tempShapeConcentric = 0;
var tempShapePointsPerSide = 0;
var customPalette = false;

function initInterface() {
	if (loadProjectID != '') {hideLoadScreen();}


	$('#shareImage').click(function(e) {
		uploadPNG();
	})

	$('input.point-shape-select').click(function(e) {
		mainController.setPointShape($(this).val());
	})


	$('#demo-image-load').click(function(e) {
		e.preventDefault();
		loadImage("/images/Costa Rican Frog.jpg");
	})

	$('#server-image-load').click(function(e) {
		e.preventDefault();
		loadServerImages();
	})

	$('#backToStart').click(function(e) {
		e.preventDefault();
		$('#intro').removeClass('library');
	})

	$('#backToImageLibrary').click(function(e) {
		e.preventDefault();
		$('#intro').removeClass('library');
	})


	
	$('.uploadURLImage').click(function(e) {
		e.preventDefault();
		if($('#imageUploadURL').val() != '') {
			loadImage($('#imageUploadURL').val());
		} else {
			showPlaceholderError('#imageUploadURL', 'You have to enter a valid URL!');
		}
	})


	$('#cancel-detail-display').click(function(e) {
		e.preventDefault();
		$('#image-library').removeClass('detail-display');
	})



	$('#svgSaver').click(function(e){
		saveSVG();
		savePNG();
	})

	$('#randomGenerator').click(function(e){
		e.preventDefault();
		if (isNumber($('#randomVertCount').html())) {
			mainController.randomCount = $('#randomVertCount').html();
			mainController.addRandomVertices();
		}
	})

	$('#edgeVertices').click(function(e){
		
		if (isNumber($('#edgeVertCount').html())) {
			mainController.vertsPerSide = $('#edgeVertCount').html();
			mainController.addEdgeVertices();
		}
	})

	$('#spiralVertices').click(function(e){
		mainController.addSpiralVertices();
	})

	$('#gridVertices').click(function(e){
		if (isNumber($('#gridVertHozCount').html()) && isNumber($('#gridVertVertCount').html())) {
			var now = Date.now();
			mainController.vertsGrid.hor = $('#gridVertHozCount').html();
			mainController.vertsGrid.vert = $('#gridVertVertCount').html();
			mainController.addGridVertices();
			var nownow =  Date.now();
			window.console && console.log('It took ' + ((nownow-now)/1000) + ' seconds to draw the ' + mainController.vertsGrid.hor + 'x' +  mainController.vertsGrid.vert +' grid');
		}
	})

	$('.menu a').click(function (e) {
		e.preventDefault();
		hideMenus();
	})

	$('.selectShape').click(function(e) {
		e.preventDefault();
		mainController.shapeMode = $(this).data('setvalue');
		updateStats();
		$('#tool-geoPoints').click();
	})

	$('.show-delayed-popup').mousedown(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		e.stopPropagation();
		var thisElement = this;
		delayedPopupTimer = setTimeout(function() {showPopup(thisElement);}, 500);
	})
	$('.show-delayed-popup').mouseup(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		e.stopPropagation();
		clearTimeout(delayedPopupTimer);
	})


	function showPopup(thisElement) {
		delayedPopupShown = true;
		var menuType = $(thisElement).data('popupmenu');

		//Have to show the menu to get the width;
		$(menuType).removeClass('hide');
		var menuWidth = $(menuType).width();
		var menuHeight = $(menuType).height();
		$(menuType).addClass('hide');

		var popClass = ($(thisElement).data('popupclass') ? $(thisElement).data('popupclass') : '');
		var borderHeight = 16;// $(thisElement).find(':after').css('border-width');
		var objSize = {}
		objSize.width = $(thisElement).width() + parseFloat($(thisElement).css('padding-left')) + parseFloat($(thisElement).css('padding-right'));
		objSize.height = $(thisElement).height() + parseFloat($(thisElement).css('padding-top')) + parseFloat($(thisElement).css('padding-bottom'));
		var mousePos = {};
		mousePos.x = $(thisElement).offset().left ;
		mousePos.y = $(thisElement).offset().top;
		var menuPlacement = {'horizontal' : 'left', 'vertical': 'top'};
		switch ($(thisElement).data('popuppositionh')) {
			case 'left':
				mousePos.x -= objSize.width/2;
				break;
			case 'center':
				mousePos.x += (objSize.width - menuWidth)/2;
				break;
			case 'right':
				mousePos.x += objSize.width + borderHeight/2;
				break;

		}
		switch ($(thisElement).data('popuppositionv')) {
			case 'top':
				menuPlacement.vertical = 'bottom';
				mousePos.y = objSize.height + borderHeight;
				break;
			case 'top-offset': 
				mousePos.y += 0;
				break;
			case 'middle':
				mousePos.y +=  (objSize.height - menuHeight)/2
				break; 

		}
		showPopupMenu(menuType, mousePos, menuPlacement, popClass);	}

	$('.show-popup').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		var menuType = $(this).data('popupmenu');
		if (!$(menuType).hasClass('hide')) {
			hideMenus();
			return;
		}

		//hideMenus();

		//Have to show the menu to get the width;
		$(menuType).removeClass('hide');
		var menuWidth = $(menuType).width();
		var menuHeight = $(menuType).height();
		$(menuType).addClass('hide');

		var popClass = ($(this).data('popupclass') ? $(this).data('popupclass') : '');
		var borderHeight = 16;// $(this).find(':after').css('border-width');
		var objSize = {}
		objSize.width = $(this).width() + parseFloat($(this).css('padding-left')) + parseFloat($(this).css('padding-right'));
		objSize.height = $(this).height() + parseFloat($(this).css('padding-top')) + parseFloat($(this).css('padding-bottom'));
		var mousePos = {};
		mousePos.x = $(this).offset().left ;
		mousePos.y = $(this).offset().top;
		var menuPlacement = {'horizontal' : 'left', 'vertical': 'top'};
		switch ($(this).data('popuppositionh')) {
			case 'left':
				mousePos.x -= objSize.width/2;
				break;
			case 'center':
				mousePos.x += (objSize.width - menuWidth)/2;
				break;
			case 'right':
				mousePos.x += objSize.width + borderHeight/2;
				break;

		}
		switch ($(this).data('popuppositionv')) {
			case 'top':
				menuPlacement.vertical = 'bottom';
				mousePos.y = objSize.height + borderHeight;
				break;
			case 'top-offset': 
				mousePos.y +=  0;
				break;
			case 'middle':
				mousePos.y +=  (objSize.height - menuHeight)/2
				break; 

		}
		showPopupMenu(menuType, mousePos, menuPlacement, popClass);
		var x  =1;
	})

	$('.toggleVerts').click(function(e) {
		mainController.toggleVertices();
		updateStats();
	})

	/*$('.toggleGradient').click(function(e) {
		var setvalue;
		if ($(this).data('setvalue') !== undefined) {
			setvalue = $(this).data('setvalue');
		}
		mainController.toggleGradientDisplay(setvalue);
		updateStats();
	})*/

	$('.setFillStyle').click(function(e) {
		var setvalue;
		if ($(this).data('setvalue') !== undefined) {
			setvalue = $(this).data('setvalue');
		}
		mainController.setFillStyle(setvalue);
		updateStats();
	})

	$('.toggleFill').click(function(e) {
		mainController.toggleFillDisplay();
		updateStats();
		//$(this).find('.icon--radio').toggleClass('checked', mainController.showFill);
	})

	$('.toggleStroke').click(function(e) {
		mainController.toggleStrokeDisplay();
		updateStats();
	})

	$('.toggleSolidGradient').click(function(e) {
		mainController.toggleSolidGradientDisplay();
		updateStats();
	})

	$('.resetSolidGradient').click(function(e) {
		mainController.resetSolidGradient();
		updateStats();
	})
	$('.resetCustomColors').click(function(e) {
		mainController.resetCustomColors();
		updateStats();
	})


	$('.toggleIncludeColorAdjust').click(function(e) {
		mainController.setColorAdjustment(!mainController.includeColorAdjust);
		updateStats();
	})


	

	$('.deleteSelected').click(function(e) {
		mainController.deleteSelectedVertices();
		updateStats();
	})

	$('.clearSelectedFill').click(function(e) {
		mainController.clearSelectTriangles();
		updateStats();
	})

	$('.restoreSelectedFill').click(function(e) {
		mainController.restoreSelectTriangles();
		updateStats();
	})


	$('.setZoom').click(function(e) {
		e.preventDefault();
		var zoomLevel = $(this).data('setvalue');
		if (isNumber(zoomLevel)) {
			mainController.setZoomLevel(zoomLevel);
		} else {
			switch(zoomLevel) {
				case "fitToScreen":
					mainController.fitToScreen();
					break;
			}
		}
		updateStats();
	})

	$('#stroke-point-sync').change(function(e) {
		mainController.setSyncPointStrokeSizes($(this).is(":checked"), mainController.strokeWidth);
	})

	$('#point-stroke-sync').change(function(e) {
		mainController.setSyncPointStrokeSizes($(this).is(":checked"), mainController.getPointSize());
	})


	$(document).on('input', '#pointColor', function() {
		mainController.updatePointColor($('#pointColor').html());
	});

	$(document).on('input', '#strokeColor', function() {
		mainController.updateStrokeColor($('#strokeColor').html());
	});

	$('.display-trigger').closest('.display-section').click(function(e) {
		e.preventDefault();
		$(this).closest('.display-static').toggleClass('closed');
	})
	$('.collapse-trigger').click(function(e) {
		e.preventDefault();
		$(this).closest('.status-bar').toggleClass('closed');
	})
	$('.modal-close').click(function(e){
		e.preventDefault();
		if (($(this).closest('.modal-background').find('.wait').length > 0) || ($(this).find('.wait').length > 0)) {
			return;
		}
		closeModal(this);
	}) 
 
	$('.modal').click(function(e){
		e.stopPropagation();  
	}) 

	$('#intro .cancel').click(function(e){
		hideLoadScreen();
	})

	$('#intro .load').click(function(e){
		hideLoadScreen();
	})

	$('.toolSection-title').click(function(e) {
		$(this).closest('.toolSection').toggleClass('open');
	})



	/*window.onkeydown = function(e){
	 // Ensure event is not null
		e = e || window.event;
		
		if (e.ctrlKey) {
			var x = $("*:focus");
			if (x.hasClass('allowPaste')) {return;}
			// Ctrl is down, copy the vertex info in case they want to copy the vertices
			$('#clipboard').html(mainController.getVertexJSON());
			$('#clipboard').focus().select();
		} 
	}*/
 
	$('#getVertices').click(function(e){
		var responseString = mainController.getVertexJSON();
		if (responseString != '')  {
			$('#currentVertices .verts').html(responseString);
			$('#currentVertices .verts').focus().select();
			showModal('#currentVertices');
		} else {
			alert('You gotta draw some points first!');
		}

	})

	$('#showRestoreVertices').click(function(e){
		e.preventDefault();
		$('#loadVertexData').val('');

		showModal('#newVertices');
		$('#loadVertexData').focus();
	})

	$('#restoreVertices').click(function(e){
		var verts = $('#loadVertexData').val();
		try {
			mainController.restoreFromJson(verts);
			hideSaveButton();
			closeModal($('#loadVertexData'));

		} catch(e) {
			alert('Invalid JSON data')
		}
	})

	$('#recycleEdges').click(function(e){
		e.preventDefault();
		deleteEdgeVertices();
	})

	$('#recycleGrid').click(function(e){
		e.preventDefault();
		deleteGridVertices();
	})

	$('#recycler').click(function(e){
		e.preventDefault();
		deleteAllVertices();
	});

	/*$('#imageLoader').click(function(e) {
		e.preventDefault();
		showLoadScreen();
	})*/


	$('#showErrorReport').click(function (e) {
		e.preventDefault();

		$('#bugLabel').val('');
		$('#bugSummary').val('');
		showModal('#errorReportModal');
	})

	$('#sendErrorReport').click(function (e) {
		e.preventDefault();
		var bugReport = {};
		bugReport.bugLabel = $('#bugLabel').val() + '';
		bugReport.bugSummary = $('#bugSummary').val() + '';

		if (bugReport.bugLabel != '') {
			fileManager.sendBugReport(bugReport);
		} else {
			showPlaceholderError('#bugLabel', 'You have to provide a bug label!');
		}
		
	})


	$('#saveServer').click(function (e) {
		e.preventDefault();

		if (mainController.projectData) {
			$('#projectName').val(mainController.projectData.ProjectName);
			$('#versionName').val(mainController.projectData.SelectedVersion.Name);
			$('#versionSummary').val(mainController.projectData.SelectedVersion.Summary);
		}
		$('#start-new-project').toggle((mainController.projectData.ProjectID !== undefined));
		showModal('#saveProjectModal');
	})

	$('#saveProject').click(function (e) {
		e.preventDefault();
		var projectData = {};
		projectData.projectName = $('#projectName').val();
		projectData.versionName = $('#versionName').val();
		projectData.versionSummary = $('#versionSummary').val();
		projectData.projectID = mainController.projectData.ProjectID;
		if ($('#check-new-project').prop('checked')) {
			projectData.projectID = '';
		}

		if (projectData.projectName != '') {
			uploadImage(projectData);
		}
		
	})

	$('.resetColorAdjustments').click(function (e) {
		e.preventDefault();
		mainController.resetColorAdjustments();
		updateStats();
	})

	$('#updatePolygonSettings').click(function(e) {
		mainController.shapeConcentric = $('#concentricRingsSlider').val();
		//this.shapes[this.shapeMode].numSides

		mainController.shapePtsPerSide = $('#shapePointsPerSideSlider').val()/mainController.shapes[mainController.shapeMode].numSides;
		updateStats();
	})


	$('.cancelPointSettings').click(function (e) {
		e.preventDefault();


		var showPointVal = ($('#pointShowVertexInit').val() === 'true')
		var syncVal = ($('#strokePointSyncInit').val() === 'true')

		if ($('#stroke-point-sync').is(":checked") != syncVal ) {
			mainController.setSyncPointStrokeSizes(syncVal);
			mainController.updateStrokeSize($('#pointStrokeSizeInit').val());
		}


		if ($('#showVertexModal').is(":checked") != showPointVal ) {
			mainController.setShowVertices(showPointVal);
		}

		mainController.setPointTransparency($('#pointOpacityInit').val())
		mainController.setPointStrokeTransparency($('#pointStrokeOpacityInit').val())

		mainController.setPointStrokeWidth($('#pointStrokeSizeInit').val())
		mainController.updateVertexSize($('#pointSizeInit').val())
		mainController.setPointShape($('#pointShapeInit').val())
		mainController.updatePointColor($('#pointColorInit').val())
		
		updateStats();
		closeModal(this);
	})


	$('#showPointModal').click(function (e) {
		e.preventDefault();
		$('#pointOpacityInit').val(mainController.pointOpacity);
		$('#pointStrokeOpacityInit').val(mainController.pointStrokeOpacity);

		$('#pointSizeInit').val(mainController.getPointSize());
		$('#pointStrokeSizeInit').val(mainController.pointStrokeWidth);
		$('#pointShapeInit').val(mainController.pointShape);
		$('#pointColorInit').val(mainController.pointColor);
		$("#pointOpacitySlider").val(mainController.pointOpacity * 100);
		$("#pointStrokeOpacitySlider").val(mainController.pointStrokeOpacity * 100);
		$("#pointStrokeWidthSlider").val(mainController.pointStrokeWidth);

		$("#pointSizeSlider").val(mainController.getPointSize());
		$('#pointStrokeSyncInit').val(mainController.syncPointStrokeSizes);
		$('#pointStrokeSizeInit').val(mainController.strokeWidth);
		$('#pointShowVertexInit').val(mainController.showVertices);

		showModal('#pointPropsModal');
	})


	$('#showStrokeModal').click(function (e) {
		e.preventDefault();
		$('#strokeOpacityInit').val(mainController.strokeOpacity);
		$('#strokeSizeInit').val(mainController.strokeWidth);
		$('#strokeColorInit').val(mainController.strokeColor);
		$("#strokeOpacitySlider").val(mainController.strokeOpacity * 100);
		$("#strokeSizeSlider").val(mainController.strokeWidth);
		$('#strokePointSizeInit').val(mainController.getPointSize());
		$('#strokePointSyncInit').val(mainController.syncPointStrokeSizes);
		$('#strokeShowStrokeInit').val(mainController.showStroke);

		showModal('#strokePropsModal');
	})

	$('.cancelStrokeSettings').click(function (e) {
		e.preventDefault();

		var syncVal = ($('#strokePointSyncInit').val() === 'true')
		var showStrokeVal = ($('#strokeShowStrokeInit').val() === 'true')

		if ($('#stroke-point-sync').is(":checked") != syncVal ) {
			mainController.setSyncPointStrokeSizes(syncVal);
			mainController.updateVertexSize($('#strokePointSizeInit').val());
		}

		if ($('#showStrokeModalCheck').is(":checked") != showStrokeVal ) {
			mainController.setShowStroke(showStrokeVal);
		}

		mainController.setStrokeTransparency($('#strokeOpacityInit').val())
		mainController.updateStrokeSize($('#strokeSizeInit').val())
		mainController.updateStrokeColor($('#strokeColorInit').val())


		updateStats();
		closeModal(this);
	})

	$('#showCustomColorModal').click(function (e) {
		e.preventDefault();
		var colorSwatchTemplate = $('#color-swatch-template').text();

		//create swatches
		var index = 0;
		$('#customColorSwatches').empty();
		for (var col in mainController.customPalette.colors) {
			index++;
			var thisColor = mainController.customPalette.colors[col];
			thisColor.colorLabel = 'Color ' + index;
			var colorSwatch = fileManager.applyTemplate(thisColor, colorSwatchTemplate);
			$('#customColorSwatches').append(colorSwatch);
		}

		updateStats();
		$('#customColorSwatches').find('.customColorSwatch').first().find('.colorSwatchTrigger').first().click();
		showModal('#customColorModal');
	})

	$('#updateCustomColorSettings').click(function (e) {
		e.preventDefault();

		var totalWeighting = 0;
		var colorArr = [];

		$('#customColorSwatches').find('.customColorSwatch').each(function(key, value) {
			var hex = $(this).find('.colorCode').val();
			var weighting = $(this).find('.colorWeighting').val() * 1;
			totalWeighting += weighting;
			colorArr.push({'color': hex, 'weighting': weighting});
		})
		totalWeighting = Math.ceil(totalWeighting*100)/100;
		if (totalWeighting == 1) {
			mainController.customPalette.setPalette(colorArr);
			if ($('#rerandomizeColorsCheck').prop('checked')) {
				mainController.resetCustomColors();
			}
			closeModal(this);
		} else {
			alert("Total Weighting must total 1");
		}
	})
	

	$('#showColorAdjustModal').click(function (e) {
		e.preventDefault();
		$('#colorAdjustRedInit').val(mainController.adjustedColor.red);
		$('#colorAdjustBlueInit').val(mainController.adjustedColor.blue);
		$('#colorAdjustGreenInit').val(mainController.adjustedColor.green);
		$('#colorAdjustStateInit').val(mainController.includeColorAdjust);
		$('#brightnessInit').val(mainController.brightness);
		$('#contrastInit').val(mainController.contrast);

		/*$("#colorAdjustRedSlider").val(mainController.adjustedColor.red);
		$("#colorAdjustBlueSlider").val(mainController.adjustedColor.blue);
		$("#colorAdjustGreenSlider").val(mainController.adjustedColor.green);
		$("#brightnessSlider").val(mainController.brightness);
		$("#contrastSlider").val(mainController.contrast);
*/
		updateStats();
		showModal('#ColorAdjustModal');
	})

	$('.cancelColorAdjustSettings').click(function (e) {
		e.preventDefault();
		var includeColorAdjust = ($('#colorAdjustStateInit').val() === 'true')

		var oldColor = {'red': $('#colorAdjustRedInit').val(), 'blue': $('#colorAdjustBlueInit').val(), 'green': $('#colorAdjustGreenInit').val()};
		mainController.setColorAdjustment(includeColorAdjust, oldColor, $('#brightnessInit').val(), $('#contrastInit').val());
		closeModal(this);
	})

	$('.display-toggle').click(function(e) {
		e.stopPropagation();
		//$(this).toggleClass('selected');
		//$('.display-toggle').not($(this)).removeClass('selected')
		//$('.display-block').removeClass('open');
		//$('.' + $(this).data('ctrlsection')).addClass('open');
		//$(this).closest('.display-pane').toggleClass('open',$(this).hasClass('selected'));
		//$('#canvasContainer').toggleClass('open',$(this).hasClass('selected'));
	})

	var holder = document.getElementById('holder');
	holder.ondragover = function() {
		$(this).addClass('hover');
		return false;
	};
 
	holder.ondragleave = function() {
		$(this).removeClass('hover');
		return false;
	};

	holder.ondragend = function() {
		$(this).removeClass('hover');
		return false;
	};

	holder.ondrop = function(e) {
		$(this).removeClass('hover');
		e.preventDefault();
		hideSaveButton();

		var file = e.dataTransfer.files[0],
		reader = new FileReader();
		uploadedImage = file;

		reader.onload = function(event) {
			hideLoadScreen();
			loadImage(event.target.result);
		};
		reader.readAsDataURL(file);

		return false;
	};





	$(function() {
		//$('#transparencyPercent').html($('#canvas').css('opacity') * 100 + '%')
		$('#transparencyPercent').html(mainController.canvasTransparency * 100 + '%')
		$('#opacityPercent').val(mainController.canvasTransparency * 100 + '%')


		$("#concentricRingsSlider").on("input change", function() { 
			tempShapeConcentric = $(this).val();
			updateStats();
		});

		$("#shapePointsPerSideSlider").on("input change", function() { 
			tempShapePointsPerSide = $(this).val();
			updateStats();
		});



		$("#opacitySlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setTransparency(sliderVal / 100);
			updateStats();
		});
		$("#pointOpacitySlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setPointTransparency(sliderVal / 100);
			updateStats();
		});
		$("#pointStrokeOpacitySlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setPointStrokeTransparency(sliderVal / 100);
			updateStats();
		});
		$("#pointStrokeWidthSlider").on("input change", function() { 
			var sliderVal = $(this).val();
			mainController.setPointStrokeWidth(sliderVal);
			updateStats();
		});


		$("#strokeOpacitySlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setStrokeTransparency(sliderVal / 100);
			updateStats();
		});

		$("#pointOpacitySlider").val(mainController.pointOpacity * 100);
		$("#pointStrokeOpacitySlider").val(mainController.pointStrokeOpacity * 100);
		$("#pointSizeSlider").val(mainController.getPointSize());
		$("#pointStrokeWidthSlider").val(mainController.pointStrokeWidth);

		$("#stroketOpacitySlider").val(mainController.strokeOpacity * 100);
		$("#strokeSizeSlider").val(mainController.strokeWidth);

		$('#pointSizeSlider').on("input change", function() { 
			var sliderVal =  $(this).val() ;
			mainController.updateVertexSize(sliderVal);
			updateStats();
		});

		$('#strokeSizeSlider').on("input change", function() { 
			var sliderVal =  $(this).val() ;
			mainController.updateStrokeSize(sliderVal);
			updateStats();
		});

		$("#colorAdjustRedSlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			if (mainController.adjustedColor.red != sliderVal) {
				console.log(mainController.adjustedColor.red + " : " + sliderVal)
				var newColor = {'red': sliderVal, 'blue': mainController.adjustedColor.blue, 'green': mainController.adjustedColor.green};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				updateStats();
			}
		});


		$("#colorAdjustBlueSlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			if (mainController.adjustedColor.blue != sliderVal) {
				var newColor = {'red': mainController.adjustedColor.red, 'blue': sliderVal, 'green': mainController.adjustedColor.green};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				updateStats();
			}
		});

		$("#colorAdjustGreenSlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			if (mainController.adjustedColor.green != sliderVal) {
				var newColor = {'red': mainController.adjustedColor.red, 'blue': mainController.adjustedColor.blue, 'green': sliderVal};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				updateStats();
			}
		});

		$("#brightnessSlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setBrightness(sliderVal);
			updateStats();
		});

		$("#contrastSlider").on("input change", function() { 
			var sliderVal = Math.ceil($(this).val());
			mainController.setContrast(sliderVal);
			updateStats();
		});


		$('#colorAdjustRedInput').on('input', function(e){
			if (isNumber($('#colorAdjustRedInput').text())) {
				var colorVal = $('#colorAdjustRedInput').text();
				var newColor = {'red': colorVal, 'blue': mainController.adjustedColor.blue, 'green': mainController.adjustedColor.green};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				$("#colorAdjustRedSlider").val(mainController.adjustedColor.red);
			}
		});

		$('#colorAdjustBlueInput').on('input', function(e){
			if (isNumber($('#colorAdjustBlueInput').text())) {
				var colorVal = $('#colorAdjustBlueInput').text();
				var newColor = {'red': mainController.adjustedColor.red, 'blue': colorVal, 'green': mainController.adjustedColor.green};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				$("#colorAdjustBlueSlider").val(mainController.adjustedColor.blue);
			}
		});

		$('#colorAdjustGreenInput').on('input', function(e){
			if (isNumber($('#colorAdjustGreenInput').text())) {
				var colorVal = $('#colorAdjustGreenInput').text();
				var newColor = {'red': mainController.adjustedColor.red, 'blue': mainController.adjustedColor.blue, 'green': colorVal};
				mainController.setColorAdjustment(mainController.includeColorAdjust, newColor);
				$("#colorAdjustGreenSlider").val(mainController.adjustedColor.green);
			}
		});

		$('#brightnessInput').on('input', function(e){
			if (isNumber($('#brightnessInput').text())) {
				var brightnessVal = $('#brightnessInput').text();
				mainController.setBrightness(brightnessVal);

				$("#brightnessSlider").val(mainController.brightness);
			}
		});

		$('#contrastInput').on('input', function(e){
			//e.preventDefault();
			if (isNumber($('#contrastInput').text())) {
				var contrastVal = $('#contrastInput').text();
				mainController.setContrast(contrastVal);

				$("#contrastSlider").val(mainController.contrast);
			}
		});

		$('#colorAdjustRedInput').on('blur', function(e){
			// Make sure the text gets set to the true value (non-numbers rejected, -0 switches to 0)
			$('#colorAdjustRedInput').text(mainController.adjustedColor.red);
		});

		$('#colorAdjustBlueInput').on('blur', function(e){
			// Make sure the text gets set to the true value (non-numbers rejected, -0 switches to 0)
			$('#colorAdjustBlueInput').text(mainController.adjustedColor.blue);
		});

		$('#colorAdjustGreenInput').on('blur', function(e){
			// Make sure the text gets set to the true value (non-numbers rejected, -0 switches to 0)
			$('#colorAdjustGreenInput').text(mainController.adjustedColor.green);
		});

		$('#brightnessInput').on('blur', function(e){
			// Make sure the text gets set to the true value (non-numbers rejected, -0 switches to 0)
			$('#brightnessInput').text(mainController.brightness);
		});

		$('#contrastInput').on('blur', function(e){
			// Make sure the text gets set to the true value (non-numbers rejected, -0 switches to 0)
			$('#contrastInput').text(mainController.contrast);
		});


		$("#colorAdjustRedSlider").val(mainController.adjustedColor.red);
		$("#colorAdjustBlueSlider").val(mainController.adjustedColor.blue);
		$("#colorAdjustGreenSlider").val(mainController.adjustedColor.green);
		$("#brightnessSlider").val(mainController.brightness);




		$('#customColorModal').on("click", '.colorSwatchTrigger', function(e) { 
			e.preventDefault();
			var swatch = $(this).closest('.customColorSwatch');
			var modal = $(this).closest('#customColorModal');
			modal.find('.customColorSwatch').removeClass('selected');
			swatch.addClass('selected');
			var colorCode = swatch.find('.colorCode').val();
			var colPicker = modal.find('#colorpickerSwatch');
			var colPickerLabel = modal.find('.colorpickerSwatchLabel');

			colPicker.colpickSetColor(colorCode);

		});

		$('.details-list').on("click", '.detail-ctrl--delete', function(e) { 
			e.preventDefault();
			var row = $(this).closest('.details-list--row');
			$('#deleteVersion').data('projectid', $(row).data('projectid'));
			$('#deleteVersion').data('versionid', $(row).data('version'));
			showModal('#deleteVersionModal');
		});

		$('.details-list').on("click", '.data-type--favorite a', function(e) { 
			e.preventDefault();
			$(this).closest('.details-list').find('.details-list--row').removeClass('favorite');
			var $dataRow = $(this).closest('.details-list--row');
			$dataRow.addClass('favorite');
			fileManager.favoriteVersion($dataRow.data('projectid'), $dataRow.data('version'));

		});

		$('#deleteVersion').click(function(e) {
			e.preventDefault();
			fileManager.deleteVersion($('#deleteVersion').data('projectid'), $('#deleteVersion').data('versionid'));
		})

		$('#archiveProject').click(function(e) {
			e.preventDefault();
			fileManager.archiveProject($('#archiveProject').data('projectid'));
		})

	})
}

function loadServerImages() {

	$('#intro').addClass('library');
}

function loadImage(imgData, imgJSON) {
	deleteAllVertices();	
	var img = new Image();
	img.onload = function() {
		theSourceImage = this;
		previousImage = true;

		//resizeCanvas();
		mainController.setImage(theSourceImage);

		hideLoadScreen(); 

		//Save the source file, if not already stored.
		if ($('#sourceImg')[0].toBlob && !uploadedImage) {
		    $('#sourceImg')[0].toBlob(
		        function (blob) {
		            // Do something with the blob object,
		            uploadedImage = blob;
		        },
		        'image/png'
		    );
		}

		if (imgJSON) {mainController.restoreFromJson(imgJSON);}

	}
	img.onerror = function() {
		errorMessage("Unable to load image from this URL");
	}
	img.src = imgData;
	img.crossOrigin = "Anonymous";

}

  
function loadImageFromURL(imgURL) {
	// make ajax call to get image data url
	var request = new XMLHttpRequest();
	request.open('GET', imgURL, true);
	request.onreadystatechange = function() {
		// Makes sure the document is ready to parse.
		if(request.readyState == 4) {
		  // Makes sure it's found the file.
		  if(request.status == 200) {
			loadImage(request.responseText);
		  }
		}
	};
	request.send(null);
}    





function resizeCanvas(scale) {
	if (!scale) {scale = 0;}
	currentZoom += scale;

	//mainController.scaleCanvas(theSourceImage, currentZoom);
	mainController.setZoomLevel(currentZoom);
}

function deleteAllVertices() {
	mainController.clearVertices();
}

function deleteEdgeVertices(){
	mainController.clearEdgeVertices();
}

function deleteGridVertices() {
	mainController.clearGridVertices();
}

function showLoadScreen() {
	hideToolbar();
	$('#canvasContainer').hide();
	$('body').addClass('loadImage');
	$('.tool-button').addClass('disabled');
	$("#wrapper").removeClass("transparent");
	$('#wrapper').css({
		opacity: 1
	  })  
	$('#wrapper').show();
 
	if (previousImage) $('#cancel-image-load').css('display', 'inline-block');
}

function hideLoadScreen() {
	$('body').removeClass('loadImage');
	$('.disabled').removeClass('disabled');  
	$('#wrapper').animate({
		opacity: 0
	  }, 400, function() {
		$('#wrapper').hide();
	});
	/*$("#wrapper").addClass("transparent");  
	$('#canvasContainer').show();
	$('.display-pane').removeClass('hide');*/
}

function hideToolbar() {
	$('.display-toggle').removeClass('selected')
	$('.display-block').removeClass('open');
	$('.display-pane').removeClass('open');
	$('#canvasContainer').removeClass('open');
}

function hideSaveButton() {
	$('#svgFile').hide();
	$('#svgFile').attr("href", "");
}

function updateEdgeVertDisplay(){
	$('#edgeVertCount').html(mainController.vertsPerSide);
}

function showPolyshapeModal() {

	var minPts = mainController.shapes[mainController.shapeMode].minPtsPerSide ? mainController.shapes[mainController.shapeMode].minPtsPerSide : 1;
	var maxPts = mainController.shapes[mainController.shapeMode].maxPtsPerSide ? mainController.shapes[mainController.shapeMode].maxPtsPerSide : 10;
	var numSides = mainController.shapes[mainController.shapeMode].numSides;
	minPts = Math.max(mainController.shapes[mainController.shapeMode].numSides, minPts);
	tempShapeConcentric = mainController.shapeConcentric;
	tempShapePointsPerSide = Math.min(mainController.shapePtsPerSide * numSides, maxPts * numSides);
	$("#concentricRingsSlider").val(mainController.shapeConcentric);
	$("#shapePointsPerSideSlider").attr('step', numSides);
	$("#shapePointsPerSideSlider").attr('min', minPts);
	$("#shapePointsPerSideSlider").attr('max', maxPts * numSides);
	$("#shapePointsPerSideSlider").val(tempShapePointsPerSide);
	updateStats();
	showModal('#configurePolygonsModal');
}

function updateGridVertDisplay(){
	$('#gridVertHozCount').html(mainController.vertsGrid.hor);
	$('#gridVertVertCount').html(mainController.vertsGrid.vert);
}

function updateRandomVertDisplay(){
	$('#randomVertCount').html(mainController.randomCount);
}

function showRedraw() {
	//window.console && console.log('show loading')
	$('#canvasLoading').show();
}

function hideRedraw() {
	//window.console && console.log('hide loading')
	$('#canvasLoading').hide();
}

function closeModal(modal) {
	if (modal) {
		$(modal).closest('.modal-background').hide();
	} else {
		$('.modal-background').hide();
	}
}

function updateStats() {
	setValue($('.stat-point-stroke-sync'), mainController.syncPointStrokeSizes);
	setValue($('.stat-num-points'), mainController.vertices.length);
//			$("#opacitySlider").val(mainController.globalOpacity);

	setValue($('.stat-zoom'), Math.floor(mainController.zoomLevel * 100) + '%')
	setValue($('.stat-shape-type'), mainController.shapeMode);
	setValue($('.stat-concentric-rings'), tempShapeConcentric);
	setValue($('.stat-shapeptsperside'), tempShapePointsPerSide);


	setValue($('.stat-adjustColor-red'), mainController.adjustedColor.red);
	setValue($('.stat-adjustColor-blue'), mainController.adjustedColor.blue);
	setValue($('.stat-adjustColor-green'), mainController.adjustedColor.green);
	setValue($('.stat-adjustColor-state'), mainController.includeColorAdjust);

	setValue($('.stat-brightness'), mainController.brightness);
	setValue($('.stat-contrast'), mainController.contrast);


	setValue($('.stat-globalOpacity'), Math.ceil(mainController.globalOpacity * 100));
	setValue($('.stat-opacity'), Math.ceil(mainController.canvasTransparency * 100) + '%');
	setValue($('.stat-point-opacity'), Math.ceil(mainController.pointOpacity * 100) + '%');
	setValue($('.stat-pointstroke-opacity'), Math.ceil(mainController.pointStrokeOpacity * 100) + '%');


	setValue($('.stat-ptsize'), mainController.getPointSize() );
	setValue($('.stat-ptstrokesize'), mainController.pointStrokeWidth);
	setValue($('.stat-toolmode'), mainController.toolMode)

	setValue($('.stat-stroke-opacity'), Math.ceil(mainController.strokeOpacity * 100) + '%');
	setValue($('.stat-strokesize'), mainController.strokeWidth);

	setValue($('.stat-stroke-state'), mainController.showStroke);

	setValue($('.stat-vertex-state'), mainController.showVertices);
	setValue($('.stat-fill-state'), mainController.showFill);
	//setValue($('.stat-gradient-state'), mainController.useGradient);
	setValue($('.stat-solidgradient-state'), mainController.useSolidGradient);

	/*if (mainController.useGradient) {
		setValue($('.stat-fillstyle'), 'Gradient');
	} else {
		setValue($('.stat-fillstyle'), 'Solid');
	}*/

	setValue($('.stat-fillstyle'), mainController.fillStyle);
	setValue($('.stat-fillstyle-label'), mainController.fillOptions[mainController.fillStyle]);



	for (var shape in mainController.shapeOptions){
		$('.show-selectShape').removeClass(mainController.shapeOptions[shape]);
	}

	$('.show-selectShape').addClass(mainController.shapeMode);


	$('#colorpickerPoint').colpickSetColor(mainController.pointColor);
	$('#colorpickerStroke').colpickSetColor(mainController.strokeColor);
	setColorPointOptions(mainController.pointColor);

	$('input.point-shape-select[value="'+ mainController.pointShape+'"]').prop('checked', true);
}

function setColorPointOptions(colorCode){
	var colCode = ('0x' +  colorCode.replace('#', ''))*1;
	//var backColor = (parseInt(colCode, 16) >   parseInt((0xeeeeee)*1, 16) ) ? '#cccccc':'transparent';
	$('.custom-point-color').css('color', colorCode);

	//$('.custom-point-color').toggleClass('stroked', (parseInt(colCode, 16) >   parseInt((0xeeeeee)*1, 16)));
	var darkenedColor = ColorLuminance(colorCode, -.3);  //Darken 50%
	$('.custom-point-color').css('text-shadow', '-1px -1px 0 ' + darkenedColor + ', 1px -1px 0 ' + darkenedColor + ', -1px 1px 0 ' + darkenedColor + ', 1px 1px 0 ' + darkenedColor );


	//$('.custom-point-color').closest('.check-control-group').css('background-color', backColor);
}

function setColorSwatch(colorCode) {
	var modal = $('#customColorModal');
	var selectedSwatch = modal.find('.customColorSwatch.selected');
	selectedSwatch.find('.colorSwatch').css('background-color', colorCode);
	selectedSwatch.find('.colorCode').val(colorCode);
}

function setValue(ctrl, value) {
	$(ctrl).each(function(){
		var thisCtrl = $(this);
		if (thisCtrl.hasClass('show-hide')) {
			thisCtrl.toggleClass('show', !value);
		} else if (thisCtrl.hasClass('show-selected')) {
			var setVal = value;
			if (thisCtrl.hasClass('show-compareValue') && (thisCtrl.data('setvalue') || thisCtrl.find('[data-setvalue]').length > 0 || thisCtrl.parent('[data-setvalue]').length > 0)) {
				if (thisCtrl.data('setvalue')) {
					setVal = (value === thisCtrl.data('setvalue'));
				} else {
					var compVal = thisCtrl.find('[data-setvalue]').data('setvalue');
					if (thisCtrl.find('[data-setvalue]').length == 0) {
						compVal = thisCtrl.parent().data('setvalue');
					}
					setVal =  (value === compVal);
				}
			}
			if (thisCtrl.hasClass('stat-reverse')) {
				thisCtrl.toggleClass('selected', !setVal);
			} else {
				thisCtrl.toggleClass('selected', setVal);
			}
		} 
		else {
			thisCtrl.html(value);
			if(thisCtrl.is(':checkbox') || thisCtrl.is(':radio')) {
				thisCtrl.prop('checked', value)
			} else if (thisCtrl.html() !== value && thisCtrl.val() !== value) {
				thisCtrl.val(value);
			}
		}
	})
}

function loadProjects() {
	$('#library-container').find('.image-select').remove();
	$.each(fileManager.projects, function( key, value ) {
		$('#library-container').prepend(this.HTML);

	});



	$('.libraryContainer').on("click", '.delButton', function(e) { 
		e.preventDefault();
		$('#archiveProject').data('projectid', $(this).closest('.image-select').find('.js-select-image').data('projectid'));

		showModal("#archiveProjectModal");
	})

	$('.libraryContainer').on("click", '.js-load-version-favorite', function(e) { 
		e.preventDefault();
		var parts = $(this).attr('href').split("/");
		var tmpversionID = 'default';
		var tmpprojectID = parts[2];
		if (parts.length > 3) {tmpversionID=parts[3];}
		loadProject(tmpprojectID, tmpversionID);
	})


	$('.libraryContainer').on("click", '.js-select-image', function(e) { 
		e.preventDefault();
		var selProjectID = $(this).data('projectid');
		if ($(this).closest('.image-select').hasClass('multiple')) {
			var selectedProject = fileManager.getProject(selProjectID);
			$('#image-library').addClass('detail-display');
			$('.image-select').removeClass('detail-selected');
			$(this).closest('.image-select').addClass('detail-selected');
			$('#details-list-rows').data('projectid', selProjectID);
			$('#details-list-rows').html(selectedProject.VersionList);
			$('.js-load-version').click(function(ev) {
				ev.preventDefault();
				var parts = $(this).attr('href').split("/");
				var tmpversionID = 'default';
				var tmpprojectID = parts[2];
				if (parts.length > 3) {tmpversionID=parts[3];}
				loadProject(tmpprojectID, tmpversionID);
			})
		} else {
			loadProject(selProjectID, 'default')
		}
	})



	if (loadProjectID && loadProjectID != '') {
		var loadedProject = loadProject(loadProjectID, loadVersionID);
		if (loadedProject && loadedProject.ProjectID == loadProjectID) {
			hideLoadScreen();
		} else {
			showLoadScreen();
		}
	}
}

function loadProject(projectID, versionID) {
	showModal('#loadingMessage');
	setPath(projectID, versionID);
	var loadedProject = fileManager.getProject(projectID, versionID, true);
	hideLoadScreen();


	return loadedProject;
}

function setPath(projectID, versionID) {

	var path = projectID;
	if ((projectID.indexOf("/p/") == -1) && (projectID.indexOf("/v/") == -1)) { 
		path = "/p/"+ projectID;
		if (versionID && versionID != "default") {path = "/v/" + projectID + "/" + versionID;}
	} else {
		var parts = projectID.split("/");
		projectID = parts[2];
		if (parts.length > 3) {versionID=parts[3];}
	}
	History.replaceState({projectID:projectID, versionID: versionID}, "Project-"+projectID, path);
}

function loadVersions() {
	var selectedProject = fileManager.getProject($('#details-list-rows').data('projectid'));
	$('#details-list-rows').html(selectedProject.VersionList);
}

function versionLoaded() {
	hideLoadScreen();
	mainController.loadProject(fileManager.activeProject);
}

function loadProjectData() {
	closeModal();
 
}

function canvasChanged() {
	$('.js-clear-onchange').empty();
	mainController.clearSelection();
}

function generalError(e) {
	fatalErrorMessage(e.detail.message, false);
	//setTimeout(function() {window.location = "/";}, 3000);
}

$(document).ready(function() {
	document.addEventListener("vertsPerSideChanged", updateEdgeVertDisplay, false);
	document.addEventListener("vertsGridChanged", updateGridVertDisplay, false);
	document.addEventListener("vertsRandomChanged", updateRandomVertDisplay, false);
	//document.addEventListener("vertexAdded", hideSaveButton, false);
	document.addEventListener("drawn", hideSaveButton, false);
	document.addEventListener("drawn", hideRedraw, false);
	document.addEventListener("verticesChanged", hideSaveButton, false);
	document.addEventListener("verticesChanged", updateStats, false);
	document.addEventListener("verticesChanged", canvasChanged, false);
	document.addEventListener("drawing", showRedraw, false);
	document.addEventListener("drawn", canvasChanged, false);
	document.addEventListener("projectsLoaded", loadProjects, false);
	document.addEventListener("jsonRestored", loadProjectData, false);
	document.addEventListener("versionsUpdated", loadVersions, false);
	document.addEventListener("activeProjectLoaded", versionLoaded, false);
	document.addEventListener("zoomChanged", updateStats, false);
	document.addEventListener("settingsChanged", updateStats, false);
	document.addEventListener("projectsLoadError", generalError, false);


	mainController = new mainCtrl(false);

	fileManager = new fileMngr();
	fileManager.getProjects();
	initInterface();
	$('#edgeVertCount').html(mainController.vertsPerSide);
	$('#randomVertCount').html(mainController.randomCount);
	$('#gridVertHozCount').html(mainController.vertsGrid.hor);
	$('#gridVertVertCount').html(mainController.vertsGrid.vert);
	$('#strokeColor').html(mainController.strokeColor);
	$('#pointColor').html(mainController.pointColor);



	updateStats();

	$('#colorpickerPoint').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			setColorPointOptions('#'+hex);
			mainController.updatePointColor('#'+hex);
			//updateStats();
		}
	});

	$('#colorpickerSwatch').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			setColorSwatch('#'+hex);
		}
	});


	$('#colorpickerStroke').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			mainController.updateStrokeColor('#'+hex);
		}
	});


	$('.dismissMenu').click(function(e){
		e.preventDefault();
		hideContextMenu();
	})

	$('.deleteVertex').click(function(e){
		e.preventDefault();
		mainController.deleteSelectedVertex();
	})

	$('.zoomIn').click(function(e){
		e.preventDefault();
		mainController.zoomIn();
	})

	$('.zoomOut').click(function(e){
		e.preventDefault();
		mainController.zoomOut();
	})

	$('.toggleTriangleFill').click(function(e) {
		e.preventDefault();
		var mousePos = mainController.getRelativeMousePosition(e);
		mainController.toggleTriangleFill($('.toggleTriangleFill').data('triangleX'), $('.toggleTriangleFill').data('triangleY'));
	})

	/*$("#upload").click(function () {
		uploadImage()
	})*/

	$('.select-tool').click(function(e) {
		e.preventDefault();
		if (delayedPopupShown) {return;}
		$(this).closest('.display-block').find('.select-tool').removeClass('selected');
		$(this).closest('.display-controls').find('.select-tool').removeClass('selected');
		$(this).addClass('selected');

		mainController.toolMode = $(this).data('toolmode');
		mainController.clearSelection();
		hideMenus();
		updateStats();

		$('.tool-layer').hide();
		$($(this).data('activelayer')).show();
	})

	$('.zoom-tool').click(function(e) {
		e.preventDefault();
		mainController.zooomMode = $(this).data('toolmode');
	})

	if ($("#canvas").addEventListener) {
		$("#canvas").addEventListener('contextmenu', function(e) {
			alert("You've tried to open context menu"); //here you draw your own menu
			e.preventDefault();
		}, false);
	} else {
		$('body').on('contextmenu', '.clicklayer', function(e) {
			var mousePos = mainController.getRelativeMousePosition(e);
			var menuType = "notvalid";
			var inTriangle = false;
			if (mainController.isVertex(~~ (mousePos.x), ~~ (mousePos.y))) {
				menuType = "#vertexMenu"
			} else {
				menuType = "#zoomMenu"
				inTriangle = mainController.isInTriangle(~~ (mousePos.x), ~~ (mousePos.y));
				if (inTriangle !== false) {
					$('.toggleTriangleFill').data('triangleX',  ~~ (mousePos.x));
					$('.toggleTriangleFill').data('triangleY', ~~ (mousePos.y));
					if (inTriangle.transparent) {
						$('.toggleTriangleFill').html('Restore Triangle Fill');
					} else {
						$('.toggleTriangleFill').html('Clear Triangle Fill');
					}
				}
			}
			$('.toggleTriangleFill').toggle((inTriangle !== false));
			mousePos.x = mousePos.x*mainController.zoomLevel;
			mousePos.y = mousePos.y*mainController.zoomLevel;
			showMenu(menuType, mousePos);
			e.preventDefault();
		});
		$('body').on('contextmenu', '.selectlayer', function(e) {
			var mousePos = mainController.getRelativeMousePosition(e);
			var menuType = "#zoomMenu"
			if (mainController.selectionBox) {
				menuType = "#selectMenu";
			} else {
				menuType = "#zoomMenu"
				inTriangle = mainController.isInTriangle(~~ (mousePos.x), ~~ (mousePos.y));
				if (inTriangle !== false) {
					$('.toggleTriangleFill').data('triangleX',  ~~ (mousePos.x));
					$('.toggleTriangleFill').data('triangleY', ~~ (mousePos.y));
					if (inTriangle.transparent) {
						$('.toggleTriangleFill').html('Restore Triangle Fill');
					} else {
						$('.toggleTriangleFill').html('Clear Triangle Fill');
					}
				}
				$('.toggleTriangleFill').toggle((inTriangle !== false));

			}			
			mousePos.x = mousePos.x*mainController.zoomLevel;
			mousePos.y = mousePos.y*mainController.zoomLevel;
			showMenu(menuType, mousePos);
			e.preventDefault();
		});
	}
});

function hideContextMenu() {
	$('.context-menu').addClass('hide');
}
function hideMenus() {
	delayedPopupShown = false;
	$('.menu').addClass('hide');
}

$(document).bind("click", function(event) {
	 hideMenus();
});

function showPopupMenu(menuType, menuPosition, menuPlacement, menuClass) {
	if(!menuPlacement) {
		menuPlacement.vertical = 'top';
		menuPlacement.horizontal = 'left';
	}
	hideContextMenu();	//Hide all context menus before showing a new one.
	var menuElement = $(menuType);
	if (menuClass) {menuElement.addClass(menuClass);}
	menuElement.removeClass('hide');  
	menuElement.css(menuPlacement.vertical,  menuPosition.y);
	menuElement.css(menuPlacement.horizontal,  menuPosition.x);
}


function showMenu(menuType, menuPosition) {
	hideMenus();	//Hide all menus before showing a new one.
	var menuElement = $(menuType);
	menuElement.removeClass('hide');  
	var menuWidth = menuElement.width();
	var menuHeight = menuElement.height();

	var containerWidth = $(mainController.canvasContainer).width() - 25;
	var containerHeight = $(mainController.canvasContainer).height() - 25;

	if ((menuPosition.x + menuWidth) > containerWidth) {
		menuPosition.x = menuPosition.x - menuWidth;
	}

	if ((menuPosition.y + menuHeight) > containerHeight) {
		menuPosition.y = menuPosition.y - menuHeight - 2;
	}

	menuElement.css('top',  menuPosition.y);
	menuElement.css('left',  menuPosition.x);
}



function infoMessage(title, message) {
	if (title) {$('#infoMessage').find('.title').html(title);}
	$('#infoMessage').find('.message').html(message);
	showModal('#infoMessage');
}
function errorMessage(errMsg) {
	$('#errorMessage').find('.message').html(errMsg);
 
	showModal('#errorMessage');
}
function fatalErrorMessage(errMsg) {
	$('#fatalErrorMessage').find('.message').html(errMsg);
 
	showModal('#fatalErrorMessage');
}


function showModalWaitMessage(){
	$('.modal-background').filter(":visible").find('.modal').addClass('wait');
}

function showModal(modalName, autoFade){
	closeModal();
	$('.modal').removeClass('wait');

	$(modalName).closest('.modal-background').show();

	if (autoFade) {
		if(!isNumber(autoFade)) {autoFade = 3000;}
		setTimeout(function() {closeModal();}, autoFade);
	}
}

function isContextMenuOpen() {
	return ($('.context-menu').not('.hide').length > 0);
}


function saveSVG() {
	var svgData = mainController.generateSVG();
	$('#SVGDownload').addClass('nohover');
	$('#SVGDownload').empty();
	var a = document.createElement('a');

	$(a).html("<img src='/images/loader.gif' />")
	$('#SVGDownload').append(a);

	setTimeout(function() {
		var data = new FormData();
		data.append("svgData", mainController.generateSVG());

		$.ajax({
			type: "POST",
			url: "/SaveSVG.ashx",
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {	
				$(a).attr("href", result);
				$(a).attr("download", result);
				a.target="_blank";

				$(a).html('<span class="tool-icon icon-in"></span> <span class="label">SVG</span>');
				$('#SVGDownload').removeClass('nohover');

			},
			error: function () {
			  errorMessage("There was error creating the svg.");
			}
		});	

	}, 1000);

	
}


function showPlaceholderError(inputElement, message) {
	var defPlaceholderText = $(inputElement).prop('placeholder');
	$(inputElement).prop('placeholder', message);
	$(inputElement).addClass('placeholder-error');

	setTimeout(function() {
		$(inputElement).prop('placeholder', defPlaceholderText);
		$(inputElement).removeClass('placeholder-error');
	}, 2500)
}

function uploadPNG() {
	fileManager.uploadSharedImage(mainController.generatePNG());
}

function savePNG() {
	$('#PNGDownload').empty();
	var a = document.createElement('a');
	a.target="_blank";
	$(a).html("<img src='/images/loader.gif' />")
	$('#PNGDownload').append(a);

	setTimeout(function() {
		a.download = "image.png";
		a.href = mainController.generatePNG();

		$(a).html('<span class="tool-icon icon-in"></span> <span class="label">PNG</span>');
	}, 500);
}

function uploadImage(projectInfo) {
 	fileManager.uploadImage(projectInfo);

}


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}