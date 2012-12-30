/**
 * Accessibility Map for canvas
 * (C)2012 Bradley Momberger 
 * Licensed under the MIT license http://www.opensource.org/licenses/mit-license.php
 * @version 0.5
 * 
 * Notes:
 * This is a work in progress for dynamically creating an image map to sit on top of a canvas, so that UI elements implemented in the canvas can be navigated with keyboards or other assistive devices.
 */

window.A11yMap = function A11yMap(id, canvas) {
	
	var self = this;
	var oldMap;
	if((oldMap = $("map#" + id + "Map")).length > 0) {
		return oldMap.data("a11yMap");
	}

	this.id = id;

	var container = $(document.body);

	this.mapElement = $("<map></map>")
		.attr("id", id + "Map")
		.attr("name", id + "Map")
		.attr("role", "application")
		.appendTo(container)
	    .css("position", "absolute")
	    .css({"display": "block",
			  "width": ($(canvas).width() || 0) + "px",
			  "height": ($(canvas).height() || 0) + "px",
			  "left": "0px",
			  "top": "0px"})
		.attr("width", $(canvas).width())
		.attr("height", $(canvas).height())
		.click(function(ev){
			ev.pageX += ( $(canvas).offset().left - self.imgElement.offsetLeft);
			ev.pageY += ( $(canvas).offset().top - self.imgElement.offsetTop);
			$(canvas).trigger(ev); 
		})
		.data("a11yMap", this)[0];

	this.imgElement = $("<img></img>")
		.attr("id", id + "Pane")
		.attr("useMap", "#" + id + "Map")
		.attr("width", $(canvas).width())
		.attr("height", $(canvas).height())
		.attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=") //transparent 1x1
		//.css({"position" : canvas ? "absolute" : "static",
		//	  "top" : canvas ? $(canvas).offset().top + "px" : "0px",
	//		  "left" : canvas ? $(canvas).offset().left + "px" : "0px" })
		.appendTo(container)[0];

		$(canvas).html("<div id='" + id + "Notifer' class='readout' aria-live='rude'></div>")
		this.getCanvas = function() { return canvas; };

	return this;	
};

A11yMap.prototype.notifySR = function(text) {
	$("#" + this.id + "Notifer").text(text);
}

A11yMap.Area = function(map) {
	this.map = map;
	return this;
}

A11yMap.Area.prototype.focus = function() {
	$(this.element).focus();
}

A11yMap.Rect = function(map, x1, y1, x2, y2, text) {
    //if(x1 > x2) swap the Xs
//    this.constructor.constructor
	A11yMap.Area.apply(this, arguments);

	var rj = $("<area shape='rect'></area>")
				 .attr("coords", $.makeArray(arguments).slice(1,5).join(','))
				 .attr("href", "javascript://")
				 .attr("aria-labelledby", "#" + map.id + "Notifier")
				 .attr("tabindex", "0")
				 .css("display", "block")
	             .css("position", "absolute")
				 .css("left", Math.min(x1, x2) + "px")
				 .css("top", Math.min(y1, y2) + "px")
				 .css("height", Math.abs(y1 - y2) + "px")
				 .css("width", Math.abs(x1 - x2) + "px")
				 .appendTo(map.mapElement)
				 .keydown(function(ev){
					 if(ev.target.tagName.toLowerCase() === "area" 
						&& ev.keyCode === 13) {
						 var nev = new $.Event("click");
						 nev.pageX = map.imgElement.offsetLeft + (x1 + x2) / 2;
						 nev.pageY = map.imgElement.offsetTop + (y1 + y2) / 2;
						 $(ev.target).trigger(nev);
					 }
				 })
				 .focus(function(){
				 	$(map.getCanvas).find(".readout").text(text);
				 })
				 .mouseover(function(){
				 	$(this).trigger("focus");
				 })
				 .data("a11yMapRect", this);
	this.element = rj[0];
	this.constructor.constructor = A11yMap.Area
	this.__proto__.__proto__ = A11yMap.Area.prototype;
	return this;
};

