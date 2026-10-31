import{G as nt,M as Ne,S as qt}from"./gameQuality-7FNYzhuI.js";import{c as Ie,U as _e,a9 as je,X as He,e as Fe,V as M,aY as Ye,aZ as Q,a_ as tt,a$ as Jt,ag as $t,a as L,b0 as Ke,b1 as Ue,M as Ze,az as Be,J as se,b2 as Ge,b3 as Xe,aT as Ve,G as We,b4 as qe,a3 as Je,b5 as $e,C as re}from"./BufferGeometryUtils-CwP6Sgp-.js";const ot={x:17.3,y:2.3,z:55.1},ce=12,To=36,Qe=[3,6,8];class bt extends Ie{constructor(){const o=bt.SkyShader,n=new _e({name:o.name,uniforms:He.clone(o.uniforms),vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,side:je,depthWrite:!1});super(new Fe(1,1,1),n),this.isSky=!0}}bt.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new M},up:{value:new M(0,1,0)}},vertexShader:`
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

		}`};const{PI:B,sin:l,cos:h,tan:wt,asin:Et,atan2:at,acos:le,sqrt:to,abs:eo,round:ue,floor:oo}=Math,d=B/180,ut=1e3*60*60*24,de=2440588,lt=2451545,no=6378.14;function gt(a){return new Date((a+.5-de)*ut)}function vt(a){return a.valueOf()/ut-.5+de-lt}function ao(a){const o=2e3+a/365.2425;let n;return o<1920?(n=o-1900,-2.79+n*(1.494119+n*(-.0598939+n*(.0061966-n*197e-6)))):o<1941?(n=o-1920,21.2+n*(.84493+n*(-.0761+n*.0020936))):o<1961?(n=o-1950,29.07+n*(.407+n*(-1/233+n/2547))):o<1986?(n=o-1975,45.45+n*(1.067+n*(-1/260-n/718))):o<2005?(n=o-2e3,63.86+n*(.3345+n*(-.060374+n*(.0017275+n*(651814e-9+n*2373599e-11))))):o<2050?(n=o-2e3,62.92+n*(.32217+n*.005589)):(n=(o-1820)/100,-20+32*n*n-.5628*(2150-o))}function it(a){return a+ao(a)/86400}function he(a,o,n){return(at(l(a),h(a)*l(o)-wt(n)*h(o))/d+540)%360}function St(a,o,n){return Et(l(o)*l(n)+h(o)*h(n)*h(a))}function Mt(a,o){return d*(280.46061837+360.98564736629*a)-o}function me(a){return a<0&&(a=0),2967e-7/wt(a+.00312536/(a+.08901179))}function dt(a){const o=a/36525,n=d*(280.46646+o*(36000.76983+o*3032e-7)),t=d*(357.52911+o*(35999.05029-o*1537e-7)),i=l(t),r=h(t),m=d*((1.914602-o*(.004817+o*14e-6))*i+(.019993-101e-6*o)*2*i*r+289e-6*i*(3-4*i*i)),c=d*(125.04-1934.136*o),u=n+m-d*(.00569+.00478*l(c)),g=d*(23.439291-o*(.0130042+o*(16e-8-o*504e-9)))+d*.00256*h(c);return{ra:at(h(g)*l(u),h(u)),dec:Et(l(g)*l(u)),lon:u}}function io(a,o,n){const t=d*-135,i=d*o,r=vt(a),m=dt(it(r)),c=Mt(r,t)-m.ra,u=St(c,i,m.dec);return{azimuth:he(c,i,m.dec),altitude:(u+me(u))/d}}const Qt=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]],so=9e-4;function ro(a){return-2.076*to(a)/60}function fe(a){return a-2*B*ue(a/(2*B))}function co(a,o){for(let n=0;n<3;n++){const t=fe(Mt(a,o)-dt(it(a)).ra);a-=t/(2*B)}return a}function te(a,o,n,t,i,r){const m=(l(a)-l(i)*l(r))/(h(i)*h(r));if(m<-1||m>1)return NaN;let c=o+n*le(m)/(2*B);for(let u=0;u<2;u++){const g=dt(it(c)),y=fe(Mt(c,t)-g.ra),v=St(y,i,g.dec),w=h(i)*h(g.dec)*l(y);if(eo(w)<1e-6)break;c+=(v-a)/(2*B*w)}return c}function lo(a,o){const n=o*6e4;return oo((a.valueOf()+n)/ut)*ut-n}function uo(a,o,n){const t=lo(a,n)+ut/2,i=so+o/(2*B);return co(ue(vt(t)-i)+i,o)}function ho(a,o,n,t=0,i){const r=d*-135,m=d*o,c=ro(t),u=uo(a,r,i),g=dt(it(u)).dec,y={solarNoon:gt(u+lt),nadir:gt(u+lt-.5)};for(const[v,w,x]of Qt){const S=(v+c)*d,T=te(S,u,-1,r,m,g),R=te(S,u,1,r,m,g);y[w]=Number.isNaN(T)?null:gt(T+lt),y[x]=Number.isNaN(R)?null:gt(R+lt)}if(y.sunrise===null){const v=St(0,m,g),w=(Qt[0][0]+c)*d;y.alwaysUp=v>w,y.alwaysDown=v<=w}return y}function mo(a){const o=d*(125.04452-1934.136261*a),n=d*(280.4665+36000.7698*a),t=d*(218.3165+481267.8813*a),i=(-17.2*l(o)-1.32*l(2*n)-.23*l(2*t)+.21*l(2*o))/3600,r=(9.2*h(o)+.57*h(2*n)+.1*h(2*t)-.09*h(2*o))/3600,m=23.439291-a*(.0130042+a*(16e-8-a*504e-9));return{dpsi:i,eps:d*(m+r)}}const V=new Int32Array([0,0,1,0,6288774,-20905355,2,0,-1,0,1274027,-3699111,2,0,0,0,658314,-2955968,0,0,2,0,213618,-569925,0,1,0,0,-185116,48888,0,0,0,2,-114332,-3149,2,0,-2,0,58793,246158,2,-1,-1,0,57066,-152138,2,0,1,0,53322,-170733,2,-1,0,0,45758,-204586,0,1,-1,0,-40923,-129620,1,0,0,0,-34720,108743,0,1,1,0,-30383,104755,2,0,0,-2,15327,10321,0,0,1,2,-12528,0,0,0,1,-2,10980,79661,4,0,-1,0,10675,-34782,0,0,3,0,10034,-23210,4,0,-2,0,8548,-21636,2,1,-1,0,-7888,24208,2,1,0,0,-6766,30824,1,0,-1,0,-5163,-8379,1,1,0,0,4987,-16675,2,-1,1,0,4036,-12831,2,0,2,0,3994,-10445,4,0,0,0,3861,-11650,2,0,-3,0,3665,14403,0,1,-2,0,-2689,-7003,2,0,-1,2,-2602,0,2,-1,-2,0,2390,10056,1,0,1,0,-2348,6322,2,-2,0,0,2236,-9884,0,1,2,0,-2120,5751,0,2,0,0,-2069,0,2,-2,-1,0,2048,-4950,2,0,1,-2,-1773,4130,2,0,0,2,-1595,0,4,-1,-1,0,1215,-3958,0,0,2,2,-1110,0,3,0,-1,0,-892,3258,2,1,1,0,-810,2616,4,-1,-2,0,759,-1897,0,2,-1,0,-713,-2117,2,2,-1,0,-700,2354,2,1,-2,0,691,0,2,-1,0,-2,596,0,4,0,1,0,549,-1423,0,0,4,0,537,-1117,4,-1,0,0,520,-1571,1,0,-2,0,-487,-1739,2,1,0,-2,-399,0,0,0,2,-2,-381,-4421,1,1,1,0,351,0,3,0,-2,0,-340,0,4,0,-3,0,330,0,2,-1,2,0,327,0,0,2,1,0,-323,1165,1,1,-1,0,299,0,2,0,3,0,294,0,2,0,-1,-2,0,8752]),et=new Int32Array([0,0,0,1,5128122,0,0,1,1,280602,0,0,1,-1,277693,2,0,0,-1,173237,2,0,-1,1,55413,2,0,-1,-1,46271,2,0,0,1,32573,0,0,2,1,17198,2,0,1,-1,9266,0,0,2,-1,8822,2,-1,0,-1,8216,2,0,-2,-1,4324,2,0,1,1,4200,2,1,0,-1,-3359,2,-1,-1,1,2463,2,-1,0,1,2211,2,-1,-1,-1,2065,0,1,-1,-1,-1870,4,0,-1,-1,1828,0,1,0,1,-1794,0,0,0,3,-1749,0,1,-1,1,-1565,1,0,0,1,-1491,0,1,1,1,-1475,0,1,1,-1,-1410,0,1,0,-1,-1344,1,0,0,-1,-1335,0,0,3,1,1107,4,0,0,-1,1021,4,0,-1,1,833,0,0,1,-3,777,4,0,-2,1,671,2,0,0,-3,607,2,0,2,-1,596,2,-1,1,-1,491,2,0,-2,1,-451,0,0,3,-1,439,2,0,2,1,422,2,0,-3,-1,421,2,1,-1,1,-366,2,1,0,1,-351,4,0,0,1,331,2,-1,1,1,315,2,-2,0,-1,302,0,0,1,3,-283,2,1,1,-1,-229,1,1,0,-1,223,1,1,0,1,223,0,1,-2,-1,-220,2,1,-1,-1,-220,1,0,1,1,-185,2,-1,-2,-1,181,0,1,2,1,-177,4,0,-2,-1,176,4,-1,-1,-1,166,1,0,1,-1,-164,4,0,1,-1,132,1,0,-1,-1,-119,4,-1,0,-1,115,2,-2,0,1,107]);function pe(a){const o=a/36525,n=218.3164477+o*(481267.88123421+o*(-.0015786+o*(1/538841-o/65194e3))),t=297.8501921+o*(445267.1114034+o*(-.0018819+o*(1/545868-o/113065e3))),i=357.5291092+o*(35999.0502909+o*(-1536e-7+o/2449e4)),r=134.9633964+o*(477198.8675055+o*(.0087414+o*(1/69699-o/14712e3))),m=93.272095+o*(483202.0175233+o*(-.0036539+o*(-1/3526e3+o/86331e4))),c=119.75+131.849*o,u=53.09+479264.29*o,g=313.45+481266.484*o,y=1-o*(.002516+o*74e-7),v=d*t,w=d*i,x=d*r,S=d*m;let T=0,R=0,N=0;for(let b=0;b<V.length;b+=6){const C=V[b+1],F=V[b]*v+C*w+V[b+2]*x+V[b+3]*S,_=C===1||C===-1?y:C===2||C===-2?y*y:1;T+=V[b+4]*_*l(F),R+=V[b+5]*_*h(F)}for(let b=0;b<et.length;b+=5){const C=et[b+1],F=et[b]*v+C*w+et[b+2]*x+et[b+3]*S,_=C===1||C===-1?y:C===2||C===-2?y*y:1;N+=et[b+4]*_*l(F)}const I=d*c,k=d*n;T+=3958*l(I)+1962*l(k-S)+318*l(d*u),N+=-2235*l(k)+382*l(d*g)+175*l(I-S)+175*l(I+S)+127*l(k-x)-115*l(k+x);const{dpsi:mt,eps:A}=mo(o),H=d*(n+T/1e6+mt),E=d*(N/1e6);return{ra:at(l(H)*h(A)-wt(E)*l(A),h(H)),dec:Et(l(E)*h(A)+h(E)*l(A)*l(H)),dist:385000.56+R/1e3,lon:H}}function fo(a,o,n){const t=d*-135,i=d*o,r=vt(a),m=pe(it(r)),c=Mt(r,t)-m.ra,u=St(c,i,m.dec),g=u-Et(no/m.dist*h(u)),y=at(l(c),wt(i)*h(m.dec)-l(m.dec)*h(c));return{azimuth:he(c,i,m.dec),altitude:(g+me(g))/d,distance:m.dist,parallacticAngle:y/d}}function po(a=new Date){const o=it(vt(a)),n=dt(o),t=pe(o),i=149598e3,r=le(l(n.dec)*l(t.dec)+h(n.dec)*h(t.dec)*h(n.ra-t.ra)),m=at(i*l(r),t.dist-i*h(r)),c=at(h(n.dec)*l(n.ra-t.ra),l(n.dec)*h(t.dec)-h(n.dec)*l(t.dec)*h(n.ra-t.ra)),u=((t.lon-n.lon)/(2*B)%1+1)%1,g=u<.5;return{fraction:(1+h(m))/2,phase:u,angle:c/d,waxing:g}}const W={latitude:34,longitude:135,utcOffsetMinutes:540},go="2026-09-22",yo=[1,60,360,1440],kt=Math.PI/180;function Z(a,o,n){const t=Math.max(0,Math.min(1,(n-a)/(o-a)));return t*t*(3-2*t)}function ee(a,o){const n=a*kt,t=o*kt;return[Math.cos(n)*Math.sin(t),Math.sin(n),-Math.cos(n)*Math.cos(t)]}function bo(a){const o=new Date(a+W.utcOffsetMinutes*6e4);return{date:o.toISOString().slice(0,10),minutes:o.getUTCHours()*60+o.getUTCMinutes()+o.getUTCSeconds()/60}}function oe(a,o){if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!Number.isFinite(o)||o<0||o>=1440)throw Error("日期或时间无效");const n=Date.parse(a+"T00:00:00Z");if(!Number.isFinite(n)||new Date(n).toISOString().slice(0,10)!==a)throw Error("日期无效");return n-W.utcOffsetMinutes*6e4+o*6e4}function xo(a){const o=Math.floor(bo(a).minutes);return`${String(Math.floor(o/60)).padStart(2,"0")}:${String(o%60).padStart(2,"0")}`}class Ao{timestamp=oe(go,600);speed=360;playing=!0;advance(o){return this.playing&&Number.isFinite(o)&&o>0&&(this.timestamp+=o*this.speed*1e3),this.timestamp}seek(o,n){this.timestamp=oe(o,n)}setSpeed(o){if(!yo.includes(o))throw Error("不支持的速度");this.speed=o}}function Co(a){return ho(new Date(a),W.latitude,W.longitude,0,W.utcOffsetMinutes)}function Do(a){const o=new Date(a),n=io(o,W.latitude),t=fo(o,W.latitude),i=po(o),r=Z(-6,12,n.altitude),m=1-Z(-9,1,n.altitude),c=(1-Z(5,28,n.altitude))*Z(-4,2,n.altitude),u=Z(0,4,n.altitude)*(.55+1.25*Math.sqrt(Math.max(0,Math.sin(n.altitude*kt))));return{sun:n,moon:t,sunDirection:ee(n.altitude,n.azimuth),moonDirection:ee(t.altitude,t.azimuth),moonFraction:i.fraction,daylight:r,night:m,warm:c,direct:u,moonVisibility:Z(-1,4,t.altitude),phase:n.altitude<-9?"深夜":n.altitude<-1?"曙暮光":n.altitude<10?n.azimuth<180?"日出":"日落":n.altitude<25?"晨昏":"白天"}}function Oo(a,o){const n=Z(-12,-3,a)*(1-Z(3,20,a)),t=o>=180?1:0;return{glow:n,dusk:t,horizon:t?16748629:16757886,rose:t?15555719:16223914,zenith:t?5327764:8162247,sunlight:t?16756071:16765594,cloud:t?16749963:16758958}}const wo=`
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
 gl_FragColor=vec4(skyColor,1.0);`,j={sun:{color:16775407,intensity:2.5,position:[-190,300,155]},hemi:{sky:12903679,ground:10926287,intensity:.7},fill:{color:11916799,intensity:.22},fog:12378871},Ro={sand:16769966,wetSand:14134649,grass:7914576,hill:5742424,ridge:7977067,rock:12959134,quay:15458503},ko={shallow:"#48d6c7",deep:"#1053a4"},zo={seafoam:7198916,apricot:16430467,coral:15827549,lavender:10971863,magenta:14960537,cobalt:1466030};function Lo(a){const o=(n,t,i)=>{const r=Math.max(0,Math.min(1,(i-n)/(t-n)));return r*r*(3-2*r)};return o(-196,-168,a)*(1-o(160,196,a))*(9.5+3.5*Math.sin(a*.026)+1.5*Math.cos(a*.063))*(1-Math.exp(-Math.pow((a-98)/17,2)))}const ne={type:"change"},Rt={type:"start"},ae={type:"end"},yt=new Ke,ie=new Ue,Eo=Math.cos(70*Ze.DEG2RAD);class vo extends Ye{constructor(o,n){super(),this.object=o,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new M,this.cursor=new M,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Q.ROTATE,MIDDLE:Q.DOLLY,RIGHT:Q.PAN},this.touches={ONE:tt.ROTATE,TWO:tt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return c.phi},this.getAzimuthalAngle=function(){return c.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(e){e.addEventListener("keydown",Dt),this._domElementKeyEvents=e},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Dt),this._domElementKeyEvents=null},this.saveState=function(){t.target0.copy(t.target),t.position0.copy(t.object.position),t.zoom0=t.object.zoom},this.reset=function(){t.target.copy(t.target0),t.object.position.copy(t.position0),t.object.zoom=t.zoom0,t.object.updateProjectionMatrix(),t.dispatchEvent(ne),t.update(),r=i.NONE},this.update=(function(){const e=new M,s=new $t().setFromUnitVectors(o.up,new M(0,1,0)),f=s.clone().invert(),p=new M,P=new $t,U=new M,z=2*Math.PI;return function(Le=null){const Wt=t.object.position;e.copy(Wt).sub(t.target),e.applyQuaternion(s),c.setFromVector3(e),t.autoRotate&&r===i.NONE&&_(C(Le)),t.enableDamping?(c.theta+=u.theta*t.dampingFactor,c.phi+=u.phi*t.dampingFactor):(c.theta+=u.theta,c.phi+=u.phi);let Y=t.minAzimuthAngle,K=t.maxAzimuthAngle;isFinite(Y)&&isFinite(K)&&(Y<-Math.PI?Y+=z:Y>Math.PI&&(Y-=z),K<-Math.PI?K+=z:K>Math.PI&&(K-=z),Y<=K?c.theta=Math.max(Y,Math.min(K,c.theta)):c.theta=c.theta>(Y+K)/2?Math.max(Y,c.theta):Math.min(K,c.theta)),c.phi=Math.max(t.minPolarAngle,Math.min(t.maxPolarAngle,c.phi)),c.makeSafe(),t.enableDamping===!0?t.target.addScaledVector(y,t.dampingFactor):t.target.add(y),t.target.sub(t.cursor),t.target.clampLength(t.minTargetRadius,t.maxTargetRadius),t.target.add(t.cursor),t.zoomToCursor&&H||t.object.isOrthographicCamera?c.radius=At(c.radius):c.radius=At(c.radius*g),e.setFromSpherical(c),e.applyQuaternion(f),Wt.copy(t.target).add(e),t.object.lookAt(t.target),t.enableDamping===!0?(u.theta*=1-t.dampingFactor,u.phi*=1-t.dampingFactor,y.multiplyScalar(1-t.dampingFactor)):(u.set(0,0,0),y.set(0,0,0));let Ot=!1;if(t.zoomToCursor&&H){let rt=null;if(t.object.isPerspectiveCamera){const ct=e.length();rt=At(ct*g);const pt=ct-rt;t.object.position.addScaledVector(mt,pt),t.object.updateMatrixWorld()}else if(t.object.isOrthographicCamera){const ct=new M(A.x,A.y,0);ct.unproject(t.object),t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/g)),t.object.updateProjectionMatrix(),Ot=!0;const pt=new M(A.x,A.y,0);pt.unproject(t.object),t.object.position.sub(pt).add(ct),t.object.updateMatrixWorld(),rt=e.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),t.zoomToCursor=!1;rt!==null&&(this.screenSpacePanning?t.target.set(0,0,-1).transformDirection(t.object.matrix).multiplyScalar(rt).add(t.object.position):(yt.origin.copy(t.object.position),yt.direction.set(0,0,-1).transformDirection(t.object.matrix),Math.abs(t.object.up.dot(yt.direction))<Eo?o.lookAt(t.target):(ie.setFromNormalAndCoplanarPoint(t.object.up,t.target),yt.intersectPlane(ie,t.target))))}else t.object.isOrthographicCamera&&(t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/g)),t.object.updateProjectionMatrix(),Ot=!0);return g=1,H=!1,Ot||p.distanceToSquared(t.object.position)>m||8*(1-P.dot(t.object.quaternion))>m||U.distanceToSquared(t.target)>0?(t.dispatchEvent(ne),p.copy(t.object.position),P.copy(t.object.quaternion),U.copy(t.target),!0):!1}})(),this.dispose=function(){t.domElement.removeEventListener("contextmenu",Xt),t.domElement.removeEventListener("pointerdown",Bt),t.domElement.removeEventListener("pointercancel",st),t.domElement.removeEventListener("wheel",Gt),t.domElement.removeEventListener("pointermove",Ct),t.domElement.removeEventListener("pointerup",st),t._domElementKeyEvents!==null&&(t._domElementKeyEvents.removeEventListener("keydown",Dt),t._domElementKeyEvents=null)};const t=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const m=1e-6,c=new Jt,u=new Jt;let g=1;const y=new M,v=new L,w=new L,x=new L,S=new L,T=new L,R=new L,N=new L,I=new L,k=new L,mt=new M,A=new L;let H=!1;const E=[],b={};function C(e){return e!==null?2*Math.PI/60*t.autoRotateSpeed*e:2*Math.PI/60/60*t.autoRotateSpeed}function F(e){const s=Math.abs(e)/(100*(window.devicePixelRatio|0));return Math.pow(.95,t.zoomSpeed*s)}function _(e){u.theta-=e}function ft(e){u.phi-=e}const Lt=(function(){const e=new M;return function(f,p){e.setFromMatrixColumn(p,0),e.multiplyScalar(-f),y.add(e)}})(),Nt=(function(){const e=new M;return function(f,p){t.screenSpacePanning===!0?e.setFromMatrixColumn(p,1):(e.setFromMatrixColumn(p,0),e.crossVectors(t.object.up,e)),e.multiplyScalar(f),y.add(e)}})(),J=(function(){const e=new M;return function(f,p){const P=t.domElement;if(t.object.isPerspectiveCamera){const U=t.object.position;e.copy(U).sub(t.target);let z=e.length();z*=Math.tan(t.object.fov/2*Math.PI/180),Lt(2*f*z/P.clientHeight,t.object.matrix),Nt(2*p*z/P.clientHeight,t.object.matrix)}else t.object.isOrthographicCamera?(Lt(f*(t.object.right-t.object.left)/t.object.zoom/P.clientWidth,t.object.matrix),Nt(p*(t.object.top-t.object.bottom)/t.object.zoom/P.clientHeight,t.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),t.enablePan=!1)}})();function Tt(e){t.object.isPerspectiveCamera||t.object.isOrthographicCamera?g/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function It(e){t.object.isPerspectiveCamera||t.object.isOrthographicCamera?g*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function xt(e,s){if(!t.zoomToCursor)return;H=!0;const f=t.domElement.getBoundingClientRect(),p=e-f.left,P=s-f.top,U=f.width,z=f.height;A.x=p/U*2-1,A.y=-(P/z)*2+1,mt.set(A.x,A.y,1).unproject(t.object).sub(t.object.position).normalize()}function At(e){return Math.max(t.minDistance,Math.min(t.maxDistance,e))}function _t(e){v.set(e.clientX,e.clientY)}function be(e){xt(e.clientX,e.clientX),N.set(e.clientX,e.clientY)}function jt(e){S.set(e.clientX,e.clientY)}function we(e){w.set(e.clientX,e.clientY),x.subVectors(w,v).multiplyScalar(t.rotateSpeed);const s=t.domElement;_(2*Math.PI*x.x/s.clientHeight),ft(2*Math.PI*x.y/s.clientHeight),v.copy(w),t.update()}function Ee(e){I.set(e.clientX,e.clientY),k.subVectors(I,N),k.y>0?Tt(F(k.y)):k.y<0&&It(F(k.y)),N.copy(I),t.update()}function ve(e){T.set(e.clientX,e.clientY),R.subVectors(T,S).multiplyScalar(t.panSpeed),J(R.x,R.y),S.copy(T),t.update()}function Se(e){xt(e.clientX,e.clientY),e.deltaY<0?It(F(e.deltaY)):e.deltaY>0&&Tt(F(e.deltaY)),t.update()}function Me(e){let s=!1;switch(e.code){case t.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?ft(2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(0,t.keyPanSpeed),s=!0;break;case t.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?ft(-2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(0,-t.keyPanSpeed),s=!0;break;case t.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?_(2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(t.keyPanSpeed,0),s=!0;break;case t.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?_(-2*Math.PI*t.rotateSpeed/t.domElement.clientHeight):J(-t.keyPanSpeed,0),s=!0;break}s&&(e.preventDefault(),t.update())}function Ht(e){if(E.length===1)v.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);v.set(f,p)}}function Ft(e){if(E.length===1)S.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);S.set(f,p)}}function Yt(e){const s=$(e),f=e.pageX-s.x,p=e.pageY-s.y,P=Math.sqrt(f*f+p*p);N.set(0,P)}function Pe(e){t.enableZoom&&Yt(e),t.enablePan&&Ft(e)}function Te(e){t.enableZoom&&Yt(e),t.enableRotate&&Ht(e)}function Kt(e){if(E.length==1)w.set(e.pageX,e.pageY);else{const f=$(e),p=.5*(e.pageX+f.x),P=.5*(e.pageY+f.y);w.set(p,P)}x.subVectors(w,v).multiplyScalar(t.rotateSpeed);const s=t.domElement;_(2*Math.PI*x.x/s.clientHeight),ft(2*Math.PI*x.y/s.clientHeight),v.copy(w)}function Ut(e){if(E.length===1)T.set(e.pageX,e.pageY);else{const s=$(e),f=.5*(e.pageX+s.x),p=.5*(e.pageY+s.y);T.set(f,p)}R.subVectors(T,S).multiplyScalar(t.panSpeed),J(R.x,R.y),S.copy(T)}function Zt(e){const s=$(e),f=e.pageX-s.x,p=e.pageY-s.y,P=Math.sqrt(f*f+p*p);I.set(0,P),k.set(0,Math.pow(I.y/N.y,t.zoomSpeed)),Tt(k.y),N.copy(I);const U=(e.pageX+s.x)*.5,z=(e.pageY+s.y)*.5;xt(U,z)}function xe(e){t.enableZoom&&Zt(e),t.enablePan&&Ut(e)}function Ae(e){t.enableZoom&&Zt(e),t.enableRotate&&Kt(e)}function Bt(e){t.enabled!==!1&&(E.length===0&&(t.domElement.setPointerCapture(e.pointerId),t.domElement.addEventListener("pointermove",Ct),t.domElement.addEventListener("pointerup",st)),ke(e),e.pointerType==="touch"?Oe(e):Ce(e))}function Ct(e){t.enabled!==!1&&(e.pointerType==="touch"?Re(e):De(e))}function st(e){ze(e),E.length===0&&(t.domElement.releasePointerCapture(e.pointerId),t.domElement.removeEventListener("pointermove",Ct),t.domElement.removeEventListener("pointerup",st)),t.dispatchEvent(ae),r=i.NONE}function Ce(e){let s;switch(e.button){case 0:s=t.mouseButtons.LEFT;break;case 1:s=t.mouseButtons.MIDDLE;break;case 2:s=t.mouseButtons.RIGHT;break;default:s=-1}switch(s){case Q.DOLLY:if(t.enableZoom===!1)return;be(e),r=i.DOLLY;break;case Q.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(t.enablePan===!1)return;jt(e),r=i.PAN}else{if(t.enableRotate===!1)return;_t(e),r=i.ROTATE}break;case Q.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(t.enableRotate===!1)return;_t(e),r=i.ROTATE}else{if(t.enablePan===!1)return;jt(e),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Rt)}function De(e){switch(r){case i.ROTATE:if(t.enableRotate===!1)return;we(e);break;case i.DOLLY:if(t.enableZoom===!1)return;Ee(e);break;case i.PAN:if(t.enablePan===!1)return;ve(e);break}}function Gt(e){t.enabled===!1||t.enableZoom===!1||r!==i.NONE||(e.preventDefault(),t.dispatchEvent(Rt),Se(e),t.dispatchEvent(ae))}function Dt(e){t.enabled===!1||t.enablePan===!1||Me(e)}function Oe(e){switch(Vt(e),E.length){case 1:switch(t.touches.ONE){case tt.ROTATE:if(t.enableRotate===!1)return;Ht(e),r=i.TOUCH_ROTATE;break;case tt.PAN:if(t.enablePan===!1)return;Ft(e),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(t.touches.TWO){case tt.DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;Pe(e),r=i.TOUCH_DOLLY_PAN;break;case tt.DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;Te(e),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Rt)}function Re(e){switch(Vt(e),r){case i.TOUCH_ROTATE:if(t.enableRotate===!1)return;Kt(e),t.update();break;case i.TOUCH_PAN:if(t.enablePan===!1)return;Ut(e),t.update();break;case i.TOUCH_DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;xe(e),t.update();break;case i.TOUCH_DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;Ae(e),t.update();break;default:r=i.NONE}}function Xt(e){t.enabled!==!1&&e.preventDefault()}function ke(e){E.push(e.pointerId)}function ze(e){delete b[e.pointerId];for(let s=0;s<E.length;s++)if(E[s]==e.pointerId){E.splice(s,1);return}}function Vt(e){let s=b[e.pointerId];s===void 0&&(s=new L,b[e.pointerId]=s),s.set(e.pageX,e.pageY)}function $(e){const s=e.pointerId===E[0]?E[1]:E[0];return b[s]}t.domElement.addEventListener("contextmenu",Xt),t.domElement.addEventListener("pointerdown",Bt),t.domElement.addEventListener("pointercancel",st),t.domElement.addEventListener("wheel",Gt,{passive:!1}),this.update()}}const G=new Xe({antialias:!nt,powerPreference:nt?"low-power":"high-performance"});G.setPixelRatio(Math.min(devicePixelRatio,Ne));G.setSize(innerWidth,innerHeight);G.shadowMap.enabled=!0;G.shadowMap.type=qe;G.outputColorSpace=Je;document.getElementById("app").appendChild(G.domElement);const q=new Ve;q.fog=new $e(j.fog,780,1600);const Pt=new Be(43,innerWidth/innerHeight,.5,4e3);Pt.position.set(-225,225,320);nt&&Pt.position.set(ot.x,ot.y+1.2,ot.z).addScaledVector(new M(...Qe).normalize(),ce);const X=new vo(Pt,G.domElement);X.target.fromArray(nt?[ot.x,ot.y+1.2,ot.z]:[80,13,8]);X.enableDamping=!0;X.dampingFactor=.075;X.maxPolarAngle=1.45;X.minDistance=nt?ce:40;X.maxDistance=nt?120:950;X.panSpeed=.85;const ge=new We;q.add(ge);const ye=new Ge(j.hemi.sky,j.hemi.ground,j.hemi.intensity);q.add(ye);const O=new se(j.sun.color,j.sun.intensity);O.position.fromArray(j.sun.position);O.castShadow=!0;O.shadow.mapSize.set(qt,qt);O.shadow.camera.left=-400;O.shadow.camera.right=400;O.shadow.camera.top=400;O.shadow.camera.bottom=-400;O.shadow.camera.near=1;O.shadow.camera.far=1e3;O.shadow.bias=-35e-5;O.shadow.normalBias=.2;q.add(O);const zt=new se(j.fill.color,j.fill.intensity);zt.position.set(120,90,-120);q.add(zt);const ht=new bt;ht.name="solar-atmosphere";ht.scale.setScalar(3e3);const D=ht.material;D.uniforms.nightBlend={value:0};D.uniforms.horizonColor={value:new re(j.fog)};D.uniforms.daylight={value:1};D.uniforms.twilightStrength={value:0};for(const a of["twilightHorizon","twilightRose","twilightZenith"])D.uniforms[a]={value:new re};D.uniforms.turbidity.value=3.5;D.uniforms.rayleigh.value=1.8;D.uniforms.mieCoefficient.value=.003;D.uniforms.mieDirectionalG.value=.78;D.fragmentShader=`uniform float nightBlend;uniform float daylight;uniform vec3 horizonColor;uniform float twilightStrength;uniform vec3 twilightHorizon;uniform vec3 twilightRose;uniform vec3 twilightZenith;
`+D.fragmentShader;D.fragmentShader=D.fragmentShader.replace("gl_FragColor = vec4( retColor, 1.0 );",wo);q.add(ht);const No=Object.freeze(Object.defineProperty({__proto__:null,camera:Pt,controls:X,fill:zt,hemi:ye,renderer:G,scene:q,sky:ht,sun:O,world:ge},Symbol.toStringTag,{value:"Module"}));export{Ro as C,j as D,ot as G,zo as R,Ao as S,Pt as a,Lo as b,X as c,bo as d,O as e,zt as f,Do as g,ye as h,ht as i,xo as j,Co as k,ko as l,Qe as m,ce as n,To as o,No as p,G as r,q as s,Oo as t,ge as w};
