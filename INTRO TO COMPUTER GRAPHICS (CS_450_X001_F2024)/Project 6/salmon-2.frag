#version 330 compatibility

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

const float EYES1 = 0.90;					// position of the first eye
const float EYET1 = 0.65;					// position of the first eye
const float EYES2 = 0.90;					// position of the second eye
const float EYET2 = 0.35;					// position of the second eye
const float R 			= 0.03;				// radius of salmon eye
const vec3 SALMONCOLOR		= vec3( 1.98, 5.50, 3.45 );	// "salmon" (r,g,b) color
const vec3 EYECOLOR		= vec3( 0., 1., 0. );		// color to make the eye
const vec3 SPECULARCOLOR 	= vec3( 1., 1., 1. );

void
main( )
{
	vec3 myColor = SALMONCOLOR;
	float ds1 = vST.x - EYES1;					// s distance from current frag to first salmon eye
	float dt1 = vST.y - EYET1;				// t distance from current frag to first salmon eye
	float dist1 = sqrt(ds1 * ds1 + dt1 * dt1);

	float ds2 = vST.x - EYES2;					// s distance from current frag to second salmon eye
	float dt2 = vST.y - EYET2;				// t distance from current frag to second salmon eye
	float dist2 = sqrt(ds2 * ds2 + dt2 * dt2);

	if( dist1 < R || dist2 < R )
	{
		myColor = EYECOLOR;
	}

	// now do the per-fragment lighting:

	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 ambient = uKa * myColor;

	float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * d * myColor;

	float s = 0.;
	if( d > 0. )	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		float cosphi = dot( Eye, ref );
		if( cosphi > 0. )
			s = pow( max( cosphi, 0. ), uShininess );
	}
	vec3 specular = uKs * s * SPECULARCOLOR.rgb;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}