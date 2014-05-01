// The MIT License (MIT)

// Copyright (c) 2014 Marlon Reghert Alves dos Santos (mras)

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var EPS = Math.pow(10, -8); // EPS constant for float numbers
var EPSLU = Math.pow(10, -4);
var DIGITS = 5;
// initial matrix
var matrix = [];
var matrixL = [];
var matrixA = [];
var matrixP = [];
var singular = false;



var steps = new Steps(); // init step storage; // store all steps
var stepsL = new Steps();
function swapRow(matrix, a, b, stopMid) { // swap row 'a' with 'b'
    
    if(a!=b) {
        var aux;
        if( !isNaN(stopMid) && stopMid!=undefined && stopMid!=null && stopMid) { // swapping L matrix 
            stopMid = Math.min(a,b); // stop at min 
            /*
                1 0 0             ->   1 0 0
                |3 |1 0  <- a     ->   4 1 0 
                |4 |? 1  <- b     ->   3 0 1 
            */
            for(var i = 0; i < matrix[a].length && i  < stopMid; i++){
                aux = matrix[a][i];
                matrix[a][i] = matrix[b][i];
                matrix[b][i] = aux;
            }

        }
        else {
//                steps.saveStep(matrix, "Swap row nº" + (a + 1) + " with row nº" + (b + 1)); // save this step
                aux = matrix[a];
                matrix[a] = matrix[b];
                matrix[b] = aux;

                /*        if(teste==0){
                        alert('etntrou');
                        steps.saveStep(matrix, 'Swaped row ('+a +') with row ('+ b+' )' );    
                        alert(steps.list.length);
                        a++;
                    }*/
        }
    }
 


}



function subRows(matrix, a, b, k, info) { // sub row 'b' of row 'a' by a factor K from matrix
    if (k) {
        var description = "Subtract row nº" + (b + 1) + " by aprox. " + fixNumber(k, DIGITS) + " times row nº" + (a + 1) + " " + info;
        description = breakFactorDescription(description, "strong");
        steps.saveStep(matrix, description); // save this step
        len = matrix[a].length;
        for (var i = 0; i < len; i++) {
            matrix[b][i] = Math.abs(matrix[b][i] - k * matrix[a][i]) <= EPS ? 0 : matrix[b][i] - k * matrix[a][i];
            matrix[b][i] = fixNumber(matrix[b][i], DIGITS);
        }
    }


}

function multiplyRow(matrix, a, k, ceil) { // multiply row 'a' from matrix by a factor K, if ceil... the result will be ceiled

    for (var i = 0; i < matrix[a].length; i++) {
        matrix[a][i] *= k;
        if (ceil && i == a) matrix[a][i] = Math.ceil(matrix[a][i]);
        matrix[a][i] = fixNumber(matrix[a][i], DIGITS);
    }

}

/*
You can assume that matrixA and matrixB both consist of a 'array of arrays'
Compare whether two matrices are equals
in other words, check:
if they have same dimensions:
 
if matrixA is 'n by m' and matrixB is 'w by z'
then: n==w and and m==z
if all elements are equals:
matrixA[i][j] == matrixB[i][j]
return:
true: matrixA == matrixB
false: otherwise
function equalsMatrices(matrixA, matrixB)
*/

var equalsMatrices = function(matrixA, matrixB) {

    var n = matrixA.length;
    var m = matrixA[0].length;
    var w = matrixB.length;
    var z = matrixB[0].length;
    if (n != w || m != z) return false;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if (matrixA[i][j] != matrixB[i][j]) return false;
        }
    }
    return true;

};

/*
return matrixA times matrixB
you can assume that:
if matrixA is 'n by m' and matrixB is 'w by z'
then: m==w
function multiplyMatrices(matrixA, matrixB)*/

var multiplyMatrices = function(matrixA, matrixB) {

    var n = matrixA.length;
    var m = matrixB.length;
    var z = matrixB[0].length;
    var matrixF = [];

    for (var i = 0; i < n; i++) {
        matrixF.push([]);
        for (var j = 0; j < z; j++) {
            var result = 0;
            for (var k = 0; k < m; k++) {
                result += matrixA[i][k] * matrixB[k][j];
            }
            matrixF[i].push(result);
        }
    }
    return matrixF;

};

