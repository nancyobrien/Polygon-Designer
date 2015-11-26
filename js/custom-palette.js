function CustomPalette() {
	this.matchColors = true;
	this.customColors = [];

	this.colors = [ 
		{'color': '#FFFFFF', 'weighting': .5}, 
		{'color': '#50FF03', 'weighting': .1}, 
		{'color': '#E8A40C', 'weighting': .1}, 
		{'color': '#FF0000', 'weighting': .1}, 
		{'color': '#300CE8', 'weighting': .1}, 
		{'color': '#0DFFD1', 'weighting': .1}
	];


	this.binColors = function() {
		var startBin = 0;
		for (var col in this.colors) {
			var thisColor = this.colors[col];
			var pct = thisColor.weighting;
			thisColor.startBin = startBin;
			thisColor.endBin = startBin + pct;
			startBin = thisColor.endBin;
		}
	}

	this.setPalette = function(colorArr) {
		this.colors = colorArr;
		this.binColors();
	}
	
	this.init = function() {
		this.binColors();
	}

	this.resetRandomColors = function() {
		this.customColors = [];
	}

	this.getRandomColor = function() {
		var rand = Math.random();
		for (var col in this.colors) {
			var thisColor = this.colors[col];
			if (rand >= thisColor.startBin && rand < thisColor.endBin) {
				return thisColor.color;
			}
		}
		return '#000000';
	}

	this.setCustomColor = function(x, y, customColor) {
		var currentColor = false;
		for (var i = 0; i < this.customColors.length; i++) {
			if (this.customColors[i].x === x && this.customColors[i].y === y) {
				currentColor = this.customColors[i];
			}
		}
		if (currentColor) {
			currentColor.color = customColor;
		} else {
			this.customColors.push({'x': x, 'y': y, 'color': customColor});			
		}
	}

	this.getCustomColor = function(x,y) {
		var customColor = false;
		for (var i = 0; i < this.customColors.length; i++) {
			if ((this.customColors[i].x == x) && (this.customColors[i].y == y)) {
				customColor = this.customColors[i].color;
				break;
			}
		}
		if (!customColor) {
			customColor = this.getRandomColor();
			this.setCustomColor(x, y, customColor);
		}
		return customColor;
	}

	this.getColorJSON = function() {
		return JSON.stringify(this.customColors);
	}

	this.setColors = function(colorArray) {
		this.customColors = colorArray;
	}

	this.getMatchColor = function(compColor) {
		var compLAB = RGBToLAB(compColor)
		var matchColor = false;
		var matchScore = 999999999999;
		for (var i = 0; i < this.colors.length; i++) {
			var thisColor = this.colors[i];
			if (!thisColor.lab) {
				thisColor.lab = hexToLAB(thisColor.color);
			}
			var diff = cie1994(compLAB, thisColor.lab, true);
			if (diff < matchScore) {
				matchScore = diff;
				matchColor = thisColor.color;
			}
		}
		return matchColor;
	}

	this.init();
}