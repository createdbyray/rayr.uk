var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    opts = {
      len: 20,
      count: 50,
      baseTime: 10,
      addedTime: 10,
      dieChance: .05,
      spawnChance: 1,
      sparkChance: .1,
      sparkDist: 10,
      sparkSize: 2,
      
      color: 'hsl(hue,100%,light%)',
      cx: w / 2,
      cy: h / 2,
      repaintAlpha: .04,
      hueChange: .1
    },
    
    tick = 0,
    lines = [],
    dieX = w / 2 / opts.len,
    dieY = h / 2 / opts.len,
    
    baseRad = Math.PI * 2 / 6;

ctx.fillStyle = 'black';
ctx.fillRect( 0, 0, w, h );

function loop() {
  
  window.requestAnimationFrame( loop );
  
  ++tick;
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,repaintAlpha)'.replace( 'repaintAlpha', opts.repaintAlpha );
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';
  
  if( lines.length < opts.count && Math.random() < opts.spawnChance )
    lines.push( new Line );
  
  lines.forEach( function( line ){ line.step(); } );
}
function Line() {
  
  this.reset();
}
Line.prototype.reset = function() {
  
  this.x = 0;
  this.y = 0;
  this.addedX = 0;
  this.addedY = 0;
  
  this.rad = 0;
  
  this.lightInputMultiplier = .01;
  
  this.cumulativeTime = 0;
  
  this.beginPhase();
}
Line.prototype.beginPhase = function() {
  
  this.x += this.addedX;
  this.y += this.addedY;
  
  this.time = ( opts.baseTime + opts.addedTime * Math.random() ) | 0;
  
  this.targetRad = ( ( Math.random() * 6 ) | 0 ) * baseRad;
  this.rad += this.targetRad;
  
  this.addedX = Math.cos( this.rad );
  this.addedY = Math.sin( this.rad );
  
  if( Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY )
    this.reset();
}
Line.prototype.step = function() {
  
  ++this.cumulativeTime;
  ++this.time;
  
  var prop = this.time / this.targetRad;
  
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo( opts.cx + this.x * opts.len, opts.cy + this.y * opts.len );
  ctx.lineTo( opts.cx + ( this.x + this.addedX ) * opts.len, opts.cy + ( this.y + this.addedY ) * opts.len );
  ctx.lineTo( opts.cx + ( this.x + this.addedX + Math.cos( this.rad + baseRad ) ) * opts.len, opts.cy + ( this.y + this.addedY + Math.sin( this.rad + baseRad ) ) * opts.len );
  ctx.strokeStyle = opts.color.replace( 'hue', tick * opts.hueChange ).replace( 'light', 30 + 10 * Math.sin( this.cumulativeTime * this.lightInputMultiplier ) );
  ctx.stroke();
  
  if( Math.random() < opts.sparkChance ) {
    ctx.fillStyle = opts.color.replace( 'hue', tick * opts.hueChange ).replace( 'light', 60 );
    ctx.fillRect( opts.cx + ( this.x + this.addedX ) * opts.len + Math.random() * opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - opts.sparkSize / 2, opts.cy + ( this.y + this.addedY ) * opts.len + Math.random() * opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - opts.sparkSize / 2, opts.sparkSize, opts.sparkSize );
  }
  
  if( this.time >= this.targetRad )
    this.beginPhase();
}
loop();

window.addEventListener( 'resize', function() {
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  ctx.fillStyle = 'black';
  ctx.fillRect( 0, 0, w, h );
  
  opts.cx = w / 2;
  opts.cy = h / 2;
  dieX = w / 2 / opts.len;
  dieY = h / 2 / opts.len;
} );
