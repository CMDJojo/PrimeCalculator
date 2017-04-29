##PrimeCalculator
This script can calculate which numbers is prime. You can set a range of numbers that will be processed and searched for primes, or you can write a starting number and the script will find the next prime higher or equal to that number.
##Installation
This script runs by NODE.JS. Check that you have that installed first
This script uses the node libraries fs and prompt. Please install them using:

    npm install fs
    npm install prompt

Then launch the script using

    node prime_calculator.js

##Usage
At boot you have to tell the script what to do.
Write:
 - CHECK if you want to check a number range for primes, or
 - CALCULATE how many modulus operations will be needed for checking a number range, or
 - TIME to estimate the time taken to check a number range, based on previous results, or
 - NEXT to search for the next prime number from a start number
You do not have to setup anything, everything will be prompted
##Results
The script will  log ALL found primes in the console as they are found, and the results will aslo be saved in the primeResults folder (created on first boot). The files will be saved as primesX--Y.json where X is the starting number and Y is the end number. If you are searching in a range from one to one million, the file will be saved as primes1--1000000.json. After you have checked a number range, some statistic results will be saved into the file operations.json. Those values are needed to estimate the time needed for a number range check.
##Have fun!
Created by Jonathan Widén
Please contact me with any issues
©Jonathan Widén 2017
