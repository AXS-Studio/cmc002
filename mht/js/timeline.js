var Timeline = function() {

    //Session data hardcoded for now
    // if (results == null){
    //     var results = {
    //         "patientID": "Record09",
    //         "sessionID": null,
    //         "date": null,
    //         "answers": []
    //     };
    // }
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
    
    var focusMargin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30
    };

    var focusDim = {
        width: $(document).width()-focusMargin.right - focusMargin.left,
        height: 200
    }

    var tagFocusDim = {
        width: focusDim.width,
        height: 50
    }

    var tagFocusMargin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30
    };

    var svgDim = {
        width: focusDim.width + focusMargin.right + focusMargin.left,
        height: focusDim.height + tagFocusDim.height 
                + focusMargin.top + focusMargin.bottom
                + tagFocusMargin.top  + tagFocusMargin.bottom
    }
    
    var tagDim = {
        width: 5,
        height: 20
    }

    //----------parse functions----------
    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
    var commentDateFormat = d3.time.format("%d %B %Y, %I:%M %p, %A");

    //Set up scales (to map input data to output in pixels)
    //----------scales----------
    var xScale = d3.time.scale().range([0, focusDim.width]);
    var yScale = d3.scale.linear().range([focusDim.height, 0]);
    
    //----------axis----------
    var xAxis = d3.svg.axis().scale(xScale).ticks(4).orient("bottom");

    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    //----------mean line----------
    var alpha = 0.5;
    var ypre, xpre;
    var meanline = d3.svg.line()
        .interpolate("basis")
        .x(function(d, i) {
            return xScale(d.date);
        })
        .y(function(d, i) {
            if (i == 0)
                ypre = yScale(d.Data);

            var ythis = alpha * yScale(d.Data) + (1.0 - alpha) * ypre;
            ypre = ythis;
            return ythis;
        });

    //----------area fill----------
    var areaFill = d3.svg.area()
        .x(function(d) {
            return xScale(d.date);
        })
        .y0(focusDim.height)
        .y1(function(d) {
            return yScale(d.Data);
        });

    //Setup groups to organize layout, brush areas and perform clipping
    //----------svg container----------
    var svg = d3.select('#cfgGraphs svg');
    if (svg.empty()) {
        svg = d3.select("#cfgGraphs").append("svg")
            //.style("background-color", "rgba(0,0,0,0.1)")
            .attr("width", svgDim.width)
            .attr("height", svgDim.height );
    }

    //----------groups----------
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", focusDim.width)
        .attr("height", focusDim.height);

    // svg.append("rect")
    // .style("fill", "blue")
    // .attr("width", focusDim.width)
    // .attr("height", focusDim.height);

    var focus = d3.select('#focus_g');
    if (focus.empty())
        focus = svg.append("g")
            .attr("id", "focus_g")
            .attr("transform", "translate(" + focusMargin.left + "," + focusMargin.top + ")");

    var tagFocus = d3.select('#tagFocus_g');
    if (tagFocus.empty()){

        tagFocus = svg.append("g")
        .attr("id", "tagFocus_g")
        .attr("transform", "translate(" + focusMargin.left + "," + (focusDim.height + focusMargin.top + focusMargin.bottom + tagFocusMargin.top) + ")")
        .attr('clip-path', 'url(#clip)');
    }

    var overlay = d3.select('#overlay_g');
    if (overlay.empty())
        overlay = svg.append("g")
        .attr("id", "overlay_g")
        .attr("transform", "translate(" + focusMargin.left + "," + 0 + ")");

    var x0; //This copy of x captures the original domain setup
    
    //---------------------------------------------------------------------
    //Global variables carried over from last version
    var graphSettings = [];
    //graphSettings.tags = [];
    //var data = [];
    var colourCount = 0;
    var comments = [];
    //var commentsCreated = false;
    var tags = [];
    //var tagsCreated = false;

    var initialDataTagIndex;
    var initialDataCommentIndex;

    //Load dataset from database for current user and on success call makeGraph()
    //var DataVisualizationInitialization = (function() {
    //query_answers_initial.php was written originally for PATH, returns a set of default questions and their results
    //and for non-default questions, returns the length of their results so that null sets can be greyed out
    //Will need to rewrite the php for returning the entire bank of answers for use in the app as a one time download

    var loadAnswersInitial = function(ajaxPath) {
        //ajaxPath = 'php/query_answers_initial.php?patientID=Record09&sessionName=Pink&clinicianID=dkreindler';  

        ajaxPath = 'php/query_answers_timeline.php?patientID=' + results.patientID;
        patient = ajaxPath.split('=')[1];
        // console.log(patient);

        $.ajax({
            url: ajaxPath,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                initialData = response;
                //console.log("initialData", initialData);
            },
            complete: function() {
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
    
    function makeGraph() {
        //clear graph
        focus.selectAll("*").remove();
        tagFocus.selectAll("*").remove();

        var colourCount = 0;
        var tagRowcounter = 0;
        for (var i = 0; i < initialData.length; i++) {
            
            //---Plot survey data---------------------------------------------------------------------------
            if (initialData[i].id != 'comment' && initialData[i].id != 'tags' && initialData[i].id != 'uniqueTags' && initialData[i].id != 'notes' && initialData[i].id != 'sessions') {

                if (initialData[i].results != null) {

                    //Convert date in initialData to a d3 readable format
                    jQuery.each(initialData[i].results, function(i, d) {
                        d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
                    });

                    // ...create an object in settings for the collected data.
                    graphSettings.push({
                        "id": initialData[i].id,
                        "name": initialData[i].name//,"colour": initialData[i].colour
                    });
                   
                    // Scale the range of the data
                    // TODO: will need to remember the largest domain if datasets have different extents
                    xScale.domain(d3.extent(initialData[i].results, function(d) {
                        return d.date;
                    }));
                    yScale.domain([0, 100]);

                    //----------Add a filled svg path for data in Focus--------------
                    focus.append('path')
                        .datum(initialData[i]["results"]) //use datum to bind to single svg element
                        .attr("id", "data_" + initialData[i].id)
                        .classed('areaFill', true)
                        .attr('clip-path', 'url(#clip)');
                        //.style('fill', initialData[i].colour)
                        //.style('stroke', initialData[i].colour); //.attr("class", "areaFill")

                    focus.select("#data_" + initialData[i].id).attr("d", areaFill);

                    //-----------Append dots for datapoints on line graphs-------------
                    // var dots  = focus.selectAll(".dot_" + initialData[i].id)
                    // .data(initialData[i]["results"], function(d) {return d.date;});

                    // dots.enter().append('circle')
                    // .style('fill', initialData[i].colour)
                    // .attr('class', "dot_" + initialData[i].id)
                    // .attr('clip-path', 'url(#clip)')
                    // .attr('cx', function(d) {
                    //         return xScale(d.date);
                    //     })
                    // .attr('cy', function(d) {
                    //         return yScale(d.Data);
                    //     })
                    // .attr('r', function(d) {
                    //         return 1;
                    //     });

                    // dots.exit().remove();

                }
            } //end if initialData[i].id != comments, sessions, notes

            //---Plot tags--------------------- ------------------------------------------------------
            else if (initialData[i].id == 'uniqueTags') {
                initialDataTagIndex = i; //remember the index for the tags

                for (var j = 0; j < initialData[initialDataTagIndex].results.length; j++) {
                    
                    //Convert date in initialData to a d3 readable format
                    jQuery.each(initialData[initialDataTagIndex].results[j].results, function(i, d) {
                        d.date = d3.time.format('%Y-%m-%d %H:%M:%S').parse(d["Date"]);
                    });

                    var thisTag = initialData[initialDataTagIndex].results[j].tag;
                    var thisColour;

                    //simple loop to check if colour exists in tag's graphColor object, if yes sync
                    for (var k = 0; k < tagColors.length; k++) {
                        if (tagColors[k].id == thisTag){
                           thisColour = tagColors[k].color;
                        }
                    }

                    if (thisColour != "rgba(0,0,0,0)" && thisColour != null){
                        
                        //Create an object in graphSettings
                        graphSettings.push({
                            "id": "tag_"+thisTag,
                            "tag": thisTag,
                            "colour": thisColour
                        });

                        //graphSettings.tags.push(thisTag);//add to list of tags displayed

                        //append rects for each tag group. In d3 fashion first bind the data
                        var rects = tagFocus.selectAll(".rect_" + thisTag).data(initialData[initialDataTagIndex].results[j].results, function(d) { return d.date; });

                        //Append rects for all binded data entering the graph
                        rects.enter().append('rect')
                        .style('fill', thisColour)
                        .style('stroke', 'rgba(256,256,256,1.0)')
                        .attr('class', "rect_" + thisTag)
                        .attr("data-sessionID", function(d) { return d.SessionID; })
                        .attr('x', function(d) {
                            return xScale(d.date)-tagDim.width/2;
                        })
                        .attr('y', function(d) {
                            return tagRowcounter*tagDim.height;
                        })
                        .attr('width', function(d) {
                            return tagDim.width;
                        })
                        .attr('height', function(d) {
                            return tagDim.height;
                        });
                        
                        rects.exit().remove();

                        tagRowcounter++;
                    }
                } //end for

                tagFocusDim.height = tagRowcounter*tagDim.height;
                svgDim.height= focusDim.height + tagFocusDim.height  + focusMargin.top + focusMargin.bottom + tagFocusMargin.top  + tagFocusMargin.bottom;

                d3.select("#cfgGraphs svg").attr("height", svgDim.height );
                console.log("height changed", tagFocusDim.height);

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
                    .style('fill','rgba(200,200,200,1.0)')
                    .style('stroke', 'rgba(256,256,256,1.0)')
                    .attr('class', "rect_comment")
                    .attr("data-sessionID", function(d) { return d.SessionID; })
                    .attr('x', function(d) {return xScale(d.date)-tagDim.width/2;})
                    .attr('y', 0)
                    .attr('width',tagDim.width)
                    .attr('height',tagDim.width);

                commentRects.exit().remove();
            }
        } //end for initialData.length

        //Call zoom
        zoom.x(xScale);

        //Scale context domains
        //x2.domain(x.domain());
        //y2.domain(y.domain());

        x0 = xScale.copy(); //keep a copy of original domain
        //-----------Graph elements - axis, tuner strip, transparent zoom rect-----------

        //Add a radio tuner style strip
        overlay.append("rect")
        .style('fill','rgba(0,0,0,0.5)')
        // .attr("clip-path", "url(#clip)")
        .attr({
                    'width': 1,
                    'height': focusDim.height+ focusMargin.top + focusMargin.bottom + tagFocusMargin.top + tagFocusDim.height + tagFocusMargin.bottom,
                    'x': focusDim.width/2, 
                    'y': 0,
                    'id': 'tuner'
                });
        
        // overlay.append("path")
        // .style('fill','rgba(0,0,0,1)')
        //  .attr({
        //     "transform": "translate(" + focusDim.width/2 + "," + svgDim.height + ")",
        //     'd': "M 10 0 L 0 -10 L -10 0 l 10 0"
        //  });

        //Axis
        if (d3.select('#xAxis_g').empty()) {
            focus.append("g")
                .attr("class", "x axis")
                .attr("id", "xAxis_g")
                .attr("transform", "translate(0," + focusDim.height + ")")
                .call(xAxis);
        }

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        //Add transparent Rect for zoom function and call zoom for first time
        focus.append("rect")
            .attr("class", "pane")
            .attr("width", focusDim.width)
            .attr("height", focusDim.height)
            .call(zoom);

        //Apply colours
        changeColours();

    } //end makeGraph function

    //----------Setup brush-------------------------------------------------------------

    //.x(x).scaleExtent([1,10]) limits zoom from 1X to 10X
    var zoom = d3.behavior.zoom().x(xScale)
        .scaleExtent([0.1, 1000])
        .center([focusMargin.left+focusDim.width/2, 0])
        .on("zoom", zoomed)
        .on("zoomend", zoomEnded);

    //----------Setup zoom-------------------------------------------------------------

    function zoomed() {
        updateGraph(); //Continuously update graph while panning and zooming
    }

    function zoomEnded() {
        getComment(); //Get closest comment point
        shiftGraph(); //snap graph to closest point
        updateGraph(); //Update graph after snapping
        
        changeColours();
        //updateHeader();
    }

    function reset() {
        zoom.scale(1);
        zoom.translate([0, 0]);
    }

    function onEditGraph() {
        //console.log("graphSettings", graphSettings);
        //changeColours();
        //updateGraph();
        makeGraph();
    }

    //----------Update whole graph-------------------------------------------------------------
    //Global to capture x-pixel of current comment
    var xCommentDate = focusDim.width/2;
    var commentDate;

    //Update graph while panning and zooming and after snapping to closest comment
    function updateGraph() {

        //Update all line graphs currently rendered
        for (var i = 0; i < graphSettings.length; i++) {
            var id = graphSettings[i].id;
            var colour = graphSettings[i].colour;
            var type = id.split("_")[0]; //either: QIDS, SCORE, VAS, ASRM, tag
            var tag = id.split("_")[1];

            var tagRowcounter = 0;

            //Update line graph
            focus.select("#data_" + graphSettings[i].id).attr("d", areaFill);
            // focus.select("#mean1").attr("d", meanline(data1)); //update meanline when in place

            //Update dots on line graphs
            // var dots = focus.selectAll(".dot_" + graphSettings[i].id);
            // if (!dots.empty()) {
            //     dots.attr("cx", function(d) { return xScale(d.date); });
            // }

            if (type=="tag"){
                
                var rects = tagFocus.selectAll('.rect_' + tag);
                if (!rects.empty()) {
                    
                    //if ( colour == "rgba(0,0,0,0)")
                    //rects.remove();//delete
                    //else
                    rects.attr('x', function(d) { return xScale(d.date)-tagDim.width/2; });;
                    //.attr('y', function() { return tagRowcounter*tagDim.height });
                }
            }

        } //end for graphSettings length

        //Update comments
        var commentRects = tagFocus.selectAll('.rect_comment');
        if (!commentRects.empty()) {
            commentRects.attr('x', function(d) {return xScale(d.date)-tagDim.width/2;})
        }

        //Update all tags
        // for (var j = 0; j < initialData[initialDataTagIndex].results.length; j++) {

        //     var rects = tagFocus.selectAll('.rect_' + initialData[initialDataTagIndex].results[j].tag);

        //     if (!rects.empty()) {
        //         rects.attr('x', function(d) { return xScale(d.date)-tagDim.width/2; });
        //         // .attr('y', function(d, i) { return j * 21; });
        //     }
        // }

        focus.select(".x.axis").call(xAxis);

        // var tuner = focus.select('#tuner').transition(); //move tuner
        //  if (!tuner.empty()) {
        //     tuner.attr('x', xCommentDate); //move tuner to that point   
        // }

    }//end updateGraph()

    
    //Global to capture last midpointDate for snapping to right or left
    var lastMidpointDate = xScale.invert(focusDim.width/2);

    //----------Retrieve a comment based on closest entry to the midpoint, move the tuner----------------------
    function getComment() {
        //Get where the date the midpoint (ie. the ticker) has landed
        var midpointDate = xScale.invert(focusDim.width/2);

        var lastDateinDomain = x0.domain()[1]; //Remember x0? A copy of the domain before any zooming/scaling done
        
        var bisect; //define bisect function depending if midpoint tuner strip is to the right of the last point in graph
        var commentIndex; //index of comment to be displayed

        //if tuner strip is to the left of last data entry in graph (within range)
        if (midpointDate < lastDateinDomain){
            bisect = d3.bisector(function(d) { return d.date; }).left;//returns index of data to the right of bisector
            commentIndex = bisect(initialData[initialDataCommentIndex].results, midpointDate);

            //--Snapping based on direction of scroll right or left  - if user scrolled graph for an older date, snap to left
            // if (commentIndex > 0 && midpointDate<lastMidpointDate){
            //         commentIndex = commentIndex-1;
            // }

            //--Snapping based on whether user is closer to right/left date (works better for pinch-zoom on phones)
            if (commentIndex > 0){
            var dateDiff1 = Math.abs(initialData[initialDataCommentIndex].results[commentIndex].date-midpointDate);
            var dateDiff2 = Math.abs(initialData[initialDataCommentIndex].results[commentIndex-1].date-midpointDate);
            if (dateDiff2<dateDiff1)
                commentIndex = commentIndex-1;
            }
        }
        //if to the right of last entry, snap to last entry(out of range)
        else if (midpointDate > lastDateinDomain){
           commentIndex = initialData[initialDataCommentIndex].results.length-1;
        }    

        if (commentIndex==null)
        commentIndex = initialData[initialDataCommentIndex].results.length-1;//explicitly set to prevent null errors from fast zoom

        commentDate = initialData[initialDataCommentIndex].results[commentIndex].date;
        xCommentDate = xScale(commentDate); //pixel point of selected comment

        if (initialData[initialDataCommentIndex].results[commentIndex].Data!=null){
            var commentData = initialData[initialDataCommentIndex].results[commentIndex].Data;
            var commentTags = initialData[initialDataCommentIndex].results[commentIndex].Tags;

            $("#commentDateDiv").html(commentDateFormat(commentDate) );
            $("#commentDataDiv").html(commentData);
            $("#commentTagUL").html(""); //reset comment list
            //Append Tags
            if (commentTags.length >0){
                
                commentTags.forEach(
                    function(item){
                       jQuery('<li/>', {
                            id: item+"_li",
                            text: item
                        }).appendTo('#commentTagUL');

                       jQuery('<div/>', {
                            id: "div_"+item,
                            class: "tagDiv",
                            text: "",
                        }).prependTo("#"+item+"_li");

                        //$("#commentTagUL").append($(document.createElement('li')).text(item));
                    }
                )//end forEach
            }
        }

        //Get tags and values of graphs
        // var sID = initialData[initialDataCommentIndex].results[commentIndex].SessionID;
        // var thisRect = tagFocus.select("rect[data-sessionID='"+sID+"']");
        // thisRect.attr('sessionID', function(d) { return d.SessionID; });

    }//end getComment
    
    //----------Shift the graph to snap to selected comment-------------------------------------------------------------
    function shiftGraph() {

        //translate graph to closest comment
        var translateGraph = xCommentDate-focusDim.width/2;//zoom.translate()[0]
        zoom.translate([zoom.translate()[0]-translateGraph,0]);
        
        lastMidpointDate = commentDate; //remember this midpointDate for use in snapping
    }

    //----------Change all colours of graphs and tags-------------------------------------------------------------
    function changeColours() {
       
        for (var i = 0; i < graphSettings.length; i++) {
            
            var id = graphSettings[i].id; 
            var type = id.split("_")[0]; //either: QIDS, SCORE, VAS, ASRM, tag
            var tag = id.split("_")[1];

            //simple loop to check if colour exists in menu's graphColor object, if yes sync
            if (type != "tag"){
                for (var j = 0; j < graphColors.length; j++) {
                    if (graphColors[j].id == id){
                        graphSettings[i].colour = graphColors[j].color;
                    }
                }
            }
            else if (type == "tag"){
                //simple loop to check if colour exists in menu's tagColor object, if yes sync
                for (var j = 0; j < tagColors.length; j++) {
                    if (tagColors[j].id == tag){
                        graphSettings[i].colour = tagColors[j].color;
                    }
                }
            }
            var thisColour = graphSettings[i].colour;

            //Update tags
            if (type == "tag" && graphSettings[i].hasOwnProperty('tag')){             
                $(".rect_"+ graphSettings[i].tag).css("fill",thisColour);
                $("#div_"+ graphSettings[i].tag).css("background-color",thisColour);//item+"_div",
            }
            else if (type !="tag"){
                //Update line graphs and dots
                $("#data_"+id).css("fill",thisColour);
                $("#data_"+id).css("stroke",thisColour);

                //$(".dot_"+id).css("fill",thisColour);
            }
           
        } //end for graphSettings length
    }//end changeColours

    function updateHeader() {
        for (var i = 0; i < graphSettings.length; i++) {

            var qid = graphSettings[i].id; 
            var type = qid.split("_")[0]; //either: QIDS, SCORE, VAS, ASRM, tag
            var colour = graphSettings[i].colour;

            if (colour!= "rgba(0,0,0,0)" && type !="tag"){
                //console.log("colour", colour);
                
                //If header does not contain the graph item
                if (jQuery("#"+qid+"_header_li").length==0){
                    jQuery('<li/>', { 
                        id: qid+"_header_li",
                        text: qid
                    }).appendTo('#graph-header');
                
                    jQuery('<div/>', {
                                id: qid+"_menu_div",
                                class: "headerDiv",
                                text: "",
                    }).prependTo("#"+qid+"_header_li");
                }
                $("#"+qid+"_menu_div").css("background-color",colour);
            }

        }
    }//end updateHeaders

    //----------Return values for var Timeline-------------------------------------------------------------
    return {
        loadQuestionsInitial: loadQuestionsInitial,
        onEditGraph: onEditGraph
    };

}; //end var Timeline