(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.play = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(1,1,1).p("AChAAQAAAXgeAGIkFAAQgdgGAAgXQAAgWAdgGIEFAAQAeAGAAAWg");
	this.shape.setTransform(-0.7283,-0.2565,0.8551,0.8551);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiCAdQgegGAAgXQAAgWAegGIEEAAQAfAGAAAWQAAAXgfAGg");
	this.shape_1.setTransform(-0.7283,-0.2565,0.8551,0.8551);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(1,1,1).p("Ag+g1QAYgaAkgSQAigSAZACQAbACAAAbQAAANg6AhQg4AhAAALQAAAfA7AKQA9AKAAAdQAAAKgIAIQgJAKgOAAQhVAAgngwQgYgeAAgiQAAgZAbgeg");
	this.shape_2.setTransform(-9.4926,-0.2651,0.8551,0.8551);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhABCQgZgeAAgiQAAgZAbgeQAYgaAkgSQAjgSAYACQAbACAAAbQAAANg5AhQg5AhAAALQAAAfA7AKQA9AKAAAdQAAAKgIAIQgJAKgOAAQhUAAgngwg");
	this.shape_3.setTransform(-9.4926,-0.2651,0.8551,0.8551);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FFFFFF").ss(4,1,1).p("ADRAAQAABXg+A9Qg9A9hWAAQhWAAg9g9Qg9g9AAhXQAAhVA9g+QA9g9BWAAQBWAAA9A9QA+A+AABVg");
	this.shape_4.setTransform(-2.1383,0.049,0.9485,0.9485);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#00CC00").s().p("AiTCTQg9g8AAhXQAAhVA9g+QA9g9BWAAQBWAAA+A9QA9A+AABVQAABXg9A8Qg+A+hWAAQhWAAg9g+g");
	this.shape_5.setTransform(-2.1383,0.049,0.9485,0.9485);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#FFFF00").ss(1,1,1).p("AChAAQAAAXgeAGIkFAAQgdgGAAgXQAAgWAdgGIEFAAQAeAGAAAWg");
	this.shape_6.setTransform(-0.7283,-0.9565,0.8551,0.8551);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFF00").s().p("AiCAdQgegGAAgXQAAgWAegGIEEAAQAfAGAAAWQAAAXgfAGg");
	this.shape_7.setTransform(-0.7283,-0.9565,0.8551,0.8551);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#FFFF00").ss(1,1,1).p("Ag+g1QAYgaAkgSQAigSAZACQAbACAAAbQAAANg6AhQg4AhAAALQAAAfA7AKQA9AKAAAdQAAAKgIAIQgJAKgOAAQhVAAgngwQgYgeAAgiQAAgZAbgeg");
	this.shape_8.setTransform(-9.4926,-0.9651,0.8551,0.8551);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFF00").s().p("AhABCQgZgeAAgiQAAgZAbgeQAYgaAkgSQAjgSAYACQAbACAAAbQAAANg5AhQg5AhAAALQAAAfA7AKQA9AKAAAdQAAAKgIAIQgJAKgOAAQhUAAgngwg");
	this.shape_9.setTransform(-9.4926,-0.9651,0.8551,0.8551);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AijCkQhEhEAAhgQAAhfBEhEQBEhDBfAAQBgAABDBDQBFBEAABfQAABghFBEQhDBDhgAAQhfAAhEhDg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5,p:{y:0.049}},{t:this.shape_4,p:{y:0.049}},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_5,p:{y:-0.651}},{t:this.shape_4,p:{y:-0.651}},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_10}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.9,-23.1,47.099999999999994,46.2);


(lib.滑入 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AAlA2Ig1gsQhag7AAgNQAAg/BqBWQAlAeAlAkQAhAiAAAGQAAAHgFAHQgHAJgMAAQgDAAgrgkg");
	this.shape.setTransform(7.3116,7.3773,1.1507,1.1507);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("Ah6BmIgDgOQAAgGACgGQAHgXAfgjQAkgpAxgmQA0goAjgKQAJgDAIAAQAWgBAAAYQAAAJgWATQgOALgXAQIhJAyIgqA4IgEAGQggAogPAAQgRAAgGgOg");
	this.shape_1.setTransform(8.825,8.198);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#663366").s().p("AghDYQgmgHgjgLQgjgKgegSQgLgFgIgHQAaAOAeAJQAjALAmAHQAoABAhgRQALgFAKgHIACgCQAqgcAegwQAZg3ASgyQAQg0gEg4QgGg5giggIgHgGQAVAIAPAPQAiAhAGA5QAEA3gQAzQgTAzgYA4QgXAjgcAZIgVAQQgYARgcAHQgSAFgWAAIgFAAg");
	this.shape_2.setTransform(16.84,11.1036);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#996699").s().p("AAJDdQglgHgjgLQgegIgagOIgKgFQgegRgXgaQgLgOgJgQQgGgLgEgMIgDgLIgBgBIgIggIgDgQIgFgtIAAgBIgBgOIAAgDQAAgVADgWIADgOQALgsAcghIALgMIAMgLIABAAIAIgFQALgHAPgCIAGgBIALAAIAMAAIANAEQAOAFANAIQAUAKAUABQAUAAAUgGIASgFIAXgKIAJgDIAagIIAIgCQAzACAgAaIAHAGQAiAhAGA5QAEA4gQAyQgSA0gZA3QgeAwgqAcIgCABQgKAHgLAFQggARgnAAIgDgBgABfh5QgIAAgJADQgjAKgzAoQgyAmgkApQgfAjgHAXQgCAGAAAGIADAOQAGAOARAAQAPAAAggoIAEgGIAqg4IBJgyQAXgQAOgLQAWgTAAgJQAAgXgUAAIgCAAg");
	this.shape_3.setTransform(9.714,8.8516);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000066").s().p("AgRBIQgLgEgIgJQASAEAKgQQALgPADgVIACgIQAFgQABgSIAAgHQAAgPgKgMIgFgIIABAAIAGACQAMAIAKAMQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPIgCADIgHACIgSAIIgFgCg");
	this.shape_4.setTransform(7.0762,-20.475);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#0066CC").s().p("AgBBJIgEgBQgPgGgKgOIgFgGIgEgIIgDgHQgMgiAMgfIADgIQADgIAFgGIAGgFQAIgHAKgCQAKgDAJAAIAGACQAIAFAHAHIAHAIQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPQgIANgOAAIgGgBg");
	this.shape_5.setTransform(3.5387,-21.8636);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#003333").s().p("AgWBAIgBgBIAHACIAHgBQALgEAFgMIABgCQAFgMgCgOIgBgIIAAgIIgCgGIgBgDIgBgEIgRglIgFgHQgHgNgLgKQAMAEAKAJQALALAIANIAAABIAEAGQAKATAIAQIACAIIACAIIABAIIAAAIQACAOgFALIgCAGQgMABgJAGIgBAAIgGAEQgMgFgLgIg");
	this.shape_6.setTransform(-10.6812,-20.95);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#009933").s().p("AAdBNQgMgEgJgJQgMgMgKgNIgEgHIgFgHIgEgGIgFgHIgGgGQgIgGgHgIQgIgHgCgLQgBgNAFgJIAEgGQAJgLAMgHQALgIAOACQAPAFALAKIACABQAKALAIAMIAEAHIASAkIACAFIABACIABAIIABAIIAAAIQACAOgEALIgBADQgFALgNAEIgGABIgIgCg");
	this.shape_7.setTransform(-16.0019,-22.3784);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#CC0033").s().p("AgWAiQgLgBgKgGIgGgHIAEAAQALABAMgEQAMgEAKgIIAIgEIAIgEQADgCACgFIAFgIIABgHIgCgIIAGABQAGACAEAEIAIASIgBADQgBAFgDADIgFAHIgIAFIgJAEQgKAIgLAEQgJADgJAAIgFAAg");
	this.shape_8.setTransform(-18.6,12.16);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FF0033").s().p("AgSAjIgDgBQgKgBgHgGQgJgHgEgPQgCgDAAgDQgBgEABgEQABgEADgEQAagVAtAFQAHAAAHACQAGACAGAFIAEAFIACAIIgBAHIgFAIQgCAEgDADIgIAEIgJAEQgKAIgLAEQgKAEgKAAIgDAAg");
	this.shape_9.setTransform(-21.3375,10.7131);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#8C3800").s().p("AgFAfIgGgBQgNACgOgCQgNgDgKgIIgHgFIAIACQANADANgDIAGABQAGADAIgBIANAAIAGgBQAOgDAMgJQAHgFADgFQAEgGABgIIAAgHIgFgHIARAGIAHAHIADAGIABALIAAABQgBAFgDAFQgEAGgGAFQgMAJgOADIgHABIgOAAIgEAAQgEAAgFgCg");
	this.shape_10.setTransform(-22.95,1.0625);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FF6600").s().p("AABAqIgFAAQgNACgNgDIgIgCQgJgDgIgFIgGgGQgJgJgDgPIgCgHQgBgSAPgKQARgIASgBIAJAAIARADQAhAMAgAOIAGAGIABABIAEAHIAAAGQAAAIgEAHQgEAFgGAFQgNAJgOADIgGABIgOAAIgDAAQgGAAgFgCg");
	this.shape_11.setTransform(-25.9758,-1.45);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#CCCC00").s().p("AATA8QgJgBgIgEQgRgKgTgJQgRgGgOgLIAIADQATAJASAKQAIAEAIABQAMACAMgDQANgDAIgLQACgEAAgGIgHgVIgDgHIgCgGIgLgNIgMgNQgLgLgNgIIgDgCQALADAIAIIgGgEIAGAFIAHAEQANAIALALIANAMIAKANIACAGIADAHIAHAWQAAAGgCAEQgIALgMADQgHACgHAAIgLgBg");
	this.shape_12.setTransform(-21.75,-12.3182);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFF00").s().p("AAcA9QgJgCgIgDQgRgLgTgJIgIgDQgPgHgNgLQgGgGgDgGQgGgOADgPIACgHIADgGQAIgLAMgGQAMgGANABIAJABQANACAJAJIgFgDIAGAEIADADIAEACQANAIALALIANAMIAKANIACAGIADAHIAHAWQAAAFgCAEQgIALgMAEQgIACgHAAIgKgBg");
	this.shape_13.setTransform(-24.9974,-13.7933);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FF0033").s().p("AABAqIgFAAQgNACgNgDIgIgCQgHgCgFgEIgFgCIgGgGQgJgJgDgPIAAgBIgCgGQgBgSAPgKQARgIASgBIAJAAIARADIAjANIAeANIAGAGIABABIAEAHIAAAAIAAAGQAAAIgEAHQgEAFgGAFQgNAJgOADIgGABIgOAAIgDAAQgGAAgFgCg");
	this.shape_14.setTransform(-25.9758,-1.45);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#CC0033").s().p("AgFAfIgGgBQgNACgOgCQgNgDgKgIIgHgFIAIACQANADANgDIAGABQAGADAIgBIANAAIAGgBQAOgDAMgJQAHgFADgFQAEgGABgIIAAgGIAAgBIgFgHIARAGIACACIAFAFIADAGIABALIAAABQgBAFgDAFQgEAGgGAFQgMAJgOADIgHABIgOAAIgEAAQgEAAgFgCg");
	this.shape_15.setTransform(-22.95,1.0625);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#8C3800").s().p("AATA8QgJgBgIgEIgIgFIgcgOQgRgGgOgLIAIADQATAJASAKQAGADAIACIACAAQAMACAMgDQANgDAIgLQACgEAAgGIgHgVIgDgHIgCgGIgLgNIgMgNIgOgMIgKgHIgDgCQAHACAGAEIAGAFIgGgEIAGAFIAHAEQANAIALALIANAMIAKANIACAGIACAFIABACIAHAWQAAAGgCAEIgGAGQgGAGgIACQgHACgHAAIgLgBg");
	this.shape_16.setTransform(-21.75,-12.3182);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FF6600").s().p("AAcA9IgDgBQgHgBgHgDQgRgLgTgJIgIgDQgPgHgNgLQgGgGgDgGQgGgOADgPIACgHIADgGQAIgLAMgGQAMgGANABIAJABQANACAJAJIgFgDIAGAEIADADIAEACIAJAGIAPANIANAMIAKANIACAGIADAHIAHAWQAAAFgCAEQgIALgMAEQgIACgHAAIgKgBg");
	this.shape_17.setTransform(-24.9974,-13.7933);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#CCCC00").s().p("AgWBAIgBgBIAHACIAHgBQALgEAFgMIABgCQAFgMgCgOIgBgIIAAgIIgCgGIgBgDIgBgEIgRglIgFgHQgHgNgLgKQAMAEAKAJQALALAIANIAAABIAEAGQAKATAIAQIACAIIACAIIABAIIAAAIQACAOgFALIgCAGQgMABgJAGIgBAAIgGAEQgMgFgLgIg");
	this.shape_18.setTransform(-10.6812,-20.95);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FFFF00").s().p("AAdBNQgMgEgJgJIgHgGQgIgJgHgKIgEgHIgFgHIgEgGIgFgHIgGgGQgIgGgHgIQgIgHgCgLIAAgHQAAgIAEgHIAEgGQAJgLAMgHQALgIAOACIAKAFQAJAEAHAGIACABQAKALAIAMIAEAHIASAkIACAFIABACIABAIIABAIIAAAIQACAOgEALIgBADQgFALgNAEIgGABIgIgCg");
	this.shape_19.setTransform(-16.0019,-22.3784);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#003333").s().p("AgRBIQgLgEgIgJQASAEAKgQQALgPADgVIACgIQAFgQABgSIAAgHQAAgPgKgMIgFgIIABAAIAGACQAMAIAKAMQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPIgCADIgHACIgSAIIgFgCg");
	this.shape_20.setTransform(7.0762,-20.475);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#009933").s().p("AgBBJIgEgBQgPgGgKgOIgFgGIgEgIIgDgHQgMgiAMgfIADgIQADgIAFgGIAGgFQAIgHAKgCQAKgDAJAAIAGACQAIAFAHAHIAHAIQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPQgIANgOAAIgGgBg");
	this.shape_21.setTransform(3.5387,-21.8636);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#000066").s().p("AgWAiQgLgBgKgGIgGgHIAEAAQALABAMgEQAMgEAKgIIAIgEIAIgEQADgCACgFIAFgIIABgHIgCgIIAGABQAGACAEAEIAIASIgBADQgBAFgDADIgFAHIgIAFIgJAEQgKAIgLAEQgJADgJAAIgFAAg");
	this.shape_22.setTransform(-18.6,12.16);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#0066CC").s().p("AgSAjIgDgBQgKgBgHgGQgJgHgEgPQgCgDAAgDQgBgEABgEQABgEADgEQAagVAtAFQAHAAAHACQAGACAGAFIAEAFIACAIIgBAHIgFAIQgCAEgDADIgIAEIgJAEQgKAIgLAEQgKAEgKAAIgDAAg");
	this.shape_23.setTransform(-21.3375,10.7131);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#663366").s().p("AAlA2Ig1gsQhag7AAgNQAAg/BqBWQAlAeAlAkQAhAiAAAGQAAAHgFAHQgHAJgMAAQgDAAgrgkg");
	this.shape_24.setTransform(7.3116,7.3773,1.1507,1.1507);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#0066CC").s().p("AABAqIgFAAQgNACgNgDIgIgCQgHgCgFgEIgFgCIgGgGQgJgJgDgPIAAgBIgCgGQgBgSAPgKQARgIASgBIAJAAIARADIAjANIAeANIAGAGIABABIAEAHIAAAAIAAAGQAAAIgEAHQgEAFgGAFQgNAJgOADIgGABIgOAAIgDAAQgGAAgFgCg");
	this.shape_25.setTransform(-25.9758,-1.45);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#000066").s().p("AgFAfIgGgBQgNACgOgCQgNgDgKgIIgHgFIAIACQANADANgDIAGABQAGADAIgBIANAAIAGgBQAOgDAMgJQAHgFADgFQAEgGABgIIAAgGIAAgBIgFgHIARAGIACACIAFAFIADAGIABALIAAABQgBAFgDAFQgEAGgGAFQgMAJgOADIgHABIgOAAIgEAAQgEAAgFgCg");
	this.shape_26.setTransform(-22.95,1.0625);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#CC0033").s().p("AATA8QgJgBgIgEIgIgFIgcgOQgRgGgOgLIAIADQATAJASAKQAGADAIACIACAAQAMACAMgDQANgDAIgLQACgEAAgGIgHgVIgDgHIgCgGIgLgNIgMgNIgOgMIgKgHIgDgCQAHACAGAEIAGAFIgGgEIAGAFIAHAEQANAIALALIANAMIAKANIACAGIACAFIABACIAHAWQAAAGgCAEIgGAGQgGAGgIACQgHACgHAAIgLgBg");
	this.shape_27.setTransform(-21.75,-12.3182);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#FF0033").s().p("AAcA9IgDgBQgHgBgHgDQgRgLgTgJIgIgDQgPgHgNgLQgGgGgDgGQgGgOADgPIACgHIADgGQAIgLAMgGQAMgGANABIAJABQANACAJAJIgFgDIAGAEIADADIAEACIAJAGIAPANIANAMIAKANIACAGIADAHIAHAWQAAAFgCAEQgIALgMAEQgIACgHAAIgKgBg");
	this.shape_28.setTransform(-24.9974,-13.7933);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#8C3800").s().p("AgWBAIgBgBIAHACIAHgBQALgEAFgMIABgCQAFgMgCgOIgBgIIAAgIIgCgGIgBgDIgBgEIgRglIgFgHQgHgNgLgKQAMAEAKAJQALALAIANIAAABIAEAGQAKATAIAQIACAIIACAIIABAIIAAAIQACAOgFALIgCAGQgMABgJAGIgBAAIgGAEQgMgFgLgIg");
	this.shape_29.setTransform(-10.6812,-20.95);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#FF6600").s().p("AAdBNQgMgEgJgJIgHgGQgIgJgHgKIgEgHIgFgHIgEgGIgFgHIgGgGQgIgGgHgIQgIgHgCgLIAAgHQAAgIAEgHIAEgGQAJgLAMgHQALgIAOACIAKAFQAJAEAHAGIACABQAKALAIAMIAEAHIASAkIACAFIABACIABAIIABAIIAAAIQACAOgEALIgBADQgFALgNAEIgGABIgIgCg");
	this.shape_30.setTransform(-16.0019,-22.3784);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#FFFF00").s().p("AgBBJIgEgBQgPgGgKgOIgFgGIgEgIIgDgHQgMgiAMgfIADgIQADgIAFgGIAGgFQAIgHAKgCQAKgDAJAAIAGACQAIAFAHAHIAHAIQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPQgIANgOAAIgGgBg");
	this.shape_31.setTransform(3.5387,-21.8636);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#CCCC00").s().p("AgRBIQgLgEgIgJQASAEAKgQQALgPADgVIACgIQAFgQABgSIAAgHQAAgPgKgMIgFgIIABAAIAGACQAMAIAKAMQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPIgCADIgHACIgSAIIgFgCg");
	this.shape_32.setTransform(7.0762,-20.475);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#663366").s().p("AjNDiQgmgHgjgKQgjgLgegRQgLgGgIgGQAaAOAeAIQAjALAmAHQApABAhgRQALgFAKgHIACgBQAqgcAegwQAZg3ASgzQAQgzgEg4QgGg5gighIgHgGQAVAIAPAPQAhAhAGA5QAEA4gQAzQgSAzgYA3QgWAjgdAZIgVAQQgYARgcAHQgTAFgVAAIgGAAgAFdjhIAOAAIgFABIgJgBg");
	this.shape_33.setTransform(34.0125,10.0786);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#003333").s().p("AgWAiQgLgBgKgGIgGgHIAEAAQALABAMgEQAMgEAKgIIAIgEIAIgEQADgCACgFIAFgIIABgHIgCgIIAGABQAGACAEAEIAIASIgBADQgBAFgDADIgFAHIgIAFIgJAEQgKAIgLAEQgJADgJAAIgFAAg");
	this.shape_34.setTransform(-18.6,12.16);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#009933").s().p("AgSAjIgDgBQgKgBgHgGQgJgHgEgPQgCgDAAgDQgBgEABgEQABgEADgEQAagVAtAFQAHAAAHACQAGACAGAFIAEAFIACAIIgBAHIgFAIQgCAEgDADIgIAEIgJAEQgKAIgLAEQgKAEgKAAIgDAAg");
	this.shape_35.setTransform(-21.3375,10.7131);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#009933").s().p("AABAqIgFAAQgNACgNgDIgIgCQgHgCgFgEIgFgCIgGgGQgJgJgDgPIAAgBIgCgGQgBgSAPgKQARgIASgBIAJAAIARADIAjANIAeANIAGAGIABABIAEAHIAAAAIAAAGQAAAIgEAHQgEAFgGAFQgNAJgOADIgGABIgOAAIgDAAQgGAAgFgCg");
	this.shape_36.setTransform(-25.9758,-1.45);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#003333").s().p("AgFAfIgGgBQgNACgOgCQgNgDgKgIIgHgFIAIACQANADANgDIAGABQAGADAIgBIANAAIAGgBQAOgDAMgJQAHgFADgFQAEgGABgIIAAgGIAAgBIgFgHIARAGIACACIAFAFIADAGIABALIAAABQgBAFgDAFQgEAGgGAFQgMAJgOADIgHABIgOAAIgEAAQgEAAgFgCg");
	this.shape_37.setTransform(-22.95,1.0625);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#000066").s().p("AATA8QgJgBgIgEIgIgFIgcgOQgRgGgOgLIAIADQATAJASAKQAGADAIACIACAAQAMACAMgDQANgDAIgLQACgEAAgGIgHgVIgDgHIgCgGIgLgNIgMgNIgOgMIgKgHIgDgCQAHACAGAEIAGAFIgGgEIAGAFIAHAEQANAIALALIANAMIAKANIACAGIACAFIABACIAHAWQAAAGgCAEIgGAGQgGAGgIACQgHACgHAAIgLgBg");
	this.shape_38.setTransform(-21.75,-12.3182);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#0066CC").s().p("AAcA9IgDgBQgHgBgHgDQgRgLgTgJIgIgDQgPgHgNgLQgGgGgDgGQgGgOADgPIACgHIADgGQAIgLAMgGQAMgGANABIAJABQANACAJAJIgFgDIAGAEIADADIAEACIAJAGIAPANIANAMIAKANIACAGIADAHIAHAWQAAAFgCAEQgIALgMAEQgIACgHAAIgKgBg");
	this.shape_39.setTransform(-24.9974,-13.7933);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#CC0033").s().p("AgWBAIgBgBIAHACIAHgBQALgEAFgMIABgCQAFgMgCgOIgBgIIAAgIIgCgGIgBgDIgBgEIgRglIgFgHQgHgNgLgKQAMAEAKAJQALALAIANIAAABIAEAGQAKATAIAQIACAIIACAIIABAIIAAAIQACAOgFALIgCAGQgMABgJAGIgBAAIgGAEQgMgFgLgIg");
	this.shape_40.setTransform(-10.6812,-20.95);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#FF0033").s().p("AAdBNQgMgEgJgJIgHgGQgIgJgHgKIgEgHIgFgHIgEgGIgFgHIgGgGQgIgGgHgIQgIgHgCgLIAAgHQAAgIAEgHIAEgGQAJgLAMgHQALgIAOACIAKAFQAJAEAHAGIACABQAKALAIAMIAEAHIASAkIACAFIABACIABAIIABAIIAAAIQACAOgEALIgBADQgFALgNAEIgGABIgIgCg");
	this.shape_41.setTransform(-16.0019,-22.3784);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#FF6600").s().p("AgBBJIgEgBQgPgGgKgOIgFgGIgEgIIgDgHQgMgiAMgfIADgIQADgIAFgGIAGgFQAIgHAKgCQAKgDAJAAIAGACQAIAFAHAHIAHAIQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPQgIANgOAAIgGgBg");
	this.shape_42.setTransform(3.5387,-21.8636);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#8C3800").s().p("AgRBIQgLgEgIgJQASAEAKgQQALgPADgVIACgIQAFgQABgSIAAgHQAAgPgKgMIgFgIIABAAIAGACQAMAIAKAMQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPIgCADIgHACIgSAIIgFgCg");
	this.shape_43.setTransform(7.0762,-20.475);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#CCCC00").s().p("AgWAiQgLgBgKgGIgGgHIAEAAQALABAMgEQAMgEAKgIIAIgEIAIgEQADgCACgFIAFgIIABgHIgCgIIAGABQAGACAEAEIAIASIgBADQgBAFgDADIgFAHIgIAFIgJAEQgKAIgLAEQgJADgJAAIgFAAg");
	this.shape_44.setTransform(-18.6,12.16);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#FFFF00").s().p("AgSAjIgDgBQgKgBgHgGQgJgHgEgPQgCgDAAgDQgBgEABgEQABgEADgEQAagVAtAFQAHAAAHACQAGACAGAFIAEAFIACAIIgBAHIgFAIQgCAEgDADIgIAEIgJAEQgKAIgLAEQgKAEgKAAIgDAAg");
	this.shape_45.setTransform(-21.3375,10.7131);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#FFFF00").s().p("AABAqIgFAAQgNACgNgDIgIgCQgHgCgFgEIgFgCIgGgGQgJgJgDgPIAAgBIgCgGQgBgSAPgKQARgIASgBIAJAAIARADIAjANIAeANIAGAGIABABIAEAHIAAAAIAAAGQAAAIgEAHQgEAFgGAFQgNAJgOADIgGABIgOAAIgDAAQgGAAgFgCg");
	this.shape_46.setTransform(-25.9758,-1.45);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#CCCC00").s().p("AgFAfIgGgBQgNACgOgCQgNgDgKgIIgHgFIAIACQANADANgDIAGABQAGADAIgBIANAAIAGgBQAOgDAMgJQAHgFADgFQAEgGABgIIAAgGIAAgBIgFgHIARAGIACACIAFAFIADAGIABALIAAABQgBAFgDAFQgEAGgGAFQgMAJgOADIgHABIgOAAIgEAAQgEAAgFgCg");
	this.shape_47.setTransform(-22.95,1.0625);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#003333").s().p("AATA8QgJgBgIgEIgIgFIgcgOQgRgGgOgLIAIADQATAJASAKQAGADAIACIACAAQAMACAMgDQANgDAIgLQACgEAAgGIgHgVIgDgHIgCgGIgLgNIgMgNIgOgMIgKgHIgDgCQAHACAGAEIAGAFIgGgEIAGAFIAHAEQANAIALALIANAMIAKANIACAGIACAFIABACIAHAWQAAAGgCAEIgGAGQgGAGgIACQgHACgHAAIgLgBg");
	this.shape_48.setTransform(-21.75,-12.3182);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#009933").s().p("AAcA9IgDgBQgHgBgHgDQgRgLgTgJIgIgDQgPgHgNgLQgGgGgDgGQgGgOADgPIACgHIADgGQAIgLAMgGQAMgGANABIAJABQANACAJAJIgFgDIAGAEIADADIAEACIAJAGIAPANIANAMIAKANIACAGIADAHIAHAWQAAAFgCAEQgIALgMAEQgIACgHAAIgKgBg");
	this.shape_49.setTransform(-24.9974,-13.7933);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#000066").s().p("AgWBAIgBgBIAHACIAHgBQALgEAFgMIABgCQAFgMgCgOIgBgIIAAgIIgCgGIgBgDIgBgEIgRglIgFgHQgHgNgLgKQAMAEAKAJQALALAIANIAAABIAEAGQAKATAIAQIACAIIACAIIABAIIAAAIQACAOgFALIgCAGQgMABgJAGIgBAAIgGAEQgMgFgLgIg");
	this.shape_50.setTransform(-10.6812,-20.95);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#0066CC").s().p("AAdBNQgMgEgJgJIgHgGQgIgJgHgKIgEgHIgFgHIgEgGIgFgHIgGgGQgIgGgHgIQgIgHgCgLIAAgHQAAgIAEgHIAEgGQAJgLAMgHQALgIAOACIAKAFQAJAEAHAGIACABQAKALAIAMIAEAHIASAkIACAFIABACIABAIIABAIIAAAIQACAOgEALIgBADQgFALgNAEIgGABIgIgCg");
	this.shape_51.setTransform(-16.0019,-22.3784);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#FF0033").s().p("AgBBJIgEgBQgPgGgKgOIgFgGIgEgIIgDgHQgMgiAMgfIADgIQADgIAFgGIAGgFQAIgHAKgCQAKgDAJAAIAGACQAIAFAHAHIAHAIQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPQgIANgOAAIgGgBg");
	this.shape_52.setTransform(3.5387,-21.8636);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#CC0033").s().p("AgRBIQgLgEgIgJQASAEAKgQQALgPADgVIACgIQAFgQABgSIAAgHQAAgPgKgMIgFgIIABAAIAGACQAMAIAKAMQAKAMgBAPIAAAHQgBARgFARIgCAIQgDAVgLAPIgCADIgHACIgSAIIgFgCg");
	this.shape_53.setTransform(7.0762,-20.475);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#8C3800").s().p("AgWAiQgLgBgKgGIgGgHIAEAAQALABAMgEQAMgEAKgIIAIgEIAIgEQADgCACgFIAFgIIABgHIgCgIIAGABQAGACAEAEIAIASIgBADQgBAFgDADIgFAHIgIAFIgJAEQgKAIgLAEQgJADgJAAIgFAAg");
	this.shape_54.setTransform(-18.6,12.16);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#FF6600").s().p("AgSAjIgDgBQgKgBgHgGQgJgHgEgPQgCgDAAgDQgBgEABgEQABgEADgEQAagVAtAFQAHAAAHACQAGACAGAFIAEAFIACAIIgBAHIgFAIQgCAEgDADIgIAEIgJAEQgKAIgLAEQgKAEgKAAIgDAAg");
	this.shape_55.setTransform(-21.3375,10.7131);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_23},{t:this.shape_22},{t:this.shape_3},{t:this.shape_2},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_1},{t:this.shape}]},4).to({state:[{t:this.shape_35},{t:this.shape_34},{t:this.shape_3},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_1},{t:this.shape_24},{t:this.shape}]},4).to({state:[{t:this.shape_45},{t:this.shape_44},{t:this.shape_3},{t:this.shape_2},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_1},{t:this.shape_24},{t:this.shape}]},5).to({state:[{t:this.shape_55},{t:this.shape_54},{t:this.shape_3},{t:this.shape_2},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_1},{t:this.shape_24},{t:this.shape}]},4).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-33.6,-30.3,104,63);


