var D3graph = (function() {
	
	var parent=0,
		focus=0;

	var settings = [],
		getSettings = function() {
			return settings;
		},
		data = [];

	//var defaultSession = false;
	
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
		fill: null,
		brush1: null,
		brush2: null
	};
	
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
			fill: null,
			brush: null
		};
	
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom"), 
		yAxis = d3.svg.axis().scale(y).orient("left");
	
	var pgWidth = $(window).width(); //1094,	// Originally 960
		pgHeight = 346;	// Originally 500
	
	var rgWidth = ($(window).width() - 4);//1098,
		rgHeight = 281;
		

	var x = d3.time.scale().range([ 0, pgWidth ]);
	
	var y = d3.scale.linear().range([ pgHeight, 0 ]);
	
		
	function parseDate(date) {
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
		x.domain(d3.extent(data.map(function(d) {
			return d.DayTime;
		})));
	}

	function createYdomain(y, data) {
		
		/*
		y.domain(d3.extent(data.map(function(d) {
			return d.Data;
		})));
		*/
		
		y.domain([
			25, 100
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

	var mark,
		xDiff;

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
	
	var meanline = d3.svg.line().interpolate("basis").x(function(d, i) {
		return x(d.date);
	}).y(function(d, i) {
		if (i == 0)
			ypre = y(d.Data);

		var ythis = alpha * y(d.Data) + (1.0 - alpha) * ypre;
		ypre = ythis;
		return ythis;
	});
	
	
	function plotDataGroup(graph, dataType) {
		// For each setting object...
		for (var i = 0; i < settings.length; i++) {
			// ...create a temporaty array called mapData to store the date/data info for each collection of data
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
					.style('stroke', colour)
					.style('opacity', '0.3');
				
				graph.insert('path', 'rect.mask')
					.datum(mapData)
					.attr('clip-path', 'url(#clip)')
					.attr('d', mgFocus.line)
					.attr('class', 'dataMa ma-' + id)
					//.style('fill', colour)
					.style('stroke', colour);
				
			}
		}
	}
	
	
	function rangeVertGreyAdj(range) {
		range.selectAll('g.x g.tick line').attr('y2', rgRange.height);
		range.selectAll('g.x g.tick text').attr('y', rgRange.height + 9);
	}
	
	function focusVertGreyAdj() {
		focus.selectAll('g.x g.tick line').attr('y2', mgFocus.height );
		focus.selectAll('g.x g.tick text').attr('y', mgFocus.height + 9);	
	}

	function getLine(x, y) {
		var line = d3.svg.line()
			//.interpolate('linear')
			.interpolate("basis")
			.x(function(d) {
				// console.log(d.Date);
				return x(d.Date);
			})
			.y(function(d) {
				// console.log(d.Data);
				return y(d.Data);
			});
		return line;
	}
	
	function getFill(x, y) {
		var	areaFill = d3.svg.area()
				.interpolate('linear')
				.x(function(d) { 
					return x(d.Date); })
				.y0(rgHeight)
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
			.attr('height', height + mTop + mBottom)
	}
	
	function createRect(graph, id, mTop, mLeft, width, height) {
		graph.append('g')
			.attr('class', id)// I think this needs a transform attribute
			.attr('transform', 'translate(' + mLeft + ',' + mTop + ')')
			.append('rect')
				.attr('width', width)
				.attr('height', height)
		.call(zoom);
	}
	
	function updateData() {
		//console.log(settings);
		settings = [];
		data = [];
		var colourCount = 0;

		pgWidth = $(window).width();

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
							initialData[i].colour = '#99999';
					}
					// For each collection of data in initialData Ajax response...
					var id = initialData[i].id;
					var name = initialData[i].name;
					// console.log(name);
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
									/*
										...if the current data date doesn't match initialData's current date...
										...and the current data date is the last one in data...
										...and dateMatch still equals false (meaning no date match was found)...
									*/
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
											/*
												...if the current data id doesn't match initialData's current id...
												...and the current data collection is the last one in the current date data collection...
												...and idMatch still equals false (meaning no id match was found)...
											*/
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
			}
		}		

		//$('#mb').show();
		$('#cfg div.svgWrap').show();
		
		// Convert each date in data to a true JavaScript Date() object
		jQuery.each(data, function(i, d) {
			d.DayTime = parseDate(d.DayTime);
		});
		// Sort the date objects in data in order of date (from oldest to newest)
		data.sort(dateSortAsc);
		
		// Set the graph settings for the parent graph
		graphSettings(mgFocus, $(window).width(), pgHeight);
		// Set the range of x positions along the parent graph (dates)
		createXdomain(mgFocus.x, data);
		// Set the range of y positions along the parent graph (0 - 100)
		createYdomain(mgFocus.y, data);
	
		// console.log(settings);
		
		
		//parent.select(".x.axis").call(xAxis);
		
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
		parent.append('g')// 'g' stands for 'group'
			.attr('id', 'focus')
			.attr( "preserveAspectRatio", "xMaxYMid")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr('transform', 'translate(' + mgFocus.margin.left + ',' + mgFocus.margin.top + ')')
			.call( zoom );
		
		focus = d3.select('#focus');
		
		//Axis
		focus.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(mgFocus.xAxis);

		focus.append("g")
				.attr("class", "y axis")
				.call(mgFocus.yAxis);
		
		
		// Chart the data paths and insert them into focus in parent
		plotDataGroup(focus, 'data');
		
		// This is the bottom horizontal date/time bar
		focus.append('g')
			.attr('class', 'x axis')
			// .attr('transform', 'translate(0,' + (mgFocus.height + 49) + ')')
			.attr('transform', 'translate(0,0)')
			.call(mgFocus.xAxis);
		focusVertGreyAdj();
		
		// Set the graph settings for the parent graph's context bar
		graphSettings(mgContext, pgWidth, pgHeight);
		
		// Set the range of x positions along the context graph (dates)
		mgContext.x.domain(mgFocus.x.domain());
		// Set the range of y positions along the context graph (0 - 100)
		mgContext.y.domain(mgFocus.y.domain());

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

	/* Interaction Functions */
	/* Zooom function */
	var zoom = d3.behavior
						.zoom()
						.x(x)
						.scaleExtent([ 0, 10 ])
						//.translate([0, $(window).width()])
						.on("zoom", zoomed);
	
	
	/* Declare drag behavior */
	/*var drag = d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended);
	 */
	
	/* Some kinda update function, I guess?*/

	//----------Setup zoom-------------------------------------------------------------
	function zoomed() {
		focus.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		updateData();
	}

	function reset() {
		zoom.scale(1);
		zoom.translate([ 0, 0 ]);
	}
	
	function dragstarted(d) {
	  d3.event.sourceEvent.stopPropagation();
	  d3.select(this)
	  	.classed("dragging", true);
	}

	function dragged(d) {
	  d3.select(this)
	  	.attr("cx", d.x = d3.event.x);
	  	//.attr("cy", d.y = d3.event.y);
	}

	function dragended(d) {
	  d3.select(this)
	  	.classed("dragging", false);
	}
	
	
	
	
	function setup() {
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
				.attr('id', 'clip')
				.append('rect')
					.attr('width', mgFocus.width)
					.attr('height', mgFocus.height);
		
		// Insert the white rectangle in behind the focus graph
		createRect(parent, 'bgFocus', mgFocus.margin.top, mgFocus.margin.left + 1, mgFocus.width, mgFocus.height + 77);
		
		// Add the parent SVG's focus graph and context graph
		addFocusContext();

	}
	
	var init = function() {
		setup();
	};

	var update = function(){
		updateData();
	};
	
	return {
		getSettings: getSettings,
		init: init
	};
	
})();

