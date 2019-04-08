var vertexShaderText = 
[
  'precision mediump float;',
	'',
	'attribute vec2 vertPosition;',
	'',
	'void main()',
	'{',
	' gl_Position = vec4(vertPosition, 0.0, 1.0);',
	'}'
].join('\n');

var fragmentShaderText = 
[
  'precision mediump float;',
	'',
	'void main()',
	'{',
	' gl_FragColor = vec4(1.0,0.0,0.0,1.0);',
	'}'
].join('\n');





var InitDemo = function() {
	console.log('This is working!');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if(!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if(!gl) {
		alert('You browser does not support WebGL');
	}

	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeigth;
	
	gl.clearColor(0.75, 0.85, 0.8, 1.0); //Color of the brush
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //Actually performs the paint
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	//compile the GLSL
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);

	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);

	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//DEBUG RELEASES
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error("ERROR validating program!", gl.getProgramInfoLog(program));
		return;
	}

	// create buffer
	// 
	//
	
	var triangleVertices = 
	[
		0.0,0.5,
		-0.5,-0.5,
		0.5,-0.5
	];
	// in RAM
	//
	
	var triangleVertexBufferObject = gl.createBuffer();
	//type of data
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	//specifying the data, js saved in 64 bit
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
			positionAttribLocation, // Attribute Location
			2, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			2 * Float32Array.BITES_PER_ELEMENT,// size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);


	//Main render loop
	//
	
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
};


































