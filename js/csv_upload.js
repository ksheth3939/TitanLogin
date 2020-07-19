const standardset = ["Down","Distance","FieldZone","Personnel","Formation","PlayType","FormationFam","Cover","CoverFam"];
var currentMapping = {};
const NO_MAPPING = 404;
for(var i = 0; i< standardset.length;i++){
	currentMapping[standardset[i]] = "";
}
document.getElementById("submitButton").addEventListener("click",submitHandler,false);
createRecepticle(standardset);
// d3.select("#mainDiv").append("svg")
// .attr("width", 2000)
// .attr("height", 2000)
// .attr("id", "graph")
// svg = d3.select("#graph");
function fitText(lBox,sourceText){
	var fSize = 32;

	var text = d3.select(lBox).append("svg")
								 .attr("width",150)
								 .attr("height",40)
								 .append("text")
								 .style("alignment-baseline","middle")
								 .style("text-anchor","middle")
								 .attr("x",69)
								 .attr("y",20)
								 .text(sourceText)
								 .style("font-size",""+fSize+"px");

	var bBox = text.node().getBBox();
	var currWidth = bBox.width;
	var currHeight = bBox.height;
	while(fSize > 1 && (currWidth > 134 || currHeight > 34)){
		// console.log(currWidth)
		fSize--;
		text.style("font-size",""+fSize+"px");
		bBox = text.node().getBBox();
		currWidth = bBox.width;
		currHeight = bBox.height;
	}
}

function createRecepticle(){
		var parent = document.getElementById("lefthalf");
		var unit;
		var lBox;
		var rBox;
		var svg;
		var text;
		for(var i = 0; i < standardset.length;i++){
			unit = parent.appendChild(document.createElement('div'));
			unit.id = "unit"+i;
			unit.className = "unit";
			lBox = unit.appendChild(document.createElement('div'));
			lBox.className = "lBox";
			fitText(lBox,standardset[i])
			svg = d3.select("#unit"+i).append("svg")
												 .attr("width",100)
												 .attr("height",80)
												 .style("background","rgba(0,0,0,0)")
												 .attr("id","arrow"+i)
												 .attr("class","arrow");
			svg.append("path")
				 .attr("d","M 13 20 "+
			             "H 50 " +
								   "V 10 " +
								   "L 90 40 " +
								   "L 50 70 " +
								   "V 60 " +
								   "H 13 ")
				 .attr("stroke","Black")
				 .attr("stroke-width",6)
				 .attr("fill","white");
			 svg.append("path")
				 .attr("d","M 5 20 H 14")
				 .attr("stroke","Black")
				 .attr("stroke-width",6)
				 .attr("fill","white");
		  svg.append("path")
				 .attr("d","M 5 60 H 14")
				 .attr("stroke","Black")
				 .attr("stroke-width",6)
				 .attr("fill","white");
			rBox = unit.appendChild(document.createElement('div'));
			rBox.className = "rBox";
			rBox.addEventListener('dragover', allowDrop, false);
			rBox.addEventListener('drop', drop, false);
			// svg = d3.select("#arrow")
			// console.log(svg)

		}

}



function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
	// ev.target.children[0].style.visibility = "hidden"
  ev.dataTransfer.setData("text", ev.target.id);
	// ev.target.style.cursor = 'move';
	// console.log(ev.target.id)
	// console.log("dataget");
}

function drop(ev) {

  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
	var sourceBoxD3;
	try {
   sourceBoxD3 = d3.select("#"+data);
	}
	catch(err) {
  	//no need to handle error
	}

	if(sourceBoxD3 && sourceBoxD3._groups[0][0] != null){
		sourceBoxD3.style("background-color","red").style("cursor","pointer");
		var sourceBox = document.getElementById(data);
		sourceBoxD3.attr("draggable","false");
		// console.log(sourceBox)
		var targetBoxD3 = d3.select(ev.target);
		ev.target.removeEventListener('dragover', allowDrop);
		ev.target.removeEventListener('drop', drop);
		ev.target.parentNode.style.border = "none";
		if(ev.target.parentNode.children[3])
			ev.target.parentNode.removeChild(ev.target.parentNode.children[3]);
		targetBoxD3.style("z-index","3")
						 .style("background-color","green");
		fitText(ev.target,sourceBoxD3._groups[0][0].labelTitan)
		sourceBox.addEventListener('click', function() {undoSelect(ev.target,targetBoxD3,sourceBoxD3,sourceBox)}, false);
	}
	//console.log(info._groups[0][0].labelTitan);

  // ev.target.appendChild(document.getElementById(data));
}

// function createFunction(t3,s3,s){
//
// }


//TODO: reenable fbox:active{grabbing}
function undoSelect(target,targetD3,sourceD3,source){
	 targetD3.node().removeChild(targetD3.node().firstChild);
	 target.addEventListener('dragover', allowDrop, false);
	 target.addEventListener('drop', drop, false);
	 //var old_element = document.getElementById("btn");
	 sourceD3.style("background-color","white");
	 targetD3.style("background-color","white")
	         .style("z-index","0");
	 var new_element = source.cloneNode(true);
	 source.parentNode.replaceChild(new_element, source);
	 d3.select(new_element)
	 	 .attr("draggable","true")
		 .style("cursor","grab");
	 new_element.labelTitan = source.labelTitan;

	 new_element.addEventListener('dragstart', drag, false);
}

