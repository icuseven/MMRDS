function PageLocationInHierarchy() {
	this.channel = new String;
	this.level = new Array(6);

	this.setChannel = function(channel_str) { this.channel = channel_str; }
	this.setLevel = function(lvl,lvl_str) {
		if((lvl > 5)||(lvl < 0)) { }
		else if(typeof this.level[lvl]=="undefined") {
			this.level[lvl]=lvl_str;
		}
		else { }
	}
	this.setLevel1 = function(level_1) { this.setLevel(0,level_1); }
	this.setLevel2 = function(level_2) { this.setLevel(1,level_2); }
	this.setLevel3 = function(level_3) { this.setLevel(2,level_3); }
	this.setLevel4 = function(level_4) { this.setLevel(3,level_4); }
	this.setLevel5 = function(level_5) { this.setLevel(4,level_5); }
	this.setLevel6 = function(level_6) { this.setLevel(5,level_6); }
	this.isLevel = function(lvl) {
		if((lvl < 0) || (lvl > 5)) { }
		else if(lvl >= 0) {
			if((typeof this.level[lvl])!="string") {
				return false;
			}
			else {
				return true;
			}
		}
	}

	this.getChannel = function() { return this.channel; }
	this.getLevel = function(lvl) { if (this.isLevel(lvl, false)) { return this.level[lvl]; } }
	this.getHierarchy=function() { 
		var gap,gap_lvl;
		gap=false;
		gap_lvl=0;
		this.siteCatalyst=this.getLevel(0)
		for(i=1;i<this.level.length;i++) {
			if(this.isLevel(i)) {
				this.siteCatalyst += "~" + this.getLevel(i);
			}
			else {
				gap = false;
				for(j=i+1; j < this.level.length; j++) {
					if(this.isLevel(j, false)) {
						gap = true;
					}
				}
				if(gap) { this.siteCatalyst += "~"; }
			}
		}
		return this.siteCatalyst;
	}
}

function updateVariables(s)
{
	s.hier1 = siteCatalyst.getHierarchy();
	var chan = siteCatalyst.getChannel();
	// Make sure they used the setChannel() method before overwriting the s.channel value.
	if (chan && chan.length > 0)
		s.channel = siteCatalyst.getChannel();
	s.prop5 = siteCatalyst.getLevel(0);
	s.prop6 = siteCatalyst.getLevel(1);
	s.prop7 = siteCatalyst.getLevel(2);
	s.prop8 = siteCatalyst.getLevel(3);
	s.prop9 = siteCatalyst.getLevel(4);
	s.prop16 = siteCatalyst.getLevel(5);
}

function showDebugInfo(arg){}

var siteCatalyst = new PageLocationInHierarchy()
var verbose = false