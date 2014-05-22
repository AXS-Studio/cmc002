var Timeline = function() {

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
        bottom: 100,
        left: 30
    };

    var width = 320 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var margin2 = {
        top: height,
        right: 10,
        bottom: 20,
        left: 40
    },
        height2 = 400 - margin2.top - margin2.bottom;

    var marginTagFocus = {
        top: 270,
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

    //Setup groups to organize layout, brush areas and perform clipping
    //----------svg container----------
    var svg = d3.select('#cfgGraphs svg');

    if (svg.empty()) {
        svg = d3.select("#cfgGraphs").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    }

    //----------groups----------
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = d3.select('#focus_g');
    if (focus.empty())
        focus = svg.append("g")
            .attr("id", "focus_g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var context = svg.append("g")
    //     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var tagFocus = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + marginTagFocus.top + ")")
        .attr('clip-path', 'url(#clip)');

    var x0; //This copy of x captures the original domain setup

    var t = svg.append("g")

    var itemRects;
    var rects = [];
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
    var initialDataCommentIndex;

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
    //var DataVisualizationInitialization = (function() {
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

    // return {
    //     loadDataInitial: loadQuestionsInitial
    // };
    //})();//end DataVisualizationInitialization

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

    function makeGraph() {
        var colourCount = 0;

        for (var i = 0; i < initialData.length; i++) {
            
            //---Plot survey data---------------------------------------------------------------------------
            if (initialData[i].id != 'comment' && initialData[i].id != 'tags' && initialData[i].id != 'uniqueTags' && initialData[i].id != 'notes' && initialData[i].id != 'sessions') {

                if (initialData[i].results != null) {

                    //Convert date in initialData to a d3 readable format
                    jQuery.each(initialData[i].results, function(i, d) {
                        d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
                    });

                    //Sort all entries by date ascending (doing this server-side to lessen client-side)
                    //initialData[i].results.sort(dateSortAsc2);

                    //Apply default colours if no colour specified
                    if (initialData[i].colour == null) {
                        if (initialData[i].results != null) {
                            // ...apply one of the preset default colours to the initial value
                            if (colourCount < colours.length){
                                initialData[i].colour = colours[colourCount];
                                // Increase the colourCount variable by 1
                                colourCount++;
                            }
                            else{
                                colourCount = 0; //reset to first colour
                                initialData[i].colour = colours[colourCount];
                            }
                        } else
                            // Otherwise, apply transparent to the data object's colour property
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

                    //----------Add a filled svg path for data in Focus--------------
                    focus.append('path')
                        .datum(initialData[i]["results"]) //use datum to bind to single svg element
                        .attr("id", "data_" + initialData[i].id)
                        .classed('areaFill', true)
                        .attr("clip-path", "url(#clip)")
                        .style('fill', initialData[i].colour)
                        .style('stroke', initialData[i].colour); //.attr("class", "areaFill")

                    focus.select("#data_" + initialData[i].id).attr("d", areaFill);

                     //-----------Append dots for datapoints on line graphs-------------
                    var dots  = focus.selectAll(".dot_" + initialData[i].id)
                    .data(initialData[i]["results"], function(d) {return d.date;});

                    dots.enter().append('circle')
                    .style('fill', initialData[i].colour)
                    .attr('class', "dot_" + initialData[i].id)
                    .attr('clip-path', 'url(#clip)')
                    .attr('cx', function(d) {
                            return x(d.date);
                        })
                    .attr('cy', function(d) {
                            return y(d.Data);
                        })
                    .attr('r', function(d) {
                            return 3;
                        });

                    dots.exit().remove();

                }
            } //end if initialData[i].id != comments, sessions, notes

            //---Plot tags---------------------------------------------------------------------------
            else if (initialData[i].id == 'uniqueTags') {
                initialDataTagIndex = i; //remember the index for the tags

                //console.log("uniqueTags", initialData[i].results);
                for (var j = 0; j < initialData[i].results.length; j++) {
                    //console.log("we are in tag ", initialData[i].results[j].tag);
                    //Convert date in initialData to a d3 readable format
                    jQuery.each(initialData[i].results[j].results, function(i, d) {
                        d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
                    });

                    //append rects for each tag group. In d3 fashion first bind the data
                    var rects = tagFocus.selectAll(".rect_" + j)
                        .data(initialData[i].results[j].results, function(d) { return d.date; });

                    rects.enter().append('rect')
                        .style('fill', function(){  //white stroked rects with default colours from colour array
                                                    if (j < colours.length)
                                                        return colours[j];
                                                        else
                                                        return colours[0];
                                                })
                        //.style('stroke', 'rgba(256,256,256,1.0)')
                        .attr('class', "rect_" + j)
                        .attr('x', function(d) {
                            return x(d.date);
                        })
                        .attr('y', function(d) {
                            return 10+ j*21;
                        })
                        .attr('width', function(d) {
                            return 5;
                        })
                        .attr('height', function(d) {
                            return 20;
                        });

                    // rects.exit().remove();

                } //end for

            } //end if initialData[i].id == 'tags'
            //---Plot comments---------------------------------------------------------------------------
            else if (initialData[i].id == 'comment') {
                initialDataCommentIndex = i;

                //Convert date in initialData to a d3 readable format
                jQuery.each(initialData[i].results, function(i, d) {
                    d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
                });
                //append rects for each tag group
                var commentRects = tagFocus.selectAll(".rect_comment")
                .data(initialData[i]["results"], function(d) { return d.date; });

                commentRects.enter().append('rect')
                    .style('fill','rgba(100,100,100,1.0)')
                    .style('stroke', 'rgba(256,256,256,1.0)')
                    .attr('class', "rect_comment")
                    .attr('x', function(d) {return x(d.date);})
                    .attr('y', 0)
                    .attr('width',5)
                    .attr('height',5);
            }
        } //end for initialData.length

        //console.log("initialData", initialData);

        //Call zoom
        zoom.x(x);

        //Scale context domains
        x2.domain(x.domain());
        y2.domain(y.domain());

        //-----------Functions called after all datasets loaded-----------
        x0 = x.copy();

    //Add a radio tuner style strip
        focus.append("rect")
        .style('fill','rgba(256,0,0,0.5)')
        .attr("clip-path", "url(#clip)")
        .attr({
                    'width': 2,
                    'height': height,
                    'x': width/2, 
                    'y': 0,
                    'id': 'tuner'
                });

        //Axis
        if (d3.select('#xAxis_g').empty()) {
            focus.append("g")
                .attr("class", "x axis")
                .attr("id", "xAxis_g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
        }

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        //Add Brush function for zooming and panning
        //.attr("clip-path", "url(#clip)")
        focus.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .style('fill','rgba(0,0,256,0.5)')
            .attr("y", 0)
            .attr("x", 0)
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
        .scaleExtent([0, 1000])
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

        //Update all line graphs currently rendered
        for (var i = 0; i < settings.length; i++) {
            //  var id = settings[i].id;
            //  var colour = settings[i].colour;

            //Update line graph
            focus.select("#data_" + settings[i].id).attr("d", areaFill);
            // focus.select("#mean1").attr("d", meanline(data1)); //update meanline whem in place

            //Update dots on line graphs
            var dots = focus.selectAll(".dot_" + settings[i].id);
            if (!dots.empty()) {
                dots.attr("cx", function(d) { return x(d.date); });
            }
        } //end for settings length

        // var domainDays = (x.invert(width) - x.invert(0))/(1000*60*60*24);

        //Update comments
        var commentRects = tagFocus.selectAll('.rect_comment');
        if (!commentRects.empty()) {
            commentRects.attr('x', function(d) {return x(d.date);})
        }

        //Update all tags
        for (var j = 0; j < initialData[initialDataTagIndex].results.length; j++) {
            var rects = tagFocus.selectAll('.rect_' + j);

            if (!rects.empty()) {
                rects.attr('x', function(d) { return x(d.date); });
                // .attr('y', function(d, i) { return j * 21; });
            }
        } //end for

        focus.select(".x.axis").call(xAxis);

        getComment();
    }//end updateGraph()

    //----------Retrieve a comment-------------------------------------------------------------
    function getComment() {
        //first let's get where the date the midpoint (ie. the ticker) has landed
        var midpoint = x.invert(width/2);
        console.log("midpoint", midpoint);

        var bisect = d3.bisector(function(d) { return d.date; }).right;
        var commentIndex = bisect(initialData[initialDataCommentIndex].results, midpoint);
        var commentData = initialData[initialDataCommentIndex].results[commentIndex].Data;
        var commentDate = initialData[initialDataCommentIndex].results[commentIndex].date;

        console.log("test", initialData[initialDataCommentIndex].results[commentIndex]);

        var tuner = focus.select('#tuner').transition();
         if (!tuner.empty()) {
            tuner.attr('x', x(commentDate));
         }
    }

    //----------Return values for var Timeline-------------------------------------------------------------
    return {
        loadQuestionsInitial: loadQuestionsInitial
    };

}; //end var Timeline