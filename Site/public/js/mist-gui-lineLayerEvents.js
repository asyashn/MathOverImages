// LINE LAYER EVENTS
/*
- on click
- on mouseover
- on mouseout
*/
lineLayer.on('click', function(evt) {
  if(deleteToolOn) {
    removeLine(evt.target);
    insertToArray(actionToObject('delete', evt.target));
    lineLayer.draw();
  }
});

lineLayer.on('mouseover', function(evt) {
  if (deleteToolOn) {
    var shape = evt.target;
    shape.setAttrs({
      scale: 3,
      shadowColor: deleteColor,
      shadowEnabled: true
    });
    lineLayer.draw();
  }
}); 

lineLayer.on('mouseout', function(evt) {
  if (deleteToolOn) {
    var shape = evt.target;
    shape.setAttrs({
      scale: 1,
      shadowEnabled: false
    });
    lineLayer.draw();
  }
});