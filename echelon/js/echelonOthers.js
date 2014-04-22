/*This file contains all methods relative of PA=LU operation and Elementary Matrix building*/


function alertMatrix(matrix) {
    var s = "";

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) s += matrix[i][j] + " ";
        s += "\n";
    }
    alert(s); // use this function to alert a matrix (use to debug)
}

function breakFactorDescription(description, tag) {
    if (description.indexOf("Subtract") != -1) {
        var sub1 = description.substring(0, description.indexOf("x") + 2);
        var sub2 = description.substring(description.indexOf("x") + 2, description.indexOf("times"));
        var sub3 = description.substring(description.indexOf("times"), description.length);
        var tot = sub1 + "<" + tag + ">" + sub2 + "</" + tag + ">" + sub3;
        return tot;
    } else {
        var sub1 = description.substring(0, description.indexOf("x") + 2);
        var sub2 = description.substring(description.indexOf("x") + 2, description.indexOf("(where"));
        var sub3 = description.substring(description.indexOf("(where"), description.length);
        var tot = sub1 + "<" + tag + ">" + sub2 + "</" + tag + ">" + sub3;
        return tot;
    }
}

function logMatrix(matrix){
	var s = "";
	for (var i = 0; i < matrix.length; i++) {
		for(var j =0; j < matrix[i].length; j++){
			s += matrix[i][j] + " ";
		}
		s += "\n";
	}

	console.log(s);
}