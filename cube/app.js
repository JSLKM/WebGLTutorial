var vertexShaderText = 
[
	'precision mediump float;',
	'',
	'attribute vec3 vertPosition;',
	'attribute vec3 vertColor;',
	'varying vec3 fragColor;',
	'uniform mat4 mWorld;',
	'uniform mat4 mView;',
	'uniform mat4 mProj;',
	'',
	'void main()',
	'{',
	' fragColor = vertColor;',
	' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
	'}'
].join('\n');

var fragmentShaderText = 
[
	'precision mediump float;',
	'',
	'varying vec3 fragColor;',
	'void main()',
	'{',
	' gl_FragColor = vec4(fragColor,1.0);',
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
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW); //counter clockwise
	gl.cullFace(gl.BACK);


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

	var boxVertices = 
		[
		// TOP
		-1.0, 1.0, -1.0,            0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,             0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,             0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,            0.5, 0.5, 0.5,
		// LEFT 
		-1.0, 1.0, 1.0,            0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,             0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,             0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,            0.75, 0.25, 0.5,
		// RIGHT 
		1.0, 1.0, 1.0,            0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,             0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,             0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,            0.25, 0.25, 0.75,
		// FRONT 
		1.0, 1.0, 1.0,            1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,             1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,             1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,            1.0, 0.0, 0.15,
		// BACK 
		1.0, 1.0,-1.0,             0.0, 1.0, 0.15,
		1.0,-1.0,-1.0,             0.0, 1.0, 0.15,
		-1.0,-1.0,-1.0,             0.0, 1.0, 0.15,
		-1.0, 1.0,-1.0,             0.0, 1.0, 0.15,
		// BOTTOM 
		-1.0, -1.0, -1.0,            0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,             0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,             0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,            0.5, 0.5, 1.0,
		];
	// in RAM
	//

	var boxIndices = 
		[
		// TOP
		0,1,2,
		0,2,3,
		// LEFT
		5,4,6,
		6,4,7,
		// RIGHT
		8,9,10,
		8,10,11,
		// FRONT
		13,12,14,
		15,14,12,
		// BACK
		16,17,18,
		16,18,19,
		// BOTTOM 
		21,20,22,
		22,20,23
		];


	var boxVertexBufferObject = gl.createBuffer();
	//type of data
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	//specifying the data, js saved in 64 bit
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
			positionAttribLocation, // Attribute Location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
			);

	gl.vertexAttribPointer(
			colorAttribLocation, // Attribute Location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
			3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
			);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	//Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);

	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0,0,-8],[0,0,0],[0,1,0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height,0.1,1000.0);


	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	//Main render loop
	//
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function() {
		angle = performance.now() /1000 /6 *2 *Math.PI; // full rotation every 6 seconds
		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0,1,0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle/4, [1,0,0]);
		glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75,0.85,0.8,1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		//gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT,0); //last 0 tells that we start at the beginning

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};


































