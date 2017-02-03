/***************************************
/* GLOBAL VARIABLES
****************************************/
var totalEntry = "";
var currentEntry = "";
var input = "";
var result = "";
var decimalCount = 0;
var expCount = 0;
var hitZero = false;
var hitOperation = true;
var hitEqual = false;
var hitNegate = false;
var hitExp = false;
var hasError = false;

// Ensure all characters are equated as intended
var ops = {
	add: String.fromCharCode(43),	// "+"
	sub: String.fromCharCode(45),	// "-"
	mult: String.fromCharCode(215),	// "×"
	div: String.fromCharCode(247),	// "÷"
	caret: String.fromCharCode(94),	// "^"
	dec: String.fromCharCode(46),	// "."
	opPar: String.fromCharCode(40),	// "("
	clPar: String.fromCharCode(41),	// ")"
	ast: String.fromCharCode(42),	// "*"
	slash: String.fromCharCode(47),	// "/"
	dash: String.fromCharCode(8211)	// "–"
}

/***************************************
/* GET NUMBER FUNCTION
****************************************/
function getValueNum(number) {

	checkInputLength();

	if (hitEqual || hitZero || hitNegate || hasError) {
		return;
	} else {

		$(".inputScreen").removeClass("warningScreen");
		var input = verifyInput(number) || $(this).text();
		
		hitEqual = false;
		hitOperation = false;
		currentEntry += input;

		if (input === "0" && currentEntry.length < 2) {
			hitZero = true;
		}
			
		totalEntry += input;

		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
	}
}

/***************************************
/* GET OPERATOR FUNCTION
****************************************/
function getValueOperation(operator) {
	
	checkInputLength();

	var input = verifyInput(operator) || $(this).text();
	currentEntry = input;
	
	hitZero = false;
	hitEqual = false;
	hitNegate = false;
	expCount = 0;
	decimalCount = 0;

	if (hitOperation || hasError) {
		currentEntry = "";
		return;
	} else {
		$(".inputScreen").removeClass("warningScreen");
		totalEntry += input;
		hitOperation = true;
	}

	$(".currentEntry").text(currentEntry);
	$(".totalEntry").text(totalEntry);

	currentEntry = "";
}

/***************************************
/* DECIMAL BUTTON FUNCTION
****************************************/
function addDecimal(dec) {
	
	checkInputLength();
	decimalCount++;
	hitZero = false;
	var eqLen = totalEntry.length;

	if (decimalCount > 1 || hitEqual ||	hasError) {	
		return;
	} else if (hitNegate && eqLen > 1) {			
		return;
	} else {
		hitOperation = true;
		currentEntry += verifyInput(dec) || ops.dec;
		totalEntry += verifyInput(dec) || ops.dec;
		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
	}
}

/***************************************
/* EXPONENT BUTTON FUNCTION
****************************************/
function exponent (exp) {

	checkInputLength();
	decimalCount = 0;
	hitZero = false;
	hitNegate = false;

	if (totalEntry.length < 1) {
		currentEntry = "";
	} else if (expCount > 0 || hitOperation || hasError)  {
		return;
	} else {

		hitEqual = false;
		hitOperation = true;
		expCount++;
		currentEntry = verifyInput(exp) || ops.caret;
		totalEntry += verifyInput(exp) || ops.caret;
		
		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
		currentEntry = "";
	}
}

/***************************************
/* PLUS/MINUS BUTTON FUNCTION
****************************************/
function negate() {

	checkInputLength();
	var numToNegate = "";

	if (hitOperation || hasError) {
		return;
	} else if (hitEqual) {
		
		changeSign(result, true);

		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
		
	} else {
		
		hitNegate ? hitNegate = false: hitNegate = true;

		var joinedEquation = "";
		var entry = currentEntry;

		var returnedNum = changeSign(entry, false);

		var splEquation = totalEntry.split("");
		var i = splEquation.length - 1;

		while (i > -1) {
			if (splEquation[i] === ops.add || splEquation[i] === ops.sub || 
				splEquation[i] === ops.mult || splEquation[i] === ops.div ||
				splEquation[i] === ops.caret) {
		 		break;
			}
			splEquation[i] = "";
			i--;
		}
		joinedEquation = splEquation.join("");
		totalEntry = joinedEquation + returnedNum;
		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
	}
}

/***************************************
/* CHANGE SIGN ON TOTAL
****************************************/
function changeSign(eq_string, for_result) {
	
	var grabString = eq_string.toString();
	var hasDash = grabString.indexOf(ops.dash);

	if (hasDash !== -1) {
		grabString = eq_string.replace(/[()]/g, "").replace(/[^0-9\.]/g, ops.sub);
		numToNegate = Number(grabString) * -1;
	}

	var numToNegate = Number(grabString) * -1;

	if (for_result) {
		if (numToNegate < 0) {
			numToNegate *= -1;
			currentEntry = ops.opPar + ops.dash + numToNegate + ops.clPar;
		} else {
			currentEntry = numToNegate;
		}
		totalEntry = currentEntry;
		result = totalEntry;
	} else {
		if (numToNegate < 0) {
			numToNegate *= -1;
			numToNegate = ops.opPar + ops.dash + numToNegate + ops.clPar;
			currentEntry = numToNegate;
		} else {
			currentEntry = numToNegate;
		}
		return numToNegate;
	}
}

