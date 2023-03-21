//@ts-check

/**
 * @typedef GameGlobals
 * @property {number} minesLeft
 * @property {boolean} gameStatus
 * @property {number} timeSec
 * @property {any} gameArray
 * @property {number} widthArray
 * @property {number} heightArray
 */

const gameGlobals = {
    currentDifficult: "easy",
    minesLeft: 10,
    minesNumber: 10,
    gameStatus: false,
    isOver: false,
    timeSec: 0,
    gameArray: [],
    widthArray: 9,
    heightArray: 9,
};

/**
 * @typedef Preset 
 * @property {number} fieldWidth
 * @property {number} fieldHeight
 * @property {number} minesNumber
 * @property {number} panelSizeX
 * @property {number} panelSizeY
 */

/**
 * @typedef GameDifficults
 * @type {Object.<string, Preset>} 
 */
const gameDifficults = {
    easy: {
        fieldWidth: 9,
        fieldHeight: 9,
        minesNumber: 10,
        panelSizeX: 354, //354 -44
        panelSizeY: 537, //317 -183
      },
    medium: {
        fieldWidth: 16,
        fieldHeight: 16,
        minesNumber: 40,
        panelSizeX: 620, //620
        panelSizeY: 803, //657
      },
    hard: {
        fieldWidth: 16,
        fieldHeight: 30,
        minesNumber: 1,
        panelSizeX: 1154, //1154
        panelSizeY: 803, //657
      },
};

/**
 * @param {string} elementId 
 * @throws {Error} 
 * @returns {HTMLElement} 
 */
const getElementById = function (elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('element no ok?');
    } 
    return element;
};

let intervalTime 

const statusFace = getElementById('js-statusbar-smile');
const statusFaceSvg = getElementById('js-statusbar-smilesvg');

const minefield = getElementById("js-minefield");

const secHundredths = getElementById('js-statusbartime-hundredths');
const secTenths = getElementById('js-statusbartime-tenths');
const secUnits = getElementById('js-statusbartime-units');

const mineHundredths = getElementById('js-statusminescount-hundredths');
const mineTenths = getElementById('js-statusminescount-tenths');
const mineUnits = getElementById('js-statusminescount-units');

/**
 * Block context menu on the page
 * @returns 
 */
document.oncontextmenu = function (){
    return false
};

/**
 * Random int from min to max
 * @param {number} min minimal number
 * @param {number} max maximal number
 * @returns {number} random number
 */
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};


/**
 * Change in game array cell's status form 0 to -
 * @param {number} xpos x-position of cell
 * @param {number} ypos y-position of cell
 */
function openGroupDefaultCells (xpos, ypos) {
    if (xpos-1 >= 0) {
        if (gameGlobals.gameArray[xpos-1][ypos] === 0) {
            gameGlobals.gameArray[xpos-1][ypos] = '-';
            openGroupDefaultCells(xpos-1, ypos);
        }
    }
    
    if (xpos+1 < gameGlobals.widthArray) {
        if (gameGlobals.gameArray[xpos+1][ypos] === 0) {
            gameGlobals.gameArray[xpos+1][ypos] = '-';
            openGroupDefaultCells(xpos+1, ypos);
        }
    }

    if (ypos-1 >= 0) {
        if (gameGlobals.gameArray[xpos][ypos-1] === 0) {
            gameGlobals.gameArray[xpos][ypos-1] = '-';
            openGroupDefaultCells(xpos, ypos-1);
        }
    }

    if (ypos+1 < gameGlobals.heightArray) {
        if (gameGlobals.gameArray[xpos][ypos+1] === 0) {
            gameGlobals.gameArray[xpos][ypos+1] = '-';
            openGroupDefaultCells(xpos, ypos+1);
        }
    }


    if ((xpos-1 >= 0) && (ypos-1 >= 0)) {
        if (gameGlobals.gameArray[xpos-1][ypos-1] === 0) {
            gameGlobals.gameArray[xpos-1][ypos-1] = '-';
            openGroupDefaultCells(xpos-1, ypos-1);
        }
    }

    if ((xpos-1 >= 0) && (ypos+1 < gameGlobals.heightArray)) {
        if (gameGlobals.gameArray[xpos-1][ypos+1] === 0) {
            gameGlobals.gameArray[xpos-1][ypos+1] = '-';
            openGroupDefaultCells(xpos-1, ypos+1);
        }
    }
    if ((xpos+1 < gameGlobals.widthArray) && (ypos-1 >= 0)) {
        if (gameGlobals.gameArray[xpos+1][ypos-1] === 0) {
            gameGlobals.gameArray[xpos+1][ypos-1] = '-';
            openGroupDefaultCells(xpos+1, ypos-1);
        }
    }

    if ((xpos+1 < gameGlobals.widthArray) && (ypos+1 < gameGlobals.heightArray)) {
        if (gameGlobals.gameArray[xpos+1][ypos+1] === 0) {
            gameGlobals.gameArray[xpos+1][ypos+1] = '-';
            openGroupDefaultCells(xpos+1, ypos+1);
        }
    }
};


