var HIGHLIGHT_COLOR='rgba(0,0,252,0.5)';
var BOX_SELECT_COLOR='rgba(0,0,250,1)';
var BOX_MARK_COLOR='rgba(0,255,0,1)';
var BOX_DEFAULT_COLOR='rgba(255,255,255,1)'
var lpad,rpad,tpad,bpad;
lpad=tpad=10;
rpad=bpad=10;
var bwidth,bheight,brow,bcol;
brow=10,bcol=8;
bwidth=bheight=40;
var boxColor=new Array(brow);
let inp,button,helpText,doneButton;
var startX,startY;
var totalBlockCount,blocksEnteredCount=0;
var blocks;
var minH=0,minW=0;
var blocksSolutionAddress;
var solutionExists=false;
var newP5;

////////////////////////////////
// Simple function to draw grid
/////////////////////////////////
function drawGrid(){
  startX=lpad,startY=tpad;
  for(var i=0;i<brow;i++){
    for(var j=0;j<bcol;j++){
      push();
      fill(boxColor[i][j]);
      rect(startX+j*bwidth,startY+i*bheight,bwidth,bheight);
      pop();
    }
  }
}
////////////////////////////////
// Box selection
////////////////////////////////
function mouseDragged(){
  if(mouseX>startX && mouseX<startX+bcol*bwidth && mouseY>startY && mouseY<startY+brow*bheight){
    var i,j;
    for(i=0;i<brow;i++){
      if(mouseY<startY+i*bheight)
        break;
    }
    for(j=0;j<bcol;j++){
      if(mouseX<startX+j*bwidth)
        break;
    }
    i--,j--;
    boxColor[i][j]=BOX_SELECT_COLOR;
  }
  else if(pow(mouseX-50,2) + pow(mouseY-(tpad+bpad+brow*bheight+50),2) <=50*50){
    for(var i=0;i<brow;i++){
      for(var j=0;j<bcol;j++){
        boxColor[i][j]=BOX_DEFAULT_COLOR;
      }
    }
  }
}
///////////////////////////////
// Same function for click
//////////////////////////////
mouseClicked=mouseDragged.bind({});
///////////////////////////////

///////////////////////////////
// Utility function for hightlight
////////////////////////////////
function mouseOverCheck(){
  if(mouseX>startX && mouseX<startX+bcol*bwidth && mouseY>startY && mouseY<startY+brow*bheight){
    var i,j;
    for(j=0;j<brow;j++){
      if(mouseY<startY+j*bheight)
        break;
    }
    for(i=0;i<bcol;i++){
      if(mouseX<startX+i*bwidth)
        break;
    }
    i--,j--;
    // boxColor[j][i]=[0,0,250,0.5];
    push();
    fill(HIGHLIGHT_COLOR);
    rect(startX+i*bwidth,startY+j*bheight,bwidth,bheight);
    pop();
  }
  else if(pow(mouseX-50,2) + pow(mouseY-(tpad+bpad+brow*bheight+50),2) <=50*50){
    push();
    textAlign(CENTER,CENTER);
    fill(HIGHLIGHT_COLOR);
    ellipse(50,tpad+bpad+brow*bheight+50,50,50);
    text('RESET\nBLOCK',50,tpad+bpad+brow*bheight+50);
    pop();
  }
}
////////////////////////////////////

/////////////////////////////////////
// Utility function to reset box colors
/////////////////////////////////////
function colReset(){
  for(var i=0;i<brow;i++){
    for(var j=0;j<bcol;j++){
      boxColor[i][j]=BOX_DEFAULT_COLOR;
    }
  }
}

/////////////////////////////////
// Block entry Done button clicked
///////////////////////////////////
function doneButtonClicked(){
  blocksEnteredCount++;
  var firstFound=false;
  var q =[];
  var rRef,cRef,r,c;
  boxList=new Array();
  q.push([0,0]);
  while(q.length>0 || !firstFound){
    [r,c]=q[0];
    q.shift();
    // BFS function
    if(boxColor[r][c]==BOX_SELECT_COLOR){
      if(!firstFound){
        rRef=r,cRef=c;
        firstFound=true;
      }
      boxList.push([r-rRef,c-cRef]);
    }
    boxColor[r][c]=BOX_MARK_COLOR;
    //Next values
    for(var i=-1;i<2;i+=2){
      // For Top-Bottom
      if(r+i>=0 && r+i<brow){
        if((firstFound && boxColor[r+i][c]==BOX_SELECT_COLOR) || !firstFound)
          q.push([r+i,c]);
      }
      // For Left-Right
      if(c+i>=0 && c+i<brow){
        if((firstFound && boxColor[r][c+i]==BOX_SELECT_COLOR) || !firstFound)
          q.push([r,c+i]);
      }
    }
  }
  ///////////////////////////
  // Finding largest height and width for faster final production
  ///////////////////////////
  var minR,minC,maxR,maxC;
  minR=minC=maxR=maxC=0;
  for(var i=0;i<boxList.length;i++){
    [r,c]=boxList[i];
    minR=min(r,minR);
    maxR=max(maxR,r);
    minC=min(c,minC);
    maxC=max(c,maxC);
  }
  minW=max(minW,maxC-minC+1);
  minH=max(minH,maxR-minR+1);
  ////////////////////////////
  // Adding to final blocks blocks list
  ////////////////////////////
  blocks.push(boxList);
  console.log(blocks);
  ///////////////////////////
  // Updating text box
  //////////////////////////
  colReset();
  if(blocksEnteredCount==totalBlockCount){
    solve();
    helpText.html("");
  }
  else{
    helpText.html("Input blocks one by one<br>Input block #"+(blocksEnteredCount+1)+"  <button id='doneButton'>Done!</button>");
    doneButton=select('#doneButton');
    doneButton.mouseClicked(doneButtonClicked);
  }
}