/*
If given a string in this format:
"Subtract row nºA by aprox. K times row nº2 (where matrix[a][b]/matrix[c][d] defines this factor)"
then you must return a string in this format:
"Subtract row nºA by aprox. W times row nº2 (where matrix[a][b]/matrix[c][d] defines this factor)"
 
Or, if given a string in this format:
"Multiply row nºA per aprox K (where 1/matrix[i][j]) defines this factor"
then you must return a strin in this format:
"Multiply row nºA per aprox K (where 1/matrix[i][j]) defines this factor"
 
Assume that 'tag' parameter and 'description' paremeter are string's.
So you put the 'K' number at 'description' between 'tag' parameter'
function breakFactorDescription(description, tag)*/
var generatePermutationMatrix = function(matrixA, matrixB) {

    var actualLines = [];
    var n = matrixA.length;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var bool = true;
            for (var k = 0; k < n; k++) {
                if (matrixA[i][k] != matrixB[j][k]) {
                    bool = false;
                }
            }
            if (bool) {
                actualLines.push(j);
            }
        }
    }
    if(actualLines.length==0) console.log('LENGTH 0');
    var matrixPerm = [];

    for (var i = 0; i < n; i++) {
        matrixPerm.push([]);
        for (var j = 0; j < n; j++) {
            if (j == actualLines[i]) {
                matrixPerm[i].push(1);
            } else {
                matrixPerm[i].push(0);
            }
        }
    }

    return matrixPerm;

};



function echelonMatrix(matrix) { // get a echelon form of a matrix and return if a matrix is singular
    singular = false;
    matrixA = cloneMatrix(matrix);
    if(matrix.length != matrix[0].length) singular =true; // matrix is not a square matrix
    for (var i = 0; i < matrix.length; i++) {
        // check the bounds for a pivot
        if (i > matrix[i].length) {
            singular = true;
            break;
        }

        // find a valid pivot
        if (!matrix[i][i]) {
            for (var j = i + 1; j < matrix.length; j++) {
                if (matrix[j][i]) {
                    steps.saveStep(matrix, "Swap row nº" + (i+ 1) + " with row nº" + (j+ 1)); // save this step
                    swapRow(matrix, i, j);
                    swapRow(matrixL, i, j, true);
                    break;
                }
            }
        }
        //if found a pivot
        if (!matrix[i][i]) {
            singular = true;
            break;
        }
        var pivot = matrix[i][i];
        // sub all rows
        for (var j = i + 1; j < matrix.length; j++) {
            factor = (matrix[j][i] / pivot);
            var info = "(where matrix[" + (j + 1) + "][" + (i + 1) + "]/" + "matrix[" + (i + 1) + "][" + (i + 1) + "] defines this factor)";
            subRows(matrix, i, j, factor, info);
            matrixL[j][i] = factor;
            stepsL.saveStep(matrixL, "Put "+factor+" at your L matrix at: matrixL["+j+"]["+i+"].");
        }



    }
    swapRowsNulls(matrix);



    console.log('Matrix A');
    logMatrix(matrixA);
    console.log('Matrix U:');
    logMatrix(matrix);


    if(!singular){

        console.log('Matrix L:');
        logMatrix(matrixL);
        matrixLU = multiplyMatrices(matrixL, matrix);
        fixMatrix(matrixLU,DIGITS, true, matrixA);
        console.log('Matrix L*U:');
        logMatrix(matrixLU);
        matrixP = generatePermutationMatrix(matrixA, matrixLU ); // P * A = L * U
        console.log('Matrix P:');
        logMatrix(matrixP); 
    }
    else console.log('Matrix singular..');


    return singular;
}



function findPivotReduce(matrix, a) { // find the pivot for the reduce method of a matrix on row 'a'
    var pivot = 0;
    var pos = 0;
    for (var j = 0; j < matrix[a].length; j++)
        if (matrix[a][j] != 0) {
            pivot = matrix[a][j];
            pos = j;
        }
    return {
        pivot: pivot,
        pos: pos
    };

}

