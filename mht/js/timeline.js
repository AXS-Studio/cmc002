		  //Session data
		 var results = {
		     "patientID": 'Record09',
		     "sessionID": null,
		     "date": null,
		     "answers": []
		 };

		 var DataVisualizationInitialization = (function() {
		     //query_answers_initial.php was written originally for PATH, returns a set of default questions and their results
		     //and for non-default questions, returns the length of their results so that null sets can be greyed out
		     //Will need to rewrite the php for returning the entire bank of answers for use in the app as a one time download

		     var loadAnswersInitial = function(ajaxPath) {
		         //ajaxPath = 'php/query_answers_initial.php?patientID=Record09&sessionName=Pink&clinicianID=dkreindler';  
		         //console.log("ajaxPath " + ajaxPath);
		         //console.log(results);

		         ajaxPath = 'php/query_answers_initial.php?patientID=' + results.patientID;
		         patient = ajaxPath.split('=')[1];
		         // console.log(patient);

		         //$('#cfgGraphs').html('<div class="svgWrap" id="svgParent" style="display: none;"></div>');

		         $.ajax({
		             url: ajaxPath,
		             type: 'GET',
		             dataType: 'json',
		             success: function(response) {
		                 initialData = response;
		                 console.log("initialData", initialData);
		                 makeGraph();
		             },
		             error: function() {
		                 window.alert('Error loadAnswersInitial!');
		             }
		         });

		     };

		     var loadQuestionsInitial = function() {
		         $.ajax({
		             url: 'php/query_questions.php',
		             type: 'GET',
		             dataType: 'json',
		             success: function(response) {
		                 questions = response;
		                 console.log("questions", questions);
		             },
		             complete: function() {
		                 loadAnswersInitial();
		             },
		             error: function() {
		                 window.alert('Error loadQuestionsInitial!');
		             }
		         });

		     };

		     return {
		         loadDataInitial: loadQuestionsInitial
		     };
		 })();

		  //load initial data
		 DataVisualizationInitialization.loadDataInitial();

		  //Set up graph parameters
		 var margin = {
		     top: 10,
		     right: 20,
		     bottom: 200,
		     left: 30
		 },
		     width = 320 - margin.left - margin.right,
		     height = 450 - margin.top - margin.bottom;

		 var margin2 = {
		     top: 430,
		     right: 10,
		     bottom: 20,
		     left: 40
		 },
		     height2 = 500 - margin2.top - margin2.bottom;

		 var margin3 = {
		     top: 510,
		     right: 10,
		     bottom: 20,
		     left: 40
		 };

		 var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

		  //Set up scales (to map input data to output in pixels)
		 var x = d3.time.scale().range([0, width]);
		 var x2 = d3.time.scale().range([0, width]); //context

		 var y = d3.scale.linear().range([height, 0]);
		 var y2 = d3.scale.linear().range([height2, 0]); //context

		  //Set up and define graph content
		  //----------axis----------
		 var xAxis = d3.svg.axis().scale(x).ticks(4).orient("bottom");
		  //xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),

		 var yAxis = d3.svg.axis().scale(y).orient("left");

		  //----------mean line----------
		 var alpha = 0.5;
		 var ypre, xpre;
		 var meanline = d3.svg.line()
		     .interpolate("basis")
		     .x(function(d, i) {
		         return x(d.date);
		     })
		     .y(function(d, i) {
		         if (i == 0)
		             ypre = y(d.Data);

		         var ythis = alpha * y(d.Data) + (1.0 - alpha) * ypre;
		         ypre = ythis;
		         return ythis;
		     });

		  //----------area fill----------
		 var areaFill = d3.svg.area()
		     .x(function(d) {
		         return x(d.date);
		     })
		     .y0(height)
		     .y1(function(d) {
		         return y(d.Data);
		     });

		 var areaFill2 = d3.svg.area()
		     .x(function(d) {
		         return x2(d.date);
		     })
		     .y0(height2)
		     .y1(function(d) {
		         return y2(d.Data);
		     });

		  //Setup groups to organize layout, brush areas and perform clipping
		  //----------groups----------
		 var svg = d3.select("#cfgGraphs")
		     .append("svg")
		     .attr("width", width + margin.left + margin.right)
		     .attr("height", height + margin.top + margin.bottom);

		 svg.append("defs")
		     .append("clipPath")
		     .attr("id", "clip")
		     .append("rect")
		     .attr("width", width)
		     .attr("height", height);

		 var focus = svg.append("g")
		     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  // var context = svg.append("g")
		  //     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		 var tagFocus = svg.append("g")
		     .attr("transform", "translate(" + margin2.left + "," + margin3.top + ")")
		     .attr('clip-path', 'url(#clip)');

		 var data1;
		 var data2;
		 var data3;

		 var x0; //This copy of x captures the original domain setup

		 var itemRects;

		 var colours = [
		     'rgba(255,0,0,1.0)', // Red
		     'rgba(0,0,255,1.0)', // Blue
		     'rgba(0,255,0,1.0)', // Green
		     'rgba(255,165,0,1.0)', // Orange
		     'rgba(80,48,137,1.0)', // Purple
		     'rgba(222,36,229,1.0)', // Violet
		     'rgba(128,104,74,1.0)', // Brown
		     'rgba(212,201,137,1.0)', // Tan
		     'rgba(235,152,152,1.0)', // Pink
		     'rgba(116,212,216,1.0)' // Teal
		 ];

		  //----------import data using queue.js-----------------------------------------------------------
		  // function json(path, callback) {
		  //     d3.json(path, function(json) {
		  //       json ? callback(null, json) : callback("error", null);
		  //     });
		  //  }

		  // queue()
		  //       .defer(json, "VAS_0.json")
		  //       .defer(json, "VAS_1.json")
		  //       .defer(json, "TAG_0.json")
		  //       .await(makeGraph);



		 var settings = [];
		 var data = [];
		 var colourCount = 0;
		 var comments = [];
		 var commentsCreated = false;
		 var tags = [];
		 var tagsCreated = false;

		 var mgFocus = {
		     width: null,
		     height: null,
		     margin: {
		         top: 27,
		         right: 19,
		         bottom: 103,
		         left: 33
		     },
		     x: null,
		     y: null,
		     xAxis: null,
		     yAxis: null,
		     line: null,
		     area: null,
		     brush1: null,
		     brush2: null
		 };

		 function parseDate(date) {
		     /*
		This function turns a string into a Date() object (that's what the 
		.parse function does at the end of the format() function):
		
		%Y = Year
		%m = Month
		%d = Date
		%H = Hour
		%M = Minutes
		%S = Seconds
		
		parseDate('2013-01-01 12:00:00') returns Date {Tue Jan 01 2013 12:00:00 GMT-0500 (EST)} */

		     var dateObj = d3.time.format('%Y-%m-%d %H:%M:%S').parse(date);
		     return dateObj;
		 }

		 function dateSortAsc(date1, date2) {
		     /* Sort the items by date; oldest to newest  */
		     if (date1.DayTime < date2.DayTime)
		         return -1;
		     if (date1.DayTime > date2.DayTime)
		         return 1;
		     return 0;
		 }

		 function dateSortAsc2(date1, date2) {
		     /* Sort the items by date; oldest to newest  */
		     if (date1.date < date2.date)
		         return -1;
		     if (date1.date > date2.date)
		         return 1;
		     return 0;
		 }

		 function createDataObject() {
		     // Create the data object...
		     for (var i = 0; i < initialData.length; i++) {
		         // ...if the current data collection isn't 'comment' or 'notes' or 'sessions'...
		         if (initialData[i].id != 'comment' && initialData[i].id != 'tags' && initialData[i].id != 'notes' && initialData[i].id != 'sessions') {
		             // console.log(initialData[i].colour);
		             if (initialData[i].length > 0) {
		                 // If the current data object's colour is null...
		                 if (initialData[i].colour == null) {
		                     // ...and its results object isn't null...
		                     if (initialData[i].results != null) {
		                         // ...apply one of the preset default colours to the initial value
		                         initialData[i].colour = colours[colourCount];
		                         // Increase the colourCount variable by 1
		                         colourCount++;
		                         // Otherwise, apply transparent to the data object's colour property
		                     } else
		                         initialData[i].colour = 'transparent';
		                 }
		                 // For each collection of data in initialData Ajax response...
		                 var id = initialData[i].id;
		                 var name = initialData[i].name;
		                 var colour = initialData[i].colour;

		                 // ...create an object in settings for the collected data.
		                 settings.push({
		                     "id": id,
		                     "name": name,
		                     "colour": colour
		                 });
		                 if (initialData[i].results != null) {
		                     // For the data's date/data collection...
		                     for (var j = 0; j < initialData[i].results.length; j++) {
		                         var rDate = initialData[i].results[j].Date;
		                         var rData = initialData[i].results[j].Data;
		                         var rMovAv = initialData[i].results[j].MA;
		                         var rIntegral = initialData[i].results[j].I;
		                         // If there hasn't yet been a collection of date data added to the data object...
		                         if (data.length == 0) {
		                             // ...add an initial date data collection with the first entry.
		                             data.push({
		                                 "DayTime": rDate,
		                                 "Data": [{
		                                     "id": id,
		                                     "Data": rData,
		                                     "MA": rMovAv,
		                                     "integral": rIntegral
		                                 }]
		                             });
		                             // If there is at least one collection of date data in data...
		                         } else {
		                             // Determines whether there has been a match for the current date in the loop in data
		                             var dateMatch = false;
		                             // For each date data collection in data...
		                             for (var k = 0; k < data.length; k++) {
		                                 /*  ...if the current data date doesn't match initialData's current date...
										...and the current data date is the last one in data...
										...and dateMatch still equals false (meaning no date match was found)...  */
		                                 if (data[k].DayTime != rDate && k == (data.length - 1) && dateMatch == false) {
		                                     // ...add a new date data collection with the current initialData entry.
		                                     data.push({
		                                         "DayTime": rDate,
		                                         "Data": [{
		                                             "id": id,
		                                             "Data": rData,
		                                             "MA": rMovAv,
		                                             "integral": rIntegral
		                                         }]
		                                     });
		                                     // If a data date/initialData date match is found...
		                                 } else if (data[k].DayTime == rDate) {
		                                     // ...mark dateMatch as true.
		                                     dateMatch = true;
		                                     // Determines whether there has been a match for the current mood in the loop in the date data
		                                     var idMatch = false;
		                                     // For each collection of data in each date object in data...
		                                     for (var l = 0; l < data[k].Data.length; l++) {
		                                         /*  ...if the current data id doesn't match initialData's current id...
												...and the current data collection is the last one in the current date data collection...
												...and idMatch still equals false (meaning no id match was found)...  */
		                                         if (data[k].Data[l].id != id && l == (data[k].Data.length - 1) && idMatch == false) {
		                                             // ...add a new id/Data data collection with the current initialData entry.
		                                             data[k].Data.push({
		                                                 "id": id,
		                                                 "Data": rData,
		                                                 "MA": rMovAv,
		                                                 "integral": rIntegral
		                                             });
		                                             // If an id match is found...
		                                         } else if (data[k].Data[l].id == id) {
		                                             // ...mark idMatch as true.
		                                             idMatch = true;
		                                         }
		                                     }
		                                 }
		                             }
		                         }
		                     }
		                 } //end if (initialData[i].results != null)
		             }
		             // If the current data collection is 'comment' and its length is less than 1...
		         } else if (initialData[i].id == 'comment' && commentsCreated == false) {
		             // For each comment entry...
		             for (var m = 0; m < initialData[i].results.length; m++) {
		                 // ...create a matching object in the comments array containing the date and data
		                 comments.push(initialData[i].results[m]);
		             }
		             // If the current data collection is 'tags' and its length is less than 1...
		         } else if (initialData[i].id == 'tags' && tagsCreated == false) {
		             // For each tags entry...
		             for (var m = 0; m < initialData[i].results.length; m++) {
		                 // ...create a matching object in the tags array containing the date and data
		                 tags.push(initialData[i].results[m]);
		             }
		             // If the current data collection is 'comment' and its length is less than 1...
		         } else if (initialData[i].id == 'sessions' /* && notesCreated == false*/ ) {
		             //SessionSelect.parseSessInfo(initialData[i].info);
		             if (initialData[i].info.current.data != undefined) {
		                 if (initialData[i].info.current.data.range1dates != undefined)
		                     setRangeDates(1, initialData[i].info.current.data.range1dates);
		                 if (initialData[i].info.current.data.range2dates != undefined)
		                     setRangeDates(2, initialData[i].info.current.data.range2dates);
		             }
		         }
		     } //end for loop

		     // Convert each date in data to a true JavaScript Date() object
		     jQuery.each(data, function(i, d) {
		         d.DayTime = parseDate(d.DayTime);
		     });

		     // Sort the date objects in data in order of date (from oldest to newest)
		     data.sort(dateSortAsc);
		 }

		 function makeGraph() {
		     var colourCount = 0;

		     for (var i = 0; i < initialData.length; i++) {
		         if (initialData[i].id != 'comment' && initialData[i].id != 'tags' && initialData[i].id != 'notes' && initialData[i].id != 'sessions') {

		             if (initialData[i].results != null) {

		                 //Convert date in initialData to a d3 readable format
		                 jQuery.each(initialData[i].results, function(i, d) {
		                     d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
		                 });

		                 //Sort all entries by date ascending (can do this server-side to lessen client-side)
		                 initialData[i].results.sort(dateSortAsc2);

		                 //Apply default colours if no colour specified
		                 if (initialData[i].colour == null) {
		                     if (initialData[i].results != null) {
		                         // ...apply one of the preset default colours to the initial value
		                         initialData[i].colour = colours[colourCount];
		                         // Increase the colourCount variable by 1
		                         colourCount++;
		                         // Otherwise, apply transparent to the data object's colour property
		                     } else
		                         initialData[i].colour = 'transparent';
		                 }
		                 //Change the colour for the fill
		                 $('.' + "area_" + initialData[i].id).css('fill', initialData[i].colour);

		                 // ...create an object in settings for the collected data.
		                 settings.push({
		                     "id": initialData[i].id,
		                     "name": initialData[i].name,
		                     "colour": initialData[i].colour
		                 });

		                 // Scale the range of the data
		                 // TODO: will need to remember the largest domain if datasets have different extents
		                 x.domain(d3.extent(initialData[i]["results"], function(d) {
		                     return d.date;
		                 }));
		                 y.domain([0, 100]);

		                 //Call zoom
		                 zoom.x(x);

		                 //Scale context domains
		                 x2.domain(x.domain());
		                 y2.domain(y.domain());

		                 // Add a path for mapData's Date and Data points in Focus
		                 focus.append('path')
		                     .datum(initialData[i]["results"])
		                     .attr("id", "data_" + initialData[i].id)
		                     .attr("class", "area_" + initialData[i].id)
		                     .attr("clip-path", "url(#clip)")
		                     .style('fill', initialData[i].colour)
		                     .style('fill-opacity', '0.15')
		                     .style('stroke', initialData[i].colour)
		                     .style('stroke-opacity', '0.5')
		                     .style('stroke-width', '1'); //.attr("class", "area1")

		                 focus.select("#data_" + initialData[i].id).attr("d", areaFill);
		                 focus.select(".x.axis").call(xAxis);
		             }
		         } //end if initialData[i].id != comments, sessions, notes

		     } //end for initialData.length

		     /*
		for (var i = 0; i < settings.length; i++) {
			// ...create a temporary array called mapData to store the date/data info for each collection of data
			
			var id = settings[i].id;
			var colour = settings[i].colour;

			// Scale the range of the data
			x.domain(d3.extent(initialData[2]["results"], function(d) { return d.date;}));
			y.domain([0, 100]);

			//Call zoom
			zoom.x(x);
			//Scale context domains
			x2.domain(x.domain());
			y2.domain(y.domain());

			// Add a path for mapData's Date and Data points in Focus
			if (1){
			console.log("settings", settings);
			console.log("initialData", initialData);
			console.log("data", data);			
			
			focus.append('path')
						.datum( initialData[2]["results"])
						.attr("id", "data1")
						.attr("class", "area1")
						.attr("clip-path", "url(#clip)");

			focus.select("#data1").attr("d", areaFill);
			// focus.select("#data2").attr("d", areaFill);
			// focus.select("#mean1").attr("d", meanline(data1));
			// focus.select("#mean2").attr("d", meanline(data2));
			focus.select(".x.axis").call(xAxis);

			 
			
				.datum(mapData)
				.attr('clip-path', 'url(#clip)')
				.attr('d',  mgFocus.area)
				.attr('class', 'dataPath path-' + id)
				.style('fill', colour)
				.style('opacity', '0.15')
				.style('stroke', colour);
				// graph.insert('path', 'rect.mask')
				// 	.datum(mapData)
				// 	.attr('clip-path', 'url(#clip)')
				// 	.attr('d', mgFocus.line)
				// 	.attr('class', 'dataMa ma-' + id)
				// 	.style('stroke', colour);			

			}//end if mapData!=null
		}//end for settings length
		*/

		     /*
	//--------------------Prepare data 1------------------------------
	
	data1.forEach(function(d) {
		d.date = parseDate(d.date);
		d.Answer = +d.Answer;
	});

	// Scale the range of the data
	x.domain(d3.extent(data1, function(d) { return d.date; }));
	y.domain([0, d3.max(data1, function(d) { return d.Answer; })]);

	//Call zoom
	zoom.x(x);

	// Scale the range of the data in context graph too
	x2.domain(x.domain());
	y2.domain(y.domain());
	
	// Add the area graph and mean line to focus and context
	focus.append("path")
			.datum(data1)
			.attr("id", "data1")
			.attr("class", "area1")
			.attr("clip-path", "url(#clip)");
			// .attr("d", areaFill);

	focus.append("path")
			.attr("id", "mean1")
			.attr("class", "mean1")
			.attr("clip-path", "url(#clip)");
			// .attr("d", meanline(data1));
		
	// context.append("path")
	// 		.datum(data1)
	// 		.attr("class", "area1")
	// 		.attr("d", areaFill2);

	//--------------------Prepare data 2---------------------------------
	
	data2.forEach(function(d) {
		d.date = parseDate(d.date);	
		d.Answer = +d.Answer;
	});
	
	// Scale the range of the data
	x.domain(d3.extent(data2, function(d) { return d.date; }));
	y.domain([0, d3.max(data2, function(d) { return d.Answer; })]);

    //Call zoom
	zoom.x(x);

	// Add the area graph and mean line to focus and context
	focus.append("path")
			.datum(data2)
			.attr("id", "data2")
			.attr("class", "area2")
			.attr("clip-path", "url(#clip)");
			// .attr("d", areaFill);

	focus.append("path")
		.attr("id", "mean2")
		.attr("class", "mean2")
		.attr("clip-path", "url(#clip)");
		// .attr("d", meanline(data2));

	// context.append("path")
	// 	.datum(data2)
	// 	.attr("class", "area2")
	// 	.attr("d", areaFill2);

	//--------------------Prepare data 3---------------------------------

	data3.forEach(function(d) {
		d.date = parseDate(d.date);	
		d.Answer = +d.Answer;
	});
	// Scale the range of the data WILL NEED TO FIX SOMEDAY TO CHOOSE MAX AND MIN
	// x.domain(d3.extent(data3, function(d) { return d.date; }));
	// y.domain([0, d3.max(data3, function(d) { return d.Answer; })]);

	rects = tagFocus.selectAll('rect')
		.data(data3, function (d) { return d.date; })
		.attr('x', function(d) { return x(d.date); });

	updateGraph();
	// rects.enter().append('rect')
	// 	.attr('x', function(d) { return x(d.date); })
	// 	.attr('width', function(d) { 	return 3;
	// 									// return x1(d.end) - x1(d.start); 
	// 								})
	// 	.attr('height', function(d) { 	return 15;
	// 									// return .8 * y1(1); 
	// 								});
		// .attr('class', function(d) { return 'mainItem ' + d.class; });

	// rects.exit().remove();
*/
		     //-----------Functions called after all datasets loaded-----------
		     x0 = x.copy();

		     //Axis
		     focus.append("g")
		         .attr("class", "x axis")
		         .attr("transform", "translate(0," + height + ")")
		         .call(xAxis);

		     focus.append("g")
		         .attr("class", "y axis")
		         .call(yAxis);

		     //Brush
		     focus.append("g")
		         .attr("class", "x brush")
		         .attr("clip-path", "url(#clip)")
		         .call(brush)
		         .selectAll("rect")
		         .attr("y", -6)
		         .attr("height", height2 + 7);

		     //Used for zoom function
		     focus.append("rect")
		         .attr("class", "pane")
		         .attr("width", width)
		         .attr("height", height)
		         .call(zoom);

		 } //end makeGraph function

		  //----------Setup brush-------------------------------------------------------------
		 var brush = d3.svg.brush()
		     .x(x2)
		     .on("brush", brushed);

		  //.x(x).scaleExtent([1,10]) limits zoom from 1X to 10X
		 var zoom = d3.behavior.zoom().x(x)
		     .scaleExtent([0, 100])
		     .on("zoom", zoomed);

		 function brushed() {
		     x.domain(brush.empty() ? x2.domain() : brush.extent());

		     updateGraph();

		     //Since domain has been modified, call zoom again
		     zoom.x(x);
		 }

		  //----------Setup zoom-------------------------------------------------------------

		 function zoomed() {
		     updateGraph();

		     //Find extent of zoomed area, what's currently at edges of graphed region
		     //Update context graph
		     //var brushExtent = [x.invert(0), x.invert(width)]; 
		     //context.select(".brush").call(brush.extent(brushExtent));
		 }

		 function reset() {
		     zoom.scale(1);
		     zoom.translate([0, 0]);
		 }

		  //----------Update whole graph-------------------------------------------------------------

		 function updateGraph() {

		     for (var i = 0; i < settings.length; i++) {
		         // 	var id = settings[i].id;
		         // 	var colour = settings[i].colour;
		         focus.select("#data_" + settings[i].id).attr("d", areaFill);
		     } //end for settings length

		     //focus.select("#data1").attr("d", areaFill);
		     // focus.select("#data2").attr("d", areaFill);
		     // focus.select("#mean1").attr("d", meanline(data1));
		     // focus.select("#mean2").attr("d", meanline(data2));
		     focus.select(".x.axis").call(xAxis);

		     // var domainDays = (x.invert(width) - x.invert(0))/(1000*60*60*24);

		     // rects = tagFocus.selectAll('rect')
		     // .data(data3, function (d) { return d.date; })
		     // .attr('x', function(d) { return x(d.date); })
		     // .attr('width', function(d) { return 5;});

		     //  rects.enter().append('rect')
		     //  .attr('x', function(d) { return x(d.date); })
		     //  .attr('width', function(d) { 
		     // 								//console.log("inside");
		     //  								return 5;
		     //  								//return Math.max(3, domainDays*0.03);
		     //  								//return x1(d.end) - x1(d.start);
		     //  								})
		     //  .attr('height', function(d) { 
		     //  								return 20;
		     //  								// return .8 * y1(1); 
		     //  								});
		     // // //.attr('class', function(d) { return 'mainItem ' + d.class; });

		     // rects.exit().remove();
		 }
		  // </script>
