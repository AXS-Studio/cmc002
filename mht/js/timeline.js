//Session data hardcoded for now
var results = {
    "patientID": 'Record09',
    "sessionID": null,
    "date": null,
    "answers": []
};

//----------default colours----------
var colours = [
	'rgba(85,98,112,1.0)', // Mighty Slate
    'rgba(255,107,107,1.0)', // Cheery Pink
	'rgba(199,244,100,1.0)', // Apple chic
	'rgba(78,205,196,1.0)', // Pacifica

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

//-----------------------------------------------------------------------------
//Set up graph layout parameters
var margin = {
    top: 10,
    right: 20,
    bottom: 200,
    left: 30
};

var width = 320 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var margin2 = {
    top: 430,
    right: 10,
    bottom: 20,
    left: 40
},
    height2 = 500 - margin2.top - margin2.bottom;

var marginTagFocus = {
    top: 290,
    right: 20,
    bottom: 20,
    left: 30
};

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

//Set up scales (to map input data to output in pixels)
//----------scales----------
var x = d3.time.scale().range([0, width]); //focus scale
var x2 = d3.time.scale().range([0, width]); //context scale (for zoom and brushing)

var y = d3.scale.linear().range([height, 0]); //focus
var y2 = d3.scale.linear().range([height2, 0]); //context

//Set up and define graph content
//----------axis----------
var xAxis = d3.svg.axis().scale(x).ticks(4).orient("bottom");

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
//----------svg container----------
var svg = d3.select("#cfgGraphs")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//----------groups----------
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
    .attr("transform", "translate(" + margin2.left + "," + marginTagFocus.top + ")")
    .attr('clip-path', 'url(#clip)');

var x0; //This copy of x captures the original domain setup

var itemRects;

//---------------------------------------------------------------------
//Global variables carried over from last version
var settings = [];
var data = [];
var colourCount = 0;
var comments = [];
var commentsCreated = false;
var tags = [];
var tagsCreated = false;
var initialDataTagIndex;

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

//Load dataset from database for current user and on success call makeGraph()
var DataVisualizationInitialization = (function() {
    //query_answers_initial.php was written originally for PATH, returns a set of default questions and their results
    //and for non-default questions, returns the length of their results so that null sets can be greyed out
    //Will need to rewrite the php for returning the entire bank of answers for use in the app as a one time download

    var loadAnswersInitial = function(ajaxPath) {
        //ajaxPath = 'php/query_answers_initial.php?patientID=Record09&sessionName=Pink&clinicianID=dkreindler';  
        //console.log(results);

        ajaxPath = 'php/query_answers_initial.php?patientID=' + results.patientID;
        patient = ajaxPath.split('=')[1];
        // console.log(patient);

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
})();//end DataVisualizationInitialization

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

//Not used, carried over from last version
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

                // Add a path for mapData's Date and Data points in Focus
                focus.append('path')
                    .datum(initialData[i]["results"])
                    .attr("id", "data_" + initialData[i].id)
                    .classed('areaFill', true)
                    .attr("clip-path", "url(#clip)")
                    .style('fill', initialData[i].colour)
                    .style('stroke', initialData[i].colour);//.attr("class", "areaFill")


                focus.select("#data_" + initialData[i].id).attr("d", areaFill);
                focus.select(".x.axis").call(xAxis);
            }
        } //end if initialData[i].id != comments, sessions, notes

        else if (initialData[i].id == 'tags'){
        	initialDataTagIndex = i;

        	//Convert date in initialData to a d3 readable format
            jQuery.each(initialData[i].results, function(i, d) {
                d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
            });
            
            //Sort all entries by date ascending (can do this server-side to lessen client-side)
            initialData[i].results.sort(dateSortAsc2);

            //console.log("tag", initialData[i]);

            rects = tagFocus.selectAll('rect')
			.data(initialData[i].results, function (d) { return d.date; })
			.attr('x', function(d) { return x(d.date); })
			.attr('width', function(d) { return 5;});

			rects.enter().append('rect')
			.style('fill', colours[0])
			.attr('x', function(d) { 
											return x(d.date); })
			.attr('width', function(d) { 	return 10;

			 								//return Math.max(3, domainDays*0.03);
			 								//return x1(d.end) - x1(d.start);
			 								})
			.attr('height', function(d) { 	return 20;
			 								// return .8 * y1(1); 
			 								});

        }//end if initialData[i].id == 'tags'

    } //end for initialData.length

 	//Call zoom
    zoom.x(x);

    //Scale context domains
    x2.domain(x.domain());
    y2.domain(y.domain());

    /*

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

    //Add Brush function for zooming and panning
    focus.append("g")
        .attr("class", "x brush")
        .attr("clip-path", "url(#clip)")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    //Add Rect for zoom function and call zoom for first time
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

    rects = tagFocus.selectAll('rect')
    .data(initialData[initialDataTagIndex].results, function (d) { return d.date; })
    .attr('x', function(d) { return x(d.date); })
    .attr('width', function(d) { return 5;});

	rects.enter().append('rect')
	.attr('x', function(d) { return x(d.date); })
	.attr('width', function(d) { 	return 5;
	 								
	 								})
	.attr('height', function(d) { 	return 20;
	 								
	 								});

    // // //.attr('class', function(d) { return 'mainItem ' + d.class; });

    // rects.exit().remove();
}
// </script>
