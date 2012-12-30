describe("map spec", 
function(){
	
	var puppiesmap, kittiesmap;
	var rect, circ;
	var $canvas; //for kittiesMap
	beforeEach(function() {
		if(!puppiesmap)
			puppiesmap = new A11yMap("puppies");
		
		if(!kittiesmap) {
			$canvas = $("<canvas width='600' height='400'></canvas>")
							 .appendTo(document.body);
			kittiesmap = new A11yMap("kitties", $canvas);
		}
	});
	
	describe("class A11yMap", function(){
	
		describe("constructor", function(){
			it("creates a map and image when instantiated", function(){
				expect($("map#puppiesMap")).toExist();
				expect($("img#puppiesPane")).toExist();
			});

			it("adds appropriate properties to each map and image", function() {
				expect(puppiesmap.mapElement.id).toBe("puppiesMap");
				expect(puppiesmap.imgElement.id).toBe("puppiesPane");
				expect($(puppiesmap.mapElement)).toHaveAttr("name", "puppiesMap");
				expect($(puppiesmap.imgElement)).toHaveAttr("usemap", "#puppiesMap");
			});
					 
			it("adds necessary CSS to each map", function() {
				expect($(kittiesmap.mapElement)).toHaveCss("height", "400px");
				expect($(kittiesmap.mapElement)).toHaveCss("width", "600px");
			});

			it("returns the existing map for an id when one exists", function(){
				expect(new A11yMap("puppies")).toBe(puppiesmap); 
			});

			it("shapes the map and pane to the size of the passed in canvas", function(){
				expect($("#kittiesMap")).toHaveAttr("height", 400);
				expect($("#kittiesMap")).toHaveAttr("width", 600);

				expect($("#kittiesPane")).toHaveAttr("height", 400);
				expect($("#kittiesPane")).toHaveAttr("width", 600);
			
			});
					 
			it("creates event trigger pass-throughs to the canvas", function(){
				var called = null;
				$canvas.click(function(ev) { 
					called = ev; 
				});
				var ck = new $.Event("click");
				   ck.pageX = kittiesmap.imgElement.offsetLeft + 100;
				   ck.pageY = kittiesmap.imgElement.offsetTop + 100;
				$(kittiesmap.mapElement).trigger(ck);
				expect(called).toBeTruthy();
				//expect(called.offsetx).toBe(100);
				//expect(called.offsety).toBe(100);
				expect(called.pageX).toBe(100 + $canvas.offset().left);
				expect(called.pageY).toBe(100 + $canvas.offset().top);
			});

			it("puts the map into application mode", function() {
				expect($("#kittiesMap")).toHaveAttr("role", "application");
			});
		});
				 
		describe("#rect", function(){
			it("has a prototype function #rect", function(){
				expect(typeof kittiesmap.rect).toBe("function");
			});
			beforeEach(function() {
				rect = kittiesmap.rect(1, 2, 3, 4, "foo");//x1, y1, x2, y2
			});
			afterEach(function(){
				$(rect.element).remove();
			});
			it("returns a Rect object", function() {
				expect(rect.constructor).toBe(A11yMap.Rect);
			});
			it("creates a rect object in the map when the rect is instantiated",
			   function(){
			   expect($("#puppiesMap area[shape=rect]")).not.toExist();   
			   expect($("#kittiesMap area[shape=rect]")).toExist();   
			});
			it("sets the area coordinates when passed in", function() {
				expect($("#kittiesMap area:first")).toHaveAttr("coords", "1,2,3,4");
			});
			it("sets the CSS of the area to match its coordinates", function() {
				//expect($("#kittiesMap area:first")).toHaveCss("display", "block"); //always reports as inline
				expect($("#kittiesMap area:first")).toHaveCss("top", "2px");
				expect($("#kittiesMap area:first")).toHaveCss("left", "1px");
				expect($("#kittiesMap area:first")).toHaveCss("width", "2px");
				expect($("#kittiesMap area:first")).toHaveCss("height", "2px");
			});
			it("sets the text on focus to the specified text", function() {
				$("#kittiesMap area:first").focus();
				expect($canvas.find("[aria-live]")).toHaveText("foo");
			});
		});

		describe("#circ", function(){
			it("has a prototype function #circ", function(){
				expect(typeof kittiesmap.circ).toBe("function");
			});
			beforeEach(function() {
				circ = kittiesmap.circ(3, 2, 1, "bar");//x1, y1, r
			});
			afterEach(function(){
				$(circ.element).remove();
			});
			it("returns a Circ object", function() {
				expect(circ.constructor).toBe(A11yMap.Circ);
			});
			it("creates a circ object in the map when the circ is instantiated",
			   function(){
			   expect($("#puppiesMap area[shape=circ]")).not.toExist();   
			   expect($("#kittiesMap area[shape=circ]")).toExist();   
			});
			it("sets the area coordinates when passed in", function() {
				expect($("#kittiesMap area:first")).toHaveAttr("coords", "3,2,1");
			});
			it("sets the CSS of the area to match its coordinates", function() {
				//expect($("#kittiesMap area:first")).toHaveCss("display", "block"); //always reports as inline
				expect($("#kittiesMap area:first")).toHaveCss("top", "1px");
				expect($("#kittiesMap area:first")).toHaveCss("left", "2px");
				expect($("#kittiesMap area:first")).toHaveCss("width", "2px"); //2x radius
				expect($("#kittiesMap area:first")).toHaveCss("height", "2px");
			});
			it("sets the text on focus to the specified text", function() {
				$("#kittiesMap area:first").focus();
				expect($canvas.find("[aria-live]")).toHaveText("bar");
			});
		});
	});
	
	describe("class A11yMap.Rect", function(){
		beforeEach(function() {
			rect = kittiesmap.rect(1, 2, 3, 4);//x1, y1, x2, y2
		});
		afterEach(function(){
			$(rect.element).remove();
		});
		describe("constructor", function() {
			it("is covered by A11yMap.prototype.rect tests");
		});
		describe("#move", function() {
			it("has a prototype function move", function(){
				expect(typeof window.A11yMap.Rect.prototype.move).toBe("function");
			});
					 
			it("moves the rect right and down with positive values", function() {
				   rect.move(3, 3);
				   expect($(rect.element)).toHaveAttr("coords", "4,5,6,7");
			});
			
			it("moves the rect left and up with negative values", function(){
				rect.move(-1, -1);
				   expect($(rect.element)).toHaveAttr("coords", "0,1,2,3");
			});
					 
		    it("does not move past the top or left border", function() {
				rect.move(-100, 0);
				expect($(rect.element)).toHaveAttr("coords", "0,2,2,4");
				rect.move(0, -100);
				expect($(rect.element)).toHaveAttr("coords", "0,0,2,2");
			});
					 
			it("does not move past the right or bottom border", function() {
				rect.move(1000, 0);
				expect($(rect.element)).toHaveAttr("coords", "597,2,599,4");
				rect.move(0, 1000);
				expect($(rect.element)).toHaveAttr("coords", "597,397,599,399");
			});
		});
		describe("#resize", function(){
			it("has a prototype function resize", function(){
			   expect(typeof A11yMap.Rect.prototype.resize).toBe("function");
			});	 
					 
			it("increases rect size with positive inputs", function(){
				rect.resize(1, 0);
				expect($(rect.element)).toHaveAttr("coords", "1,2,4,4");	
				rect.resize(0, 1);
				expect($(rect.element)).toHaveAttr("coords", "1,2,4,5");
			});
					 
			it("decreases rect size with negative inputs", function(){
				rect.resize(-1, 0);
				expect($(rect.element)).toHaveAttr("coords", "1,2,2,4");
				rect.resize(0, -1);
				expect($(rect.element)).toHaveAttr("coords", "1,2,2,3");
			});
					 
			it("does not resize past the top or left border", function() {
				rect.resize(-100, 0);
				expect($(rect.element)).toHaveAttr("coords", "1,2,0,4");
				rect.resize(0, -100);
				expect($(rect.element)).toHaveAttr("coords", "1,2,0,0");
			});
			it("does not resize past the bottom or right border", function() {
				rect.resize(1000, 0);
				expect($(rect.element)).toHaveAttr("coords", "1,2,599,4");
				rect.resize(0, 1000);
				expect($(rect.element)).toHaveAttr("coords", "1,2,599,399");
			});

		});
				 
		describe("#remove", function() {
			it("is a prototype function of Rect", function() {
				expect(typeof A11yMap.Rect.prototype.remove).toBe("function");
			});
			it("removes the area from the image map", function() {
				rect.remove();
				expect($("area", kittiesmap)).not.toExist();
			});
		});
	});
	describe("class A11yMap.Circ", function(){
		beforeEach(function() {
			circ = kittiesmap.circ(3, 2, 1);//x1, y1, x2, y2
		});
		afterEach(function(){
			$(circ.element).remove();
		});
		describe("constructor", function() {
			it("is covered by A11yMap.prototype.circ tests");
		});
		describe("#move", function() {
			it("has a prototype function move", function(){
				expect(typeof window.A11yMap.Circ.prototype.move).toBe("function");
			});
					 
			it("moves the circ right and down with positive values", function() {
				   circ.move(3, 3);
				   expect($(circ.element)).toHaveAttr("coords", "6,5,1");
			});
			
			it("moves the circ left and up with negative values", function(){
				circ.move(-1, -1);
				   expect($(circ.element)).toHaveAttr("coords", "2,1,1");
			});
					 
		    it("does not move past the top or left border", function() {
				circ.move(-100, 0);
				expect($(circ.element)).toHaveAttr("coords", "1,2,1"); //center-x/y never is less than the radius
				circ.move(2, -100);
				expect($(circ.element)).toHaveAttr("coords", "3,1,1");
			});
					 
			it("does not move past the right border", function() {
				circ.move(1000, 0);
				expect($(circ.element)).toHaveAttr("coords", "598,2,1");
			});
			it("does not move past the bottom border", function() {
				circ.move(0, 1000);
				expect($(circ.element)).toHaveAttr("coords", "3,398,1");
			});
		});
		describe("#resize", function(){
			it("has a prototype function resize", function(){
			   expect(typeof A11yMap.Circ.prototype.resize).toBe("function");
			});	 
					 
			it("increases circ size with positive inputs", function(){
				circ.resize(1);
				expect($(circ.element)).toHaveAttr("coords", "3,2,2");	
			});
					 
			it("decreases circ size with negative inputs", function(){
				circ.resize(-1);
				expect($(circ.element)).toHaveAttr("coords", "3,2,0");
			});
					 
			it("does not resize negatively past zero radius", function() {
				circ.resize(-100);
				expect($(circ.element)).toHaveAttr("coords", "3,2,0");
			});
			it("does not resize positively past any border", function() {
				circ.resize(1000, 0);
				expect($(circ.element)).toHaveAttr("coords", "3,2,2");
				circ.resize(0, 1000);
				expect($(circ.element)).toHaveAttr("coords", "3,2,2");
			});

		});
				 
		describe("#remove", function() {
			it("is a prototype function of Circ", function() {
				expect(typeof A11yMap.Circ.prototype.remove).toBe("function");
			});
			it("removes the area from the image map", function() {
				circ.remove();
				expect($("area", kittiesmap)).not.toExist();
			});
		});
	});
});