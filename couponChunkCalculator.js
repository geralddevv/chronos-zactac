let paperWidth = 297;
let paperHeight = 420;
let cpnWidth = 42;
let cpnHeight = 75;

let baseCol = paperWidth;
let baseRow = paperHeight;
let marginX;
let marginY;
let cpnXCount = 0;
let cpnYCount = 0;

while (baseCol > cpnWidth) {
    baseCol-=cpnWidth;
    cpnXCount+=1;
    // console.log("baseCol:", baseCol);
    marginX = baseCol/2;
}
console.log("MarginX: " + marginX);

while (baseRow > cpnHeight) {
    baseRow-=cpnHeight;
    cpnYCount+=1;
    // console.log("baseRow:", baseRow);
    marginY = baseRow/2;
}
console.log("MarginY: " + marginY);

console.log("cpnXCount: " + cpnXCount);
console.log("cpnYCount: " + cpnYCount);

let totalCpnCount = cpnXCount * cpnYCount;
console.log("totalCpnCount (chunk): " + totalCpnCount);
