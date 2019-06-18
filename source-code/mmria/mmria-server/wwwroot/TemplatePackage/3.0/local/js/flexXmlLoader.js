// JavaScript Document
$(document).ready(function() {
	sliderSettings = [{
			xmlPath: "/TemplatePackage/3.0/local/js/flex.xml",
			slideshow: true, //Boolean: Animate slider automatically
			slideshowSpeed: 7000, //Integer: Set the speed of the slideshow cycling, in milliseconds
			animationDuration: 600, //Integer: Set the speed of animations, in milliseconds
			pausePlay: false, //Boolean: Create pause/play dynamic element
			pauseText: 'Pause', //String: Set the text for the "pause" pausePlay item
			playText: 'Play', //String: Set the text for the "play" pausePlay item
			randomize: false, //Boolean: Randomize slide order
			slideToStart: 0, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
			animationLoop: true, //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
			identifier: '.flexslider'
		}];
});