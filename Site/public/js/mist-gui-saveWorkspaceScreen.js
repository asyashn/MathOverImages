var popWsRectWidth = width * .4;
var popWsRectHeight = height * .25;
var popSaveWsGroupX = (width - popWsRectWidth) / 2;
var popSaveWsGroupY = (height - popWsRectHeight) / 2;

var popWsButtonShiftX = popTextShiftX;//((popWsRectWidth / 2) - (2 * popWsButtonWidth)) / 3;
var popWsButtonWidth = ((popWsRectWidth / 2) - (3 * popWsButtonShiftX)) / 2;
var popWsButtonHeight = popWsRectWidth * .06;



var saveWsGroup = new Kinetic.Group({
	x: popSaveWsGroupX,
	y: popSaveWsGroupY,
	visible: false
});
screenLayer.add(saveWsGroup);

var saveWsRect = new Kinetic.Rect({
	x: 0,
	y: 0,
	width: popWsRectWidth,
	height: popWsRectHeight,
	fill: popRectColor,
	stroke: 'black',
	strokeWidth: 1
});
saveWsGroup.add(saveWsRect);

var nameWsText = new Kinetic.Text({
	text: "Name:",
	x: popTextShiftX,
	y: popTextShiftX,
	fill: 'black',
	fontSize: 16,
	fontFamily: globalFont,
});
saveWsGroup.add(nameWsText);

var nameWsRect = new Kinetic.Rect ({
	x: popTextShiftX + nameTextShift,
	y: popTextShiftX * .85,
	width: popCanvasSide - nameTextShift,
	height: popTextHeight / 1.5,
	fill: 'white',
	stroke: 'black',
	strokeWidth: 1
});
saveWsGroup.add(nameWsRect);

var nameWsEditText = new Kinetic.Text({
	x: popTextShiftX + (nameTextShift * 1.1),
	y: popTextShiftX,
	text: 'Enter a Name',
	fontSize: 14,
	width: popCanvasSide - nameTextShift,
	height: popTextHeight / 1.5,
	fontFamily: globalFont,
	fill: 'black'
});
saveWsGroup.add(nameWsEditText);
nameWsEditText.setEditable(true);
nameWsEditText.matchingCharacters = /[a-zA-Z0-9\-]/;
nameWsEditText.defaultText = 'Enter a Name';
nameWsEditText.drawMethod = function(){
	screenLayer.draw()
};

var popWsErrorText = new Kinetic.Text({
	text: '',
	x: popTextShiftX,
	y: nameWsText.height() + (2 * popTextShiftX),
	width: popWsRectWidth - (2 * popTextShiftX),
	fill: errorColor,
	fontFamily: globalFont,
	fontSize: 14
});
saveWsGroup.add(popWsErrorText);

var popWsCancelButtonGroup = new Kinetic.Group({
	x: (popWsRectWidth / 2) + popWsButtonShiftX,
	y: popWsRectHeight - (popTextHeight * 1.25),
	name: 'cancel'
});
saveWsGroup.add(popWsCancelButtonGroup);

var popWsCancelButton = new Kinetic.Rect ({
	x: 0,
	y: 0,
	width: popWsButtonWidth,
	height: popWsButtonHeight,
	fill: popButtonColor,
	stroke: 'black',
	strokeWidth: 1,
	shadowColor: 'black',
	shadowEnabled: false
});
popWsCancelButtonGroup.add(popWsCancelButton);

var popWsCancelButtonText = new Kinetic.Text({
	text: "Cancel",
	x: 0,
	y: (popWsButtonHeight - 16) / 2,
	width: popWsButtonWidth,
	fill: 'black',
	fontSize: 16,
	fontFamily: globalFont,
	align: 'center'
});
popWsCancelButtonGroup.add(popWsCancelButtonText);

var popSaveWsButtonGroup = new Kinetic.Group({
	x: (popWsRectWidth / 2) + (2 * popWsButtonShiftX) + popWsButtonWidth,
	y: popWsRectHeight - (popTextHeight * 1.25),
	name: 'save'
});
saveWsGroup.add(popSaveWsButtonGroup);

var popSaveWsButton = new Kinetic.Rect ({
	x: 0,
	y: 0,
	width: popWsButtonWidth,
	height: popWsButtonHeight,
	fill: popButtonColor,
	stroke: 'black',
	strokeWidth: 1,
	shadowColor: 'black',
	shadowEnabled: false
});
popSaveWsButtonGroup.add(popSaveWsButton);

var popSaveWsButtonText = new Kinetic.Text({
	text: "Save",
	x: 0,
	y: (popWsButtonHeight - 16) / 2,
	width: popWsButtonWidth,
	fill: 'black',
	fontSize: 16,
	fontFamily: globalFont,
	align: 'center'
});
popSaveWsButtonGroup.add(popSaveWsButtonText);

popWsCancelButtonGroup.on('mouseup', function(){
	cover.setAttr('visible', false);
	saveWsGroup.setAttr('visible', false);
	showThumbnails();
	screenLayer.draw();
});

var popWsYesButtonGroup = new Kinetic.Group ({
	x: (popWsRectWidth / 2) + (2 * popWsButtonShiftX) + popWsButtonWidth,
	y: popWsRectHeight - (popTextHeight * 1.25),
	name: 'yes',
	visible: false
});

popWsYesButtonGroup.add(new Kinetic.Rect ({
	x: 0,
	y: 0,
	width: popWsButtonWidth,
	height: popWsButtonHeight,
	fill: popButtonColor,
	stroke: 'black',
	strokeWidth: 1,
	shadowColor: 'black',
	shadowEnabled: false
}));

popWsYesButtonGroup.add(new Kinetic.Text({
	text: "Yes",
	x: 0,
	y: (popWsButtonHeight - 16) / 2,
	width: popWsButtonWidth,
	fill: 'black',
	fontSize: 16,
	fontFamily: globalFont,
	align: 'center'
}));

var attempts = 0;
popSaveWsButtonGroup.on('mouseup', function(){
	var newName = nameWsEditText.attrs.text;
	if (wsExists(newName)) {
		popWsErrorText.setAttr('text', '\'' + newName  + '\' is already a workspace.\n' +
			'Do you want to continue anyways?');
		popWsYesButtonGroup.setAttr('visible', true);
		popSaveWsButtonGroup.setAttr('visible', false);
	}
	else {
		saveWorkspace(newName, true);
		currentWorkspace = newName;
		cover.setAttr('visible', false);
		saveWsGroup.setAttr('visible', false);
		showThumbnails();
	}
	screenLayer.draw();
});

popWsYesButtonGroup.on('mouseup', function(){
	var newName = nameWsEditText.attrs.text;
	saveWorkspace(newName, true);
	currentWorkspace = newName;
	cover.setAttr('visible', false);
	saveWsGroup.setAttr('visible', false);
	showThumbnails();
	screenLayer.draw();
});

var openSaveWsPopUp = function() {
	hideThumbnails();
	cover.setAttr('visible', true);
	saveWsGroup.setAttr('visible', true);
	if (currentWorkspace) {
		nameWsEditText.setAttr('text', currentWorkspace);
	}
	screenLayer.draw();
};