(lib.亮晶晶 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF00").s().p("AgaAmIkWBjIEDiNIjhi/ID8CZIA0khIgHEmIEWhjIkDCNIDhC+Ij8iZIg0Eig");
	this.shape.setTransform(34.2355,37.3249,1.1234,1.1234);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.亮晶晶, new cjs.Rectangle(0,0,68.5,74.7), null);


(lib.replay_red = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC0000").s().p("AhYBrQgKgKgGgMQgFgJAAgEQAAgNAIgKQALgQAWAAQARAAAPANQAOANAXAAQAjAAARgXQALgPAAgPQAAgPgFgUQgIgcgMAAIgeABQgHAEgNAMIAMAUQAAAPgIAFQgRAKg1AAQgwAAgJgnQgFgTAFgSQAAhuBEBDIAEAEQAIgIAMgHQAhgUAoAEQAtAEAcAgQAiAnAABDQAAArgVAiQgjA3hSAAQg5AAgfgfg");
	this.shape.setTransform(0.075,-0.0833);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AhxCGIAAAAQgPgOgIgQIAAgBQgHgQAAgHQAAgVAMgRIABAAQAEgIAHgFQgqgMgKgsQgGgaAGgXQAAhMAdgNQAbgXAvAqIAKgHQAqgaA0AGQA7AFAmAqIAAABQAfAjAIA4QADATAAAWQAAAsgRAkIgKARQgrBHhpAAQhJAAgogpg");
	this.shape_1.setTransform(-0.0065,0.002);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF9900").s().p("AhYBrQgKgKgGgMQgFgJAAgEQAAgNAIgKQALgQAWAAQARAAAPANQAOANAXAAQAjAAARgXQALgPAAgPQAAgPgFgUQgIgcgMAAIgeABQgHAEgNAMIAMAUQAAAPgIAFQgRAKg1AAQgwAAgJgnQgFgTAFgSQAAhuBEBDIAEAEQAIgIAMgHQAhgUAoAEQAtAEAcAgQAiAnAABDQAAArgVAiQgjA3hSAAQg5AAgfgfg");
	this.shape_2.setTransform(-1.025,-1.1833);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AijCkQhEhEAAhgQAAhfBEhEQBEhDBfAAQBgAABDBDQBFBEAABfQAABghFBEQhDBDhgAAQhfAAhEhDg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1,p:{x:-0.0065,y:0.002}},{t:this.shape}]}).to({state:[{t:this.shape_1,p:{x:-1.1065,y:-1.098}},{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-23.1,46.3,46.2);


(lib.元件7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AA6BWQgagCgXgTQgXgTABgSQAAgCAkgLIAlgLIgmgMQgkgNAAgDQAFgaAagSQAcgSAfADQAjAEAWAbQAXAcgEAiQgDAjgcAWQgYATgeAAIgJAAgAiXgBQAAgwAngkIAHAIQgjAhAAArQAAAqAlAhIgJAJQgnglAAgvgAhtgBQAAgnAhgcIAHAIQgdAaAAAhQAAAhAfAaIgHAJQgjgeAAgmgAhGgBQAAggAegVIAHAKQgaARAAAaQAAAZAaARIgGAKQgfgVAAgfg");
	this.shape.setTransform(18.8486,19.2986);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#009900").s().p("AiJCKQg5g5AAhRQAAhQA5g5QA5g5BQAAQBRAAA5A5QA5A5AABQQAABRg5A5Qg5A5hRAAQhQAAg5g5g");
	this.shape_1.setTransform(19.5,19.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#00CC00").s().p("AiJCKQg5g5AAhRQAAhQA5g5QA5g5BQAAQBRAAA5A5QA5A5AABQQAABRg5A5Qg5A5hRAAQhQAAg5g5g");
	this.shape_2.setTransform(17.7,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape,p:{x:18.8486,y:19.2986}}]}).to({state:[{t:this.shape_2},{t:this.shape,p:{x:17.0486,y:17.4986}}]},1).to({state:[{t:this.shape_1},{t:this.shape,p:{x:18.8486,y:19.2986}}]},1).to({state:[{t:this.shape_1},{t:this.shape,p:{x:18.8486,y:19.2986}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,-1.8,40.8,40.8);


(lib.元件36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.0863,6.3822,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(34.0863,6.4309,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件36, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.1012,6.371,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(34.0526,6.4197,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件35, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjNA9QhYhQgKh1IAAgFIJfAAIgBAFQgJB1hYBQQhYBRh2AAQh1AAhYhRgAjGA4QBVBNBxAAQBxAABWhNQBVhMAKhxIpMAAQALBxBVBMg");
	this.shape.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AjLA6QhWhPgKh0IJWAAQgKB0hVBPQhXBQh1AAQh0AAhXhQg");
	this.shape_1.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件34, new cjs.Rectangle(0,0,118.3,55.3), null);


(lib.元件33 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiMB6ICMjzICNDzgAh9ByID7AAIh+jag");
	this.shape.setTransform(27.3682,23.7286,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("AiEBzICEjlICFDlg");
	this.shape_1.setTransform(27.3682,24.1178,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件33, new cjs.Rectangle(0,0,54.8,47.5), null);


(lib.元件32 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(22.412,23.0898,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(22.412,23.1385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgsAAghAgg");
	this.shape_2.setTransform(23.093,23.0898,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAigiAuABQAwgBAhAiQAiAhAAAvQAAAvgiAiQghAhgwAAQguAAgighg");
	this.shape_3.setTransform(23.093,23.1385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件32, new cjs.Rectangle(0,0,46.2,46.2), null);


(lib.元件31 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AmhGiQiuitAAj1QAAj0CuitQCtiuD0AAQD1AACtCuQCuCtAAD0QAAD1iuCtQitCuj1AAQj0AAitiugAmbmbQirCrAADwQAADxCrCrQCrCrDwAAQDxAACrirQCrirAAjxQAAjwirirQirirjxAAQjwAAirCrg");
	this.shape.setTransform(0.0182,-0.0036,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AmeGfQitisAAjzQAAjzCtisQCrisDzAAQDzAACtCsQCsCsgBDzQABDzisCsQitCtjzAAQjzAAiritg");
	this.shape_1.setTransform(0.0669,-0.0036,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件31, new cjs.Rectangle(-115.1,-115.1,230.3,230.3), null);


(lib.元件30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjzDzQhkhlgBiOQABiOBkhkQBmhlCNAAQCOAABlBlQBlBkABCOQgBCOhlBlQhlBliOAAQiNAAhmhlgAjmjmQhhBgAACGQAACIBhBfQBgBgCGAAQCIAABfhgQBhhfAAiIQAAiGhhhgQhghhiHAAQiGAAhgBhg");
	this.shape.setTransform(34.45,34.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("AjmDnQhhhfAAiIQAAiGBhhgQBghhCGAAQCHAABgBhQBhBgAACGQAACIhhBfQhfBgiIAAQiGAAhghgg");
	this.shape_1.setTransform(34.45,34.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件30, new cjs.Rectangle(0,0,68.9,68.8), null);


(lib.draged11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlPA/IAAh9IKfAAIAAB9gAk+AvIJ+AAIAAhcIp+AAg");
	this.shape.setTransform(0.05,0.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("Ak+AvIAAhdIJ+AAIAABdg");
	this.shape_1.setTransform(0.05,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged11, new cjs.Rectangle(-33.5,-6.2,67.2,12.600000000000001), null);


(lib.draged10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlPA/IAAh9IKfAAIAAB9gAk+AvIJ+AAIAAhcIp+AAg");
	this.shape.setTransform(0.05,0.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("Ak+AvIAAhdIJ+AAIAABdg");
	this.shape_1.setTransform(0.05,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged10, new cjs.Rectangle(-33.5,-6.2,67.2,12.600000000000001), null);


(lib.draged9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlPA/IAAh9IKfAAIAAB9gAk+AvIJ+AAIAAhcIp+AAg");
	this.shape.setTransform(0.05,0.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("Ak+AvIAAhdIJ+AAIAABdg");
	this.shape_1.setTransform(0.05,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged9, new cjs.Rectangle(-33.5,-6.2,67.2,12.600000000000001), null);


(lib.draged8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlPA/IAAh9IKfAAIAAB9gAk+AvIJ+AAIAAhcIp+AAg");
	this.shape.setTransform(0.05,0.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("Ak+AvIAAhdIJ+AAIAABdg");
	this.shape_1.setTransform(0.05,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged8, new cjs.Rectangle(-33.5,-6.2,67.2,12.600000000000001), null);


(lib.draged7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AkdD4IEenvIEdHvgAj/DnIIAAAIkAm8g");
	this.shape.setTransform(0.025,0.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("Aj/DeID/m7IEAG7g");
	this.shape_1.setTransform(0.075,0.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged7, new cjs.Rectangle(-28.6,-24.7,57.3,49.599999999999994), null);


(lib.draged6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AimCoQhGhGAAhhQAAhhBGhGQBEhGBiAAQBiAABGBGQBFBGAABhQAABhhFBGQhGBFhiAAQhiAAhEhFgAiaiaQhBBBAABaQAABbBBBAQA/BABbAAQBbAABAhAQBBhAAAhbQAAhahBhBQhAhBhbAAQhaAAhABBgAg2A3QgWgWAAggQAAgfAWgWQAXgXAfAAQAfAAAXAXQAWAWAAAfQAAAggWAWQgWAWggAAQgfAAgXgWg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiaCcQhBhAAAhbQAAhaBBhBQBAhBBaAAQBbAABABBQBBBBAABaQAABbhBBAQhABAhbAAQhbAAg/hAgAg2g0QgWAWAAAfQAAAgAWAWQAXAWAfAAQAgAAAWgWQAWgWAAggQAAgfgWgWQgXgXgfAAQgfAAgXAXg");
	this.shape_1.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged6, new cjs.Rectangle(-23.7,-23.7,47.5,47.5), null);


(lib.draged4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AioCoQhEhGAAhhQAAhhBEhGQBHhGBhAAQBhAABHBGQBFBGAABhQAABhhFBGQhHBFhhAAQhhAAhHhFgAiaiaQhBBBAABaQAABbBBBAQBABABaAAQBcAAA/hAQBChAAAhbQAAhahChBQg/hBhcAAQhaAAhABBgAg0A3QgVgWAAggQAAgfAVgWQAYgXAdAAQAhAAAWAXQAXAWAAAfQAAAggXAWQgWAWghAAQgdAAgYgWg");
	this.shape.setTransform(0.05,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiaCcQhBhAAAhbQAAhaBBhBQBAhBBaAAQBcAAA/BBQBCBBAABaQAABbhCBAQg/BAhcAAQhaAAhAhAgAg0g0QgVAWAAAfQAAAgAVAWQAYAWAdAAQAhAAAWgWQAXgWAAggQAAgfgXgWQgWgXghAAQgdAAgYAXg");
	this.shape_1.setTransform(0.05,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged4, new cjs.Rectangle(-23.7,-23.7,47.5,47.5), null);


(lib.draged5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AivCwQhJhJAAhnQAAhmBJhJQBJhJBmAAQBnAABJBJQBJBJAABmQAABnhJBJQhJBJhnAAQhmAAhJhJgAinimQhFBFAABhQAABiBFBFQBGBGBhAAQBjAABFhGQBFhFAAhiQAAhhhFhFQhGhGhiAAQhhAAhGBGg");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("AinCnQhFhFAAhiQAAhhBFhFQBGhGBhAAQBiAABGBGQBFBFAABhQAABihFBFQhFBGhjAAQhhAAhGhGg");
	this.shape_1.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged5, new cjs.Rectangle(-24.9,-24.9,49.9,49.9), null);


(lib.draged3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgxAxAABFQAABGAxAxQAxAxBFAAQBGAAAxgxQAygxgBhGQABhFgygxQgygxhFAAQhFAAgxAxg");
	this.shape.setTransform(0.0675,0.0292,1.409,1.409);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgzgyAAhIQAAhGAzgzQAygzBHABQBIgBAyAzQAyAzAABGQAABIgyAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(0.0675,-0.0061,1.409,1.409);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged3, new cjs.Rectangle(-24.8,-24.9,49.8,49.9), null);


(lib.draged2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjiBEQhhhZgMiCIAAgEIKfAAIgBAEQgLCChgBZQhhBYiDAAQiBAAhhhYgAjbA+QBfBVB8AAQB9AABehVQBehUAMh8IqKAAQANB8BdBUg");
	this.shape.setTransform(0,0.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AjaA+QhehUgMh8IKJAAQgMB8heBUQhdBVh+AAQh8AAhehVg");
	this.shape_1.setTransform(-0.025,0.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged2, new cjs.Rectangle(-33.5,-15.6,67.1,31.299999999999997), null);


(lib.draged1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AirCsQhHhIAAhkQAAhjBHhIQBHhHBkAAQBkAABIBHIAIAIQA/BFAABeQAABfg/BFIgIAIQhIBHhkAAQhkAAhHhHgAioioQhGBGgBBiQABBjBGBGQBGBGBiAAQBjAABHhGIAKgLQA7hCABhcQgBhbg7hDIgKgKQhHhHhjABQhigBhGBHg");
	this.shape.setTransform(0.05,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AioCpQhGhGgBhjQABhiBGhGQBGhHBiABQBjgBBHBHIAKAKQA7BDABBbQgBBcg7BCIgKALQhHBGhjAAQhiAAhGhGg");
	this.shape_1.setTransform(0.05,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.draged1, new cjs.Rectangle(-24.2,-24.3,48.599999999999994,48.6), null);


(lib.元件18複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjNA9QhYhQgKh1IAAgFIJfAAIgBAFQgJB1hYBQQhYBRh2AAQh1AAhYhRgAjGA4QBVBNBxAAQBxAABWhNQBVhMAKhxIpMAAQALBxBVBMg");
	this.shape.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AjLA6QhWhPgKh0IJWAAQgKB0hVBPQhXBQh1AAQh0AAhXhQg");
	this.shape_1.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件18複製2, new cjs.Rectangle(0,0,118.3,55.3), null);


(lib.元件18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjNA9QhYhQgKh1IAAgFIJfAAIgBAFQgJB1hYBQQhYBRh2AAQh1AAhYhRgAjGA4QBVBNBxAAQBxAABWhNQBVhMAKhxIpMAAQALBxBVBMg");
	this.shape.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AjLA6QhWhPgKh0IJWAAQgKB0hVBPQhXBQh1AAQh0AAhXhQg");
	this.shape_1.setTransform(59.1669,27.6258,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件18, new cjs.Rectangle(0,0,118.3,55.3), null);


(lib.元件17複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiMB6ICMjzICNDzgAh9ByID7AAIh+jag");
	this.shape.setTransform(27.3682,23.7286,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("AiEBzICEjlICFDlg");
	this.shape_1.setTransform(27.3682,24.1178,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件17複製2, new cjs.Rectangle(0,0,54.8,47.5), null);


(lib.元件17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiMB6ICMjzICNDzgAh9ByID7AAIh+jag");
	this.shape.setTransform(27.3682,23.7286,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("AiEBzICEjlICFDlg");
	this.shape_1.setTransform(27.3682,24.1178,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件17, new cjs.Rectangle(0,0,54.8,47.5), null);


(lib.元件16複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.0863,6.3822,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(34.0863,6.4309,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件16複製2, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.0863,6.3822,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(34.0863,6.4309,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件16, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件15複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.1012,6.371,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(34.0526,6.4197,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件15複製2, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.1012,6.371,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(34.0526,6.4197,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件15, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件14複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.1247,6.3822,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(34.1247,6.4309,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件14複製2, new cjs.Rectangle(0,0,68.3,12.8), null);


(lib.元件14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.1247,6.3822,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(34.1247,6.4309,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件14, new cjs.Rectangle(0,0,68.3,12.8), null);


(lib.元件13複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.0897,6.371,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(34.041,6.4197,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件13複製2, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(34.0897,6.371,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(34.041,6.4197,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件13, new cjs.Rectangle(0,0,68.2,12.8), null);


(lib.元件12複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AmhGiQiuitAAj1QAAj0CuitQCtiuD0AAQD1AACtCuQCuCtAAD0QAAD1iuCtQitCuj1AAQj0AAitiugAmbmbQirCrAADwQAADxCrCrQCrCrDwAAQDxAACrirQCrirAAjxQAAjwirirQirirjxAAQjwAAirCrg");
	this.shape.setTransform(115.1682,115.1464,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AmeGfQitisAAjzQAAjzCtisQCrisDzAAQDzAACtCsQCsCsgBDzQABDzisCsQitCtjzAAQjzAAiritg");
	this.shape_1.setTransform(115.2169,115.1464,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件12複製2, new cjs.Rectangle(0,0,230.3,230.3), null);


(lib.元件12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AmhGiQiuitAAj1QAAj0CuitQCtiuD0AAQD1AACtCuQCuCtAAD0QAAD1iuCtQitCuj1AAQj0AAitiugAmbmbQirCrAADwQAADxCrCrQCrCrDwAAQDxAACrirQCrirAAjxQAAjwirirQirirjxAAQjwAAirCrg");
	this.shape.setTransform(115.1682,115.1464,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AmeGfQitisAAjzQAAjzCtisQCrisDzAAQDzAACtCsQCsCsgBDzQABDzisCsQitCtjzAAQjzAAiritg");
	this.shape_1.setTransform(115.2169,115.1464,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,230.3,230.3);


(lib.元件11複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(22.412,23.0898,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(22.412,23.1385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgsAAghAgg");
	this.shape_2.setTransform(23.093,23.0898,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAigiAuABQAwgBAhAiQAiAhAAAvQAAAvgiAiQghAhgwAAQguAAgighg");
	this.shape_3.setTransform(23.093,23.1385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件11複製2, new cjs.Rectangle(0,0,46.2,46.2), null);


(lib.元件11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(0.012,-0.0102,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(0.012,0.0385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgsAAghAgg");
	this.shape_2.setTransform(-0.007,-0.0102,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAigiAuABQAwgBAhAiQAiAhAAAvQAAAvgiAiQghAhgwAAQguAAgighg");
	this.shape_3.setTransform(-0.007,0.0385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件11, new cjs.Rectangle(-23.1,-23.1,46.2,46.2), null);


(lib.元件10複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(23.28,23.0898,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(23.2314,23.1385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgtAAggAgg");
	this.shape_2.setTransform(23.0855,23.0898,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAhgiAvABQAvgBAiAiQAiAhAAAvQAAAvgiAiQgiAhgvAAQguAAgighg");
	this.shape_3.setTransform(23.0855,23.1385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件10複製2, new cjs.Rectangle(0,0,46.2,46.2), null);


(lib.元件10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(23.28,23.0898,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(23.2314,23.1385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgtAAggAgg");
	this.shape_2.setTransform(23.0855,23.0898,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAhgiAvABQAvgBAiAiQAiAhAAAvQAAAvgiAiQgiAhgvAAQguAAgighg");
	this.shape_3.setTransform(23.0855,23.1385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件10, new cjs.Rectangle(0,0,46.2,46.2), null);


(lib.元件9複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgyAxAABFQAABGAyAxQAyAxBEAAQBGAAAxgxQAxgxAAhGQAAhFgxgxQgxgxhGAAQhEAAgyAxg");
	this.shape.setTransform(34.4429,34.4038,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgygyAAhIQAAhGAygzQAygzBHABQBIgBAyAzQAzAzAABGQAABIgzAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(34.4429,34.3551,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件9複製2, new cjs.Rectangle(0,0,68.9,68.8), null);


(lib.元件9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgyAxAABFQAABGAyAxQAyAxBEAAQBGAAAxgxQAxgxAAhGQAAhFgxgxQgxgxhGAAQhEAAgyAxg");
	this.shape.setTransform(34.4429,34.4038,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgygyAAhIQAAhGAygzQAygzBHABQBIgBAyAzQAzAzAABGQAABIgzAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(34.4429,34.3551,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件9, new cjs.Rectangle(0,0,68.9,68.8), null);


(lib.元件8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgkC6QgPgPAAgZQAAgXAOgPQAPgQAWAAQAYAAAPAPQAPAQAAAXQAAAYgOAQQgPAPgYAAQgWAAgPgPgAgZA5QgchaAAgLIABgjIABgjIgBgmIgBglQAAgLAFAAIAXABIAYABIAXgBIAXgBQAGAAAABDQABA0gJAtIgVBbQgDALgTAAQgWAAgDgJg");
	this.shape.setTransform(309.5008,36.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AhDB6QgUgeAAgHQAAAAAAgBQABAAAAgBQAAAAABAAQABgBAAAAIAogIQAZgIgBgSQAAgMgOgQIgbgeQgPgTAAgXQAAgqAqgeQAlgbAsgBQAFAAARAfQATAeAAAFQAAADgFAFQgHgCgIAAQgRAAgLAIQgOAIABAQQAAAJAOAQQAWAWAFAHQAPAVAAAZQAAAOgFAQQgHASgKAIQgUATgcAMQgdAOgaAAQgFAAgUgfg");
	this.shape_1.setTransform(290.675,41.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgnDBQgHgBgBgCQgBgBAAgHIABg7IAAg7QAAhPgIgvIAAgGQAAgGAHAAIAZACIAXABIAYgCIAZgBQAHAAAAAGIgBAFQgFA3ABBHIABA+IABA9QAAAGgHABQgJABghABQgiAAgJgCgAglhsQgSgNAAgXQAAgWARgPQARgNAVAAQAWAAARANQARAOAAAWQABAxg4AAQgWAAgQgMg");
	this.shape_2.setTransform(272.5002,36.9741);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("Ah5DIQgKgCAAgHIAAhEIgBhDQAAhbgDg8IgCgqQgBgZgEgRIgBgFQAAgEAEgCQAJgDARAAIAagCIAzgHQAEAAAAAHIgBAYIAAAYQgCBAABAlQAAAFADAAIAOgJQAQgMAOgHQAWgKAVAAQAkAAAYASQAbAUAAAkIABDBQAAAKgHABQgJABghABQgfAAgMgCQgJgCAAgLIAAhJIAAhJQAAggghAAQgLAAgPAJQgQALAAAKIAABGIABAoIABApQAAALgJABQgIABgpAAQgXABgKgDg");
	this.shape_3.setTransform(248.125,36.55);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AguDHQgIgBAAgHQgBgiADhCQAChDAAggIgDhiQg5AGghAAQgFAAAAgCIAEgWIAFgYIABgbQACgVAFAAIAEABQAuAFBYgBQAZAABFgGIAlgDQAFAAABABIABAFIAAAVIAAAVIACAVIACAUQAAAGgGAAIhVgEIgBBkIADBjIAEBkQAAAFgDACIgIABQgQADghAAIgLAAQgbAAgMgCg");
	this.shape_4.setTransform(216.625,36.8792);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AhyC0IgKgcIgJgTQgGgPgBgFQAAgFAFAAQBOgBAAgkQAAgDgng0Qgog1gEgPQgDgIAAgyIABgfIAAgeQAAgIAJAAIAsABIArAAQAGAAAAAJIAAAYIgBAXIABAxQABAKARAaQARAcAGAAQAHAAAPgcQAOgaABgJQADgZAAgdIgCgXIgCgYQAAgFAGAAIArgCIArgBQAIAAACAHQAFANAAAvQAAA3gDAMQgEAOg5BXQgJAOglAzQgoA3gFAEQgHAEhQAAQgMAAgEgCg");
	this.shape_5.setTransform(171.7536,48.425);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AhKCKQgKAAAAgJIAAhCIgBhEQAAhCgMgrIgBgDQAAgFAEgCIAtgGIAugJQAFAAABARQACASADAAIABAAIgBAAQgCAAAZgPQAcgPAZAAQAPgBAAAIIgBAWIgCAYIABAVIAAAXQAAAKgMABIgQAAIgPgBQgXgBgJAJQgIAHAAAVIABAlIABAkIABAZIACAYQAAAGgKABIgoACQgbAAgQgCg");
	this.shape_6.setTransform(145.45,43.6);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AguDHQgIgBAAgHQgBgiADhCQAChDAAggIgDhiQg5AGghAAQgFAAAAgCIAEgWIAFgYIABgbQACgVAFAAIAEABQAuAFBYgBQAZAABFgGIAlgDQAFAAABABIABAFIAAAVIAAAVIACAVIACAUQAAAGgGAAIhVgEIgBBkIADBjIAEBkQAAAFgDACIgIABQgQADghAAIgLAAQgbAAgMgCg");
	this.shape_7.setTransform(118.775,37.7292);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#0066CC").s().p("A5vFfIlyqrMA/DgASIlZK9g");
	this.shape_8.setTransform(88.2,36.7,1,1,0,0,0,-123.6,0);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000099").s().p("A8LGHIk5rkMBCJgApIlSMNg");
	this.shape_9.setTransform(101,44.7,1,0.846,0,0,0,-110.7,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件8, new cjs.Rectangle(0,0,423.5,77.9), null);


(lib.元件7複製2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgxAxAABFQAABGAxAxQAxAxBFAAQBGAAAxgxQAygxgBhGQABhFgygxQgygxhFAAQhFAAgxAxg");
	this.shape.setTransform(34.4369,34.4038,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgzgyAAhIQAAhGAzgzQAygzBHABQBIgBAyAzQAyAzAABGQAABIgyAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(34.4369,34.3551,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件7複製2, new cjs.Rectangle(0,0,68.9,68.8), null);


(lib.元件7_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgxAxAABFQAABGAxAxQAxAxBFAAQBGAAAxgxQAygxgBhGQABhFgygxQgygxhFAAQhFAAgxAxg");
	this.shape_3.setTransform(34.4369,34.4038,1.9459,1.9459);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#493A34").s().p("Ah5B6QgzgyAAhIQAAhGAzgzQAygzBHABQBIgBAyAzQAyAzAABGQAABIgyAyQgyAzhIgBQhHABgygzg");
	this.shape_4.setTransform(34.4369,34.3551,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件7_1, new cjs.Rectangle(0,0,68.9,68.8), null);


(lib.元件5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#ABCD03").s().p("Ah1gjICZhSIBSCZIiYBSg");
	this.shape.setTransform(14.8668,55.4456,1.2612,1.2612);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E4007F").s().p("AhhAKIBYhrIBrBXIhXBrg");
	this.shape_1.setTransform(676.6579,237.0291,1.2612,1.2612);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#796BAF").s().p("AhKhQICVA/IiBBig");
	this.shape_2.setTransform(17.736,242.2631,1.2612,1.2612);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#008CD6").s().p("AhNAhIB1hwIAmCeg");
	this.shape_3.setTransform(14.7722,273.7935,1.2612,1.2612);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#796BAF").s().p("AhKhQICVBAIiBBhg");
	this.shape_4.setTransform(678.4867,305.0717,1.2612,1.2612);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgTAZAAQAaAAASATQASASABAZQgBAagSASQgSATgagBQgZABgSgTg");
	this.shape_5.setTransform(676.3111,270.8297,1.2612,1.2612);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E4007F").s().p("AhhAKIBXhrIBrBXIhXBrg");
	this.shape_6.setTransform(677.5092,42.802,1.2612,1.2612);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#E4007F").s().p("AhhALIBXhrIBrBWIhXBrg");
	this.shape_7.setTransform(677.5092,146.6,1.2612,1.2612);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#E4007F").s().p("AhegXIB2hHIBHB2Ih2BHg");
	this.shape_8.setTransform(675.1445,376.7402,1.2612,1.2612);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#E4007F").s().p("Ah3AfIBZiWICWBZIhZCWg");
	this.shape_9.setTransform(168.4513,16.5056,1.2612,1.2612);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#E4007F").s().p("Ah2gdICVhZIBZCUIiWBZg");
	this.shape_10.setTransform(523.7041,425.77,1.2612,1.2612);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFF100").s().p("Ah1gjICZhSIBSCZIiZBSg");
	this.shape_11.setTransform(281.7084,19.6271,1.2612,1.2612);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#E4007F").s().p("Ah1AkIBSiZICZBSIhSCZg");
	this.shape_12.setTransform(408.8704,427.6618,1.2612,1.2612);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#E4007F").s().p("Ah6ANIBuiHICHBuIhvCHg");
	this.shape_13.setTransform(381.3129,15.4651,1.2612,1.2612);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E4007F").s().p("Ah6gMICHhuIBuCHIiHBug");
	this.shape_14.setTransform(297.2844,425.0448,1.2612,1.2612);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#E4007F").s().p("Ah1gjICZhSIBSCZIiZBSg");
	this.shape_15.setTransform(557.4731,19.6271,1.2612,1.2612);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#E4007F").s().p("Ah1AkIBSiZICZBSIhSCZg");
	this.shape_16.setTransform(139.3803,429.2383,1.2612,1.2612);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#E4007F").s().p("Ah1AkIBSiZICZBSIhTCZg");
	this.shape_17.setTransform(15.8758,365.2632,1.2612,1.2612);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#E4007F").s().p("Ah1AkIBSiZICZBSIhSCZg");
	this.shape_18.setTransform(16.9793,194.4316,1.2612,1.2612);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#796BAF").s().p("AhNAhIB1hvIAmCeg");
	this.shape_19.setTransform(676.7841,113.8084,1.2612,1.2612);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#008CD6").s().p("AhNAhIB1hvIAmCdg");
	this.shape_20.setTransform(675.4598,344.9891,1.2612,1.2612);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#008CD6").s().p("AgohPIB3BwIidAvg");
	this.shape_21.setTransform(82.2157,19.2803,1.2612,1.2612);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#008CD6").s().p("AhNAhIB1hwIAmCeg");
	this.shape_22.setTransform(614.6692,428.8599,1.2612,1.2612);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#008CD6").s().p("AgohPIB3BwIidAvg");
	this.shape_23.setTransform(82.2157,19.2803,1.2612,1.2612);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#008CD6").s().p("AhNAhIB1hwIAmCeg");
	this.shape_24.setTransform(614.6692,428.8599,1.2612,1.2612);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#008CD6").s().p("AhhhjIDDA7IiTCLg");
	this.shape_25.setTransform(325.5041,20.3523,1.2612,1.2612);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#008CD6").s().p("AhNggICbguIgmCeg");
	this.shape_26.setTransform(353.4085,429.932,1.2612,1.2612);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#F4B4D0").s().p("AhNhOICbAuIh1Bvg");
	this.shape_27.setTransform(503.7453,17.1993,1.2612,1.2612);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#008CD6").s().p("AhNggICbgvIglCfg");
	this.shape_28.setTransform(193.108,426.7789,1.2612,1.2612);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#008CD6").s().p("AhRBHIBRiNIBSCNg");
	this.shape_29.setTransform(45.735,424.0673,1.2612,1.2612);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#008CD6").s().p("AhuBgIBui/IBvC/g");
	this.shape_30.setTransform(16.0965,102.6466,1.2612,1.2612);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#009944").s().p("AgvAkIgvgpIA2ghIAZg6IAvApIA/AFIgYA6IAOA+Ig/gFIg2Ahg");
	this.shape_31.setTransform(15.4028,314.2785,1.2612,1.2612);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#009944").s().p("AgUA/Ig+AFIAOg8IgXg4IA9gGIAugoIAYA5IA0AgIguAoIgOA8g");
	this.shape_32.setTransform(615.2368,19.8163,1.2612,1.2612);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#009944").s().p("AgtAjIgugoIA0ggIAYg5IAuAoIA9AGIgXA4IAOA8Ig+gFIgzAgg");
	this.shape_33.setTransform(81.6166,429.396,1.2612,1.2612);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#009944").s().p("AgtAjIgugnIA0ghIAYg5IAuAoIA9AGIgXA4IAOA8Ig+gFIgzAfg");
	this.shape_34.setTransform(677.4777,199.2557,1.2612,1.2612);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#009944").s().p("AgtAjIgugoIA0ggIAYg5IAuAoIA9AGIgXA4IAOA8Ig+gFIg0Agg");
	this.shape_35.setTransform(660.4513,421.0089,1.2612,1.2612);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#009944").s().p("AgUA/Ig+AEIAOg8IgYg4IA+gFIAtgoIAZA5IA1AgIgvAnIgOA9g");
	this.shape_36.setTransform(225.1744,18.7758,1.2612,1.2612);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#009944").s().p("AgtAjIgugoIA0ggIAYg5IAuAoIA9AGIgXA4IAOA7Ig+gEIg0Afg");
	this.shape_37.setTransform(468.8727,426.7789,1.2612,1.2612);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#9FD9F6").s().p("AgtAjIgugnIA0ghIAYg4IAuAnIA9AGIgXA3IAOA9Ig+gFIgzAgg");
	this.shape_38.setTransform(34.6994,22.055,1.2612,1.2612);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#F08437").s().p("Ag5A6QgYgYAAgiQAAghAYgYQAYgYAhAAQAiAAAYAYQAYAYAAAhQAAAigYAYQgYAYgiAAQghAAgYgYg");
	this.shape_39.setTransform(15.2767,411.6128,1.2612,1.2612);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#F08437").s().p("AgrAsQgSgSgBgaQABgZASgSQASgSAZAAQAaAAASASQASASAAAZQAAAagSASQgSASgaAAQgZAAgSgSg");
	this.shape_40.setTransform(423.2483,16.5056,1.2612,1.2612);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgSAZAAQAaAAASASQATASAAAZQAAAagTASQgSATgaAAQgZAAgSgTg");
	this.shape_41.setTransform(249.642,426.0853,1.2612,1.2612);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgTAZAAQAaAAASATQASASAAAZQAAAagSASQgSATgagBQgZABgSgTg");
	this.shape_42.setTransform(120.2098,15.4336,1.2612,1.2612);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgSAZAAQAaAAASASQASASAAAZQAAAagSASQgSASgaAAQgZAAgSgSg");
	this.shape_43.setTransform(570.0222,425.9907,1.2612,1.2612);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgSAZAAQAaAAASASQASASAAAZQAAAagSASQgSASgaAAQgZAAgSgSg");
	this.shape_44.setTransform(653.4516,15.5912,1.2612,1.2612);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#F08437").s().p("AgrAsQgSgSAAgaQAAgZASgSQASgTAZABQAagBASATQASASAAAZQAAAagSASQgSATgaAAQgZAAgSgTg");
	this.shape_45.setTransform(679.6849,87.9535,1.2612,1.2612);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#F08437").s().p("Ag6A7QgYgZAAgiQAAgiAYgXQAZgZAhAAQAjAAAYAZQAYAXAAAiQAAAigYAZQgYAYgjAAQghAAgZgYg");
	this.shape_46.setTransform(17.4838,151.771,1.2612,1.2612);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#996600").s().p("EgpFAZqMAAAgzTMBSLAAAMAAAAzTgEgopAZNMBRTAAAMAAAgyaMhRTAAAg");
	this.shape_47.setTransform(347.19,221.6295,1.2613,1.2613);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#FFFFFF").s().p("Ego4AZcMAAAgy3MBRxAAAMAAAAy3g");
	this.shape_48.setTransform(347.19,221.6295,1.2613,1.2613);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件5, new cjs.Rectangle(0,0,689.8,444.1), null);


(lib.sencer11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlUBAIAAh/IKpAAIAAB/gAlEAvIKJAAIAAhdIqJAAg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AlEAvIAAhdIKJAAIAABdg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape_2.setTransform(0.0247,0.0322,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_3.setTransform(0.0247,0.0809,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.30000000000001,12.7);


(lib.sencer10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlUBAIAAh/IKpAAIAAB/gAlEAvIKJAAIAAhdIqJAAg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AlEAvIAAhdIKJAAIAABdg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape_2.setTransform(-0.0104,0.021,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_3.setTransform(-0.059,0.0697,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.sencer9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlUBAIAAh/IKpAAIAAB/gAlEAvIKJAAIAAhdIqJAAg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AlEAvIAAhdIKJAAIAABdg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape_2.setTransform(-0.0137,0.0322,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_3.setTransform(-0.0137,0.0809,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.sencer8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AlUBAIAAh/IKpAAIAAB/gAlEAvIKJAAIAAhdIqJAAg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AlEAvIAAhdIKJAAIAABdg");
	this.shape_1.setTransform(0,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape_2.setTransform(0.0012,0.021,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_3.setTransform(-0.0474,0.0697,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.sencer7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AkRDtIERnZIESHZgAj0DdIHqAAIj2mog");
	this.shape.setTransform(0.025,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("Aj0DVID0mpID1Gpg");
	this.shape_1.setTransform(0.075,0.85);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AiMB6ICMjzICNDzgAh9ByID7AAIh+jag");
	this.shape_2.setTransform(0.0182,0.0286,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A50082").s().p("AiEBzICEjlICFDlg");
	this.shape_3.setTransform(0.0182,0.4178,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-27.3,-23.7,54.7,47.5);


(lib.sencer6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiiCkQhEhEAAhfQAAhfBEhEQBDhEBgAAQBfAABEBEQBDBEAABfQAABfhDBEQhEBDhfAAQhgAAhDhDgAiWiWQg/A/AABYQAABYA/A/QA+A/BZgBQBYABA+g/QA/g/AAhYQAAhYg/g/Qg+g/hYAAQhYAAg/A/gAg7A1QgVgWgBgeQABgfAVgVQAWgWAggBQAdABAWAWQAWAVAAAfQAAAegWAWQgVAVgeABQgggBgWgVg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiWCYQg/g/AAhYQAAhYA/g/QA/g/BYAAQBYAAA+A/QA/A/AABYQAABYg/A/Qg+A/hYgBQhZABg+g/gAg7gzQgVAVgBAfQABAeAVAWQAWAVAgABQAegBAVgVQAWgWAAgeQAAgfgWgVQgWgWgdgBQggABgWAWg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape_2.setTransform(0.03,-0.0102,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_3.setTransform(-0.0186,0.0385,1.9459,1.9459);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgtAAggAgg");
	this.shape_4.setTransform(-0.0145,-0.0102,1.9459,1.9459);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAhgiAvABQAvgBAiAiQAiAhAAAvQAAAvgiAiQgiAhgvAAQguAAgighg");
	this.shape_5.setTransform(-0.0145,0.0385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-23.1,46.2,46.2);


(lib.sencer5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjzDzQhkhmgBiNQABiNBkhmQBmhkCNAAQCOAABlBkQBmBmAACNQAACNhmBmQhlBliOAAQiNAAhmhlgAjmjmQhhBfAACHQAACIBhBfQBgBhCGAAQCIAABfhhQBhhfAAiIQAAiHhhhfQhghhiHAAQiGAAhgBhg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("AjmDnQhhhfAAiIQAAiHBhhfQBghhCGAAQCHAABgBhQBhBfAACHQAACIhhBfQhfBhiIAAQiGAAhghhg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgxAxAABFQAABGAxAxQAxAxBFAAQBGAAAxgxQAygxgBhGQABhFgygxQgygxhFAAQhFAAgxAxg");
	this.shape_2.setTransform(-0.0131,0.0038,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#493A34").s().p("Ah5B6QgzgyAAhIQAAhGAzgzQAygzBHABQBIgBAyAzQAyAzAABGQAABIgyAyQgyAzhIgBQhHABgygzg");
	this.shape_3.setTransform(-0.0131,-0.0449,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-34.4,68.9,68.8);


(lib.sencer4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiiCkQhEhEAAhfQAAhfBEhEQBDhEBgAAQBfAABEBEQBDBEAABfQAABfhDBEQhEBDhfAAQhgAAhDhDgAiWiWQg/A/AABYQAABYA/A/QA+A/BZgBQBYABA+g/QA/g/AAhYQAAhYg/g/Qg+g/hYAAQhYAAg/A/gAg7A1QgVgWgBgeQABgfAVgVQAWgWAggBQAdABAWAWQAWAVAAAfQAAAegWAWQgVAVgeABQgggBgWgVg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiWCYQg/g/AAhYQAAhYA/g/QA/g/BYAAQBYAAA+A/QA/A/AABYQAABYg/A/Qg+A/hYgBQhZABg+g/gAg7gzQgVAVgBAfQABAeAVAWQAWAVAgABQAegBAVgVQAWgWAAgeQAAgfgWgVQgWgWgdgBQggABgWAWg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape_2.setTransform(0.012,-0.0102,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_3.setTransform(0.012,0.0385,1.9459,1.9459);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgsAAghAgg");
	this.shape_4.setTransform(-0.007,-0.0102,1.9459,1.9459);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAigiAuABQAwgBAhAiQAiAhAAAvQAAAvgiAiQghAhgwAAQguAAgighg");
	this.shape_5.setTransform(-0.007,0.0385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-23.1,46.2,46.2);


(lib.sencer3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjzDzQhkhmgBiNQABiNBkhmQBmhkCNAAQCOAABlBkQBmBmAACNQAACNhmBmQhlBliOAAQiNAAhmhlgAjmjmQhhBfAACHQAACIBhBfQBgBhCGAAQCIAABfhhQBhhfAAiIQAAiHhhhfQhghhiHAAQiGAAhgBhg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("AjmDnQhhhfAAiIQAAiHBhhfQBghhCGAAQCHAABgBhQBhBfAACHQAACIhhBfQhfBhiIAAQiGAAhghhg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgyAxAABFQAABGAyAxQAyAxBEAAQBGAAAxgxQAxgxAAhGQAAhFgxgxQgxgxhGAAQhEAAgyAxg");
	this.shape_2.setTransform(-0.0071,0.0038,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#493A34").s().p("Ah5B6QgygyAAhIQAAhGAygzQAygzBHABQBIgBAyAzQAzAzAABGQAABIgzAyQgyAzhIgBQhHABgygzg");
	this.shape_3.setTransform(-0.0071,-0.0449,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-34.4,68.9,68.8);


(lib.sencer2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AmQB3QiridgTjlIAAgIISdAAIgBAIQgSDmirCcQirCdjmAAQjkAAisidgAmCBuQCmCWDcAAQDdAACliWQCmiWAVjbIx6AAQAWDbClCWg");
	this.shape.setTransform(0,0.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AmCBuQiliWgWjbIR7AAQgVDbimCWQimCWjcAAQjcAAiniWg");
	this.shape_1.setTransform(-0.05,0.025);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AjNA9QhYhQgKh1IAAgFIJfAAIgBAFQgJB1hYBQQhYBRh2AAQh1AAhYhRgAjGA4QBVBNBxAAQBxAABWhNQBVhMAKhxIpMAAQALBxBVBMg");
	this.shape_2.setTransform(0.0169,0.0258,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#990000").s().p("AjLA6QhWhPgKh0IJWAAQgKB0hVBPQhXBQh1AAQh0AAhXhQg");
	this.shape_3.setTransform(0.0169,0.0258,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-59.1,-27.6,118.30000000000001,55.3);


(lib.sencer1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AstMuQlRlSAAncQAAnbFRlSQFSlRHcAAQHbAAFSFRQFRFSAAHbQAAHclRFSQlSFRnbAAQncAAlSlRgAshshQlNFNAAHUQAAHVFNFNQFNFNHVAAQHUAAFOlNQFMlNAAnVQAAnUlMlNQlOlNnUAAQnVAAlNFNg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AshMiQlNlNAAnVQAAnUFNlNQFMlNHVAAQHVAAFNFNQFNFNAAHUQAAHVlNFNQlNFNnVAAQnVAAlMlNg");
	this.shape_1.setTransform(0.025,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AmhGiQiuitAAj1QAAj0CuitQCtiuD0AAQD1AACtCuQCuCtAAD0QAAD1iuCtQitCuj1AAQj0AAitiugAmbmbQirCrAADwQAADxCrCrQCrCrDwAAQDxAACrirQCrirAAjxQAAjwirirQirirjxAAQjwAAirCrg");
	this.shape_2.setTransform(0.0182,-0.0036,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#BF651B").s().p("AmeGfQitisAAjzQAAjzCtisQCrisDzAAQDzAACtCsQCsCsgBDzQABDzisCsQitCtjzAAQjzAAiritg");
	this.shape_3.setTransform(0.0669,-0.0036,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-115.1,-115.1,230.3,230.3);


(lib.亮晶晶外 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_120 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(120).call(this.frame_120).wait(1));

	// 圖層_8
	this.instance = new lib.亮晶晶();
	this.instance.setTransform(298.5,83.95,0.6257,0.6257,14.9987,0,0,34.3,37.4);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(11));

	// 圖層_7
	this.instance_1 = new lib.亮晶晶();
	this.instance_1.setTransform(-42.35,298.85,0.6365,0.6365,-14.9997,0,0,34.3,37.3);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(3).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(8));

	// 圖層_6
	this.instance_2 = new lib.亮晶晶();
	this.instance_2.setTransform(125.9,144.2,0.6484,0.6484,14.9987,0,0,34.2,37.4);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(4).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(7));

	// 圖層_5
	this.instance_3 = new lib.亮晶晶();
	this.instance_3.setTransform(188.95,0.95,1.1098,1.1098,29.9993,0,0,34.3,37.3);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(7).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(4));

	// 圖層_4
	this.instance_4 = new lib.亮晶晶();
	this.instance_4.setTransform(251.8,290.7,1,1,-14.9992,0,0,34.1,37.3);
	this.instance_4.alpha = 0;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(9));

	// 圖層_2
	this.instance_5 = new lib.亮晶晶();
	this.instance_5.setTransform(94.45,60.6,0.7591,0.7591,0,0,0,34.2,37.3);
	this.instance_5.alpha = 0;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(1));

	// 圖層_1
	this.instance_6 = new lib.亮晶晶();
	this.instance_6.setTransform(-28.8,58.35,0.619,0.619,-29.9996,0,0,34.3,37.3);
	this.instance_6.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(10).to({_off:false},0).to({alpha:1},9).to({alpha:0},10).to({_off:true},1).wait(11));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-69.6,-53.9,394.79999999999995,389.5);


(lib.xx_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF00").s().p("AAlA2Ig1gsQhag7AAgNQAAg/BqBWQAlAeAlAkQAhAiAAAGQAAAHgFAHQgHAJgMAAQgDAAgrgkg");
	this.shape.setTransform(6.05,6.2809);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFF00").s().p("AhqBZIgDgNQAAgVAjgnQAfgkArghQAtgjAegJQAjgKAAAcQAAAMg0AkIg/ArIglAxQgeAogOAAQgPAAgFgMg");
	this.shape_1.setTransform(7.375,6.9837);

	this.instance = new lib.滑入();
	this.instance.setTransform(-4.05,0.85,1,1,0,0,0,1.2,1.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF6600").s().p("AAlA2Ig1gsQhag7AAgNQAAg/BqBWQAlAeAlAkQAhAiAAAGQAAAHgFAHQgHAJgMAAQgDAAgrgkg");
	this.shape_2.setTransform(6.05,6.2809);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF6600").s().p("AhqBZIgDgNQAAgVAjgnQAfgkArghQAtgjAegJQAjgKAAAcQAAAMg0AkIg/ArIglAxQgeAogOAAQgPAAgFgMg");
	this.shape_3.setTransform(7.375,6.9837);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	// 圖層 1
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FF6600").s().p("ABlETQghgGgegJQgfgJgZgPQgbgPgTgXQgUgWgKgiIgHgcIgCgNIgFgqIgBgOQAAgTADgTIADgLQAJgmAZgdIAJgKIAKgJIAIgFQAMgHAQgBIAKAAIAJAAIAMADQAMAEALAHQARAJASABQARAAASgFIAkgNQATgHASgFQAxACAdAcQAeAcAFAyQAEAvgOAtQgQAtgWAwQgaApgkAZQgjAZguAAIgEAAgAi5DLQgMgBgKgHQgJgHgEgQQgCgEAAgEQgCgEACgFQAAgEAEgEQAcgXAxAFQAIAAAHADQAHACAGAFQAGAGABAIIgCAIQgCAFgDAEQgCAFgDADIgJAFIgJAEQgLAIgMAFQgLADgKAAIgFAAgAjVBQIgHAAQgOACgOgDQgPgCgLgJIgHgGQgKgKgDgQIgCgIQgBgUAQgJQASgJAUgBIAJAAIATADQAkAMAiAPIAHAHIAFAJIABAHQgBAIgEAHQgEAHgHAFQgNAJgPADIgIACIgOAAIgEAAQgGAAgFgDgAiugfQgJgCgJgDQgTgMgUgJQgWgIgRgPQgGgGgEgHQgHgQAEgQIACgIIADgGQAJgMAMgGQANgHAPABQAEAAAFABQAOACALAKIgGgDQADACAEACIAHAFQAOAJANAMIANANIALAPIACAGIAEAIIAHAXQAAAGgCAEQgJAMgNAEQgHACgIAAIgMgBgAhjh4QgOgNgKgOIgFgHIgFgIIgEgGIgGgIIgGgHQgJgHgIgIQgIgIgCgMQgCgNAGgKIAFgHQAJgMANgHQAMgJAPADQARAEAMALQAMANAJAOIAFAHIATAnIADAIIACAIIAAAJIABAJQACAPgFAMQgFAPgPAEIgHABQgRgEgOgMgABghqQgRgHgLgOIgFgHIgEgIIgEgIQgMgmAMghIAEgIQADgJAFgGIAHgGQAJgHAKgDQAMgDAKAAIAGACQAOAJAKANQAKAMAAARIAAAIQgBASgGATIgCAJQgDAWgMAQQgJAOgPAAQgFAAgGgCg");
	this.shape_4.setTransform(-1,-1,1,1,0,0,0,0.2,-0.3);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#8C3800").s().p("ABlETQghgGgegJQgfgJgZgPQgbgPgTgXQgUgWgKgiIgHgcIgCgNIgFgqIgBgOQAAgTADgTIADgLQAJgmAZgdIAJgKIAKgJIAIgFQAMgHAQgBIAKAAIAJAAIAMADQAMAEALAHQARAJASABQARAAASgFIAkgNQATgHASgFQAxACAdAcQAeAcAFAyQAEAvgOAtQgQAtgWAwQgaApgkAZQgjAZguAAIgEAAgAi5DLQgMgBgKgHQgJgHgEgQQgCgEAAgEQgCgEACgFQAAgEAEgEQAcgXAxAFQAIAAAHADQAHACAGAFQAGAGABAIIgCAIQgCAFgDAEQgCAFgDADIgJAFIgJAEQgLAIgMAFQgLADgKAAIgFAAgAjVBQIgHAAQgOACgOgDQgPgCgLgJIgHgGQgKgKgDgQIgCgIQgBgUAQgJQASgJAUgBIAJAAIATADQAkAMAiAPIAHAHIAFAJIABAHQgBAIgEAHQgEAHgHAFQgNAJgPADIgIACIgOAAIgEAAQgGAAgFgDgAiugfQgJgCgJgDQgTgMgUgJQgWgIgRgPQgGgGgEgHQgHgQAEgQIACgIIADgGQAJgMAMgGQANgHAPABQAEAAAFABQAOACALAKIgGgDQADACAEACIAHAFQAOAJANAMIANANIALAPIACAGIAEAIIAHAXQAAAGgCAEQgJAMgNAEQgHACgIAAIgMgBgAhjh4QgOgNgKgOIgFgHIgFgIIgEgGIgGgIIgGgHQgJgHgIgIQgIgIgCgMQgCgNAGgKIAFgHQAJgMANgHQAMgJAPADQARAEAMALQAMANAJAOIAFAHIATAnIADAIIACAIIAAAJIABAJQACAPgFAMQgFAPgPAEIgHABQgRgEgOgMgABghqQgRgHgLgOIgFgHIgEgIIgEgIQgMgmAMghIAEgIQADgJAFgGIAHgGQAJgHAKgDQAMgDAKAAIAGACQAOAJAKANQAKAMAAARIAAAIQgBASgGATIgCAJQgDAWgMAQQgJAOgPAAQgFAAgGgCg");
	this.shape_5.setTransform(1.45,0.45,1,1,0,0,0,0.2,-0.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#CCCC00").s().p("ABeESQghgGgfgKQgegJgagPIgQgKQAXAMAYAHQAfAKAhAGQAwABAkgbQAlgYAagqQAVgwAQgsQAOgtgDgwQgFgxgegdIgGgFQASAIANAMQAeAdAFAxQADAwgOAtQgQAsgVAwQgaAqglAYQgjAaguAAIgDAAgAjADKQgNgBgJgHQgEgDgDgFIAEABQAMABANgFQANgEAKgJIAKgEIAIgFQAEgDACgEQADgEACgGIABgHQAAgFgCgEIAHACQAGACAFAEIAJAUIgBADQgCAGgDAEQgCAEgEADIgIAFIgKAEQgKAJgNAEQgKAEgLAAIgEAAgAjdBPIgGgBQgPADgOgDQgOgDgMgJIgHgFIAIACQAOADAPgDIAGABQAHADAIgBIAPAAIAHgBQAPgDANgKQAHgFAEgGQAFgHAAgJIAAgHIgFgIIASAHIAHAHIAEAHIABAMIAAABQgBAGgEAGQgEAGgHAFQgNAKgPADIgHABIgPAAIgDABQgGAAgGgDgAi1ghQgKgBgIgEQgTgLgVgKQgSgGgPgMIAIADQAVAKATALQAIAEAKABQANADAOgEQANgDAJgMQABgEAAgGIgHgYIgDgIIgCgGIgLgPIgOgNQgMgMgOgIIgEgDQAMADAJAJIgGgEQACADAFACIAHAFQAOAIAMAMIAOANIALAPIACAGIADAIIAHAYQAAAGgBAEQgJAMgNADQgIACgIAAIgLgBgABYhrQgMgFgJgJQAUAEALgRQAMgQAEgXIACgIQAFgTABgTIAAgIQABgQgLgNIgHgIIACAAIAHABQANAKAKAMQALANgBAQIAAAIQgBATgFATIgCAIQgEAXgMAQIgCADIgHACIgVAIIgFgBgAhrh5IgBgCIAIADIAHgBQAPgFAEgOQAFgNgCgPIAAgIIgBgJIgCgIIgCgIIgUgnIgEgIQgJgNgLgMQAOAFAKAJQAMAMAJAOIAEAIIAUAnIACAIIACAIIABAJIAAAIQACAPgFANIgCAGQgNABgKAGIgHAFQgOgFgMgJg");
	this.shape_6.setTransform(2.01,0.9143);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFF00").s().p("ABlETQghgGgegJQgagIgWgMIgIgEQgbgPgTgXQgKgMgIgOIgIgUIgEgKIgHgcIgCgNIgFgpIAAgBIAAgLIgBgDQAAgTADgTIADgLQAJgmAZgdIAJgKIAKgJIABgBIAHgEQAKgGANgCIAFAAIAKAAIAJAAIAMADQAMAEALAHQARAJASABQARAAASgFIAQgGIAUgHIAIgDIAdgJQAtABAcAYIAFAFQAeAcAFAyQAEAvgOAtQgQAtgWAwQgaApgkAZQgjAZguAAIgEAAgAi5DLIgDAAQgLgCgIgGQgJgHgEgQQgCgEAAgEQgCgEACgFQAAgEAEgEQAcgXAxAFQAIAAAHADQAHACAGAFIAFAGQACAEAAAEIgCAIQgCAFgDAEQgCAFgDADIgJAFIgJAEQgLAIgMAFQgLADgKAAIgFAAgAjVBQIgHAAQgOACgOgDIgIgCQgKgDgIgGIgHgGQgKgKgDgQIgCgIQgBgUAQgJQASgJAUgBIAJAAIATADQAkAMAiAPIAHAHIABAAIAEAJIABAHQgBAIgEAHQgEAHgHAFQgNAJgPADIgIACIgOAAIgEAAQgGAAgFgDgAiugfQgJgCgJgDQgTgMgUgJIgJgEQgQgHgOgMQgGgGgEgHQgHgQAEgQIACgIIADgGQAJgMAMgGQANgHAPABQAEAAAFABQAOACALAKIgGgDQADACAEACIAEADIADACQAOAJANAMIANANIALAPIACAGIAEAIIAHAXQAAAGgCAEQgJAMgNAEQgHACgIAAIgMgBgAhMhqQgMgFgLgJQgOgNgKgOIgFgHIgFgIIgEgGIgGgIIgGgHQgJgHgIgIQgIgIgCgMQgCgNAGgKIAFgHQAJgMANgHQAMgJAPADQARAEAMALIACABQALAMAIAOIAFAHIATAnIADAIIACAIIAAAJIABAJQACAPgFAMQgFAPgPAEIgHABIgIgCgABkhpIgEgBQgRgHgLgOIgFgHIgEgIIgEgIQgMgmAMghIAEgIQADgJAFgGIAHgGQAJgHAKgDQAMgDAKAAIAGACQAJAGAHAHIAIAJQAKAMAAARIAAAIQgBASgGATIgCAJQgDAWgMAQQgJAOgPAAIgHgBg");
	this.shape_7.setTransform(-1.2408,-0.7107);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).to({state:[]},1).to({state:[{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_5},{t:this.shape_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-38.8,-30.6,69.8,63);


(lib.元件40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// r3
	this.r3 = new lib.元件9複製2();
	this.r3.name = "r3";
	this.r3.setTransform(87.85,79,1.33,1.33,0,0,0,60.7,56.2);

	this.timeline.addTween(cjs.Tween.get(this.r3).to({scaleX:1.8241,scaleY:1.7394,x:87.8},19).to({scaleX:1.33,scaleY:1.33,x:87.85},20).wait(1));

	// r5
	this.r5 = new lib.元件7複製2();
	this.r5.name = "r5";
	this.r5.setTransform(292.8,78.05,1.33,1.33,0,0,0,13.3,55.5);

	this.timeline.addTween(cjs.Tween.get(this.r5).to({scaleX:1.7621,scaleY:1.8169,x:292.75,y:78.1},19).to({scaleX:1.33,scaleY:1.33,x:292.8,y:78.05},20).wait(1));

	// r4
	this.r4 = new lib.元件11複製2();
	this.r4.name = "r4";
	this.r4.setTransform(131.8,105.65,1.33,1.33,0,0,0,23.1,23.1);

	this.timeline.addTween(cjs.Tween.get(this.r4).wait(26).to({regY:23.2,scaleY:0.1727,y:105.7},3).to({regY:23.1,scaleY:1.33,y:105.65},3).wait(8));

	// r6
	this.r6 = new lib.元件10複製2();
	this.r6.name = "r6";
	this.r6.setTransform(239.7,105.65,1.33,1.33,0,0,0,23.1,23.1);

	this.timeline.addTween(cjs.Tween.get(this.r6).wait(26).to({regY:23.2,scaleY:0.1727,y:105.7},3).to({regY:23.1,scaleY:1.33,y:105.65},3).wait(8));

	// 圖層_2
	this.r2 = new lib.元件18複製2();
	this.r2.name = "r2";
	this.r2.setTransform(187.95,241.2,1.33,1.33,0,0,0,59.1,24.8);

	this.timeline.addTween(cjs.Tween.get(this.r2).to({scaleX:0.968,scaleY:0.968},19).to({scaleX:1.33,scaleY:1.33},20).wait(1));

	// r9
	this.r9 = new lib.元件16複製2();
	this.r9.name = "r9";
	this.r9.setTransform(93.85,172.95,1.33,1.33,0,0,0,68.2,6.4);

	this.timeline.addTween(cjs.Tween.get(this.r9).to({rotation:-14.9993,y:173},19).to({rotation:0,y:172.95},20).wait(1));

	// r8
	this.r8 = new lib.元件15複製2();
	this.r8.name = "r8";
	this.r8.setTransform(95.35,142.45,1.33,1.33,0,0,0,71.7,6.4);

	this.timeline.addTween(cjs.Tween.get(this.r8).to({rotation:14.9993},19).to({rotation:0},20).wait(1));

	// r11
	this.r11 = new lib.元件14複製2();
	this.r11.name = "r11";
	this.r11.setTransform(276.1,172.95,1.33,1.33,0,0,0,0,6.4);

	this.timeline.addTween(cjs.Tween.get(this.r11).to({rotation:14.9993},19).to({rotation:0},20).wait(1));

	// r10
	this.r10 = new lib.元件13複製2();
	this.r10.name = "r10";
	this.r10.setTransform(273.05,142.45,1.33,1.33,0,0,0,0,6.4);

	this.timeline.addTween(cjs.Tween.get(this.r10).to({rotation:-14.9993},19).to({rotation:0},20).wait(1));

	// 圖層_1
	this.r7 = new lib.元件17複製2();
	this.r7.name = "r7";
	this.r7.setTransform(151.55,127.2,1.33,1.33);

	this.r1 = new lib.元件12複製2();
	this.r1.name = "r1";
	this.r1.setTransform(188,153.2,1.33,1.33,0,0,0,115.2,115.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.r1},{t:this.r7}]}).to({state:[{t:this.r1},{t:this.r7}]},19).to({state:[{t:this.r1},{t:this.r7}]},20).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22.9,-22.7,413.59999999999997,329);


(lib.元件39 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
		playSound("dog_puppy_1wav",1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.亮晶晶外();
	this.instance.setTransform(140.8,-22.6,1.1026,1.1026);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,499.3,100.9);


(lib.元件23 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件7_1();
	this.instance.setTransform(25,24.85,0.7241,0.7241,0,0,0,34.5,34.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,49.9,49.8);


(lib.元件18複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件34();
	this.instance.setTransform(-0.05,0,1,1,0,0,0,59.1,27.6);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AjNA9QhYhQgKh1IAAgFIJfAAIgBAFQgJB1hYBQQhYBRh2AAQh1AAhYhRgAjGA4QBVBNBxAAQBxAABWhNQBVhMAKhxIpMAAQALBxBVBMg");
	this.shape.setTransform(0.0169,0.0258,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#990000").s().p("AjLA6QhWhPgKh0IJWAAQgKB0hVBPQhXBQh1AAQh0AAhXhQg");
	this.shape_1.setTransform(0.0169,0.0258,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-59.1,-27.6,118.30000000000001,55.3);


(lib.元件17複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件33();
	this.instance.setTransform(0.05,0,1,1,0,0,0,27.4,23.7);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiMB6ICMjzICNDzgAh9ByID7AAIh+jag");
	this.shape.setTransform(0.0182,0.0286,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A50082").s().p("AiEBzICEjlICFDlg");
	this.shape_1.setTransform(0.0182,0.4178,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-27.3,-23.7,54.7,47.5);


(lib.元件16複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件36();
	this.instance.setTransform(0,0.05,1,1,0,0,0,34.1,6.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(-0.0137,0.0322,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(-0.0137,0.0809,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.元件15複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件35();
	this.instance.setTransform(0,0.05,1,1,0,0,0,34.1,6.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(0.0012,0.021,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(-0.0474,0.0697,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.元件14複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件36();
	this.instance.setTransform(0,0.05,1,1,0,0,0,34.1,6.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(0.0247,0.0322,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg4IFVAAIAAA4g");
	this.shape_1.setTransform(0.0247,0.0809,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.30000000000001,12.7);


(lib.元件13複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件35();
	this.instance.setTransform(0,0.05,1,1,0,0,0,34.1,6.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AiuAhIAAhBIFdAAIAABBgAimAYIFNAAIAAgvIlNAAg");
	this.shape.setTransform(-0.0104,0.021,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#514534").s().p("AiqAcIAAg3IFVAAIAAA3g");
	this.shape_1.setTransform(-0.059,0.0697,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.1,-6.3,68.2,12.7);


(lib.元件12複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件31();
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AmhGiQiuitAAj1QAAj0CuitQCtiuD0AAQD1AACtCuQCuCtAAD0QAAD1iuCtQitCuj1AAQj0AAitiugAmbmbQirCrAADwQAADxCrCrQCrCrDwAAQDxAACrirQCrirAAjxQAAjwirirQirirjxAAQjwAAirCrg");
	this.shape.setTransform(0.0182,-0.0036,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF651B").s().p("AmeGfQitisAAjzQAAjzCtisQCrisDzAAQDzAACtCsQCsCsgBDzQABDzisCsQitCtjzAAQjzAAiritg");
	this.shape_1.setTransform(0.0669,-0.0036,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-115.1,-115.1,230.3,230.3);


(lib.元件11複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件32();
	this.instance.setTransform(0,0,1,1,0,0,0,23.1,23.1);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(0.012,-0.0102,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(0.012,0.0385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgsAAghAgg");
	this.shape_2.setTransform(-0.007,-0.0102,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAigiAuABQAwgBAhAiQAiAhAAAvQAAAvgiAiQghAhgwAAQguAAgighg");
	this.shape_3.setTransform(-0.007,0.0385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-23.1,46.2,46.2);


(lib.元件10複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件32();
	this.instance.setTransform(0,0,1,1,0,0,0,23.1,23.1);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("AgaAbQgLgLAAgQQAAgPALgLQALgLAPAAQAQAAALALQALALAAAPQAAAQgLALQgLALgQAAQgPAAgLgLgAgUgUQgJAJAAALQAAANAJAIQAJAJALAAQAMAAAJgJQAJgIAAgNQAAgLgJgJQgJgJgMAAQgLAAgJAJg");
	this.shape.setTransform(0.03,-0.0102,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#231815").s().p("AgXAYQgKgKAAgOQAAgNAKgKQAKgKANAAQAOAAAKAKQAKAKAAANQAAAOgKAKQgKAKgOAAQgNAAgKgKg");
	this.shape_1.setTransform(-0.0186,0.0385,1.9459,1.9459);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#231815").s().p("AhTBUQgjgjAAgxQAAgwAjgjQAjgjAwAAQAxAAAjAjQAjAjAAAwQAAAxgjAjQgjAjgxAAQgwAAgjgjgAhNhNQggAhAAAsQAAAuAgAgQAgAgAtAAQAuAAAgggQAgggAAguQAAgsggghQggggguAAQgtAAggAgg");
	this.shape_2.setTransform(-0.0145,-0.0102,1.9459,1.9459);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhQBRQgigiAAgvQAAgvAighQAhgiAvABQAvgBAiAiQAiAhAAAvQAAAvgiAiQgiAhgvAAQguAAgighg");
	this.shape_3.setTransform(-0.0145,0.0385,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.1,-23.1,46.2,46.2);


(lib.元件9複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件30();
	this.instance.setTransform(0.05,0,1,1,0,0,0,34.5,34.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgyAxAABFQAABGAyAxQAyAxBEAAQBGAAAxgxQAxgxAAhGQAAhFgxgxQgxgxhGAAQhEAAgyAxg");
	this.shape.setTransform(-0.0071,0.0038,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgygyAAhIQAAhGAygzQAygzBHABQBIgBAyAzQAzAzAABGQAABIgzAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(-0.0071,-0.0449,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-34.4,68.9,68.8);


(lib.元件7複製 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// 圖層_1
	this.instance = new lib.元件30();
	this.instance.setTransform(0.05,0,1,1,0,0,0,34.5,34.4);
	this.instance.alpha = 0.3984;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#231815").s().p("Ah8B9Qg0g0AAhJQAAhIA0g0QA0g0BIAAQBJAAA0A0QA0A0AABIQAABJg0A0Qg0A0hJAAQhIAAg0g0gAh2h2QgxAxAABFQAABGAxAxQAxAxBFAAQBGAAAxgxQAygxgBhGQABhFgygxQgygxhFAAQhFAAgxAxg");
	this.shape.setTransform(-0.0131,0.0038,1.9459,1.9459);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#493A34").s().p("Ah5B6QgzgyAAhIQAAhGAzgzQAygzBHABQBIgBAyAzQAyAzAABGQAABIgyAyQgyAzhIgBQhHABgygzg");
	this.shape_1.setTransform(-0.0131,-0.0449,1.9459,1.9459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-34.4,68.9,68.8);


(lib.元件6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.instance = new lib.元件18();
	this.instance.setTransform(141.3,184.15,1,1,0,0,0,59.1,27.6);

	this.instance_1 = new lib.元件17();
	this.instance_1.setTransform(141.35,119.35,1,1,0,0,0,27.4,23.7);

	this.instance_2 = new lib.元件16();
	this.instance_2.setTransform(36.45,130.05,1,1,0,0,0,34.1,6.4);

	this.instance_3 = new lib.元件15();
	this.instance_3.setTransform(34.1,107.1,1,1,0,0,0,34.1,6.4);

	this.instance_4 = new lib.元件14();
	this.instance_4.setTransform(241.7,130.05,1,1,0,0,0,34.1,6.4);

	this.instance_5 = new lib.元件13();
	this.instance_5.setTransform(239.4,107.1,1,1,0,0,0,34.1,6.4);

	this.instance_6 = new lib.元件11();
	this.instance_6.setTransform(99.6,80.05);

	this.instance_7 = new lib.元件10();
	this.instance_7.setTransform(180.25,79.45,1,1,0,0,0,23.1,23.1);

	this.instance_8 = new lib.元件9();
	this.instance_8.setTransform(39.85,37.6,1,1,0,0,0,34.5,34.4);

	this.instance_9 = new lib.元件7_1();
	this.instance_9.setTransform(241.35,37.6,1,1,0,0,0,34.5,34.4);

	this.instance_10 = new lib.元件12();
	this.instance_10.setTransform(141.35,115.2,1,1,0,0,0,115.2,115.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件6, new cjs.Rectangle(0,0,275.9,230.3), null);


(lib.元件37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 圖層_1
	this.instance = new lib.draged11();
	this.instance.setTransform(577.6,32.5,1,1,0,0,0,33.6,6.3);

	this.instance_1 = new lib.draged10();
	this.instance_1.setTransform(577.6,12.5,1,1,0,0,0,33.6,6.3);

	this.instance_2 = new lib.draged9();
	this.instance_2.setTransform(487.95,32.5,1,1,0,0,0,33.6,6.3);

	this.instance_3 = new lib.draged8();
	this.instance_3.setTransform(487.95,12.5,1,1,0,0,0,33.6,6.3);

	this.instance_4 = new lib.draged7();
	this.instance_4.setTransform(407.4,38.5,1,1,0,0,0,28.6,24.8);

	this.instance_5 = new lib.draged6();
	this.instance_5.setTransform(313.8,14);

	this.instance_6 = new lib.元件23();
	this.instance_6.setTransform(252.35,13.7,1,1,0,0,0,24.9,24.9);

	this.instance_7 = new lib.draged4();
	this.instance_7.setTransform(213,37.4,1,1,0,0,0,23.7,23.7);

	this.instance_8 = new lib.draged3();
	this.instance_8.setTransform(151.1,38.6,1,1,0,0,0,24.9,24.9);

	this.instance_9 = new lib.draged2();
	this.instance_9.setTransform(96.6,29.4,1,1,0,0,0,33.5,15.7);

	this.instance_10 = new lib.draged1();
	this.instance_10.setTransform(24.3,38,1,1,0,0,0,24.3,24.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件37, new cjs.Rectangle(-24.2,-11.2,601.9000000000001,49.900000000000006), null);


// stage content:
(lib.index = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {endframe:279};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,279,281];
	this.streamSoundSymbolsList[0] = [{id:"U4_1",startFrame:0,endFrame:257,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("U4_1",0);
		this.InsertIntoSoundStreamData(soundInstance,0,257,1);
		var _this = this;
		
		_this.xx_btn.on('click', function () {
			window.open('index.html', '_self');
		});
		
		_this.try1_btn.on('click', function () {
			window.open('try1.html', '_self');
		});
		
		_this.try3_btn.on('click', function () {
			window.open('try3.html', '_self');
		});
		
		_this.replay_btn.on('click', function () {
			window.open('try2.html', '_self');
		});
		
		
		this.gotoAndPlay(260);
	}
	this.frame_279 = function() {
		this.stop();
		
		createjs.Touch.enable(stage);
		
		var _this = this;
		
		_this.playSound = function (linkage, type, stopPrevious, props) {
			if (!props)
				props = {};
		
			if (stopPrevious && this[type])
				this[type].stop();
		
			this[type] = createjs.Sound.play(linkage, props);
		};
		
		//_this.wrong_mc.gotoAndStop(0);
		
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//以下拖曳程式碼
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//拖曳區尺寸
		dragHeight = 65;
		dragWidth = 276;
		//感應區尺寸
		destHeight = 46;
		destWidth = 284;
		//設定拖曳區的座標
		var compX = new Array(209.95,278,347.4,411.4,475.4,541.7,603.55,683.15,683.15,768.75,768.75);
		var compY = new Array(526.75,526.75,526.75,526.75,526.75,526.75,526.75,518.2,538.2,518.2,538.2);
		var sencerX = new Array(455.05,455.55,319.8,399.35,588.3,507.7,455.75,312.7,315.85,585.75,588.8);
		var sencerY = new Array(282.8,375.5,180.5,236.75,180.05,236.25,288.5,272.75,302.75,272.75,303.25);
		var compW = new Array(48.6,67.1,49.9,47.45,49.9,47.4,57.2,67.25,67.25,67.25,67.25);
		var compH = new Array(48.6,31.35,49.8,47.45,49.8,47.4,49.55,12.55,12.55,12.55,12.55);
		var sencerW = new Array(306.3,157.3,91.6,61.4,91.6,61.4,72.85,90.7,90.7,90.7,90.7);
		var sencerH = new Array(306.3,73.45,91.5,61.4,91.5,61.4,63.1,16.95,16.95,16.95,16.95);
		var i;
		var compBounds = new Array();
		var sencerBounds = new Array();
		
		//設定感應區的座標。只秀出一個感應區，其他都在舞台外
		/*var sencerX = new Array(234.3, 234.3, 450, 450);
		var sencerY = new Array(95.45, 230.05, 95.45, 230.05);*/
		
		
		//========================================亂數亂數亂數======================================================
		
		///--------在0~n中隨機取一數-------------------------------------
		function getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max));
		}
		//-----------------------------------------------------------------
		
		// 產生 0 到 (n - 1) 不重複亂數陣列---n:總數--m:起始數字---------
		var frameAry = genRandomArray(4, 0);
		
		function genRandomArray(n, m) {
			var ary = [];
			var i, r, t;
			for (i = 0; i < n; ++i) {
				ary[i] = i + m;
			}
			for (i = 0; i < n; ++i) {
				r = Math.floor((Math.random() * n));
				t = ary[r];
				ary[r] = ary[i];
				ary[i] = t;
			}
			return ary;
		}
		//==========================================================================================================
		
		
		//從元件庫呼叫感應元件到舞台
		var sen1 = new lib.sencer1();
		var sen2 = new lib.sencer2();
		var sen3 = new lib.sencer3();
		var sen4 = new lib.sencer4();
		var sen5 = new lib.sencer5();
		var sen6 = new lib.sencer6();
		var sen7 = new lib.sencer7();
		var sen8 = new lib.sencer8();
		var sen9 = new lib.sencer9();
		var sen10 = new lib.sencer10();
		var sen11 = new lib.sencer11();
		//從元件庫呼叫拖曳元件到舞台
		var comp1 = new lib.draged1();
		var comp2 = new lib.draged2();
		var comp3 = new lib.draged3();
		var comp4 = new lib.draged4();
		var comp5 = new lib.draged5();
		var comp6 = new lib.draged6();
		var comp7 = new lib.draged7();
		var comp8 = new lib.draged8();
		var comp9 = new lib.draged9();
		var comp10 = new lib.draged10();
		var comp11 = new lib.draged11();
		//宣告感應區容器
		var destination1 = new createjs.Container();
		var destination2 = new createjs.Container();
		var destination3 = new createjs.Container();
		var destination4 = new createjs.Container();
		var destination5 = new createjs.Container();
		var destination6 = new createjs.Container();
		var destination7 = new createjs.Container();
		var destination8 = new createjs.Container();
		var destination9 = new createjs.Container();
		var destination10 = new createjs.Container();
		var destination11 = new createjs.Container();
		//宣告拖曳區容器
		var dragger1 = new createjs.Container();
		var dragger2 = new createjs.Container();
		var dragger3 = new createjs.Container();
		var dragger4 = new createjs.Container();
		var dragger5 = new createjs.Container();
		var dragger6 = new createjs.Container();
		var dragger7 = new createjs.Container();
		var dragger8 = new createjs.Container();
		var dragger9 = new createjs.Container();
		var dragger10 = new createjs.Container();
		var dragger11 = new createjs.Container();
		//感應區裝進容器
		
		//拖曳區裝進容器
		for (i = 0; i < 11; i++) {
			eval('destination' + (i + 1)).addChild(eval('sen' + (i + 1)));
			eval("dragger" + (i + 1)).addChild(eval("comp" + (i + 1)));
		}
		
		
		//設定感應容器尺寸，設定拖曳容器尺寸
		for (i = 0; i < 11; i++) {
			eval("destination" + (i + 1)).setBounds(sencerX[i], sencerY[i], sencerW[i], sencerH[i]);
			eval("dragger" + (i + 1)).setBounds(compX[i], compY[i], compW[i], compH[i]);
		}
		
		
		//將容器放在指定座標
		DesPos();
		draggerPos();
		//DRAG FUNCTIONALITY ================================================拖曳動作設定
		/*
		pressMove(拖曳, 感應, 接觸, 原座標, 音檔)
		                                      |-->>影格+1就是音檔的數字*******************************************************
		*/
		for (i = 0; i < 11; i++) {
			pressMove(eval("dragger" + (i + 1)), eval("destination" + (i + 1)), i);
		}
		
		function pressMove(dragmc, dest, ary) {
			//dragmc.on("mouseover", function (evt) {
			//	stage.update();
			//});
			//dragmc.on("mouseout", function (evt) {
			//	//createjs.Sound.stop();
			//	stage.update();
			//});
			dragmc.on("pressmove", function (evt) {
				//var px = this.globalToLocal(evt.stageX,evt.stageY)
				//evt.currentTarget.x = px.x;//evt.stageX;
				//evt.currentTarget.y = px.y;//evt.stageY;
				evt.currentTarget.x = evt.stageX/stage.scaleX;
				evt.currentTarget.y = evt.stageY/stage.scaleY;
				stage.update();
				if (intersect(evt.currentTarget, dest)) {
					evt.currentTarget.alpha = 0.2;
				} else {
					evt.currentTarget.alpha = 1;
				}
			});
			dragmc.on("pressup", function (evt) {
				if (intersect(evt.currentTarget, dest)) {
					//_this.play();
					stage.update(evt);
					console.log("Match!!!!!!!!!!!!");
					_this.playSound("right" + (getRandomInt(4) + 1), "sfx", true);
					//MouseEnabled();
				} else {
					//_this.wrong_mc.play();
					_this.playSound("wrong" + (getRandomInt(4) + 1), "sfx", true);
					dragmc.x = compX[ary];
					dragmc.y = compY[ary];
				}
			});
		}
		
		//Mouse UP and SNAP====================
		function MouseEnabled() {
			for (i = 0; i < 11; i++) {
				stage.removeChild(eval("destination" + (i + 1)), eval("dragger" + (i + 1)));
			}
		}
		
		function intersect(obj1, obj2) {
			var objBounds1 = obj1.getBounds().clone();
			var objBounds2 = obj2.getBounds().clone();
			console.log("objBounds1 = "+objBounds1);
			console.log("objBounds2 = "+objBounds2);
			var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
			console.log("pt = "+pt);
			var h1 = -((objBounds2.height * 2) - objBounds1.height);
			var h2 = objBounds2.height / 2 + (objBounds1.height / 2);
			var w1 = -((objBounds2.width * 2) - objBounds1.width);
			var w2 = (objBounds2.width / 2) + (objBounds1.width / 2);	
			console.log("h1 = "+h1);
			console.log("h2 = "+h2);
			console.log("w1 = "+w1);
			console.log("w2 = "+w2);
			if (pt.x > w2 || pt.x < w1) return false;
			if (pt.y > h2 || pt.y < h1) return false;
			return true;
		}
		
		//Adds the object into stage
		for (i = 0; i < 11; i++) {
			stage.addChild(eval("destination" + (i + 1)), eval("dragger" + (i + 1)));
		}
		
		stage.mouseMoveOutside = true;
		stage.update();
		
		function DesPos() {
			for (i = 0; i < 11; i++) {
				eval("destination" + (i + 1)).x = sencerX[i];
				eval("destination" + (i + 1)).y = sencerY[i];
			    eval("destination" + (i + 1)).alpha = 0.5;
			}
		}
		
		function draggerPos() {
			for (i = 0; i < 11; i++) {
				eval("dragger" + (i + 1)).x = compX[i];
				eval("dragger" + (i + 1)).y = compY[i];
			}
		}
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	}
	this.frame_281 = function() {
		this.stop();
		
		//***************程式碼備份********************程式碼備份*********************程式碼備份***********程式碼備份**********************
		//this.stop();
		
		
		//var _this = this;
		
		//_this.playSound = function (linkage, type, stopPrevious, props) {
		//	if (!props)
		//		props = {};
		
		//	if (stopPrevious && this[type])
		//		this[type].stop();
		
		//	this[type] = createjs.Sound.play(linkage, props);
		//};
		
		////_this.wrong_mc.gotoAndStop(0);
		
		////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		////以下拖曳程式碼
		////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		////拖曳區尺寸
		//dragHeight = 65;
		//dragWidth = 276;
		////感應區尺寸
		//destHeight = 46;
		//destWidth = 284;
		////設定拖曳區的座標
		//var compX = new Array(209.95,278,347.4,411.4,475.4,541.7,603.55,683.15,683.15,768.75,768.75);
		//var compY = new Array(526.75,526.75,526.75,526.75,526.75,526.75,526.75,518.2,538.2,518.2,538.2);
		//var sencerX = new Array(455.05,455.55,319.8,399.35,588.3,507.7,455.75,312.7,315.85,585.75,588.8);
		//var sencerY = new Array(282.8,375.5,180.5,236.75,180.05,236.25,288.5,272.75,302.75,272.75,303.25);
		//var compW = new Array(48.6,67.1,49.9,47.45,49.9,47.4,57.2,67.25,67.25,67.25,67.25);
		//var compH = new Array(48.6,31.35,49.8,47.45,49.8,47.4,49.55,12.55,12.55,12.55,12.55);
		//var sencerW = new Array(306.3,157.3,91.6,61.4,91.6,61.4,72.85,90.7,90.7,90.7,90.7);
		//var sencerH = new Array(306.3,73.45,91.5,61.4,91.5,61.4,63.1,16.95,16.95,16.95,16.95);
		//var i;
		//var compBounds = new Array();
		//var sencerBounds = new Array();
		
		////設定感應區的座標。只秀出一個感應區，其他都在舞台外
		///*var sencerX = new Array(234.3, 234.3, 450, 450);
		//var sencerY = new Array(95.45, 230.05, 95.45, 230.05);*/
		
		
		////========================================亂數亂數亂數======================================================
		
		/////--------在0~n中隨機取一數-------------------------------------
		//function getRandomInt(max) {
		//	return Math.floor(Math.random() * Math.floor(max));
		//}
		////-----------------------------------------------------------------
		
		//// 產生 0 到 (n - 1) 不重複亂數陣列---n:總數--m:起始數字---------
		//var frameAry = genRandomArray(4, 0);
		
		//function genRandomArray(n, m) {
		//	var ary = [];
		//	var i, r, t;
		//	for (i = 0; i < n; ++i) {
		//		ary[i] = i + m;
		//	}
		//	for (i = 0; i < n; ++i) {
		//		r = Math.floor((Math.random() * n));
		//		t = ary[r];
		//		ary[r] = ary[i];
		//		ary[i] = t;
		//	}
		//	return ary;
		//}
		////==========================================================================================================
		
		
		////從元件庫呼叫感應元件到舞台
		//var sen1 = new lib.sencer1();
		//var sen2 = new lib.sencer2();
		//var sen3 = new lib.sencer3();
		//var sen4 = new lib.sencer4();
		//var sen5 = new lib.sencer5();
		//var sen6 = new lib.sencer6();
		//var sen7 = new lib.sencer7();
		//var sen8 = new lib.sencer8();
		//var sen9 = new lib.sencer9();
		//var sen10 = new lib.sencer10();
		//var sen11 = new lib.sencer11();
		////從元件庫呼叫拖曳元件到舞台
		//var comp1 = new lib.draged1();
		//var comp2 = new lib.draged2();
		//var comp3 = new lib.draged3();
		//var comp4 = new lib.draged4();
		//var comp5 = new lib.draged5();
		//var comp6 = new lib.draged6();
		//var comp7 = new lib.draged7();
		//var comp8 = new lib.draged8();
		//var comp9 = new lib.draged9();
		//var comp10 = new lib.draged10();
		//var comp11 = new lib.draged11();
		////宣告感應區容器
		//var destination1 = new createjs.Container();
		//var destination2 = new createjs.Container();
		//var destination3 = new createjs.Container();
		//var destination4 = new createjs.Container();
		//var destination5 = new createjs.Container();
		//var destination6 = new createjs.Container();
		//var destination7 = new createjs.Container();
		//var destination8 = new createjs.Container();
		//var destination9 = new createjs.Container();
		//var destination10 = new createjs.Container();
		//var destination11 = new createjs.Container();
		////宣告拖曳區容器
		//var dragger1 = new createjs.Container();
		//var dragger2 = new createjs.Container();
		//var dragger3 = new createjs.Container();
		//var dragger4 = new createjs.Container();
		//var dragger5 = new createjs.Container();
		//var dragger6 = new createjs.Container();
		//var dragger7 = new createjs.Container();
		//var dragger8 = new createjs.Container();
		//var dragger9 = new createjs.Container();
		//var dragger10 = new createjs.Container();
		//var dragger11 = new createjs.Container();
		////感應區裝進容器
		///*destination1.addChild(sen1);
		//destination2.addChild(sen2);
		//destination3.addChild(sen3);
		//destination4.addChild(sen4);
		//destination5.addChild(sen5);
		//destination6.addChild(sen6);
		//destination7.addChild(sen7);
		//destination8.addChild(sen8);
		//destination9.addChild(sen9);
		//destination10.addChild(sen10);
		//destination11.addChild(sen11);*/
		////拖曳區裝進容器
		//for (i = 0; i < 11; i++) {
		//	eval('destination' + (i + 1)).addChild(eval('sen' + (i + 1)));
		//	eval("dragger" + (i + 1)).addChild(eval("comp" + (i + 1)));
		//}
		///*dragger1.addChild(comp1);
		//dragger2.addChild(comp2);
		//dragger3.addChild(comp3);
		//dragger4.addChild(comp4);
		//dragger5.addChild(comp5);
		//dragger6.addChild(comp6);
		//dragger7.addChild(comp7);
		//dragger8.addChild(comp8);
		//dragger9.addChild(comp9);
		//dragger10.addChild(comp10);
		//dragger11.addChild(comp11);*/
		
		////設定感應容器尺寸，設定拖曳容器尺寸
		//for (i = 0; i < 11; i++) {
		//	eval("destination" + (i + 1)).setBounds(sencerX[i], sencerY[i], sencerW[i], sencerH[i]);
		//	eval("dragger" + (i + 1)).setBounds(compX[i], compY[i], compW[i], compH[i]);
		//}
		
		///*destination1.setBounds(sencerX[0], sencerY[0], sencerW[0], sencerH[0]);
		//destination2.setBounds(sencerX[1], sencerY[1], sencerW[1], sencerH[1]);
		//destination3.setBounds(sencerX[2], sencerY[2], sencerW[2], sencerH[2]);
		//destination4.setBounds(sencerX[3], sencerY[3], sencerW[3], sencerH[3]);
		//destination5.setBounds(sencerX[4], sencerY[4], sencerW[4], sencerH[4]);
		//destination6.setBounds(sencerX[5], sencerY[5], sencerW[5], sencerH[5]);
		//destination7.setBounds(sencerX[6], sencerY[6], sencerW[6], sencerH[6]);
		//destination8.setBounds(sencerX[7], sencerY[7], sencerW[7], sencerH[7]);
		//destination9.setBounds(sencerX[8], sencerY[8], sencerW[8], sencerH[8]);
		//destination10.setBounds(sencerX[9], sencerY[9], sencerW[9], sencerH[9]);
		//destination11.setBounds(sencerX[10], sencerY[10], sencerW[10], sencerH[10]);
		//dragger1.setBounds(compX[0], compY[0], compW[0], compH[0]);
		//dragger2.setBounds(compX[1], compY[1], compW[1], compH[1]);
		//dragger3.setBounds(compX[2], compY[2], compW[2], compH[2]);
		//dragger4.setBounds(compX[3], compY[3], compW[3], compH[3]);
		//dragger5.setBounds(compX[4], compY[4], compW[4], compH[4]);
		//dragger6.setBounds(compX[5], compY[5], compW[5], compH[5]);
		//dragger7.setBounds(compX[6], compY[6], compW[6], compH[6]);
		//dragger8.setBounds(compX[7], compY[7], compW[7], compH[7]);
		//dragger9.setBounds(compX[8], compY[8], compW[8], compH[8]);
		//dragger10.setBounds(compX[9], compY[9], compW[9], compH[9]);
		//dragger11.setBounds(compX[10], compY[10], compW[10], compH[10]);*/
		
		////將容器放在指定座標
		//DesPos();
		//draggerPos();
		////DRAG FUNCTIONALITY ================================================拖曳動作設定
		///*
		//pressMove(拖曳, 感應, 接觸, 原座標, 音檔)
		//                                      |-->>影格+1就是音檔的數字*******************************************************
		//*/
		//for (i = 0; i < 11; i++) {
		//	pressMove(eval("dragger" + (i + 1)), eval("destination" + (i + 1)), i);
		//}
		
		///*pressMove(dragger1, destination1, 0)
		//pressMove(dragger2, destination2, 1)
		//pressMove(dragger3, destination3, 2)
		//pressMove(dragger4, destination4, 3)
		//pressMove(dragger5, destination5, 4)
		//pressMove(dragger6, destination6, 5)
		//pressMove(dragger7, destination7, 6)
		//pressMove(dragger8, destination8, 7)
		//pressMove(dragger9, destination9, 8)
		//pressMove(dragger10, destination10, 9)
		//pressMove(dragger11, destination11, 10)*/
		
		
		//function pressMove(dragmc, dest, ary) {
		//	dragmc.on("mouseover", function (evt) {
		//		stage.update();
		//	});
		//	dragmc.on("mouseout", function (evt) {
		//		//createjs.Sound.stop();
		//		stage.update();
		//	});
		//	dragmc.on("pressmove", function (evt) {
		//		evt.currentTarget.x = evt.stageX;
		//		evt.currentTarget.y = evt.stageY;
		//		stage.update();
		//		if (intersect(evt.currentTarget, dest)) {
		//			evt.currentTarget.alpha = 0.2;
		//		} else {
		//			evt.currentTarget.alpha = 1;
		//		}
		//	});
		//	dragmc.on("pressup", function (evt) {
		//		if (intersect(evt.currentTarget, dest)) {
		//			_this.play();
		//			stage.update(evt);
		//			console.log("Match!!!!!!!!!!!!");
		//			_this.playSound("right" + (getRandomInt(4) + 1), "sfx", true);
		//			//MouseEnabled();
		//		} else {
		//			//_this.wrong_mc.play();
		//			_this.playSound("wrong" + (getRandomInt(4) + 1), "sfx", true);
		//			dragmc.x = compX[ary];
		//			dragmc.y = compY[ary];
		//		}
		//	});
		//}
		
		////Mouse UP and SNAP====================
		//function MouseEnabled() {
		//	for (i = 0; i < 11; i++) {
		//		stage.removeChild(eval("destination" + (i + 1)), eval("dragger" + (i + 1)));
		//	}
		//	/*stage.removeChild(destination1, dragger1);
		//	stage.removeChild(destination2, dragger2);
		//	stage.removeChild(destination3, dragger3);
		//	stage.removeChild(destination4, dragger4);*/
		//}
		//function intersect(obj1, obj2) {
		//	var objBounds1 = obj1.getBounds().clone();
		//	var objBounds2 = obj2.getBounds().clone();
		//	//console.log("objBounds1 = "+objBounds1);
		//	//console.log("objBounds2 = "+objBounds2);
		//	var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
		//	//console.log("pt = "+pt);
		//	var h1 = -((objBounds2.height * 2) - objBounds1.height);
		//	var h2 = objBounds2.height / 2 + (objBounds1.height / 2);
		//	var w1 = -((objBounds2.width * 2) - objBounds1.width);
		//	var w2 = (objBounds2.width / 2) + (objBounds1.width / 2);
		//	/*console.log("h1 = "+h1);
		//	console.log("h2 = "+h2);
		//	console.log("w1 = "+w1);
		//	console.log("w2 = "+w2);*/
		//	if (pt.x > w2 || pt.x < w1) return false;
		//	if (pt.y > h2 || pt.y < h1) return false;
		//	return true;
		//}
		
		
		////Adds the object into stage
		//for (i = 0; i < 11; i++) {
		//	stage.addChild(eval("destination" + (i + 1)), eval("dragger" + (i + 1)));
		//}
		///*stage.addChild(destination1, dragger1);
		//stage.addChild(destination2, dragger2);
		//stage.addChild(destination3, dragger3);
		//stage.addChild(destination4, dragger4);
		//stage.addChild(destination5, dragger5);
		//stage.addChild(destination6, dragger6);
		//stage.addChild(destination7, dragger7);
		//stage.addChild(destination8, dragger8);
		//stage.addChild(destination9, dragger9);
		//stage.addChild(destination10, dragger10);
		//stage.addChild(destination11, dragger11);*/
		
		//stage.mouseMoveOutside = true;
		//stage.update();
		
		
		//function DesPos() {
		//	for (i = 0; i < 11; i++) {
		//		//eval("sen" + (i + 1)).x = sencerX[i];
		//		//eval("sen" + (i + 1)).y = sencerY[i];
		//		eval("destination" + (i + 1)).x = sencerX[i];
		//		eval("destination" + (i + 1)).y = sencerY[i];
		//	}
		///*	destination1.x = sencerX[0];
		//	destination2.x = sencerX[1];
		//	destination3.x = sencerX[2];
		//	destination4.x = sencerX[3];
		//	destination1.y = sencerY[0];
		//	destination2.y = sencerY[1];
		//	destination3.y = sencerY[2];
		//	destination4.y = sencerY[3];
		//	destination5.x = sencerX[4];
		//	destination6.x = sencerX[5];
		//	destination7.x = sencerX[6];
		//	destination8.x = sencerX[7];
		//	destination5.y = sencerY[4];
		//	destination6.y = sencerY[5];
		//	destination7.y = sencerY[6];
		//	destination8.y = sencerY[7];
		//	destination9.x = sencerX[8];
		//	destination10.x = sencerX[9];
		//	destination11.x = sencerX[10];
		//	destination9.y = sencerY[8];
		//	destination10.y = sencerY[9];
		//	destination11.y = sencerY[10];*/
		//}
		
		//function draggerPos() {
		//	for (i = 0; i < 11; i++) {
		//		//eval("comp" + (i + 1)).x = compX[i];
		//		//eval("comp" + (i + 1)).y = compY[i];
		//		eval("dragger" + (i + 1)).x = compX[i];
		//		eval("dragger" + (i + 1)).y = compY[i];
		//	}
		///*	dragger1.x = compX[0];
		//	dragger2.x = compX[1];
		//	dragger3.x = compX[2];
		//	dragger4.x = compX[3];
		//	dragger1.y = compY[0];
		//	dragger2.y = compY[1];
		//	dragger3.y = compY[2];
		//	dragger4.y = compY[3];
		//	dragger5.x = compX[4];
		//	dragger6.x = compX[5];
		//	dragger7.x = compX[6];
		//	dragger8.x = compX[7];
		//	dragger5.y = compY[4];
		//	dragger6.y = compY[5];
		//	dragger7.y = compY[6];
		//	dragger8.y = compY[7];
		//	dragger9.x = compX[8];
		//	dragger10.x = compX[9];
		//	dragger11.x = compX[10];
		//	dragger9.y = compY[8];
		//	dragger10.y = compY[9];
		//	dragger11.y = compY[10];*/
		//}
		////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(279).call(this.frame_279).wait(2).call(this.frame_281).wait(1));

	// xx
	this.xx_btn = new lib.xx_btn();
	this.xx_btn.name = "xx_btn";
	this.xx_btn.setTransform(850.35,41.4);
	new cjs.ButtonHelper(this.xx_btn, 0, 1, 2, false, new lib.xx_btn(), 3);

	this.replay_btn = new lib.replay_red();
	this.replay_btn.name = "replay_btn";
	this.replay_btn.setTransform(139.7,541.05);
	new cjs.ButtonHelper(this.replay_btn, 0, 1, 2, false, new lib.replay_red(), 3);

	this.try1_btn = new lib.play();
	this.try1_btn.name = "try1_btn";
	this.try1_btn.setTransform(47.8,541.25,0.8489,0.8491);
	new cjs.ButtonHelper(this.try1_btn, 0, 1, 2, false, new lib.play(), 3);

	this.try3_btn = new lib.元件7();
	this.try3_btn.name = "try3_btn";
	this.try3_btn.setTransform(92.95,541,0.793,0.793,0,0,0,19.4,19.5);
	new cjs.ButtonHelper(this.try3_btn, 0, 1, 2, false, new lib.元件7(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.try3_btn},{t:this.try1_btn},{t:this.replay_btn},{t:this.xx_btn}]}).wait(282));

	// 標
	this.instance = new lib.元件8();
	this.instance.setTransform(473.8,257,0.1407,0.1407,0,0,0,211.8,38.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:211.7,regY:38.9,scaleX:1.3492,scaleY:1.3492},7).to({scaleX:1,scaleY:1},6).to({scaleX:0.6663,scaleY:0.6663,x:455.75,y:26.05},9).wait(260));

	// 圖層_6
	this.instance_1 = new lib.元件37();
	this.instance_1.setTransform(1206.65,539.45,1,1,0,0,0,305.6,26.1);
	this.instance_1.shadow = new cjs.Shadow("rgba(255,0,0,1)",0,0,0);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(137).to({_off:false},0).to({x:520.9},10).to({_off:true},131).wait(4));

	// 圖層_4
	this.instance_2 = new lib.元件6();
	this.instance_2.setTransform(450.6,283,0.1562,0.1562,0,0,0,138,115.3);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(62).to({_off:false},0).to({regX:137.9,regY:115.2,scaleX:1.6424,scaleY:1.6424},6).to({scaleX:1.33,scaleY:1.33},6).wait(13).to({rotation:-9.961,y:283.05},0).wait(7).to({regX:138,rotation:5.0392,x:450.7,y:282.95},0).wait(7).to({regX:137.9,rotation:0,x:450.6,y:283},0).wait(87).to({scaleX:3.7434,scaleY:3.7434,x:450.55,y:283.15},0).to({scaleX:1.33,scaleY:1.33,x:450.6,y:283},15).wait(74).to({_off:true},1).wait(4));

	// 圖層_2
	this.instance_3 = new lib.sencer2();
	this.instance_3.setTransform(1431.8,365.5,1.33,1.33);

	this.instance_4 = new lib.sencer7();
	this.instance_4.setTransform(1432,278.5,1.33,1.33);

	this.instance_5 = new lib.sencer9();
	this.instance_5.setTransform(1292.1,292.75,1.33,1.33);

	this.instance_6 = new lib.sencer8();
	this.instance_6.setTransform(1288.95,262.75,1.33,1.33);

	this.instance_7 = new lib.sencer11();
	this.instance_7.setTransform(1565.05,293.25,1.33,1.33);

	this.instance_8 = new lib.sencer10();
	this.instance_8.setTransform(1562,262.75,1.33,1.33);

	this.instance_9 = new lib.sencer4();
	this.instance_9.setTransform(1375.6,226.75,1.33,1.33);

	this.instance_10 = new lib.sencer6();
	this.instance_10.setTransform(1483.95,226.25,1.33,1.33);

	this.instance_11 = new lib.sencer3();
	this.instance_11.setTransform(1296.05,170.05,1.33,1.33);

	this.instance_12 = new lib.sencer5();
	this.instance_12.setTransform(1564.55,170.05,1.33,1.33);

	this.instance_13 = new lib.sencer1();
	this.instance_13.setTransform(1431.3,272.8,1.33,1.33);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]},278).wait(4));

	// 圖層_8
	this.light = new lib.元件39();
	this.light.name = "light";
	this.light.setTransform(475.4,180.05,1,1,0,0,0,304.6,31.2);

	this.btn5 = new lib.draged5();
	this.btn5.name = "btn5";
	this.btn5.setTransform(475.4,706.75);
	new cjs.ButtonHelper(this.btn5, 0, 1, 1);

	this.btn11 = new lib.draged11();
	this.btn11.name = "btn11";
	this.btn11.setTransform(768.75,718.2);
	new cjs.ButtonHelper(this.btn11, 0, 1, 1);

	this.btn10 = new lib.draged10();
	this.btn10.name = "btn10";
	this.btn10.setTransform(768.75,698.2);
	new cjs.ButtonHelper(this.btn10, 0, 1, 1);

	this.btn9 = new lib.draged9();
	this.btn9.name = "btn9";
	this.btn9.setTransform(683.15,718.2);
	new cjs.ButtonHelper(this.btn9, 0, 1, 1);

	this.btn8 = new lib.draged8();
	this.btn8.name = "btn8";
	this.btn8.setTransform(683.15,698.2);
	new cjs.ButtonHelper(this.btn8, 0, 1, 1);

	this.btn7 = new lib.draged7();
	this.btn7.name = "btn7";
	this.btn7.setTransform(603.55,706.75);
	new cjs.ButtonHelper(this.btn7, 0, 1, 1);

	this.btn6 = new lib.draged6();
	this.btn6.name = "btn6";
	this.btn6.setTransform(541.7,706.75);
	new cjs.ButtonHelper(this.btn6, 0, 1, 1);

	this.btn4 = new lib.draged4();
	this.btn4.name = "btn4";
	this.btn4.setTransform(411.4,706.75);
	new cjs.ButtonHelper(this.btn4, 0, 1, 1);

	this.btn3 = new lib.draged3();
	this.btn3.name = "btn3";
	this.btn3.setTransform(347.4,706.75);
	new cjs.ButtonHelper(this.btn3, 0, 1, 1);

	this.btn2 = new lib.draged2();
	this.btn2.name = "btn2";
	this.btn2.setTransform(278,706.75);
	new cjs.ButtonHelper(this.btn2, 0, 1, 1);

	this.btn1 = new lib.draged1();
	this.btn1.name = "btn1";
	this.btn1.setTransform(209.95,706.75);
	new cjs.ButtonHelper(this.btn1, 0, 1, 1);

	this.r2 = new lib.元件18複製();
	this.r2.name = "r2";
	this.r2.setTransform(455.55,375.5,1.33,1.33);

	this.r7 = new lib.元件17複製();
	this.r7.name = "r7";
	this.r7.setTransform(455.75,288.5,1.33,1.33);

	this.r9 = new lib.元件16複製();
	this.r9.name = "r9";
	this.r9.setTransform(315.85,302.75,1.33,1.33);

	this.r8 = new lib.元件15複製();
	this.r8.name = "r8";
	this.r8.setTransform(312.7,272.75,1.33,1.33);

	this.r11 = new lib.元件14複製();
	this.r11.name = "r11";
	this.r11.setTransform(588.8,303.25,1.33,1.33);

	this.r10 = new lib.元件13複製();
	this.r10.name = "r10";
	this.r10.setTransform(585.75,272.75,1.33,1.33);

	this.r4 = new lib.元件11複製();
	this.r4.name = "r4";
	this.r4.setTransform(399.35,236.75,1.33,1.33);

	this.r6 = new lib.元件10複製();
	this.r6.name = "r6";
	this.r6.setTransform(507.7,236.25,1.33,1.33);

	this.r3 = new lib.元件9複製();
	this.r3.name = "r3";
	this.r3.setTransform(319.8,180.05,1.33,1.33);

	this.r5 = new lib.元件7複製();
	this.r5.name = "r5";
	this.r5.setTransform(588.3,180.05,1.33,1.33);

	this.r1 = new lib.元件12複製();
	this.r1.name = "r1";
	this.r1.setTransform(455.05,282.8,1.33,1.33);

	this.instance_14 = new lib.元件40();
	this.instance_14.setTransform(450.7,283.05,1,1,0,0,0,183.4,153.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.r1},{t:this.r5},{t:this.r3},{t:this.r6},{t:this.r4},{t:this.r10},{t:this.r11},{t:this.r8},{t:this.r9},{t:this.r7},{t:this.r2},{t:this.btn1},{t:this.btn2},{t:this.btn3},{t:this.btn4},{t:this.btn6},{t:this.btn7},{t:this.btn8},{t:this.btn9},{t:this.btn10},{t:this.btn11},{t:this.btn5},{t:this.light}]},278).to({state:[{t:this.instance_14}]},3).wait(1));

	// 板版
	this.instance_15 = new lib.元件5();
	this.instance_15.setTransform(454.5,286.5,1,1,0,0,0,344.9,222.1);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(22).to({_off:false},0).wait(210).to({scaleX:1.2072,scaleY:1.2072},5).to({scaleX:1,scaleY:1},5).wait(40));

	// 底
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#33CCCC").s().p("EhvvBG1MAAAiNpMDffAAAMAAACNpg");
	this.shape.setTransform(452.35,295.2,1,1,0,0,0,-0.5,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(282));

	// stageBackground
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(0,0,0,0)").ss(1,1,1,3,true).p("EhH3gu3MCPvAAAMAAABdvMiPvAAAg");
	this.shape_1.setTransform(450,290);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#009999").s().p("EhH3Au4MAAAhdvMCPvAAAMAAABdvg");
	this.shape_2.setTransform(450,290);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(282));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(187.6,131.9,1422.8000000000002,616.7);
// library properties:
lib.properties = {
	id: '1D18AF0240BE824F901D11C8697E8AEC',
	width: 900,
	height: 580,
	fps: 24,
	color: "#009999",
	opacity: 1.00,
	manifest: [
		{src:"sounds/q1.mp3?1610185564748", id:"q1"},
		{src:"sounds/title.mp3?1610185564748", id:"title"},
		{src:"sounds/q2.mp3?1610185564748", id:"q2"},
		{src:"sounds/q3.mp3?1610185564748", id:"q3"},
		{src:"sounds/q4.mp3?1610185564748", id:"q4"},
		{src:"sounds/dog_puppy_1wav.mp3?1610185564748", id:"dog_puppy_1wav"},
		{src:"sounds/letgo.mp3?1610185564748", id:"letgo"},
		{src:"sounds/finish.mp3?1610185564748", id:"finish"},
		{src:"sounds/U4_1.mp3?1610185564748", id:"U4_1"},
		{src:"sounds/kiki.mp3?1610185564748", id:"kiki"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['1D18AF0240BE824F901D11C8697E8AEC'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;