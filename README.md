## PrimeCalculator
This script can calculate which numbers is prime. You can set a range of numbers that will be processed and searched for primes, or you can find a specific amount of primes.

## Installation
This script runs by NODE.JS. Check that you have that installed first
This script uses the node libraries fs and prompt. Please install them using:

    npm install fs
    npm install prompt

Then launch the script using

    node prime_calculator.js

## Usage

At boot you have to tell the script an action to do.

 - you can SEARCH a number range for primes
 - you can FIND a requested amount of primes
 - you can CALCULATE how many modulus operations will be needed for a SEARCH
 - you can estimate the TIME needed for a SEARCH
 - you can MERGE all results in the primeResults folder to one single file
 
## Results
The script will log ALL found primes in the console as they are found, and the results will aslo be saved in the primeResults folder (created on first boot). The files will be saved as primesX--Y.json where X is the starting number and Y is the end number. If you are searching in a range from one to one million, the file will be saved as primes1--1000000.json. After you have checked a number range, some statistic results will be saved into the file operations.json. Those values are needed to estimate the time needed for a number range check.

## Have fun!
Created by Jonathan Widén<br>
Please contact me with any issues<br>
©Jonathan Widén 2017
