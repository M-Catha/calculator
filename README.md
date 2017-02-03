# calculator

A calculator made with HTML, CSS, and Javascript.

User can chain together any combination of functions including using keyboard input or button pushes on the calculator:

* Addition
* Subtraction
* Multiplication
* Division
* Exponentials
* Decimals
* Negatives <sup>*</sup>

**<sup>*</sup> User must use the ~ keyboard key for negating numbers**


A large number of corner cases (hopefully all!) have been tested to ensure the user cannot input invalid sequences of numbers/operations (double operators, double decimals, whole numbers with leading zeroes, etc.).  

Error handling has been implemented to handle:

* Anything returning Infinity
* Imaginary numbers or anything resulting in NaN
* Exceeding input limits
* Excessively large/small results (positive or negative)

Live demo here:

[Github Pages](https://m-catha.github.io/calculator/)
