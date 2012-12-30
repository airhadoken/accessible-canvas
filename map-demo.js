(function(){
	
	//map-demo.js
	//setup script for demo page
	var RECT_WIDTH = 50;
	var RECT_HEIGHT = 50;
	var BG_STYLE =  "rgb(127, 127, 127)"; //mmm, tasty 50% gray


	var map = new A11yMap("test", $("#testcanvas")[0]);
	var rect1 = map.rect(200, 200, 250, 250, "This is the yellow button");
	var rect2 = map.rect(300, 200, 350, 250, "This is NOT the yellow button");
	var slider = map.rect(445, 90, 465, 110, "Slider. Down to decrease, up to increase");


	var context = $("#testcanvas")[0].getContext("2d");
	context.fillStyle= BG_STYLE;
	context.fillRect(0, 0, 600, 400);

	context.fillStyle = "yellow";
	context.fillRect(200, 200, RECT_WIDTH, RECT_HEIGHT);

	function drawSlider(pctX) {
		var sliderWidth = 100;
		var sliderKnobWidth = 20;
		//clear out area
		context.fillStyle = BG_STYLE;
		context.fillRect(400 - sliderKnobWidth / 2, 100 - sliderKnobWidth / 2, 100 + sliderKnobWidth, sliderKnobWidth)
		context.strokeStyle = BG_STYLE;
		context.strokeRect(400 - sliderKnobWidth / 2, 100 - sliderKnobWidth / 2, 100 + sliderKnobWidth, sliderKnobWidth)

		//make a slider
		context.fillStyle = "rgb(192, 192, 192)";
		context.fillRect(400, 100, sliderWidth, 5);
		//slider knob
		context.fillStyle = "rgb(255, 255, 255)";
		context.strokeStyle = "rgb(0, 0, 0)";
		context.fillRect(400 + sliderWidth * pctX / 100 - sliderKnobWidth / 2, 90, sliderKnobWidth, sliderKnobWidth);
		context.strokeRect(400 + sliderWidth * pctX / 100 - sliderKnobWidth / 2, 90, sliderKnobWidth, sliderKnobWidth);
	}
	var sliderPct = 50;
	drawSlider(sliderPct);

	var $readout = $("<div aria-live='rude'></div>").appendTo(document.body);

	$("#testcanvas").click(function(ev) {
		var offset = $(this).offset(); 
	  if(ev.pageX - offset.left >= 200 
	     && ev.pageX - offset.left <= 250
	     && ev.pageY - offset.top >= 200
	     && ev.pageY - offset.top <= 250) {
		  
			$readout.text("click on yellow button registered");
		}
	});
	$("#testMap").find("area")

	$(rect1.element).bind("keydown.right", function() {
		$(rect2.element).focus();
	});
	$(rect2.element).bind("keydown.left", function() {
		$(rect1.element).focus();
	});
	$(slider.element).bind("keydown.up", function() {
		sliderPct ++;
		drawSlider(sliderPct);
		slider.move(1, 0);
		map.notifySR(sliderPct + " percent");
	});
	$(slider.element).bind("keydown.down", function() {
		sliderPct --;
		drawSlider(sliderPct);
		slider.move(-1, 0);
		map.notifySR(sliderPct + " percent");
	});
})();