function replaceMineView (x, y) {
    const target = getElementById(String(x) + '-' + String(y));
    if ((target.getAttribute('data-image') !== 'question') && (target.getAttribute('data-image') !== 'flag')) {
        const dataValue = openCells(x, y);
        target.classList.replace('minefield__cell-closed', 'minefield__cell-open');
        target.setAttribute('data-image',dataValue);
    }
    
};

/**
 * opening empty areas
 * @param {any} arr game array
 * @param {number} width field width
 * @param {number} height field height
 */
function refreshMineField (arr, width, height) {
    for (let i=0; i<width; i++) {
        for (let j=0; j<height; j++) {
            if (arr[i][j] === '-') {

                replaceMineView(i, j);

                if ((i-1 >=0) && (j-1 >=0)) {
                    if (Number.isInteger(arr[i-1][j-1])) {
                        replaceMineView(i-1, j-1);
                    }
                }
                if (i-1 >=0) {
                    if (Number.isInteger(arr[i-1][j])) {
                        replaceMineView(i-1, j);
                    }
                }
                if ((i-1 >=0) && (j+1 < height)) {
                    if (Number.isInteger(arr[i-1][j+1])) {
                        replaceMineView(i-1, j+1);
                    }
                }
                if (j-1 >= 0) {
                    if (Number.isInteger(arr[i][j-1])) {
                        replaceMineView(i, j-1);
                    }
                }
                if (j+1 < height) {
                    if (Number.isInteger(arr[i][j+1])) {
                        replaceMineView(i, j+1);
                    }
                }
                if ((i+1 < width) && (j - 1 >= 0)) {
                    if (Number.isInteger(arr[i+1][j-1])) {
                        replaceMineView(i+1, j-1);
                    }
                }    
                if (i+1 < width) {
                    if (Number.isInteger(arr[i+1][j])) {
                        replaceMineView(i+1, j);
                    }
                }
                if ((i+1 < width)  && (j + 1 < height)) {
                    if (Number.isInteger(arr[i+1][j+1])) {
                        replaceMineView(i+1, j+1);
                    }
                }
            }
        }
    }
};

/**
 * Check left closed/flagged cells after each open cells 
 * @returns nothing
 */
function isGameWin () {
    let cellsLeft = 0;
    let cellClass;
    for (let i=0; i<gameGlobals.widthArray; i++) {
        for (let j=0; j<gameGlobals.heightArray; j++) {
            cellClass = getElementById(String(i) + '-' + String(j)).classList[0];
            if (cellClass === 'minefield__cell-closed') {
                cellsLeft ++;
                if (cellsLeft > gameGlobals.minesNumber) {
                    return 'game is not over';
                }
            }
        }
    }

    if (cellsLeft === gameGlobals.minesNumber) {
        statusFaceSvg.classList.replace('statusbar__smilenice', 'statusbar__smilewin');
        gameGlobals.isOver = true;
        gameGlobals.gameStatus = false;
       clearInterval(intervalTime);
       fireWork();
    }
};