/***************************************
/* ALL CLEAR BUTTON FUNCTION
****************************************/
function allClear() {
	$(".inputScreen").removeClass("warningScreen");
	$(".currentEntry").text("0");
	$(".totalEntry").text("0");
	totalEntry = "";
	currentEntry = "";
	input = "";
	result = "";
	decimalCount = 0;
	expCount = 0;
	hitZero = false;
	hitOperation = true;
	hitEqual = false;
	hitNegate = false;
	hitExp = false;
	hasError = false;
}

/***************************************
/* CLEAR ENTRY BUTTON FUNCTION
****************************************/
function clearEntry() {
	if (hitEqual || hasError) {
		return;
	} else {
		
		$(".inputScreen").removeClass("warningScreen");

		var eqLen = totalEntry.length;
		totalEntry = popOff(totalEntry, eqLen);

		if (totalEntry === "") {
			$(".totalEntry").text("0");
			allClear();
		} else {
			$(".totalEntry").text(totalEntry);
		}

		$(".currentEntry").text("0");
		currentEntry = "";
	}
}

/***************************************
/* CLEAR ENTRY POP-OFF FUNCTION
****************************************/
function popOff(array, arr_length) {

	var arr = array.split("");
	var i = arr.length - 1;
	var joinedArr = "";

	if (isNaN(Number(arr[i])) && arr[i] !== ops.clPar) {
		arr[i] = "";
		hitOperation = false;
	} else {
		while(i > -1) {
			if (arr[i] === ops.add || arr[i] === ops.sub ||
				arr[i] === ops.mult || arr[i] === ops.div || 
				arr[i] === ops.caret) {
				hitOperation = true;
				break;
			}
			arr[i] = "";
			i--;
		}
	}
	joinedArr = arr.join("");
	return joinedArr;
}

/***************************************
/* RUN CALCULATION
****************************************/
function doCalculation() {

	var finalIndex = totalEntry.length - 1;
	var finalChar = Number(totalEntry[finalIndex]);

	// Don't perform calculation if last character is an operator (excluding closed parentheses)
	if (isNaN(finalChar) && totalEntry[finalIndex] !== ops.clPar) {
		return;
	} else {

		expCount = 0;
		decimalCount = 0;

		// Grab equation before formatting
		var oldEquation = totalEntry;

		// Make equation eval() friendly
		totalEntry = formatEquation(totalEntry);
		result = eval(totalEntry);
		
		var roundedResult = round(result, 5);
		var resultLength = result.toString().length;
		var errString = "ERR";
		var errorMessage = "";

		if (result === Infinity) {		
			displayResults(result, errString, true);
		} else if (isNaN(result)) {
			errorMessage = "Not A Number!";
			displayResults(errorMessage, errString, true);
		} else if (resultLength > 25) {
			errorMessage = "Digit Limit Exceeded!";
			displayResults(errorMessage, errString, true);
		} else {
			displayResults(roundedResult, oldEquation, false)
		}
	}
}

/***************************************
/* FORMATTING EQUATION FOR EVAL() FUNCTION
****************************************/
function formatEquation(eq_string) {
	
	var finalEq = eq_string;
	var caretIndex = eq_string.indexOf(ops.caret);
	
	if (caretIndex !== -1) {			
			var frontEq = getFrontEquation(eq_string, caretIndex);
			var baseNumber = getBaseNumber(eq_string, caretIndex);
			var exponential = getExponential(eq_string, caretIndex);
			var backEq = getBackEquation(eq_string, caretIndex);

			// Construct newly formatted string
			finalEq = frontEq + "Math.pow(" + baseNumber + "," + exponential + ")" + backEq;
	}

	var splEquation = finalEq.split("");
	var eqLen = splEquation.length;

	// Convert all operators (×, ÷, and ^) to eval() friendly characters
	for (var i = 0; i < eqLen; i++) {
		if (splEquation[i] === ops.mult) {
			splEquation[i] = ops.ast;
		} else if (splEquation[i] === ops.div) {
			splEquation[i] = ops.slash;
		} else if (splEquation[i] === ops.dash) {
			splEquation[i] = ops.sub;
		}
	}

	var joinedEquation = splEquation.join("");
	var stillHasCaretIndex = joinedEquation.indexOf(ops.caret);

	// If there are multiple exponentials continue formatting
	if (stillHasCaretIndex !== -1) {
		return formatEquation(joinedEquation);
	} else {
		return joinedEquation;
	}
}

/***************************************
/* HANDLES FINAL DISPLAY OF RESULTS
****************************************/
function displayResults(result, equation, error) {

	if (error) {
		$(".inputScreen").addClass("warningScreen");
		$(".currentEntry").text(equation);
		$(".totalEntry").text(result);
		totalEntry = "";
		hasError = true;
	} else {
		$(".currentEntry").text(result);
		$(".totalEntry").text(equation + "=" + result);
		totalEntry = result;
	}
	currentEntry = "";
	hitEqual = true;
}

