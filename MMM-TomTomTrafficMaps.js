Module.register("MMM-TomTomTrafficMaps", {

	//cdn/6.x/6.25.1

	//https://developer.tomtom.com/maps-sdk-web-js/functional-examples

	defaults: {
		requiresVersion: "6.25.1",  //Developped and tested with this version.
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
		TTVersion: "6.25.1" //Internal solution to quickly change version of TomTom API to a new version.
	},

		//tomtom://vector/1/basic-main
		//tomtom://vector/1/basic-night
		//tomtom://vector/1/hybrid-main
		//tomtom://vector/1/hybrid-night
		//tomtom://vector/1/labels-main
		//tomtom://vector/1/labels-night
		//tomtom://vector/1/basic-light
		
	getStyles: function () {
		//https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css
		//"https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/" +  this.config.TTVersion + "/maps/css-styles/traffic-incidents.css"

		return [
			"https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/" + this.config.TTVersion + "/maps/maps.css"
		]

	},
	// Define required scripts.
	getScripts: function () {
		return [
			"https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/" + this.config.TTVersion + "/maps/maps-web.min.js"
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

			script.innerHTML += `var map = tt.map( {key:'${this.config.key}', container: 'ttmap', center: [${this.config.lng},${this.config.lat}], zoom: ${this.config.zoom}, stylesVisibility: {trafficIncidents: ${this.config.showIncidents},trafficFlow: ${this.config.showTraffic}} } );`

			document.body.appendChild(script);

		}
	},

	getDom: function () {
		// use ttmap instead of map so if other module uses the map class or div it doesnt impact us here
		let wrapper = document.createElement("div");
		wrapper.setAttribute("id", "ttmap");
		wrapper.setAttribute("class", "ttmap");
		wrapper.style.height = this.config.height;
		wrapper.style.width = this.config.width;	
		return wrapper;
	}
});
