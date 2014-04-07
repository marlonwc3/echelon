
function generateMatrix(n, m){
/*
	Generate a \/ n by m
	as id="holdMatrix" chield
       <div class="row" >
        <input type="number" class="form-control" placeholder="0">
        <input type="number" class="form-control" placeholder="0">                      
        <input type="number" class="form-control" placeholder="0">
      </div>  */
      var holdMatrix = document.getElementById('holdMatrix');

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




function restartTable(id){
 
 
  var old = document.getElementById(id);
  var aux = document.createElement('table');
  aux.setAttribute('id', old.getAttribute('id'));
  aux.setAttribute('class', old.getAttribute('class'));


  old.parentNode.replaceChild(aux, old);

}



function htmlToString(objHtml){

}




//
window.onload = function(){
	generateMatrix(n,m);
}