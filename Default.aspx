<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server"> 
	<meta charset="UTF-8" />      
	<title>Polygon Graphics </title>
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
	<script type="text/javascript" src="/js/custom-palette.js"></script>
	<script type="text/javascript" src="/js/fileManager.js"></script>
	<script type="text/javascript" src="/js/mainController.js"></script>
	<script type="text/javascript" src="/js/vertexController.js"></script>
	<script type="text/javascript" src="/js/tri2.js"></script>
	<script type="text/javascript" src="/js/interfaceController.js"></script>
	<script type="text/javascript" src="/js/colpick.js"></script>

	<!-- <link href='http://fonts.googleapis.com/css?family=Archivo+Narrow:700,400,400italic' rel='stylesheet' type='text/css'> -->
	<link href='https://fonts.googleapis.com/css?family=Gudea:400,400italic,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" media="screen" href="/css/jquery-ui.min.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="/css/main.css" />
</head>
<body class="loadImage">

	<div class="display-pane">

		<div class="display-controls">
			<div id="tool-addPoint2" class="tools display-toggle select-tool  selected tooltip tooltip--right" data-tooltip="Add points mode"  data-toolmode="Add Points"  data-activelayer="#clickLayer"><span class="icon-cursor"></span></div>
			<div id="tool-selectPoint2" data-tooltip="Select points mode" class="tools display-toggle select-tool  tooltip tooltip--right"  data-toolmode="Select Points"  data-activelayer="#selectLayer"><span class="icon-marquee"></span></div>
			<div id="tool-geoPoints" data-tooltip="Shape Tool" class="tools display-toggle select-tool  tooltip tooltip--right show-delayed-popup" data-popupmenu="#shapeOptionsMenu" data-popuppositionv="top-offset" data-popuppositionh="right" data-popupclass="arrow-left"  data-toolmode="Shape Tool"  data-activelayer="#shapeLayer"><span class="show-selectShape"></span><span class="delay-indicator"></span></div>


  
			<!-- <div id="tool-selectPoint2" data-tooltip="Masking mode" class="tools display-toggle select-tool  tooltip tooltip--right"  data-toolmode="Draw Mask"  data-activelayer="#maskLayer"><span class="icon-brush"></span></div> -->



			<div id="tool-zoomIn" data-tooltip="Zoom in" class="tools display-toggle zoom-tool  zoomIn tooltip tooltip--right" data-toolmode="zoomIn"   ><span class="icon-zoom-in"></span></div>
			<div id="tool-zoomOut" data-tooltip="Zoom out" class="tools display-toggle zoom-tool  zoomOut tooltip tooltip--right" data-toolmode="zoomOut" ><span class="icon-zoom-out"></span></div>

		</div>
		<div class="display-content">
			<!--<div class="settings display-block display-static">
				<div class="display-section display-header">Settings <span class="display-trigger"></span></div>
				 <div class="display-section">
					<span class="label">Show Vertices:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="None" id="showVertexCheck" name="showVertexCheck" checked="checked" class="toggleVerts stat-vertex-state"/>
						<label for="showVertexCheck"></label>
					</div>
				</div>
				<div class="display-section">
					<span class="label">Show Stroke:</span> 
					<div class="check-control squaredThree">
						<input type="checkbox" value="None" id="showStrokeCheck"  class="toggleStroke stat-stroke-state" />
						<label for="showStrokeCheck"></label>
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
					<input type="range" min="0" max="100" value="100" step="1" class="stat-globalOpacity" id="opacitySlider"/>
					
				</div>

				<div class="display-section toolbar-button">
					<a href="#" title="Vertex Settings" id="showPointModal"><span class="tool-icon icon-cog"></span> <span class="label">Vertex Settings</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Stroke Settings" id="showStrokeModal"><span class="tool-icon icon-cog"></span> <span class="label">Stroke Settings</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Adjust Color" id="showColorAdjustModal"><span class="tool-icon icon-palette"></span> <span class="label">Adjust Color</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Adjust Custom Colors" id="showCustomColorModal"><span class="tool-icon icon-palette"></span> <span class="label">Custom Colors</span></a>									
				</div>

			</div>-->
