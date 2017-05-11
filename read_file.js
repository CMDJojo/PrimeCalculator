try{
  var fs = require("fs")
}catch(err){
  console.log("Please install the Node-Package-Module (NPM) fs first")
  console.log("Do 'npm install fs'")
  process.exit(0)
}
try{
  var prompt = require("prompt")
}catch(err){
  console.log("Please install the Node-Package-Module (NPM) prompt first")
  console.log("Do 'npm install prompt'")
  process.exit(0)
}
try{
  var colors = require("prompt/node_modules/colors")
}catch(err){
  try{
    var colors = require("colors")
  }catch(err){
    console.log("Please install the Node-Package-Module (NPM) colors first")
    console.log("Do 'npm install colors'")
    process.exit(0)
  }
}
try{
  var StreamArray = require("stream-json/utils/StreamArray")
}catch(err){
  console.log("Please install the Node-Package-Module (NPM) stream-json first")
  console.log("Do 'npm install stream-json'")
  process.exit(0)
}
var stream = StreamArray.make()

var dir = './percentageResults';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var rootFiles = []
var fileToLoad = ""
var fileData = []
var fileRead = false
var logProgress = false
var clocks = {}

colors.setTheme({
  logTime:["magenta","bold"],
  time:["magenta","bold"],
  messageDecimileter:"dim",
  messageMain:"blue",
  messageSecond:"cyan",
  messageThird:"white",
  success:["green","bold"],
  file:"bold",
  percentage:"white",
  number:"white",
  warning:"red",
  error:["bgRed","black","bold"],
  alternative:["bold","inverse"]
})

function promptFile(){
  console.log("Please input a file containing a json array with primes")
  console.log("Select file:")
  rootFiles=[]
  fs.readdirSync("./primeResults/").forEach(function(value,index){
    if(value.includes(".json")){
      rootFiles.push(value)
      console.log("[".number+rootFiles.indexOf(value).toString().number+"]".number+" "+value.file)
    }
  })

  prompt.message="read_file.js".messageMain+" -> ".messageDecimileter+"setup".messageSecond

  prompt.get({name:"IndexNo",required:true},function(err,result){
    if(isNaN(result.IndexNo)||result.IndexNo<0||result.IndexNo>=rootFiles.length){
      console.log("")
      console.log("ERROR:".error+" Must be an "+"INTEGER".bold+" between "+"0".number+" and "+(rootFiles.length-1).toString().number)
      promptFile()
    }else{
      fileToLoad=rootFiles[result.IndexNo]
      clocks.startStream = new Date();
      console.log("[".logTime+clocks.startStream.toLocaleTimeString().logTime+"]".logTime+" Loading "+fileToLoad.file+"...")
      fs.createReadStream("./primeResults/"+fileToLoad).pipe(stream.input)
      setInterval(function(){logProgress=true},10000)
    }
  })
}

function fileActions(){
  console.log("")
  console.log("What do you want to do?")
  console.log("  ·you can "+"LIST".alternative+" all primes,")
  console.log("  ·you can "+"CALCULATE PERCENTAGES".alternative+" for ranges in the file,")
  console.log("  ·you can get "+"STATISTICS".alternative+" for the file")
  prompt.message="read_file.js".messageMain+" -> ".messageDecimileter+"file".messageSecond+" -> ".messageDecimileter+"action".messageThird
  prompt.get({name:"Action",required:true},function(err,result){
    switch(result.Action.toLowerCase()){
      case "list":
        console.log("listing...".dim)
        console.log(fileData)
        fileActions()
      break;
      case "calculate percentages":
      case "calculatepercentages":
      case "calculate":
      case "percentages":
        calcRangesPrompt(0)
      break;
      case "statistics":
        fileData.sort(function(a, b){return a-b})
        var minNum = fileData[0]
        var maxNum = fileData[fileData.length-1]
        var range = maxNum - minNum + 1
        var length = fileData.length
        var percentage = length/range
        percentage = Math.round(percentage*10000)/100
        console.log("The file contains a range of "+range.toString().number+" numbers, it contains "+length.toString().number+" entries. "+percentage.toString().number+"%".number+" of the number range is in the array.")
        fileActions()
      break;
      case "quit":
        process.exit(0)
      break;
      default:
        console.log("ERROR!".error+" Invalid action!")
        fileActions()
    }
  })
}

