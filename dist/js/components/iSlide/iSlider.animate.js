!function(t,e){"function"==typeof require&&"object"==typeof module&&module&&"object"==typeof exports&&exports?e(require("iSlider")):"function"==typeof define&&define.amd?define(["iSlider"],function(t){e(t)}):e(t.iSlider)}(window?window:this,function(t){"use strict";t&&t.extend(t._animateFuncs,{rotate:function(){function e(e,s,i,r,n,a){var o="X"===s?"Y":"X";this.isVertical&&(n=-n,Math.abs(a)>1&&(a=-a)),t.setStyle(this.wrap,"perspective",4*i),e.style.visibility="visible",a>0&&2===r&&(e.style.visibility="hidden"),a<0&&0===r&&(e.style.visibility="hidden"),e.style.zIndex=1===r?1:0,e.style.cssText+=t.styleProp("backface-visibility")+":hidden;"+t.styleProp("transform-style")+":preserve-3d;position:absolute;",t.setStyle(e,"transform","rotate"+o+"("+90*(n/i+r-1)+"deg) translateZ("+.889*i/2+"px) scale(0.889)")}return e.effect=t.styleProp("transform"),e.reverse=!0,e}(),flip:function(){function e(e,s,i,r,n,a){this.isVertical&&(n=-n),t.setStyle(this.wrap,"perspective",4*i),e.style.visibility="visible",a>0&&2===r&&(e.style.visibility="hidden"),a<0&&0===r&&(e.style.visibility="hidden"),e.style.cssText+="position:absolute;"+t.styleProp("backface-visibility")+":hidden",t.setStyle(e,"transform","translateZ("+i/2+"px) rotate"+("X"===s?"Y":"X")+"("+180*(n/i+r-1)+"deg) scale(0.875)")}return e.effect=t.styleProp("transform"),e.reverse=!0,e}(),depth:function(){function e(e,s,i,r,n,a){var o=.18*(4-Math.abs(r-1));t.setStyle(this.wrap,"perspective",4*i),e.style.zIndex=1===r?1:0,t.setStyle(e,"transform","scale("+o+") translateZ(0) translate"+s+"("+(n+1.25*i*(r-1))+"px)")}return e.effect=t.styleProp("transform"),e}(),flow:function(){function e(e,s,i,r,n,a){var o=Math.abs(n),l="X"===s?"Y":"X",c="X"===s?1:-1,f=Math.abs(n/i);t.setStyle(this.wrap,"perspective",4*i+"rem"),1===r?e.style.zIndex=i-o:e.style.zIndex=n>0?(1-r)*o:(r-1)*o,t.setStyle(e,"transform","scale(0.7, 0.7) translateZ("+(150*f-150)*Math.abs(r-1)+"px)translate"+s+"("+(n+i*(r-1))+"px)rotate"+l+"("+c*(30-30*f)*(1-r)+"deg)")}return e.effect=t.styleProp("transform"),e}(),card:function(){function e(e,s,i,r,n,a){var o=Math.abs(n),l=1,c=1;o>0?1===r&&(l=1-.2*Math.abs(r-1)-Math.abs(.2*n/i).toFixed(6),c=0):1!==r&&((a>0&&0===r||a<0&&2===r)&&(l=1-.2*Math.abs(r-1)),c=0),e.style.zIndex=c,t.setStyle(e,"transform","scale("+l+") translateZ(0) translate"+s+"("+((1+.2*Math.abs(r-1))*n+i*(r-1))+"px)")}return e.effect=t.styleProp("transform"),e}(),fade:function(){function t(t,e,s,i,r,n){t.style.zIndex=1===i?1:0,r=Math.abs(r),1===i?t.style.opacity=1-r/s:t.style.opacity=r/s}return t.effect="opacity",t}(),zoomout:function(){function e(e,i,r,n,a){var o,l,c,f=a/r;switch(n){case 0:s&&window.clearTimeout(s),l=f<1?f:1,c=2-.5*f,o=2;var y=1e3*parseInt(window.getComputedStyle(e)[t.styleProp("transitionDuration",1)]);y>0&&(s=window.setTimeout(function(){e.style.zIndex=0},y));break;case 1:l=1-f,c=1-.5*f,o=1;break;case 2:l=f>0?f:0,c=.5-.5*f,o=0}e.style.cssText+="z-index:"+o+";opacity:"+l+";"+t.styleProp("transform")+":scale("+c+");"}var s;return e.reverse=!0,e}()})});
//# sourceMappingURL=iSlider.animate.js.map
