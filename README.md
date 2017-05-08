## PrimeCalculator
This script can calculate which numbers is prime. You can set a range of numbers that will be processed and searched for primes, or you can find a specific amount of prime numbers.
## Installation
This script runs by NODE.JS. Check that you have that installed first.

This script uses the node libraries fs and prompt. Please install them using:

    npm install fs
    npm install prompt

Then launch the script using

    node prime_calculator.js

## Usage
At boot, you need to give the script an action to do. Valid actions are:

 - SEARCH if you want to search a number range for primes, or
 - FIND if you want to find a specific number of primes

More actions will be added in the future

You do not have to setup anything after you have installed the required node-package-modules (npm:s), everything will be prompted

## Usage of SEARCH, the NEW and the OLD way

If you want to use the SEARCH function, there is some stuff you might be interested in. At first, you will be asked if you want to use the NEW or the OLD algorithm.

#### The OLD way

If you use the old algorithm, you can set a number range between two numbers to search for primes. To calculate if the number N is a prime, the script has to do this many modulus calculations:

	Math.round(n/2-0.5)
    
The old way, all odd numbers and the number 2 in the number range will be tested.

#### The NEW way

The new way is working in another way. You can't set a lower limit for the number range, the lowest number searched is always 1 (1 is not tested, the first number is 2). The new algorithm checks if a number is prime by using modulus operations on all primes already found that is less than n/2. This uses WAY LESS modulus operations than the old algorithm.

#### Conclution
I recommend to ONLY use the NEW algorithm. My tests shows that it is **85%** faster, and with all that extra speed the new algorithm is faster to count from 1 to 1 million, than the old algorithm is to count from 900 000 to 1 million. So the new algorithm is improving the speed so good so there is no point using the old algorithm.

#### Logging in console or not?
If you want to track your progress, you can log your results in the console. But that will make everything slower, doesn't it? Yes, it is, but if you want to see the progress, this is the only way (for now).<br>My test results shows that it takes ≈69% longer time for a search (with the new algorithm) if you log the results in the console. Probably isn't worth it...

## Usage of FIND
Find is based of the SEARCH function, but instead using a number range, you specify how many primes you want to find in total. If you want to learn how this works, read **The NEW way** of the SEARCH function above. You can also choose if you want to log the results in the console or not.
#### Compared to SEARCH?
What should you use then? SEARCH or FIND?<br>I launched a NEW SEARCH up to 1 million. There were 78498 primes. Then I tested FIND, and set it to 78498 primes. Then I compared the results. They took roughly the same, so you do not need to bother if you are using FIND or SEARCH. I prefer SEARCH because you can see on the logs if it is close to the maximum number in the range, but that's just my opinion.

## Usage of MERGE
Merge will check ALL files in the prime results folder, merge all the results to one single array, remove all duplicates of the same number, and sort them. This was more used when only the OLD SEARCH algorithm existed, if you wanted to merge multiple results. This function does take very long time, and is not very usefull, so you should probably not use it.

## Results

The script will save ALL results in files, in the primeResults folder. It will also log the results if you set it to do so.

#### Results of SEARCH (Both NEW and OLD)

For each SEARCH a file will be created for that specific number range, and it will overwrite any results with the exact same number range. The files will be saved as primesX--Y.json where X is the starting number and Y is the end number. If you are using the NEW algorithm, X will always be equal to 1. If you are searching in a range from one to one million, for example, the file will be saved as primes1--1000000.json. After you have SEARCH a number range, some statistic results will be saved into the file operations.json. You can completley delete that file if you do not want it, otherwise you can use it to see how long time previus searches have taken.

#### Results of FIND

For each FIND a file will be created for that specific prime number goal, and it will overwrite any results with the exact same prime number goal. The file will be saved as firstXprimes.json, where X is the number range. If you want to FIND the first 100 000 primes, the file will be saved as *first100000primes.json*.

#### Results of MERGE

The results of MERGE will be saved in a file called mPrimesX--Y.json where X is the lowest number and Y is the highest number found in the MERGE function.<br><br><br><br>

I reccomend to only use the SEARCH NEW function and the FIND function, not the SEARCH OLD or the MERGE function. But use it as you want :)

More functions to come. And more to dissapear too, probably
### Have fun!

Created by Jonathan Widén<br>
Please contact me with any issues<br>
©Jonathan Widén 2017