A11yMap.Rect.prototype.move = function(x, y) {
	var coords = this.element.getAttribute("coords").split(",");
	$(coords).each(function(i){ coords[i] = +(coords[i]); }); //integer conversion
	var minx = Math.min(coords[0], coords[2]);
	var miny = Math.min(coords[1], coords[3]);
	var maxx = Math.max(coords[0], coords[2]);
	var maxy = Math.max(coords[1], coords[3]);
	x = (x || 0);
	if(x < -minx) x = -minx;
	if(x + maxx >= +($(this.map.imgElement).width())) x = +($(this.map.imgElement).width())- maxx - 1;
	y = (y || 0);
	if(y < -miny) y = -miny;
	if(y + maxy >= +($(this.map.imgElement).height())) y = +($(this.map.imgElement).height())- maxy - 1;
	
	coords[0] += x;
	coords[1] += y;
	coords[2] += x;
	coords[3] += y;
	this.element.setAttribute("coords", coords.join(","));
};

A11yMap.Rect.prototype.setX = function(x) {
	this.move(x - this.element.getAttribute("coords").split(",")[0], 0);
}

A11yMap.Rect.prototype.setY = function(x) {
	this.move(0, y - this.element.getAttribute("coords").split(",")[1]);
}

A11yMap.Rect.prototype.resize = function(w, h) {
	var coords = this.element.getAttribute("coords").split(",");
	w = (w || 0);
	h = (h || 0);
	$(coords).each(function(i){ coords[i] = +(coords[i]); }); //integer conversion
	if(w < -coords[2]) w = -coords[2];
	if(w + coords[2] >= +($(this.map.imgElement).width())) w = +($(this.map.imgElement).width())- coords[2] - 1;
	if(h < -coords[3]) h = -coords[3];
	if(h + coords[3] >= +($(this.map.imgElement).height())) h = +($(this.map.imgElement).height())- coords[3] - 1;
	
	coords[2] += w;
	coords[3] += h;
	this.element.setAttribute("coords", coords.join(","));	
};

A11yMap.Rect.prototype.remove = function() {
	$(this.element).remove();
	delete this;
};

A11yMap.prototype.rect = function(x1, x2, y1, y2, text) {
	if(arguments.length < 4) throw "ERROR: rect requires four arguments";
	return new A11yMap.Rect(this, x1, x2, y1, y2, text);
};

A11yMap.Circ = function(map, x1, y1, r, text) {
	A11yMap.Area.apply(this, arguments);

	var cj = $("<area shape='circ'></area>")
				 .attr("coords", $.makeArray(arguments).slice(1,4).join(','))
				 .attr("href", "javascript://")
				 .attr("aria-labelledby", "#" + map.id + "Notifier")
				 .attr("tabindex", "0")
				 .css("display", "block")
	             .css("position", "absolute")
				 .css("left", (x1 - r) + "px")
				 .css("top", (y1 - r) + "px")
				 .css("height", (r * 2) + "px")
				 .css("width", (r * 2) + "px")
				 .appendTo(map.mapElement)
				 .keydown(function(ev){
					 if(ev.target.tagName.toLowerCase() === "area" 
						&& ev.keyCode === 13) {
						 var nev = new $.Event("click");
						 nev.pageX = map.imgElement.offsetLeft + r;
						 nev.pageY = map.imgElement.offsetTop + r;
						 $(ev.target).trigger(nev);
					 }
				 })
				 .focus(function(){
				 	$(map.getCanvas).find(".readout").text(text);
				 })
				 .mouseover(function(){
				 	$(this).trigger("focus");
				 })
				 .data("a11yMapCirc", this);
	this.element = cj[0];
	//this.__proto__ = new A11yMap.Area(map);
	return this;
	this.constructor.constructor = A11yMap.Area
	this.__proto__.__proto__ = A11yMap.Area.prototype;
};

A11yMap.prototype.circ = function(x1, y1, r, text) {
	if(arguments.length < 3) throw "ERROR: circ requires three arguments";
	return new A11yMap.Circ(this, x1, y1, r, text);
};