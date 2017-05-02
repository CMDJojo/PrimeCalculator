var prompt = require("prompt");
var fs = require("fs")

var dir = './primeResults';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var operationsCalculations;

try{
  operationsCalculations = JSON.parse(fs.readFileSync('operations.json', 'utf8'))
}catch(err){
  console.log("No operations file existed, creating one...")
  var newValue={operations:[]}
  fs.writeFileSync('operations.json',JSON.stringify(newValue))
  operationsCalculations = require("./operations.json")
}

prompt.message="calculate_primes.js"

function startPrompt(){
  console.log("Type an action you want to execute.")
  console.log("  ·you can SEARCH a number range for primes,")
  console.log("  ·you can FIND a requested amount of primes,")
  console.log("  ·you can CALCULATE how many modulus operations will be needed for a SEARCH,")
  console.log("  ·you can estimate the TIME needed for a SEARCH.")
  console.log("  ·you can MERGE all results in the primeResults folder to one single file")
  prompt.get({name:"Action"},function(err,result){
    switch(result.Action.toLowerCase()){
      case "search":
      promptPrimeTest()
      break;
      case "calculate":
      calculateCalculations()
      break;
      case "time":
      calculateTime()
      break;
      case "find":
      findPrimes()
      break;
      case "merge":
      mergeResults();
      break;
      default:
      startPrompt()
    }
  })
}

function findPrimes(){
  console.log("Type the amount of primes to find")
  prompt.get({name:"amountToFind",type:"integer",required:true},function(err,result){
    var primes = []
    var startTime = new Date()
    for(y=2;primes.length<result.amountToFind;y++){
      if(isPrime(y)){
        console.log(y+" is a prime")
        primes.push(y)
      }
    }
    var testTime = new Date()
    var name = "./primeResults/first"+result.amountToFind+"primes.json"
    fs.writeFileSync(name,JSON.stringify(primes))
    var finishedTime = new Date()
    var modulusTime = testTime-startTime
    var s = modulusTime
    var ms = ("00"+(s % 1000)).slice(-3)
    s = (s - ms) / 1000;
    var secs = ("0"+(s % 60)).slice(-2)
    s = (s - secs) / 60;
    var mins = ("0"+(s % 60)).slice(-2)
    var hrs = ("0"+((s - mins) / 60)).slice(-2)
    var timeString = hrs+":"+mins+":"+secs+"."+ms
    var operationsPushFinished = new Date()

    console.log("The first "+result.amountToFind+" primes has been found.")
    console.log("All those primes are saved to '"+name+"' in the primeResults folder")
    console.log("Started @"+startTime.toLocaleTimeString()+", prime test finished @"+testTime.toLocaleTimeString()+", and write time finished @"+finishedTime.toLocaleTimeString()+". The aftercalculations finished @"+operationsPushFinished.toLocaleTimeString())
    console.log("The modulus calculations took a total of "+hrs+":"+mins+":"+secs+"."+ms)
    startPrompt()
  })
}

function mergeResults(){
  console.log("Finding, merging and checking ALL results in the primeResults folder")
  var startStart = new Date();
  files = fs.readdirSync("./primeResults/")
  var mergedPrimes = []
  files.forEach(function(value,index){
    var fileToRead = "./primeResults/"+value;
    var file = JSON.parse(fs.readFileSync(fileToRead, 'utf8'))
    if(Array.isArray(file)){
      mergedPrimes = mergedPrimes.concat(file)
    }
  })
  var startSorting = new Date();
  console.log("Results found. Sorting them...")
  var uniqueArray = []
  mergedPrimes.forEach(function(value,index){
    if(uniqueArray.indexOf(value)==-1){
      uniqueArray.push(value)
    }
    if(mergedPrimes.length>=10000){
      console.log(index+" of "+mergedPrimes.length+" sorted...")
    }
  })

  var startAfterWork = new Date();
  uniqueArray.sort(function(a, b){return a - b});
  var minValue = uniqueArray[0]
  var maxValue = uniqueArray[uniqueArray.length-1]
  var length = uniqueArray.length
  var name = "./primeResults/mPrimes"+minValue+"-"+maxValue+".json";
  fs.writeFileSync(name,JSON.stringify(uniqueArray))

  var modulusTime = startAfterWork-startStart
  var s = modulusTime
  var ms = ("00"+(s % 1000)).slice(-3)
  s = (s - ms) / 1000;
  var secs = ("0"+(s % 60)).slice(-2)
  s = (s - secs) / 60;
  var mins = ("0"+(s % 60)).slice(-2)
  var hrs = ("0"+((s - mins) / 60)).slice(-2)
  var timeString = hrs+":"+mins+":"+secs+"."+ms

  var finished = new Date();

  console.log("Found "+length+" different primes. All are sorted and double checked. The lowest prime was "+minValue+" and the highest was "+maxValue)
  console.log("Results saved to "+name)
  console.log("Started @"+startStart.toLocaleTimeString()+", results merged @"+startSorting.toLocaleTimeString()+", and sorting time finished @"+startAfterWork.toLocaleTimeString()+". Everything finished @"+finished.toLocaleTimeString())
  console.log("Everything took a total of "+hrs+":"+mins+":"+secs+"."+ms)
  startPrompt()
}