function swapRowsNulls(matrix) { // swap all rows that are null to bottom of matrix
    // swap all not rows that doesn't have a pivot
    for (var i = 0; i < matrix.length; i++) {

        if (i < matrix[i].length && !matrix[i][i]) {
            var j = i;
            var found = false;
            while (!found) {
                if (j > matrix[i].length || found) break;
                for (var k = i; k < matrix.length && !found; k++) { // for each line
                    if (matrix[k][j]) {
                        steps.saveStep(matrix, "Swap row nº" + (i + 1) + " with row nº" + (k + 1)); // save this step                        
                        swapRow(matrix, i, k);
                        found = true;
                    }
                }
                j++;
            }

        }
    }
}



function reduceMatrix(matrix) {
    /*
                We expect that the matrix is always on echelon form
        */

    // swapRowsNulls(matrix);


    for (var i = matrix.length - 1; i >= 0; i--) { // for all rows
        var pivot = 0;
        var pivotPos = 0;
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] != 0) {
                pivotPos = j;
                pivot = matrix[i][j];
                break;
            }
        }

        if (!pivot) continue;

        for (var j = i - 1; j >= 0; j--) {
            var factor = matrix[j][pivotPos] / pivot;
            var info = "(where matrix[" + (j + 1) + "][" + (pivotPos + 1) + "]/matrix[" + (i + 1) + "][" + (pivotPos + 1) + "]" + " defines this factor)";
            subRows(matrix, i, j, factor, info);
        }
        var k = 1 / pivot;
        if (!(k == 1)) {
            // save step and strong the factor
            steps.saveStep(matrix, breakFactorDescription("Multiply row nº" + (i + 1) + " per aprox " + fixNumber(k, DIGITS) + " (where  1/matrix[" + (i + 1) + "][" + (pivotPos + 1) + "] defines this factor)", "strong")); // save this step
            multiplyRow(matrix, i, k, true);
        }
    }
}


function check(matrix) { //check if has some term (i,j) that is NaN or undefined
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (isNaN(matrix[i][j]) || matrix[i][j] == undefined) return true;
        };
    };
    return false;
}

function fixNumber(number, digits) {
    var rounded = number.toFixed(digits);
    rounded = parseFloat(rounded);
    return (rounded % 1) ? rounded : parseFloat(rounded.toFixed(0));

}

function findElementAprox(matrix, element, EPS){

    for(var i=0;i<matrix.length;i++){
        for(var j=0;j<matrix[i].length;j++) {

            if(Math.abs(matrix[i][j] - element) <= EPSLU  ){
                element=matrix[i][j];

            }
        }
    }
    return element;
}


function fixMatrix(matrix, digits, luRound, matrixFind) { // round all matrix[i][j] by the number of 'digits'
    var rounded = 0;
    console.log('luRound:' + luRound);
    luRound =  (luRound!=undefined && luRound!=null && !isNaN(luRound) && luRound) ? true : false;  // aprox elements of a LU multiply result matrix 
    console.log('luRound:' + luRound);
    for (var i = 0; i < matrix.length; i++)
        for (var j = 0; j < matrix[i].length; j++)
            if (matrix[i][j] % 1) {
                rounded = matrix[i][j].toFixed(digits);
                rounded = parseFloat(rounded);
                matrix[i][j] = (rounded % 1) ? rounded : parseFloat(rounded.toFixed(0));
                if(luRound) matrix[i][j] = findElementAprox(matrixFind, matrix[i][j], EPSLU);
            }
}

function fixMatrixEchelon(matrix, lim) {
    /*
        Check and verify if the echelon got some error
        and if got, study if it's a EPS error or a powerful error
    */
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < i && j < matrix[i].length; j++) {
            if (matrix[i][j] != 0) {
                if (matrix[i][j] <= lim && matrix[i][j] > 0) matrix[i][j] = 0;
                else {                                                          
                    return {
                        fixed: false,
                        i: i,
                        j: j
                    };
                }
            }
        }
    }
    return {
        fixed: true,
        i: 0,
        j: 0
    };
}


