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

var n=window.localStorage.getItem('n');
var m=window.localStorage.getItem('m');
var reduced = window.localStorage.getItem('reduced') === 'true';

*/
var n=0, m=0, reduced=false;
var runningStep = false; // prevent two clicks on step-by-step button



function generateMatrix(n, m){
/*
	Generate a \/ n by m
	as id="holdMatrix" chield
       <div class="row" >
        <input type="number" class="form-control" placeholder="0">
        <input type="number" class="form-control" placeholder="0">                      
        <input type="number" class="form-control" placeholder="0">
      </div>  */


      console.log('generate---> n:'+n+ ' m:'+m);

      //restart this span
      var oldHoldMatrix = document.getElementById('holdMatrix');
      var neWHoldMatrix = document.createElement('span');
      neWHoldMatrix.setAttribute('id', 'holdMatrix');
      oldHoldMatrix.parentNode.replaceChild(neWHoldMatrix, oldHoldMatrix);
      

      for(var i = 0; i < n; i++){
      	var row = document.createElement("div");
      	row.setAttribute("class", "row");
      	holdMatrix.appendChild(row);
      	for(var j = 0; j < m; j++){
      		var input = document.createElement("input");
      		input.setAttribute("type", "number");
      		input.setAttribute("class", "form-control");
      		input.setAttribute("placeholder", "0");

      		row.appendChild(input);
      	}
      }


}




function restartElement(id, el, callback){ // restart a element and preserve id and class
 
 
  var old = document.getElementById(id);
  var aux = document.createElement(el);
  aux.setAttribute('id', old.getAttribute('id'));
  aux.setAttribute('class', old.getAttribute('class'));


  old.parentNode.replaceChild(aux, old);

  if(!isNaN(callback) && !(callback==undefined) && !(callback==null) && (typeof callback == "function")) callback();

}

function restartDiv(id){
  var old = document.getElementById(id);

}

function htmlToString(objHtml){

}


$(document).ready(function() {




    // hide results and step pages
    $("#myContainer").hide();
    $("#myContainerResults").hide(); 
    $("#mySteps").hide();




    $("#indexGo").click(function(){

      var select = document.getElementsByTagName('select');
      n = select[0].options[select[0].selectedIndex].text;
      m = select[1].options[select[1].selectedIndex].text;
      reduced =  document.getElementById('checkboxes-0').checked;
      console.log('indexGo click---> n:'+n + ' m:'+m + ' reduced:' + reduced);

      //restart the amtrix




      $("#myIndexContainer").fadeOut("fast",function(){
        generateMatrix(n,m);

        $("#myContainer").ready(function(){
          //var width = $("input.form-control:number").css('width');
          var width = parseInt($("input.form-control").css('width'));
          document.getElementById('myContainer').style.minWidth = width*m;
          $("#myContainer").fadeIn("fast");
        });

        
      });
    });

    // set all button's events
    $("#echelonButton").click(function(){
              // restart matrix
            matrix = [];           
            for(var i = 0; i < n; i++){
              matrix.push([]);
              for(var j = 0; j<m; j++){
                matrix[i].push([]); 
              }
            }
            getMatrix(); // get the matrix via html tags

            echelonMatrix(matrix); 
            
            console.log("reduced: " + reduced);

            if(reduced) reduceMatrix(matrix); 
            

            fixMatrix(matrix,DIGITS); // round results

            var resultFix = fixMatrixEchelon(matrix, 0.0001);
            //alert(resultFix.fixed);
            if(!resultFix.fixed ) { // alert about bug
              console.log("Not fixed at:" + resultFix.i + ' ' + resultFix.j);
              alert('Bad inputs, are you trying tu bug my code? Change your inputs.');
            }
            else{ 



              steps.saveStep(matrix, "We've done this matrix :) ");
              restartElement('matrixResultsHolder', 'table'); // erase all old results

              console.log(matrix)
              tableMatrix = htmlMatrix(matrix);

              $('#matrixResultsHolder').append(tableMatrix);

              // Faz com que o MathJax processe o LaTeX do elemento
              MathJax.Hub.Typeset('matrixResultsHolder');

              $("#myContainer").fadeOut("fast", function(){
                  $("#myContainerResults").fadeIn("fast");
              }); 
            }
    });    

    $("#back").click(function(){
        $("#myContainerResults").fadeOut("fast", function(){
            $("#myContainer").fadeIn("fast", function(){
                restartElement('matrixResultsHolder', 'table'); // erase all old results
                steps.restart();
            });
        });
    });


    $("#backIndex").click( function(){
        $("#myContainer").fadeOut("fast", function(){
            $("#myIndexContainer").fadeIn("fast");

        });
    });



    $("#stepByStep").click(function(){
        if(!runningStep ) {
          var myStepsButton = document.getElementById('mySteps').firstElementChild;
          console.log('stepButtons:' + myStepsButton);
          $(myStepsButton).hide(); // shows when step-by-step its finished

          runningStep = true;
          $("#myContainerResults").fadeOut("slow", function(){
              
              $("#mySteps").fadeIn("slow", function(){
                  
                  console.log('steps size:' + steps.size);
                  for(var i = 0; i < steps.size; i++){
                      var el = steps.generateStepHtml(i);
                      myStepsButton.parentNode.insertBefore(el, myStepsButton); // insert all nodes before buttons div
                  } 
                  
                  

                  $(myStepsButton).show(); // show button div
                  runningStep = false;
              });
          });

        }

    });


    $("#backToResults").click(function(){

          /*
            Restart step-by-step table 
          */
          
          //restart steps 
          var holdButtons = document.getElementById('mySteps').lastElementChild; //
          console.log('backToResults CLICKED, last elements:');
          console.log(holdButtons);
          restartElement('mySteps', 'div');
          console.log('mySteps restarted:');

          
          
      $("#mySteps").fadeOut("fast", function(){
          document.getElementById('mySteps').appendChild(holdButtons);
          console.log(document.getElementById('mySteps'));

        $("#myContainerResults").fadeIn("fast", function(){


        });

      });

    });

 });  


function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

