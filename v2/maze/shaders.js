//---------------------------------------------------------------------------------------
// colour_vertex_shader
//
// 'pos' and 'colour' are the variables visible to the javascript
// '*_mat' are the transformation matrices in the javasctipt
// 'vColor' transfers the colour from the vertext shader to the fragment shader
//---------------------------------------------------------------------------------------
colour_vertex_shader =

"attribute vec3 pos;" +
"attribute vec4 colour;" +

"uniform mat4 model_view_mat;" +
"uniform mat4 perspective_mat;" +

"varying lowp vec4 vColor;" +

"void main(void)" +
"{" +
    "gl_Position = perspective_mat * model_view_mat * vec4(pos, 1.0);" +
    "vColor = colour;" +
"}";
//---------------------------------------------------------------------------------------
// colour_fragment_shader
//
// 'vColor' The colour from the vertext shader
//---------------------------------------------------------------------------------------
var colour_fragment_shader=

"varying lowp vec4 vColor;" +

"void main(void)" +
"{" +
    "gl_FragColor = vColor;" +
"}";
//---------------------------------------------------------------------------------------
// texture_vertex_shader
//
// 'txture_pos' and 'texture_coord' are the variables visible to the javascript
// '*_mat' are the transformation matrices in the javasctipt
// 'vTextureCoord' transfers the texture from the vertext shader to the fragment shader
//---------------------------------------------------------------------------------------
var texture_vertex_shader =

"attribute vec3 txture_pos;" +
"attribute vec2 texture_coord;" +

"uniform mat4 model_view_mat;" +
"uniform mat4 perspective_mat;" +

"varying lowp vec2 vTextureCoord;" +

"void main(void)" +
"{" +
    "gl_Position = perspective_mat * model_view_mat * vec4(txture_pos, 1.0);" +
    "vTextureCoord = texture_coord;" +
"}";
//---------------------------------------------------------------------------------------
// texture_fragment_shader
//
// 'vTextureCoord' the texture from the vertext shader
//---------------------------------------------------------------------------------------
var texture_fragment_shader =

"varying lowp vec2 vTextureCoord;" +

"uniform sampler2D uSampler;" +

"void main(void)" +
"{" +
    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));" +
"}";

