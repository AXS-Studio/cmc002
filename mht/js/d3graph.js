var D3graph = (function() {
	
	var parent,
		focus,
		context;

	var settings = [],
		getSettings = function() {
			return settings;
		},
		data = [],
		comments = [],
		commentsCreated = false,
		tags = [],
		tagsCreated = false
		;

	var defaultSession = false;
	
	// var initialData = [];
	
	var colours = [
		'rgba(255,0,0,1.0)',		// Red
		'rgba(0,0,255,1.0)',		// Blue
		'rgba(0,255,0,1.0)',		// Green
		'rgba(255,165,0,1.0)',		// Orange
		'rgba(80,48,137,1.0)',		// Purple
		'rgba(222,36,229,1.0)',		// Violet
		'rgba(128,104,74,1.0)',		// Brown
		'rgba(212,201,137,1.0)',	// Tan
		'rgba(235,152,152,1.0)',	// Pink
		'rgba(116,212,216,1.0)'		// Teal
	];
	
	var months = [
		'Jan.', 'Feb.',
		'Mar.', 'Apr.',
		'May',  'Jun.',
		'Jul.', 'Aug.',
		'Sep.', 'Oct.',
		'Nov.', 'Dec.'
	];
	
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
	/* Cindy: Do not need context graph from PATH anymore, not in wireframe
	var mgContext = {
		width: null,
		height: null,
		margin: {
			top: 321,
			right: 19,
			bottom: 0,
			left: 33
		},
		x: null,
		y: null,
		xAxis: null,
		yAxis: null,
		line: null,
		area: null,
		brush: null
	};
	*/
	var pgWidth = $(window).width(), //1094,	// Originally 960
		pgHeight = 346;	// Originally 500
	
	var rgWidth = $(window).width(), //1098,
		rgHeight = 281;

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
	
	function getX(width) {
		var x = d3.time.scale().range([
			0,
			width
		]);
		return x;
	}

	function getY(height) {
		var y = d3.scale.linear().range([
			height,
			0
		]);
		return y;
	}

	function createXdomain(x, data) {
		x.domain(d3.extent(data.map(function(d) { return d.DayTime; })));
	}

	function createYdomain(y) {
		y.domain([
			0,
			/*d3.max(data.map(function(d) {
				return d.Data;
			}))*/
			100
		]);
	}

	function getXaxis(x) {
		var xAxis = d3.svg.axis().scale(x).orient('bottom');
		return xAxis;
	}

	function getYaxis(y) {
		var yAxis = d3.svg.axis().scale(y).orient('left');
		return yAxis;
	}

	function getDateX(x, data) {
		var dateX = x(data.Date);
		// console.log(dateX);
		return dateX;
	}

	var mark, xDiff;

	function addDateZero(digit) {
		digit = (digit < 10) ? '0' + digit : digit;
		return digit;
	}

	function getDateString(comDate) {
		var month = addDateZero(months[comDate.getMonth()]);
		var day = addDateZero(comDate.getDate());
		var year = comDate.getYear() - 100;
		var time = addDateZero(comDate.getHours()) + ':' + addDateZero(comDate.getMinutes()) + ':' + addDateZero(comDate.getSeconds());
		var dateString = month + ' ' + day + ', 20' + year + ' ' + time;
		return dateString;
	}

	var closeComments = function() {
		$('#svgParent div.commentLine').hide();
	};

	function plotComments(graph) {	
		// ----------------------- 
		// Comment stuff
		
		$('#svgParent').parent('div').append('<div class="commentsholder"></div>');
		graph.selectAll('rect.comment').remove();
		$('#svgParent div.commentLine').remove();
		// For each comment data set...
		for (var i = 0; i < comments.length; i++) {
			// ...add a rect mapped to the date x position 
			graph.insert('rect', '#fml')
				.attr({
					'width': 4,
					'height': 15,
					'x': getDateX(mgFocus.x, comments[i]) - 2,	// NOTE: Very, very important!!!
					'y': 235,
					'class': 'comment',
					'id': 'cmnt-' + i
				});

			var dateString = getDateString(comments[i].Date);

			$('.commentsholder').append('<div class="commentLine" id="ci-' + i + '" style="display: none; left: ' + (getDateX(mgFocus.x, comments[i]) + 35) + 'px;">\
				<h6>' + dateString + '</h6>\
				<div class="scroll">\
					<div class="content">\
						<p>' + comments[i].Data + '</p>\
					</div>\
				</div>\
			</div>');
		
			$('#cmnt-' + i).click(function() {
				closeComments();
				var id = $(this).attr('id').split('-')[1];
				$('#ci-' + id).show();
			});
		}
	}

	var closeTags = function() {
		$('#svgParent div.tagInline').hide();
	};

	function getUnique(array) {
		   var u = {}, a = [];
		   for(var i = 0, l = array.length; i < l; ++i){
		      if(u.hasOwnProperty(array[i].Data)) {
		         continue;
		      }
		      a.push( array[i].Data );
		      u[array[i].Data] = array[i].Data;
		   }
		   return a;
		}

	/* ------------------------------
	/* Tag Stuff Based on Comment stuff */
	
	var colors_arr = new Array();
	
	function plotTags(graph) {	


		graph.selectAll('rect.tag').remove();
		$('#svgParent div.tagInline').remove();
		// For each tag data set...

		var tags_arr = getUnique( tags );
		console.log("tags_arr", tags_arr);
		console.log("tags", tags);

		if (tags_arr.length > 0 ){
			$('#svgParent').append("<div id=\"tags\"><ul></ul></div>");	
			for ( var j=0; j < tags_arr.length; j++ ){
				var a_colour = colours[Math.floor(Math.random()*colours.length)]; 
				$('#tags ul').append('<li><span id="leg-swatchtag' + j + '" class="tagswatch" style="background:'+a_colour+'">&nbsp;</span>'+tags_arr[j]+'</li>');
				colors_arr.push( a_colour );
			}
		}
		
		for (var i = 0; i < tags.length; i++) {
			var position = (jQuery.inArray(tags[i].Data, tags_arr ));				
			// ...add a rect mapped to the date x position
			graph.insert('rect', '.y.axis')
				.attr({
					'width': 2,
					'height': 15,
					'title': tags[i].Data,
					'x': getDateX(mgFocus.x, tags[i]) - 2,	// NOTE: Very, very important!!!
					'y': 250 + ( position*15 ),
					'fill': colors_arr[position],
					'class': 'tags tag' + position,
					'id': 'tag-' + i
				});
		}
	}
	
	
	function getYPos(x, path) {
		var beginning = x,
			end = path.getTotalLength(),
			target;
		// console.log(end);
		while (true) {
			target = Math.floor((beginning + end) / 2);
			// console.log(target);
			pos = path.getPointAtLength(target);
			if ((target === end || target === beginning) && pos.x !== x) {
				break;
			}
			if (pos.x > x) 
				end = target;
			else if (pos.x < x) 
				beginning = target;
			else 
				break; //position found
		}
		return pos.y;
	}
	
	function plotDataGroup(graph, dataType) {
		// For each setting object...
		for (var i = 0; i < settings.length; i++) {
			// ...create a temporary array called mapData to store the date/data info for each collection of data
			var mapData = [];
			var id = settings[i].id;
			var colour = settings[i].colour;
			// For each date in data...
			for (var j = 0; j < data.length; j++) {
				var DayTime = data[j].DayTime;
				// For each collection of data in each date...
				for (var k = 0; k < data[j].Data.length; k++) {
					// If the current collection of data's id matches the current id in settings...
					if (data[j].Data[k].id == id) {
						// ...create a Date/Data object in mapData
						if (dataType == 'data') {
							mapData.push({
								"Date": DayTime,
								"Data": parseInt(data[j].Data[k].Data)
							});
						} else {
							mapData.push({
								"Date": DayTime,
								"Data": parseInt(data[j].Data[k].MA)
							});
						}
					}
				}
			}
			// Add a path for mapData's Date and Data points in Focus
			if (dataType == 'data') {
				graph.insert('path', 'rect.mask')
					.datum(mapData)
					.attr('clip-path', 'url(#clip)')
					.attr('d', mgFocus.area)
					.attr('class', 'dataPath path-' + id)
					.style('fill', colour)
					.style('opacity', '0.15')
					.style('stroke', colour);
				
				graph.insert('path', 'rect.mask')
					.datum(mapData)
					.attr('clip-path', 'url(#clip)')
					.attr('d', mgFocus.line)
					.attr('class', 'dataMa ma-' + id)
					.style('stroke', colour);	
			}
		}
	}
	
	/* Declare zoom behavior */
	var zoom = d3.behavior.zoom()
		.scaleExtent([0, 10])
		.on("zoom", zoomed);

	
	function plotData(graph) {
		plotDataGroup(graph, 'data');
		plotDataGroup(graph, 'movingAverage');
	}
	
	function rangeVertGreyAdj(range) {
		range.selectAll('g.x g.tick line').attr('y2', rgRange.height);
		range.selectAll('g.x g.tick text').attr('y', rgRange.height + 9);
	}
	
	function focusVertGreyAdj() {
		focus.selectAll('g.x g.tick line').attr('y2', mgFocus.height );
		focus.selectAll('g.x g.tick text').attr('y', mgFocus.height + 9);	
	}

	var alpha = 0.1;
	var ypre, xpre;
	var meanline = d3.svg.line()
		.interpolate("basis")
		.x(function(d, i) { 	
			return x(d.date);
		})
		.y(function(d, i) { 	
			if(i==0)
			ypre = y(d.Answer);   
			
			var ythis = alpha*y(d.Answer) + (1.0-alpha)*ypre;
			ypre = ythis;
			return ythis;
		});

	function getLine(x, y) {
		var alpha = 0.1;
		var ypre, xpre;
		
		var line = d3.svg.line()
				.interpolate('basis')
				.x(function(d, i) {
					// console.log(d.Date);
					return x(d.Date);
				})
				.y(function(d, i) {					
					if(i==0)
					ypre = y(d.Data);				
					var ythis = alpha*y(d.Data) + (1.0-alpha)*ypre;
					ypre = ythis;
					return ythis;
				});
		return line;
	}

	function getFill(x, y) {
		var	areaFill = d3.svg.area()
				.interpolate('linear')
				.x(function(d) { 
					return x(d.Date); })
				.y0(mgFocus.height)
				.y1(function(d) { return y(d.Data); });
		
		return areaFill;
	}  
	
	function graphSettings(gSettings, width, height) {
		gSettings.width = (width - gSettings.margin.left) - gSettings.margin.right;
		gSettings.height = (height - gSettings.margin.top) - gSettings.margin.bottom;
		gSettings.x = getX(gSettings.width);
		gSettings.y = getY(gSettings.height);
		gSettings.xAxis = getXaxis(gSettings.x);
		gSettings.yAxis = getYaxis(gSettings.y);
		// graph.area = getArea(graph.x, graph.height, graph.y);
		gSettings.line = getLine(gSettings.x, gSettings.y);
		gSettings.area = getFill(gSettings.x, gSettings.y);
	}
	
	function createSvg(element, id, width, height, mTop, mRight, mBottom, mLeft) {
		d3.select(element).append('svg')
			.attr('id', id)
			.attr('width', width + mLeft + mRight)
			.attr('height', height + mTop + mBottom);
	}
	
	function createRect(graph, id, mTop, mLeft, width, height) {
		graph.append('g')
			.attr('class', id)
			.attr('transform', 'translate(' + mLeft + ',' + mTop + ')')
			.append('rect')
				.attr('width', width)
				.attr('height', height)
		.call(zoom);
	}
	
	function updateData() {
		settings = [];
		data = [];
		var colourCount = 0;

//		console.log( initialData );
		
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
									"Data": [
										{
											"id": id,
											"Data": rData,
											"MA": rMovAv,
											"integral": rIntegral
										}
									]
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
											"Data": [
												{
													"id": id,
													"Data": rData,
													"MA": rMovAv,
													"integral": rIntegral
												}
											]
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
					}
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
			} else if (initialData[i].id == 'sessions'/* && notesCreated == false*/) {
				//SessionSelect.parseSessInfo(initialData[i].info);
				if (initialData[i].info.current.data != undefined) {
					if (initialData[i].info.current.data.range1dates != undefined) 
						setRangeDates(1, initialData[i].info.current.data.range1dates);
					if (initialData[i].info.current.data.range2dates != undefined) 
						setRangeDates(2, initialData[i].info.current.data.range2dates);
				}
			}
		}
		
		if (data.length > 0) {
			$('#cfg div.svgWrap').show();
		}

		// Convert each date in data to a true JavaScript Date() object
		jQuery.each(data, function(i, d) {
			d.DayTime = parseDate(d.DayTime);
		});

		// Sort the date objects in data in order of date (from oldest to newest)
		data.sort(dateSortAsc);
		
		// Set the graph settings for the parent graph
		graphSettings(mgFocus, pgWidth, pgHeight);

		// Set the range of x positions along the parent graph (dates)
		createXdomain(mgFocus.x, data);

		// Set the range of y positions along the parent graph (0 - 100)
		createYdomain(mgFocus.y);

		if (commentsCreated == false) {
			commentsCreated = true;
			// Convert each date in comments to a true JavaScript Date() object
			jQuery.each(comments, function(i, c) {
				// console.log('Date: '+ c.Date);	ALERT: The problem has to do with these dates on the second pass. They've already been converted.
				c.Date = parseDate(c.Date);
				// console.log('Date: '+ c.Date);
			});
			// Sort the date objects in comments in order of date (from oldest to newest)
			comments.sort(dateSortAsc);
		}

		if (tagsCreated == false) {
			tagsCreated = true;
			// Convert each date in comments to a true JavaScript Date() object
			jQuery.each(tags, function(i, c) {
				// console.log('Date: '+ c.Date);	ALERT: The problem has to do with these dates on the second pass. They've already been converted.
				c.Date = parseDate(c.Date);
				// console.log('Date: '+ c.Date);
			});
			// Sort the date objects in comments in order of date (from oldest to newest)
			tags.sort(dateSortAsc);
		}

		//console.log(settings);
	}
	
	function updateInitial(id, name, dates) {
		for (var i = 0; i < initialData.length; i++) {
			if (initialData[i].id == id) {
				// initialData[i].colour = null;
				initialData[i].name = name;
				initialData[i].results = dates;
			}
		}
		// console.log(initialData);	ALERT: Stopped here.
		updateData();
	}
	
	function addFocusContext() {
		// Create the group in parent that will house the data paths for each collection of data
		parent.append('g')  // 'g' stands for 'group'
			.attr('id', 'focus')
			.attr('transform', 'translate(' + mgFocus.margin.left + ',' + mgFocus.margin.top + ')');
		
		focus = d3.select('#focus');
		
		// Chart the data paths and insert them into focus in parent
		plotData(focus);
		
		// This is the bottom horizontal date/time bar
		focus.append('g')
			.attr('class', 'x axis')
			// .attr('transform', 'translate(0,' + (mgFocus.height + 49) + ')')
			.attr('transform', 'translate(0,0)')
			.call(mgFocus.xAxis);

		focusVertGreyAdj();
		
		// Set the graph settings for the parent graph's context bar
		//graphSettings(mgContext, pgWidth, pgHeight);
		
		// Set the range of x positions along the context graph (dates)
		//mgContext.x.domain(mgFocus.x.domain());

		// Set the range of y positions along the context graph (0 - 100)
		//mgContext.y.domain(mgFocus.y.domain());

		// This is the left vertical data bar
		focus.append('g')
			.attr('class', 'y axis')
			.call(mgFocus.yAxis);
		focus.selectAll('g.y g.tick line').attr('x2', mgFocus.width);
		// focus.select('g.y path.domain').remove();

	}

	function updateColourRefs(arr, id, colour) {
		jQuery.each(arr, function(i, d) {
			if (d.id == id) {
				d.colour = colour;
			}
		});
	}

	var colourPickerOpen = false;

	function addTagSwatches() {	
		/* ALERT: Big problem in here regarding the swatches. */
		if (tags.length > 0) {
			var tags_arr = getUnique( tags ); 
			for (var j = 0; j < tags_arr.length; j++) {
				$('#tags-legend').append('<li><span title="Change ' + tags_arr[j] + '\'s colour" class="swatches" id="swatch-tag' + j + '" style="background-color:' + colors_arr[j] + '"\></span> <span>' + tags_arr[j] + '</span></li>');
				$('#swatch-tag' + j).css('background-image', 'none');

				// For each setting...
				//jQuery.each(settings, function(j, s) {
					//alert(s.id);
					//$('#swatch-tag' + j).parent('li').removeClass('disabled');
					/* If the setting's colour is transparent, replace the swatches background colour with a transparency image... */
					/*if (s.colour == 'transparent'){					
						$('#swatch-tag' + j).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
						// ...otherwise, use the setting's background colour
					}else{ 
						$('#swatch-tag' + j).css('background', s.colour);
						//$('#swtchs-legend #swatch-' + j).parent('li').css('display', 'block');
					}*/
					/*$('#swatch-tag' + j).live('click', function(){
							alert( j );
					});*/

					//if (!$('#swatch-tag' + j).parent().hasClass('disabled')) {
						// Apply ColorPicker plug-in to the swatch
						$('#swatch-tag' + j).colorpicker({
							alpha: true,
							color: "transparent",
							colorFormat: 'RGBA',
							inline: false,
							rgb: false,
							hsv: false,
							altAlpha: false,
							preview: false,
							select: function(event, color) {
								sessionChanged = true;
								var newColour = color.formatted;
						//		var code = $(this).parents('ul.swatches').attr('id').split('-')[1];
						//		var name = $(this).parent().children('span').html();
								$(this).css('background', newColour);
								if (newColour.split(',')[3] == '0)') {
									newColour = 'transparent';
									$(this).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
								}
								//$(this).css('background', newColour);

								var tag_id = $(this).attr('id').split('-')[1];

								$('#swatch-tag' + j ).css('background', newColour);
								$('#leg-swatch' + tag_id ).css('background', newColour);
								$('.' + tag_id ).css('fill', newColour);

								//s.colour = newColour;
								//updateColourRefs(initialData, j, newColour);
								//updateColourRefs(settings, j, newColour);

							},
							close: function(event, color) {
								var newColour = color.formatted;
								//updateColourRefs(initialData, j, newColour);
								//updateColourRefs(settings, j, newColour);
							}
						});
					//}
		//		});
				$('#scs ul.swatches li span').click(function() {
					return false;
				});
			}
		}
	}

	function addSwatches() {	/* ALERT: Big problem in here regarding the swatches. */
		var otherCount = 0;

		if (data.length > 0) {
			$('#graphMenu').append('<div class="swatchColumns" id="scs"><ul id="scs-menu"></ul></div>');
			$('#graphMenu').append('<div class="top-legend" id="top-legend"></ul><ul id="questions-legend"></ul></li>');

			$('#scs-menu').append('<li><h2><a href="#">Legend</a></h2><div class="menu-section" id="menu-legend"></ul></li>');
			$('#scs-menu').append('<li><h2><a href="#">Edit</a></h2><div class="menu-section" id="menu-edit"></ul><ul id="tags-legend"></ul></li>');
			$('#scs-menu').append('<li><h2><a href="#">Share</a></h2><div class="menu-section" id="menu-share"><ul><li><button>Save As PDF</button></li><li><button>Email PDF</button></li></ul></div></ul></li>');

			$('#legend_content').append('<h2>Survey Questions</h2><ul class="swatches" id="swtchs-legend"></ul>');
			$('#edit_content').append('<h2>Survey Questions</h2><ul class="swatches" id="swtchs-edit"></ul>');
			$('#share_content').append('<ul><li><button>Save As PDF</button></li><li><button>Email PDF</button></li></ul></div></ul></li>');
			

			for (var i = 0; i < questions.length; i++) {
				var category = questions[i].category;
				/*  ALERT: Here's the problem with the items in the "OTHER" category: Two OTHER categories
					are being included instead of one, so I'm not including the second OTHER object... */
				if (category != 'Aggregate Scores' /* && (category != 'OTHER' || (category == 'OTHER' && otherCount == 0))*/) {
					for (var j = 0; j < questions[i].type.length; j++) {
						var id = questions[i].type[j].id;
						var name = questions[i].type[j].name;
						$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span href="#" class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
						$('#swtchs-legend').append('<li style="display:none;"><span class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
						$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" class="swatches" id="swatch-' + id + '"></a><span>' + name + '</span></li>');
					}
				}

				/*  ALERT: End OTHER fix.  */
				if (category == 'Aggregate Scores') {
					//$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" id="swatch-SCORE_0"></a> <span>QIDS Score</span></li>');
					$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span>QIDS Score</span></li>');
					$('#swtchs-legend').append('<li><span class="swatches" id="swatch-SCORE_0"></span> <span>QIDS Score</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" id="swatch-' + id + '"></a> <span>' + name + '</span></li>');
				}

				// For each setting...
				jQuery.each(settings, function(i, s) {
					$('#swatch-' + s.id).parent().removeClass('disabled');

					/* If the setting's colour is transparent, replace the swatches background colour with a transparency image... */
					if (s.colour == 'transparent'){					
						$('#menu-legend #swatch-' + s.id).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
						$('#menu-edit #swatch-' + s.id).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
						//$('#menu-legend #swatch-' + s.id).parent('li').remove();

					// ...otherwise, use the setting's background colour
					}else{ 
						$('#swatch-' + s.id).css('background', s.colour);
						$('#menu-edit #swatch-' + s.id).css('background', s.colour);
						$('#legend-' + s.id + ' .swatches').css('background', s.colour);
						$('#legend-' + s.id).css('display', 'inline-block');
						$('#swtchs-legend #swatch-' + s.id).parent('li').css('display', 'block');
					}

					if (!$('#swatch-' + s.id).parent().hasClass('disabled')) {
						// Apply ColorPicker plug-in to the swatch
						$('#swtchs-edit #swatch-' + s.id).colorpicker({
							alpha: true,
							color: s.colour,
							colorFormat: 'RGBA',
							inline: false,
							rgb: false,
							hsv: false,
							altAlpha: false,
							preview: false,
							select: function(event, color) {
								sessionChanged = true;
								var newColour = color.formatted;
								var code = $(this).parents('ul.swatches').attr('id').split('-')[1];
								var name = $(this).parent().children('span').html();
								$(this).css('background', newColour);
								if (newColour.split(',')[3] == '0)') {
									newColour = 'transparent';
									$(this).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
								}

								$('.path-' + s.id).css('stroke', newColour);
								$('.ma-' + s.id).css('stroke', newColour);
								$('.path-' + s.id).css('fill', newColour);
								$('.intLeg-' + s.id + ' div').css('background-color', newColour);
								$('#legend-'+ s.id ).css('display', "inline-block");
								$('#legend-'+ s.id ).css('display', "inline-block");
								$('#legend-' + s.id + ' a').css('background', s.colour);
								$('#swatch-' + s.id).css('background', s.colour);
								$('#swtchs-legend #swatch-' + s.id).parent('li').css('display', 'block');

								s.colour = newColour;
								updateColourRefs(initialData, s.id, newColour);
								updateColourRefs(settings, s.id, newColour);

								// Ajax calls are going to go in here
								jQuery.each(initialData, function(i, d) {
										if (s.id == d.id) {
											if (d.results == null) {
												$.ajax({
													type: 'GET',
													url: 'php/query_answers.php',
													data: {
														"patientID": patient,
														"questionID": d.id
													},
													dataType: 'json',
													success: function(response) {
														//console.log(response.results);
														updateInitial(s.id, code + '_' + name, response.results);
														// Reset the range1 and range2 brush settings
														// Re-add the parent SVG's focus graph and context graph
														addFocusContext();
														// Update the integrals table
													},
													error: function() {
														window.alert('Swatch Ajax error.');
													}
												});
											}
										}
								});
							},
							close: function(event, color) {
								var newColour = color.formatted;
								updateColourRefs(initialData, s.id, newColour);
								updateColourRefs(settings, s.id, newColour);
							}
						});
					}
				});
				$('#scs ul.swatches li a').click(function() {
					return false;
				});
			}
		}
	}

	/* Interaction Functions */
	function zoomed() {
		//$('#parentSvg').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		focus.select(".x.axis").call(getXaxis);
		zoom.scale(2);
	}
	
	function reset() {
		zoom.scale(1);
		zoom.translate([ 0, 0 ]);
	}
	
	
	function setup() {
		comments = [];
		commentsCreated = false;
		tags = [];
		tagsCreated = false;
		settings = [];
		integralsFocus = [];

		for (var i = 0; i < initialData.length; i++) {
			if (initialData[i].id == 'sessions') {
				if (initialData[i].info.current.name != 'Create New') {
					defaultSession = false;
				} else 
					defaultSession = true;
			}
		}

		// Update the data object
		updateData();

		createSvg('#svgParent', 'parentSvg', mgFocus.width, mgFocus.height, mgFocus.margin.top, mgFocus.margin.right, mgFocus.margin.bottom, mgFocus.margin.left);
		parent = d3.select('#parentSvg');
		//addIntegralsDiv('#svgParent');
		
		// Insert a few elements into the parent SVG (clipPath, rect)
		parent.append('defs')
			.append('clipPath')
				.attr('id', 'clip-parent')
				.append('rect')
					.attr('width', mgFocus.width)
					.attr('height', mgFocus.height);
		
		// Insert the white rectangle in behind the focus graph
		createRect(parent, 'bgFocus', mgFocus.margin.top, mgFocus.margin.left + 1, mgFocus.width, mgFocus.height + 77);
		
		// Add the parent SVG's focus graph and context graph
		addFocusContext();

		// Create the swatch menu beneath the SVG graphs
		addSwatches();

		setTimeout(function(){ plotComments( focus ); }, 300);

		setTimeout(function(){ plotTags( focus ); }, 300);

		setTimeout(function(){  addTagSwatches(); }, 300);
	}
	
	var init = function() {
		setup();
		initGraphMenu();
	};

	return {
		getSettings: getSettings,
		closeComments: closeComments,
		closeTags: closeTags,
		init: init
	};
	
})();