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



/*

var n=window.localStorage.getItem('(n');
var m=window.localStorage.getItem('m');
var reduced = window.localStorage.getItem('reduced') === 'true';

*/
var n = 0,
  m = 0,
  reduced = false;
var runningStep = false; // prevent two clicks on step-by-step button

function getMatrix() { //search on span whose id is "holdMatrix"

    for (var i = 0; i < n; i++) { // init matrix
        matrix[i] = [];
        for (var j = 0; j < m; j++) {
            matrix[i][j] = 0;
        }
    };

    var matrixInput = document.getElementById('holdMatrix');
    var rows = matrixInput.getElementsByTagName('div');
    // get the matrix from inputs \/
    for (var i = 0; i < n; i++) {
        var cols = rows[i].getElementsByTagName('input');
        for (var j = 0; j < m; j++) {

            if (cols[j].value !== "") matrix[i][j] = parseFloat(cols[j].value);
            //else matrix[i][j] = Math.floor(Math.random() * 99999); // use to debug
            else matrix[i][j] = 0;

        }

    }
}

function generateMatrix(n, m) {
  /*
  Generate a \/ n by m
  as id="holdMatrix" chield
       <div class="row" >
        <input type="number" class="form-control" placeholder="0">
        <input type="number" class="form-control" placeholder="0">                      
        <input type="number" class="form-control" placeholder="0">
      </div>  */



  //restart this span
  var oldHoldMatrix = document.getElementById('holdMatrix');
  var neWHoldMatrix = document.createElement('span');
  neWHoldMatrix.setAttribute('id', 'holdMatrix');
  oldHoldMatrix.parentNode.replaceChild(neWHoldMatrix, oldHoldMatrix);


  for (var i = 0; i < n; i++) {
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    holdMatrix.appendChild(row);
    for (var j = 0; j < m; j++) {
      var input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("class", "form-control");
      input.setAttribute("placeholder", "0");
      input.setAttribute("id", "elementInput");

      row.appendChild(input);
    }
  }


  $("input[id='elementInput']").numeric();

}



function restartElement(id, el, callback) { // restart a element and preserve id and class


  var old = document.getElementById(id);
  var aux = document.createElement(el);
  aux.setAttribute('id', old.getAttribute('id'));
  aux.setAttribute('class', old.getAttribute('class'));


  old.parentNode.replaceChild(aux, old);

  if (!isNaN(callback) && !(callback == undefined) && !(callback == null) && (typeof callback == "function")) callback();

}

function restartDiv(id) {
  var old = document.getElementById(id);

}

function htmlToString(objHtml) {

}


function setTableWidth(matrix, table){
  var maxElementLength = getMaxELementLength(matrix);
  table.style.width = (1.5*maxElementLength)*m;
}


