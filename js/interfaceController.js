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

function initInterface() {
	if (loadProjectID != '') {hideLoadScreen();}


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

	$('.toggleVerts').click(function(e) {
		mainController.toggleVertices();
		updateStats();
	})

	$('.toggleGradient').click(function(e) {
		mainController.toggleGradientDisplay();
		updateStats();
		//$(this).find('.icon--radio').toggleClass('checked', mainController.useGradient);
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

	

	$('.deleteSelected').click(function(e) {
		mainController.deleteSelectedVertices();
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

	$('.display-trigger').click(function(e) {
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



	window.onkeydown = function(e){
	 // Ensure event is not null
		e = e || window.event;
		
		if (e.ctrlKey) {
			var x = $("*:focus");
			if (x.hasClass('allowPaste')) {return;}
			// Ctrl is down, copy the vertex info in case they want to copy the vertices
			$('#clipboard').html(mainController.getVertexJSON());
			$('#clipboard').focus().select();
		} 
	}
 
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
		bugReport.bugLabel = $('#bugLabel').val();
		bugReport.bugSummary = $('#bugSummary').val();

		if (bugReport.message != '') {
			fileManager.sendBugReport(bugReport);
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

		resizeCanvas();

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
	img.src = imgData;

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

	mainController.scaleCanvas(theSourceImage, currentZoom);
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
	setValue($('.stat-gradient-state'), mainController.useGradient);
	setValue($('.stat-solidgradient-state'), mainController.useSolidGradient);

	if (mainController.useGradient) {
		setValue($('.stat-fillstyle'), 'Gradient');
	} else {
		setValue($('.stat-fillstyle'), 'Solid');
	}

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

function setValue(ctrl, value) {
	$(ctrl).each(function(){
		var thisCtrl = $(this);
		if (thisCtrl.hasClass('show-hide')) {
			thisCtrl.toggleClass('show', !value);
		} else {
			thisCtrl.html(value);
			if(thisCtrl.is(':checkbox') || thisCtrl.is(':radio')) {
				thisCtrl.prop('checked', value)
			} else if (thisCtrl.html() != value) {
				thisCtrl.val(value);
			}
		}
	})
}

function loadProjects() {
	$.each(fileManager.projects, function( key, value ) {
		$('#library-container').prepend(this.HTML);

	});


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
		//resizeCanvas(.1);
	})

	$('.zoomOut').click(function(e){
		e.preventDefault();
		//resizeCanvas(-.1);
	})

	$('.clearTriangleFill').click(function(e) {
		e.preventDefault();
		var mousePos = mainController.getRelativeMousePosition(e);
		mainController.clearTriangleFill($('.clearTriangleFill').data('triangleX'), $('.clearTriangleFill').data('triangleY'));
	})

	/*$("#upload").click(function () {
		uploadImage()
	})*/

	$('.select-tool').click(function(e) {
		e.preventDefault();
		$(this).closest('.display-block').find('.select-tool').removeClass('selected');
		$(this).closest('.display-controls').find('.select-tool').removeClass('selected');
		$(this).addClass('selected');

		mainController.toolMode = $(this).data('toolmode');
		mainController.clearSelection();
		updateStats();

		$('.tool-layer').hide();
		$($(this).data('activelayer')).show();
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
				if (inTriangle) {
					$('.clearTriangleFill').data('triangleX',  ~~ (mousePos.x));
					$('.clearTriangleFill').data('triangleY', ~~ (mousePos.y));
				}
			}
			$('.clearTriangleFill').toggle(inTriangle);
			showMenu(menuType, mousePos);
			e.preventDefault();
		});
		$('body').on('contextmenu', '.selectlayer', function(e) {
			var mousePos = mainController.getRelativeMousePosition(e);
			var menuType = "#zoomMenu"
			if (mainController.selectionBox) {
				menuType = "#selectMenu";
			} 
			showMenu(menuType, mousePos);
			e.preventDefault();
		});
	}
});

function hideContextMenu() {
	$('.context-menu').addClass('hide');
}

$(document).bind("click", function(event) {
	 hideContextMenu();
});

function showMenu(menuType, menuPosition) {
	hideContextMenu();	//Hide all context menus before showing a new one.
	var menuElement = $(menuType);
	menuElement.removeClass('hide');  
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

function showModalWaitMessage(){
	$('.modal-background').filter(":visible").find('.modal').addClass('wait');
}

function showModal(modalName){
	closeModal();
	$('.modal').removeClass('wait');

	$(modalName).closest('.modal-background').show();
}

function isContextMenuOpen() {
	return ($('.context-menu').not('.hide').length > 0);
}
function hideContentMenu() {
	$('.context-menu').addClass('hide');
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