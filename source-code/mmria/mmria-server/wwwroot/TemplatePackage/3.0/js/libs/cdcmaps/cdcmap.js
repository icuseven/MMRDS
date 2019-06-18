CDC.Datamap = function (c, $, w, _) {    
    'use strict';
    
    // private variables specific to this module
    var config = {
        id: 'datamap'
    },
    
    $mapContainer,
    contentId,
    mapContainerId,
    mapTitle,
    mapSummary,
    mapSubtext,
    mapLayout,
    timeIntervalDataColumn,
    timeIntervalDisplayColumn,
    timeIntervalTitle,
    legendTitle,
    legendText,
    datasetUrl,
    datasetExtension,
    dataColumnName,
    dataColumnFriendlyName,
    stateColumnName,
    stateColumnType,
    classificationType,
    specialClassValues,
    specialClassStyles,
    //colorPaletteType,
    colorPalette,
    dataPrefix,
    dataSuffix,
    numberOfColors,
    territories = [],
    cities = [],
    counties = [],
    smallStates = [],
    data = [],
    filteredData = [],
    dataByTimeInterval = [],
    statesWithLocalesArray = [],
    currentTimeSeriesIndex = -1,
    usTopo,
    initialMapHeight,
    allDataWithStateInfo = [],
    totalNumberOfColors = 9,
    highValue = Number.MIN_VALUE,
    lowValue = Number.MAX_VALUE,
    dataPrecision = 0,
    timeSeriesValues = [],
    tooltip,
    svgStates,
    svgCircles,
    rdTemplateType,
    $mapModule,
    $mapSvgContainer,
    $rawDataContainer,
    inVP1,
    svgWidth,
    legendItems = [],
    projection,
    path,
    svg,
    g,
    //throttleTimer,
    stateColumnType,
    classificationValues,
    specialClassValues,
    width,
    height,
    active,
    mapClass,
    legendClass,
    tableAndSubtextClass,
    language,
    hideDownload = false,
    hideCities = false,
    wholeNumbers = false,
    separateZero = false,
    zeroInDataSet = true,
    stateNavigateUrlColumn,
    tableCollapsed,
    displayColumns,
    displayMapAndLegend = true,
    maxDataPrecision = 0,
    isTouchDevice = $('html.touch').length > 0,
    viewportUpdatedHandlerAdded = false,
    embeddedInTab = false,

    init = function (container) {
    	$mapContainer = $(container),
        //contentId = $mapContainer.data('contentid'),
        mapContainerId = $mapContainer.attr('id'),
        mapTitle = $mapContainer.data('maptitle'),
        mapSummary = $mapContainer.data('mapsummary'),
        mapSubtext = $mapContainer.data('mapsubtext'),
        timeIntervalDataColumn = $mapContainer.data('timeintervaldatacolumn'),
        timeIntervalDisplayColumn = $mapContainer.data('timeintervaldisplaycolumn'),
        timeIntervalTitle = $mapContainer.data('timeintervaltitle'),
        legendText = $mapContainer.data('legendtext'),
        datasetUrl = $mapContainer.data('dataseturl'),
        dataColumnName = $mapContainer.data('datacolumnname'),
        dataColumnFriendlyName = $mapContainer.data('datacolumnfriendlyname'),
        stateColumnName = $mapContainer.data('statecolumnname'),
        stateColumnType = $mapContainer.data('statecolumntype'),
        classificationType = $mapContainer.data('classificationtype'),
        //colorPaletteType = $mapContainer.data('colorpalettetype'),
        colorPalette = $mapContainer.data('colorpalette'),
        dataPrefix = $mapContainer.data('dataprefix'),
        dataSuffix = $mapContainer.data('datasuffix'),
        numberOfColors = $mapContainer.data('numberofcolors');
        mapLayout = $mapContainer.data('layout');
        language = $mapContainer.data('language');
        if (!language) { //Options: map75, map100
            language = '';
        } else if (language === 'en') {
            language = '';
        }
        hideDownload = $mapContainer.data('hidedownload');

        if (hideDownload === undefined) {
            hideDownload = false;
        }

        hideCities = $mapContainer.data('hidecities');

        if (hideCities === undefined) {
            hideCities = false;
        }

        wholeNumbers = $mapContainer.data('wholenumbers');

        if (wholeNumbers === undefined) {
            wholeNumbers = false;
        }

        separateZero = $mapContainer.data('separatezero');

        if (separateZero === undefined) {
            separateZero = false;
        }

        stateNavigateUrlColumn = $mapContainer.data('navigateurlcolumn');
        
        legendTitle = $mapContainer.data('legendtitle') ? $mapContainer.data('legendtitle') : (language === 'es' ? 'Acerca de este mapa' : 'About This Map');

        if (typeof d3 === 'undefined') { //IE 8 and below, if d3 is undefined
            displayMapAndLegend = false;
        }

        var n = mapContainerId.lastIndexOf('-');
        contentId = mapContainerId.substring(n+1);
        
        //Get column to display in popup and datatable
        displayColumns = window['cdcmap_columns_'+contentId];
        
        tableCollapsed = $mapContainer.data('tablecollapsed');
        if (tableCollapsed === undefined) {
            tableCollapsed = false;
        }
        
        if (!stateNavigateUrlColumn) {
            stateNavigateUrlColumn = "";
        }
        
        if (!mapLayout) { //Options: map75, map100
            mapLayout = 'map75';
        }


        if ($mapContainer.parents('.tabs,.accordion').length) {
            embeddedInTab = true;
        }

        if ($('#body').hasClass('span24')) { //Template Type B
            if (mapLayout === 'map75') {
                mapClass='span18';
                legendClass='span6';
                tableAndSubtextClass='span24';
            } else {
                mapClass='span24';
                legendClass='span24';
                tableAndSubtextClass='span24';
            }
        } else { //Template Type A
            if (mapLayout === 'map75') {
	    	if ($mapContainer.parents('.tabs,.accordion').length) {
			mapClass='span14';
	                legendClass='span4';
	                tableAndSubtextClass='span18';
		} else {
	                mapClass='span15';
	                legendClass='span4';
	                tableAndSubtextClass='span19';
		}
            } else {
	    	if ($mapContainer.parents('.tabs,.accordion').length) {
	                mapClass='span18';
	                legendClass='span18';
	                tableAndSubtextClass='span18';
		} else {
			mapClass='span19';
	                legendClass='span19';
	                tableAndSubtextClass='span19';
		}
            }         
        }
        
        if (typeof dataColumnFriendlyName !== undefined && dataColumnFriendlyName.trim().length === 0) {
            dataColumnFriendlyName = dataColumnName;
        }
        
        var specialClassValuesString = $mapContainer.data('specialclassvalues');
        if (specialClassValuesString) {
            specialClassValues = specialClassValuesString.split(',');
        }
        if (specialClassValues && specialClassValues.length > 0) {
            $.each(specialClassValues, function( index, value ) {
                specialClassValues[index] = value.trim();
            });
        }

        var specialClassStylesString = $mapContainer.data('specialclassstyles');
        if (specialClassStylesString) {
            specialClassStyles = specialClassStylesString.split(',');
        }
        if (specialClassStyles && specialClassStyles.length > 0) {
            $.each(specialClassStyles, function( index, value ) {
                specialClassStyles[index] = value.trim();
            });
        }
        if (specialClassStyles === undefined) {
            specialClassStyles = [];
            specialClassStyles.push('special1');
            specialClassStyles.push('special2');
            specialClassStyles.push('special3');
            specialClassStyles.push('special4')
        }

        var classificationValuesString = $mapContainer.data('classificationvalues');
        if (classificationValuesString) {
            classificationValues = classificationValuesString.split(',');
        }
        if (classificationValues && classificationValues.length > 0) {
            $.each(classificationValues, function( index, value ) {
                classificationValues[index] = value.trim();
            });
        }

        if (!displayMapAndLegend) { //IE 8 or less
            $.getJSON( "/TemplatePackage/3.0/js/libs/d3/us.json", function( us ) {
                if (datasetUrl.indexOf('.csv')>0) {
                    datasetExtension = 'csv';
                    $.ajax({
                        type: "GET",
                        url: datasetUrl,
                        dataType: "text",
                        success: function(csv) {
                            var raw = CSVToArray(csv);
                            ready(null, raw, us);
                        }
                     });
                } else {
                    datasetExtension = 'json';
                    $.getJSON( datasetUrl, function( raw ) {
                        ready(null, raw, us);
                    });
                }
            });
        } else {
            var width = $mapContainer.width(),
                height = width/2,
                active = d3.select(null);

            if ($mapContainer.parents('.tabs,.accordion').length) {
                width = $mapContainer.parents('.tabs,.accordion').find('[role="tabpanel"]:visible').find('[id^=cdcmap-container]').width();
                height = width/2;

                $mapContainer.parents('.ui-accordion-content').css('padding-left','1em').css('padding','.5em');
            }

            //Request required assets and defer until all are complete
            if (datasetUrl.indexOf('.csv')>0) {
                datasetExtension = 'csv';
                queue()
                    .defer(d3.csv, datasetUrl)
                    .defer(d3.json, "/TemplatePackage/3.0/js/libs/d3/us.json")
                    .await(ready);
            } else {
                datasetExtension = 'json';
                queue()
                    .defer(d3.json, datasetUrl)
                    .defer(d3.json, "/TemplatePackage/3.0/js/libs/d3/us.json")
                    .await(ready);
            }


        }
    },
    /*      
    svgToImage = function() {
        //var svgElement = $('#'+mapContainerId+ ' svg');
        $('#'+mapContainerId+ ' svg').each(function() {
            var svg$ = $(this);
            var width = svg$.width();
            var height = svg$.height();

            // Create a blob from the SVG data
            var svgData = new XMLSerializer().serializeToString(this);
            var blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

            // Get the blob's URL
            var blobUrl = (self.URL || self.webkitURL || self).createObjectURL(blob);

            // Load the blob into an image
            $('<img />')
                .width(width)
                .height(height)
                .on('load', function() {
                    // Overwrite the SVG tag with the img tag
                    svg$.replaceWith(this);
                })
                .attr('src', blobUrl);
        });
    },
    */    
    
    CSVToArray = function (csvString){
        // The array we're going to build
        var csvArray   = [];
        // Break it into rows to start
        var csvRows    = csvString.split(/\n/);
        // Take off the first line to get the headers, then split that into an array
        var csvHeaders = csvRows.shift().split(',');
        // Loop through remaining rows
        for(var rowIndex = 0; rowIndex < csvRows.length; ++rowIndex){
          var rowArray  = csvRows[rowIndex].split(',');

          // Create a new row object to store our data.
          var rowObject = csvArray[rowIndex] = {};

          // Then iterate through the remaining properties and use the headers as keys
          for(var propIndex = 0; propIndex < rowArray.length; ++propIndex){
            // Grab the value from the row array we're looping through...
            var propValue =   rowArray[propIndex];//.replace(/^"|"$/g,'');
            // ...also grab the relevant header (the RegExp in both of these removes quotes)
            var propLabel = csvHeaders[propIndex].trim();//.replace(/^"|"$/g,'');
            rowObject[propLabel] = propValue;
          }
        }
        return csvArray;
    },
    
    setup = function (width) {

        inVP1 = $("html.one").length;
        if (displayMapAndLegend) {
            var containerWidth = $mapSvgContainer.width();

            svgWidth = containerWidth;// - 30;
            //if ($mapContainer.parents('.tabs,.accordion').length) {
                if (embeddedInTab) {
                    if (inVP1) {
                        svgWidth = $('.accordion').width()-50;
                    } else {
                        svgWidth = $('.tabs').width()-50;
                    }
                }
                //console.log('MY WIDTH: ' + svgWidth);
                //svgWidth = $mapContainer.parents('.tabs,.accordion').find('[role="tabpanel"]:visible').find('[id^=cdcmap-container]').find('[id^=cdcmap-svgContainer]').width();
                //console.log("MY WIDTH " + tabOrAccordionNode.width());
                //console.log("TABS WIDTH " + $('.tabs').width());
                //if (svgWidth < 289 && inVP1) {
                //    svgWidth = $(window).width()-45;
                //}

            //}

            width = svgWidth + 50; //Add 80 for scaling and minus 30 for padding

            //var scaleWidthOffset = 80;
            var translateWidthOffset = 0;
            if (inVP1) {
                translateWidthOffset = 0;
                $('#' + mapContainerId + ' .module-typeA .cdcmap-tooltip').css('top','0').css('left','0').addClass('gray2-bg-color');
            } else {
                $('#' + mapContainerId + ' .module-typeA .cdcmap-tooltip').addClass('hidden').removeClass('gray2-bg-color');;
            }

            var heightOffset = 0;
            if (inVP1) {
                heightOffset = 47; //accounting for hhs-cdc logo
            } else {
                //heightOffset = (Math.ceil(smallStates.length/3) * 25) + (Math.ceil(territories.length/3) * 25) + 40;
                
                heightOffset +=20;
                if (cities.length > 0) {
                    heightOffset += (Math.ceil(cities.length/3) * 25);
                }

                if (counties.length > 0) {
                    heightOffset += (Math.ceil(counties.length/3) * 25);
                    if (cities.length > 0) {
                        heightOffset += 14;
                    }
                }

                if (territories.length > 0) {
                    heightOffset += (Math.ceil(territories.length/3) * 25);
                    if (cities.length > 0 || counties.length > 0) {
                        heightOffset += 14;
                    }
                }

                //heightOffset = (Math.ceil(territories.length/3) * 25) + 20;
            }

            height = (width + translateWidthOffset) / 2;
            initialMapHeight = height + 20;

            projection = d3.geo.albersUsa()
                .scale(width + translateWidthOffset)
                .translate([(width - 25) / 2 ,height/2]);
        //        /.translate([width / 2, (height + (translateWidthOffset/2)) / 2]);

            path = d3.geo.path()
                .projection(projection);

            $('#cdcmap-svgContainer-'+contentId).empty(); //clear svg in case this is called twice

            svg = d3.select('#cdcmap-svgContainer-'+contentId).append("svg")
                .attr("width", svgWidth)
                .attr("height", height + heightOffset);
                //.call(zoom);
            /*
            svg.append("rect")
                .attr("class", "background")
                .attr("width", svgWidth)
                .attr("height", height + heightOffset)
                .on("dblclick", reset);
            */

            g = svg.append("g")
                .style("stroke-width", "1.5px");
                //.attr("class", "Blues");
                
            
            var defs = svg.append("defs");
                    
            var hatching = defs.append("pattern")
            hatching.attr("id","hatching")
                        .attr("x","0")
                        .attr("y","0")
                        .attr("width","5")
                        .attr("height","5")
                        .attr("patternUnits","userSpaceOnUse")
                        .append("rect")
                                        .attr("width","5")
                                        .attr("height","5")
                                        .attr("style","fill:rgb(240,240,240)");
            hatching.append("line")
                                        .attr("x1","0")
                                        .attr("y1","0")
                                        .attr("x2","5")
                                        .attr("y2","5")
                                        .attr("style","stroke:rgb(120,120,120);stroke-width:.5");
            /*hatching.append("line")
                                        .attr("x1","5")
                                        .attr("y1","0")
                                        .attr("x2","0")
                                        .attr("y2","5")
                                        .attr("style","stroke:rgb(170,120,0);stroke-width:.5");*/

        }
        
        var filterVal = timeSeriesValues[currentTimeSeriesIndex].dataVal;

        filteredData = dataByTimeInterval[filterVal];
    },

    //Gets state color
    colorize = function (d) {
        var stateObj = filteredData[d.id];

        if (stateObj && typeof stateObj['color'] !== undefined) {
            return stateObj['color'];
        } else {
            return 'qNoData';
        }
    },
   
    //Adds color to svg circles
    colorizeCircles = function (i) {
        var stateId = svgCircles[0][i].getAttribute("data-state-id");
        var stateObj = filteredData[stateId];
        if (stateObj && typeof stateObj['color'] !== undefined) {
            return stateObj['color'];
        } else {
            return 'qNoData';
        }
    },

    //Format numbers
    commaSeparateNumber = function(val){
        var SplitByDecimal = val.toString().split('.');
        var beforeDecimal = SplitByDecimal[0];
        while (/(\d+)(\d{3})/.test(beforeDecimal.toString())){
            beforeDecimal = beforeDecimal.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        var returnString = beforeDecimal;
        if (SplitByDecimal.length > 1) {
            returnString = beforeDecimal + '.' + SplitByDecimal[1];
        }
        return returnString;
    },

    //Sorts an array by a specific key's values
    sortByKey = function (array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    //Handles map hover effect
    handleMouseMove = function (stateId, d) {
        if (!inVP1) {
            var stateObj = filteredData[stateId];
            if (stateObj) {
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                handleTooltip(stateId, mouse);
            }
        }
    },

    //Handles map mouse out effects
    handleMouseOut = function () {
        if (!inVP1) {
            tooltip.classed("hidden", true);
        }
    },
    
    //Shows tooltip on hover
    handleTooltip = function (stateId, mouse) {

        tooltip.attr("data-stateId", stateId);
        var $tooltipObj = $('<div>');
        var stateData = filteredData[stateId];
        var displayValue = stateData[dataColumnName];
        
        //Verfiy decimal precision and numerical comma placement
        if (classificationType === 'equalnumber' || classificationType === 'equalinterval') {
            if (!isNaN(stateData[dataColumnName])) {
                displayValue = stateData[dataColumnName].toFixed(maxDataPrecision);
                displayValue = commaSeparateNumber(displayValue);
            } else {
                displayValue = stateData[dataColumnName];
            }
        }

        $tooltipObj.append('<div><strong>'+stateData.statename+'</strong></div><div>');
        $tooltipObj.append('<div>'+dataColumnFriendlyName+': ' + dataPrefix + displayValue + dataSuffix +'</div>');
        if (displayColumns !== undefined) {
            $.each(displayColumns, function(i, item) {
                if (item.showInPopup) {
                    $tooltipObj.append('<div>'+
                        (item.dataColumnFriendlyName.length>0?item.dataColumnFriendlyName:item.dataColumnName)+': ' + 
                        item.dataPrefix + stateData[item.dataColumnName] + item.dataSuffix +
                        '</div>');
                }
            });
        }

        if (stateNavigateUrlColumn.length > 0 && isTouchDevice) {
            $tooltipObj.append('<div><a class="cdc-moreInfoLink" href="'+stateData[stateNavigateUrlColumn]+'" title="More Info">More info</a></div>');
        }
        
        tooltip
            .classed("hidden", false)
            .html($tooltipObj.html());


        if ($mapContainer.parents('.tabs,.accordion').length) {

            var svgOffset = $mapSvgContainer.offset();

            var tabOffset = $mapSvgContainer.parents('.tabs,.accordion').offset();

            var tabOffsetLeft = svgOffset.left - tabOffset.left;
            var tabOffsetTop = svgOffset.top - tabOffset.top;

            var tooltipX = mouse[0]+tabOffsetLeft+25;
            if (mouse[0] > svgWidth*.6) {
                tooltipX = mouse[0]+tabOffsetLeft-$(tooltip[0]).width()-25;
            }

            tooltip.attr("style", "left:"+tooltipX+"px;top:"+(mouse[1]+tabOffsetTop)+"px");
        } else {

            var svgOffset = $mapSvgContainer.offset();
            var tooltipX = mouse[0]+svgOffset.left+25;
            if (mouse[0] > svgWidth*.6) {
                tooltipX = mouse[0]+svgOffset.left-$(tooltip[0]).width()-25;
            }

            tooltip.attr("style", "left:"+tooltipX+"px;top:"+(mouse[1]+svgOffset.top)+"px");
        }

    },

    //Handles when a state is click (includes states, their abbreviations, territories and small states list
    handleStateClick = function (stateId, d, target) {
        if (!inVP1) {
            if (tooltip.classed("hidden")) { //If tooltip is hidden, meaning no hover available
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                handleTooltip(stateId, mouse);
            } else if (!tooltip.classed("hidden") && isTouchDevice) {
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                handleTooltip(stateId, mouse);
            } else if (filteredData[stateId] !== undefined && stateNavigateUrlColumn.length > 0 && filteredData[stateId][stateNavigateUrlColumn] !== undefined && filteredData[stateId][stateNavigateUrlColumn].trim().length>0) {
                location.href = filteredData[stateId][stateNavigateUrlColumn];
            }
            //handleTooltip(filteredData[stateId].statename, dataColumnFriendlyName, filteredData[stateId][dataColumnName], null, target);
        }
    },

    //Gets the state's abbreviation based on state ID
    getObjByStateId = function (theArray, stateId) {
         var returnVal = "";
         $.each(theArray, function(key, obj){
            if (obj.stateId === stateId) {
                returnVal = obj;
                return false;
            } 
         });
         return returnVal;
    },

    //Gets the state's abbreviation based on state ID
    getStateAbbreviationById = function (id) {
         var returnVal = "";
         $.each(statecodes, function(key, obj){
            if (Number(obj.id) === Number(id)) {
                returnVal = obj.abbreviation.toUpperCase();
                return false;
            } 
         });
         return returnVal;
    },

    //Gets the state's abbreviation based on state ID
    getStateObjById = function (id) {
         var returnVal = "";
         $.each(statecodes, function(key, obj){
            if (Number(obj.id) === Number(id)) {
                returnVal = obj;
                return false;
            } 
         });
         return returnVal;
    },

    //Gets the state object based on state abbreviation
    getStateObjectByAbbreviation = function (abbreviation) {
        var returnVal = null;
        $.each(statecodes, function(key, obj){
            try {
                if (obj.abbreviation.toLowerCase() === abbreviation.toLowerCase()) {
                    returnVal = obj;
                    return false;
                } 
            } catch (err) {

            }
        });
        return returnVal;
    },
        
    //Draw the raw data table
    drawRawDataTable = function (localTimeSeriesIndex) {

        if (!localTimeSeriesIndex || localTimeSeriesIndex === currentTimeSeriesIndex) {

            if (!$rawDataContainer) {

                $rawDataContainer = $('<div class="'+tableAndSubtextClass+'" id="cdcmap-rawDataTableContainer-'+contentId+'">');
                //$rawDataContainer.append('<div id="cdcmap-rawData-'+contentId+'" class="module-typeD"><h3>Map Data</h3></div>');
                $mapContainer.append($rawDataContainer);
            } //else {
                //console.log("REMOVING CHILDREN: " + contentId);
                //$('#cdcmap-rawDataTableContainer-'+contentId).children().remove();
            //}
            
            var optInTableViewerClass = "";
            if (displayColumns !== undefined && displayColumns.length>0 && inVP1) {
                //optInTableViewerClass = "opt-in";
            }
            
            var tableHtml = '<table id="cdcmap-rawDataTable-'+contentId+'" role="dialog" summary="'+mapSummary+'" tabindex="-1" class="' + optInTableViewerClass + ' table table-striped ' + colorPalette + '">';
            tableHtml += '<thead class="secondary-bg-color"><tr><th class="header-row">'+(language === 'es' ? 'Localización' : 'Location')+'<span class="icon-angle-down"></span><span class="icon-angle-up"></span></th>';
                   
            tableHtml += '<th class="cdcmap-textcenter">'+dataColumnFriendlyName+'<span class="icon-angle-down"></span><span class="icon-angle-up"></th>';
            if (displayColumns !== undefined) {
                $.each(displayColumns, function(i, item) {
                    if (item.showInDatatable) {
                        tableHtml +='<th class="cdcmap-textcenter">'+(item.dataColumnFriendlyName.length>0?item.dataColumnFriendlyName:item.dataColumnName)+'<span class="icon-angle-down"></span><span class="icon-angle-up"></th>';
                    }
                });
            }
            tableHtml += '</tr></thead>';

            var specialClassValuesForTableSorting = specialClassValues;
            if (specialClassValuesForTableSorting !== undefined) {
                specialClassValuesForTableSorting.sort();
            }

            //Loop through state data
            $.each(filteredData, function( index, value ) {
                
                var stateObj = value;
                
                if (stateObj['parent'] === undefined) { //Don't show cities and counties in their own row

                    var hasChildren = false;
                    var children = stateObj['children'];
                    if (children !== undefined) {
                        hasChildren = true;
                    }

                    var displayValue = stateObj[dataColumnName];
                    if (classificationType === 'equalnumber' || classificationType === 'equalinterval') {
                        if (!isNaN(stateObj[dataColumnName])) {
                            displayValue = stateObj[dataColumnName].toFixed(maxDataPrecision);
                            displayValue = commaSeparateNumber(displayValue);
                        } else {
                            displayValue = stateObj[dataColumnName];
                        }
                    }
                    
                    var navigateSnippet = '';
                    if (stateNavigateUrlColumn.length > 0 && stateObj[stateNavigateUrlColumn] !== undefined && stateObj[stateNavigateUrlColumn].trim().length>0) {
                        navigateSnippet =  'data-navigateUrl="'+stateObj[stateNavigateUrlColumn]+'"'; ;
                    }                
                    
                    tableHtml += '<tr ' + navigateSnippet + '><td nowrap>';
                    if (displayMapAndLegend) {
                        tableHtml += '<span class="cdcmap-legendColorBox '+stateObj['color']+'"></span>';
                    }

                    tableHtml += stateObj['statename'];

                    if (hasChildren) {
                        $.each(children, function(index,value) {
                            tableHtml += '<div class="childLocaleData childLocaleName">';
                            if (displayMapAndLegend) {
                                tableHtml += '<span class="cdcmap-legendColorBox '+value['color']+'"></span>';
                            }
                            tableHtml += value['statename'];
                            if (value['type'] === 'county') {
                                tableHtml += ' (' + stateObj['stateabbreviation'].toUpperCase() + ')';
                            }
                            
                            tableHtml += '</div>';
                        });
                    }

                    tableHtml += '</td>';
                    if (classificationType === 'equalnumber' || classificationType === 'equalinterval') {
                        //console.log('here1');
                        var originalVal = stateObj[dataColumnName];
                        var sortVal = originalVal;
                        if (isNaN(sortVal)) {
                            sortVal = 9999999999999;
                            for (var i = 0; i < specialClassValuesForTableSorting.length; i++) {
                                if (originalVal === specialClassValuesForTableSorting[i]) {
                                    sortVal = sortVal - i - 1;
                                }
                            }

                            
                            //console.log(specialClassValues);
                            
                        }
                        tableHtml += '<td class="cdcmap-textcenter" data-sort="'+sortVal+'">';
                    } else {
                        //console.log('here2');
                        tableHtml += '<td class="cdcmap-textcenter">';
                    }
                    tableHtml += dataPrefix + displayValue + dataSuffix;
                    if (hasChildren) {
                        $.each(children, function(index,value) {
                            tableHtml += '<div class="childLocaleData">';
                            var childDisplayValue = value[dataColumnName];
                            if (classificationType === 'equalnumber' || classificationType === 'equalinterval') {
                                childDisplayValue = value[dataColumnName].toFixed(maxDataPrecision);
                                childDisplayValue = commaSeparateNumber(childDisplayValue);
                            }
                            tableHtml += dataPrefix + childDisplayValue + dataSuffix;
                            tableHtml += '</div>';
                        });
                    }
                    tableHtml += '</td>';
                    if (displayColumns !== undefined) {
                        $.each(displayColumns, function(i, item) {
                            if (item.showInDatatable) {
                                tableHtml +='<td class="cdcmap-textcenter">'+item.dataPrefix + stateObj[item.dataColumnName] + item.dataSuffix;
                                if (hasChildren) {
                                    $.each(children, function(index,value) {
                                        tableHtml += '<div class="childLocaleData">';
                                        tableHtml += item.dataPrefix + value[item.dataColumnName] + item.dataSuffix;
                                        tableHtml += '</div>';
                                    });
                                }
                                tableHtml += '</td>';
                            }
                        });
                    }
                    tableHtml += '</tr>';
                }
            }); 
            tableHtml += '</table>';
            if (!hideDownload) {
                tableHtml += '<div><p class="somemore"><a href="'+datasetUrl+'" shape="rect">'+(language === 'es' ? 'Descargar datos' : 'Download Data')+' ('+datasetExtension+')</a><span class="icon-angle-right"><!-- --></span></p></div>';
            }

            var dataTableTitle = displayMapAndLegend ? (language === 'es' ? 'Tabla de datos' : 'Data Table') : mapTitle;

            var collapsibleModuleHtml = '<section class="module-typeB tp-collapsible ' + (tableCollapsed?'tp-collapsible-collapsed':'')+'"> \
                                            <h3  id="collapsible4">'+dataTableTitle+'</h3> \
                                            <div>'+tableHtml+'</div> \
                                        </section>';
            
            //Append collapsible module
            $rawDataContainer.html(collapsibleModuleHtml);

            //Init the collapsible module
            CDC.Modules.updateCollapsibles({selector : '.tp-collapsible'});


console.log($('#cdcmap-rawDataTable-'+contentId).hasClass('dataTables_wrapper'));

            //Apply datatables to table
            $('#cdcmap-rawDataTable-'+contentId).DataTable({
                "lengthChange": false,
                "searching": false,
                "paging": false,
                "info": false
            });
            
            //Add click handler if state has URL associated with it
            //console.log($('#cdcmap-rawDataTable-'+contentId+ ' tr[data-navigateurl]'));
            //$('#cdcmap-rawDataTable-'+contentId+ ' tr[data-navigateurl] td').click(function(){
            $('#cdcmap-rawDataTable-'+contentId).delegate('tr[data-navigateurl]', 'click', function(){
                //console.log('navigating');
                var url = $(this).data('navigateurl'); 
                if (url.trim().length > 0) {
                    location.href = $(this).data('navigateurl');
                }
            });
            
            //if (inVP1) {
                //CDC.Mobile.init();
            //} else {
                CDC.Mobile.resetModal();
            //}
        }
    },

    //Writes out text below data table
    writeSubtext = function() {
        if (mapSubtext) {
            $mapContainer.append('<div class="cdcmap-subtext '+tableAndSubtextClass+'"><p class="clear">'+mapSubtext+'</p></div>');
        }
    },
            
    //Draw the Legend and Table
    drawLegend = function () {
        var legendHtml = '<div class="'+legendClass+'" id="cdcmap-legendContainer-'+contentId+'"><div class="module-typeD">';
        legendHtml += '<h3>'+legendTitle+'</h3>';
        if (legendText) {
            legendHtml += '<p>'+legendText+'</p>';
        }
        
        if (Object.keys(allDataWithStateInfo).length === 0) {
            legendHtml += '<div>No data available</div>';
            $mapContainer.append(legendHtml);
        } else {
            legendHtml += '<div class="cdcmap-legend">';
            $.each(legendItems, function( index, value ) {
                if (value.specialClassText) {
                    legendHtml += '<div class="cdcmap-legendItem" data-legendColor="' + value.color+ '"><span class="cdcmap-legendColorBox ' + value.color+ '"></span><span>' + value.specialClassText + '</span></div>';
                } else {
                    if (value.highValueDisplay === null) {
                        legendHtml += '<div class="cdcmap-legendItem" data-legendColor="' + value.color+ '"><span class="cdcmap-legendColorBox ' + value.color+ '"></span><span>' + dataPrefix +  value.lowValueDisplay + dataSuffix +   '</span></div>';
                    } else {
                        legendHtml += '<div class="cdcmap-legendItem" data-legendColor="' + value.color+ '"><span class="cdcmap-legendColorBox ' + value.color+ '"></span><span>' + dataPrefix +  value.lowValueDisplay + dataSuffix + ' - '  + dataPrefix +  value.highValueDisplay + dataSuffix +   '</span></div>';
                    }
                    
                }
            });
            legendHtml += '<p class="somemore" id="cdcmap-resetMap-'+contentId+'">Reset map</p>';
            legendHtml += '</div>';
            legendHtml += '</div></div>';
            $mapContainer.append(legendHtml);
            
            $('#cdcmap-legendContainer-'+contentId+' #cdcmap-resetMap-'+contentId).click(function(){
                $('#cdcmap-legendContainer-'+contentId+' .cdcmap-legendItem').removeClass('cdcmap-legendItemSelected');
                d3.selectAll('#' + mapContainerId + ' svg g path').classed('cdcmap-legend-not-selected', false);
                //d3.selectAll('#' + mapContainerId + ' svg g circle').classed('cdcmap-legend-not-selected', false);
                d3.selectAll('#' + mapContainerId + ' svg g rect').classed('cdcmap-legend-not-selected', false);
                $(this).hide();
            });
            
            $('#cdcmap-legendContainer-'+contentId+' .cdcmap-legendItem').click(function(){
                $('#cdcmap-legendContainer-'+contentId+' .cdcmap-legendItem').removeClass('cdcmap-legendItemSelected');
                $(this).addClass('cdcmap-legendItemSelected');
                var legendColor = $(this).data('legendcolor');
                d3.selectAll('#' + mapContainerId + ' svg g path').classed('cdcmap-legend-not-selected', false);
                d3.selectAll('#' + mapContainerId + ' svg g path:not(.'+legendColor+')').classed('cdcmap-legend-not-selected', true);
               //d3.selectAll('#' + mapContainerId + ' svg g circle').classed('cdcmap-legend-not-selected', false);
               // d3.selectAll('#' + mapContainerId + ' svg g circle:not(.'+legendColor+')').classed('cdcmap-legend-not-selected', true);
                d3.selectAll('#' + mapContainerId + ' svg g rect').classed('cdcmap-legend-not-selected', false);
                d3.selectAll('#' + mapContainerId + ' svg g rect:not(.'+legendColor+')').classed('cdcmap-legend-not-selected', true);
                
                $('#cdcmap-legendContainer-'+contentId+' #cdcmap-resetMap-'+contentId).show();
            });
        }
    },
    
    //Change HTML entities to unicode characters for spanish states/territory names
    unicodeEntitites = function(inputString) {
        var outputString = inputString;
        outputString = outputString.replace(/&#243;/g, '\u00F3'); //o accent
        outputString = outputString.replace(/&#233;/g,'\u00E9'); //e accent
        outputString = outputString.replace(/&#237;/g,'\u00ED'); //i accent
        outputString = outputString.replace(/&#225;/g,'\u00E0'); //a accent
        return outputString;    
    },
    
    //Draws the D3 map
    drawMap = function () {

        svgStates = g.selectAll("path").data(topojson.feature(usTopo, usTopo.objects.states).features);

        //Add states to map
        svgStates
            .enter().append("path")
            .attr("d", path)
            .attr("class", allDataWithStateInfo ? colorize : null)
            .classed("cdcmap-navigable", function(d,i) { 
                if (filteredData[d.id] !== undefined && stateNavigateUrlColumn.length > 0 && filteredData[d.id][stateNavigateUrlColumn] !== undefined && filteredData[d.id][stateNavigateUrlColumn].trim().length>0) {
                    return true;
                } else { 
                    return false;
                }
            })
            .attr("data-region-type", "state")
            .attr("data-state-id", function(d,i) {
                return d.id;
            })
            .on("click", function(d,i) { handleStateClick(d.id, d, this); })
            .on("mousemove", function(d,i) { handleMouseMove(d.id, d); })
            .on("mouseout",  function(d,i) { handleMouseOut(); });
            
        //Add state border mesh
        g.append("path")
            .datum(topojson.mesh(usTopo, usTopo.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "mesh")
            .attr("d", path);
        
        
        //Add state abbreviations to map
        var abbreviations = g.selectAll("text")
            .data(topojson.feature(usTopo, usTopo.objects.states).features)
            .enter()
            .append("svg:text")
            .text(function(d){
                var stateObj = getStateObjById(d.id);
                if (stateObj === undefined) {
                    stateObj = getStateObjectByAbbreviation(d.id);
                }

                if (stateObj !== undefined && !stateObj['type']) {
                    return stateObj['abbreviation'].toUpperCase();
                } else {
                    return '';
                }
                /*
                var stateData = filteredData[d.id];
                if (stateData) {
                    var stateAbbrev = stateData['stateabbreviation'];
                    if (stateAbbrev && !stateData['type']) {
                        return stateData['stateabbreviation'].toUpperCase();
                    } else {
                        return '';
                    }
                } else {
                    var stateAbbrev = getStateAbbreviationById(d.id);

                     if (stateAbbrev && !stateData['type']) {
                        return stateData['stateabbreviation'].toUpperCase();
                    } else {
                        return '';
                    }
                    return stateAbbrev;
                }
                */
            })
            .attr("x", function(d){
                var stateData = filteredData[d.id];
                var xOffset = stateData && stateData.textoffsetx ? stateData.textoffsetx : 0;
                return isNaN(path.centroid(d)[0]) ? 0 : path.centroid(d)[0]+xOffset;
            })
            .attr("y", function(d){
                var stateData = filteredData[d.id];
                var yOffset = stateData && stateData.textoffsety ? stateData.textoffsety : 0;
                return isNaN(path.centroid(d)[1]) ? 0 : path.centroid(d)[1]+yOffset;
            })
            .attr("text-anchor","middle")
            .attr('font-size','8pt')
            .attr('class','cdcmap-abbreviations')
            .classed("cdcmap-navigable", function(d,i) { 
                if (filteredData[d.id] !== undefined && stateNavigateUrlColumn.length > 0 && filteredData[d.id][stateNavigateUrlColumn] !== undefined && filteredData[d.id][stateNavigateUrlColumn].trim().length>0) {
                    return true;
                } else { 
                    return false;
                }
            })
            .on("mousemove", function(d,i) { handleMouseMove(d.id, d); })
            .on("mouseout",  function(d,i) { handleMouseOut(); })
            .on("click", function(d,i) { handleStateClick(d.id, d, this); });;
    
        //Show states and territories - only in viewports above vp1 
        if (!inVP1) { 
            var squareWidth = 25;
            var squareHeight = 20;

            var smallStatesX = svgWidth - 55
            var smallStatesY = (initialMapHeight - (7*squareHeight) - 30)/2;
            for (var index = 0; index < smallStates.length; index++) {

                //var state = filteredData[smallStates[index]];
                var state = allDataWithStateInfo[smallStates[index]];

                var rect = g.append("rect")
                    .attr("x", smallStatesX)
                    .attr("y", smallStatesY)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("width", squareWidth)
                    .attr("height", squareHeight)
                    .attr("data-state-id", state.stateId)
                    .attr("class", state['color'] + ' cdcmap-territoryCircle')
                    .classed("cdcmap-navigable", function() {
                        if (stateNavigateUrlColumn.length > 0 && state[stateNavigateUrlColumn] !== undefined &&  state[stateNavigateUrlColumn].trim().length>0) {
                            return true;
                        } else { 
                            return false;
                        }
                    })
                    .on("mousemove", function(d,i) { handleMouseMove($(this).data('state-id'), d); })
                    .on("mouseout",  function(d,i) { handleMouseOut(); })
                    .on("click", function(d,i) { handleStateClick($(this).data('state-id'), d, this); });

                var territoryTexts = g.append("text")
                    .text(unicodeEntitites(state['stateabbreviation']).toUpperCase())
                    .attr("x", smallStatesX + squareWidth/2)
                    .attr("y", smallStatesY + squareHeight/2 + 4)
                    .attr("font-size", "8pt")
                    .attr("data-state-id", state.stateId)
                    .attr("text-anchor","middle")
                    .classed("cdcmap-navigable", function() {
                        if (stateNavigateUrlColumn.length > 0 && state[stateNavigateUrlColumn] !== undefined && state[stateNavigateUrlColumn].trim().length>0) {
                            return true;
                        } else { 
                            return false;
                        }
                    })
                    .on("mousemove", function(d,i) { handleMouseMove($(this).data('state-id'), d); })
                    .on("mouseout",  function(d,i) { handleMouseOut(); })
                    .on("click", function(d,i) { handleStateClick($(this).data('state-id'), d, this); });
                smallStatesY += squareHeight + 10;
            }

            //Sort small states alphabetically and display in map
            var widthOfCircleAndText = 110;
            var stateX = ((svgWidth/3)-widthOfCircleAndText)/2 + 55;

            var newY = initialMapHeight;
            if (cities.length > 0) {
                newY = addNonStatesToMap(cities, newY, stateX, "Cities");
            }

            if (counties.length) {
                if (cities.length > 0) {
                    newY += 5;
                    g.append("line")
                        .attr("x1", stateX)
                        .attr("y1", newY)
                        .attr("x2", svgWidth-115)
                        .attr("y2", newY)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke-width", .5)
                        .attr("stroke", "gray");
                    newY += 8;
                }
                newY = addNonStatesToMap(counties, newY, stateX, "Counties");
            }

            if (territories.length) {
                if (cities.length > 0 || counties.length > 0) {
                    newY += 5;
                    g.append("line")
                        .attr("x1", stateX)
                        .attr("y1", newY)
                        .attr("x2", svgWidth-115)
                        .attr("y2", newY)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke-width", .5)
                        .attr("stroke", "gray");
                    newY += 8;
                }
                newY = addNonStatesToMap(territories, newY, stateX, "Territories");
            }

            
            
            
            
            g.append("svg:image")
                        .attr('x',svgWidth-110)
                        .attr('y',newY-47)
                        .attr('width', 100)
                        .attr('height', 47)
                        .attr("xlink:href","/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg");
        } else {
            g.append("svg:image")
                .attr('x',svgWidth-110)
                .attr('y',height)
                .attr('width', 100)
                .attr('height', 47)
                .attr("xlink:href","/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg")
        }
    },

    addNonStatesToMap = function(arrayOfLocales, startY, stateX, label) {
        var stateY = startY;
        var maxY = stateY;

        var squareWidth = 25;
        var squareHeight = 20;
        var distanceBetweenStates = 25;
        var columns = 3;
        var widthOfCircleAndText = 110;

        g.append("text")
            .text(label)
            .attr("x", 10)
            .attr("font-weight", "bold")
            .attr("y", startY + squareHeight/2 + 4)
            .attr("font-size", "8pt");
        
        var columnNumber = 1;
        var columnsRemaining = columns;
        var columnCutoff = Math.ceil(arrayOfLocales.length / columnsRemaining);
        
        var columnCounter = 0;
        for (var index = 0; index < arrayOfLocales.length; index++) {
            columnCounter += 1;
            if (columnCounter > columnCutoff) {
                columnsRemaining -= 1;
                columnNumber += 1;
                columnCutoff = Math.ceil((arrayOfLocales.length - index) / columnsRemaining);
                stateX = (svgWidth/columns*(columnNumber-1))+(((svgWidth/columns) - widthOfCircleAndText)/2);
                if (columnNumber === 3) {
                    stateX -= 55;
                }
                stateY = startY;
                columnCounter = 1;
            }

            //var state = filteredData[];
            var state = allDataWithStateInfo[arrayOfLocales[index]];
            var circles = g.append("rect")
                .attr("x", stateX)
                .attr("y", stateY)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", squareWidth)
                .attr("height", squareHeight)
                .attr("data-state-id", state['stateId'])
                .attr("class", state['color'] + ' cdcmap-territoryCircle')
                .classed("cdcmap-navigable", function(d,i) { 
                    if (stateNavigateUrlColumn.length > 0 && state[stateNavigateUrlColumn] !== undefined && state[stateNavigateUrlColumn].trim().length>0) {
                        return true;
                    } else { 
                        return false;
                    }
                })
                .on("mousemove", function(d,i) { handleMouseMove($(this).data('state-id'), d); })
                .on("mouseout",  function(d,i) { handleMouseOut(); })
                .on("click", function(d,i) { handleStateClick($(this).data('state-id'), d, this); });

            //Add territory names
            var stateNameForSvg = state['statename'];
            if (state['type'] === 'county') {

                var parentState = getStateObjectByAbbreviation(state['parent']);
                stateNameForSvg += ' (' + parentState['abbreviation'].toUpperCase() + ')';
            }

            var territoryTexts = g.append("text")
                .text(unicodeEntitites(stateNameForSvg))
                .attr("x", stateX + squareWidth + 5)
                .attr("y", stateY + 14)
                .attr("font-size", "8pt")
                .attr("data-state-id", state.stateId)
                .classed("cdcmap-navigable", function(d,i) { 
                    if (stateNavigateUrlColumn.length > 0 && state[stateNavigateUrlColumn] !== undefined && state[stateNavigateUrlColumn].trim().length>0) {
                        return true;
                    } else { 
                        return false;
                    }
                })
                .on("mousemove", function(d,i) { handleMouseMove($(this).data('state-id'), d); })
                .on("mouseout",  function(d,i) { handleMouseOut(); })
                .on("click", function(d,i) { handleStateClick($(this).data('state-id'), d, this); });

            stateY += distanceBetweenStates;
            if (stateY > maxY) {
                maxY = stateY;
            }
        }
        return maxY;

    },

    //Handle data after all data is loaded asynchronously
    ready = function (error, datasetraw, us) {
        $mapContainer.empty();

        if (error!==null) {
            $mapContainer.html("<div>The data for this map is not currently available. Please try again later.</div>");
        } else {


            //FILTER FIRST
            var filterMethod = window['cdcmap_filter_'+contentId];
            if (filterMethod !== undefined && typeof filterMethod === 'function') {
                datasetraw = filterMethod(datasetraw);
            } 

            //Assign map data to re-usable variable
            usTopo = us;

            //Create required HTML nodes
            $mapContainer.addClass(colorPalette);

            //In case we are re-initlalizing, do not rewrap container with a row div
            if (!$($mapContainer).parent().is('div[class="row"]')){
                //console.log('wrapping');
                $($mapContainer).wrap('<div class="row"></div>');
            }

            if (displayMapAndLegend) {

                var $mapSpanDiv = $('<div class="'+mapClass+'">');
                $mapModule = $('<div class="module-typeA">');
                $mapModule.append('<h3 class="cdcmap-title" aria-label="United States Map with title '+mapTitle+'">'+mapTitle+'<span class="cdcmap-timeInterval"></span></h3>');

                var intervalHtml = '<div id="cdcmap-timeIntervalOuter-'+contentId+'" aria-hidden="true"><div id="cdcmap-timeIntervalSliderContainer-'+contentId+'"><div id="cdcmap-timeIntervalSlider-'+contentId+'"></div>';
                intervalHtml += '<div class="cdcmap-timeIntervalTextContainer"><span class="cdcmap-timeIntervalOldestItem"></span>'+timeIntervalTitle+'<span class="cdcmap-timeIntervalNewestItem"></span></div>';
                intervalHtml += '</div><div id="cdcmap-sliderButtonContainer-'+contentId+'"><span class="icon-arrow-left" id="cdcmap-sliderDown-'+contentId+'"></span><span id="cdcmap-sliderUp-'+contentId+'" class="icon-arrow-right"></span></div>';
                intervalHtml += '</div>';
                $mapModule.append(intervalHtml);
                $mapSpanDiv.append($mapModule);

                $mapContainer.append($mapSpanDiv);
            
            
                tooltip = d3.select('#' + mapContainerId + ' .module-typeA').append("div")
                    .attr("class", "cdcmap-tooltip")
                    .attr("aria-hidden", "true")
                    .classed("hidden", true);
                $('#' + mapContainerId + ' .module-typeA .cdcmap-tooltip').append('<span class="cdcmap-tooltip-instruction">Tap on a state or territory below to view details.</span>');
                $mapSvgContainer = $('<div id="cdcmap-svgContainer-'+contentId+'" aria-hidden="true">');
                $mapModule.append($mapSvgContainer);
                
                $('#' + mapContainerId + ' .cdcmap-tooltip').click(function(event) {
                   event.preventDefault();
                   if ($(event.target).hasClass('cdc-moreInfoLink')) {
                       location.href = $(event.target).attr('href');
                   }
                });
            }

            //Loop through data initially to get high and low values and to add state object data to raw data
            //Also get the values for the time series, if necessary
            var dataset = datasetraw;
            if (datasetraw.data) {
                dataset = datasetraw.data;
            }

            $(dataset).each(function(index, obj){
                var stateObj;
                var timeSeriesDataVal;
                

                if (timeIntervalDataColumn) {
                    timeSeriesDataVal = this[timeIntervalDataColumn];
                    var timeSeriesDisplayVal = this[timeIntervalDisplayColumn];

                    var testDate = new Date(timeSeriesDataVal);
                    if (testDate instanceof Date && !isNaN(testDate.valueOf())) {
                        timeSeriesDataVal = testDate.getTime();
                    }

                    var result = $.grep(timeSeriesValues, function(e){ return e.dataVal === timeSeriesDataVal; });
                    if (result.length === 0) {
                        dataByTimeInterval[timeSeriesDataVal] = {};
                        timeSeriesValues.push({dataVal:timeSeriesDataVal, displayVal: timeSeriesDisplayVal});
                    }

                    $("#cdcmap-timeIntervalOuter-"+contentId).show();

                } else {

                    timeSeriesDataVal = 0;
                    if (timeSeriesValues.length === 0) {
                        dataByTimeInterval[timeSeriesDataVal] = {};
                        timeSeriesValues.push({dataVal:0, displayVal: ''});
                    }
                }

                if (stateColumnType === 'name') {                
                    stateObj = statecodes[this[stateColumnName].toLowerCase()];
                } else if (stateColumnType === 'abbreviation') {
                    stateObj = getStateObjectByAbbreviation(this[stateColumnName]);
                }

                if (stateObj !== null && stateObj !== undefined && typeof this[dataColumnName] !== 'undefined') {
                    //For numeric data, determine low and high values and data precision

                    //console.log(this[dataColumnName]);
                    //var columnDataConverted = this[dataColumnName].replace(/\"/g, "").replace(/,/g, "");
                    //console.log(columnData);

                    if (typeof this[dataColumnName] !== 'undefined' && !isNaN(this[dataColumnName]) && (classificationType === 'equalnumber' || classificationType === 'equalinterval')) {

                        var thisValue = Number(this[dataColumnName]);

                        //Determine data's precision
                        var valueAsString = thisValue.toString();
                        var valueSplitByDecimal = valueAsString.split('.');
                        if (typeof valueSplitByDecimal !== 'undefined' && valueSplitByDecimal.length > 1 && valueSplitByDecimal[1].length > dataPrecision) {
                            dataPrecision = valueSplitByDecimal[1].length;
                            if (dataPrecision > maxDataPrecision) {
                                maxDataPrecision = dataPrecision;
                            }
                        }

                        if (separateZero && thisValue === 0) {
                            zeroInDataSet = true;
                        } else {
                            if (lowValue === -1 || thisValue < lowValue) {
                                lowValue = thisValue;
                            }
                            if (thisValue > highValue) {
                                highValue = thisValue;
                            }
                        }
                    }
                    if (stateObj['type']) {
                        this['type'] = stateObj['type'];
                    }
                    if (stateObj['parent']) {
                        this['parent'] = stateObj['parent'];
                    }
                    this['stateabbreviation'] = stateObj['abbreviation'];
                    if (language.length > 0) {
                        this['statename'] = stateObj['name_'+language];
                    } else {
                        this['statename'] = stateObj['name'];
                    }
                    this['textoffsetx'] = stateObj['textoffsetx'];
                    this['textoffsety'] = stateObj['textoffsety'];
                    this['stateId'] = stateObj.id;
                    this['timeIntervalDataVal'] = timeSeriesDataVal;

                    //allDataWithStateInfo.push(this);
                    //console.log(stateObj.id);
                 
                    if (hideCities && this['type'] === 'city') {

                    } else {
                        allDataWithStateInfo[stateObj.abbreviation] = this;
                        dataByTimeInterval[timeSeriesDataVal][stateObj.id] = this;
                    }

                    if (stateObj['type'] === 'territory' && $.inArray(stateObj['id'], territories)<0) {
                        territories.push(stateObj.abbreviation);
                    } else if (stateObj['type'] === 'city' && $.inArray(stateObj['id'], cities)<0 && !hideCities) {
                        cities.push(stateObj.abbreviation);
                    } else if (stateObj['type'] === 'county' && $.inArray(stateObj['id'], counties)<0) {
                        counties.push(stateObj.abbreviation);
                    } else if (stateObj['type'] === 'smallstate' && $.inArray(stateObj.id, smallStates)<0) {
                        smallStates.push(stateObj.abbreviation);
                    }

                    
                }
            });//End loop through data

            //Add counties and cities as child property to state objects
            $.each(cities, function(index,value) {

                var childObj = allDataWithStateInfo[value];
                var parentObj = allDataWithStateInfo[childObj.parent];
                var children = parentObj['children'];
                if (children === undefined) {
                    children = [];
                }
                children.push(childObj);
                parentObj['children'] = children;
            });

                    //Add counties and cities as child property to state objects
            $.each(counties, function(index,value) {
                var childObj = allDataWithStateInfo[value];
                var parentObj = allDataWithStateInfo[childObj.parent];
                var children = parentObj['children'];
                if (children === undefined) {
                    children = [];
                }
                children.push(childObj);
                parentObj['children'] = children;
            });

            //Make sure all values are numeric before sorting
            if (classificationType === 'equalnumber' || classificationType === 'equalinterval') {
                for (var key in allDataWithStateInfo) {
                    var item = allDataWithStateInfo[key];
                    
                    //DMC: CHANGE FOR SPECIAL CATEGORIES
                    if (!isNaN(item[dataColumnName])) {
                        item[dataColumnName] = Number(item[dataColumnName]);
                    }
                    
                    allDataWithStateInfo[key] = item;
                }
                allDataWithStateInfo = sortByKey(allDataWithStateInfo, dataColumnName);
            } else {
                allDataWithStateInfo = sortByKey(allDataWithStateInfo, dataColumnName);
            }
            
            if (timeIntervalDataColumn) {
                timeSeriesValues = sortByKey(timeSeriesValues, 'dataVal');
            }


            currentTimeSeriesIndex = timeSeriesValues.length - 1;

            //Sort data
            smallStates.sort();
            territories.sort();
            cities.sort();
            counties.sort();

            //Handle time series
            if (timeSeriesValues.length > 1) {

                $(".cdcmap-timeInterval").html(" - " + timeIntervalTitle + " " + timeSeriesValues[currentTimeSeriesIndex].displayVal);

                $mapContainer.find('.cdcmap-timeIntervalOldestItem').html(timeSeriesValues[0].displayVal);
                $mapContainer.find('.cdcmap-timeIntervalNewestItem').html(timeSeriesValues[timeSeriesValues.length-1].displayVal);

                $("#cdcmap-timeIntervalSlider-"+contentId).slider({
                    range: "max",
                    min: 1,
                    max: timeSeriesValues.length,
                    value: timeSeriesValues.length,
                    slide: function( event, ui ) { repaintMapFromSlideChange(ui.value); }
                });

                $("#cdcmap-sliderUp-"+contentId).click(function(){
                    var maxValue = $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "option" ,"max");
                    var value = $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "values", 0 );
                    if (value < maxValue) {
                        $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "value", value+1 );
                        repaintMapFromSlideChange(value+1);
                    }
                });
                $("#cdcmap-sliderDown-"+contentId).click(function(){
                    var minValue = $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "option" ,"min");
                    var value = $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "values", 0 );
                    if (value > minValue) {
                        $( "#cdcmap-timeIntervalSlider-"+contentId ).slider( "value", value-1 );
                        repaintMapFromSlideChange(value-1);
                    }
                });
            }
            
            if (displayMapAndLegend) {

                //LegendItem object definition
                legendItems = [];
                var LegendItem = function(color, lowValue, lowValueDisplay, highValue, highValueDisplay, specialClassText) {
                    this.color = color;
                    this.lowValue = lowValue;
                    this.highValue = highValue;
                    this.lowValueDisplay = lowValueDisplay;
                    this.highValueDisplay = highValueDisplay;
                    this.specialClassText = specialClassText;
                };

                //DMC: CHANGE FOR SPECIAL CATEGORIES
                if (specialClassValues) {
                    $.each(specialClassValues, function(index, value) {
                        legendItems.push(new LegendItem(specialClassStyles[index], '', '', '', '', specialClassValues[index]));
                    });
                }
                /*
                if (specialClassValues && specialClassValues[0]) {
                    legendItems.push(new LegendItem('special1', '', '', '', '', specialClassValues[0]));
                }
                if (specialClassValues && specialClassValues[1]) {
                    legendItems.push(new LegendItem('specialHatch', '', '', '', '', specialClassValues[1]));
                }
                */
                //Handle category class - produce legend items and loop through data and assign colors
                if (classificationType === 'category') {

                    $.each(classificationValues, function(index, value){
                        var color = 'class'+numberOfColors+'_color'+(index+1);
                        legendItems.push(new LegendItem(color, '', '', '', '', value));
                    });

                    //$.each(allDataWithStateInfo, function( index, value ) {
                    for (var key in allDataWithStateInfo) {

                        var stateObj = allDataWithStateInfo[key];

                        var colorIndex = classificationValues.indexOf(stateObj[dataColumnName]) + 1;

                        var color = "";
                        if (colorIndex > 0) {
                            color = 'class'+numberOfColors+'_color'+colorIndex;
                        } else if(specialClassValues && specialClassValues[0] && stateObj[dataColumnName] === specialClassValues[0]) {
                            color = 'special1';
                        } else if(specialClassValues && specialClassValues[1] && stateObj[dataColumnName] === specialClassValues[1]) {
                            color = 'special2';
                        } else if(specialClassValues && specialClassValues[2] && stateObj[dataColumnName] === specialClassValues[2]) {
                            color = 'special3';
                        } else if(specialClassValues && specialClassValues[3] && stateObj[dataColumnName] === specialClassValues[3]) {
                            color = 'special4';
                        }

                        stateObj['color']=color;

                    }

                } else if (classificationType === 'equalnumber') { //Handle equalnumber class - produce legend items and loop through data and assign colors
                    
                    var numberOfStatesForLegendBands = 0;
                    var statesForLegend = [];
                    for (var key in allDataWithStateInfo) {
                        //console.log(key);
                        var stateObj = allDataWithStateInfo[key];

                        var color;
                        if(specialClassValues && specialClassValues[0] && stateObj[dataColumnName] === specialClassValues[0]) {
                            color = specialClassStyles[0];
                        } else if(specialClassValues && specialClassValues[1] && stateObj[dataColumnName] === specialClassValues[1]) {
                            color = specialClassStyles[1];
                        } else if(specialClassValues && specialClassValues[2] && stateObj[dataColumnName] === specialClassValues[2]) {
                            color = specialClassStyles[2];
                        } else if(specialClassValues && specialClassValues[3] && stateObj[dataColumnName] === specialClassValues[3]) {
                            color = specialClassStyles[3];
                        }  else if (separateZero && zeroInDataSet && stateObj[dataColumnName] === 0) {
                            color = 'class'+numberOfColors+'_color1';
                        } else {
                            numberOfStatesForLegendBands++;
                            statesForLegend.push(stateObj)
                        }
                        if (color) {
                            stateObj['color'] = color;
                        }
                    }

                    statesForLegend = sortByKey(statesForLegend, dataColumnName);

                    var numberOfColorsLocal = numberOfColors;
                    var colorBand = 1;

                    if (separateZero && zeroInDataSet) {
                        legendItems.push(new LegendItem('class'+numberOfColors+'_color1'.toString(), 0, 0, null, null, null));
                        numberOfColorsLocal -= 1;
                        colorBand = 2;
                    }

                    var statesPerColor = Math.floor(numberOfStatesForLegendBands/numberOfColorsLocal);
                    var extra = numberOfStatesForLegendBands - statesPerColor*numberOfColorsLocal;
                    var incrementedStatesPerColor = false;
                    var numberOfStatesInBand = 0;

                    var currentLegendItem;


                    //for (var key in stateKeysForLegend) {
                        //console.log('Number of states in loop ' + statesForLegend.length);
                    //for (var i = 0; i < statesForLegend.length; i++) {
                    for (var i = 0; i < statesForLegend.length; i++) {

                        var stateObj = allDataWithStateInfo[statesForLegend[i].stateabbreviation];

                        //clean up long decimal places
                        if (!isNaN(stateObj[dataColumnName])) {
                            stateObj[dataColumnName] = Math.round(stateObj[dataColumnName] * 10 ) / 10;
                        }

                        if (!incrementedStatesPerColor && numberOfColorsLocal - extra + 1 === colorBand) {
                            statesPerColor += 1;
                            incrementedStatesPerColor = true;
                        }  

                        if (numberOfStatesInBand === statesPerColor) {
                            numberOfStatesInBand = 0;
                            colorBand += 1;
                        }

                        var color = 'class'+numberOfColors+'_color'+colorBand;

                        stateObj['color']=color;

                        //Handle last state in band
                        if (numberOfStatesInBand === statesPerColor - 1 || i === statesForLegend.length - 1) {
                            if (currentLegendItem.lowValue !== stateObj[dataColumnName]) {
                                currentLegendItem.highValue = stateObj[dataColumnName];
                                currentLegendItem.highValueDisplay = commaSeparateNumber(stateObj[dataColumnName]);
                            }
                            legendItems.push(currentLegendItem);
                        }

                        //Handle next band in legend
                        if (numberOfStatesInBand === 0) {
                            var newLegendItem = new LegendItem(color, stateObj[dataColumnName], commaSeparateNumber(stateObj[dataColumnName]), null, null, null);
                            currentLegendItem = newLegendItem;
                        }

                        numberOfStatesInBand += 1;
                    }

                } else if (classificationType === 'equalinterval') { //Handle equalinterval class - produce legend items and loop through data and assign colors

                    //console.log(highValue);
                    //console.log(lowValue);

                    if (wholeNumbers && (highValue - lowValue < numberOfColors)) {
                        numberOfColors = highValue - lowValue + 1;
                    }
                    if (wholeNumbers) {
                        highValue += 1;
                    }

                    var numberOfColorsForCalculatedRanges = numberOfColors;
                    if (separateZero && zeroInDataSet) {
                        numberOfColorsForCalculatedRanges -= 1;
                        legendItems.push(new LegendItem('class'+numberOfColors+'_color1'.toString(), 0, 0, null, null, null));
                    }

                    var o = d3.scale.ordinal()
                        .domain(d3.range(numberOfColorsForCalculatedRanges))
                        .rangeBands([lowValue, highValue]);

                    //Create array will all points in the range rounded to the correct precision
                    var rangeArray = o.range();
                    rangeArray.push(o.rangeExtent()[1]);
                    var lastItemIndex = rangeArray.length-1;
                    $(rangeArray).each(function(index, value){
                        rangeArray[index] = (value.toFixed(dataPrecision))/1;
                        if (index > 0) {
                            var tempColor;
                            if (separateZero && zeroInDataSet) {
                                tempColor = 'class'+numberOfColors+'_color'+(index+1).toString();
                            } else {
                                tempColor = 'class'+numberOfColors+'_color'+(index).toString();
                            }
                            var lessThanSymbol = "<";
                            var firstValueInLegendRange = rangeArray[index-1];
                            var secondValueInLegendRange = rangeArray[index];
                            if (lastItemIndex === index || wholeNumbers) {
                                lessThanSymbol = "";
                            }
                            if (wholeNumbers) {
                                secondValueInLegendRange -= 1;
                            }

                            if (secondValueInLegendRange === firstValueInLegendRange && wholeNumbers) {
                                legendItems.push(new LegendItem(tempColor, firstValueInLegendRange, commaSeparateNumber(firstValueInLegendRange), null, null, null));
                            } else {
                                legendItems.push(new LegendItem(tempColor, firstValueInLegendRange, commaSeparateNumber(firstValueInLegendRange), secondValueInLegendRange, lessThanSymbol +commaSeparateNumber(secondValueInLegendRange), null));
                            }
                        }
                    });

                    for (var key in allDataWithStateInfo) {
                        var stateObj = allDataWithStateInfo[key];
                        var stateNumericValue = stateObj[dataColumnName];

                        var color;

                        if(specialClassValues && specialClassValues[0] && stateObj[dataColumnName] === specialClassValues[0]) {
                            color = specialClassStyles[0];
                        } else if(specialClassValues && specialClassValues[1] && stateObj[dataColumnName] === specialClassValues[1]) {
                            color = specialClassStyles[1];
                        } else if(specialClassValues && specialClassValues[2] && stateObj[dataColumnName] === specialClassValues[2]) {
                            color = specialClassStyles[2];
                        } else if(specialClassValues && specialClassValues[3] && stateObj[dataColumnName] === specialClassValues[3]) {
                            color = specialClassStyles[3];
                        }  else if (separateZero && stateObj[dataColumnName] === 0) {
                            color = 'class'+numberOfColors+'_color1';
                        } else {

                            color = 'class'+numberOfColors+'_color';
                            //console.log(color);
                            $(rangeArray).each(function( index, value){
                                if (index === rangeArray.length - 2 || (stateNumericValue >= value && stateNumericValue < rangeArray[index+1])) {
                                    if (separateZero) {
                                        color += (index + 2).toString();
                                    } else {
                                        color += (index + 1).toString();
                                    }
                                    
                                    return false;
                                }
                            });
                        }
                        stateObj['color']=color;
                    }
                }

                //Create map, legend, data table, and subtext
                setup();
                drawLegend();
                drawMap();
                drawRawDataTable();
    	        writeSubtext();
                addViewportChangeHandler();
            } else {
                setup();
                drawRawDataTable();
                writeSubtext();
                addViewportChangeHandler()
            }
        }
        
    },

    addViewportChangeHandler = function () {
        if (!viewportUpdatedHandlerAdded) {
            //$( window ).resize(function() {
            //    if (svg) {
            //        svg.remove();
            //    }

            //    setup();
            //    drawRawDataTable();
            //    drawMap();
            //});

            $('html').on('viewport-updated', function(e) { 
                if (svg) {
                    svg.remove();
                }
 
                setup();
                //drawRawDataTable();
                CDC.Modules.updateCollapsibles({selector : '.tp-collapsible'});
                drawMap();
            }); 
            viewportUpdatedHandlerAdded = true;
        }
    },

    //Repaints the map when the size of the container changes.
    repaintMapFromSlideChange = function (newValue) {
        var tempTimeSeriesIndex = newValue-1;
        currentTimeSeriesIndex = tempTimeSeriesIndex;

        var filterVal = timeSeriesValues[currentTimeSeriesIndex].dataVal;
        filteredData = dataByTimeInterval[filterVal];

        $(".cdcmap-timeInterval").html(" - " + timeIntervalTitle + " " + timeSeriesValues[currentTimeSeriesIndex].displayVal);

        svgStates.attr("class", colorize);

        g.selectAll("circle").attr("class", function(d,i){
            return colorizeCircles(i);
        });
        setTimeout(function () {
            drawRawDataTable(tempTimeSeriesIndex);
        }, 250);
    },

    //Handles when user moves the map when scaled in
    move = function () {
        var t = d3.event.translate;
        var s = d3.event.scale;
        tx = Math.min(0, Math.max(t[0], width - width * s)),
        ty = Math.min(0, Math.max(t[1], height - height * s));
        zoom.translate([tx, ty]);
        g.attr("transform", [
                "translate(" + [tx, ty] + ")",
                "scale(" + s + ")"
              ].join(" "));
    },

    //Resets the map to initial scale (not currently used)
    reset = function () {
        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            .call(zoom.translate([0, 0]).scale(1).event);
    };
    
    return {
            id: config.id,
            init: init
    };

};

CDC.Datamap.Initialize = function () { 
    $("[id^=cdcmap-container]").each(function(){
        $(this).empty();
        $(this).append('<div class="mapLoader">Loading Map</div>');
        var datamapObj = new CDC.Datamap(CDC || {}, jQuery, window, _);
        datamapObj.init(this);
    });
}

$(function() {
    CDC.Datamap.Initialize();
});