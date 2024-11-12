require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: true }));
const shortid = require("shortid");
const dns = require("dns");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const map1 = new Map();
app.post('/api/shorturl', function(req, res) {
  console.log(req.body.url);
  console.log(req.params);
  console.log(req.query);
 
  const  url  = req.body.url;
  const urlPattern = /^(http|https):\/\/[^ "]+$/;

  // Validate URL
  if (!urlPattern.test(url)) {
    return res.json({ error: "Invalid URL" });
  }
  console.log("12345");
  const hostname = new URL(url).hostname;
  dns.lookup(hostname, (err) => {
    if (err) return res.json({ error: "Invalid Hostname" });

    const shortUrlCode = shortid.generate();
    map1.set(url,shortUrlCode);
    
    res.json({ original_url:url, short_url: shortUrlCode });
    
  });
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrlCode = req.params.shortUrl;
  console.log(shortUrlCode);
  let a = 0;
  let b = '';
  map1.forEach((value,key)=>{
    if(value === shortUrlCode)
    {
      console.log("yes");
      a = 1;
      b=key;
      
    }
    else{
      console.log("no");
      
    }
  })
  if(a==1)
    {
      res.redirect(b);
    }
    else{
      res.json({ error: "No short URL found" });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
