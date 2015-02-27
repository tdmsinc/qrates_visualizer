function ShaderLoader(manager) {
  this.cache = new THREE.Cache();
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

ShaderLoader.prototype.load = function(url, onLoad, onProgress, onError) {
	var scope = this;

	var cached = scope.cache.get(url);

	if (cached !== undefined) {
		onLoad(cached);
		return;
	}

	var shader;

	var req;

	try {
		req = new XMLHttpRequest();
	} catch (e) {
		try {
			req = new ActiveXObject('Msxml12.XMLHTTP');
		} catch (e) {
			req = new ActiveXObject('Microsoft.XMLHTTP');
		}
	}

	req.dataType = 'text';

	req.onreadystatechange = function(event) {
		if (3 === req.readyState) {
			if (onProgress !== undefined) {
				onProgress(event);
			}
		} else if (4 === req.readyState) {
			if (200 === req.status) {
				if (onLoad !== undefined) {
					scope.cache.add(url, req.responseText);

					onLoad(req.responseText);
					scope.manager.itemEnd(url);
				}
			} else {
				if (onError !== undefined) {
					onError(req.statusText);
				}
			}
		}
	};

	req.open('GET', url, true);
	req.send(null);

	scope.manager.itemStart(url);

	return shader;
};