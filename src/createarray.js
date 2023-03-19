let arr = []
let width = 10;
let height = 10;

let minesCount = 10;


function createArray (startPosition, width, height) {
    //напоняю нулями
    for (i=0; i<width; i++) {
        arr[i] = new Array();
        for (j=0; j<height; j++) {
            arr[i][j] = 0;
        }
    }
    //наполняю минами
    while (minesCount != 0) {
        let x = randomInteger(0, width-1);
        let y = randomInteger(0, height-1);
        if (arr[x][y] == 0) {
            arr[x][y] = 'x';
            minesCount = minesCount - 1;
        }
    }
    //формирую числа вокруг мин
    let count_mines = 0
    for (i=0; i<width; i++) {
        for (j=0; j<height; j++) {
            if (arr[i][j] == 0) {
                if ((i-1 >=0) && (j-1 >=0)) {
                    if (arr[i-1][j-1] == 'x') {
                        count_mines += 1;
                    }
                }
                if (i-1 >=0) {
                    if (arr[i-1][j] == 'x') {
                        count_mines += 1;
                    }
                }
                if ((i-1 >=0) && (j+1 < height)) {
                    if (arr[i-1][j+1] == 'x') {
                        count_mines += 1;
                    }
                }
                if (j-1 >= 0) {
                    if (arr[i][j-1] == 'x') {
                        count_mines += 1;
                    }
                }
                if (j+1 < height) {
                    if (arr[i][j+1] == 'x') {
                        count_mines += 1;
                    }
                }
                if ((i+1 < width) && (j - 1 >= 0)) {
                    if (arr[i+1][j-1] == 'x') {
                        count_mines += 1;
                    }
                }    
                if (i+1 < width) {
                    if (arr[i+1][j] == 'x') {
                        count_mines += 1;
                    }
                }
                if ((i+1 < width)  && (j + 1 < height)) {
                    if (arr[i+1][j + 1] == 'x') {
                        count_mines += 1;
                    }
                }
                arr[i][j] = count_mines;
                count_mines = 0;
            }
        }
    }
    return arr;
}
//вывожу в консось
let pizda = '';
for (i=0; i<width; i++) {
    pizda = '';
    for (j=0; j<height; j++) {
        pizda = pizda + ' ' + arr[i][j];
    }
    console.log(pizda + '\n');
}






if (xpos-1 >= 0) {
    document.getElementById((xpos - 1) + '-' + ypos).classList.replace('minefield__cell-default', (openCells(xpos-1, ypos)));
    if (openCells(xpos-1, ypos) == 'minefield__cell-active') {
            openGroupDefaultCells (xpos-1, ypos);
    }
}

if (ypos-1 >= 0) {
    document.getElementById((xpos) + '-' + (ypos - 1)).classList.replace('minefield__cell-default', (openCells(xpos, ypos - 1)));
    if (openCells(xpos, ypos - 1) == 'minefield__cell-active') {
            openGroupDefaultCells (xpos, ypos - 1);
    }
}

if (xpos+1 <= gamePresets.widthArray) {
    document.getElementById((xpos + 1) + '-' + ypos).classList.replace('minefield__cell-default', (openCells(xpos+1, ypos)));
    if (openCells(xpos+1, ypos) == 'minefield__cell-active') {
            openGroupDefaultCells (xpos+1, ypos);
    }
}

if (ypos+1 <= gamePresets.heightArray) {
    document.getElementById((xpos) + '-' + (ypos + 1)).classList.replace('minefield__cell-default', (openCells(xpos, ypos + 1)));
    if (openCells(xpos, ypos + 1) == 'minefield__cell-active') {
            openGroupDefaultCells (xpos, ypos + 1);
    }
}

