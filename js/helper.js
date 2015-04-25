function hexToRGB(h) {return {r: hexToR(h), g: hexToG(h), b: hexToB(h)};}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {
	var x = 1;
	if (!h) {
		var y = 1;
	}
	return (h.charAt(0)=="#") ? h.substring(1,7) : h;
}

function hexToRGBString(h) {
	if (!h) {
		var y = 1;
	}
	var rgb = hexToRGB(h);
	return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}


function hexToLAB(hexColor) {
	var rgb = hexToRGB(hexColor);
	var xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
	var lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
	return lab;
};

function RGBToLAB(rgb) {
	var xyz = rgbToXyz(rgb.red, rgb.green, rgb.blue);
	var lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
	return lab;
};
/*
// Convert HSL to RGB
function hslToRgb(h, s, l){
	var r, g, b;

	if (s == 0){
		r = g = b = l;
	}
	else{
		function hue2rgb(p, q, t){
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
 
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
 
	return [r * 255, g * 255, b * 255].map(Math.round);
};*/

// Convert RGB to XYZ
function rgbToXyz(r, g, b) {
	var _r = (r / 255);
	var _g = (g / 255);
	var _b = (b / 255);
 
	if (_r > 0.04045) {
		_r = Math.pow(((_r + 0.055) / 1.055), 2.4);
	}
	else {
		_r = _r / 12.92;
	}
 
	if (_g > 0.04045) {
		_g = Math.pow(((_g + 0.055) / 1.055), 2.4);
	}
	else {                 
		_g = _g / 12.92;
	}
 
	if (_b > 0.04045) {
		_b = Math.pow(((_b + 0.055) / 1.055), 2.4);
	}
	else {                  
		_b = _b / 12.92;
	}
 
	_r = _r * 100;
	_g = _g * 100;
	_b = _b * 100;
 
	X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
	Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
	Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;
 
	return [X, Y, Z];
};

// Convert XYZ to LAB
function xyzToLab(x, y, z) {
	var ref_X =  95.047;
	var ref_Y = 100.000;
	var ref_Z = 108.883;
 
	var _X = x / ref_X;
	var _Y = y / ref_Y;
	var _Z = z / ref_Z;
 
	if (_X > 0.008856) {
		 _X = Math.pow(_X, (1/3));
	}
	else {                 
		_X = (7.787 * _X) + (16 / 116);
	}
 
	if (_Y > 0.008856) {
		_Y = Math.pow(_Y, (1/3));
	}
	else {
	  _Y = (7.787 * _Y) + (16 / 116);
	}
 
	if (_Z > 0.008856) {
		_Z = Math.pow(_Z, (1/3));
	}
	else { 
		_Z = (7.787 * _Z) + (16 / 116);
	}
 
	var CIE_L = (116 * _Y) - 16;
	var CIE_a = 500 * (_X - _Y);
	var CIE_b = 200 * (_Y - _Z);
 
	return [CIE_L, CIE_a, CIE_b];
};
 
// Finally, use cie1994 to get delta-e using LAB
function cie1994(x, y, isTextiles) {
	var x = {l: x[0], a: x[1], b: x[2]};
	var y = {l: y[0], a: y[1], b: y[2]};
	labx = x;
	laby = y;
	var k2;
	var k1;
	var kl;
	var kh = 1;
	var kc = 1;
	if (isTextiles) {
		k2 = 0.014;
		k1 = 0.048;
		kl = 2;
	}
	else {
		k2 = 0.015;
		k1 = 0.045;
		kl = 1;
	}
 
	var c1 = Math.sqrt(x.a * x.a + x.b * x.b);
	var c2 = Math.sqrt(y.a * y.a + y.b * y.b);
 
	var sh = 1 + k2 * c1;
	var sc = 1 + k1 * c1;
	var sl = 1;
 
	var da = x.a - y.a;
	var db = x.b - y.b;
	var dc = c1 - c2;
 
	var dl = x.l - y.l;
	var dh = Math.sqrt(da * da + db * db - dc * dc);
 
	return Math.sqrt(Math.pow((dl/(kl * sl)),2) + Math.pow((dc/(kc * sc)),2) + Math.pow((dh/(kh * sh)),2));
};




function ColorLuminance(hex, lum) {
	//http://www.sitepoint.com/javascript-generate-lighter-darker-color/
	/*
		ColorLuminance("#69c", 0);		// returns "#6699cc"
		ColorLuminance("6699CC", 0.2);	// "#7ab8f5" - 20% lighter
		ColorLuminance("69C", -0.5);	// "#334d66" - 50% darker
		ColorLuminance("000", 1);		// "#000000" - true black cannot be made lighter!
	*/
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}


/**********************************************************************************************************/
/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

function LightenDarkenColorHex(col, amt) {
  
	var usePound = false;
  
	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}
 
	var num = parseInt(col,16);
 
	var r = (num >> 16);
	var b = ((num >> 8) & 0x00FF);
	var g = (num & 0x0000FF);

	var newColor = LightenDarkenColor (r,g,b, amt);

	return (usePound?"#":"") + String("000000" + (newColor.green | (newColor.blue << 8) | (newColor.red << 16)).toString(16)).slice(-6);
  
}

function LightenDarkenColor(red, green, blue, amt) {
 
	var r = red - amt;
 
	if (r > 255) r = 255;
	else if  (r < 0) r = 0;
 
	var b = blue - amt;
 
	if (b > 255) b = 255;
	else if  (b < 0) b = 0;
 
	var g = green - amt;
 
	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return {'red': r, 'green': g, 'blue': b};
  
}