/**
 * Change game status, stop timer, open all cells 
 * @returns {void}
 */
function endGame () {
    gameGlobals.gameStatus = false;
    gameGlobals.isOver = true;
    clearInterval(intervalTime);
    gameGlobals.timeSec = 0;

    statusFaceSvg.classList.replace('statusbar__smilenice', 'statusbar__smilesad');

    for (let i=0; i<gameGlobals.widthArray; i++) {
        for (let j=0; j<gameGlobals.heightArray; j++) {
            let cell = getElementById(i + '-' + j);
            let dataValue = cell.getAttribute('data-image');

            if (dataValue !== 'question') {
                if ((cell.classList[0] === 'minefield__cell-closed') && (gameGlobals.gameArray[i][j] === 'x') && (dataValue != 'flag')) {
                    cell.classList.replace('minefield__cell-closed', 'minefield__cell-open');
                    cell.setAttribute('data-image', 'mine');
                }

                if ((dataValue === 'flag') && (gameGlobals.gameArray[i][j] != 'x')) {
                    cell.setAttribute('data-image', 'minex');
                }

                if ((cell.classList[0] === 'minefield__cell-closed') && (dataValue === 'none')) {
                    cell.classList.replace('minefield__cell-closed', 'minefield__cell-open');
                    cell.setAttribute('data-image', openCells(i, j));
                }
            }
        }
    }
};

/**
 * Choose cells's class  
 * @param {*} xpos x-position of cell in array
 * @param {*} ypos y-position of cell in array
 * @returns new class of cell
 */
function openCells (xpos, ypos) {
    let dataValue = '';
    switch (gameGlobals.gameArray[xpos][ypos]) {
        case 0:
            dataValue = 'none';
            break;
        case '-':
            dataValue = 'none';
            break;
        case 1:
            dataValue = 'number1';
            break;
        case 2:
            dataValue = 'number2';
            break;
        case 3:
            dataValue = 'number3';
            break;
        case 4:
            dataValue = 'number4';
            break;
        case 5:
            dataValue = 'number5';
            break;
        case 6:
            dataValue = 'number6';
            break;
        case 7:
            dataValue = 'number7';
            break;
        case 'x':
            dataValue = 'mine';
            break;
    }
    return dataValue;
};

/**
 * Left mouse click on the closed cell; change cell's status from default to active
 * @param {*} event 
 */
minefield.onclick = function(event) {
    let target = event.target; 
    let idCell
    let dataValue

    if ((target.tagName === 'SPAN') && (gameGlobals.isOver === false) && (target.getAttribute("data-image") === 'none')) {
        if (gameGlobals.gameStatus === false) {
            idCell = target.id.split('-').map(Number);
            gameGlobals.gameArray = createArray(gameGlobals.gameArray, idCell[0], idCell[1], gameGlobals.widthArray, gameGlobals.heightArray, gameGlobals.minesNumber);
            gameGlobals.gameStatus = true;
            gameGlobals.timeSec = 1;
            refreshStatusNumbers(true);
            intervalTime = setInterval(timer, 1000);
        }

        idCell = target.id.split('-');
        dataValue = openCells(idCell[0], idCell[1]);
        target.classList.replace('minefield__cell-closed', 'minefield__cell-open');
        target.setAttribute("data-image", dataValue);

        isGameWin();

        idCell = idCell.map(Number);
        if (dataValue === 'none') {
            gameGlobals.gameArray[idCell[0]][idCell[1]] = '-';
            openGroupDefaultCells(idCell[0], idCell[1]);
            refreshMineField(gameGlobals.gameArray, gameGlobals.widthArray, gameGlobals.heightArray);
        }

        printArray(gameGlobals.gameArray, gameGlobals.widthArray, gameGlobals.heightArray);

        if (dataValue === 'mine') {
            target.classList.replace('minefield__cell-open', 'minefield__cell-boom');
            endGame();
        }
    } 
};