function calcRangesPrompt(status,input){
  prompt.message="read_file.js".messageMain+" -> ".messageDecimileter+"calculateRanges".messageSecond+" -> ".messageDecimileter+"setup".messageThird
  switch(status){
    case 0:
    console.log("")
    console.log("Now, this script will calculate how many percent in each range that is primes.")
    console.log("How big should each range be?")
    prompt.get({name:"rangeSize",required:true},function(err,result){
      if(isNaN(result.rangeSize)||result.rangeSize<1){
        console.log("ERROR!".error+" Must be an "+"INTEGER".bold+" greater than "+"1".number)
        calcRangesPrompt(0)
      }else{
        calcRangesPrompt(1,{rangeSize:result.rangeSize})
      }
    })
    break;
    case 1:
    console.log("")
    console.log("How many ranges (each are "+input.rangeSize.toString().number+") should be processed?")
    prompt.get({name:"ranges",required:true},function(err,result){
      if(isNaN(result.ranges)||result.ranges<1){
        console.log("ERROR!".error+" Must be an "+"INTEGER".bold+" greater than "+"1".number)
        calcRangesPrompt(1,input)
      }else{
        calcRangesPrompt(2,{rangeSize:input.rangeSize,ranges:result.ranges})
      }
    })
    break;
    case 2:
    console.log("")
    console.log("Optional! How many ranges should be skipped before starting the calculations?")
    prompt.get("skip",function(err,result){
      if(!(result.skip==""||result.skip==undefined)&&(isNaN(result.skip)||parseInt(result.skip)<1||parseInt(result.skip)>=parseInt(input.ranges))){
        console.log("ERROR!".error+" Must be an "+"INTEGER".bold+" greater than "+"1".number+" but less than "+input.ranges.toString().number)
        calcRangesPrompt(2,input)
      }else if(!(result.skip==""||result.skip==undefined)){
        console.log("Result will be presentet as: rangeNo_primePercent where first range has rangeNo of 0")
        execCalcRanges({rangeSize:input.rangeSize,ranges:input.ranges,skip:result.skip})
      }else{
        execCalcRanges({rangeSize:input.rangeSize,ranges:input.ranges,skip:0})
      }
    })
  }
}

function execCalcRanges(input){
  //input.rangeSize, input.ranges, input.skip
  clocks.execCalc = {start:new Date()}
  var y=0
  var ranges=[]
  var i = input.skip
  for(var i=parseInt(input.skip);i<input.ranges;i++){
    var minValue = i*input.rangeSize;
    var maxValue = (i+1)*input.rangeSize;
    var pushValue = {range:{minValue:minValue,maxValue:maxValue,range:input.rangeSize}}
    var primes = []
    if(fileData[y]<minValue){
      for(y=0;fileData[y]<minValue;y++){
        console.log("skipping...")
      }
    }
    for(a=0;fileData[y]<=maxValue;y++){
      primes.push(fileData[y])
      a++
    }

    var primePercentage=a/input.rangeSize
    primePercentage = Math.round(primePercentage*10000)/100
    pushValue.primes = primes.length
    pushValue.percentage = primePercentage
    ranges[i]=(pushValue)
    var percentage = primePercentage.toString().replace(".",",")
    console.log(i+"_"+percentage)
  }
  var fileName = "./percentageResults/percentage"+input.rangeSize+"*"+(parseInt(input.ranges)-parseInt(input.skip))+".json"
  fs.writeFileSync(fileName,JSON.stringify(ranges))
  console.log("Success!".success+" File written!")
  setTimeout(function(){fileActions()},2000)
}

stream.output.on("data", function(object){
  //object.value and object.index
  fileData.push(object.value)
  if(logProgress){
    console.log("Last entry read was "+object.value.toString().number+". When that reaches the highest number in the file, the read is complete")
    logProgress = false
  }
});
stream.output.on("end", function(){
  clocks.fileRead = new Date();
  console.log("[".logTime+clocks.fileRead.toLocaleTimeString().logTime+"]".logTime+" File read.".success)
  var timeString = msToString(clocks.fileRead-clocks.startStream)
  console.log("File read took "+timeString.time)
  clearInterval()
  fileRead = true;
  fileActions()
});

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

promptFile()
