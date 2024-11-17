const http=require("http");
const fs=require("fs");
const requests=require("requests");

const homefile=fs.readFileSync('home.html','utf-8');

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server=http.createServer((req,res)=>
{
    if(req.url=="/")
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Dhampur&units=metric&appid=05d378fd2c8b7e3173609ffb75b0c7c6')
        .on('data', function (chunk) {
           const arrData=[JSON.parse(chunk)];
           const realTimeData = arrData
          .map((val) => replaceVal(homefile, val))
          .join("");
            res.write(realTimeData);
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
    }
    else
    {
        res.end("File not Found");
    }
});

server.listen( 8000,"127.0.0.1")