/**
 * Right mouse click on the closed cells; mark cells with flag or question. Change left mines number
 * @param {MouseEvent} event 
 */
minefield.oncontextmenu = function(event) {
    event.preventDefault();

    const target = event.target; 
    if (target === null) {
        return
    }

    if ((target.tagName === 'SPAN') && (gameGlobals.isOver === false) && (target.classList[0] === 'minefield__cell-closed')) {
        switch (target.getAttribute('data-image')) {  
            case 'question':
                target.setAttribute("data-image", "none");
                break
            case 'flag':
                gameGlobals.minesLeft ++;
                target.setAttribute("data-image", "question");
                break
            case 'none':
                gameGlobals.minesLeft --;
                target.setAttribute("data-image", "flag");
                break
            default:
                console.log('default');
        }
        refreshStatusNumbers(false);
    } 
};

/**
 * Refresh mines count or time in the status bar
 * @param {boolean} flagStatus true = change numbers in time, false = change numbers in mine's count
 */
function refreshStatusNumbers (flagStatus) {
    if (flagStatus) {
        let numbersClasses = numberDivide(gameGlobals.timeSec);
        secUnits.setAttribute("data-value", numbersClasses[0]);
        secTenths.setAttribute("data-value", numbersClasses[1]);
        secHundredths.setAttribute("data-value", numbersClasses[2]);
    }
    if ((gameGlobals.minesLeft >=0) && (flagStatus === false)){
        let numbersClasses = numberDivide(gameGlobals.minesLeft);
        mineUnits.setAttribute("data-value", numbersClasses[0]);
        mineTenths.setAttribute("data-value", numbersClasses[1]);
        mineHundredths.setAttribute("data-value", numbersClasses[2]);
    }
};

/**
 * Timer for update current game time; refreshing numbers classes
 */
function timer () {
    gameGlobals.timeSec++;
    refreshStatusNumbers(true);
};

/**
 * Divides one number into three separate
 * @param {number} xxx number
 * @returns {string[]} array with three numbers
 */
function numberDivide (xxx) {
    let units = String(xxx % 10)
    xxx = Math.floor(xxx / 10)

    let tenths = String(xxx % 10)
    xxx = Math.floor(xxx / 10)

    let hundredths = String(xxx % 10)
    xxx = Math.floor(xxx / 10)

    return [units, tenths, hundredths]
};

/**
 * Spawning mines on the field
 * @param {number} fieldWidth field size width
 * @param {number} fieldHeight field size height
 */

function spawnMinefieldCells(fieldWidth, fieldHeight) {
    minefield.innerHTML = '';

    for (let i = 0; i < fieldWidth; i++) {
        for (let j = 0; j < fieldHeight; j++) {
            let span = document.createElement('span');
            span.className = 'minefield__cell-closed';
            span.dataset.image = 'none';
            span.id = i + '-' + j;
            minefield.appendChild(span);
        }
    }
};

/**
 * Function for start new game; changing panels size; refresh mines left; change game status etc
 */
