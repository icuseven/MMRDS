/*
 * CDC US Navigation Map
 * 
 *
 * Sample javascript and html in page which renders the map:
 * 
 * <script>
 * var cdcnavmap_config_11111 = {
 *      contentId : "11111",
 *      border: true,
 *      language: "es",
 *      datasetUrl : "/datamaps/d3-responsive/data/usnavmap.csv"
 * };
 * </script>
 * <div id="cdcnavmap-container-11111"></div>
 *
 */
CDC.USNavMap = function (c, $, w) {    
    'use strict';

    var showMapThreshold = 550;

    //CDC Theme Nav Colors
    var themePrimaryColors = { 
        'theme-tan' : '#ccba8b',
        'theme-teal' : '#c1ded5',
        'theme-orange' : '#f9c671',
        'theme-rose' : '#e1b8b8',
        'theme-purple' : '#c5bee1',
        'theme-green' : '#c1d5b0',
        'theme-blue' : '#b1dafb'
    };

    var themeSecondaryColors = { 
        'theme-tan' : '#e4dabc',
        'theme-teal' : '#deeee9',
        'theme-orange' : '#fbd69a',
        'theme-rose' : '#efd9d9',
        'theme-purple' : '#dad5eb',
        'theme-green' : '#d7e4cc',
        'theme-blue' : '#e3f2fe'
    };    
    
    var unicodeEntitites = function(inputString) {
        var outputString = inputString;
        outputString = outputString.replace(/&#243;/g, '\u00F3'); //o accent
        outputString = outputString.replace(/&#233;/g,'\u00E9'); //e accent
        outputString = outputString.replace(/&#237;/g,'\u00ED'); //i accent
        outputString = outputString.replace(/&#225;/g,'\u00E0'); //a accent
        return outputString;    
    },
    config,
    mapElement,
    $mapContainer,
    mapContainerId,
    $svgContainer,
    contentId,
    datamapObject,
    mapData = {},
    isTouchDevice = $('html.touch').length > 0,
    tooltip,
    usaWidth = 944,
    usaHeight = 450,
    usaMapRatio = usaHeight/usaWidth,
    containerWidth,
    containerHeight,
    stateNameField = 'name',

    init = function (container) {

    	$mapContainer = $(container);

        mapContainerId = $mapContainer.attr('id');
        var n = mapContainerId.lastIndexOf('-');
        contentId = mapContainerId.substring(n+1);
        
        //Get configuration data from javascript variable in page
        config = window['cdcnavmap_config_'+contentId];

        $mapContainer.wrap('<div class="module-typeA wrapNoPad cdcnavmap-module-'+contentId+'"></div>');
        $('<h3 class="cdcmap-title" aria-label="A United States map illustration with the title '+config.title+'">'+(config.showTitleInMap ? config.title : '')+'</h3>').insertBefore($mapContainer);

        $mapContainer.addClass("us");

        //if (config.border) {
        //    $mapContainer.addClass('border');
        //}

        if (config.language !== '' && config.language !== 'en') {
            stateNameField = stateNameField + '_' + config.language;
        }
        
        var $htmlElement = $('html');
        if (($htmlElement).hasClass("theme-tan")) {
            config.fillColor = themePrimaryColors['theme-tan'];
        } else if (($htmlElement).hasClass("theme-green")) {
            config.fillColor = themePrimaryColors['theme-green'];
        } else if (($htmlElement).hasClass("theme-blue")) {
            config.fillColor = themePrimaryColors['theme-blue'];
        } else if (($htmlElement).hasClass("theme-orange")) {
            config.fillColor = themePrimaryColors['theme-orange'];
        } else if (($htmlElement).hasClass("theme-rose")) {
            config.fillColor = themePrimaryColors['theme-rose'];
        } else if (($htmlElement).hasClass("theme-purple")) {
            config.fillColor = themePrimaryColors['theme-purple'];
        } else if (($htmlElement).hasClass("theme-teal")) {
            config.fillColor = themePrimaryColors['theme-teal'];
        }

        if (config.datasetUrl.indexOf('.csv')>0) {
            queue()
                .defer(d3.csv, config.datasetUrl)
                .await(ready);
        } else {
            queue()
                .defer(d3.json, config.datasetUrl)
                .await(ready);
        }

        $(window).resize(function() {
            setTimeout(function(){ 
                paintMap();
            }, 300);
        });
    },
    
    ready = function(error, rawdata) {
        //Set a fill color for any states that have data
        $.each(rawdata, function(key, obj){
            if (obj.URL) {
               obj['fillKey'] = 1; 
            }
            mapData[obj.State] = obj;
        });
        
        tooltip = d3.select('body').append('div').attr("class", "cdcnavmap-tooltip");
        $(tooltip).click(handleTooltipClick);

        $mapContainer.focusout(function(){
            tooltip.classed("tooltip-hidden", true);
        })

        paintMap();
    },
    
    handleMouseOverText = function(){
        tooltip.classed("tooltip-hidden", true);
        var bodyNode = d3.select('body').node();
        var absoluteMousePos = d3.mouse(bodyNode);

        var url = $(this).data('navigate-url');
        var stateId = $(this).data('state-id');
        var stateName = states_by_abbreviation[stateId][stateNameField];

        if (url !== '') {
            var tooltipWidth = $(tooltip[0][0]).width();
            tooltip
              .classed("tooltip-hidden", false)
              .attr('data-navigate-url', url)
              .attr("style", "left:"+(absoluteMousePos[0]-tooltipWidth-30)+"px;top:"+absoluteMousePos[1]+"px")
              .html(getTooltipHtml(stateName));
        } else {
            //var tooltipHtml = stateName;
        }
    },

    handleMouseOver = function(d) {
        tooltip.classed("tooltip-hidden", true);
        var bodyNode = d3.select('body').node();
        var absoluteMousePos = d3.mouse(bodyNode);

        if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL') && mapData[d.id].URL !== '') {
            tooltip
              .classed("tooltip-hidden", false)
              .attr('data-navigate-url', mapData[d.id].URL)
              .attr("style", "left:"+(absoluteMousePos[0]+10)+"px;top:"+absoluteMousePos[1]+"px")
              .html(getTooltipHtml(states_by_abbreviation[d.id][stateNameField]));
        } else {
            //tooltipHtml = states_by_abbreviation[d.id][stateNameField];
        }
    },

    handleMouseOut = function() {
        tooltip.classed("tooltip-hidden", true);
    },

    getTooltipHtml = function(stateName) {
        return '<div class="tooltip-text"><strong>'+stateName+'</strong></div><div class="tooltip-link"><a href="">'+stateName+'</a></div>';
    },

    handleTooltipClick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open($(this).data('navigate-url'),'_parent');
        //location.href=$(this).data('navigate-url');
        return false;
    },

    showTooltip = function(stateId, showOnRight) {
        if (isTouchDevice) {
            tooltip.classed("tooltip-hidden", true);
            var bodyNode = d3.select('body').node();
            var absoluteMousePos = d3.mouse(bodyNode);

            var url = mapData[stateId].URL;
            if (url.length > 0) {
                var stateName = states_by_abbreviation[stateId][stateNameField];

                var tooltipWidth = $(tooltip[0][0]).width();
                var leftOffset = showOnRight ? absoluteMousePos[0] + 10 : absoluteMousePos[0] - tooltipWidth - 30;
                tooltip
                  .classed("tooltip-hidden", false)
                  .attr('data-navigate-url', url)
                  .attr("style", "left:"+(leftOffset)+"px;top:"+absoluteMousePos[1]+"px");
                  //.html(getTooltipHtml(stateName));
              }

        } else {
            if (mapData[stateId].URL.length > 0 ) {//$(this).attr('data-navigate-url').length > 0) {
                window.open(mapData[stateId].URL,'_parent');
                //location.href = mapData[stateId].URL;//$(this).attr('data-navigate-url');
            }
            
        }
    },

    clickedSmallState = function(d) {
       showTooltip($(this).attr('data-state-id'), false);
    },

    clicked = function(d) {
        showTooltip(d.id, true);
    },

    paintMap = function() {
        tooltip.classed("tooltip-hidden", true);
        containerWidth = $mapContainer.width();
        
        //First clear out the HTML, then paint the map. (needed for when the user resizes)
        if (containerWidth < showMapThreshold) {//viewport 1, draw dropdown only
            $mapContainer.empty();
            writeNavigableDropdown(false);
        } else { //Any other viewport, draw map
            $mapContainer.empty();
            $svgContainer = $('<div class="cdcnavmap-svgContainer" aria-hidden="true">');
            $mapContainer.append($svgContainer);
            mapElement = $svgContainer[0];
            
            containerHeight = $svgContainer.width()*usaMapRatio;

            $svgContainer.width(containerWidth);
            $svgContainer.height(containerHeight);

            datamapObject = new Datamap({
                scope: 'usa',
                element: mapElement,
                geographyConfig: {
                    highlightOnHover: false,
                    popupOnHover: false,
                    borderWidth: 0.2,
                    borderColor: '#404040'
                },
                setProjection: function(element, options) {
                    var projection, path;
                    projection = d3.geo.albersUsa()
                        .scale(element.offsetWidth)
                        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

                    path = d3.geo.path().projection( projection );

                    return {path: path, projection: projection};
                },
                fills: {
                    '1': config.fillColor,
                    defaultFill: '#f0f0f0'
                },
                data: mapData,
                done: function(datamap) {
                    //Add a data attribute containing the navigation url 

                    datamap.svg.selectAll('.datamaps-subunit').select(function(d, i) { 
                        if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL')) {
                            return this;
                        } else {
                            //return null;
                        }
                    }).attr("data-navigate-url", function(geography) { 
                        return mapData[geography.id].URL;
                    }).attr("data-state-id", function(geography) { 
                        return geography.id; 
                    });
                }
            });
            
            //Add state labels (part of datamaps library)
            datamapObject.labels();

            //Add navigation url attribute to state labels
            datamapObject.svg.selectAll('text')
                .select(function(d, i) { 
                    var stateName = $(this).data('state-id');
                    if (mapData[stateName] && mapData[stateName].hasOwnProperty('URL')) {
                        return this;
                    }
                })
                .attr("data-navigate-url", function(geography) {
                    return mapData[$(this).data('state-id')].URL;
                });

            //Add navigation urls to small state rectangles
            datamapObject.svg.selectAll('.labels rect')
                .select(function(d, i) { 
                   var stateName = $(this).data('state-id');

                   if (mapData[stateName] && mapData[stateName].hasOwnProperty('URL') && mapData[stateName].URL !== '') {
                       $(this).attr('fill', config.fillColor);
                       return this;
                   }
                })
                .attr("data-navigate-url", function(geography) { 
                   return mapData[$(this).data('state-id')].URL;
                })
                .on('click', clickedSmallState)
                .on("mousemove", handleMouseOverText)
                .on("mouseout", handleMouseOut);

            datamapObject.svg.selectAll('.datamaps-subunit')
                .on('click', clicked)
                .on("mousemove", handleMouseOver)
                .on("mouseout", handleMouseOut);

            //Handle Territories

            //Get territories from data file
            var allTerritories = [];
            $.each(states_by_abbreviation, function(key, obj){
                if (obj.type === 'territory') {
                    allTerritories[key] = obj;
                } 
            });

            var squareWidth = 25;
            var squareHeight = 20;
            var distanceBetweenTerritories = 10;
            var territoryY = containerHeight + 20;


            var gTerritories = datamapObject.svg.append("g").attr('class', 'territories');
            
            //Loop through map data, find territories, and draw on map
            var index = 0;
            var territoryCount = Object.keys(allTerritories).length;
            Object.keys(mapData).forEach(function (key) {

                if (key in allTerritories) {
                    var obj = mapData[key];
                    var territory = allTerritories[key];
                    
                    //Add territory rounded rect
                    gTerritories.append("rect")
                        .attr("x", containerWidth/5 * (index%2===0?1:3))
                        .attr("y", territoryY)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .attr("width", squareWidth)
                        .attr("height", squareHeight)
                        .attr("data-state-abbreviation", territory.abbreviation)
                        .attr("data-navigate-url", obj.URL)
                        .attr('fill', config.fillColor)
                        .on('click', function(){
                            window.open($(this).data('navigate-url'),'_parent');
                            //location.href=$(this).data('navigate-url'); 
                        });

                    //Add territory names
                    gTerritories.append("text")
                        .text(unicodeEntitites(territory[stateNameField]))
                        .attr("x", containerWidth/5 * (index%2===0?1:3) + squareWidth + 5)
                        .attr("y", territoryY+squareHeight/2 + 4)
                        .attr("font-size", "8pt")
                        .attr("data-state-abbreviation", territory.abbreviation)
                        .attr("data-navigate-url", obj.URL)
                        .on('click', function(){
                            window.open($(this).data('navigate-url'),'_parent');
                            //location.href=$(this).data('navigate-url'); 
                        });

                    if (index%2===1 && index < territoryCount-1) {

                        territoryY += squareHeight + distanceBetweenTerritories;
                    }
                    index ++;
                }

            });

            //Increase height of svg element to handle the painted territories
            containerHeight = territoryY + squareHeight + 20;
            $svgContainer.height(containerHeight);
            datamapObject.svg.attr('height', territoryY + squareHeight + 20);
            
            /*
            datamapObject.svg.append("svg:image")
                .attr('x',containerWidth-110)
                .attr('y',containerHeight - 57)
                .attr('width', 100)
                .attr('height', 47)
                .attr('class', 'cdcnavmap-cdc-logo')
                .attr("xlink:href","/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg");
            */
            //Add click event to any element in the SVG that has a data-navigate-url attribute
            //$('[data-navigate-url!=""][data-navigate-url]').on('click', clicked);

            //$('g.territories text[data-navigate-url!=""][data-navigate-url], rect[data-navigate-url!=""][data-navigate-url]').on('click', function(){
              // location.href=$(this).data('navigate-url'); 
            //}); 
            //if (config.alwaysShowDropdown || $("html.one").length > 0) {
                writeNavigableDropdown(true);
            //}


        }
    },
            
    writeNavigableDropdown = function(addLogo) {
        //var selectContainer = $('<div class="module-typeC">');

        var dropdownId = 'cdcnavmap-dropdown-'+contentId;
        var goButtonId = 'cdcnavmap-dropdown-go-'+contentId;
        var dropdown = $('<select id="'+dropdownId+'" />');
        $('<option />', {value: '', text: 'Select a State'}).appendTo(dropdown);
        Object.keys(mapData).forEach(function (key) {
            var dataObj = mapData[key];
            var stateObj = states_by_abbreviation[key];
            if (stateObj && dataObj && dataObj.hasOwnProperty('URL') && dataObj.URL !== '') {
                $('<option />', {value: key, text: states_by_abbreviation[key].name}).appendTo(dropdown);
            } else {
                //Data has row for state but no URL
            }
        });
        
        var $dropdownWrapper = $('<div class="cdcnavmap-dropdownWrapper">');
        $dropdownWrapper.append(dropdown);
        $dropdownWrapper.append('&nbsp;<input type="button" value="Go" id="'+goButtonId+'"/>');
        if (addLogo) {
            $dropdownWrapper.append('<img src="/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg"" class="cdcnavmap-cdc-logo" alt="CDC and HHS Logos"/>');
        }

        $mapContainer.append($dropdownWrapper);

        
        //Navigate to the URL if the user selects a state/territory
        $('#'+goButtonId).on('click', function(){
            var abbrev = $('#'+dropdownId).val();
            //var abbrev = $(this).val();
            if (mapData[abbrev] && mapData[abbrev].hasOwnProperty('URL')) {
                window.open(mapData[abbrev].URL,'_parent');
                //location.href=mapData[abbrev].URL; 
            }
        });  
    };
    
    return {
            init: init
    };

};

/*
 * CDC Glboal Navigation Map
 * 
 * Sample javascript and html in page which renders the map:
 * 
 * <script>
 * var cdcnavmap_config_11111 = {
 *      contentId : "11111",
 *      border: true,
 *      language: "es",
 *      datasetUrl : "/datamaps/d3-responsive/data/globalnavmap.csv"
 * };
 * </script>
 * <div id="cdcnavmap-container-11111"></div>
 *
 */
CDC.WorldNavMap = function (c, $, w) {    
    'use strict';
    
    var showMapThreshold = 550;

    var themePrimaryColors = { 
        'theme-tan' : '#ccba8b',
        'theme-teal' : '#c1ded5',
        'theme-orange' : '#f9c671',
        'theme-rose' : '#e1b8b8',
        'theme-purple' : '#c5bee1',
        'theme-green' : '#c1d5b0',
        'theme-blue' : '#b1dafb'
    };
    var themeSecondaryColors = { 
        'theme-tan' : '#e4dabc',
        'theme-teal' : '#deeee9',
        'theme-orange' : '#fbd69a',
        'theme-rose' : '#efd9d9',
        'theme-purple' : '#dad5eb',
        'theme-green' : '#d7e4cc',
        'theme-blue' : '#e3f2fe'
    };

    var $mapContainer,
        mapContainerId,
        contentId,
        config,
        mapData = {},
        path,
        g,
        svg,
        container,
        tooltip,
        width = 938,
        height = 500,
        mapRatio = height/width,
        m_width,
        m_height,
        //countryNames,
        countries,
        //$worldView,
        zoomListener,
        minScale = 1,
        maxScale = 32,
        didZoomOrDrag = false,
        //allowNavigation = true,
        isTouchDevice = $('html.touch').length > 0,
        manualZoomInitiated = false,
        
    init = function (cont) {

        container = cont;
        $mapContainer = $(container);

        mapContainerId = $mapContainer.attr('id');
        var n = mapContainerId.lastIndexOf('-');
        contentId = mapContainerId.substring(n+1);
        
        config = window['cdcnavmap_config_'+contentId];

        $mapContainer.wrap('<div class="module-typeA wrapNoPad cdcnavmap-module-'+contentId+'"></div>');
        $('<h3 class="cdcmap-title" aria-label="A world map illustration with the title '+config.title+'">'+(config.showTitleInMap ? config.title : '')+'</h3>').insertBefore($mapContainer);

        $mapContainer.addClass("world");
        
        queue()
            .defer(d3.json, "/TemplatePackage/3.0/js/libs/d3/world-50m.json")
            //.defer(d3.tsv, "/TemplatePackage/3.0/js/libs/d3/world-country-names.tsv")
            .defer(d3.csv, config.datasetUrl)
            .await(ready);
   
    },
            
    ready = function(error, world, rawdata) {
        
        //Build the mapData object with countries that have URLs
        $.each(rawdata, function(key, obj){
            if (obj.URL) {
               mapData[obj.id] = obj;
            }
        });

        $(window).resize(function() {
            setTimeout(function(){ 
                paintMap();
            }, 300);
            
        });

        tooltip = d3.select('body').append('div').attr("class", "cdcnavmap-tooltip");
        $(tooltip).click(handleTooltipClick);

        $mapContainer.focusout(function(){
            tooltip.classed("tooltip-hidden", true);
        })

        var $htmlElement = $('html');
        if (($htmlElement).hasClass("theme-tan")) {
            config.fillColor = themePrimaryColors['theme-tan'];
            config.secondaryColor = themeSecondaryColors['theme-tan'];
        } else if (($htmlElement).hasClass("theme-green")) {
            config.fillColor = themePrimaryColors['theme-green'];
            config.secondaryColor = themeSecondaryColors['theme-green'];
        } else if (($htmlElement).hasClass("theme-blue")) {
            config.fillColor = themePrimaryColors['theme-blue'];
            config.secondaryColor = themeSecondaryColors['theme-blue'];
        } else if (($htmlElement).hasClass("theme-orange")) {
            config.fillColor = themePrimaryColors['theme-orange'];
            config.secondaryColor = themeSecondaryColors['theme-orange'];
        } else if (($htmlElement).hasClass("theme-rose")) {
            config.fillColor = themePrimaryColors['theme-rose'];
            config.secondaryColor = themeSecondaryColors['theme-rose'];
        } else if (($htmlElement).hasClass("theme-purple")) {
            config.fillColor = themePrimaryColors['theme-purple'];
            config.secondaryColor = themeSecondaryColors['theme-purple'];
        } else if (($htmlElement).hasClass("theme-teal")) {
            config.fillColor = themePrimaryColors['theme-teal'];
            config.secondaryColor = themeSecondaryColors['theme-teal'];
        }

        countries = topojson.feature(world, world.objects.countries).features;
        var n = countries.length;

        /*
        countries.forEach(function(d) { 
            var country = countryNames.filter(function(n) { return d.id == n.id; });
            if (country.length > 0) {
                d.name = country[0].name;
                var dataObj = mapData[d.id];
                if (dataObj) {
                    mapData[d.id]['name'] = country[0].name;
                }
            } else {
                d.name = 'unknown';
            }
        });
        */
        paintMap();
        
    },
    
    zoomManual = function(zoomDirection) {

        var changePercentage,
            newZoom,
            newX,
            newY;
        var localHeight = svg.attr("height"), localWidth = svg.attr("width");
        
        if (zoomDirection === "in") { //Zoom in
            changePercentage = 2;
            newZoom = zoomListener.scale() * changePercentage;
            if (newZoom > maxScale) {
                newZoom = maxScale;
                changePercentage = newZoom/zoomListener.scale();
            }

        } else { //Zoom out
            changePercentage = 0.5;
            newZoom = zoomListener.scale() * changePercentage;
            if (newZoom < minScale) {
                newZoom = minScale;
                changePercentage = newZoom/zoomListener.scale();
            }
        }

        newX = ((d3.transform(g.attr("transform")).translate[0] - (localWidth / 2)) * changePercentage) + localWidth / 2;
        newY = ((d3.transform(g.attr("transform")).translate[1] - (localHeight / 2)) * changePercentage) + localHeight / 2; 
        zoomListener.scale(newZoom).translate([newX,newY]);
        zoomListener.event(svg.transition().duration(0));

        tooltip.classed("tooltip-hidden", true);

        if (!manualZoomInitiated) {
            svg.call(zoomListener).on("dblclick.zoom", null);
            manualZoomInitiated = true;
        }
    },

    zoomHandler = function() {
        if (d3.event.sourceEvent === null ||
                (d3.event.sourceEvent.type === 'touchmove' || d3.event.sourceEvent.type === 'wheel' || d3.event.sourceEvent.type === 'mousemove')
            ) {
            didZoomOrDrag = true;
            $("body").css("cursor", "move");
            var t = d3.event.translate;
            var s = d3.event.scale;  
            var h = height / 3;

            t[0] = Math.min(0, Math.max(m_width * (1 - s), t[0]));
            t[1] = Math.min(0, Math.max(m_height * (1 - s), t[1]));

            zoomListener.translate(t);

            g.style("stroke-width", 0.2 / d3.event.scale + "px").attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")");
            g.selectAll('path').style("stroke-width", 0.2 / d3.event.scale + "px");

            var roundedScale = Math.round(d3.event.scale * 100) / 100

            $('#cdcnavmap-zoomreset-'+contentId).removeClass('disabled');
            if (roundedScale > minScale && roundedScale < maxScale) {
                $('#cdcnavmap-zoomout-'+contentId).removeClass('disabled');
                $('#cdcnavmap-zoomin-'+contentId).removeClass('disabled');
            } else if (roundedScale === maxScale) {
                $('#cdcnavmap-zoomin-'+contentId).addClass('disabled');
                $('#cdcnavmap-zoomout-'+contentId).removeClass('disabled');
            } else if (roundedScale === minScale) {
                $('#cdcnavmap-zoomin-'+contentId).removeClass('disabled');
                $('#cdcnavmap-zoomout-'+contentId).addClass('disabled');
            }
        }

        tooltip.classed("tooltip-hidden", true);
    },
            
    paintMap = function() {
        manualZoomInitiated = false;
        tooltip.classed("tooltip-hidden", true);

        m_width = $mapContainer.parent().width();
        m_height = m_width * mapRatio;

        if (m_width < showMapThreshold) {
            $mapContainer.empty();
            writeNavigableDropdown(false);
        } else {
            
            $mapContainer.empty();
            //Add zoom and reset controls
            $mapContainer.append('<div id="cdcnavmap-controls-'+contentId+'" aria-hidden="true">');
            $('#cdcnavmap-controls-'+contentId).append('<div id="cdcnavmap-zoomreset-'+contentId+'" class="disabled"><span class="icon-refresh"></span></div>');
            $('#cdcnavmap-controls-'+contentId).append('<div id="cdcnavmap-zoomout-'+contentId+'" class="disabled"><span class="icon-minus"></span></div>');
            $('#cdcnavmap-controls-'+contentId).append('<div id="cdcnavmap-zoomin-'+contentId+'"><span class="icon-plus"></span></div>');

            $('#cdcnavmap-zoomin-'+contentId).click(function(){
                if (!$(this).hasClass('disabled')) {
                    zoomManual("in");
                }
            });
            $('#cdcnavmap-zoomout-'+contentId).click(function(){
                if (!$(this).hasClass('disabled')) {
                    zoomManual("out");
                }
            });
            $('#cdcnavmap-zoomreset-'+contentId).click(function(){
                if (!$(this).hasClass('disabled')) {
                    tooltip.classed("tooltip-hidden", true);
                    paintMap();
                }
            });

            
            var containerId = container.id;

            var projection = d3.geo.mercator()// d3.geo.equirectangular() // d3.geo.kavrayskiy7()
                .scale(m_width*.16) //151
                .translate([m_width / 2, m_height / 1.55 ]);

            path = d3.geo.path()
                .projection(projection);
        
            
        
            svg = d3.select('#'+containerId).append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + m_width + " " + m_height)
                .attr("width", m_width)
                .attr("height", m_height)
                .attr("aria-hidden", "true");

            g = svg.append("g");

            //g.append("use")
             //   .attr("class", "stroke")
             //   .attr("xlink:href", "#sphere");

            //g.append("use")
            //    .attr("class", "fill")
            //    .attr("xlink:href", "#sphere");

              var country = g.selectAll(".country")
                .data(countries)
                .enter().insert("path", ".graticule")
                .attr("class", "country")
                .attr("title", function(d,i) { 
                    var country = mapData[d.id];
                    if (typeof country !== 'undefined') {
                        return country.Name;
                    } else {
                        return 'Unknown';
                    }
                })
                .attr("data-countryid", function(d,i) { return d.id; })
                .attr("d", path)
                .attr("style", "stroke-width: 0.2px;stroke: rgb(64, 64, 64);")
                .style("fill", function(d, i) {
                    if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL') && mapData[d.id].URL !== '' ) {
                        return config.fillColor;
                    } else {
                        return '#f0f0f0';
                    }
                })
                .attr("data-navigate-url", function(d, i) { 
                    if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL') ) {
                        return mapData[d.id].URL;
                    } else {
                        return '';
                    }
                })
                .on('click', clicked)
                .on("mousemove", handleMouseOver)
                .on("mouseout",  handleMouseOut);
        
            d3.select(self.frameElement).style("height", height + "px");

            zoomListener = d3.behavior.zoom()
                .scaleExtent([minScale, maxScale])
                .on('zoomstart', function(){
                    svg.classed("moving", true);
                    $('body').css( 'cursor', 'move' );
                })
                .on('zoomend', function(){
                    svg.classed("moving", false);
                    $('body').css( 'cursor', 'auto' );

                    if (didZoomOrDrag) {
                        if (d3.event.sourceEvent !== null) {
                            d3.event.sourceEvent.stopPropagation();
                        }
                        didZoomOrDrag = false;
                    }
                    
                })
                .on("zoom",zoomHandler);

            svg.call(zoomListener)
                .on("dblclick.zoom", null)
                .on("mousedown.zoom", null)
                .on("touchstart.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom", null);

                /*
            svg.append("svg:image")
                .attr('x',m_width - 110)
                .attr('y',m_height - 57)
                .attr('width', 100)
                .attr('height', 47)
                .attr('class', 'cdcnavmap-cdc-logo')
                .attr("xlink:href","/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg");
            */
            writeNavigableDropdown(true);
        }
        
    },
  
    writeNavigableDropdown = function(addLogo) {
        var dropdownId = 'cdcnavmap-dropdown-'+contentId;
        var goButtonId = 'cdcnavmap-dropdown-go-'+contentId;
        var dropdown = $('<select id="'+dropdownId+'" />');
        $('<option />', {value: '', text: 'Select a Country'}).appendTo(dropdown);
        
        var arrayForDropdown = [];
        Object.keys(mapData).forEach(function (key) {
            var dataObj = mapData[key];
            if (dataObj && dataObj.hasOwnProperty('URL') && dataObj.URL !== '') {
                arrayForDropdown.push({value: key, text: mapData[key].Name});
            }
        });

        arrayForDropdown.sort(function(a, b){
            var nameA=a.text.toLowerCase();
            var nameB=b.text.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });
        
        $(arrayForDropdown).each(function(index, obj){
            $('<option />', {value: obj.value, text: obj.text}).appendTo(dropdown);
        });

        var $dropdownWrapper = $('<div class="cdcnavmap-dropdownWrapper">');
        $dropdownWrapper.append(dropdown);
        $dropdownWrapper.append('&nbsp;<input type="button" value="Go" id="'+goButtonId+'"/>');
        
        if (addLogo) {
            $dropdownWrapper.append('<img src="/TemplatePackage/3.0/css/lib/cdcmaps/images/hhs-cdc-logo.svg"" class="cdcnavmap-cdc-logo" alt="CDC and HHS Logos"/>');
        }

        $mapContainer.append($dropdownWrapper);
        
        $('#'+goButtonId).on('click', function(){
            var lookupVal = $('#'+dropdownId).val();
            var dataObj = mapData[lookupVal];
            if (dataObj && dataObj.hasOwnProperty('URL') && dataObj.URL !== '') {
                window.open(dataObj.URL,'_parent');
                //location.href=dataObj.URL; 
            }
        });  
    },

    handleMouseOut = function() {
        tooltip.classed("tooltip-hidden", true);
    },

    getTooltipHtml = function(stateName) {
        return '<div class="tooltip-text"><strong>'+stateName+'</strong></div><div class="tooltip-link"><a href="">'+stateName+'</a></div>';
    },
    
    handleMouseOver = function(d) {
        tooltip.classed("tooltip-hidden", true);
        var bodyNode = d3.select('body').node();
        var absoluteMousePos = d3.mouse(bodyNode);

        if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL') && mapData[d.id].URL !== '') {
            tooltip
              .classed("tooltip-hidden", false)
              .attr('data-navigate-url', mapData[d.id].URL)
              .attr("style", "left:"+(absoluteMousePos[0]+10)+"px;top:"+absoluteMousePos[1]+"px")
              .html(getTooltipHtml(mapData[d.id].Name));
        } else {
            //tooltipHtml = d.name;
        }
    },

    handleTooltipClick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open($(this).data('navigate-url'),'_parent');
        //location.href=$(this).data('navigate-url');
        return false;
    },

    clicked = function(d) {
        if (!d3.event.defaultPrevented) {
            if (isTouchDevice) {
                tooltip.classed("tooltip-hidden", true);
                var bodyNode = d3.select('body').node();
                var absoluteMousePos = d3.mouse(bodyNode);

                if (mapData[d.id] && mapData[d.id].hasOwnProperty('URL') && mapData[d.id].URL !== '') {
                    tooltip
                      .classed("tooltip-hidden", false)
                      .attr('data-navigate-url', mapData[d.id].URL)
                      .attr("style", "left:"+(absoluteMousePos[0]+10)+"px;top:"+absoluteMousePos[1]+"px");
                      //.html(getTooltipHtml(d.Name));
                } else {
                    //tooltipHtml = d.name;
                }
            } else {
                if ($(this).attr('data-navigate-url').length > 0) {
                    window.open($(this).attr('data-navigate-url'),'_parent');
                    //location.href = $(this).attr('data-navigate-url');
                }
                
            }
        }
    };

    /*
    move = function () {
        var t = d3.event.translate;
        var s = d3.event.scale;  
        var h = height / 3;

        t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
        t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }; 
    */  

    return {
            init: init
    };

};

$(function() { 
    $("[id^=cdcnavmap-container]").each(function(){
        var containerId = $(this).attr('id');
        var n = containerId.lastIndexOf('-');
        var contentId = containerId.substring(n+1);

        var config = window['cdcnavmap_config_'+contentId];
        
        if (config.type === 'us') {
            var usNavMapObj = new CDC.USNavMap(CDC || {}, jQuery, window);
            usNavMapObj.init(this);
        } else if (config.type === 'world') {
            var worldNavMapObj = new CDC.WorldNavMap(CDC || {}, jQuery, window);
            worldNavMapObj.init(this);
        }

    });
});