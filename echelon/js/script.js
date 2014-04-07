
var n=window.localStorage.getItem('n');
var m=window.localStorage.getItem('m');
var reduced = window.localStorage.getItem('reduced') === 'true';


var button = document.getElementById('singlebutton');


if(button) button.onclick = function(){
	var select = document.getElementsByTagName('select');
	n = select[0].options[select[0].selectedIndex].text;
	m = select[1].options[select[1].selectedIndex].text;

	reduced =  document.getElementById('checkboxes-0').checked;

	// cookie store
	window.localStorage.setItem('n', n);
	window.localStorage.setItem('m', m);
	window.localStorage.setItem('reduced', reduced);

	window.location.assign("teste.html");


}