///////////////////////////////////
// Obvious
//////////////////////////////////
function submitButtonClicked(){
  totalBlockCount=inp.value();
  blocksSolutionAddress=new Array(totalBlockCount);
  blocks=[];
  helpText.html("Input blocks one by one<br>Input block #1  <button id='doneButton'>Done!</button>");
  doneButton=select('#doneButton');
  doneButton.mouseClicked(doneButtonClicked);
}

function setup(){
  frameRate(120);
  for(var i=0;i<brow;i++){
    let temp=new Array(bcol)
    for(var j=0;j<bcol;j++){
      temp[j]=BOX_DEFAULT_COLOR;
    }
    boxColor[i]=temp;
  }
  createCanvas(lpad+rpad+bcol*bwidth,tpad+bpad+brow*bheight+100);
  inp=select("#boxCount",'h2');
  button=select("#submitButton",'h2');
  helpText=select('#helpText');
  button.mouseClicked(submitButtonClicked);
}

function draw(){
  background(256);
  drawGrid();
  push();
  textAlign(CENTER,CENTER);
  ellipse(50,tpad+bpad+brow*bheight+50,50,50);
  text('RESET\nBLOCK',50,tpad+bpad+brow*bheight+50);
  pop();
  mouseOverCheck();
}

function dp(blockIndex,H,W,solBoxColor){
  if(blockIndex==blocks.length) return 1;
  for(var i=0;i<H;i++){
    for(var j=0;j<W;j++){
      var blockFits=true;
      for(var k=0;k<blocks[blockIndex].length;k++){
        var _i=i+blocks[blockIndex][k][0];
        var _j=j+blocks[blockIndex][k][1];
        if(_i<0 || _i>=H || _j<0 || _j>=W || solBoxColor[_i][_j]!=BOX_DEFAULT_COLOR) {
          blockFits=false;
          break;
        }
      }
      if(blockFits){
        for(var k=0;k<blocks[blockIndex].length;k++){
          var _i=i+blocks[blockIndex][k][0];
          var _j=j+blocks[blockIndex][k][1];
          solBoxColor[_i][_j]=BOX_MARK_COLOR;
        }
        if(dp(blockIndex+1,H,W,solBoxColor)==1){
          blocksSolutionAddress[blockIndex]=[i,j];
          return 1;
        }
        for(var k=0;k<blocks[blockIndex].length;k++){
          var _i=i+blocks[blockIndex][k][0];
          var _j=j+blocks[blockIndex][k][1];
          solBoxColor[_i][_j]=BOX_DEFAULT_COLOR;
        }
      }
    }
  }
  return 0;
}

function solve(){
  var totalBoxCount=0;
  for(var i=0;i<blocks.length;i++){
    totalBoxCount+=blocks[i].length;
  }
  var H,W;
  for(H=minH;H<=brow;H++){
    W=totalBoxCount/H;
    if(totalBoxCount%H>0 || W>bcol) continue;
    var solBoxColor=[];
    for(var i=0;i<H;i++){
      var temp=[];
      for(var j=0;j<W;j++) temp.push(BOX_DEFAULT_COLOR);
      solBoxColor.push(temp);
    }
    if(dp(0,H,W,solBoxColor)==1) {
      solutionExists=true;
      break;
    }
  }
  newP5=new p5(solCanvas);
}

let solCanvas=function(p){
  var finalBoxColor=new Array(brow);
  p.setup=function(){
    p.createCanvas(lpad+rpad+bcol*bwidth,tpad+bpad+brow*bheight);
    for(var i=0;i<brow;i++){
      let temp=new Array(bcol);
      for(var j=0;j<bcol;j++){
        temp[j]=BOX_DEFAULT_COLOR;
      }
      finalBoxColor[i]=temp;
    }
    p.background(BOX_DEFAULT_COLOR);
    if(solutionExists){
      for(var b=0;b<blocks.length;b++){
        var r,c;
        [r,c]=blocksSolutionAddress[b];
        var col;
        col='rgba('+floor(random()*255)+','+floor(random()*255)+','+floor(random()*255)+',1)';
        console.log(col);
        for(var i=0;i<blocks[b].length;i++){
          var roff,coff;
          [roff,coff]=blocks[b][i];
          finalBoxColor[r+roff][c+coff]=col;
        }
      }
      for(var i=0;i<brow;i++){
        for(var j=0;j<bcol;j++){
          if(finalBoxColor[i][j]==BOX_DEFAULT_COLOR) continue;
          p.push();
          p.fill(finalBoxColor[i][j]);
          p.rect(startX+j*bwidth,startY+i*bheight,bwidth,bheight);
          p.pop();
        }
      }
    }
    else{
      push();
      p.textSize(20);
      p.textAlign(CENTER,CENTER)
      p.text("NO SOLUTION",p.height/2,p.width/2);
      pop();
    }
  };
  p.draw=function(){
  };
};
