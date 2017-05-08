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
  console.log("  ·you can MERGE all results in the primeResults folder to one single file (will take some time)")
  prompt.get({name:"Action"},function(err,result){
    switch(result.Action.toLowerCase()){
      case "search":
      promptPrimeSearch()
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
    console.log("Do you want to log the results in the console? (true/false)")
    console.log("Logging results will take some more time...")
    prompt.get({name:"logConsole",type:"boolean",required:true},function(err,result2){
      var primes = []
      var startTime = new Date()
      var isPrime;
      for(y=2;primes.length<result.amountToFind;y++){
        isPrime = true
        for(i=0;primes[i]<=(y/2)&&isPrime == true;i++){
          if(y%primes[i]===0){
            isPrime = false
          }
        }
        if(isPrime){
          if(result2.logConsole){console.log(y+" is a prime")}
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
  var name = "./primeResults/mPrimes"+minValue+"--"+maxValue+".json";
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

function promptPrimeSearch(){
  console.log("You can use the NEW search algorithm for faster results. Using the NEW alogrithm requires the minimum value in the range to be 1")
  console.log("If you choose to use the OLD search algorithm, you can set a custom minimum number, but the search will take longer time")
  console.log("Do you want to use the NEW or the OLD algorithm?")
  prompt.get("algorithm",function(err,result){
    if(!(result.algorithm.toLowerCase()=="new"||result.algorithm.toLowerCase()=="old")){
      promptPrimeSearch();
    }else{
      console.log("Do you want to log everything in the console? true/false")
      console.log("Logging in console is the only way to track the progress mid-way, but it will slow down the process a bit")
      prompt.get({name:"logConsole",type:"boolean",required:true},function(err,result2){
        switch(result.algorithm.toLowerCase()){
          case "new":
          newPrimeSearch(result2.logConsole);
          break;
          case "old":
          promptPrimeTest(result2.logConsole);
          break;
          default:
          promptPrimeSearch();
        }
      })
    }
  })
}

function newPrimeSearch(logConsole){
  console.log("Type the maximum number to check")
  prompt.get({name:"MaxNo",type:"integer",required:true},function(err,result){
    var testArray = []
    var primes = []
    var startTime = new Date()
    console.log("Generating searchable array...")
    for(i=1;i<=result.MaxNo;i++){
      if(i!==1){
        if(i%2!==0||i===2){
          testArray.push(i)
        }
      }
    }
    var arrayFinishedTime = new Date()
    console.log("Testing has started...")
    var isPrime;
    testArray.forEach(function(value,index){
      isPrime = true
      for(i=0;primes[i]<=(value/2)&&isPrime == true;i++){
        if(value%primes[i]===0){
          isPrime = false
        }
      }
      if(isPrime){
        if(logConsole){console.log(value+" is a prime")}
        primes.push(value)
      }
    })
    var testTime = new Date()
    var name = "./primeResults/primes1--"+result.MaxNo+".json"
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
    var primePercentage = primes.length/(result.MaxNo-2)
    primePercentage = Math.round(primePercentage*10000)/100
    calcModulus = calculateModulus(1,result.MaxNo)
    operationsPush.type="newSearch"
    operationsPush.timeString = timeString
    operationsPush.primePercentage = primePercentage
    operationsPush.range = {min:1,max:result.MaxNo,totalNumbers:result.MaxNo-2,numbersToCheck:calcModulus.numbers}
    var operationsPushed = operationsCalculations
    operationsPushed.operations.unshift(operationsPush)
    fs.writeFileSync('operations.json',JSON.stringify(operationsPushed))
    var operationsPushFinished = new Date()

    console.log("From 1 to "+result.MaxNo+", there are "+primes.length+" primes. That is "+primePercentage+"% of the numbers tested")
    console.log("All those primes are saved to '"+name+"' in the primeResults folder")
    console.log("Started @"+startTime.toLocaleTimeString()+", array generation finished @"+arrayFinishedTime.toLocaleTimeString()+", prime test finished @"+testTime.toLocaleTimeString()+", and write time finished @"+finishedTime.toLocaleTimeString()+". The aftercalculations finished @"+operationsPushFinished.toLocaleTimeString())
    console.log("The modulus calculations took a total of "+hrs+":"+mins+":"+secs+"."+ms)
    startPrompt()
  })
}

function promptPrimeTest(logConsole){
  console.log("Type the number range to test")
  prompt.get([{name:"MinNo",type:"integer",required:true},{name:"MaxNo",type:"integer",required:true}],function(err,result){
    var testArray = []
    var primes = []
    var startTime = new Date()
    console.log("Generating searchable array...")

    for(i=result.MinNo;i<=result.MaxNo;i++){
      if(i!==1){
        if(i%2!==0||i===2){
          testArray.push(i)
        }
      }
    }
    console.log("Testing has started...")
    var arrayFinishedTime = new Date()
    testArray.forEach(function(value,index){
      if(isPrime(value)){
        if(logConsole){console.log(value+" is a prime")}
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
    operationsPush.type="oldSearch"
    operationsPush.timeString = timeString
    operationsPush.primePercentage = primePercentage
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
  var numbers = 0
  for(i=min;i<=max;i++){
    if(i!==1){
      if(i%2!==0||i===2){
        numbers++
      }
    }
  }
  return {numbers:numbers,min:min,max:max}
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
