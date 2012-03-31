/**
 * Accessibility Map for canvas
 * (C)2012 Bradley Momberger 
 * Licensed under the MIT license http://www.opensource.org/licenses/mit-license.php
 * @version 0.3
 * 
 * Notes:
 * This is a work in progress for dynamically creating an image map to sit on top of a canvas, so that UI elements implemented in the canvas can be navigated with keyboards or other assistive devices.
 */

window.A11yMap = function A11yMap(id, canvas) {
	
	var oldMap;
	if((oldMap = $("map#" + id + "Map")).length > 0) {
		return oldMap.data("a11yMap");
	}

	this.mapElement = $("<map></map>")
		.attr("id", id + "Map")
		.attr("name", id + "Map")
		.appendTo(document.body)
		.attr("width", $(canvas).width())
		.attr("height", $(canvas).height())
		.data("a11yMap", this)[0];

	this.imgElement = $("<img></img>")
		.attr("id", id + "Pane")
		.attr("useMap", "#" + id + "Map")
		.attr("width", $(canvas).width())
		.attr("height", $(canvas).height())
		.appendTo(document.body)[0];
	
return this;	
};

A11yMap.Rect = function(map, x1, y1, x2, y2) {
	var rj = $("<area shape='rect'></area>")
				 .attr("coords", $.makeArray(arguments).slice(1,5).join(','))
				 .attr("href", "javascript://")
				 .attr("tabindex", "0")
				 .appendTo(map.mapElement)
				 .data("a11yMapRect", this);
	this.element = rj[0];
	return this;
};

A11yMap.Rect.prototype.move = function(x, y) {
	var coords = this.element.getAttribute("coords").split(",");
	x = (x || 0);
	y = (y || 0);
	$(coords).each(function(i){ coords[i] = +(coords[i]); }); //integer conversion
	coords[0] += x;
	coords[1] += y;
	coords[2] += x;
	coords[3] += y;
	this.element.setAttribute("coords", coords.join(","));
};

A11yMap.prototype.rect = function(x1, x2, y1, y2) {
	if(arguments.length < 4) throw "ERROR: rect requires four arguments";
	return new A11yMap.Rect(this, x1, x2, y1, y2);
};