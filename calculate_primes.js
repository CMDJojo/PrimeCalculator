//calculate_primes.js V2.0
//©Jonathan Widén 2017
//Please install node.js and the npm:s Prompt and FS before using this
try{
  var prompt = require("prompt")
}catch(err){
  console.log("Please install the Node-Package-Module (NPM) prompt first")
  console.log("Do 'npm install prompt'")
  process.exit(0)
}
try{
  var fs = require("fs")
}catch(err){
  console.log("Please install the Node-Package-Module (NPM) fs first")
  console.log("Do 'npm install fs'")
  process.exit(0)
}

var dir = './primeResults';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

function userPrompt(){
  prompt.message="Prime Calculator -> console"
  console.log("What do you want to do?")
  console.log("  ·you can SEARCH a number range for primes")
  //console.log("  ·you can FIND a requested amount of primes")
  prompt.get({name:"Action"},function(err,result){
    switch(result.Action.toLowerCase()){
      case "search":
      searchPrompt(1)
      break;
      case "find":
      findPrompt(1)
      break;
      default:
      userPrompt()
    }
  })
}

function searchPrompt(step,input){
  prompt.message="Prime Calculator -> search -> setup"
  if(step===1){
    console.log("Set the maximum range for the search")
    prompt.get({name:"MaxRange",type:"integer",required:true,message:"Must be a number greater than 1",minimum:2},function(err,result){
      searchPrompt(2,result.MaxRange)
    })
  }else if(step===2){
    console.log("Do you want to log the results in the console in real-time?")
    console.log("This will make everything take MUCH LONGER TIME")
    console.log("NOT RECOMMENDED")
    console.log("true to log everything in chat meanwhile, false to log everything afterwards, leave blank to not log at all")
    prompt.get({name:"logMode",type:"boolean"},function(err,result){
      var memorySafe = (input>=50000000)
      if(result.logMode===true){
        execSearch(input,true,false,memorySafe)
      }else if(result.logMode===false){
        execSearch(input,false,true,memorySafe)
      }else{
        execSearch(input,false,false,memorySafe)
      }
    })
  }
}

function execSearch(maxNo,logMeanwhile,logAfter,memorySafe){
  if(memorySafe){
    console.log("Memory-safe search function has been activated. That means that the saving will take longer time, to prevent crashes")
  }
  var time = {startTime:new Date()};
  time.arrayTime = new Date();
  console.log("["+time.startTime.toLocaleTimeString()+"] Prime tests has started...")

  //CORE CODE START
  var primes = [];
  for(l=2;l<=maxNo;l++){
    var isPrime=true;
    for(i=0;primes[i]*primes[i]<=l&&isPrime===true;i++){
      if(l%primes[i]===0){
        isPrime=false;
      }
    }
    if(isPrime){
      if(logMeanwhile){console.log(l+" is a prime")}
      primes.push(l)
    }
  }
  //CORE CODE END

  time.modTime = new Date();
  console.log("["+time.modTime.toLocaleTimeString()+"] Writing has started...")
  var name = "./primeResults/primesUpTo"+maxNo+".json";
  fs.writeFileSync(name,"[")
  var appendValue = "";
  var appendsInBatch = 0;
  var totalAppends = 0;
  if(memorySafe){
    primes.forEach(function(valueToApp,index){
      appendValue+=valueToApp
      appendsInBatch++
      if(index+1!==primes.length){
        appendValue+=","
      }
      if(appendsInBatch>=1000000){
        fs.appendFileSync(name,appendValue)
        appendValue=""
        appendsInBatch=0
        totalAppends++
        console.log("Saving... "+(1000000*totalAppends)+"/"+primes.length)
      }
    })
    fs.appendFileSync(name,appendValue)
    fs.appendFileSync(name,"]")
    console.log("Saving... "+primes.length+"/"+primes.length)
    console.log("Saving... Success!")
    appendValue="";
  }else{
    fs.writeFileSync(name,JSON.stringify(primes))
    console.log("Saving... Success!")
  }

  time.finished = new Date()
  var modulusTime = time.modTime-time.arrayTime
  var modulusTimeString = msToString(modulusTime)
  var totalTime = time.finished-time.startTime
  var totalTimeString = msToString(totalTime)
  var primePercentage = primes.length/(maxNo)
  primePercentage = Math.round(primePercentage*10000)/100
  if(logAfter){
    primes.forEach(function(value){
      console.log(value+" is a prime")
    })
  }
  console.log("")
  console.log("["+time.finished.toLocaleTimeString()+"] CALCULATIONS HAS FINISHED")
  console.log("Results:")
  console.log(primes.length+" primes were found up to "+maxNo)
  console.log(primePercentage+"% of all searched numbers were primes")
  console.log("Total time taken was "+totalTimeString+" ("+totalTime+"ms)")
  console.log("Time taken for modulus operations was "+modulusTimeString+" ("+modulusTime+"ms)")
  console.log("All primes has been saved to "+name)
  console.log("The script has ended.")
  process.exit(0)
}

function findPrompt(step,input){
  prompt.message="Prime Calculator -> find -> setup"
  if(step===1){
    console.log("How many primes do you want to find?")
    prompt.get({name:"FindNo",type:"integer",required:true,message:"Must be a number greater than 1",minimum:2},function(err,result){
      findPrompt(2,result.FindNo)
    })
  }else if(step===2){
    console.log("Do you want to log the results in the console in real-time?")
    console.log("This will make everything take MUCH LONGER TIME")
    console.log("NOT RECOMMENDED")
    console.log("true to log everything in chat meanwhile, false to log everything afterwards, leave blank to not log at all")
    prompt.get({name:"logMode",type:"boolean"},function(err,result){
      var memorySafe = (input>=1000000)
      if(result.logMode===true){
        execFind(input,true,false,memorySafe)
      }else if(result.logMode===false){
        execFind(input,false,true,memorySafe)
      }else{
        execFind(input,false,false,memorySafe)
      }
    })
  }
}

function execFind(findNo,logMeanwhile,logAfter,memorySafe){
  console.log("The FIND function is not coded yet.")
  console.log("Inputs: "+findNo+logMeanwhile+logAfter+memorySafe)
  userPrompt()
}

function msToString(s){
  var ms = ("00"+(s % 1000)).slice(-3)
  s = (s - ms) / 1000;
  var secs = ("0"+(s % 60)).slice(-2)
  s = (s - secs) / 60;
  var mins = ("0"+(s % 60)).slice(-2)
  var hrs = ("0"+((s - mins) / 60)).slice(-2)
  var timeString = hrs+":"+mins+":"+secs+"."+ms
  return timeString
}

userPrompt()
