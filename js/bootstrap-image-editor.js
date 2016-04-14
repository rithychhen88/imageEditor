$(function ($)
{
	var filtersName = [
		"Effects", "Brightness", "Contrast", "Saturation", "Vibrance",
		"Exposure", "Hue", "Sepia", "Gamma", "Noise", "Clip", "Sharpen", "Stack Blur"
	]
	var filters = {
		"Effects": [
			{"name": "Normal", "filter":"normal"}, 
			{"name": "Vintage", "filter":"vintage"}, 
			{"name": "Lomo", "filter":"lomo"},
			{"name": "Clarity", "filter":"clarity"}, 
			{"name": "Sin City", "filter":"sinCity"}, 
			{"name": "Sunrise", "filter":"sunrise"}, 
			{"name": "Cross Process", "filter":"crossProcess"}, 
			{"name": "Orange Peel", "filter":"orangePeel"}, 
			{"name": "Love", "filter":"love"}, 
			{"name": "Grungy", "filter":'grungy'}, 
			{"name": "Jarques", "filter":'jarques'}, 
			{"name": "Pinhole", "filter":'pinhole'}, 
			{"name": "Old Boot", "filter":'oldBoot'}, 
			{"name": "Glowing Sun", "filter":'glowingSun'}, 
			{"name": "Hazy Days", "filter":'hazyDays'}, 
			{"name": "Her Majesty", "filter":'herMajesty'},
			{"name": "Nostalgia", "filter":'nostalgia'},
			{"name": "Hemingway", "filter":'hemingway'}, 
			{"name": "Concentrate", "filter":'concentrate'}
		],
		"Brightness": {"name":"Brightness", "filter":"brightness", "min": -100, "max": 100, "value": 0, "step":1},
		"Contrast": {"name":"Contrast", "filter":"contrast", "min": -100, "max": 100, "value": 0, "step":1},
		"Saturation": {"name":"Saturation", "filter":"saturation", "min": -100, "max": 100, "value": 0, "step":1},
		"Vibrance": {"name":"Vibrance", "filter":"vibrance", "min": -100, "max": 100, "value": 0, "step":1},
		"Exposure": {"name":"Exposure", "filter":"exposure", "min": -100, "max": 100, "value": 0, "step":1},
		"Hue": {"name":"Hue", "filter":"hue", "min": 0, "max": 100, "value": 0, "step":1},
		"Sepia": {"name":"Sepia", "filter":"sepia", "min": 0, "max": 100, "value": 0, "step":1},
		"Gamma": {"name":"Gamma", "filter":"gamma", "min": 0, "max": 10, "value": 0, "step":0.1},
		"Noise": {"name":"Noise", "filter":"noise", "min": 0, "max": 100, "value": 0, "step":1},
		"Clip": {"name":"Clip", "filter":"clip", "min": 0, "max": 100, "value": 0, "step":1},
		"Sharpen": {"name":"Sharpen", "filter":"sharpen", "min": 0, "max": 100, "value": 0, "step":1},
		"Stack Blur": {"name":"Stack Blur", "filter":"stackBlur", "min": 0, "max": 20, "value": 0, "step":1}
	};
	function IEC()
	{
		return {
			//store the applied filter.
			filterApplied : [],
			removeFromApplied : [],
			parentContainer : null, 
			canvasID: '',
			origHTML: "",
			init: function ($parent, options) 
			{
				var editor = this;
				editor.origHTML = $parent.html();
				editor.parentContainer = $parent;
				editor.initializeWorkingArea();
				editor.intializeConvas(options, function(dimension) {
					editor.filtersBackForwardButtons();
					editor.filtersListControls(options);
					editor.applyEffect("normal", options.source, false, dimension);
					editor.bindEvents(options);
				});
			},
			initializeWorkingArea : function () 
			{
				//empty the parent window for rework. 
				this.parentContainer.empty().css({"padding":"0px"});
				this.parentContainer.append($("<div></div>").addClass("bie-editor-controller"))
					.append($("<div></div>").attr("id", "editor-image"))
					.append($("<div></div>").attr("id", "editor-backford-buttons"));
			},
			validateFilterBackForwardButtons: function () {
				if (this.filterApplied.length > 0) {
					this.parentContainer.find(".bie-menu-backpop").removeClass("disabled");
				} else {
					if (!this.parentContainer.find(".bie-menu-backpop").hasClass("disabled")) {
						this.parentContainer.find(".bie-menu-backpop").addClass("disabled");
					}
				}
				if (this.removeFromApplied.length > 0) {
					this.parentContainer.find(".bie-menu-forwardpop").removeClass("disabled");
				} else {
					if (!this.parentContainer.find(".bie-menu-forwardpop").hasClass("disabled")) {
						this.parentContainer.find(".bie-menu-forwardpop").addClass("disabled");
					}
				}
			},
			filtersBackForwardButtons: function() 
			{
				this.parentContainer.find("#editor-backford-buttons")
					.append($("<div></div>").addClass("bie-menu-close-control pull-left"))
					.append($("<div></div>").addClass("btn-group bie-menu-applied-control")
						.append($("<a></a>").addClass("bie-menu-backpop btn btn-default btn-sm disabled").attr("id", "bie-menu-backpop")
							.html("<i class='glyphicon glyphicon-arrow-left'></i>"))
						.append($("<a></a>").addClass("bie-menu-forwardpop btn btn-default btn-sm disabled").attr("id", "bie-menu-forwardpop")
							.html("<i class='glyphicon glyphicon-arrow-right'></i>")));
			},
			intializeConvas : function (options, callback) 
			{
				var editor = this;
				var img = new Image(); 
				img.src = options.source;
	            img.onload = function() {
	                var imgWidth  = this.width;
	                var imgHeight = this.height;
	                newHeight = imgHeight;
	                newWidth = imgWidth;
	                if (imgWidth >= options.maxWidth || imgHeight >= options.maxHeight) {
	                    if (imgWidth > imgHeight) { // Wide
	                        newWidth = options.maxWidth;
	                        newHeight = imgHeight / (imgWidth / options.maxWidth);
	                    } else { // Tall or square
	                        newHeight = options.maxHeight;
	                        newWidth = imgWidth / (imgHeight / options.maxHeight);
	                    }
	                }
	                img.remove(); //remove img now.
	                console.log(newWidth +  " " + newHeight);

	                editor.canvasID = "photoCanvas-" + Math.floor((Math.random() * newWidth) + 1);

	                var canvas = '<canvas id="'+ editor.canvasID +'" data-caman-hidpi="'+options.source +
	                	'" data-caman-hidpi-disabled="true"></canvas>';

	                editor.parentContainer.find("#editor-image").html($("<div></div>").attr(
	                	{
	                		"id": "photoCanvas-wrapper"
	                	})
	                	.css({"width": newWidth, "height": newHeight})
	                	.html(canvas)
	                );
	                if (callback) {
	                	callback({width:newWidth, height:newHeight});
	                }
	            }
			},
			emptyControlArea: function () {
				this.parentContainer.find(".bie-editor-controller").empty();
			},
			applyFilterApplied: function (options) 
			{
				var editor = this;
				if (editor.filterApplied.length > 0) 
				{
					for (var i = 0; i < editor.filterApplied.length; i++) 
					{
						(function(item) {
							if (item == undefined) return;
							if (item.type == 'effect') {
								if (options.blockEnable) {
									editor.displayBlock(options);
								}
								editor.applyEffect(item.name, false, function() {
									if (options.blockEnable) { 
										editor.unblock();
									}
								});
							} else if (item.type == "interactive") {
								if (options.blockEnable) {
									editor.displayBlock(options);
								}
								editor.applyInteractiveFilter(item.name, item.value, function() {
									if (options.blockEnable) {
										editor.unblock();
									}
								});								
							}
						})(editor.filterApplied[i]);
					}
				} else {
					editor.revertFilters();
				}
			},
			revertFilters: function () {
				Caman("#" + this.canvasID, function () {
					this.revert();
				});
			},
			applyEffect: function(effect, src, callback, dimension) 
			{
				var editor = this;
				if (src == false) {
					Caman("#" + editor.canvasID, function () {
						if (effect in this) {
							this.revert(false);
							this[effect]();
						}
						this.render(function() {
							if (callback) {
								callback();
							}
						})
					})
				} else {
					Caman("#" + editor.canvasID, src,  function () {
	                    // If such an effect exists, use it:
	                    if( effect in this){
	                        this.revert(false);
	                        this[effect]();
	                    } else {
	                        this.revert(false);
	                    }
	                    this.render(function() {
	                    	$("#" + editor.canvasID).css({width:dimension.width, height:dimension.height});
	                        if (callback) {
	                        	callback();
	                        }
	                    });
	                });
				}
			}, 
			applyInteractiveFilter: function (filter, value, callback)
            {
            	var value = parseInt(value);
                Caman("#" + this.canvasID, function() {
                    this.revert(false);
                    this[filter](value);
                    this.render(function() {
                        if (callback) {
                        	callback();
                        }
                    });
                });
            },
			filtersListControls: function(options) 
			{
				var $ul = $("<ul></ul>").addClass("bie-menus");
				var $menuClose = $("<a></a>").addClass("btn btn-default bie-menu-close btn-sm").text("Close");
				//create control.
				var $menuControls = $("<div></div>").addClass("bie-menu-control")
					.append($("<a></a>").addClass("btn btn-primary bie-menu-save").text("Save").attr(
					{
						"data-loading-text": "Saving..."
					}))
					.append("<br/>")
					.append($("<input></input>").addClass("bie-menu-input").attr({
						"type": "checkbox",
						"name": "is_replaced",
						"disabled": (options.is_replaced) ? false : true
					}))
					.append(" Repleace Original");
				// create a list of filters 
				for (var i = 0; i < filtersName.length; i++) {
					$ul.append($("<li></li>").addClass("bie-menu-item")
							.append($("<div></div>").addClass("bie-menu-action filter-" + filtersName[i]).attr({
								"name": filtersName[i]
							}).html("<p>" + filtersName[i] + "</p>")
						)
					)
				}
				this.parentContainer.find(".bie-editor-controller").append($menuControls).append($ul);
				this.parentContainer.find(".bie-menu-close-control").html($menuClose);
			},
			filterControls: function(filterName) 
			{
				var $applyButton = $("<div></div>").addClass("bie-menu-control-apply")
					.append($("<a></a>").addClass("btn btn-primary bie-menu-apply")
					.html("Apply"));
				var $backButton = $("<a></a>").addClass("btn btn-default bie-menu-back pull-left btn-sm")
					.html("Back");
					

				var currentFilter = filters[filterName];
				var $ul = this.buildFiltersList(currentFilter);
				this.parentContainer.find(".bie-editor-controller").append($applyButton).append($ul);
				this.parentContainer.find('.bie-menu-close-control').html($backButton);
			},
			buildFiltersList: function (filters) 
			{
				if ($.isArray(filters) == true) 
				{
					var $ul = $("<ul></ul>").attr( {
						"id": "bie-menu-filters", 
						"type": "effect"
					});
					for (var i = 0; i < filters.length; i++) {
						$ul.append($("<li></li>").append($("<a></a>").attr(
							{ 
								"id": filters[i].filter,
								"angle": (filters[i].angle !== undefined) ? filters[i].angle : ""
							})
						.text(filters[i].name)));
					}
					return $ul;
				} else {
					$div = $("<div></div>").attr( { 
						"id": "bie-menu-filters",
						"type": "interactive"
					});
					$low = $("<div></div>").addClass("bie-menu-filter-low")
						.append($("<a></a>").addClass("bie-menu-low-action")
						.html("<i class='glyphicon glyphicon-minus'></i>"));
					$high = $("<div></div>").addClass("bie-menu-filter-high")
						.append($("<a></a>").addClass("bie-menu-high-action")
						.html("<i class='glyphicon glyphicon-plus'></i>"));

					$title = $("<div></div>").addClass("bie-menu-filter-title").text(filters.name);
					$wrapper = $("<div></div>").addClass("bie-menu-outter-slider");
					$slider = $("<div></div>").addClass("bie-menu-filter-setting").attr(
						{
							"data-min": filters.min,
							"data-max": filters.max,
							"data-step": filters.step,
							"data-value": filters.value,
							"data-filter": filters.filter
						});

					$div.append($low).append($high).append($title).append($wrapper).append($slider);
					//initialize the slider.
					$slider.empty().slider({
                        value: filters.value,
                        min: filters.min,
                        max: filters.max,
                        step: filters.step,
                        animate: true,
                        orientation: "horizontal"
                    });
                    var updateWrapper = setInterval(function() 
                    {
                    	if ($slider.width() > 0) {
                    		clearInterval(updateWrapper);
                    		$wrapper.width($slider.width() + 20);
                    	}
                    }, 100);
                    return $div;
				}
			},
			displayBlock: function (options) {
				this.parentContainer.find("#photoCanvas-wrapper").block(
					{
						"message": options.blockMessage,
						"overlayCSS": { 
							backgroundColor: '#fff', 
							opacity: 0.8
						}
					}
				);					
			},
			unblock: function () {
				this.parentContainer.find("#photoCanvas-wrapper").unblock();
			},
			removeActiveFromFilters: function() {
				this.parentContainer.find("#bie-menu-filters li a").removeClass("active");
			},
			addActive: function ($item) {
				$item.addClass("active");
			},
			stackEffect: function () {
				var $filterItem = $filterContainer.find("a.active");
				var stackItem = {
					"type": "effect",
					"name": $filterItem.attr("id")
				};
				this.filterApplied.push(stackItem); 
			},
			stackInteractive: function () {
				var $slider = $filterContainer.find(".bie-menu-filter-setting");
				var stackItem = {
					"type": "interactive",
					"name": $slider.attr('data-filter'),
					"value": $slider.slider("value")
				};
				this.filterApplied.push(stackItem);
			},
			stackupFilter: function () {
				$filterContainer = $("#bie-menu-filters");
				var type = $filterContainer.attr("type");
				if (type == 'effect') {
					//find the item. 
					this.stackEffect(); 
				} else if (type == 'interactive') {
					//find the slider.
					this.stackInteractive(); 
				}
			},
			resetToOriginal: function (options) {
				this.parentContainer.html(this.origHTML);
				if (options.onClose) options.onClose(); 
			},
			clearStackFilter: function () {
				this.filterApplied = [];
				this.removeFromApplied = [];
			},
			convertBase64ToBlob: function (dataURI) {
				// convert base64/URLEncoded data component to raw binary data held in a string
			    var byteString = atob(dataURI.split(',')[1]);
			    var ab = new ArrayBuffer(byteString.length);
			    var ia = new Uint8Array(ab);
			    for (var i = 0; i < byteString.length; i++) {
			        ia[i] = byteString.charCodeAt(i);
			    }
			    return new Blob([ab], { type: 'image/jpeg' });
			},
			saveCurrentCanvas: function (options, callback) 
			{
				var editor = this;
				if (options.remoteSave == true) 
				{
					Caman("#" + editor.canvasID, function()
	                {
	                    this.render(function() {
	                        var image = this.toBase64('jpg');
	                        var blob = editor.convertBase64ToBlob(image);
	                        var fd = new FormData(); 
	                        fd.append("is_replaced", options.is_checked);
	                        fd.append("image", blob);
	                        $.ajax({
	                        	url: options.url, 
	                        	data: fd, 
	                        	type: "POST", 
	                        	processData: false,
	    						contentType: false,
	                        	dataType: "JSON",
	                        	success: function(response) {
	                        		if (options.saveCallBack) {
	                        			options.saveCallBack(response.message, 1);
	                        		}
	                        		if (callback) callback();
	                        	}, 
	                        	error: function(error) {
	                        		if (options.saveCallBack) {
	                        			options.saveCallBack(error.responseJSON.message, 0);
	                        		}
	                        		if (callback) callback();
	                        	}
							});
	                    });
	                });			
				} else {
					//save to file.
					Caman("#" + editor.canvasID, function () {
					  this.render(function () {
					    this.save("png");
					    if (callback) callback();
					  });
					});
				}
				
			},
			removePreviousApplied: function () {
				var pop = this.filterApplied.pop(); 
				this.removeFromApplied.push(pop);
			},
			addPreviousApplied: function () {
				var pop = this.removeFromApplied.pop(); 
				this.filterApplied.push(pop);
			},
			destroyEditor: function () {
				this.parentContainer.empty(); 
			},
			bindEvents: function (options) 
			{
				var editor = this;
				editor.parentContainer.find(".bie-menu-action").unbind().on("click", function() 
				{
					var $filter = $(this);
					editor.emptyControlArea();
					editor.filterControls($filter.attr('name'));
					editor.applyFilterApplied(options);
					editor.bindEvents(options);
				});
				editor.parentContainer.find(".bie-menu-save").unbind().on("click", function() {
					var button = $(this);
					button.button("loading");
					var checkbox = editor.parentContainer.find("input[name='is_replaced']").is(":checked");
					options.is_checked = checkbox; 
					editor.saveCurrentCanvas(options, function () {
						button.button("reset");
					});
				});
				editor.parentContainer.find(".bie-menu-filter-setting").on( "slidechange", function (event, ui) {
					editor.applyFilterApplied(options);
					var filter = $(this).attr('data-filter');
					var value = ui.value;
					if (options.blockEnable) {
						editor.displayBlock(options);
					}
					editor.applyInteractiveFilter(filter, value, function () {
						if (options.blockEnable) {
							editor.unblock();							
						}
					});
				});
				editor.parentContainer.find("#bie-menu-filters li a").unbind().on("click", function () {
					var $item = $(this);
					var filter = $item .attr("id");
					if (options.blockEnable) {
						editor.displayBlock(options);
					}
					editor.removeActiveFromFilters(); 
					editor.applyFilterApplied(options);
					editor.addActive($(this));						
					editor.applyEffect(filter, false, function() {
						if (options.blockEnable) {
							editor.unblock();
						}
					});
				});
				editor.parentContainer.find(".bie-menu-low-action").unbind().on("click", function () {
					var min = editor.parentContainer.find(".bie-menu-filter-setting").attr("data-min");
					editor.parentContainer.find(".bie-menu-filter-setting").slider("value", parseInt(min));
				});
				editor.parentContainer.find(".bie-menu-high-action").unbind().on("click", function () {
					var max = editor.parentContainer.find(".bie-menu-filter-setting").attr("data-max");
					editor.parentContainer.find(".bie-menu-filter-setting").slider("value", parseInt(max));
				})

				editor.parentContainer.find(".bie-menu-back").unbind().on("click", function () {
					editor.emptyControlArea();
					editor.filtersListControls(options);
					editor.revertFilters();
					editor.applyFilterApplied(options);
					editor.validateFilterBackForwardButtons();
					//this might need to apply the filter
					editor.bindEvents(options);
				});
				editor.parentContainer.find(".bie-menu-apply").unbind().on("click", function () {
					editor.stackupFilter();
					editor.emptyControlArea(); 
					editor.filtersListControls(options);
					editor.revertFilters(); 
					editor.applyFilterApplied(options);
					editor.validateFilterBackForwardButtons();
					editor.bindEvents(options);
				});
				editor.parentContainer.find(".bie-menu-close").unbind().on("click", function () {
					editor.clearStackFilter(); 
					editor.revertFilters();
					editor.destroyEditor(); 
					editor.resetToOriginal(options);
				});
				editor.parentContainer.find(".bie-menu-backpop").unbind().on("click", function() {
					editor.removePreviousApplied();
					editor.validateFilterBackForwardButtons();
					// IEC.revertFilters();
					editor.applyFilterApplied(options);
				});
				editor.parentContainer.find(".bie-menu-forwardpop").unbind().on("click", function () {
					editor.addPreviousApplied();
					editor.validateFilterBackForwardButtons();
					// IEC.revertFilters();
					editor.applyFilterApplied(options);
				});
			}
		}
	};
	mainImageEditor = function ($parent, options) 
	{
		var editor = new IEC();
		editor.init($parent, options);
	}
	$.fn.imageEditor = function(options) 
	{
		return this.each(function () {
        	var settings = $.extend($.fn.imageEditor.defaults, options );
        	mainImageEditor($(this), settings);
		});
	};

	$.fn.imageEditor.defaults = {
		"source": '',
		"maxWidth": 500,
		"maxHeight": 400, 
		"remoteSave": false,
		"remoteURL": '',
		"is_repleace": false,
		"blockEnable": false, 
		"blockMessage": null, 
		"onClose": '',
		"saveCallBack": '',

	} 
}( jQuery ));