function calculateTime(){
  var enoughData = false;
  var calcsSecondsData = [];
  operationsCalculations.operations.forEach(function(value,index){
    if(value.time>=5000){
      enoughData=true;
      var calcsPerSecond = value.modCalcs/value.time
      calcsSecondsData.push(calcsPerSecond)
    }
  })

  if(enoughData){
    var total = 0
    calcsSecondsData.forEach(function(value){total+=value})
    var avgCalcMSeconds = total/calcsSecondsData.length
    avgCalcMSeconds = Math.round(avgCalcMSeconds)
    console.log("Type the number range to calculate the estimated time needed")
    prompt.get([{name:"MinNo",type:"integer",required:true},{name:"MaxNo",type:"integer",required:true}],function(err,result){
      var modulusResult = calculateModulus(result.MinNo,result.MaxNo)

      var s = modulusResult.calculations/avgCalcMSeconds
      s = Math.round(s)
      var ms = ("00"+(s % 1000)).slice(-3)
      s = (s - ms) / 1000;
      var secs = ("0"+(s % 60)).slice(-2)
      s = (s - secs) / 60;
      var mins = ("0"+(s % 60)).slice(-2)
      var hrs = ("0"+((s - mins) / 60)).slice(-2)
      console.log("For testing a range from "+result.MinNo+" to "+result.MaxNo+", "+modulusResult.calculations+" modulus operations will be done to check all the "+modulusResult.numbers+" odd numbers")
      console.log("With the speed of "+avgCalcMSeconds+" operations per millisecond (based on "+calcsSecondsData.length+" operations in the log file), the estimated time to find all prime numbers is "+hrs+":"+mins+":"+secs+"."+ms)
      console.log("")
      startPrompt()
    })
  }else{
    console.log("Not enough data logs with calculations that took over 3 seconds were found. Please make some calculatins taking over 3 seconds and try again.")
  }
}

function calculateCalculations(){
  console.log("Type the number range to calculate the calculations")
  prompt.get([{name:"MinNo",type:"integer",required:true},{name:"MaxNo",type:"integer",required:true}],function(err,result){
    var modulusResult = calculateModulus(result.MinNo,result.MaxNo)
    console.log("For testing a range from "+result.MinNo+" to "+result.MaxNo+", "+modulusResult.calculations+" modulus operations will be done to check all the "+modulusResult.numbers+" odd numbers and the number 2")
    startPrompt()
  })
}

function promptPrimeTest(){
  console.log("Type the number range to test")
  prompt.get([{name:"MinNo",type:"integer",required:true},{name:"MaxNo",type:"integer",required:true}],function(err,result){
    var testArray = []
    var primes = []
    var startTime = new Date()
    console.log("Generating array of numbers...")

    for(i=result.MinNo;i<=result.MaxNo;i++){
      if(i!==1){
        if(i%2!==0||i===2){
          testArray.push(i)
        }
      }
    }
    console.log("Array ready")
    var arrayFinishedTime = new Date()
    testArray.forEach(function(value,index){
      if(isPrime(value)){
        console.log(value+" is a prime")
        primes.push(value)
      }
    })
    var testTime = new Date()
    var name = "./primeResults/primes"+result.MinNo+"--"+result.MaxNo+".json"
    fs.writeFileSync(name,JSON.stringify(primes))
    var finishedTime = new Date()
    var modulusTime = testTime-arrayFinishedTime
    var operationsPush = {time:modulusTime}
    var s = modulusTime
    var ms = ("00"+(s % 1000)).slice(-3)
    s = (s - ms) / 1000;
    var secs = ("0"+(s % 60)).slice(-2)
    s = (s - secs) / 60;
    var mins = ("0"+(s % 60)).slice(-2)
    var hrs = ("0"+((s - mins) / 60)).slice(-2)
    var timeString = hrs+":"+mins+":"+secs+"."+ms
    var primePercentage = primes.length/(result.MaxNo-result.MinNo+1)
    primePercentage = Math.round(primePercentage*10000)/100
    calcModulus = calculateModulus(result.MinNo,result.MaxNo)
    operationsPush.timeString = timeString
    operationsPush.primePercentage = primePercentage
    operationsPush.modCalcs = calcModulus.calculations
    operationsPush.range = {min:result.MinNo,max:result.MaxNo,totalNumbers:result.MaxNo-result.MinNo+1,numbersToCheck:calcModulus.numbers}
    var operationsPushed = operationsCalculations
    operationsPushed.operations.unshift(operationsPush)
    fs.writeFileSync('operations.json',JSON.stringify(operationsPushed))
    var operationsPushFinished = new Date()

    console.log("From "+result.MinNo+" to "+result.MaxNo+", there are "+primes.length+" primes. That is "+primePercentage+"% of the numbers tested")
    console.log("All those primes are saved to '"+name+"' in the primeResults folder")
    console.log("Started @"+startTime.toLocaleTimeString()+", array generation finished @"+arrayFinishedTime.toLocaleTimeString()+", prime test finished @"+testTime.toLocaleTimeString()+", and write time finished @"+finishedTime.toLocaleTimeString()+". The aftercalculations finished @"+operationsPushFinished.toLocaleTimeString())
    console.log("The modulus calculations took a total of "+hrs+":"+mins+":"+secs+"."+ms)
    startPrompt()
  })
}

function calculateModulus(min,max){
  var calculations = 0
  var numbers = 0
  console.log("Calculating modulus operations...")

  for(i=min;i<=max;i++){
    if(i!==1){
      if(i%2!==0||i===2){
        calculations += Math.round(i/2-0,5)
        numbers++
      }
    }
  }
  return {calculations:calculations,numbers:numbers,min:min,max:max}
}

function isPrime(value) {
    for(i = 2; i <= value/2; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return true;
}
startPrompt()
