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
var hitNegate = true;
var hitExp = false;
var hasError = false;

var ops = {
	add: String.fromCharCode(43),
	sub: String.fromCharCode(45),
	mult: String.fromCharCode(215),
	div: String.fromCharCode(247),
	caret: String.fromCharCode(94),
	dec: String.fromCharCode(46),
	opPar: String.fromCharCode(40),
	clPar: String.fromCharCode(41),
}

/***************************************
/* GET NUMBER FUNCTION
****************************************/
function getValueNum() {

	checkInputLength();

	if (hitEqual || hitZero || hasError) { // Can't enter number after hitting equals or an error
		return;
	} else {
		
		$(".inputScreen").removeClass("warningScreen");
		var input = $(this).text();
		
		hitEqual = false;
		hitOperation = false;
		hitNegate = false;
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
function getValueOperation() {
	
	checkInputLength();

	var input = $(this).text();
	currentEntry = input;
	
	hitZero = false;
	hitEqual = false;
	hitNegate = false;
	expCount = 0;
	decimalCount = 0;

	if (hitOperation || hasError) { // Can't enter double operators or after an error
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
function addDecimal() {
	
	checkInputLength();
	decimalCount++;
	hitZero = false;

	if (decimalCount > 1 || hitEqual ||		// Can't add decimals to numbers that 	
	    hitNegate || hasError ) { 			// have them, equated numbers, negated numbers,												
		return;								// or errors	
	} else {
		hitOperation = true;
		currentEntry += ops.dec;
		totalEntry += ops.dec;
		$(".currentEntry").text(currentEntry);
		$(".totalEntry").text(totalEntry);
	}
}

/***************************************
/* EXPONENT BUTTON FUNCTION
****************************************/
function exponent () {

	checkInputLength();
	decimalCount = 0;
	hitZero = false;

	if (totalEntry.length < 1) {
		currentEntry = "";
	} else if (expCount > 0 || hitOperation || hasError)  { // Can't add 2 exponents to 1 number,
		return;												// after hitting operator, or if after
	} else {												// an error

		hitEqual = false;
		hitOperation = true;
		expCount++;
		currentEntry = ops.caret;
		totalEntry += ops.caret;
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

	if (hitOperation || hasError) { // Do nothing if operator has been hit or an error
		return;
	} else if (hitEqual) {  // After equating, change the sign on both current and total entries
		
		numToNegate = Number(result) * -1;
		
		if (numToNegate > 0) {
			currentEntry = numToNegate;
			totalEntry = currentEntry;
		} else {
			currentEntry = ops.opPar + numToNegate + ops.clPar;
			totalEntry = currentEntry;
		}
		
	} else {

		hitNegate = true;

		numToNegate = Number(currentEntry);
		var joinedEquation = "";

		if (numToNegate > 0) {
			numToNegate *= -1;
			numToNegate = ops.opPar + numToNegate + ops.clPar;
			currentEntry = numToNegate;
		}

		var splEquation = totalEntry.split("");
		var i = splEquation.length - 1;

		while (i > -1) {
			if (splEquation[i] === ops.add || splEquation[i] === ops.mult || 
				splEquation[i] === ops.div || splEquation[i] === ops.caret) {
		 		break;
			} else if (splEquation[i] === ops.sub){
				if (splEquation[i - 1] === ops.opPar || splEquation[i - 1] === ops.caret) {
					splEquation[i] = "";
				} else {
					break;
				}
			} else {
				splEquation[i] = "";
				i--;
			}
		}
		joinedEquation = splEquation.join("");
		totalEntry = joinedEquation + numToNegate;
	}
	
	$(".currentEntry").text(currentEntry);
	$(".totalEntry").text(totalEntry);
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
	hitNegate = true;
	hitExp = false;
	hasError = false;
}

/***************************************
/* CLEAR ENTRY BUTTON FUNCTION
****************************************/
function clearEntry() {
	if (hitEqual || hasError) { // If something has been equated or there is an error
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

	if (isNaN(Number(arr[i])) && arr[i] !== ops.clPar) {  // If last index is an operator (not a closed paren),
		arr[i] = "";									  // pop it off and re-enable ability to add operator
		hitOperation = false;
	} else {
		while(i > -1) {
			if (arr[i] === ops.add || arr[i] === ops.mult ||	// If operator is encountered, stop immediately
				arr[i] === ops.div || arr[i] === ops.caret) {
				break;
			} else if (arr[i] === ops.sub) {					// If operator is a minus,
				if (arr[i - 1] === ops.opPar) {					// Check operator behind for an open paren
					arr[i] = "";								// Blank out "-" and continue
					i--;
				} else {										// Else, stop immediately
					break;
				}
			} else if (arr[i - 1] === ops.caret) {				// Check if character behind removed character is caret
				arr[i] = "";
				hitOperation = true;							// If so, disable ability to add operator
				i--;
			} else {											// If no other condition is met, remove character
				arr[i] = "";
				i--;
			}
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

		if (result === Infinity) {		
			displayResults(result, errString, true);
		} else if (isNaN(result)) {
			displayResults(result, errString, true);
		} else if (resultLength > 25) {
			var errorMessage = "Digit Limit Exceeded!";
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
	
	// Check for exp in string
	if (caretIndex !== -1) {

			// Construct newly formatted string
			var frontEq = getFrontEquation(eq_string, caretIndex).join("");
			var baseNumber = getBaseNumber(eq_string, caretIndex);
			var exponential = getExponential(eq_string, caretIndex);
			var backEq = getBackEquation(eq_string, caretIndex).join("");

			finalEq = frontEq + "Math.pow(" + baseNumber + "," + exponential + ")" + backEq;
	}

	var splEquation = finalEq.split("");
	var eqLen = splEquation.length;

	// Convert all operators (×, ÷, and ^) to eval() friendly characters
	for (var i = 0; i < eqLen; i++) {
		if (splEquation[i] === ops.mult) {
			splEquation[i] = "*";
		} else if (splEquation[i] === ops.div) {
			splEquation[i] = "/";
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

	if (error === true) {
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
		if (arr[i] === ops.add || arr[i] === ops.mult || 
			arr[i] === ops.div) {
			break;
		} else if (arr[i] === ops.sub) {
			if (arr[i - 1] === ops.opPar) {
				tempBaseNumber += arr[i];
				i--;
			} else {
				break;
			}
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
		if (newArr[i] === ops.add || newArr[i] === ops.mult ||
			newArr[i] === ops.div || newArr[i] === ops.caret) {
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
		if (newArr[i] === ops.add || newArr[i] === ops.mult ||
			newArr[i] === ops.div || newArr[i] === ops.caret) {
			break;
		} else if (newArr[i] === ops.sub) {
			if (newArr[i - 1] === ops.opPar) {
				newArr.pop();
				i--;
			} else {
				break;
			}
		} else {
			newArr.pop();
			i--;
		}
	}
	return newArr;
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
		if (newArr[i] === ops.add || newArr[i] === ops.mult ||
			newArr[i] === ops.div) {
			break;
		} else if (newArr[i] === ops.sub) {
			if (newArr[i - 1] === "") {
				newArr[i] = "";
				i++;
			} else {
				break;
			}
		} else {
			newArr[i] = "";
			i++;
		}
	}
	return newArr;
}

/***************************************
/* CHECK INPUT LENGTH
****************************************/
function checkInputLength() {

	var currentLength = currentEntry.length;
	var totalLength = totalEntry.length;
	var errString = "ERR";
	var errorMessage = "";

	if (currentLength > 10) {
		errorMessage = "Current Entry Limit Exceeded!";
		displayResults(errorMessage, errString, true);
	} else if (totalLength > 18) {
		errorMessage = "Total Entry Limit Exceeded!";
		displayResults(errorMessage, errString, true);
	}


}
/***************************************
/* ROUNDING FUNCTION
****************************************/
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/***************************************
/* EVENT HANDLERS ON BUTTONSS
****************************************/
$(".number").click(getValueNum);
$(".operation").click(getValueOperation);
$(".decimal").click(addDecimal);
$(".equals").click(doCalculation);
$(".plusMinus").click(negate);
$(".caret").click(exponent);
$(".allClear").click(allClear);
$(".clearEntry").click(clearEntry);