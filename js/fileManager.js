function fileMngr() {
	this.uploadPath = "/FileHandler.ashx";
	this.getPath = "/GetProjects.ashx";
	this.getVersionPath = "/GetVersion.ashx";
	this.deletePath = "/DeleteVersion.ashx";
	this.archivePath = "/ArchiveProject.ashx";
	this.favoritePath = "/FavsVersion.ashx";
	this.emailPath = "/SendEmail.ashx";

	this.demoImage = "/images/Costa Rican Frog.jpg";
	this.projectListTemplate = $('#project-list-template').text();
	this.versionListTemplate = $('#version-list-template').text();
	this.libraryContainer = $('#library-container');
	this.activeProject = false;
	this.projects = [];

	this.getProjects = function() {
		var fm = this;
		$.ajax({
			type: "POST",
			url: fm.getPath,
			contentType: false,
			processData: false,
			data: null,
			success: function (result) {
				fm.processProjectData(result)
			},
			error: function (e) {
			  fm.raiseEvent("projectsLoadError", "Projects Loaded Error");
			}
		});		
	}

	this.processProjectData = function(data) {
		var fm = this;
		this.projects = $.parseJSON( data );
		$.each(this.projects, function( key, value ) {
			var thisProject = this;
			fm.addVersionsToProject(thisProject, thisProject.Versions);
		});
		this.raiseEvent("projectsLoaded", "Projects Loaded");
	}


	this.sendBugReport = function(bugReport) {
		var fm = this;

		var data = new FormData();
		data.append("label", bugReport.bugLabel);
		data.append("message", bugReport.bugSummary);

		showModalWaitMessage();

		$.ajax({
			type: "POST",
			url: fm.emailPath,
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {
				infoMessage('Email Sent', 'Thank you for the feedback.  Your email has been sent.');
			},
			error: function () {
			  errorMessage("There was error uploading files!");
			}
		});		
	}


	this.addVersionsToProject = function(thisProject, versions) {
		var fm = this;
		thisProject.Versions = [];
		if (versions) {thisProject.Versions = versions;}
		thisProject.isMultiple = (thisProject.Versions.length > 1) ? 'multiple' : '';
		thisProject.HTML = fm.applyTemplate(thisProject, fm.projectListTemplate);
		thisProject.VersionList = '';
		$.each(thisProject.Versions, function(key2, value2 ) {
			var thisVersion = this;
			thisVersion.ProjectID = thisProject.ProjectID;
			thisVersion.VersionID = key2;
			thisVersion.favoriteFlag = thisVersion.isFavorite ? 'favorite' : '';
			thisVersion.HTML = fm.applyTemplate(this, fm.versionListTemplate);
			thisProject.VersionList += thisVersion.HTML ;
		})
	}


	this.uploadImage = function(projectInfo) {
		var fm = this;
		var srcImg = false;
		var srcImgName = 'polyImage';
		if (uploadedImage) {
			srcImg = uploadedImage;
			srcImgName = uploadedImage.name;
			if (!srcImgName) {srcImgName = 'defaultImage.png';}
		} 
		var data = new FormData();
		data.append("projectID", projectInfo.projectID);
		data.append("projectName", projectInfo.projectName);
		data.append("versionName", projectInfo.versionName);
		data.append("versionSummary", projectInfo.versionSummary);
		data.append("projectJSON", mainController.getVertexJSON());
		if(srcImg) {data.append(srcImgName, srcImg);}

		showModalWaitMessage();

		$.ajax({
			type: "POST",
			url: fm.uploadPath,
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {
				var data = $.parseJSON( result );
				if (data.ProjectID) {
					fm.getVersionForProject(data);
					mainController.projectData = data;
					setPath(data.ProjectID, data.Versions[data.Versions.length - 1].Date)
				}
				showModal('#projectSaveSuccess', 5000);
			},
			error: function () {
			  errorMessage("There was error uploading files!");
			}
		});		
	}

	this.deleteVersion = function(projectID, versionID) {
		var fm = this;

		var data = new FormData();
		data.append("projectID", projectID);
		data.append("versionID", versionID);

		showModalWaitMessage();

		$.ajax({
			type: "POST",
			url: fm.deletePath,
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {
				var data = $.parseJSON( result );
				var thisProject = fm.getProject(projectID);
				fm.addVersionsToProject(thisProject, data.Versions);


				showModal('#versionDeleteSuccess', 1000);
				fm.raiseEvent("versionsUpdated", "Versions Updated");

			},
			error: function () {
			  errorMessage("There was error deleting version!");
			}
		});		
	}


	this.archiveProject = function(projectID) {
		var fm = this;

		var data = new FormData();
		data.append("projectID", projectID);

		showModalWaitMessage();

		$.ajax({
			type: "POST",
			url: fm.archivePath,
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {
				fm.processProjectData(result)


				showModal('#projectArchiveSuccess', 1000);
				//fm.raiseEvent("versionsUpdated", "Versions Updated");
			},
			error: function () {
			  errorMessage("There was error archiving the project!");
			}
		});		
	}

	this.favoriteVersion = function(projectID, versionID) {
		var fm = this;

		var data = new FormData();
		data.append("projectID", projectID);
		data.append("versionID", versionID);

		showModal('#showProcessing');

		$.ajax({
			type: "POST",
			url: fm.favoritePath,
			contentType: false,
			processData: false,
			data: data,
			success: function (result) {
				var data = $.parseJSON( result );
				//var thisProject = fm.getProject(projectID);
				//fm.addVersionsToProject(thisProject, data.Versions);


				//showModal('#projectFavoriteSuccess');
				//fm.raiseEvent("versionsUpdated", "Versions Updated");
				closeModal();
			},
			error: function () {
			  errorMessage("There was error marking version as favorite!");
			}
		});		
	}


	this.getVersionForProject = function(thisProject, versionID, makeActive) {
		var fm = this;
		var selectedVersion = false;
		if (versionID) {
			$.each(thisProject.Versions, function(key2, value2) {
				if (this.Date == versionID) {
					selectedVersion = this;
					return false;
				}
			})
		} else {
			$.each(thisProject.Versions, function(key2, value2) {
				if (this.isFavorite) {
					selectedVersion = this;
					return false;
				}
			})
		}
		if (!selectedVersion) {
			selectedVersion = thisProject.Versions[thisProject.Versions.length - 1];
		}
		thisProject.SelectedVersion = selectedVersion;
		if (!selectedVersion.Vertices) {
			var fm = this;
			$.ajax({
				type: "GET",
				url: selectedVersion.DataPath,
				contentType: false,
				processData: false,
				data: null,
				success: function (result) {
					//var data = $.parseJSON( result );
					if (result.vertices) {
						selectedVersion.showVertices = result.showVertices;
						selectedVersion.useGradient = result.useGradient;
						selectedVersion.showFill = result.showFill;
						selectedVersion.showCircles = result.showCircles;
						selectedVersion.showStroke = result.showStroke;
						selectedVersion.useSolidGradient = (result.useSolidGradient === undefined) ? true : result.useSolidGradient;

						if (result.globalOpacity !== undefined) {selectedVersion.globalOpacity = result.globalOpacity; }
						if (result.strokeWidth !== undefined) {selectedVersion.strokeWidth = result.strokeWidth; }
						if (result.strokeOpacity !== undefined) {selectedVersion.strokeOpacity = result.strokeOpacity; }
						if (result.strokeColor !== undefined) {selectedVersion.strokeColor = result.strokeColor; }
						if (result.syncPointStrokeSizes !== undefined) {selectedVersion.syncPointStrokeSizes = result.syncPointStrokeSizes; }
						if (result.snapSide !== undefined) {selectedVersion.snapSide = result.snapSide; }
						if (result.pointOpacity !== undefined) {selectedVersion.pointOpacity = result.pointOpacity; }
						if (result.pointStrokeOpacity !== undefined) {selectedVersion.pointStrokeOpacity = result.pointStrokeOpacity; }
						if (result.pointStrokeWidth !== undefined) {selectedVersion.pointStrokeWidth = result.pointStrokeWidth; }
						if (result.pointShape !== undefined) {selectedVersion.pointShape = result.pointShape; }
						if (result.pointColor !== undefined) {selectedVersion.pointColor = result.pointColor; }
						if (result.pointStrokeColor !== undefined) {selectedVersion.pointStrokeColor = result.pointStrokeColor; }

						selectedVersion.Vertices = result.vertices;
						selectedVersion.solidGradients = result.solidGradients;

						thisProject.VertJson = JSON.stringify(result.vertices);
					} else {
						selectedVersion.showVertices = true;
						selectedVersion.useGradient = true;
						selectedVersion.showFill = true;
						selectedVersion.showCircles = false;
						selectedVersion.showStroke = false;
						selectedVersion.useSolidGradient = true;

						selectedVersion.Vertices = result;
						selectedVersion.solidGradients = false;
						thisProject.VertJson = JSON.stringify(result);
					}
					if (makeActive) {
						thisProject.activeVersion = selectedVersion;
						fm.setActiveProject(thisProject);
					}
				},
				error: function (e) {
				  fm.raiseEvent("projectsLoadError", "Projects Loaded Error");
				}
			});	
		} else {
			if ($.isArray(selectedVersion.Vertices)) {
				thisProject.VertJson = JSON.stringify(selectedVersion.Vertices);
			} else {
				thisProject.VertJson = selectedVersion.Vertices;
			}
			if (makeActive) {
				thisProject.activeVersion = selectedVersion;
				fm.setActiveProject(thisProject);
			}
		}
		
	}


	this.getProject = function(projectID, versionID, makeActive) {
		var fm = this;
		var selectedProject = false;
		$.each(this.projects, function( key, value ) {
			var thisProject = this;
			if (thisProject.ProjectID == projectID) {
				selectedProject = thisProject;
				fm.getVersionForProject(thisProject, versionID, makeActive);
				return false;
			}
		});
		return selectedProject;
	}

	this.setActiveProject = function(thisProject) {
		this.activeProject = thisProject;
		this.raiseEvent("activeProjectLoaded", thisProject.ProjectID);

	}

	this.savePNG = function(imageData) {
		this.saveData(imageData);
	}


	this.saveSVG = function(imageData) {
		this.saveData("data:image/svg+xml;base64,\n" + imageData);
	}


	this.saveData = function(imageData) {
		if (imageData) {
			var a = document.createElement('a');
			$(a).attr("href", imageData);
			$(a).attr("download", imageData);
			a.target="_blank";
			a.click();
			a.remove();
		}
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

	this.applyTemplate = function(myObject, template) {
		var results = template;
		for(var propertyName in myObject) {
			var regex = new RegExp('{' + propertyName + '}', 'g');

			results = results.replace(regex, myObject[propertyName]);
		}
		return results;
	}
}