/***************************************
/* BASE NUMBER FOR EXP FUNCTION
****************************************/
function getBaseNumber(array, current_index) {

	var arr = array.split("");
	var tempBaseNumber = "";
	var i = current_index - 1;
	var baseNumber = "";

	while (i > -1) {
		if (arr[i] === ops.add || arr[i] === ops.sub || 
			arr[i] === ops.mult || arr[i] === ops.div) {
			break;
		}
		tempBaseNumber += arr[i];
		i--;
	}
	baseNumber = tempBaseNumber.split("").reverse().join("");
	return baseNumber;
}

/***************************************
/* EXPONENTIAL FOR EXP FUNCTION
****************************************/
function getExponential(array, current_index) {
	
	var arr = array.split("");
	var tempExp = "";

	var newArr = arr.slice(current_index);
	var eqLen = newArr.length;
	var i = 1;

	while (i < eqLen) {

		if (newArr[i] === ops.add || newArr[i] === ops.sub ||
			newArr[i] === ops.mult || newArr[i] === ops.div ||
			newArr[i] === ops.caret) {
			break;
		}
		tempExp += newArr[i];
		i++;
	}
	return tempExp;
}

/***************************************
/* EQUATION IN FRONT OF EXP FUNCTION
****************************************/
function getFrontEquation (array, current_index) {
	
	var arr = array.split("");
	var newArr = arr.slice(0, current_index);
	var eqLen = newArr.length;
	var i = eqLen - 1;

	while (i > -1) {
		if (newArr[i] === ops.add || newArr[i] === ops.sub ||
			newArr[i] === ops.mult || newArr[i] === ops.div ||
			newArr[i] === ops.caret) {
			break;
		}
		newArr.pop();
		i--;
	}
	var joinedArr = newArr.join("");
	return joinedArr;
}

/***************************************
/* EQUATION BEHIND EXP FUNCTION
****************************************/
function getBackEquation (array, current_index) {
	
	var arr = array.split("");
	var newArr = arr.slice(current_index);
	var eqLen = newArr.length;
	var i = 0;

	while (i < eqLen) {
		if (newArr[i] === ops.add || newArr[i] === ops.sub ||
			newArr[i] === ops.mult || newArr[i] === ops.div) {
			break;
		}
		newArr[i] = "";
		i++;
	}
	var joinedArr = newArr.join("");
	return joinedArr;
}

/***************************************
/* CHECK INPUT LENGTH
****************************************/
function checkInputLength() {

	var currentLength = currentEntry.length;
	var totalLength = totalEntry.length;
	var errString = "ERR";
	var errorMessage = "";

	if (currentLength > 20) {
		errorMessage = "Current Entry Limit Exceeded!";
		displayResults(errorMessage, errString, true);
	} else if (totalLength > 35) {
		errorMessage = "Total Entry Limit Exceeded!";
		displayResults(errorMessage, errString, true);
	}
}

/***************************************
/* VERIFY INPUT
****************************************/
function verifyInput(input) {
	if (typeof input !== "string") {
		return undefined;
	}
	return input;
}
/***************************************
/* ROUNDING FUNCTION
****************************************/
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/***************************************
/* KEYLOGGER FUNCTION
****************************************/

function logKeys(key) {

	switch(key) {
		case 8:
			clearEntry();
			break;
		case 13:
		case 61:
			doCalculation();
			break;
		case 42:
			getValueOperation(ops.mult);
			break;
		case 43:
			getValueOperation(ops.add);
			break;
		case 45:
			getValueOperation(ops.sub);
			break;
		case 46:
			addDecimal(ops.dec);
			break;
		case 47:
			getValueOperation(ops.div);
			break;
		case 48:
			getValueNum("0");
			break;
		case 49:
			getValueNum("1");
			break;
		case 50:
			getValueNum("2");
			break;
		case 51:
			getValueNum("3");
			break;
		case 52:
			getValueNum("4");
			break;
		case 53:
			getValueNum("5");
			break;
		case 54:
			getValueNum("6");
			break;
		case 55:
			getValueNum("7");
			break;
		case 56:
			getValueNum("8");
			break;
		case 57:
			getValueNum("9");
			break;
		case 61:
			doCalculation();
			break;
		case 94:
			exponent(ops.caret);
			break;
		case 126:
			negate();
			break;
		default:
			break;
	}
}

/***************************************
/* EVENT HANDLERS ON BUTTONS
****************************************/

// Handler for all numbers/operators
$(document).keypress(function(key) {
	var keyPressed = key.which;
	logKeys(keyPressed);
});

// Special handler for backspace
$(document).keyup(function(key) {
	if(key.keyCode === 8) {
		logKeys(8);
	}
})
$(".number").click(getValueNum);
$(".operation").click(getValueOperation);
$(".decimal").click(addDecimal);
$(".equals").click(doCalculation);
$(".plusMinus").click(negate);
$(".caret").click(exponent);
$(".allClear").click(allClear);
$(".clearEntry").click(clearEntry);