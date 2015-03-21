<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server"> 
	<meta charset="UTF-8" />      
	<title>Poly-i-nator </title>
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />

	<script type="text/javascript">
		var loadProjectID = '<asp:Literal ID="ProjectID" runat="server"></asp:Literal>';
		var loadVersionID = '<asp:Literal ID="VersionID" runat="server"></asp:Literal>';
    </script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>              
	<script type="text/javascript" src="/js/jquery-ui.min.js"></script>              
	<script type="text/javascript" src="/js/history.js"></script>              
	<script type="text/javascript" src="/js/canvas-toBlob.js"></script>
	<script type="text/javascript" src="/js/helper.js"></script>
	<script type="text/javascript" src="/js/fileManager.js"></script>
	<script type="text/javascript" src="/js/mainController.js"></script>
	<script type="text/javascript" src="/js/vertexController.js"></script>
	<script type="text/javascript" src="/js/triangulatorController.js"></script>
	<script type="text/javascript" src="/js/interfaceController.js"></script>
	<script type="text/javascript" src="/js/colpick.js"></script>

	<link href='http://fonts.googleapis.com/css?family=Archivo+Narrow:700,400,400italic' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" media="screen" href="/css/jquery-ui.min.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="/css/main.css" />
</head>
<body class="loadImage">

	<div class="display-pane open">

		<div class="display-controls">
			<!-- <div class="tools display-toggle icon-wrench"  data-ctrlsection="tools"></div>
			<div class="tools display-toggle icon-cogs"  data-ctrlsection="settings"></div>
			<div class="tools display-toggle icon-share2"  data-ctrlsection="add"></div>
			<div class="tools display-toggle icon-bin2"  data-ctrlsection="delete"></div>
			<div class="stats display-toggle icon-cloud"  data-ctrlsection="upload"></div>
			<div class="stats display-toggle icon-question"  data-ctrlsection="help"></div> -->
			<div id="tool-addPoint2" title="Add point mode" class="tools display-toggle select-tool icon-cursor"  data-toolmode="Add Points"  data-activelayer="#clickLayer"></div>
			<div id="tool-selectPoint2" title="Select points mode" class="tools display-toggle select-tool icon-marquee"  data-toolmode="Select Points"  data-activelayer="#selectLayer"></div>
			<div id="tool-zoomIn" title="Zoom in" class="tools display-toggle zoom-tool icon-zoom-in"   ></div>
			<div id="tool-zoomOut" title="Zoom out" class="tools display-toggle zoom-tool icon-zoom-out" ></div>

		</div>
		<div class="display-content">
			<!-- <div class="help display-block">
				<div class="display-section display-header">Controls</div> 
				<div class="display-section">
					<span class="label">Undo:</span> <span class="">Ctrl-Z</span> 
				</div>
				<div class="display-section">
					<span class="label">Redo:</span> <span class="">Ctrl-Y</span> 
				</div>
				<div class="display-section">
					<span class="label">Copy Vertices:</span> <span class="">Ctrl-C</span> 
				</div>
				<div class="display-section">
					<span class="label">Delete vertex:</span> <span class="">Right-(click)</span> 
				</div>
			</div> -->
			<!-- <div class="tools display-block">
				<div class="display-section display-header">Tools</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Add point mode" id="tool-addPoint" class="selected select-tool" data-toolmode="Add Points" data-activelayer="#clickLayer">
						<span class="tool-icon icon-cursor"></span> <span class="label">Add points</span> 
					</a> 
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Select points mode"   id="tool-selectPoint" class="select-tool" data-toolmode="Select Points" data-activelayer="#selectLayer">
						<span class="tool-icon icon-marquee"></span> <span class="label">Select points</span> 
					</a>
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Zoom in"   id="tool-zoomIn">
						<span class="tool-icon icon-zoom-in"></span> <span class="label">Zoom in</span> 
					</a>
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Zoom out"   id="tool-zoomOut">
						<span class="tool-icon icon-zoom-out"></span> <span class="label">Zoom out</span> 
					</a>
				</div>

			</div> -->
			<div class="settings display-block">
				<div class="display-section display-header">Settings</div>
				<div class="display-section">
					<span class="label">Gradient Color:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="None" id="colorGradients" name="gradColorCheck" checked="checked"  class="toggleGradient stat-gradient-state" />
						<label for="colorGradients"></label>
					</div> 
				</div>
				<div class="display-section">
					<span class="label">Show Fill:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="None" id="vertsOnly" name="vertOnlyCheck" checked="checked"  class="toggleFill stat-fill-state" />
						<label for="vertsOnly"></label>
					</div> 
				</div>
				<div class="display-section">
					<span class="label">Solid Gradients:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="None" id="showSolidGradient" name="showSolidGradientCheck"  class="toggleSolidGradient stat-solidgradient-state" />
						<label for="showSolidGradient"></label>
					</div> 
				</div>
				<div class="display-section">
					<span class="label">Opacity:</span><output class="ctrl-display stat-opacity" id="opacityPercent"></output>
					<input type="range" min="0" max="100" value="100" step="1" id="opacitySlider"/>
					
				</div>

				<div class="display-section toolbar-button">
					<a href="#" title="Vertex Settings" id="showPointModal"><span class="tool-icon icon-cog"></span> <span class="label">Vertex Settings</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Stroke Settings" id="showStrokeModal"><span class="tool-icon icon-cog"></span> <span class="label">Stroke Settings</span></a>									
				</div>

			</div>
			<div class="delete display-block">
				<div class="display-section display-header">Delete Vertices</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Delete all vertices"   id="recycler"><span class="tool-icon icon-bin"></span> <span class="label">All Vertices</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Delete edge vertices" id="recycleEdges"><span class="tool-icon icon-frame"></span> <span class="label">Edge Vertices</span></a> 
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Delete grid vertices" id="recycleGrid"><span class="tool-icon icon-ungroup"></span> <span class="label">Grid Vertices</span></a>
				</div>

			</div>
			<div class="add display-block">
				<div class="display-section display-header">Add Vertices</div>
				<div class="display-section">
					<span class="label">Random:</span><span class="editable-input" contenteditable id="randomVertCount">0</span><a id="randomGenerator" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</div>
				<div class="display-section">
					<span class="label">Grid:</span><span class="editable-input" contenteditable id="gridVertHozCount">0</span>x<span class="editable-input" contenteditable id="gridVertVertCount">0</span><a id="gridVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</div>
				<div class="display-section">
					<span class="label">Edge:</span><span class="editable-input" contenteditable id="edgeVertCount">0</span><a id="edgeVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</div>
				<div class="display-section">
					<span class="label">Spiral</span><a id="spiralVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</div>
			</div>

			<div class="upload display-block">
				<div class="display-section display-header">Save / Load</div>
				<div class="display-section toolbar-button">
					<a href="/" title="Load New Image" id="imageLoader"><span class="tool-icon icon-popup"></span> <span class="label">Load New Image</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Save to Server" id="saveServer"><span class="tool-icon icon-cloud-upload"></span> <span class="label">Save to Server</span></a>
				</div>

				<!-- <div class="display-section toolbar-button">
					<a href="#" title="Export to SVG" id="svgSaver"><span class="tool-icon icon-cloud-download"></span> <span class="label">Export Image</span></a>
				</div>

				<div class="display-section toolbar-button js-clear-onchange" id="SVGDownloadx">
					
				</div>

				<div class="display-section toolbar-button js-clear-onchange" id="PNGDownloadx">
					
				</div> -->

			</div>

		</div>
	</div>	
	<div id="canvasContainer" class="open">

		<div class="menus">
			<div class="context-menu context-menu--vertex hide" id="vertexMenu">
				<ul>
					<li>
						<a href="#" class="deleteVertex">Delete Vertex</a>
					</li>	                
				</ul>
			</div>
			<div class="context-menu context-menu--zoom hide" id="zoomMenu">
				<ul>
					<li>
						<a href="#" class="zoomIn">Zoom In</a>
					</li>
					<li>
						<a href="#" class="zoomOut">Zoom Out</a>
					</li>
					<li class="spacer"></li>
					<li>
						<a href="#" class="toggleStroke"><span class="show-hide stat-stroke-state"></span> Stroke</a>
					</li>
					<li>
						<a href="#" class="toggleVerts"><span class="show-hide stat-vertex-state"></span> Vertices</a>
					</li>
					<li class="spacer"></li>
					<li>
						<a href="#" class="toggleGradient"><span class="show-hide gradient stat-gradient-state"></span></a>
					</li>
					<li>
						<a href="#" class="toggleSolidGradient"><span class="show-hide solidgradient stat-solidgradient-state"></span></a>
					</li>
					<li>
						<a href="#" class="resetSolidGradient">Regradiate Image</a>
					</li>
					<li>
						<a href="#" class="toggleFill"><span class="show-hide stat-fill-state"></span> Fill</a>
					</li>
					<li>
						<a href="#" class="clearTriangleFill">Clear Triangle Fill</a>
					</li>
				</ul>
			</div>

			<div class="context-menu context-menu--select hide" id="selectMenu">
				<ul>
					<li>
						<a href="#" class="deleteSelected">Delete selected points</a>
					</li>
				</ul>
			</div>

		</div>
		<div id="canvasLoading" class="overlay--disabled"></div>
		<canvas id="sourceImg" width="600" height="600"></canvas>    
		<canvas id="canvas" width="600" height="600"></canvas>    
		<canvas id="strokeCanvas" width="600" height="600"></canvas>   
		<canvas id="vertCanvas" width="600" height="600"></canvas>   
		<canvas id="tempCanvas" width="600" height="600"></canvas>   
		<canvas id="selectCanvas" width="600" height="600"></canvas>   
		<div id="clickLayer" class="clicklayer tool-layer canvas-layer overlay overlay--transparent"></div> 
		<div id="selectLayer" class="selectlayer tool-layer canvas-layer overlay overlay--transparent" style="display:none;"></div> 
	</div>    
	<div id="statusBar" class="status-bar">
			<span class="collapse-trigger"></span><div class="status-content"><div class="status-section status-header">Stats</div>
			<div class="status-section">
				<span class="label">Points:</span> <span class="stat stat-num-points"></span> 
			</div>
			<div class="status-section">
				<span class="label">Mode:</span> <span class="stat stat-toolmode"></span> 
			</div>
			<div class="status-section">
				<span class="label">Opacity:</span> <span class="stat stat-opacity"></span> 
			</div>
			<div class="status-section">
				<span class="label">Fill Style:</span> <span class="stat stat-fillstyle"></span> 
			</div>
			<div class="status-section toolbar-button">
				<a href="#" title="Export to SVG" id="svgSaver"><span class="tool-icon icon-cloud-download"></span> <span class="label">Export Image</span></a>
			</div>
			<div class="status-section download-button toolbar-button js-clear-onchange" id="SVGDownload">
				
			</div>

			<div class="status-section download-button toolbar-button js-clear-onchange" id="PNGDownload">
				
			</div>
		</div>

	</div>
	
	<div id="wrapper">
		<div id="intro">
			<header>
				<h1>Poly-i-nator</h1>
				<h2>Create works of geo-art</h2>
			</header>
			<div class="container imageDropper">
				<div class="container-content">
					<div class="image-drop">
						<div id="holder"  class="normal image-dropzone"><span class="icon-image"></span> <span class="drop-text">Drop your image here</span></div>
						<div>
							<a href="#" class="button button--cancel cancel" id="cancel-image-load">Cancel</a>
							<a href="#" class="button loadlibrary " id="server-image-load">Load from server</a>
							<a href="#" class="button load " id="demo-image-load">Load Demo Image</a>
						</div>
					</div>
				</div>	
			</div>	
			<div id="image-library" class="imageLibrary">
				<h1 class="library-title">Saved Images</h1>
				<h1 class="details-title" data-details="title">Versions</h1>
				<div id="library-container" class="libraryContainer"> 
					<div class="details">
						<div class="details-list">
							<div class="details-list--header">
								<span>Date</span><span class="data-type--favorite icon-star2" ></span><span>Versions</span><span>&nbsp;</span>
							</div>
							<div id="details-list-rows"></div>
						</div>
						<div class="buttons">
							<a href="#" class="button button--cancel" id="cancel-detail-display">Back to image list</a>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</div>

	<div class="modal-background modal-dark">
		<div class="modal" id="loadingMessage">
			<div class="title">Loading Project</div>
			<div class="message">Loading <img src='/images/loader-lightback.gif' /></div>
		</div>
	</div>

	<div class="modal-background modal-clear">
		<div class="modal" id="pointPropsModal">
			<input type="hidden" id="pointOpacityInit" value="0" />
			<input type="hidden" id="pointSizeInit" value="0" />
			<input type="hidden" id="pointShapeInit" value="0" />
			<input type="hidden" id="pointColorInit" value="0" />
			<input type="hidden" id="pointStrokeSyncInit" value="0" />
			<input type="hidden" id="pointStrokeSizeInit" value="0" />
			<input type="hidden" id="pointShowVertexInit" value="0" />
			<div class="modal-close-button cancelPointSettings"><span class="icon-cancel"></span></div>
			<div class="title">Vertex Properties</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-sixtyfive">

					<div class="modal-control inline-check">
						<span class="label">Show Vertices:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="None" id="showVertexModal" name="showVertexCheck" checked="checked" class="toggleVerts stat-vertex-state"/>
							<label for="showVertexModal"></label>
						</div>
					</div>
					<div class="modal-control">
						<span class="label">Opacity:</span> <output class="ctrl-display stat-point-opacity" ></output>
						<input type="range" min="0" max="100" value="100" step="1" id="pointOpacitySlider"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Point size:</span> <output class="ctrl-display stat-ptsize" ></output>
						<input type="range" min=".5" max="10" value="1.5" step=".5" id="pointSizeSlider"/>
					</div>
					<div class="modal-control inline-check">
						<span class="label">Sync Point and Stroke Size:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="check-sync" id="point-stroke-sync" class="stat-point-stroke-sync"/>
							<label for="point-stroke-sync"></label>
						</div>
					</div>
					<div class="modal-control">
						<span class="label">Point Shape:</span>
						<div class="pointShapes">
							<div class="check-control-group">
								<div class="check-control roundedOne">
									<input type="radio" value="triangle" id="point-select-triangle" name="point-shape-select"  class="point-shape-select"/>
									<label for="point-select-triangle"></label>
								</div>
								<label for="point-select-triangle"><span class="select-label icon-arrow-up select-triangle custom-point-color"></span></label>
							</div>
							<div class="check-control-group">
								<div class="check-control roundedOne">
									<input type="radio" value="circle" id="point-select-circle" name="point-shape-select" class="point-shape-select" />
									<label for="point-select-circle"></label>
								</div>
								<label for="point-select-circle"><span class="select-label icon-circle select-circle custom-point-color"></span></label>
							</div>
							<div class="check-control-group last">
								<div class="check-control roundedOne">
									<input type="radio" value="square" id="point-select-square" name="point-shape-select" class="point-shape-select" />
									<label for="point-select-square"></label>
								</div>
								<label for="point-select-square"><span class="select-label icon-stop2 select-square custom-point-color"></span></label>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-ctrl-section">
					<div class="modal-control">
						<span class="label">Point Color:</span>
						<div id="colorpickerPoint"></div>
					</div>
				</div>
			</div>
			
			<div class="buttons"><a href="#" id="updatePointSettings" class="button modal-close">Update Settings</a> <a  href="#" class="cancelPointSettings button button--cancel">Cancel</a></div>
		</div>
	</div> 



	<div class="modal-background modal-clear">
		<div class="modal" id="strokePropsModal">
			<input type="hidden" id="strokeOpacityInit" value="0" />
			<input type="hidden" id="strokeSizeInit" value="0" />
			<input type="hidden" id="strokeShapeInit" value="0" />
			<input type="hidden" id="strokeColorInit" value="0" />
			<input type="hidden" id="strokePointSyncInit" value="0" />
			<input type="hidden" id="strokePointSizeInit" value="0" />
			<input type="hidden" id="strokeShowStrokeInit" value="0" />
			<div class="modal-close-button cancelStrokeSettings"><span class="icon-cancel"></span></div>
			<div class="title modal-mover">Stroke Properties</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-sixtyfive">
					<div class="modal-control inline-check">
						<span class="label">Show Stroke:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="None" id="showStrokeModalCheck"  class="toggleStroke stat-stroke-state" />
							<label for="showStrokeModalCheck"></label>
						</div>
					</div>
					<div class="modal-control">
						<span class="label">Opacity:</span> <output class="ctrl-display stat-stroke-opacity" ></output>
						<input type="range" min="0" max="100" value="100" step="1" id="strokeOpacitySlider"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Stroke size:</span> <output class="ctrl-display stat-strokesize" ></output>
						<input type="range" min=".5" max="10" value="1.5" step=".5" id="strokeSizeSlider"/>
					</div>
					<div class="modal-control inline-check">
						<span class="label">Sync Stroke and Point Size:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="check-sync" id="stroke-point-sync" class="stat-point-stroke-sync"/>
							<label for="stroke-point-sync"></label>
						</div>
					</div>
				</div>
				<div class="modal-ctrl-section">
					<div class="modal-control">
						<span class="label">Stroke Color:</span>
						<div id="colorpickerStroke"></div>
					</div>
				</div>
			</div>
			
			<div class="buttons"><a href="#" id="updatePointSettings" class="button modal-close">Update Settings</a> <a  href="#" class="cancelStrokeSettings button button--cancel">Cancel</a></div>
		</div>
	</div> 


	<div class="modal-background modal-close">
		<div class="modal" id="saveProjectModal">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Save Project</div>
			<div class="content" data-waitmessage="Saving">
				<input id="projectName" class="input--text allowPaste" type="text" placeholder="Project Name" />
				<input id="versionName" class="input--text allowPaste" type="text" placeholder="Version Name" />
				<textarea id="versionSummary" placeholder="Versions notes"></textarea>
				<div id="start-new-project" class="modal-control inline-check">
					<span class="label">Create new project:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="check-new-project" id="check-new-project" class="check-new-project"/>
						<label for="check-new-project"></label>
					</div>
				</div>
				<div class="buttons"><a href="#" id="saveProject" class="button">Save Project</a> <a href="#" class="modal-close button button--cancel">Cancel</a></div>
			</div>
		</div>
	</div> 

	<div class="modal-background modal-close">
		<div class="modal modal--small" id="showProcessing">
			<div class="title">Processing</div>
			<div class="message">Processing Request</div>
		</div>
	</div>

	<div class="modal-background modal-close">
		<div class="modal modal--small" id="projectSaveSuccess">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Project Saved!</div>
			<div class="message">Project successfully saved.</div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div>


	<div class="modal-background modal-close">
		<div class="modal" id="deleteVersionModal">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Delete Version</div>
			<div class="content" data-waitmessage="Deleting">
				<div class="message">Are you sure you want to delete this version?<br>You can't undo this action.</div>
				<div class="buttons"><a href="#" id="deleteVersion" class="button">Delete Version</a> <a href="#" class="modal-close button button--cancel">Cancel</a></div>
			</div>
		</div>
	</div> 

	<div class="modal-background modal-close">
		<div class="modal modal--small" id="versionDeleteSuccess">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Version Deleted</div>
			<div class="message">Version successfully deleted.</div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div>


	<div class="modal-background modal-close">
		<div class="modal" id="errorMessage">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Error</div>
			<div class="message"></div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div> 




	<script type="text/template" id="project-list-template">
		<div class="image-select {isMultiple}">
			<span class="image-select-icon js-select-image" data-projectid="{ProjectID}"><img src="{Thumbnail}"><a class="select-item" href="#"></a> <a class="favorite icon-star2 select-ctrl js-load-version-favorite" href="/p/{ProjectID}"></a><a class="folder icon-folder-open select-ctrl" href="#"></a></span>
			<span class="image-select-title">{ProjectName}</span>
			<!--<span class="image-select-subtitle">{ProjectNameSub}</span>-->
		</div>
	</script>

	<script type="text/template" id="version-list-template">

		<div class="details-list--row {favoriteFlag}" data-version="{Date}" data-projectid="{ProjectID}">
			<span class="data-type--date row-element" data-details="date">{DateDisplay}</span><span class="row-element data-type--favorite icon-star2" ><a href="#" title="Mark as favorite"></a></span><a href="/v/{ProjectID}/{Date}" class="row-element data-type--text js-load-version" data-details="note" title="Load this version">{Name}</a><span class="row-element data-type-ctrls" data-details="controls"> <a href="#" class="detail-ctrl detail-ctrl--delete icon-cross" title="Delete this version"></a> </span>
		</div>
	</script>




  </body>
</html>