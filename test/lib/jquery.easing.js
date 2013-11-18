/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright (c) 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(B,C,A,E,D){return jQuery.easing[jQuery.easing.def](B,C,A,E,D)},easeInQuad:function(B,C,A,E,D){return E*(C/=D)*C+A},easeOutQuad:function(B,C,A,E,D){return -E*(C/=D)*(C-2)+A},easeInOutQuad:function(B,C,A,E,D){if((C/=D/2)<1){return E/2*C*C+A}return -E/2*((--C)*(C-2)-1)+A},easeInCubic:function(B,C,A,E,D){return E*(C/=D)*C*C+A},easeOutCubic:function(B,C,A,E,D){return E*((C=C/D-1)*C*C+1)+A},easeInOutCubic:function(B,C,A,E,D){if((C/=D/2)<1){return E/2*C*C*C+A}return E/2*((C-=2)*C*C+2)+A},easeInQuart:function(B,C,A,E,D){return E*(C/=D)*C*C*C+A},easeOutQuart:function(B,C,A,E,D){return -E*((C=C/D-1)*C*C*C-1)+A},easeInOutQuart:function(B,C,A,E,D){if((C/=D/2)<1){return E/2*C*C*C*C+A}return -E/2*((C-=2)*C*C*C-2)+A},easeInQuint:function(B,C,A,E,D){return E*(C/=D)*C*C*C*C+A},easeOutQuint:function(B,C,A,E,D){return E*((C=C/D-1)*C*C*C*C+1)+A},easeInOutQuint:function(B,C,A,E,D){if((C/=D/2)<1){return E/2*C*C*C*C*C+A}return E/2*((C-=2)*C*C*C*C+2)+A},easeInSine:function(B,C,A,E,D){return -E*Math.cos(C/D*(Math.PI/2))+E+A},easeOutSine:function(B,C,A,E,D){return E*Math.sin(C/D*(Math.PI/2))+A},easeInOutSine:function(B,C,A,E,D){return -E/2*(Math.cos(Math.PI*C/D)-1)+A},easeInExpo:function(B,C,A,E,D){return(C==0)?A:E*Math.pow(2,10*(C/D-1))+A},easeOutExpo:function(B,C,A,E,D){return(C==D)?A+E:E*(-Math.pow(2,-10*C/D)+1)+A},easeInOutExpo:function(B,C,A,E,D){if(C==0){return A}if(C==D){return A+E}if((C/=D/2)<1){return E/2*Math.pow(2,10*(C-1))+A}return E/2*(-Math.pow(2,-10*--C)+2)+A},easeInCirc:function(B,C,A,E,D){return -E*(Math.sqrt(1-(C/=D)*C)-1)+A},easeOutCirc:function(B,C,A,E,D){return E*Math.sqrt(1-(C=C/D-1)*C)+A},easeInOutCirc:function(B,C,A,E,D){if((C/=D/2)<1){return -E/2*(Math.sqrt(1-C*C)-1)+A}return E/2*(Math.sqrt(1-(C-=2)*C)+1)+A},easeInElastic:function(B,D,A,H,G){var E=1.70158;var F=0;var C=H;if(D==0){return A}if((D/=G)==1){return A+H}if(!F){F=G*0.3}if(C<Math.abs(H)){C=H;var E=F/4}else{var E=F/(2*Math.PI)*Math.asin(H/C)}return -(C*Math.pow(2,10*(D-=1))*Math.sin((D*G-E)*(2*Math.PI)/F))+A},easeOutElastic:function(B,D,A,H,G){var E=1.70158;var F=0;var C=H;if(D==0){return A}if((D/=G)==1){return A+H}if(!F){F=G*0.3}if(C<Math.abs(H)){C=H;var E=F/4}else{var E=F/(2*Math.PI)*Math.asin(H/C)}return C*Math.pow(2,-10*D)*Math.sin((D*G-E)*(2*Math.PI)/F)+H+A},easeInOutElastic:function(B,D,A,H,G){var E=1.70158;var F=0;var C=H;if(D==0){return A}if((D/=G/2)==2){return A+H}if(!F){F=G*(0.3*1.5)}if(C<Math.abs(H)){C=H;var E=F/4}else{var E=F/(2*Math.PI)*Math.asin(H/C)}if(D<1){return -0.5*(C*Math.pow(2,10*(D-=1))*Math.sin((D*G-E)*(2*Math.PI)/F))+A}return C*Math.pow(2,-10*(D-=1))*Math.sin((D*G-E)*(2*Math.PI)/F)*0.5+H+A},easeInBack:function(B,C,A,F,E,D){if(D==undefined){D=1.70158}return F*(C/=E)*C*((D+1)*C-D)+A},easeOutBack:function(B,C,A,F,E,D){if(D==undefined){D=1.70158}return F*((C=C/E-1)*C*((D+1)*C+D)+1)+A},easeInOutBack:function(B,C,A,F,E,D){if(D==undefined){D=1.70158}if((C/=E/2)<1){return F/2*(C*C*(((D*=(1.525))+1)*C-D))+A}return F/2*((C-=2)*C*(((D*=(1.525))+1)*C+D)+2)+A},easeInBounce:function(B,C,A,E,D){return E-jQuery.easing.easeOutBounce(B,D-C,0,E,D)+A},easeOutBounce:function(B,C,A,E,D){if((C/=D)<(1/2.75)){return E*(7.5625*C*C)+A}else{if(C<(2/2.75)){return E*(7.5625*(C-=(1.5/2.75))*C+0.75)+A}else{if(C<(2.5/2.75)){return E*(7.5625*(C-=(2.25/2.75))*C+0.9375)+A}else{return E*(7.5625*(C-=(2.625/2.75))*C+0.984375)+A}}}},easeInOutBounce:function(B,C,A,E,D){if(C<D/2){return jQuery.easing.easeInBounce(B,C*2,0,E,D)*0.5+A}return jQuery.easing.easeOutBounce(B,C*2-D,0,E,D)*0.5+E*0.5+A}});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright (c) 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */