(function(){
var turnIntoCSList=function(a){return{ctype:"list",value:a}},realCSNumber=function(a){return{ctype:"number",value:{real:a,imag:0}}},t0,t1;function p(a){console.log(a,t1-t0)}var QuickHull3D=function(a){this.pointBuffer=[];this.minVertices=[];this.maxVertices=[];this.vertexPointIndices=[];this.faces=[];this.discardedFaces=[];this.horizon=[];this._claimed=new VertexList;this._unclaimed=new VertexList;void 0!==a&&this.build(a)};QuickHull3D.INDEXED_FROM_ONE=2;QuickHull3D.INDEXED_FROM_ZERO=4;
QuickHull3D.POINT_RELATIVE=8;QuickHull3D.prototype.debug=!1;QuickHull3D.prototype._findIndex=-1;QuickHull3D.NONCONVEX_WRT_LARGER_FACE=1;QuickHull3D.NONCONVEX=2;QuickHull3D.DOUBLE_PRECISION=2.220446049250313E-16;QuickHull3D.AUTOMATIC_TOLERANCE=-1;QuickHull3D.prototype.explicitTolerance=QuickHull3D.AUTOMATIC_TOLERANCE;QuickHull3D.prototype.getDistanceTolerance=function(){return this.tolerance};QuickHull3D.prototype.setExplicitDistanceTolerance=function(a){this.explicitTolerance=a};
QuickHull3D.prototype.getExplicitDistanceTolerance=function(){return this.explicitTolerance};QuickHull3D.prototype._addPointToFace=function(a,b){a.face=b;null===b.outside?this._claimed.add(a):this._claimed.insertBefore(a,b.outside);b.outside=a};QuickHull3D.prototype._removePointFromFace=function(a,b){a===b.outside&&(b.outside=null!==a.next&&a.next.face===b?a.next:null);this._claimed.delete(a)};
QuickHull3D.prototype._removeAllPointFromFace=function(a){if(null===a.outside)return null;for(var b=a.outside;null!==b.next&&b.next.face===a;)b=b.next;this._claimed.delete(a.outside,b);b.next=null;return a.outside};
QuickHull3D.prototype.build=function(a,b){var c="number"===typeof a[0]?a.length/3:a.length;void 0===b&&(b=c);if(4>b)throw Error("Less than 4 input points specified");if(c<b)throw Error("Coordinate array too small for specified number of points");this._initBuffers(b);this._setPoints(a);this._buildHull()};
QuickHull3D.prototype.triangulate=function(){var a=1E3*this.charLength*this.constructor.DOUBLE_PRECISION;this.newFaces=[];this.faces.forEach(function(b){b.mark===FO.VISIBLE&&FO.triangulate(b,this.newFaces,a)},this);this.faces=this.faces.concat(this.newFaces)};QuickHull3D.prototype.getVertices=function(){return this.vertexPointIndices.map(function(a){a=this.pointBuffer[a];return turnIntoCSList([realCSNumber(a.point.x),realCSNumber(a.point.y),realCSNumber(a.point.z)])},this)};
QuickHull3D.prototype.getFaces=function(a){void 0===a&&(a=0);return this.faces.map(function(b){return this._getFaceIndices(b,a)},this)};QuickHull3D.prototype._findHalfEdge=function(a,b){for(var c=this.faces.length,d,e=0;e<c;e++)if(d=FO.findEdge(this.faces[e],a,b),null!==d)return d;return null};
QuickHull3D.prototype._setHull=function(a,b,c,d){this.initBuffers(b);this.setPoints(a,b);this._computeMaxAndMin();for(var e,f=0;f<d;f++){a=FO.create(this.pointBuffer,c[f]);b=a.halfEdge0;do e=this._findHalfEdge(b.head,HEO.tail(b)),null!==e&&HEO.setOpposite(b,e),b=b.next;while(b!==a.halfEdge0);this.faces.push(a)}};QuickHull3D.prototype._printPoints=function(){this.pointBuffer.forEach(function(a){console.log(a.point.x+" "+a.point.y+" "+a.point.z)})};
QuickHull3D.prototype._initBuffers=function(a){this.vertexPointIndices=[];for(var b=this.pointBuffer.length;b<a;b++)this.pointBuffer.push(new Vertex);this.faces=[];this._claimed.clear();this.numberOfFaces=0;this.numberOfPoints=a};QuickHull3D.prototype._setPoints=function(a){"number"===typeof a[0]?this.pointBuffer.forEach(function(b,c){b.point=new Vector(a[3*c],a[3*c+1],a[3*c+2]);b.index=c}):this.pointBuffer.forEach(function(b,c){b.point=a[c];b.index=c})};
QuickHull3D.prototype._computeMaxAndMin=function(){for(var a=VectorOperations.copy(this.pointBuffer[0].point),b=VectorOperations.copy(this.pointBuffer[0].point),c=0;3>c;c++)this.maxVertices[c]=this.minVertices[c]=this.pointBuffer[0];this.pointBuffer.forEach(function(d){var e=d.point,f=e.x,g=e.y;e=e.z;f>a.x?(a.x=f,this.maxVertices[0]=d):f<b.x&&(b.x=f,this.minVertices[0]=d);g>a.y?(a.y=g,this.maxVertices[1]=d):g<b.y&&(b.y=g,this.minVertices[1]=d);e>a.z?(a.z=e,this.maxVertices[2]=d):e<b.z&&(b.z=e,this.minVertices[2]=
d)},this);this.charLength=Math.max(a.x-b.x,a.y-b.y,a.z-b.z);this.tolerance=this.explicitTolerance===this.constructor.AUTOMATIC_TOLERANCE?3*this.constructor.DOUBLE_PRECISION*(Math.max(Math.abs(a.x),Math.abs(b.x))+Math.max(Math.abs(a.y),Math.abs(b.y))+Math.max(Math.abs(a.z),Math.abs(b.z))):this.explicitTolerance};QuickHull3D.MAP_XYZ=["x","y","z"];
QuickHull3D.prototype._createInitialSimplex=function(){var a=0,b=0,c;this.constructor.MAP_XYZ.forEach(function(h,m){h=this.maxVertices[m].point[h]-this.minVertices[m].point[h];h>a&&(a=h,b=m)},this);if(a<=this.tolerance)throw Error("Input points appear to be coincident");var d=[this.maxVertices[b],this.minVertices[b]];var e=VectorOperations.sub(d[1].point,d[0].point),f=0;e=VectorOperations.normalize(e);this.pointBuffer.forEach(function(h){if(h.index!==d[0].index&&h.index!==d[1].index){var m=VectorOperations.sub(h.point,
d[0].point);m=VectorOperations.cross(e,m);var q=VectorOperations.abs2(m);q>f&&(f=q,d[2]=h,g=m)}});if(Math.sqrt(f)<=100*this.tolerance)throw Error("Input points appear to be colinear");var g=VectorOperations.normalize(g);var k=0,n=VectorOperations.scalproduct(d[2].point,g);this.pointBuffer.forEach(function(h){if(h.index!==d[0].index&&h.index!==d[1].index&&h.index!==d[2].index){var m=Math.abs(VectorOperations.scalproduct(h.point,g)-n);m>k&&(k=m,d[3]=h)}});if(k<100*this.tolerance)throw Error("Input points appear to be coplanar");
this.debug&&(console.log("Initial vertices"),d.forEach(function(h){console.log(h.index+" : ",h.point)}));var l=[];if(0>VectorOperations.scalproduct(d[3].point,g)-n)for(l.push(FO.createTriangle(d[0],d[1],d[2])),l.push(FO.createTriangle(d[3],d[1],d[0])),l.push(FO.createTriangle(d[3],d[2],d[1])),l.push(FO.createTriangle(d[3],d[0],d[2])),c=0;3>c;c++){var r=(c+1)%3;HEO.setOpposite(FO.getEdge(l[c+1],1),FO.getEdge(l[r+1],0));HEO.setOpposite(FO.getEdge(l[c+1],2),FO.getEdge(l[0],r))}else for(l.push(FO.createTriangle(d[0],
d[2],d[1])),l.push(FO.createTriangle(d[3],d[0],d[1])),l.push(FO.createTriangle(d[3],d[1],d[2])),l.push(FO.createTriangle(d[3],d[2],d[0])),c=0;3>c;c++)r=(c+1)%3,HEO.setOpposite(FO.getEdge(l[c+1],0),FO.getEdge(l[r+1],1)),HEO.setOpposite(FO.getEdge(l[c+1],2),FO.getEdge(l[0],(3-c)%3));this.faces=l;this.pointBuffer.forEach(function(h){var m=this.tolerance,q;h.index!==d[0].index&&h.index!==d[1].index&&h.index!==d[2].index&&h.index!==d[3].index&&(l.forEach(function(t){var u=FO.distanceToPlane(t,h.point);
u>m&&(q=t,m=u)}),void 0!==q&&this._addPointToFace(h,q))},this)};QuickHull3D.prototype._getNumberOfVertices=function(){};QuickHull3D.prototype._getVertexPointIndices=function(){};QuickHull3D.prototype._getNumberOfFaces=function(){};
QuickHull3D.prototype._getFaceIndices=function(a,b){var c=0===(b&this.constructor.CLOCKWISE);b=0!==(b&this.constructor.POINT_RELATIVE);var d=a.halfEdge0,e=[];do{var f=d.head.index;b&&(f=this.vertexPointIndices[f]);f++;e.push(realCSNumber(f));d=c?d.next:d.previous}while(d!==a.halfEdge0);return turnIntoCSList(e)};
QuickHull3D.prototype._resolveUnclaimedPoints=function(a){var b,c,d=a.length;for(c=this._unclaimed.head;null!==c;c=e){var e=c.next;var f=this.tolerance;var g=null;for(b=0;b<d;b++){var k=a[b];if(k.mark===FO.VISIBLE){var n=FO.distanceToPlane(k,c.point);n>f&&(f=n,g=k);if(f>1E3*this.tolerance)break}}null!==g?(this._addPointToFace(c,g),this.debug&&c.index===this._findIndex&&console.log(this._findIndex+" CLAIMED BY "+FO.getVertexString(g))):this.debug&&c.index===this._findIndex&&console.log(this._findIndex+
" DISCARDED")}};QuickHull3D.prototype._removeAllPointsFromFace=function(a){if(null===a.outside)return null;for(var b=a.outside;null!==b.next&&b.next.face===a;)b=b.next;this._claimed.delete(a.outside,b);b.next=null;return a.outside};QuickHull3D.prototype._deleteFacePoints=function(a,b){a=this._removeAllPointsFromFace(a);if(null!==a)if(null===b)this._unclaimed.addAll(a);else for(var c=a;null!==c;c=a)a=c.next,FO.distanceToPlane(b,c.point)>this.tolerance?this._addPointToFace(c,b):this._unclaimed.add(c)};
QuickHull3D.prototype._oppFaceDistance=function(a){return FO.distanceToPlane(a.face,a.opposite.face.centroid)};
QuickHull3D.prototype._doAdjacentMerge=function(a,b){var c=a.halfEdge0,d=!0;do{var e=HEO.oppositeFace(c);var f=!1;if(b===this.constructor.NONCONVEX){if(this._oppFaceDistance(c)>-this.tolerance||this._oppFaceDistance(c.opposite)>-this.tolerance)f=!0}else a.area>e.area?this._oppFaceDistance(c)>-this.tolerance?f=!0:this._oppFaceDistance(c.opposite)>-this.tolerance&&(d=!1):this._oppFaceDistance(c.opposite)>-this.tolerance?f=!0:this._oppFaceDistance(c)>-this.tolerance&&(d=!1);if(f){this.debug&&console.log("  merging "+
FO.getVertexString(a)+"  and  "+FO.getVertexString(e));b=FO.mergeAdjacentFace(a,c,this.discardedFaces);for(c=0;c<b;c++)this._deleteFacePoints(this.discardedFaces[c],a);this.debug&&console.log("  result: "+FO.getVertexString(a));return!0}c=c.next}while(c!==a.halfEdge0);d||(a.mark=FO.NON_CONVEX);return!1};
QuickHull3D.prototype._calculateHorizon=function(a,b,c,d){this._deleteFacePoints(c,null);c.mark=FO.DELETED;this.debug&&console.log("Visiting face "+FO.getVertexString(c));c=null===b?b=FO.getEdge(c,0):b.next;do{var e=HEO.oppositeFace(c);e.mark===FO.VISIBLE&&(FO.distanceToPlane(e,a)>this.tolerance?this._calculateHorizon(a,c.opposite,e,d):(d.push(c),this.debug&&console.log("Adding horizon edge "+HEO.getVertexString(c))));c=c.next}while(c!==b)};
QuickHull3D.prototype._addAdjoiningFace=function(a,b){a=FO.createTriangle(a,HEO.tail(b),b.head);this.faces.push(a);HEO.setOpposite(FO.getEdge(a,-1),b.opposite);return FO.getEdge(a,0)};QuickHull3D.prototype._addNewFaces=function(a,b,c){this.newFaces=[];var d=null,e=null;this.horizon.forEach(function(f){f=this._addAdjoiningFace(b,f);this.debug&&console.log("new face: "+FO.getVertexString(f.face));null!==d?HEO.setOpposite(f.next,d):e=f;this.newFaces.push(f.face);d=f},this);HEO.setOpposite(e.next,d)};
QuickHull3D.prototype._nextPointToAdd=function(){if(this._claimed.isEmpty())return null;var a=this._claimed.head.face,b=null,c=0,d;for(d=a.outside;null!==d&&d.face===a;d=d.next){var e=FO.distanceToPlane(a,d.point);e>c&&(c=e,b=d)}return b};
QuickHull3D.prototype._addPointToHull=function(a){this.horizon=[];this._unclaimed.clear();this.debug&&console.log("Adding point:",a.index,"\n which is "+FO.distanceToPlane(a.face,a.point)+"above face "+FO.getVertexString(a.face));this._removePointFromFace(a,a.face);this._calculateHorizon(a.point,null,a.face,this.horizon);this.newFaces=[];this._addNewFaces(this.newFaces,a,this.horizon);this.newFaces.forEach(function(b){if(b.mark===FO.VISIBLE)for(;this._doAdjacentMerge(b,this.constructor.NONCONVEX_WRT_LARGER_FACE););
},this);this.newFaces.forEach(function(b){if(b.mark===FO.NON_CONVEX)for(b.mark=FO.VISIBLE;this._doAdjacentMerge(b,this.constructor.NONCONVEX););},this);this._resolveUnclaimedPoints(this.newFaces)};QuickHull3D.prototype._buildHull=function(){var a=0,b;this._computeMaxAndMin();for(this._createInitialSimplex();null!==(b=this._nextPointToAdd());)this._addPointToHull(b),a++,this.debug&&console.log("Iteration "+a+" done");this._reindexFacesAndVertices();this.debug&&console.log("Hull done")};
QuickHull3D.prototype._markFaceVertices=function(a,b){var c=a.halfEdge0;do c.head.index=b,c=c.next;while(c!==a.halfEdge0)};
QuickHull3D.prototype._reindexFacesAndVertices=function(){this.pointBuffer.forEach(function(b){b.index=-1});this.numberOfFaces=0;var a=[];this.faces.forEach(function(b){b.mark===FO.VISIBLE&&(a.push(b),this._markFaceVertices(b,0),this.numberOfFaces++)},this);this.faces=a;this.numberOfVertices=0;this.pointBuffer.forEach(function(b,c){0===b.index&&(this.vertexPointIndices[this.numberOfVertices]=c,b.index=this.numberOfVertices++)},this)};QuickHull3D.prototype._checkFaceConvexity=function(a,b){};
QuickHull3D.prototype._checkFaces=function(a){};QuickHull3D.prototype._check=function(a){};var Vector=function(a,b,c){this.x=a;this.y=b;this.z=c},VectorOperations={DOUBLE_PRECISION:2.220446049250313E-16,add:function(a,b){return new Vector(a.x+b.x,a.y+b.y,a.z+b.z)},sub:function(a,b){return new Vector(a.x-b.x,a.y-b.y,a.z-b.z)},scalmult:function(a,b){return new Vector(a*b.x,a*b.y,a*b.z)},scaldiv:function(a,b){return new Vector(b.x/a,b.y/a,b.z/a)},abs2:function(a){return a.x*a.x+a.y*a.y+a.z*a.z},abs:function(a){return Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z)},distance2:function(a,b){var c=a.x-b.x,
d=a.y-b.y;a=a.z-b.z;return c*c+d*d+a*a},distance:function(a,b){var c=a.x-b.x,d=a.y-b.y;a=a.z-b.z;return Math.sqrt(c*c+d*d+a*a)},normalize:function(a){var b=a.x*a.x+a.y*a.y+a.z*a.z,c=2*VectorOperations.DOUBLE_PRECISION,d=b-1;return d>c||d<-2*c?(b=Math.sqrt(b),new Vector(a.x/b,a.y/b,a.z/b)):new Vector(a.x,a.y,a.z)},scalproduct:function(a,b){return a.x*b.x+a.y*b.y+a.z*b.z},cross:function(a,b){return new Vector(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x)},zerovector:function(){return new Vector(0,
0,0)},copy:function(a){return new Vector(a.x,a.y,a.z)}};var HalfEdge=function(a,b){this.head=a;this.face=b},HalfEdgeOperations={},HEO=HalfEdgeOperations;HEO.setOpposite=function(a,b){a.opposite=b;b.opposite=a};HEO.tail=function(a){return null!==a.previous?a.previous.head:null};HEO.oppositeFace=function(a){return null!==a.opposite?a.opposite.face:null};HEO.getVertexString=function(a){var b=HEO.tail(a);return null!==b?b.index+"-"+a.head.index:"?-"+a.head.index};
HEO.length=function(a){var b=HEO.tail(a);return null!==b?VectorOperations.abs(VectorOperations.sub(a.head.point,b.point)):-1};HEO.lengthSquared=function(a){var b=HEO.tail(a);return null!==b?VectorOperations.abs2(VectorOperations.sub(a.head.point,b.point)):-1};var Vertex=function(a,b,c,d){0===arguments.length?this.point=turnIntoCSList([]):(this.point=turnIntoCSList([a,b,c]),this.index=d);this.previous=this.next=null};var VertexList=function(){this.head=this.tail=null};VertexList.prototype.clear=function(){this.head=this.tail=null};VertexList.prototype.add=function(a){null===this.head?this.head=a:this.tail.next=a;a.previous=this.tail;a.next=null;this.tail=a};VertexList.prototype.addAll=function(a){null===this.head?this.head=a:this.tail.next=a;for(a.previous=this.tail;null!==a.next;)a=a.next;this.tail=a};
VertexList.prototype.delete=function(a,b){void 0===b&&(b=a);null===a.previous?this.head=b.next:a.previous.next=b.next;null===b.next?this.tail=a.previous:b.next.previous=a.previous};VertexList.prototype.insertBefore=function(a,b){a.previous=b.previous;null===b.previous?this.head=a:b.previous.next=a;a.next=b;b.previous=a};VertexList.prototype.isEmpty=function(){return null===this.head};VertexList.prototype.length=function(){for(var a=0,b=this.head;null!==b;b=b.next)a++;return a};var FaceOperations={},FO=FaceOperations,Face=function(){this.mark=FO.VISIBLE;this.outside=null};FO.VISIBLE=1;FO.NON_CONVEX=2;FO.DELETED=3;FO.computeCentroid=function(a){var b=a.halfEdge0;a.centroid=VectorOperations.zerovector();do a.centroid=VectorOperations.add(a.centroid,b.head.point),b=b.next;while(b!==a.halfEdge0);a.centroid=VectorOperations.scaldiv(a.numberOfVertices,a.centroid)};
FO.computeNormal=function(a,b){var c=a.halfEdge0.next;var d=c.next;var e=a.halfEdge0.head.point;var f=c.head.point;f=VectorOperations.sub(e,f);a.normal=VectorOperations.zerovector();for(a.numberOfVertices=2;d!==a.halfEdge0;)c=f,f=d.head.point,f=VectorOperations.sub(e,f),a.normal=VectorOperations.add(a.normal,VectorOperations.cross(c,f)),d=d.next,a.numberOfVertices++;a.area=VectorOperations.abs(a.normal);a.normal=VectorOperations.scaldiv(a.area,a.normal);if(void 0!==b&&a.area<b){d=null;b=0;e=a.halfEdge0;
do c=e.lengthSqr(),c>b&&(d=e,b=c),e=e.next;while(e!==a.halfEdge0);e=d.head.point;d=HEO.tail(d).point;b=Math.sqrt(b);b=VectorOperations.scaldiv(b,VectorOperations.sub(e,d));d=VectorOperations.scalproduct(b,a.normal);a.normal=VectorOperations.sub(a.normal,VectorOperations.scalmul(d,b))}};FO.getEdge=function(a,b){for(a=a.halfEdge0;0<b;)b--,a=a.next;for(;0>b;)b++,a=a.previous;return a};
FO.findEdge=function(a,b,c){var d=a.halfEdge0;do{if(d.head.index===c.index){if(HEO.tail(d).index===b.index)return d;break}d=d.next}while(d!==a.halfEdge);return null};FO.distanceToPlane=function(a,b){return VectorOperations.scalproduct(a.normal,b)-a.planeOffset};FO.getVertexString=function(a){for(var b=a.halfEdge0.head.index,c=a.halfEdge0.next;c!==a.halfEdge0;)b+=" "+c.head.index,c=c.next;return b};
FO.getVertexIndices=function(a){var b=[],c=a.halfEdge0;do b.push(c.head.index),c=c.next;while(c!==a.halfEdge0);return b};
FO._checkConsistency=function(a){var b=a.halfEdge0,c=0,d=0;if(3>a.numberOfVertices)throw Error("degenerate face: "+FO.getVertexString(a));do{var e=b.opposite;if(null===e)throw Error("face "+FO.getVertexString(a)+": unreflected half edge "+HEO.getVertexString(b));if(e.opposite!==b)throw Error("face "+FO.getVertexString(a)+": opposite half edge "+HEO.getVertexString(e)+" has opposite "+e.opposite.getVertexString());if(e.head!==HEO.tail(b)||b.head!==HEO.tail(e))throw Error("face "+FO.getVertexString(a)+
": half edge "+HEO.getVertexString(b))+" reflected by "+HEO.getVertexString(e);var f=e.face;if(null===f)throw Error("face "+FO.getVertexString(a)+": no face on half edge "+HEO.getVertexString(e));if(f.mark===FO.DELETED)throw Error("face "+FO.getVertexString(a)+": opposite face "+FO.getVertexString(f)+" not on hull");e=Math.abs(FO.distanceToPlane(a,b.head.point));e>c&&(c=e);d++;b=b.next}while(b!==a.halfEdge0);if(d!==a.numberOfVertices)throw Error("face "+FO.getVertexString(a)+" numVerts="+a.numberOfVertices+
" should be "+d);};
FO.mergeAdjacentFace=function(a,b,c){var d=0,e=HEO.oppositeFace(b);c[d++]=e;e.mark=FO.DELETED;var f=b.opposite,g=b.previous,k=b.next,n=f.previous;for(f=f.next;HEO.oppositeFace(g)===e;)g=g.previous,f=f.next;for(;HEO.oppositeFace(k)===e;)n=n.previous,k=k.next;for(e=f;e!==n.next;e=e.next)e.face=a;b===a.halfEdge0&&(a.halfEdge0=k);b=FO._connectHalfEdges(a,n,k);null!==b&&(c[d++]=b);b=FO._connectHalfEdges(a,g,f);null!==b&&(c[d++]=b);FO._computeNormalAndCentroid(a);FO._checkConsistency(a);return d};
FO.getSquaredArea=function(a,b,c){a=HEO.tail(b).point;var d=b.head.point,e=c.head.point;c=d.x-a.x;b=d.y-a.y;var f=d.z-a.z;d=e.x-a.x;var g=e.y-a.y;e=e.z-a.z;a=b*e-f*g;f=f*d-c*e;c=c*g-b*d;return a*a+f*f+c*c};
FO.triangulate=function(a,b,c){if(!(4>a.numberOfVertices)){var d=a.halfEdge0.head,e=a.halfEdge0.next,f=e.opposite,g=null;for(e=e.next;e!==a.halfEdge0.previous;e=e.next){var k=FO.createTriangle(d,e.previous.head,e.head,c);HEO.setOpposite(k.halfEdge0.next,f);HEO.setOpposite(k.halfEdge0.previous,e.opposite);f=k.halfEdge0;b.push(k);null===g&&(g=k)}e=new HalfEdge(a.halfEdge0.previous.previous.head,a);HEO.setOpposite(e,f);e.previous=a.halfEdge0;e.previous.next=e;e.next=a.halfEdge0.previous;e.next.previous=
e;FO.computeNormalAndCentroid(a,c);FO.checkConsistency(a);for(a=g;null!==a;a=a.next)FO.checkConsistency(a)}};FO._computeNormalAndCentroid=function(a,b){FO.computeNormal(a,b);FO.computeCentroid(a);a.planeOffset=VectorOperations.scalproduct(a.normal,a.centroid);if(void 0!==b){b=0;var c=a.halfEdge0;do b++,c=c.next;while(c!==a.halfEdge0);if(b!==a.numberOfVertices)throw Error("Face "+FO.getVertexString(a)+" should be "+a.numberOfVertices);}};
FO._connectHalfEdges=function(a,b,c){var d=null,e=HEO.oppositeFace(c);HEO.oppositeFace(b)===e?(b===a.halfEdge0&&(a.halfEdge0=c),3===e.numberOfVertices?(a=c.opposite.previous.opposite,e.mark=FO.DELETED,d=e):(a=c.opposite.next,e.halfEdge0===a.previous&&(e.halfEdge0=a),a.previous=a.previous.previous,a.previous.next=a),c.previous=b.previous,c.previous.next=c,c.opposite=a,a.opposite=c,FO._computeNormalAndCentroid(e)):(b.next=c,c.previous=b);return d};
FO.create=function(a,b){var c=new Face,d=null;b.forEach(function(e){e=new HalfEdge(a[e],c);null!==d?(e.previous=d,d.next=e):c.halfEdge0=e;d=e});c.halfEdge0.previous=d;d.next=c.halfEdge0;FO._computeNormalAndCentroid(c);return c};FO.createTriangle=function(a,b,c,d){d=d||0;var e=new Face;a=new HalfEdge(a,e);b=new HalfEdge(b,e);c=new HalfEdge(c,e);a.previous=c;a.next=b;b.previous=a;b.next=c;c.previous=b;c.next=a;e.halfEdge0=a;FO._computeNormalAndCentroid(e,d);return e};var FaceList=function(){};FaceList.prototype.clear=function(){this._head=this._tail=null};FaceList.prototype.add=function(a){};FaceList.prototype.first=function(){};FaceList.prototype.isEmpty=function(){};CindyJS.registerPlugin(1,"QuickHull3D",function(a){a.defineFunction("convexhull3d",1,function(b){var c=a.evaluateAndVal(b[0]),d=c.value.length;b=[];for(var e,f=0;f<d;f++)e=c.value[f].value,b.push(new Vector(e[0].value.real,e[1].value.real,e[2].value.real));c=new QuickHull3D;c.build(b);b={ctype:"list",value:c.getVertices()};c={ctype:"list",value:c.getFaces()};return{ctype:"list",value:[b,c]}})});
}).call(this);//# sourceMappingURL=QuickHull3D.js.map


