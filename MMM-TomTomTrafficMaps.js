Module.register("MMM-TomTomTrafficMaps",{

	defaults: {
		requiresVersion: "2.8.0",  //Developped and tested with this version.
		key: "",
		lang: config.language,
		height: "75vh",
		width: "75vw",
		trafficStyle: "relative",
		incidentStyle: "s1",
		mapStyle: "basic-main",
		refresh: (60 * 60 * 1000), //Human readable for every 60 minutes.
		showIncidents: true,
		showTraffic: true,
		zoom: 11,
		TTVersion: "5.47.0" //Internal solution to quickly change version of TomTom API to a new version.
	},

		//tomtom://vector/1/basic-main
		//tomtom://vector/1/basic-night
		//tomtom://vector/1/hybrid-main
		//tomtom://vector/1/hybrid-night
		//tomtom://vector/1/labels-main
		//tomtom://vector/1/labels-night
		//tomtom://vector/1/basic-light
		
	getStyles: function() {

		return [
			"https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" +  this.config.TTVersion + "/maps/maps.css",
			"https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" +  this.config.TTVersion + "/maps/css-styles/traffic-incidents.css"
		]

	},
	// Define required scripts.
	getScripts: function () {
		return [
			"https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" + this.config.TTVersion + "/maps/maps-web.min.js"
		];
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		if (this.config.key === "") {
			Log.error(this.name + ": key not set. Please read the README.md for details.");
			return;
		}
	}, 

	notificationReceived: function (notification, payload, sender) {

		if (notification === 'MODULE_DOM_CREATED')
		{

			let script = document.createElement("script")
			script.type = "text/javascript";
			script.innerHTML += "tt.setProductInfo('MagicMirror TomTom Traffic & Incidents', '1.0'); ";
			script.innerHTML += `let map = new tt.map({key: '${this.config.key}',container: 'ttmap',center: [${this.config.lng},${this.config.lat}],`;
			script.innerHTML += `zoom: ${this.config.zoom},style: 'tomtom://vector/1/${this.config.mapStyle}',language: '${this.config.lang}',interactive: false});`;
			//script.innerHTML += `map.addControl(new tt.NavigationControl());`;
			script.innerHTML += `var flowconfig = { key: '${this.config.key}',style: 'tomtom://vector/1/${this.config.trafficStyle}',refresh: ${this.config.refresh}};`;
			script.innerHTML += `var incconfig = { key: '${this.config.key}', incidentTiles: { style: 'tomtom://vector/1/${this.config.incidentStyle}' }, incidentDetails: { style: '${this.config.incidentStyle}' } };`;
			script.innerHTML += `map.on('load', function () {`;

			if (!this.config.showIncidents) { }
			else
			{
				script.innerHTML += "map.addTier(new tt.TrafficFlowTilesTier(flowconfig));";
			}

			if (!this.config.showTraffic) { }
			else
			{
				script.innerHTML += "map.addTier(new tt.TrafficIncidentTier(incconfig));";
			}

			script.innerHTML += "});"; //alert('loaded maps');

			document.body.appendChild(script);

		}
	},

	getDom: function () {
		// use ttmpa instead of map so if other module uses the map class or div it doesnt impact us here
		let wrapper = document.createElement("div");
		wrapper.setAttribute("id", "ttmap");
		wrapper.setAttribute("class", "ttmap");
		wrapper.style.height = this.config.height;
		wrapper.style.width = this.config.width;	
		return wrapper;
	}
});