<!-- 			<div class="delete display-block display-static">
	<div class="display-section display-header">Delete Vertices <span class="display-trigger"></span></div>
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
<div class="add display-block display-static">
	<div class="display-section display-header">Add Vertices <span class="display-trigger"></span></div>
	<div class="display-section">
		<span class="label">Random:</span><span class="editable-input" contenteditable id="randomVertCount">0</span><a id="randomGenerator" href="#" class="icon-plus-square inline-button icon-button"></a>								
	</div>
	<div class="display-section">
		<span class="label">Grid:</span><span class="editable-input" contenteditable id="gridVertHozCount">0</span>x<span class="editable-input" contenteditable id="gridVertVertCount">0</span><a id="gridVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
	</div>
	<div class="display-section">
		<span class="label">Edge:</span><span class="editable-input" contenteditable id="edgeVertCount">0</span><a id="edgeVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
	</div>

</div> -->

			<!-- <div class="upload display-block display-static">
				<div class="display-section display-header">Save / Load <span class="display-trigger"></span></div>
				<div class="display-section toolbar-button">
					<a href="/" title="Load New Image" id="imageLoader"><span class="tool-icon icon-popup"></span> <span class="label">Load New Image</span></a>									
				</div>
				<div class="display-section toolbar-button">
					<a href="#" title="Save to Server" id="saveServer"><span class="tool-icon icon-cloud-upload"></span> <span class="label">Save to Server</span></a>
				</div>
			
			</div> -->

		</div>
	</div>	
	<div id="canvasContainer">

		<div class="menus">
			<div class="menu context-menu context-menu--vertex hide" id="vertexMenu">
				<ul>
					<li>
						<a href="#" class="deleteVertex">Delete Vertex</a>
					</li>	                
				</ul>
			</div>
			<div class="menu context-menu context-menu--zoom hide" id="zoomMenu">
				<ul>
					<li class="stat-display-randomizeColors">
						<a href="#" class="resetCustomColors">Rerandomize Colors</a>
					</li>
					<li class="stat-display-regradiateSolid">
						<a href="#" class="resetSolidGradient">Regradiate Image</a>
					</li>
					<li class="stat-display-randomizeColors">
						<a href="#" class="pickCustomColor show-popup" data-popupmenu="#customColorsMenu" data-popuptrigger="hover" data-popuppositionv="top-offset" data-popuppositionh="right" data-popupclass="arrow-left">Select Custom Color <span class="icon-arrow-right2 right-align"></span></a>
					</li>
					<li>
						<a href="#" class="toggleTriangleFill">Clear Triangle Fill</a>
					</li>
					<li class="spacer"></li>



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
					<li>
						<a href="#" class="toggleFill"><span class="show-hide stat-fill-state"></span> Fill</a>
					</li>
					<li>
						<a href="#" class="toggleSolidGradient"><span class="show-hide solidgradient stat-solidgradient-state"></span></a>
					</li>
					<!-- <li>
						<a href="#" class="toggleGradient"><span class="show-hide gradient stat-gradient-state"></span></a>
					</li> -->
				</ul>
			</div>

			<div class="menu context-menu context-menu--select hide" id="selectMenu">
				<ul>
					<li>
						<a href="#" class="deleteSelected">Delete Selected Points</a>
					</li>
					<li>
						<a href="#" class="clearSelectedFill">Clear Selected Triangles Fill</a>
					</li>
					<li>
						<a href="#" class="restoreSelectedFill">Restore Selected Triangles Fill</a>
					</li>
				</ul>
			</div>

		</div>
		<div id="canvasLoading" class="overlay--disabled"></div>
		<canvas id="sourceImg" width="600" height="600"></canvas>    
		<canvas id="adjustmentCanvas" width="600" height="600"></canvas>    
		<canvas id="strokeCanvas" width="600" height="600"></canvas>   
		<canvas id="vertCanvas" width="600" height="600"></canvas>   
		<canvas id="tempCanvas" width="600" height="600"></canvas>   
		<canvas id="selectCanvas" width="600" height="600"></canvas>   
		<canvas id="maskCanvas" width="600" height="600"></canvas>   
		<canvas id="shapeCanvas" width="600" height="600"></canvas>   
		<div id="clickLayer" class="clicklayer tool-layer canvas-layer overlay overlay--transparent"></div> 
		<div id="selectLayer" class="selectlayer tool-layer canvas-layer overlay overlay--transparent" style="display:none;"></div> 
		<div id="maskLayer" class="maskLayer tool-layer canvas-layer overlay overlay--transparent" style="display:none;"></div> 
		<div id="shapeLayer" class="shapeLayer tool-layer canvas-layer overlay overlay--transparent" style="display:none;"></div> 
	</div>    
	<div id="statusBar" class="status-bar">
		<div class="status-content">
			<div class="status-section">
				<span class="label">Points:</span> <span class="stat stat-num-points"></span> 
			</div>
			<div class="status-section">
				<span class="label">Mode:</span> <span class="stat stat-toolmode"></span> 
			</div>
			<!-- <div class="status-section">
				<span class="label">Opacity:</span> <span class="stat stat-opacity"></span> 
			</div>
			<div class="status-section show-popup" data-popupmenu="#fillOptionsMenu" data-popuppositionv="top" data-popuppositionh="center" data-popupclass="arrow-down">
				<span class="popup-indicator icon-arrow-up2"></span>
				<span class="label">Fill Style:</span> <span class="stat stat-fillstyle-label"></span> 
			</div>
			<div class="status-section show-popup" data-popupmenu="#zoomOptionsMenu" data-popuppositionv="top" data-popuppositionh="center" data-popupclass="arrow-down">
				<span class="popup-indicator icon-arrow-up2"></span>
				<span class="label">Zoom:</span> <span class="stat stat-zoom"></span> 
			</div> 
			<div class="status-section toolbar-button">
				<a href="#" title="Export to SVG" id="svgSaver"><span class="tool-icon icon-cloud-download"></span> <span class="label">Export Image</span></a>
			</div>-->
			<!-- <div class="status-section download-button toolbar-button js-clear-onchange js-svgdownload" id="SVGDownload">
				
			</div>
			
			<div class="status-section download-button toolbar-button js-clear-onchange js-pngdownload" id="PNGDownload">
				
			</div> -->

			<!-- <div class="status-section toolbar-button">
				<a href="#" title="Share" id="shareImage"><span class="icon-share"></span> <span class="label">Share this image</span> </a>
			</div>

			<div class="status-section toolbar-button">
				<a href="#" title="Comments" id="showErrorReport"><span class="icon-paper-plane"></span> <span class="label">Comments</span> </a>
			</div>

			<div class="status-section toolbar-button">
				<a href="#" title="Release Notes" id="showReleaseNotes"><span class="icon-feather"></span> <span class="label">Release Notes</span> </a>
			</div> -->

		</div>

	</div>

	<div id="menuBar" class="menu-bar">

		<div class="status-content">
			<div class="status-section show-popup" data-popupmenu="#fileMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left">
				<span class="label">File</span>
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section show-popup" data-popupmenu="#settingsMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left">
				<span class="label">Settings</span>
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section show-popup" data-popupmenu="#addDeleteMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left">
				<span class="label">Add/Delete</span>
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>

			<div class="status-section show-popup"  data-popupmenu="#opacityMenu" data-popuppositionv="bottom-tight" data-popuppositionh="center" >
				<span class="label">Opacity:</span> <span class="stat stat-opacity"></span>  <!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section show-popup" data-popupmenu="#fillOptionsMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left" >
				<span class="label">Fill Style:</span> <span class="stat stat-fillstyle-label"></span> 
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section show-popup" data-popupmenu="#zoomOptionsMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left" >
				<span class="label">Zoom:</span> <span class="stat stat-zoom"></span> 
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section show-popup" data-popupmenu="#helpMenu" data-popuppositionv="bottom-tight" data-popuppositionh="left">
				<span class="label">Help</span>
				<!-- <span class="popup-indicator icon-arrow-down"></span> -->
			</div>
			<div class="status-section download-button toolbar-button js-clear-onchange js-svgdownload" id="SVGDownloadx">
				<span class="label">SVG</span>
			</div>

			<div class="status-section download-button toolbar-button js-clear-onchange js-pngdownload" id="PNGDownloadx">
				<span class="label">PNG</span>
			</div>



		</div>

		<div class="login-status">
			<a class="button login-button" href="#">Signed In</a>
			<div class="info--user-container">
				<div class="g-signin2" data-onsuccess="onSignIn"></div>
				<div class="info---user">
					<span id="userProfileImage" class="user-info"><img src="https://lh4.googleusercontent.com/-uT4MOYY99LA/AAAAAAAAAAI/AAAAAAAAAAw/lbpGtOWcz6A/s96-c/photo.jpg"></span>
					<span class="user-info-container">
						<div id="userName" class="user-info">Polygon SoMuch</div>
						<div id="userEmail" class="user-info">somuchpolygons@gmail.com</div>
						<div id="signout"><a id="signout-button" href="#">Sign out</a></div>
					</span>

				</div>
			</div>		
		</div>


	</div>

	
	<div class="popup-menus">

		<div class="menu popup-menu--shapeoptions hide menu-horizontal" id="shapeOptionsMenu">
			<ul>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="line"><span class="check icon-line "></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="circle"><span class="check icon-radio-unchecked "></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="triangle"><span class="check icon-triangle"></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="square"><span class="check icon-square"></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="pentagon"><span class="check icon-pentagon"></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="hexagon"><span class="check icon-hexagon"></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="heptagon"><span class="check icon-heptagon"></span></a>
				</li>
				<li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="octagon"><span class="check icon-octagon"></span></a>
				</li>
				<!-- <li class="stat-shape-type show-selected show-compareValue">
					<a href="#" class="selectShape" data-setvalue="star"><span class="check icon-five-pointed-star"></span></a>
				</li> -->
			</ul>
		</div>

		<div class="menu popup-menu--settings hide" id="fileMenu">
			<ul>
				<li>
					<a href="/" title="Load New Image" id="imageLoader" class="allowDefault">Load New Image </a>
				</li>
				<li>
					<a href="#" title="Save to Server" id="saveServer">Save to Server</a>
				</li>

				<li>
					<a href="#" title="Export to SVG" id="svgSaver">Export Image</a>				
				</li>
				<li>
					<a href="#" title="Share" id="shareImage">Share this image</a>
				</li>
			</ul>
		</div>


		<div class="menu popup-menu--settings hide" id="helpMenu">
			<ul>
				<li>
					<a href="#" title="Comments" id="showErrorReport">Comments </a>
				</li>
				<li>
					<a href="#" title="Release Notes" id="showReleaseNotes">Release Notes </a>
				</li>

			</ul>
		</div>
		<div class="menu popup-menu--settings hide" id="addDeleteMenu">
			<ul>
				<li>
					<a href="#" class="showAdvancedSettings show-popup" data-popupmenu="#addOptionsMenu" data-popuptrigger="hover" data-popuppositionv="top-offset" data-popuppositionh="right-tight">Add Vertices <span class="icon-arrow-right2 right-align"></span></a>
				</li>
				<li>
					<a href="#" class="showAdvancedSettings show-popup" data-popupmenu="#deleteOptionsMenu" data-popuptrigger="hover" data-popuppositionv="top-offset" data-popuppositionh="right-tight">Delete Vertices <span class="icon-arrow-right2 right-align"></span></a>
				</li>


			</ul>
		</div>
		<div class="menu popup-menu--addOptions hide" id="addOptionsMenu" data-popuptype='hover'>
			<ul >
				<li>
					<span class="label">Random:</span><span class="editable-input" contenteditable id="randomVertCount">0</span><a id="randomGenerator" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</li>
				<li>
					<span class="label">Grid:</span><span class="editable-input" contenteditable id="gridVertHozCount">0</span>x<span class="editable-input" contenteditable id="gridVertVertCount">0</span><a id="gridVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</li>
				<li>
					<span class="label">Edge:</span><span class="editable-input" contenteditable id="edgeVertCount">0</span><a id="edgeVertices" href="#" class="icon-plus-square inline-button icon-button"></a>								
				</li>

			</ul>
		</div>
		<div class="menu popup-menu--deleteOptions hide" id="deleteOptionsMenu" data-popuptype='hover'>
			<ul >
				<li>
					<a href="#" title="Delete all vertices"   id="recycler"><span class="tool-icon icon-bin"></span> <span class="label">All Vertices</span></a>									
				</li>
				<li>
					<a href="#" title="Delete edge vertices" id="recycleEdges"><span class="tool-icon icon-frame"></span> <span class="label">Edge Vertices</span></a> 
				</li>
				<li>
					<a href="#" title="Delete grid vertices" id="recycleGrid"><span class="tool-icon icon-ungroup"></span> <span class="label">Grid Vertices</span></a>
				</li>

			</ul>
		</div>


		<div class="menu popup-menu--settings hide" id="settingsMenu">
			<ul>
				<li>
					<a href="#" class="toggleVerts" data-setvalue="true"><span class="show-hide stat-vertex-state"></span> Vertices</a>
				</li>
				<li>
					<a href="#" class="toggleStroke" data-setvalue="true"><span class="show-hide stat-stroke-state"></span> Strokes</a>
				</li>

				<li>
					<a href="#" class="toggleFill" data-setvalue="true"><span class="show-hide stat-fill-state"></span> Fill</a>
				</li>
				<li>
					<a href="#" class="toggleSolidGradient" data-setvalue="true"><span class="show-hide solidgradient stat-solidgradient-state"></span></a>
				</li>
				<li>
					<a href="#" class="showAdvancedSettings show-popup" data-popupmenu="#advancedSettingsMenu" data-popuptrigger="hover" data-popuppositionv="top-offset" data-popuppositionh="right-tight">Advanced Settings <span class="icon-arrow-right2 right-align"></span></a>
				</li>

			</ul>
		</div>
		<div class="menu popup-menu--advancedSettings hide" id="advancedSettingsMenu" data-popuptype='hover'>
			<ul >
				<li>
					<a href="#" title="Vertex Settings" id="showPointModal"><span class="label">Vertex Settings</span></a>
				</li>
				<li>
					<a href="#" title="Stroke Settings" id="showStrokeModal"><span class="label">Stroke Settings</span></a>
				</li>
				<li>
					<a href="#" title="Adjust Color" id="showColorAdjustModal"><span class="label">Adjust Color</span></a>
				</li>
				<li>
					<a href="#" title="Adjust Custom Colors" id="showCustomColorModal"><span class="label">Custom Colors</span></a>
				</li>
			</ul>
		</div>

		<div class="menu popup-menu--filloptions hide" id="fillOptionsMenu">
			<ul>
				<li class=" show-selected stat-fillstyle show-compareValue">
					<a href="#" class="setFillStyle" data-setvalue="Gradient"><span class="check show-selected stat-fillstyle show-compareValue"></span>Gradient Fill</a>
				</li>
				<li class=" show-selected stat-fillstyle show-compareValue">
					<a href="#" class="setFillStyle" data-setvalue="Solid"><span class="check show-selected stat-fillstyle show-compareValue"></span>Solid Fill</a>
				</li>
				<li class=" show-selected stat-fillstyle show-compareValue">
					<a href="#" class="setFillStyle" data-setvalue="CustomRandom"><span class="check show-selected stat-fillstyle show-compareValue"></span>Random Fill</a>
				</li>
				<li class=" show-selected stat-fillstyle show-compareValue">
					<a href="#" class="setFillStyle" data-setvalue="CustomMatched"><span class="check show-selected stat-fillstyle show-compareValue"></span>Matched Color Fill</a>
				</li>
				<li>
					<a href="#" class="toggleFill" data-setvalue="true"><span class="show-hide stat-fill-state"></span> Fill</span></a>
				</li>
			</ul>
		</div>






		<div class="menu popup-menu--opacity hide" id="opacityMenu">
			<ul>
				<li class="padded">
					
					<input type="range" min="0" max="100" value="100" step="1" class="stat-globalOpacity" id="opacitySlider"/>

				</li>
			</ul>
		</div>



		<div class="menu popup-menu--zoomOptions hide" id="zoomOptionsMenu">
			<ul>
				<li>
					<a href="#" class="setZoom" data-setvalue="fitToScreen">Fit to Screen</a>
				</li>
				<li>
					<a href="#" class="setZoom" data-setvalue="2">200%</a>
				</li>
				<li>
					<a href="#" class="setZoom" data-setvalue="1.5">150%</a>
				</li>
				<li>
					<a href="#" class="setZoom" data-setvalue="1">Full Size (100%)</a>
				</li>
				<li>
					<a href="#" class="setZoom" data-setvalue=".5">50%</a>
				</li>
			</ul>
		</div>
		<div class="menu popup-menu--customColors hide" id="customColorsMenu" data-popuptype='hover'>
			<ul id="customColorSwatchPopup" class="customColorSwatches">
				<!-- <li class="menu-float customColorSwatch">
					<span class="colorSwatch" style="background-color: rgb(255, 255, 255);"></span>
				</li>
							
				<li class="menu-float customColorSwatch">
					<span class="colorSwatch" style="background-color:#50FF03"></span>
				</li>
							
				<li class="menu-float customColorSwatch">
					<span class="colorSwatch dark" style="background-color:#523800"></span>
					
				</li>
							
				<li class="menu-float customColorSwatch">
					<span class="colorSwatch" style="background-color:#FF0000"></span>
					
				</li>
							
				<li class="menu-float customColorSwatch">
					<span class="colorSwatch" style="background-color:#300CE8"></span>
					
				</li>
							
				<li class="menu-float customColorSwatch">
					<span class="colorSwatch" style="background-color:#43b50e"></span>
					
				</li> -->
			</ul>
		</div>
	</div>

	<div id="wrapper">
		<div id="intro"> 
			<header>
				<div class="header-content">
					<h1>Polygon.Graphics</h1>
				</div>
			</header>
			<div class="container imageDropper">
				<div class="container-content">
					<!-- <div class="imgUploadDiv">
						<input id="imageUploadURL" class="input--text input--upload allowPaste" type="text" placeholder="Enter URL of Image to Upload" />
						<a href="#" class="button--input uploadURLImage icon-cloud-upload"></a>
					</div> -->
					<div class="image-drop">
						<div id="holder"  class="normal image-dropzone"><span class="icon-image"></span> <span class="drop-text">Drop your image here</span></div>
						<div>
							<div class="file-upload-button-container">
								<input type="file" id="file-image-load" class="file-uploader">
								<a href="#" class="button" id="file-image-overlay">Load Image from Disk</a href="#">
							</div>
							<a href="#" class="button button--cancel cancel" id="cancel-image-load">Cancel</a>
							<a href="#" class="button loadlibrary " id="server-image-load">Load from server</a>
							<a href="#" class="button load " id="demo-image-load">Load Demo Image</a>
						</div>
					</div>
				</div>	
			</div>	
			<div id="image-library" class="imageLibrary">
				<h1 class="library-title"><a id="backToStart" class="button button--back" href="#"><span class="icon-angle-double-left"></span>Back</a><span>Saved Images</span></h1>
				<h1 class="details-title" data-details="title"><a id="cancel-detail-display" class="button button--back" href="#"><span class="icon-angle-double-left"></span>Back</a><span>Versions</span></h1>
				<div id="library-container" class="libraryContainer"> 
					<div class="details">
						<div class="details-list">
							<div class="details-list--header">
								<span>Date</span><span class="data-type--favorite icon-star2" ></span><span>Versions</span><span>&nbsp;</span>
							</div>
							<div id="details-list-rows"></div>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</div>

	<div class="modal-background modal-dark">
		<div class="modal modal--small" id="loadingMessage">
			<div class="title">Loading Project</div>
			<div class="message">Loading <img src='/images/loader-lightback.gif' /></div>
		</div>
	</div>

	<div class="modal-background modal-dark">
		<div class="modal modal--small" id="exportingMessage">
			<div class="title">Exporting Images</div>
			<div class="message">Exporting <img src='/images/loader-lightback.gif' /></div>
		</div>
	</div>


	<div class="modal-background modal-clear">
		<div class="modal" id="configurePolygonsModal">
			<div class="modal-close-button modal-close"><span class="icon-cancel"></span></div>
			<div class="title">Geometric Shape Settings</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-full">
					<div class="modal-control">
						<span class="label">Number of concentric shapes:</span> <output class="ctrl-display stat-concentric-rings" ></output>
						<input type="range" min="1" max="5" value="1" step="1" id="concentricRingsSlider"/>
						
					</div>
				</div>
				<div class="modal-ctrl-section modal-full">
					<div class="modal-control">
						<span class="label">Number of points per shape:</span> <output class="ctrl-display stat-shapeptsperside" ></output>
						<input type="range" min="1" max="50" value="1" step="1" id="shapePointsPerSideSlider"/>
						
					</div>
				</div>
			</div>
			
			<div class="buttons"><a href="#" id="updatePolygonSettings" class="button modal-close ">Update Polygon Settings</a> <a  href="#" class="button button--cancel modal-close">Cancel</a></div>
		</div>
	</div> 



	<div class="modal-background modal-clear">
		<div class="modal" id="pointPropsModal">
			<input type="hidden" id="pointOpacityInit" value="0" />
			<input type="hidden" id="pointStrokeOpacityInit" value="0" />
			<input type="hidden" id="pointSizeInit" value="0" />
			<input type="hidden" id="pointStrokeSizeInit" value="0" />
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
						<span class="label">Point Fill Opacity:</span> <output class="ctrl-display stat-point-opacity" ></output>
						<input type="range" min="0" max="100" value="100" step="1" id="pointOpacitySlider"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Point Stroke Opacity:</span> <output class="ctrl-display stat-pointstroke-opacity" ></output>
						<input type="range" min="0" max="100" value="100" step="1" id="pointStrokeOpacitySlider"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Point size:</span> <output class="ctrl-display stat-ptsize" ></output>
						<input type="range" min=".5" max="10" value="1.5" step=".5" id="pointSizeSlider"/>
					</div>
					<div class="modal-control">
						<span class="label">Point stroke size:</span> <output class="ctrl-display stat-ptstrokesize" ></output>
						<input type="range" min="0" max="5" value="1" step=".5" id="pointStrokeWidthSlider"/>
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
							<!-- <div class="check-control-group">
								<div class="check-control roundedOne">
									<input type="radio" value="triangle" id="point-select-triangle" name="point-shape-select"  class="point-shape-select"/>
									<label for="point-select-triangle"></label>
								</div>
								<label for="point-select-triangle"><span class="select-label icon-arrow-up select-triangle custom-point-color"></span></label>
							</div> -->
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
			<input type="hidden" id="strokeShowStrokeAlwaysInit" value="0" />
			<div class="modal-close-button cancelStrokeSettings"><span class="icon-cancel"></span></div>
			<div class="title modal-mover">Stroke Properties</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-sixtyfive">
					<div class="modal-control inline-check inline-control">
						<span class="label">Show Stroke:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="None" id="showStrokeModalCheck"  class="toggleStroke stat-stroke-state" />
							<label for="showStrokeModalCheck"></label>
						</div>
					</div>
					<div class="modal-control inline-check inline-control">
						<span class="label">Show Hidden Strokes:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="None" id="showStrokeAlwaysModalCheck"  class="toggleStrokeAlways stat-strokealways-state" />
							<label for="showStrokeAlwaysModalCheck"></label>
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

	<div class="modal-background modal-clear">
		<div class="modal" id="customColorModal">

			<div class="modal-close-button cancelCustomColorSettings  modal-close"><span class="icon-cancel"></span></div>
			<div class="title modal-mover">Custom Colors</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-sixtyone" id="customColorSwatches">
					
				</div>
				<div class="modal-ctrl-section">
					<div class="modal-control">
						<!-- <span class="label colorpickerSwatchLabel">Color X:</span> -->
						<div id="colorpickerSwatch"></div>
					</div>
					<div class="modal-control inline-check">
						<span class="label">Rerandomize Colors:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="check-sync" id="rerandomizeColorsCheck" checked="checked" />
							<label for="rerandomizeColorsCheck"></label>
						</div>
					</div>
				</div>
			</div>
			
			<div class="buttons"><a href="#" id="updateCustomColorSettings" class="button">Update Custom Color</a> <a  href="#" class="cancelCustomColorSettings button button--cancel modal-close">Cancel</a></div>
		</div>
	</div> 



	<div class="modal-background modal-clear">
		<div class="modal" id="ColorAdjustModal">
			<input type="hidden" id="colorAdjustRedInit" value="0" />
			<input type="hidden" id="colorAdjustBlueInit" value="0" />
			<input type="hidden" id="colorAdjustGreenInit" value="0" />
			<input type="hidden" id="colorAdjustStateInit" value="0" />
			<input type="hidden" id="brightnessInit" value="0" />
			<input type="hidden" id="contrastInit" value="0" />
			<div class="modal-close-button cancelColorAdjustSettings"><span class="icon-cancel"></span></div>
			<div class="title modal-mover">Color Adjustment</div>
			<div class="modal-controls">
				<div class="modal-ctrl-section modal-full">
					<div class="modal-control inline-check">
						<span class="label">Adjust Color:</span> 
						<div class="check-control squaredThree">
							<input type="checkbox" value="None" id="includeColorAdjustCheck" class="toggleIncludeColorAdjust stat-adjustColor-state" />
							<label for="includeColorAdjustCheck"></label>
						</div>
					</div>
					<div class="modal-control resetButton"> 
						<a href="#" class="button resetColorAdjustments">Reset to defaults</a>
						
					</div>
				</div>
				<div class="modal-ctrl-section modal-half">
					<div class="modal-control"> 
						<span class="label">Red Adjustment:</span> <span id="colorAdjustRedInput" contenteditable class="ctrl-display editable-input stat-adjustColor-red" ></span>
						<input type="range" min="-255" max="255" value="0" step="1" id="colorAdjustRedSlider" class="stat-adjustColor-red"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Green Adjustment:</span> <span id="colorAdjustGreenInput" contenteditable class="ctrl-display editable-input stat-adjustColor-green" ></span>
						<input type="range" min="-255" max="255" value="0" step="1" id="colorAdjustGreenSlider" class="stat-adjustColor-green"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Blue Adjustment:</span> <span id="colorAdjustBlueInput" contenteditable class="ctrl-display editable-input stat-adjustColor-blue" ></span>
						<input type="range" min="-255" max="255" value="0" step="1" id="colorAdjustBlueSlider" class="stat-adjustColor-blue"/>
						
					</div>
				</div>
				<div class="modal-ctrl-section modal-half">
					<div class="modal-control">
						<span class="label">Brightness:</span> <span id="brightnessInput" contenteditable class="ctrl-display editable-input stat-brightness" ></span>
						<input type="range" min="-150" max="150" value="0" step="1" id="brightnessSlider" class="stat-brightness"/>
						
					</div>
					<div class="modal-control">
						<span class="label">Contrast:</span> <span id="contrastInput" contenteditable class="ctrl-display editable-input stat-contrast" ></span>
						<input type="range" min="-100" max="100" value="0" step="1" id="contrastSlider" class="stat-contrast"/>
						
					</div>
				</div>
			</div>
			
			<div class="buttons"><a href="#" class="button modal-close">Update Color Adjustments</a> <a  href="#" class="cancelColorAdjustSettings button button--cancel">Cancel</a></div>
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
		<div class="modal" id="errorReportModal">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Send Us a Comment</div>
			<div class="content" data-waitmessage="Sending">
				<input id="bugLabel" class="input--text allowPaste required" type="text" placeholder="Comment (short description please)" />
				<textarea id="bugSummary" placeholder="Please provide a detailed description of your request"></textarea>
				<div class="buttons"><a href="#" id="sendErrorReport" class="button">Send Message</a> <a href="#" class="modal-close button button--cancel">Cancel</a></div>
			</div>
		</div>
	</div> 

	<div class="modal-background modal-close">
		<div class="modal" id="releaseNotesModal">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Release Notes</div>
			<div class="content" data-waitmessage="Loading">
				<div id="releaseNoteDisplay"></div>
				<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
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
		<div class="modal" id="archiveProjectModal">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Archive Project</div>
			<div class="content" data-waitmessage="Archiving">
				<div class="message">Are you sure you want to archive this project?<br>You can't undo this action.</div>
				<div class="buttons"><a href="#" id="archiveProject" class="button">Archive Project</a> <a href="#" class="modal-close button button--cancel">Cancel</a></div>
			</div>
		</div>
	</div> 

	<div class="modal-background modal-close">
		<div class="modal modal--small" id="projectArchiveSuccess">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Project Archived</div>
			<div class="message">Project successfully archived.</div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div>


	<div class="modal-background modal-close">
		<div class="modal messageModal" id="errorMessage">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Error</div>
			<div class="message"></div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div> 

	<div class="modal-background">
		<div class="modal messageModal" id="fatalErrorMessage">
			<div class="title">Error</div>
			<div class="message"></div>
			<div class="buttons"><a href="/" class="button">Load New Project</a></div>
		</div>
	</div> 

	<div class="modal-background modal-close">
		<div class="modal messageModal" id="infoMessage">
			<div class="modal-close modal-close-button">X</div>
			<div class="title">Message</div>
			<div class="message"></div>
			<div class="buttons"><a href="#" class="modal-close button button--cancel">Close</a></div>
		</div>
	</div> 




	<script type="text/template" id="project-list-template">
		<div class="image-select {isMultiple}">
			<span class="image-select-icon js-select-image" data-projectid="{ProjectID}"><img src="{Thumbnail}"><a class="select-item" href="#"></a> <a class="favorite icon-star2 select-ctrl js-load-version-favorite" href="/p/{ProjectID}"></a><a class="folder icon-folder-open select-ctrl" href="#"></a></span>
			<span class="image-select-title">{ProjectName} <a class="delButton" href="#">Archive</a></span>
			<!--<span class="image-select-subtitle">{ProjectNameSub}</span>-->
		</div>
	</script>

	<script type="text/template" id="version-list-template">

		<div class="details-list--row {favoriteFlag}" data-version="{Date}" data-projectid="{ProjectID}">
			<span class="data-type--date row-element" data-details="date">{DateDisplay}</span><span class="row-element data-type--favorite icon-star2" ><a href="#" title="Mark as favorite"></a></span><a href="/v/{ProjectID}/{Date}" class="row-element data-type--text js-load-version" data-details="note" title="Load this version">{Name}</a><span class="row-element data-type-ctrls" data-details="controls"> <a href="#" class="detail-ctrl detail-ctrl--delete icon-cross" title="Delete this version"></a> </span>
		</div>
	</script>

	<script type="text/template" id="color-swatch-template">
		<div class="modal-control customColorSwatch" >
			<span class="colorSwatch colorSwatchTrigger" style="background-color:{color}"></span>
			<input type="text" maxlength="7"  class="colorCode colorSwatchTrigger" spellcheck=false value="{color}"/>
			<input type="number" min="0" max="1"   step=".1" class="colorWeighting" value="{weighting}"/>
			
		</div>
	</script>

	<script type="text/template" id="popup-color-swatch-template">
		<li class="menu-float customColorSwatch">
			<span class="colorSwatch {darkOrLight}" style="background-color: {color};" data-customcolor="{color}"></span>
		</li>
	</script>

	<script type="text/template" id="release-note-template">
		<div class="release-note">
			<h1>Version: {version}</h1>
			<h2>Release Date: {releaseDate}</h2>
			<div class="notes">{notes}</div>
		</div>
	</script>



  </body>
</html>