function enableRelationship(event){
	var unit = event.target.parentNode;
	var tests = 2;
	while(tests > 0){
		tests--;
		if(unit.className == "unit"){
			//unit.parentNode.removeChild(unit);
			break;
		}
		else{
			unit = unit.parentNode;
		}
	}
	// console.log("pong")
	unit.style.border = "thick dashed rgb(180,30,30)";
	unit.children[0].style.backgroundColor = "white";
	var key = unit.children[0].children[0].children[0].textContent;
	currentMapping[key] = "";
	unit.children[1].children[0].style.fill = "white";
	unit.children[2].style.backgroundColor = "white";
	unit.children[2].addEventListener('dragover', allowDrop,false);
	unit.children[2].addEventListener('drop', drop,false);
	unit.children[3].style.backgroundColor = "red";
	unit.children[3].children[0].className = "fa fa-trash";
  unit.children[3].removeEventListener("click",enableRelationship,false);
	unit.children[3].addEventListener("click",disableRelationship,false);
}

function disableRelationship(event){
	// console.log("===================");
	// console.log(event.target)
	// console.log(event.target.parentNode.className);
	// console.log("last delete");
	// console.log("ping")
	//Removes element from list VVVVV
	var unit = event.target.parentNode;
	var tests = 2;
	while(tests > 0){
		tests--;
		if(unit.className == "unit"){
			//unit.parentNode.removeChild(unit);
			break;
		}
		else{
			unit = unit.parentNode;
		}
	}
	// console.log(unit);
	unit.style.border = "thick dashed grey";
	unit.children[0].style.backgroundColor = "grey";
	var key = unit.children[0].children[0].children[0].textContent;
	currentMapping[key] = NO_MAPPING;
	unit.children[1].children[0].style.fill = "grey";
	unit.children[2].style.backgroundColor = "grey";
	unit.children[2].removeEventListener('dragover', allowDrop);
	unit.children[2].removeEventListener('drop', drop);
	unit.children[3].style.backgroundColor = "green";
	unit.children[3].children[0].className = "fa fa-undo";
  unit.children[3].removeEventListener("click",disableRelationship,false);
	unit.children[3].addEventListener("click",enableRelationship,false);

	// console.log(unit);

}


function verifyMapping(){
	for (const [key, value] of Object.entries(currentMapping)) {
  	if(value === ""){
			return false;
		}
	}
	return true;
}

function submitHandler(){
	var mappingSelect = d3.selectAll(".unit");
	var mapObjs = mappingSelect._groups[0];
	var leftBox;
	var rightBox;
	var key;
	var value;
	console.log("=============================")
	for(var i = 0; i < mapObjs.length;i++){
		leftBox = mapObjs[i].children[0];
		rightBox = mapObjs[i].children[2];
		key = leftBox.children[0].children[0].textContent;
		if(rightBox.children[0]===undefined){
			// console.log("missing mapping for " + key);
			if(mapObjs[i].children[3]===undefined){
				mapObjs[i].style.border = "thick dashed rgb(180,30,30)";
				var button = mapObjs[i].appendChild(document.createElement("button"));
				var icon = button.appendChild(document.createElement("i"));
				button.className = "btn default";
				button.style.backgroundColor="rgb(255,0,0)";
				icon.className = "fa fa-trash";
				icon.style.color="rgb(255,255,255)";
				// button.textContent = "Remove";
				button.type = "submit";
				button.addEventListener("click",disableRelationship,false);
				// console.log(button);
			}
		}
		else{
			value = rightBox.children[0].children[0].textContent;
			currentMapping[key] = value;
			// console.log(currentMapping);


		}
	}

	if(verifyMapping()){
		console.log("Succesful Map!")
	}

}

function generateHoldingCell(data){
	var parent = document.getElementById("headerContainer");
	var unit;
	var lBox;
	var rBox;
	var svg;
	var text;
	for(var i = 0; i < data.length;i++){

		box = parent.appendChild(document.createElement('div'));
		box.className = "col-md-12 fBox";
		box.draggable = "true";
		box.id = "coachHeader"+i;
		box.labelTitan = data[i];
		box.addEventListener('dragstart', drag, false);
		// box.ondragstart = drag(event);
		fitText(box,data[i])



		// svg = d3.select("#arrow")
		// console.log(svg)

	}
}

$(document).ready(function() {
	function StatsProcessor() {
		// var newStats = new Stats();
    //     newStats.processNames();
		//Update View
		updateDom();
	};

	//Create Stats class
	var Stats = function(columnNames){
        this.columnNames = columnNames
	};

    function getNames(){
        return this.columnNames;
    }

    // Stats.prototype.processNames = function(){
    //     columnNames = data[0];
    //     console.log(d3.select("#main"))
    //     drawColumns(svg, columnNames, 50, 50, 40, 150, 70);
		//
    // }

	//Update DOM with stat values
	var updateDom = function() {
		function viewModel() {
			// this.countOfIntegers = ko.observable(columnNames);
		};
		ko.applyBindings(new viewModel());
	};

	// Upload selected file and create array
	var uploadFile = function(evt) {
		var file = evt.target.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(event) {
			//Jquery.csv
			createArray($.csv.toArrays(event.target.result));
		};
	};

	// Validate file import
	var createArray = function(data) {
		if(data !== null && data !== "" && data.length > 1) {
			this.data = data;
			generateHoldingCell(data[0]);

			StatsProcessor(data);

			$("#statOutPut").removeClass( "hidden" );
			$("#errorOutPut").addClass( "hidden" );
		} else {
			$("#errorOutPut").removeClass( "hidden" );
			$("#statOutPut").addClass( "hidden" );
			$("#errorOutPut li").html('There is no data to import');
		}
	};
	document.getElementById('txtFileUpload').addEventListener('change', uploadFile, false);


});
