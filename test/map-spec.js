describe("map spec", 
function(){
	
	var puppiesmap, kittiesmap;
	var rect;
	beforeEach(function() {
		if(!puppiesmap)
			puppiesmap = new A11yMap("puppies");
		
		if(!kittiesmap) {
			var canvas = $("<canvas width='600' height='400'></canvas>")
							 .appendTo(document.body);
			kittiesmap = new A11yMap("kitties", canvas);
		}
	});
	
	describe("class A11yMap", function(){
	
		describe("constructor", function(){
			it("creates a map and image when instantiated", function(){
				expect($("map#puppiesMap")).toExist();
				expect($("img#puppiesPane")).toExist();
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
		});
				 
		describe("#rect", function(){
			it("has a prototype function #rect", function(){
				expect(typeof kittiesmap.rect).toBe("function");
			});
			beforeEach(function() {
				rect = kittiesmap.rect(1, 2, 3, 4);//x1, y1, x2, y2
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
});