function startGame () {
    const framePanel = getElementById("js-frame-panel");
    const framePanelStatus = getElementById("js-frame-panel-status");
    const framePanelDifficult = getElementById("js-frame-panel-difficult");
    const framePanelGamespace = getElementById("js-frame-panel-gamespace");

    statusFaceSvg.classList.replace(statusFaceSvg.classList[0], 'statusbar__smilenice');

    let widthSize = 0;
    let heightSize = 0;

    gameGlobals.gameStatus = false;
    gameGlobals.isOver = false;

    clearInterval(intervalTime);
    gameGlobals.timeSec = 0;

    refreshStatusNumbers(true);

    deleteFireWorks();

    switch (gameGlobals.currentDifficult) {
        case 'easy':
            gameGlobals.minesLeft = gameDifficults.easy.minesNumber;
            gameGlobals.minesNumber = gameGlobals.minesLeft;
            widthSize = gameDifficults.easy.panelSizeX;
            heightSize = gameDifficults.easy.panelSizeY;
            gameGlobals.widthArray = gameDifficults.easy.fieldWidth;
            gameGlobals.heightArray = gameDifficults.easy.fieldHeight;
            spawnMinefieldCells(gameDifficults.easy.fieldWidth, gameDifficults.easy.fieldHeight);
            break
        case 'medium':
            gameGlobals.minesLeft = gameDifficults.medium.minesNumber;
            gameGlobals.minesNumber = gameGlobals.minesLeft;
            widthSize = gameDifficults.medium.panelSizeX;
            heightSize = gameDifficults.medium.panelSizeY;
            gameGlobals.widthArray = gameDifficults.medium.fieldWidth;
            gameGlobals.heightArray = gameDifficults.medium.fieldHeight;
            spawnMinefieldCells(gameDifficults.medium.fieldWidth, gameDifficults.medium.fieldHeight);
            break
        case 'hard':
            gameGlobals.minesLeft = gameDifficults.hard.minesNumber;
            gameGlobals.minesNumber = gameGlobals.minesLeft;
            widthSize = gameDifficults.hard.panelSizeX;
            heightSize = gameDifficults.hard.panelSizeY;
            gameGlobals.widthArray = gameDifficults.hard.fieldWidth;
            gameGlobals.heightArray = gameDifficults.hard.fieldHeight;
            spawnMinefieldCells(gameDifficults.hard.fieldWidth, gameDifficults.hard.fieldHeight);
            break
        default:
            console.log('error');
    }

    refreshStatusNumbers(false);

    framePanel.style.width = widthSize + 'px';
    framePanel.style.height = heightSize + 'px';
    framePanelStatus.style.width = (widthSize) + 'px';
    framePanelDifficult.style.width = (widthSize) + 'px';
    framePanelGamespace.style.width = (widthSize) + 'px';
    framePanelGamespace.style.height = (heightSize - 183) + 'px';
    
};

/**
 * Function for change game difficult and status of buttons
 * @param {string} id game difficult (easy medium hard)
 */
function changeDifficult (id) {
    gameGlobals.currentDifficult = id;
    let difficultButton = getElementById('js-button-difficult-'+gameGlobals.currentDifficult);
    difficultButton.style.background = "#6d6d6d";
    switch (id) {
        case 'easy':
            getElementById('js-button-difficult-medium').style.background = 'white';
            getElementById('js-button-difficult-hard').style.background = 'white';
            break
        case 'medium':
            getElementById('js-button-difficult-easy').style.background = 'white';
            getElementById('js-button-difficult-hard').style.background = 'white';
            break
        case 'hard':
            getElementById('js-button-difficult-easy').style.background = 'white';
            getElementById('js-button-difficult-medium').style.background = 'white';
            break
        default:
            console.log('error');
      }
};

/**
 * Start button (smile button) mouse down
 * @param {MouseEvent} event
 */
function smileButtonMouseDown(event) {
    if (event.button !== 0 ){
        return
    }
    statusFace.classList.add('statusbar__smileup');
    statusFace.classList.remove('statusbar__smiledown');
    startGame();
};

/**
 * Start button (smile button) mouse up
 */
function smileButtonMouseUp() {
    statusFace.classList.add('statusbar__smiledown');
    statusFace.classList.remove('statusbar__smileup');
};

/**
 * Create two-dimensional array with mines and numbers
 * @param {any} arr array
 * @param {number} startPositionX x-position of first clicked cell
 * @param {number} startPositionY y-position of first clicked cell
 * @param {number} width field width
 * @param {number} height field height
 * @returns
 */
