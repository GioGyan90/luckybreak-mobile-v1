import{G as At,M as Le,S as Vt}from"./gameQuality-7FNYzhuI.js";import{c as ze,U as Ne,aa as je,X as Ie,e as _e,V as P,aY as He,aZ as Q,a_ as tt,a$ as qt,a6 as Jt,a as z,b0 as Fe,b1 as Ye,M as Ke,az as Ue,J as ie,b2 as Ze,b3 as Be,aT as Xe,G as Ge,b4 as We,a3 as Ve,b5 as qe,C as se}from"./BufferGeometryUtils-C4woviwh.js";class gt extends ze{constructor(){const o=gt.SkyShader,n=new Ne({name:o.name,uniforms:Ie.clone(o.uniforms),vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,side:je,depthWrite:!1});super(new _e(1,1,1),n),this.isSky=!0}}gt.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new P},up:{value:new P(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const{PI:B,sin:l,cos:d,tan:yt,asin:bt,atan2:ot,acos:re,sqrt:Je,abs:$e,round:ce,floor:Qe}=Math,h=B/180,ct=1e3*60*60*24,le=2440588,rt=2451545,to=6378.14;function ft(a){return new Date((a+.5-le)*ct)}function wt(a){return a.valueOf()/ct-.5+le-rt}function eo(a){const o=2e3+a/365.2425;let n;return o<1920?(n=o-1900,-2.79+n*(1.494119+n*(-.0598939+n*(.0061966-n*197e-6)))):o<1941?(n=o-1920,21.2+n*(.84493+n*(-.0761+n*.0020936))):o<1961?(n=o-1950,29.07+n*(.407+n*(-1/233+n/2547))):o<1986?(n=o-1975,45.45+n*(1.067+n*(-1/260-n/718))):o<2005?(n=o-2e3,63.86+n*(.3345+n*(-.060374+n*(.0017275+n*(651814e-9+n*2373599e-11))))):o<2050?(n=o-2e3,62.92+n*(.32217+n*.005589)):(n=(o-1820)/100,-20+32*n*n-.5628*(2150-o))}function nt(a){return a+eo(a)/86400}function ue(a,o,n){return(ot(l(a),d(a)*l(o)-yt(n)*d(o))/h+540)%360}function Et(a,o,n){return bt(l(o)*l(n)+d(o)*d(n)*d(a))}function vt(a,o){return h*(280.46061837+360.98564736629*a)-o}function he(a){return a<0&&(a=0),2967e-7/yt(a+.00312536/(a+.08901179))}function lt(a){const o=a/36525,n=h*(280.46646+o*(36000.76983+o*3032e-7)),t=h*(357.52911+o*(35999.05029-o*1537e-7)),i=l(t),r=d(t),m=h*((1.914602-o*(.004817+o*14e-6))*i+(.019993-101e-6*o)*2*i*r+289e-6*i*(3-4*i*i)),c=h*(125.04-1934.136*o),u=n+m-h*(.00569+.00478*l(c)),g=h*(23.439291-o*(.0130042+o*(16e-8-o*504e-9)))+h*.00256*d(c);return{ra:ot(d(g)*l(u),d(u)),dec:bt(l(g)*l(u)),lon:u}}function oo(a,o,n){const t=h*-135,i=h*o,r=wt(a),m=lt(nt(r)),c=vt(r,t)-m.ra,u=Et(c,i,m.dec);return{azimuth:ue(c,i,m.dec),altitude:(u+he(u))/h}}const $t=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]],no=9e-4;function ao(a){return-2.076*Je(a)/60}function de(a){return a-2*B*ce(a/(2*B))}function io(a,o){for(let n=0;n<3;n++){const t=de(vt(a,o)-lt(nt(a)).ra);a-=t/(2*B)}return a}function Qt(a,o,n,t,i,r){const m=(l(a)-l(i)*l(r))/(d(i)*d(r));if(m<-1||m>1)return NaN;let c=o+n*re(m)/(2*B);for(let u=0;u<2;u++){const g=lt(nt(c)),y=de(vt(c,t)-g.ra),v=Et(y,i,g.dec),w=d(i)*d(g.dec)*l(y);if($e(w)<1e-6)break;c+=(v-a)/(2*B*w)}return c}function so(a,o){const n=o*6e4;return Qe((a.valueOf()+n)/ct)*ct-n}function ro(a,o,n){const t=so(a,n)+ct/2,i=no+o/(2*B);return io(ce(wt(t)-i)+i,o)}function co(a,o,n,t=0,i){const r=h*-135,m=h*o,c=ao(t),u=ro(a,r,i),g=lt(nt(u)).dec,y={solarNoon:ft(u+rt),nadir:ft(u+rt-.5)};for(const[v,w,x]of $t){const S=(v+c)*h,T=Qt(S,u,-1,r,m,g),R=Qt(S,u,1,r,m,g);y[w]=Number.isNaN(T)?null:ft(T+rt),y[x]=Number.isNaN(R)?null:ft(R+rt)}if(y.sunrise===null){const v=Et(0,m,g),w=($t[0][0]+c)*h;y.alwaysUp=v>w,y.alwaysDown=v<=w}return y}function lo(a){const o=h*(125.04452-1934.136261*a),n=h*(280.4665+36000.7698*a),t=h*(218.3165+481267.8813*a),i=(-17.2*l(o)-1.32*l(2*n)-.23*l(2*t)+.21*l(2*o))/3600,r=(9.2*d(o)+.57*d(2*n)+.1*d(2*t)-.09*d(2*o))/3600,m=23.439291-a*(.0130042+a*(16e-8-a*504e-9));return{dpsi:i,eps:h*(m+r)}}const W=new Int32Array([0,0,1,0,6288774,-20905355,2,0,-1,0,1274027,-3699111,2,0,0,0,658314,-2955968,0,0,2,0,213618,-569925,0,1,0,0,-185116,48888,0,0,0,2,-114332,-3149,2,0,-2,0,58793,246158,2,-1,-1,0,57066,-152138,2,0,1,0,53322,-170733,2,-1,0,0,45758,-204586,0,1,-1,0,-40923,-129620,1,0,0,0,-34720,108743,0,1,1,0,-30383,104755,2,0,0,-2,15327,10321,0,0,1,2,-12528,0,0,0,1,-2,10980,79661,4,0,-1,0,10675,-34782,0,0,3,0,10034,-23210,4,0,-2,0,8548,-21636,2,1,-1,0,-7888,24208,2,1,0,0,-6766,30824,1,0,-1,0,-5163,-8379,1,1,0,0,4987,-16675,2,-1,1,0,4036,-12831,2,0,2,0,3994,-10445,4,0,0,0,3861,-11650,2,0,-3,0,3665,14403,0,1,-2,0,-2689,-7003,2,0,-1,2,-2602,0,2,-1,-2,0,2390,10056,1,0,1,0,-2348,6322,2,-2,0,0,2236,-9884,0,1,2,0,-2120,5751,0,2,0,0,-2069,0,2,-2,-1,0,2048,-4950,2,0,1,-2,-1773,4130,2,0,0,2,-1595,0,4,-1,-1,0,1215,-3958,0,0,2,2,-1110,0,3,0,-1,0,-892,3258,2,1,1,0,-810,2616,4,-1,-2,0,759,-1897,0,2,-1,0,-713,-2117,2,2,-1,0,-700,2354,2,1,-2,0,691,0,2,-1,0,-2,596,0,4,0,1,0,549,-1423,0,0,4,0,537,-1117,4,-1,0,0,520,-1571,1,0,-2,0,-487,-1739,2,1,0,-2,-399,0,0,0,2,-2,-381,-4421,1,1,1,0,351,0,3,0,-2,0,-340,0,4,0,-3,0,330,0,2,-1,2,0,327,0,0,2,1,0,-323,1165,1,1,-1,0,299,0,2,0,3,0,294,0,2,0,-1,-2,0,8752]),et=new Int32Array([0,0,0,1,5128122,0,0,1,1,280602,0,0,1,-1,277693,2,0,0,-1,173237,2,0,-1,1,55413,2,0,-1,-1,46271,2,0,0,1,32573,0,0,2,1,17198,2,0,1,-1,9266,0,0,2,-1,8822,2,-1,0,-1,8216,2,0,-2,-1,4324,2,0,1,1,4200,2,1,0,-1,-3359,2,-1,-1,1,2463,2,-1,0,1,2211,2,-1,-1,-1,2065,0,1,-1,-1,-1870,4,0,-1,-1,1828,0,1,0,1,-1794,0,0,0,3,-1749,0,1,-1,1,-1565,1,0,0,1,-1491,0,1,1,1,-1475,0,1,1,-1,-1410,0,1,0,-1,-1344,1,0,0,-1,-1335,0,0,3,1,1107,4,0,0,-1,1021,4,0,-1,1,833,0,0,1,-3,777,4,0,-2,1,671,2,0,0,-3,607,2,0,2,-1,596,2,-1,1,-1,491,2,0,-2,1,-451,0,0,3,-1,439,2,0,2,1,422,2,0,-3,-1,421,2,1,-1,1,-366,2,1,0,1,-351,4,0,0,1,331,2,-1,1,1,315,2,-2,0,-1,302,0,0,1,3,-283,2,1,1,-1,-229,1,1,0,-1,223,1,1,0,1,223,0,1,-2,-1,-220,2,1,-1,-1,-220,1,0,1,1,-185,2,-1,-2,-1,181,0,1,2,1,-177,4,0,-2,-1,176,4,-1,-1,-1,166,1,0,1,-1,-164,4,0,1,-1,132,1,0,-1,-1,-119,4,-1,0,-1,115,2,-2,0,1,107]);function me(a){const o=a/36525,n=218.3164477+o*(481267.88123421+o*(-.0015786+o*(1/538841-o/65194e3))),t=297.8501921+o*(445267.1114034+o*(-.0018819+o*(1/545868-o/113065e3))),i=357.5291092+o*(35999.0502909+o*(-1536e-7+o/2449e4)),r=134.9633964+o*(477198.8675055+o*(.0087414+o*(1/69699-o/14712e3))),m=93.272095+o*(483202.0175233+o*(-.0036539+o*(-1/3526e3+o/86331e4))),c=119.75+131.849*o,u=53.09+479264.29*o,g=313.45+481266.484*o,y=1-o*(.002516+o*74e-7),v=h*t,w=h*i,x=h*r,S=h*m;let T=0,R=0,N=0;for(let b=0;b<W.length;b+=6){const D=W[b+1],F=W[b]*v+D*w+W[b+2]*x+W[b+3]*S,I=D===1||D===-1?y:D===2||D===-2?y*y:1;T+=W[b+4]*I*l(F),R+=W[b+5]*I*d(F)}for(let b=0;b<et.length;b+=5){const D=et[b+1],F=et[b]*v+D*w+et[b+2]*x+et[b+3]*S,I=D===1||D===-1?y:D===2||D===-2?y*y:1;N+=et[b+4]*I*l(F)}const j=h*c,k=h*n;T+=3958*l(j)+1962*l(k-S)+318*l(h*u),N+=-2235*l(k)+382*l(h*g)+175*l(j-S)+175*l(j+S)+127*l(k-x)-115*l(k+x);const{dpsi:ht,eps:C}=lo(o),H=h*(n+T/1e6+ht),E=h*(N/1e6);return{ra:ot(l(H)*d(C)-yt(E)*l(C),d(H)),dec:bt(l(E)*d(C)+d(E)*l(C)*l(H)),dist:385000.56+R/1e3,lon:H}}function uo(a,o,n){const t=h*-135,i=h*o,r=wt(a),m=me(nt(r)),c=vt(r,t)-m.ra,u=Et(c,i,m.dec),g=u-bt(to/m.dist*d(u)),y=ot(l(c),yt(i)*d(m.dec)-l(m.dec)*d(c));return{azimuth:ue(c,i,m.dec),altitude:(g+he(g))/h,distance:m.dist,parallacticAngle:y/h}}function ho(a=new Date){const o=nt(wt(a)),n=lt(o),t=me(o),i=149598e3,r=re(l(n.dec)*l(t.dec)+d(n.dec)*d(t.dec)*d(n.ra-t.ra)),m=ot(i*l(r),t.dist-i*d(r)),c=ot(d(n.dec)*l(n.ra-t.ra),l(n.dec)*d(t.dec)-d(n.dec)*l(t.dec)*d(n.ra-t.ra)),u=((t.lon-n.lon)/(2*B)%1+1)%1,g=u<.5;return{fraction:(1+d(m))/2,phase:u,angle:c/h,waxing:g}}const V={latitude:34,longitude:135,utcOffsetMinutes:540},mo="2026-09-22",fo=[1,60,360,1440],Ot=Math.PI/180;function Z(a,o,n){const t=Math.max(0,Math.min(1,(n-a)/(o-a)));return t*t*(3-2*t)}function te(a,o){const n=a*Ot,t=o*Ot;return[Math.cos(n)*Math.sin(t),Math.sin(n),-Math.cos(n)*Math.cos(t)]}function po(a){const o=new Date(a+V.utcOffsetMinutes*6e4);return{date:o.toISOString().slice(0,10),minutes:o.getUTCHours()*60+o.getUTCMinutes()+o.getUTCSeconds()/60}}function ee(a,o){if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!Number.isFinite(o)||o<0||o>=1440)throw Error("日期或时间无效");const n=Date.parse(a+"T00:00:00Z");if(!Number.isFinite(n)||new Date(n).toISOString().slice(0,10)!==a)throw Error("日期无效");return n-V.utcOffsetMinutes*6e4+o*6e4}function So(a){const o=Math.floor(po(a).minutes);return`${String(Math.floor(o/60)).padStart(2,"0")}:${String(o%60).padStart(2,"0")}`}class Mo{timestamp=ee(mo,600);speed=360;playing=!0;advance(o){return this.playing&&Number.isFinite(o)&&o>0&&(this.timestamp+=o*this.speed*1e3),this.timestamp}seek(o,n){this.timestamp=ee(o,n)}setSpeed(o){if(!fo.includes(o))throw Error("不支持的速度");this.speed=o}}function Po(a){return co(new Date(a),V.latitude,V.longitude,0,V.utcOffsetMinutes)}function To(a){const o=new Date(a),n=oo(o,V.latitude),t=uo(o,V.latitude),i=ho(o),r=Z(-6,12,n.altitude),m=1-Z(-9,1,n.altitude),c=(1-Z(5,28,n.altitude))*Z(-4,2,n.altitude),u=Z(0,4,n.altitude)*(.55+1.25*Math.sqrt(Math.max(0,Math.sin(n.altitude*Ot))));return{sun:n,moon:t,sunDirection:te(n.altitude,n.azimuth),moonDirection:te(t.altitude,t.azimuth),moonFraction:i.fraction,daylight:r,night:m,warm:c,direct:u,moonVisibility:Z(-1,4,t.altitude),phase:n.altitude<-9?"深夜":n.altitude<-1?"曙暮光":n.altitude<10?n.azimuth<180?"日出":"日落":n.altitude<25?"晨昏":"白天"}}function xo(a,o){const n=Z(-12,-3,a)*(1-Z(3,20,a)),t=o>=180?1:0;return{glow:n,dusk:t,horizon:t?16748629:16757886,rose:t?15555719:16223914,zenith:t?5327764:8162247,sunlight:t?16756071:16765594,cloud:t?16749963:16758958}}const go=`
 float elevation=max(direction.y,0.0);
 vec3 nightColor=mix(horizonColor,vec3(.0006,.0018,.006),smoothstep(0.0,.75,elevation));
 vec3 boundedSky=retColor/(retColor+vec3(.7));
 vec3 illustratedDay=mix(horizonColor,vec3(.008,.22,.55),smoothstep(0.0,.65,elevation));
 boundedSky=mix(boundedSky,illustratedDay,daylight*.4);
 vec3 skyColor=mix(boundedSky,nightColor,nightBlend);
 // Art-led crimson/rose band spans more of the sky; cool violet stays above.
 // Dividing by a bounded length also handles a camera looking at the zenith.
 vec2 horizontal=direction.xz/max(length(direction.xz),.0001);
 vec2 sunHorizontal=vSunDirection.xz/max(length(vSunDirection.xz),.0001);
 float facing=smoothstep(-.45,.95,dot(horizontal,sunHorizontal));
 vec3 lowSky=mix(twilightRose,twilightHorizon,facing);
 vec3 middleSky=mix(twilightRose,twilightHorizon,.12*facing);
 vec3 twilightColor=mix(lowSky,middleSky,smoothstep(.01,.18,elevation));
 twilightColor=mix(twilightColor,twilightZenith,smoothstep(.16,.85,elevation));
 float halo=pow(max(dot(direction,vSunDirection),0.0),18.0);
 twilightColor+=twilightHorizon*halo*.42;
 // Broad, sparse high-cloud ribbons; they wrap with view direction and have
 // no screen-space motion or random per-frame flicker.
 float az=atan(direction.z,direction.x);
 float ribbonHeight=.13+.022*sin(az*3.)+.012*sin(az*7.);
 float ribbon=exp(-pow((elevation-ribbonHeight)/.023,2.));
 ribbon+=.45*exp(-pow((elevation-ribbonHeight-.085)/.018,2.));
 float gaps=smoothstep(-.45,.65,sin(az*5.+.7)+.35*sin(az*11.));
 twilightColor=mix(twilightColor,mix(twilightRose,twilightHorizon,facing),clamp(ribbon*gaps*.38,0.,.42));
 skyColor=mix(skyColor,twilightColor,twilightStrength);
 // Preserve a restrained solar disc after artistic sky compositing.
 float disc=smoothstep(.99993,.99997,dot(direction,vSunDirection));
 skyColor=mix(skyColor,vec3(1.,.80,.46),disc*twilightStrength*smoothstep(-.018,.008,vSunDirection.y));
 skyColor=mix(skyColor,horizonColor,exp(-elevation*32.)*.62);
 gl_FragColor=vec4(skyColor,1.0);`,_={sun:{color:16775407,intensity:2.5,position:[-190,300,155]},hemi:{sky:12903679,ground:10926287,intensity:.7},fill:{color:11916799,intensity:.22},fog:12378871},Co={sand:16769966,wetSand:14134649,grass:7914576,hill:5742424,ridge:7977067,rock:12959134,quay:15458503},Do={shallow:"#48d6c7",deep:"#1053a4"},Ao={seafoam:7198916,apricot:16430467,coral:15827549,lavender:10971863,magenta:14960537,cobalt:1466030};function Oo(a){const o=(n,t,i)=>{const r=Math.max(0,Math.min(1,(i-n)/(t-n)));return r*r*(3-2*r)};return o(-196,-168,a)*(1-o(160,196,a))*(9.5+3.5*Math.sin(a*.026)+1.5*Math.cos(a*.063))*(1-Math.exp(-Math.pow((a-98)/17,2)))}const oe={type:"change"},Dt={type:"start"},ne={type:"end"},pt=new Fe,ae=new Ye,yo=Math.cos(70*Ke.DEG2RAD);class bo extends He{constructor(o,n){super(),this.object=o,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Q.ROTATE,MIDDLE:Q.DOLLY,RIGHT:Q.PAN},this.touches={ONE:tt.ROTATE,TWO:tt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return c.phi},this.getAzimuthalAngle=function(){return c.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(e){e.addEventListener("keydown",xt),this._domElementKeyEvents=e},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",xt),this._domElementKeyEvents=null},this.saveState=function(){t.target0.copy(t.target),t.position0.copy(t.object.position),t.zoom0=t.object.zoom},this.reset=function(){t.target.copy(t.target0),t.object.position.copy(t.position0),t.object.zoom=t.zoom0,t.object.updateProjectionMatrix(),t.dispatchEvent(oe),t.update(),r=i.NONE},this.update=(function(){const e=new P,s=new Jt().setFromUnitVectors(o.up,new P(0,1,0)),f=s.clone().invert(),p=new P,M=new Jt,U=new P,L=2*Math.PI;return function(ke=null){const Wt=t.object.position;e.copy(Wt).sub(t.target),e.applyQuaternion(s),c.setFromVector3(e),t.autoRotate&&r===i.NONE&&I(D(ke)),t.enableDamping?(c.theta+=u.theta*t.dampingFactor,c.phi+=u.phi*t.dampingFactor):(c.theta+=u.theta,c.phi+=u.phi);let Y=t.minAzimuthAngle,K=t.maxAzimuthAngle;isFinite(Y)&&isFinite(K)&&(Y<-Math.PI?Y+=L:Y>Math.PI&&(Y-=L),K<-Math.PI?K+=L:K>Math.PI&&(K-=L),Y<=K?c.theta=Math.max(Y,Math.min(K,c.theta)):c.theta=c.theta>(Y+K)/2?Math.max(Y,c.theta):Math.min(K,c.theta)),c.phi=Math.max(t.minPolarAngle,Math.min(t.maxPolarAngle,c.phi)),c.makeSafe(),t.enableDamping===!0?t.target.addScaledVector(y,t.dampingFactor):t.target.add(y),t.target.sub(t.cursor),t.target.clampLength(t.minTargetRadius,t.maxTargetRadius),t.target.add(t.cursor),t.zoomToCursor&&H||t.object.isOrthographicCamera?c.radius=Pt(c.radius):c.radius=Pt(c.radius*g),e.setFromSpherical(c),e.applyQuaternion(f),Wt.copy(t.target).add(e),t.object.lookAt(t.target),t.enableDamping===!0?(u.theta*=1-t.dampingFactor,u.phi*=1-t.dampingFactor,y.multiplyScalar(1-t.dampingFactor)):(u.set(0,0,0),y.set(0,0,0));let Ct=!1;if(t.zoomToCursor&&H){let it=null;if(t.object.isPerspectiveCamera){const st=e.length();it=Pt(st*g);const mt=st-it;t.object.position.addScaledVector(ht,mt),t.object.updateMatrixWorld()}else if(t.object.isOrthographicCamera){const st=new P(C.x,C.y,0);st.unproject(t.object),t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/g)),t.object.updateProjectionMatrix(),Ct=!0;const mt=new P(C.x,C.y,0);mt.unproject(t.object),t.object.position.sub(mt).add(st),t.object.updateMatrixWorld(),it=e.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),t.zoomToCursor=!1;it!==null&&(this.screenSpacePanning?t.target.set(0,0,-1).transformDirection(t.object.matrix).multiplyScalar(it).add(t.object.position):(pt.origin.copy(t.object.position),pt.direction.set(0,0,-1).transformDirection(t.object.matrix),Math.abs(t.object.up.dot(pt.direction))<yo?o.lookAt(t.target):(ae.setFromNormalAndCoplanarPoint(t.object.up,t.target),pt.intersectPlane(ae,t.target))))}else t.object.isOrthographicCamera&&(t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/g)),t.object.updateProjectionMatrix(),Ct=!0);return g=1,H=!1,Ct||p.distanceToSquared(t.object.position)>m||8*(1-M.dot(t.object.quaternion))>m||U.distanceToSquared(t.target)>0?(t.dispatchEvent(oe),p.copy(t.object.position),M.copy(t.object.quaternion),U.copy(t.target),!0):!1}})(),this.dispose=function(){t.domElement.removeEventListener("contextmenu",Xt),t.domElement.removeEventListener("pointerdown",Zt),t.domElement.removeEventListener("pointercancel",at),t.domElement.removeEventListener("wheel",Bt),t.domElement.removeEventListener("pointermove",Tt),t.domElement.removeEventListener("pointerup",at),t._domElementKeyEvents!==null&&(t._domElementKeyEvents.removeEventListener("keydown",xt),t._domElementKeyEvents=null)};const t=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const m=1e-6,c=new qt,u=new qt;let g=1;const y=new P,v=new z,w=new z,x=new z,S=new z,T=new z,R=new z,N=new z,j=new z,k=new z,ht=new P,C=new z;let H=!1;const E=[],b={};function D(e){return e!==null?2*Math.PI/60*t.autoRotateSpeed*e:2*Math.PI/60/60*t.autoRotateSpeed}function F(e){const s=Math.abs(e)/(100*(window.devicePixelRatio|0));return Math.pow(.95,t.zoomSpeed*s)}function I(e){u.theta-=e}function dt(e){u.phi-=e}const Lt=(function(){const e=new P;return function(f,p){e.setFromMatrixColumn(p,0),e.multiplyScalar(-f),y.add(e)}})(),zt=(function(){const e=new P;return function(f,p){t.screenSpacePanning===!0?e.setFromMatrixColumn(p,1):(e.setFromMatrixColumn(p,0),e.crossVectors(t.object.up,e)),e.multiplyScalar(f),y.add(e)}})(),J=(function(){const e=new P;return function(f,p){const M=t.domElement;if(t.object.isPerspectiveCamera){const U=t.object.position;e.copy(U).sub(t.target);let L=e.length();L*=Math.tan(t.object.fov/2*Math.PI/180),Lt(2*f*L/M.clientHeight,t.object.matrix),zt(2*p*L/M.clientHeight,t.object.matrix)}else t.object.isOrthographicCamera?(Lt(f*(t.object.right-t.object.left)/t.object.zoom/M.clientWidth,t.object.matrix),zt(p*(t.object.top-t.object.bottom)/t.object.zoom/M.clientHeight,t.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),t.enablePan=!1)}})();function St(e){t.object.isPerspectiveCamera||t.object.isOrthographicCamera?g/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function Nt(e){t.object.isPerspectiveCamera||t.object.isOrthographicCamera?g*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function Mt(e,s){if(!t.zoomToCursor)return;H=!0;const f=t.domElement.getBoundingClientRect(),p=e-f.left,M=s-f.top,U=f.width,L=f.height;C.x=p/U*2-1,C.y=-(M/L)*2+1,ht.set(C.x,C.y,1).unproject(t.object).sub(t.object.position).normalize()}function Pt(e){return Math.max(t.minDistance,Math.min(t.maxDistance,e))}function jt(e){v.set(e.clientX,e.clientY)}function ge(e){Mt(e.clientX,e.clientX),N.set(e.clientX,e.clientY)}function It(e){S.set(e.clientX,e.clientY)}function ye(e){w.set(e.clientX,e.clientY),x.subVectors(w,v).multiplyScalar(t.rotateSpeed);const s=t.domElement;I(2*Math.PI*x.x/s.clientHeight),dt(2*Math.PI*x.y/s.clientHeight),v.copy(w),t.update()}function be(e){j.set(e.clientX,e.clientY),k.subVectors(j,N),k.y>0?St(F(k.y)):k.y<0&&Nt(F(k.y)),N.copy(j),t.update()}function we(e){T.set(e.clientX,e.clientY),R.subVectors(T,S).multiplyScalar(t.panSpeed),J(R.x,R.y),S.copy(T),t.update()}function Ee(e){Mt(e.clientX,e.clientY),e.deltaY<0?Nt(F(e.deltaY)):e.deltaY>0&&St(F(e.deltaY)),t.update()}function ve(e){let s=!1;switch(e.code){case t.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?dt(2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(0,t.keyPanSpeed),s=!0;break;case t.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?dt(-2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(0,-t.keyPanSpeed),s=!0;break;case t.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?I(2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(t.keyPanSpeed,0),s=!0;break;case t.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?I(-2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(-t.keyPanSpeed,0),s=!0;break}s&&(e.preventDefault(),t.update())}function _t(e){if(E.length===1)v.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);v.set(f,p)}}function Ht(e){if(E.length===1)S.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);S.set(f,p)}}function Ft(e){const s=$(e),f=e.pageX-s.x,p=e.pageY-s.y,M=Math.sqrt(f*f+p*p);N.set(0,M)}function Se(e){t.enableZoom&&Ft(e),t.enablePan&&Ht(e)}function Me(e){t.enableZoom&&Ft(e),t.enableRotate&&_t(e)}function Yt(e){if(E.length==1)w.set(e.pageX,e.pageY);else{const f=$(e),p=.5*(e.pageX+f.x),M=.5*(e.pageY+f.y);w.set(p,M)}x.subVectors(w,v).multiplyScalar(t.rotateSpeed);const s=t.domElement;I(2*Math.PI*x.x/s.clientHeight),dt(2*Math.PI*x.y/s.clientHeight),v.copy(w)}function Kt(e){if(E.length===1)T.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);T.set(f,p)}R.subVectors(T,S).multiplyScalar(t.panSpeed),J(R.x,R.y),S.copy(T)}function Ut(e){const s=$(e),f=e.pageX-s.x,p=e.pageY-s.y,M=Math.sqrt(f*f+p*p);j.set(0,M),k.set(0,Math.pow(j.y/N.y,t.zoomSpeed)),St(k.y),N.copy(j);const U=(e.pageX+s.x)*.5,L=(e.pageY+s.y)*.5;Mt(U,L)}function Pe(e){t.enableZoom&&Ut(e),t.enablePan&&Kt(e)}function Te(e){t.enableZoom&&Ut(e),t.enableRotate&&Yt(e)}function Zt(e){t.enabled!==!1&&(E.length===0&&(t.domElement.setPointerCapture(e.pointerId),t.domElement.addEventListener("pointermove",Tt),t.domElement.addEventListener("pointerup",at)),Oe(e),e.pointerType==="touch"?De(e):xe(e))}function Tt(e){t.enabled!==!1&&(e.pointerType==="touch"?Ae(e):Ce(e))}function at(e){Re(e),E.length===0&&(t.domElement.releasePointerCapture(e.pointerId),t.domElement.removeEventListener("pointermove",Tt),t.domElement.removeEventListener("pointerup",at)),t.dispatchEvent(ne),r=i.NONE}function xe(e){let s;switch(e.button){case 0:s=t.mouseButtons.LEFT;break;case 1:s=t.mouseButtons.MIDDLE;break;case 2:s=t.mouseButtons.RIGHT;break;default:s=-1}switch(s){case Q.DOLLY:if(t.enableZoom===!1)return;ge(e),r=i.DOLLY;break;case Q.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(t.enablePan===!1)return;It(e),r=i.PAN}else{if(t.enableRotate===!1)return;jt(e),r=i.ROTATE}break;case Q.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(t.enableRotate===!1)return;jt(e),r=i.ROTATE}else{if(t.enablePan===!1)return;It(e),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Dt)}function Ce(e){switch(r){case i.ROTATE:if(t.enableRotate===!1)return;ye(e);break;case i.DOLLY:if(t.enableZoom===!1)return;be(e);break;case i.PAN:if(t.enablePan===!1)return;we(e);break}}function Bt(e){t.enabled===!1||t.enableZoom===!1||r!==i.NONE||(e.preventDefault(),t.dispatchEvent(Dt),Ee(e),t.dispatchEvent(ne))}function xt(e){t.enabled===!1||t.enablePan===!1||ve(e)}function De(e){switch(Gt(e),E.length){case 1:switch(t.touches.ONE){case tt.ROTATE:if(t.enableRotate===!1)return;_t(e),r=i.TOUCH_ROTATE;break;case tt.PAN:if(t.enablePan===!1)return;Ht(e),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(t.touches.TWO){case tt.DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;Se(e),r=i.TOUCH_DOLLY_PAN;break;case tt.DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;Me(e),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Dt)}function Ae(e){switch(Gt(e),r){case i.TOUCH_ROTATE:if(t.enableRotate===!1)return;Yt(e),t.update();break;case i.TOUCH_PAN:if(t.enablePan===!1)return;Kt(e),t.update();break;case i.TOUCH_DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;Pe(e),t.update();break;case i.TOUCH_DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;Te(e),t.update();break;default:r=i.NONE}}function Xt(e){t.enabled!==!1&&e.preventDefault()}function Oe(e){E.push(e.pointerId)}function Re(e){delete b[e.pointerId];for(let s=0;s<E.length;s++)if(E[s]==e.pointerId){E.splice(s,1);return}}function Gt(e){let s=b[e.pointerId];s===void 0&&(s=new z,b[e.pointerId]=s),s.set(e.pageX,e.pageY)}function $(e){const s=e.pointerId===E[0]?E[1]:E[0];return b[s]}t.domElement.addEventListener("contextmenu",Xt),t.domElement.addEventListener("pointerdown",Zt),t.domElement.addEventListener("pointercancel",at),t.domElement.addEventListener("wheel",Bt,{passive:!1}),this.update()}}const X=new Be({antialias:!At,powerPreference:At?"low-power":"high-performance"});X.setPixelRatio(Math.min(devicePixelRatio,Le));X.setSize(innerWidth,innerHeight);X.shadowMap.enabled=!0;X.shadowMap.type=We;X.outputColorSpace=Ve;document.getElementById("app").appendChild(X.domElement);const q=new Xe;q.fog=new qe(_.fog,780,1600);const Rt=new Ue(43,innerWidth/innerHeight,.5,4e3);Rt.position.set(-225,225,320);const G=new bo(Rt,X.domElement);G.target.set(80,13,8);G.enableDamping=!0;G.dampingFactor=.075;G.maxPolarAngle=1.45;G.minDistance=At?12:40;G.maxDistance=950;G.panSpeed=.85;const fe=new Ge;q.add(fe);const pe=new Ze(_.hemi.sky,_.hemi.ground,_.hemi.intensity);q.add(pe);const O=new ie(_.sun.color,_.sun.intensity);O.position.fromArray(_.sun.position);O.castShadow=!0;O.shadow.mapSize.set(Vt,Vt);O.shadow.camera.left=-400;O.shadow.camera.right=400;O.shadow.camera.top=400;O.shadow.camera.bottom=-400;O.shadow.camera.near=1;O.shadow.camera.far=1e3;O.shadow.bias=-35e-5;O.shadow.normalBias=.2;q.add(O);const kt=new ie(_.fill.color,_.fill.intensity);kt.position.set(120,90,-120);q.add(kt);const ut=new gt;ut.name="solar-atmosphere";ut.scale.setScalar(3e3);const A=ut.material;A.uniforms.nightBlend={value:0};A.uniforms.horizonColor={value:new se(_.fog)};A.uniforms.daylight={value:1};A.uniforms.twilightStrength={value:0};for(const a of["twilightHorizon","twilightRose","twilightZenith"])A.uniforms[a]={value:new se};A.uniforms.turbidity.value=3.5;A.uniforms.rayleigh.value=1.8;A.uniforms.mieCoefficient.value=.003;A.uniforms.mieDirectionalG.value=.78;A.fragmentShader=`uniform float nightBlend;uniform float daylight;uniform vec3 horizonColor;uniform float twilightStrength;uniform vec3 twilightHorizon;uniform vec3 twilightRose;uniform vec3 twilightZenith;
`+A.fragmentShader;A.fragmentShader=A.fragmentShader.replace("gl_FragColor = vec4( retColor, 1.0 );",go);q.add(ut);const Ro=Object.freeze(Object.defineProperty({__proto__:null,camera:Rt,controls:G,fill:kt,hemi:pe,renderer:X,scene:q,sky:ut,sun:O,world:fe},Symbol.toStringTag,{value:"Module"}));export{Co as C,_ as D,Ao as R,Mo as S,Rt as a,Oo as b,G as c,po as d,O as e,kt as f,To as g,pe as h,ut as i,So as j,Po as k,Do as l,Ro as m,X as r,q as s,xo as t,fe as w};