function getMaxELementLength(matrix){ // return the element whose length is the bigger
    var maxLength = 0;

    for(var i = 0; i < matrix.length; i++)
        for(var j = 0 ; j < matrix[i].length; j++)
            maxLength = Math.max(maxLength, matrix[i][j].toString().length);

    return maxLength;
}

function htmlMatrix(matrix) { // return a matrix at html format, i.e: tbody,tr and td elements 



    var htmlString = document.createElement('tbody');

    for (var i = 0; i < matrix.length; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < matrix[i].length; j++) {
            var cell = document.createElement('td');
            cell.innerHTML = matrix[i][j];
            row.appendChild(cell);
        }
        htmlString.appendChild(row);
    }

    return htmlString;
}



function Steps() {
    /*
        Entity that store all information about steps on operation
    */
    this.list = [];
    this.actual = 0;
    this.size = 0;


    this.restart = function() {
        this.list = [];
        this.actual = 0;
        this.size = 0;
    }

    this.saveStep = function(matrix, description) {
        //alertMatrix(matrix);
        this.list[this.list.length] = {
            matrix: matrix,
            description: description,
            matrixHtml: htmlMatrix(matrix)
        };
        this.size++;
    }

    this.getNext = function() {
        if (this.actual >= this.list.length) return 0;
        return this.list[this.actual++];
    }

    this.logSteps = function(){
        for(var i=0; i < this.list.length; i++){
            console.log('Step: ' +( i+1));
            logMatrix(this.list[i]);
        }

    }

    this.getAllHtml = function() {

    }

    this.generateStepHtml = function(step) {

        // get the matrix
        var matrix = this.list[step];

        if (matrix == undefined || matrix.matrixHtml == undefined) {
            console.log('step undefined: ' + step);
        }

        var matrixHtml = matrix.matrixHtml;

        var descriptionText = matrix.description;


        // create all elements nescessary 
        var container = document.createElement('div');
        container.setAttribute('class', 'container');
        container.setAttribute('id', 'containerStep');

        //generate the step descriptuion
        var containerDescr = document.createElement('div');
        containerDescr.setAttribute('class', 'container');
        containerDescr.setAttribute('id', 'containerDescr');

        var title = document.createElement('h1');
        title.setAttribute('id', 'stepNumber');
        var description = document.createElement('strong');
        description.setAttribute('id', 'descriptionStep');

        //set description
        title.innerHTML = 'Step: ' + (step + 1);
        description.innerHTML = descriptionText;

        // apend child's from description
        containerDescr.appendChild(title);
        containerDescr.appendChild(description);

        container.appendChild(containerDescr);

        row = generateRowMatrixHtml(matrixHtml);
        container.appendChild(row);

        return container;
    }
}

function generatePALUContainerHtml(matrixP, matrixA, matrixL, matrixU){
    matrixP = generateRowMatrixHtml(htmlMatrix(matrixP));
    matrixA = generateRowMatrixHtml(htmlMatrix(matrixA));
    matrixU = generateRowMatrixHtml(htmlMatrix(matrixU));
    matrixL = generateRowMatrixHtml(htmlMatrix(matrixL));

    var containerResults = document.getElementById('myContainerResults');
    containerResults.appendChild(matrixP);
    containerResults.appendChild(matrixA);
    containerResults.appendChild(matrixL);
    containerResults.appendChild(matrixU);


}

function generateRowMatrixHtml(matrixHtml){ // generate a row (div) containing the matrix argument 

        var row = document.createElement('div');
        row.setAttribute('class', 'row');

        // genarete a col with results
        var col = document.createElement('div');
        col.setAttribute('class', 'col-xs-12');

        var divResponsive = document.createElement('div');
/*        divResponsive.setAttribute('class', 'table-responsive');*/
        divResponsive.setAttribute('id', 'resultsResponsive');

        var table = document.createElement('table');
        table.setAttribute('class', 'box table table-bordered');
        table.setAttribute('id', 'matrixResultsHolder');



        //append child's from container
        table.appendChild(matrixHtml);
        divResponsive.appendChild(table);


        // append child's from table
        col.appendChild(divResponsive);
        row.appendChild(col);

        setTableWidth(matrix, table);

        return row;
}