function createArray (arr, startPositionX, startPositionY, width, height, minesCount) {
    //initialization with zero's
    arr = []
    gameGlobals.gameArray = [];
    for (let i=0; i<width; i++) {
        arr[i] = new Array();
        for (let j=0; j<height; j++) {
            arr[i][j] = 0;
        }
    }
    //filling field with mines
    while (minesCount != 0) {
        let x = randomInteger(0, width-1);
        let y = randomInteger(0, height-1);
        if ((arr[x][y] === 0) && (x != startPositionX) && (y != startPositionY) /*&& (x != startPositionX - 1) && (x != startPositionX + 1) && (y != startPositionY - 1) && (y != startPositionY + 1)*/) {
            arr[x][y] = 'x';
            minesCount = minesCount - 1;
        }
    }
    //create numbers around mines
    let count_mines = 0
    for (let i=0; i<width; i++) {
        for (let j=0; j<height; j++) {
            if (arr[i][j] === 0) {
                if ((i-1 >=0) && (j-1 >=0)) {
                    if (arr[i-1][j-1] === 'x') {
                        count_mines += 1;
                    }
                }
                if (i-1 >=0) {
                    if (arr[i-1][j] === 'x') {
                        count_mines += 1;
                    }
                }
                if ((i-1 >=0) && (j+1 < height)) {
                    if (arr[i-1][j+1] === 'x') {
                        count_mines += 1;
                    }
                }
                if (j-1 >= 0) {
                    if (arr[i][j-1] === 'x') {
                        count_mines += 1;
                    }
                }
                if (j+1 < height) {
                    if (arr[i][j+1] === 'x') {
                        count_mines += 1;
                    }
                }
                if ((i+1 < width) && (j - 1 >= 0)) {
                    if (arr[i+1][j-1] === 'x') {
                        count_mines += 1;
                    }
                }    
                if (i+1 < width) {
                    if (arr[i+1][j] === 'x') {
                        count_mines += 1;
                    }
                }
                if ((i+1 < width)  && (j + 1 < height)) {
                    if (arr[i+1][j + 1] === 'x') {
                        count_mines += 1;
                    }
                }
                arr[i][j] = count_mines;
                count_mines = 0;
            }
        }
    }

    let str = '';
    for (let i=0; i<width; i++) {
        str = '';
        for (let j=0; j<height; j++) {
            str = str + ' ' + arr[i][j];
        }
    console.log(str + '\n');
    }   

    return arr;
};

function printArray (arr, width, height) {
    console.log('\n');
    let str = '';
    for (let i=0; i<width; i++) {
        str = '';
        for (let j=0; j<height; j++) {
            str = str + ' ' + arr[i][j];
        }
    console.log(str + '\n');
    }   
};

changeDifficult (gameGlobals.currentDifficult);
startGame();

/**
 * Make salut when win
 */
function fireWork () {
    for (let i = 0; i < 10; i ++) {
        setTimeout(() => {
            const potolok = randomInteger(100, 300);
            let position = 1500;
            let left = randomInteger(0, 1000);

            let span = document.createElement('span');
            span.className = 'square';
            span.style.left = left + 'px';
            span.style.top = '1500px';
            document.body.appendChild(span);
            const intervalId = setInterval(() => {
                if (gameGlobals.isOver === false) {
                    clearInterval(intervalId);     
                }
                if (position > potolok) {
                    position -= 5;
                    span.style.top = position + 'px';   
                } else {
                    document.body.removeChild(span);
                    clearInterval(intervalId);
                    for (let i = 0; i < 10; i ++) {
                        setTimeout(() => {
                            let span = document.createElement('span');
                            span.className = 'd1';
                            span.style.top = (position+randomInteger(-200,200)) + 'px';
                            span.style.left = (left+randomInteger(-200,200)) + 'px';
                            span.style.backgroundColor = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
                            document.body.appendChild(span);
                        }, randomInteger(500, 1000));
                    }
                }
            }, 10);
        }, randomInteger(100, 1000));

    }
};

function deleteFireWorks () {
    const elementList = document.querySelectorAll('.d1, .square');
    console.log(elementList);
    elementList.forEach(element => document.body.removeChild(element));
};