$(document).ready(function() {



  // hide results and step pages
  $("#myContainer").hide();
  $("#myContainerResults").hide();
  $("#mySteps").hide();
  $("#myPALUResults").hide();


  $("#indexGo").click(function() {

    var select = document.getElementsByTagName('select');
    n = select[0].options[select[0].selectedIndex].text;
    m = select[1].options[select[1].selectedIndex].text;
    reduced = document.getElementById('checkboxes-0').checked;
    if(m==1) {
      $(".box").removeClass('multipleCols');
      $(".box").addClass('oneCol');
    }
    else {
      $(".box").removeClass('oneCol');
      $(".box").addClass('multipleCols');      
    }
    //restart the amtrix



    $("#myIndexContainer").fadeOut("fast", function() {
      generateMatrix(n, m);
      $("elementInput");
      $("#myContainer").ready(function() {
        //var width = $("input.form-control:number").css('width');
        var width = parseInt($("input.form-control").css('width'));
        document.getElementById('myContainer').style.minWidth = width * m;
        $("#myContainer").fadeIn("fast");
      });


    });
  });


  var matrixResultsHolder;
  // set all button's events
  $("#echelonButton").click(function() {
    // restart matrix
    matrix = [];
    matrixL = [];
    initMatrix(matrix, n , m );
    initMatrix(matrixL, n, m);
    initMatrix(matrixP, n,m,true); 

    getMatrix(); // get the matrix via html tags

    echelonMatrix(matrix);


    if (reduced) reduceMatrix(matrix);


    fixMatrix(matrix, DIGITS); // round results


    var resultFix = fixMatrixEchelon(matrix, 0.0001);
    //alert(resultFix.fixed);
    if (!resultFix.fixed) { // alert about bug
      console.log("Not fixed at:" + resultFix.i + ' ' + resultFix.j + '  m:'+m+' n:'+n);
      console.log("Matrix:");
      logMatrix(matrix);
      alert('Bad inputs, are you trying to bug my code? Change your inputs.');
    } else {

      steps.saveStep(matrix, "We've done this matrix, just " + (steps.size+1) + (steps.size > 1 ? ' steps':' step' ) + "."  );
      restartElement('matrixResultsHolder', 'table'); // erase all old results


      tableMatrix = htmlMatrix(matrix);
      matrixResultsHolder = document.getElementById('matrixResultsHolder');
      matrixResultsHolder.appendChild(tableMatrix);
      
/*      if(!singular) {
        generatePALUContainerHtml(matrixP, matrixA, matrixL, matrix);
      }*/
      setTableWidth(matrix, matrixResultsHolder);
      if(singular) {
        fixMatrix(matrixL, DIGITS);        
        fixMatrix(matrixA, DIGITS);
        document.getElementById('PALUbutton').disabled = true;
        document.getElementById('singularStatus').innerHTML = 'Singular matrix';
        var glyph = document.createElement('span');
        glyph.setAttribute('style', 'margin-left: 10px;');
        glyph.setAttribute('class', 'glyphicon glyphicon-link');
        document.getElementById('singularStatus').appendChild(glyph);
      }
      else {
        document.getElementById('PALUbutton').disabled = false;
        document.getElementById('singularStatus').innerHTML = '';  

        logMatrix('resultado:');
        logMatrix(multiplyMatrices(matrixL, matrix) );
      }
   

      $("#myContainer").fadeOut("fast", function() {
        $("#myContainerResults").fadeIn("fast");
      });
    }
  });

  $("#back").click(function() {
    $("#myContainerResults").fadeOut("fast", function() {
      $("#myContainer").fadeIn("fast", function() {
        restartElement('matrixResultsHolder', 'table'); // erase all old results
        steps.restart();


      });
    });
  });


  $("#backIndex").click(function() {
    $("#myContainer").fadeOut("fast", function() {
      $("#myIndexContainer").fadeIn("fast");

    });
  });

  $("#PALUbutton").click(function(){
    var rowPALU;
    if(!singular) {
      appendPALUResults(matrixP, matrixA, matrixL, matrix, 'myPALUResults', true);
    }

    $("#myContainerResults").fadeOut("fast", function(){


      $("#myPALUResults").fadeIn("fast", function(){

      });
    });
  });

  $("#stepByStep").click(function() {
    if (!runningStep) {
      var myStepsButton = document.getElementById('mySteps').firstElementChild;
      $(myStepsButton).hide(); // shows when step-by-step its finished

      runningStep = true;
      $("#myContainerResults").fadeOut("slow", function() {

        $("#mySteps").fadeIn("slow", function() {

          for (var i = 0; i < steps.size; i++) {
            var el = steps.generateStepHtml(i);
            myStepsButton.parentNode.insertBefore(el, myStepsButton); // insert all nodes before buttons div
          }


          $(myStepsButton).show(); // show button div
          runningStep = false;
        });
      });

    }

  });

  $("#backFromPALU").click(function() { // restart PALU page
    var holdButtons = document.getElementById('myPALUResults').lastElementChild; //
    restartElement('myPALUResults', 'div'); 
    $("#myPALUResults").fadeOut("fast", function() {
      document.getElementById('myPALUResults').appendChild(holdButtons);
      $("#myContainerResults").fadeIn("fast");
    });
  });

  $("#backToResults").click(function() { // restart step-by-step page
    var holdButtons = document.getElementById('mySteps').lastElementChild; //
    restartElement('mySteps', 'div');
    $("#mySteps").fadeOut("fast", function() {
      document.getElementById('mySteps').appendChild(holdButtons);
      $("#myContainerResults").fadeIn("fast");
    });
  });

});


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}